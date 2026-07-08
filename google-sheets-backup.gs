// Cheerful Giving — Google Sheets backup script
//
// This runs inside Google Apps Script (script.google.com), NOT on the
// website. It polls the Firebase Realtime Database every few minutes and
// writes a full copy of all donations into this spreadsheet, so there's
// always an independent backup even if something goes wrong with the
// live dashboard or Firebase.
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
//    after that it keeps running on its own.)
// 6. Go back to the Sheet — you should see a "Donations" tab and a
//    "Config" tab populate with data within a few minutes.
//
// If you ever lock down the Firebase security rules (recommended before
// the 30-day test-mode window expires), this script will need read
// access preserved, or a Firebase read token added to the fetch calls.

const FIREBASE_URL = 'https://cheerful-giving-default-rtdb.firebaseio.com';

function syncDonations(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const sheet = ss.getSheetByName('Donations') || ss.insertSheet('Donations');
  sheet.clear();
  const headers = ['Timestamp', 'Giver Name', 'Amount', 'Currency', 'Method', 'Category', 'Note', 'Entered By'];
  sheet.appendRow(headers);

  const response = UrlFetchApp.fetch(FIREBASE_URL + '/donations.json');
  const data = JSON.parse(response.getContentText());

  if (data) {
    const rows = Object.values(data)
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .map(d => [
        d.timestamp ? new Date(d.timestamp) : '',
        d.giverName || 'Anonymous',
        d.amount || 0,
        d.currency || 'UGX',
        d.method || '',
        d.category || '',
        d.note || '',
        d.enteredBy || ''
      ]);
    if (rows.length) {
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
  }

  const configSheet = ss.getSheetByName('Config') || ss.insertSheet('Config');
  configSheet.clear();
  const goalResp = UrlFetchApp.fetch(FIREBASE_URL + '/config/goal.json');
  const goal = JSON.parse(goalResp.getContentText());
  configSheet.appendRow(['Goal', goal || '']);
  configSheet.appendRow(['Last synced', new Date()]);
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
