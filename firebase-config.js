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

// Access-level PINs. These are a soft deterrent, not real security —
// don't share the entry-page link publicly, and change these before the event.
export const ENTRY_PIN = "2026";   // Add / self-correct gifts on the entry page
export const ADMIN_PIN = "3040";   // View category breakdown on the dashboard
export const MANAGE_PIN = "9090";  // Everything: entry + category view + goal + reset

// Giving categories, in entry-form order.
export const CATEGORIES = [
  "Bishop & Pr Diama",
  "Mengo Pastors",
  "Location Pastors",
  "Location churches",
  "Mengo MFs",
  "Generations",
  "Children's church",
  "Diaspora",
  "Biz Category",
  "Older Sons of the Ministry",
  "Younger Sons of the Ministry",
  "Bishop's Friends",
  "Couples wedded at church (non members)",
  "Praying wives",
  "Makerere Treasury",
  "Mengo Treasury",
  "Kyambogo Treasury",
  "Church Planting Treasury",
  "Harpazol",
  "Light House Treasury",
  "Soul Seed",
  "Home Comers"
];

// Per-category targets, in the primary currency (UGX). A category with no
// known target (e.g. "Praying wives") is left out — its breakdown row on
// the dashboard just shows the running total with no progress bar.
export const CATEGORY_TARGETS = {
  "Bishop & Pr Diama": 10000000,
  "Mengo Pastors": 24000000,
  "Location Pastors": 18000000,
  "Location churches": 15000000,
  "Mengo MFs": 52000000,
  "Generations": 2000000,
  "Children's church": 2500000,
  "Diaspora": 2000000,
  "Biz Category": 5000000,
  "Older Sons of the Ministry": 10000000,
  "Younger Sons of the Ministry": 2500000,
  "Bishop's Friends": 5000000,
  "Couples wedded at church (non members)": 1000000,
  "Makerere Treasury": 1000000,
  "Mengo Treasury": 5000000,
  "Kyambogo Treasury": 500000,
  "Church Planting Treasury": 2000000,
  "Harpazol": 2000000,
  "Light House Treasury": 2000000,
  "Soul Seed": 2500000,
  "Home Comers": 2500000
};
