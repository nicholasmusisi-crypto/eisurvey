// Shared Firebase config for the Cheerful Giving fundraiser entry + dashboard pages.
export const firebaseConfig = {
  apiKey: "AIzaSyCZI49qqOH0VqcP6oc1dMZ31pGwn9ZX0RQ",
  authDomain: "cheerful-giving.firebaseapp.com",
  databaseURL: "https://cheerful-giving-default-rtdb.firebaseio.com",
  projectId: "cheerful-giving",
  storageBucket: "cheerful-giving.firebasestorage.app",
  messagingSenderId: "466216421880",
  appId: "1:466216421880:web:21a293d8257de850b32e0d"
};

// Primary currency — drives the main dashboard total, goal bar and stats.
export const CURRENCY = "UGX";

// Currencies selectable on the entry form. Anything else can still be typed
// in via "Other…". Any currency besides the primary one gets its own green
// total card on the dashboard and its own section in the report.
export const CURRENCIES = ["UGX", "USD", "EUR", "GBP", "KES"];

// Last year's total (primary currency). The dashboard throws a one-time
// confetti/balloons celebration the moment this year's total overtakes it.
export const PREVIOUS_YEAR_TOTAL = 102000000;

// Access-level PINs. These are a soft deterrent, not real security —
// don't share the entry-page link publicly, and change these before the event.
export const ENTRY_PIN = "2026";   // Add / self-correct gifts on the entry page
export const ADMIN_PIN = "3040";   // View category breakdown on the dashboard
export const MANAGE_PIN = "9090";  // Everything: entry + category view + goal + reset

// Giving categories from the "ORDER OF THE GIVING" sheet, grouped and kept
// in event order (the sequence categories are called to give). The entry
// form shows Category (group) then Sub-category (item). The first group had
// no heading in the sheet, so it's named "Leadership" here.
// Corrections applied from the source sheet: duplicate #11 renumbered,
// duplicate "Worship Team" removed, spelling fixes (Older Sons, Friends).
export const CATEGORY_GROUPS = [
  {
    name: "Leadership",
    items: [
      "Bishop and Pastor Diana",
      "Mengo Pastors",
      "Pastors of the Church Plants",
      "Children's Church"
    ]
  },
  {
    name: "Mengo Church",
    items: [
      "Pr Jacque's Missional Family",
      "Pr Erinah's Missional Family",
      "Pr William's Missional Family",
      "Pr Dennis/Martin/David Missional Family",
      "Pr Ivy's Missional Family",
      "Pr Bonny's Missional Family",
      "Generations"
    ]
  },
  {
    name: "Location Churches",
    items: [
      "Nations Church Makerere",
      "Nations Church Kyambogo",
      "Streams of Life Matugga",
      "Streams of Life Nakawuka",
      "Streams of Life Bulenga",
      "Streams of Life Nakaseke",
      "Streams of Life Masindi, Isagara",
      "Streams of Life Kitagobwa",
      "Streams of Life Matendo",
      "Streams of Life Kyengera"
    ]
  },
  {
    name: "Guests – Partners",
    items: [
      "Older Sons of the Ministry",
      "Younger Sons of the Ministry",
      "Friends to Bishop & the Ministry",
      "Praying Wives",
      "Soul Seed",
      "CAPRO",
      "Diaspora",
      "Business Community"
    ]
  },
  {
    name: "Arms of the Ministry",
    items: [
      "Mengo Treasury",
      "Makerere Treasury",
      "Kyambogo Treasury",
      "Light House Treasury",
      "Church Planting Treasury",
      "Soul Winning Treasury"
    ]
  },
  {
    name: "Nyongeza for Yesu",
    items: [
      "Daughters of Valor",
      "Men Connect",
      "Great Woman",
      "Worship Team",
      "Harpazol / Soul Winners",
      "Others Who Are Interested to Sow"
    ]
  }
];

// Flat list of all sub-categories, derived in event order.
export const CATEGORIES = CATEGORY_GROUPS.flatMap(g => g.items);

// Per-sub-category targets, in the primary currency (UGX), from the
// "ORDER OF THE GIVING" targets sheet. A sub-category listed here gets a
// progress bar on the dashboard/report; anything absent (e.g. "Others Who
// Are Interested to Sow", which has no target in the sheet) just shows its
// running total.
export const CATEGORY_TARGETS = {
  "Bishop and Pastor Diana": 15000000,
  "Mengo Pastors": 24000000,
  "Pastors of the Church Plants": 20000000,
  "Children's Church": 2500000,
  "Pr Jacque's Missional Family": 2000000,
  "Pr Erinah's Missional Family": 8000000,
  "Pr William's Missional Family": 6000000,
  "Pr Dennis/Martin/David Missional Family": 6000000,
  "Pr Ivy's Missional Family": 10000000,
  "Pr Bonny's Missional Family": 20000000,
  "Generations": 2000000,
  "Nations Church Makerere": 10000000,
  "Nations Church Kyambogo": 1000000,
  "Streams of Life Matugga": 3000000,
  "Streams of Life Nakawuka": 500000,
  "Streams of Life Bulenga": 1000000,
  "Streams of Life Nakaseke": 1000000,
  "Streams of Life Masindi, Isagara": 500000,
  "Streams of Life Kitagobwa": 300000,
  "Streams of Life Matendo": 1000000,
  "Streams of Life Kyengera": 1000000,
  "Older Sons of the Ministry": 10000000,
  "Younger Sons of the Ministry": 5000000,
  "Friends to Bishop & the Ministry": 20000000,
  "Praying Wives": 15000000,
  "Soul Seed": 1000000,
  "CAPRO": 500000,
  "Diaspora": 2000000,
  "Business Community": 5000000,
  "Mengo Treasury": 5000000,
  "Makerere Treasury": 1000000,
  "Kyambogo Treasury": 500000,
  "Light House Treasury": 2000000,
  "Church Planting Treasury": 2000000,
  "Soul Winning Treasury": 2000000,
  "Daughters of Valor": 500000,
  "Men Connect": 1000000,
  "Great Woman": 1000000,
  "Worship Team": 500000,
  "Harpazol / Soul Winners": 500000
  // "Others Who Are Interested to Sow" intentionally has no target.
};
