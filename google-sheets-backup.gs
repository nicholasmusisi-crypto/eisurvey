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

// Category groups from the "ORDER OF THE GIVING" sheet, kept in event order.
// Must be kept in sync with firebase-config.js on the website.
const CATEGORY_GROUPS = [
  { name: 'Leadership', items: ['Bishop and Pastor Diana', 'Mengo Pastors', 'Pastors of the Church Plants', "Children's Church"] },
  { name: 'Mengo Church', items: ["Pr Jacque's Missional Family", "Pr Erinah's Missional Family", "Pr William's Missional Family", 'Pr Dennis/Martin/David Missional Family', "Pr Ivy's Missional Family", "Pr Bonny's Missional Family", 'Generations'] },
  { name: 'Location Churches', items: ['Nations Church Makerere', 'Nations Church Kyambogo', 'Streams of Life Matugga', 'Streams of Life Nakawuka', 'Streams of Life Bulenga', 'Streams of Life Nakaseke', 'Streams of Life Masindi, Isagara', 'Streams of Life Kitagobwa', 'Streams of Life Matendo', 'Streams of Life Kyengera'] },
  { name: 'Guests – Partners', items: ['Older Sons of the Ministry', 'Younger Sons of the Ministry', 'Friends to Bishop & the Ministry', 'Praying Wives', 'Soul Seed', 'CAPRO', 'Diaspora', 'Business Community'] },
  { name: 'Arms of the Ministry', items: ['Mengo Treasury', 'Makerere Treasury', 'Kyambogo Treasury', 'Light House Treasury', 'Church Planting Treasury', 'Soul Winning Treasury'] },
  { name: 'Nyongeza for Yesu', items: ['Daughters of Valor', 'Men Connect', 'Great Woman', 'Worship Team', 'Harpazol / Soul Winners', 'Others Who Are Interested to Sow'] }
];

// Per-sub-category targets (UGX). Awaiting the new targets list.
const CATEGORY_TARGETS = {};

function groupOfItem_(item){
  const g = CATEGORY_GROUPS.find(g => g.items.indexOf(item) !== -1);
  return g ? g.name : '';
}

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
  const headers = ['Timestamp', 'Giver Name', 'Amount', 'Currency', 'Category', 'Sub-category', 'Entered By'];
  sheet.appendRow(headers);

  const rows = list.slice()
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
    .map(d => [
      d.timestamp ? new Date(d.timestamp) : '',
      d.giverName || 'Anonymous',
      d.amount || 0,
      d.currency || CURRENCY,
      d.categoryGroup || groupOfItem_(d.category) || '',
      d.category || '',
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
  dash.getRange(row, 1, 1, 4).setValues([['Category / Sub-category', 'Gifts', 'Amount', '% of target']]).setFontWeight('bold');
  row++;

  // Accumulate group -> sub-category totals, then write in event order.
  const acc = {};
  primaryList.forEach(d => {
    const item = d.category || 'Uncategorized';
    const group = d.categoryGroup || groupOfItem_(item) || 'Other';
    acc[group] = acc[group] || {};
    acc[group][item] = acc[group][item] || { total: 0, count: 0 };
    acc[group][item].total += Number(d.amount) || 0;
    acc[group][item].count += 1;
  });
  const groupNames = CATEGORY_GROUPS.map(g => g.name).concat(Object.keys(acc).filter(n => !CATEGORY_GROUPS.some(g => g.name === n)));
  groupNames.forEach(name => {
    const itemsAcc = acc[name];
    if (!itemsAcc) return;
    const configItems = (CATEGORY_GROUPS.find(g => g.name === name) || { items: [] }).items;
    const items = configItems.concat(Object.keys(itemsAcc).filter(i => configItems.indexOf(i) === -1))
      .filter(i => itemsAcc[i] && itemsAcc[i].total > 0);
    if (!items.length) return;
    const subtotal = items.reduce((s, i) => s + itemsAcc[i].total, 0);
    const count = items.reduce((s, i) => s + itemsAcc[i].count, 0);
    dash.getRange(row, 1).setValue(name.toUpperCase()).setFontWeight('bold');
    dash.getRange(row, 2).setValue(count).setFontWeight('bold');
    dash.getRange(row, 3).setValue(CURRENCY + ' ' + fmt_(subtotal)).setFontWeight('bold');
    row++;
    items.forEach(i => {
      const target = CATEGORY_TARGETS[i];
      dash.getRange(row, 1).setValue('    ' + i);
      dash.getRange(row, 2).setValue(itemsAcc[i].count);
      dash.getRange(row, 3).setValue(CURRENCY + ' ' + fmt_(itemsAcc[i].total));
      if (target) {
        dash.getRange(row, 4).setValue(Math.min(1, itemsAcc[i].total / target)).setNumberFormat('0.0%');
      } else {
        dash.getRange(row, 4).setValue('—');
      }
      row++;
    });
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
