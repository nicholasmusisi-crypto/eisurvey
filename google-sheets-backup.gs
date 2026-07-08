// Cheerful Giving — Google Sheets backup + dashboard script
//
// This runs inside Google Apps Script (script.google.com), NOT on the
// website. It polls the Firebase Realtime Database every few minutes and:
//   1. Writes a full copy of all donations into a "Donations" tab
//      (an independent backup, in case anything goes wrong with the
//      live dashboard or Firebase).
//   2. Builds a "Dashboard" tab with totals, goal progress, gift count,
//      largest gift, per-currency totals, and a category breakdown
//      against each category's target — a Sheets-native mirror of the
//      web dashboard, usable as a fallback if the site is unavailable.
//
// SETUP (one-time, ~5 minutes):
// 1. Go to https://sheets.google.com and create a new blank spreadsheet
//    (e.g. name it "Cheerful Giving Backup").
// 2. In the Sheet, go to Extensions > Apps Script.
// 3. Delete the placeholder code and paste this whole file in.
// 4. In the function dropdown at the top, select "syncDonations" and
//    click Run. The first run will ask you to authorize the script —
//    approve it (it only reads from the public Firebase URL below).
// 5. Then select "createTrigger" and click Run once — this sets up an
//    automatic sync every 5 minutes. (You only need to do this once;
//    after that it keeps running on its own — no need to re-run this
//    if you already set the trigger up before.)
// 6. Go back to the Sheet — "Donations", "Config", and "Dashboard"
//    tabs should populate within a few minutes.
//
// If the real category list or targets on the website (firebase-config.js)
// ever change, update CATEGORY_TARGETS below to match — this script keeps
// its own copy since Apps Script can't import the site's JS module.
//
// If you ever lock down the Firebase security rules (recommended before
// the 30-day test-mode window expires), this script will need read
// access preserved, or a Firebase read token added to the fetch calls.

const FIREBASE_URL = 'https://cheerful-giving-default-rtdb.firebaseio.com';
const CURRENCY = 'UGX';

const CATEGORY_TARGETS = {
  'Bishop & Pr Diana': 10000000,
  'Mengo Pastors': 24000000,
  'Location Pastors': 18000000,
  'Location churches': 15000000,
  'Mengo MFs': 52000000,
  'Generations': 2000000,
  "Children's church": 2500000,
  'Diaspora': 2000000,
  'Biz Category': 5000000,
  'Older Sons of the Ministry': 10000000,
  'Younger Sons of the Ministry': 2500000,
  "Bishop's Friends": 5000000,
  'Couples wedded at church (non members)': 1000000,
  'Makerere Treasury': 1000000,
  'Mengo Treasury': 5000000,
  'Kyambogo Treasury': 500000,
  'Church Planting Treasury': 2000000,
  'Harpazol': 2000000,
  'Light House Treasury': 2000000,
  'Soul Seed': 2500000,
  'Home Comers': 2500000
  // "Praying wives" intentionally has no target, same as the website.
};

function fmt_(n){ return Math.round(n).toLocaleString('en-US'); }

function syncDonations(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const data = JSON.parse(UrlFetchApp.fetch(FIREBASE_URL + '/donations.json').getContentText());
  const list = data ? Object.values(data) : [];
  const goal = JSON.parse(UrlFetchApp.fetch(FIREBASE_URL + '/config/goal.json').getContentText()) || 0;

  writeDonationsTab_(ss, list);
  writeConfigTab_(ss, goal);
  writeDashboardTab_(ss, list, goal);
}

function writeDonationsTab_(ss, list){
  const sheet = ss.getSheetByName('Donations') || ss.insertSheet('Donations');
  sheet.clear();
  const headers = ['Timestamp', 'Giver Name', 'Amount', 'Currency', 'Method', 'Category', 'Note', 'Entered By'];
  sheet.appendRow(headers);

  const rows = list.slice()
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .map(d => [
      d.timestamp ? new Date(d.timestamp) : '',
      d.giverName || 'Anonymous',
      d.amount || 0,
      d.currency || CURRENCY,
      d.method || '',
      d.category || '',
      d.note || '',
      d.enteredBy || ''
    ]);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function writeConfigTab_(ss, goal){
  const configSheet = ss.getSheetByName('Config') || ss.insertSheet('Config');
  configSheet.clear();
  configSheet.appendRow(['Goal', goal || '']);
  configSheet.appendRow(['Last synced', new Date()]);
}

function writeDashboardTab_(ss, list, goal){
  const dash = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  dash.clear();

  const byCurrency = {};
  list.forEach(d => {
    const cur = d.currency || CURRENCY;
    (byCurrency[cur] = byCurrency[cur] || []).push(d);
  });
  const primaryList = byCurrency[CURRENCY] || [];
  const primaryTotal = primaryList.reduce((s, d) => s + (Number(d.amount) || 0), 0);

  let row = 1;
  const title = dash.getRange(row, 1, 1, 2);
  title.merge();
  dash.getRange(row, 1).setValue('🎁 Cheerful Giving — Dashboard').setFontSize(16).setFontWeight('bold');
  row += 2;

  const stat = (label, value) => {
    dash.getRange(row, 1).setValue(label).setFontWeight('bold');
    dash.getRange(row, 2).setValue(value);
    row++;
  };
  stat('Total raised (' + CURRENCY + ')', CURRENCY + ' ' + fmt_(primaryTotal));
  stat('Goal', goal ? CURRENCY + ' ' + fmt_(goal) : 'Not set');
  if (goal > 0) {
    dash.getRange(row, 1).setValue('Progress').setFontWeight('bold');
    dash.getRange(row, 2).setValue(Math.min(1, primaryTotal / goal)).setNumberFormat('0.0%');
    row++;
  }
  stat('Total gifts (all currencies)', list.length);
  stat('Largest gift (' + CURRENCY + ')', primaryList.length ? CURRENCY + ' ' + fmt_(Math.max(...primaryList.map(d => Number(d.amount) || 0))) : '—');
  row++;

  const otherCurrencies = Object.keys(byCurrency).filter(c => c !== CURRENCY).sort();
  if (otherCurrencies.length) {
    dash.getRange(row, 1).setValue('Other currencies').setFontWeight('bold').setFontSize(13);
    row++;
    otherCurrencies.forEach(cur => {
      const l = byCurrency[cur];
      const total = l.reduce((s, d) => s + (Number(d.amount) || 0), 0);
      dash.getRange(row, 1).setValue(cur + ' raised');
      dash.getRange(row, 2).setValue(cur + ' ' + fmt_(total));
      dash.getRange(row, 3).setValue(l.length + ' gift' + (l.length === 1 ? '' : 's'));
      row++;
    });
    row++;
  }

  dash.getRange(row, 1).setValue('By category (' + CURRENCY + ')').setFontWeight('bold').setFontSize(13);
  row++;
  dash.getRange(row, 1, 1, 4).setValues([['Category', 'Gifts', 'Amount', '% of target']]).setFontWeight('bold');
  row++;

  const totals = {}, counts = {};
  primaryList.forEach(d => {
    const cat = d.category || 'Uncategorized';
    totals[cat] = (totals[cat] || 0) + (Number(d.amount) || 0);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const cats = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
  cats.forEach(c => {
    const target = CATEGORY_TARGETS[c];
    dash.getRange(row, 1).setValue(c);
    dash.getRange(row, 2).setValue(counts[c]);
    dash.getRange(row, 3).setValue(CURRENCY + ' ' + fmt_(totals[c]));
    if (target) {
      dash.getRange(row, 4).setValue(Math.min(1, totals[c] / target)).setNumberFormat('0.0%');
    } else {
      dash.getRange(row, 4).setValue('—');
    }
    row++;
  });

  dash.getRange(row, 1).setValue('Last synced: ' + new Date().toLocaleString()).setFontColor('#888888').setFontSize(9);
  dash.autoResizeColumns(1, 4);
}

function createTrigger(){
  // Removes any existing sync triggers first, so re-running this doesn't
  // create duplicates.
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'syncDonations') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('syncDonations')
    .timeBased()
    .everyMinutes(5)
    .create();
}
