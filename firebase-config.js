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

// Per-sub-category targets, in the primary currency (UGX). Awaiting the new
// targets list — a sub-category listed here gets a progress bar on the
// dashboard; anything absent just shows its running total.
export const CATEGORY_TARGETS = {};
