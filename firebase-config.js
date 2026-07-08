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

// Giving categories — replace these placeholders once the real list of 22 is shared.
export const CATEGORIES = Array.from({ length: 22 }, (_, i) => `Category ${i + 1}`);
