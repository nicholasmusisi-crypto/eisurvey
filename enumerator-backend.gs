// E!Survey — Enumerator Management backend.
//
// This runs inside Google Apps Script (script.google.com), NOT on the
// website. It turns a plain Google Sheet into a small free REST API that
// enumerator-management.html reads from and writes to — no paid backend,
// no expiring trial account, just your own Google account and its always-
// free Apps Script + Sheets quota. Same trust model as field-recorder.html's
// existing Google Sheets sync (see the Settings tab there).
//
// SETUP (one-time, ~5 minutes):
// 1. Go to https://sheets.google.com and create a new blank spreadsheet
//    (e.g. name it "Enumerator Management Data"). Three tabs — "Enumerators",
//    "Assignments", "Attendance" — are created automatically the first time
//    data is written; you don't need to add them yourself.
// 2. In the Sheet, go to Extensions > Apps Script.
// 3. Delete the placeholder code and paste this whole file in.
// 4. (Optional but recommended) Set a shared write token: Project Settings
//    (gear icon) > Script Properties > Add script property > name it TOKEN,
//    give it any hard-to-guess value. Then put that same value as the
//    "Write PIN" in the app's Settings tab. If you skip this, anyone with
//    the web app URL could write data — same soft-security tradeoff as the
//    PINs elsewhere in this app suite.
// 5. Deploy > New deployment > type: Web app.
//    Execute as: Me. Who has access: Anyone. Deploy.
//    Authorize when prompted (it only touches this one spreadsheet).
// 6. Copy the web app URL it gives you (ends in /exec) and paste it into
//    the "Apps Script web app URL" field in enumerator-management.html's
//    Settings tab (Evaluation Officer login required).
// 7. Whenever you edit this script, use Deploy > Manage deployments > edit
//    (pencil) > New version, so the live /exec URL picks up the change.

const SHEETS = {
  Enumerators: ['ID', 'Name', 'Gender', 'Phone1', 'Phone2', 'Phone3', 'Email', 'District', 'Status', 'Rating', 'PendingReview', 'DateAdded', 'Notes'],
  Assignments: ['ID', 'EnumeratorID', 'EnumeratorName', 'Location', 'Project', 'Team', 'StartDate', 'EndDate', 'Status', 'Notes'],
  Attendance: ['ID', 'EnumeratorID', 'EnumeratorName', 'Date', 'Status', 'Submissions', 'Notes', 'LoggedAt']
};

function getOrCreateSheet_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(SHEETS[name]);
    sh.getRange(1, 1, 1, SHEETS[name].length).setFontWeight('bold');
  }
  return sh;
}

function sheetToObjects_(sh) {
  const last = sh.getLastRow();
  if (last < 2) return [];
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const rows = sh.getRange(2, 1, last - 1, headers.length).getValues();
  return rows
    .filter(r => r.some(c => c !== ''))
    .map(r => {
      const o = {};
      headers.forEach((h, i) => { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
      return o;
    });
}

function findRowIndexById_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2; // 1-indexed, +1 for header row
  }
  return -1;
}

function checkToken_(d) {
  const required = PropertiesService.getScriptProperties().getProperty('TOKEN');
  if (!required) return true; // no token configured — open, same as other tools in this suite
  return d.token === required;
}

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'ping';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let out;
  if (action === 'getAll') {
    out = {
      status: 'ok',
      enumerators: sheetToObjects_(getOrCreateSheet_(ss, 'Enumerators')),
      assignments: sheetToObjects_(getOrCreateSheet_(ss, 'Assignments')),
      attendance: sheetToObjects_(getOrCreateSheet_(ss, 'Attendance'))
    };
  } else {
    out = { status: 'ok', msg: 'Enumerator Management backend active' };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    if (!checkToken_(d)) {
      return respond_({ status: 'error', msg: 'Invalid token' });
    }
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    switch (d.action) {
      case 'addEnumerator': return respond_(addRow_(ss, 'Enumerators', d.data));
      case 'updateEnumerator': return respond_(updateRow_(ss, 'Enumerators', d.data));
      case 'bulkUpsertEnumerators': return respond_(bulkUpsertEnumerators_(ss, d.data));
      case 'addAssignment': return respond_(addRow_(ss, 'Assignments', d.data));
      case 'updateAssignment': return respond_(updateRow_(ss, 'Assignments', d.data));
      case 'logAttendance': return respond_(upsertAttendance_(ss, d.data));
      default: return respond_({ status: 'error', msg: 'Unknown action: ' + d.action });
    }
  } catch (err) {
    return respond_({ status: 'error', msg: err.message });
  }
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function addRow_(ss, sheetName, data) {
  const sh = getOrCreateSheet_(ss, sheetName);
  const headers = SHEETS[sheetName];
  sh.appendRow(headers.map(h => data[h] !== undefined ? data[h] : ''));
  return { status: 'ok' };
}

function updateRow_(ss, sheetName, data) {
  const sh = getOrCreateSheet_(ss, sheetName);
  const headers = SHEETS[sheetName];
  const rowIdx = findRowIndexById_(sh, data.ID);
  if (rowIdx === -1) return { status: 'error', msg: 'ID not found: ' + data.ID };
  const values = headers.map(h => data[h] !== undefined ? data[h] : sh.getRange(rowIdx, headers.indexOf(h) + 1).getValue());
  sh.getRange(rowIdx, 1, 1, headers.length).setValues([values]);
  return { status: 'ok' };
}

// Bulk roster upload: each item in `list` is upserted by ID (present ->
// update that row, absent -> append). The app assigns IDs client-side before
// sending, since it already needs the current roster loaded to do the
// phone/email matching that decides new vs. existing.
function bulkUpsertEnumerators_(ss, list) {
  const sh = getOrCreateSheet_(ss, 'Enumerators');
  const headers = SHEETS.Enumerators;
  (list || []).forEach(data => {
    const rowIdx = findRowIndexById_(sh, data.ID);
    const values = headers.map(h => data[h] !== undefined ? data[h] : '');
    if (rowIdx === -1) {
      sh.appendRow(values);
    } else {
      sh.getRange(rowIdx, 1, 1, headers.length).setValues([values]);
    }
  });
  return { status: 'ok', count: (list || []).length };
}

// Attendance is one row per enumerator per day — logging again for the same
// enumerator + date overwrites that day's entry instead of duplicating it.
function upsertAttendance_(ss, data) {
  const sh = getOrCreateSheet_(ss, 'Attendance');
  const headers = SHEETS.Attendance;
  const last = sh.getLastRow();
  let rowIdx = -1;
  if (last >= 2) {
    const rows = sh.getRange(2, 1, last - 1, headers.length).getValues();
    for (let i = 0; i < rows.length; i++) {
      const eid = rows[i][headers.indexOf('EnumeratorID')];
      const dt = rows[i][headers.indexOf('Date')];
      const dtStr = dt instanceof Date ? Utilities.formatDate(dt, Session.getScriptTimeZone(), 'yyyy-MM-dd') : dt;
      if (String(eid) === String(data.EnumeratorID) && dtStr === data.Date) { rowIdx = i + 2; break; }
    }
  }
  const values = headers.map(h => data[h] !== undefined ? data[h] : '');
  if (rowIdx === -1) {
    sh.appendRow(values);
  } else {
    sh.getRange(rowIdx, 1, 1, headers.length).setValues([values]);
  }
  return { status: 'ok' };
}
