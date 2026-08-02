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

// Giving categories for today's event. Flat list (no sub-groups), entered
// as a single group so the entry form's Category -> Sub-category structure
// still works without code changes.
export const CATEGORY_GROUPS = [
  {
    name: "Categories",
    items: [
      "Pastors",
      "Worship",
      "Prayer",
      "Youth",
      "Women",
      "Finance",
      "Ushers",
      "Elders/Pastors",
      "Media",
      "Children"
    ]
  }
];

// Flat list of all sub-categories, derived in event order.
export const CATEGORIES = CATEGORY_GROUPS.flatMap(g => g.items);

// No per-category targets for today's event -- each category just shows
// its running total instead of a progress bar.
export const CATEGORY_TARGETS = {};
