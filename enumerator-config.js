// Config for the Enumerator Management tool (E!Survey — Educate! Survey Ops).
//
// Backend: a Google Sheet + Apps Script web app you deploy yourself under your
// own free Google account — see the setup steps at the top of
// enumerator-backend.gs, or the Settings tab inside the app once logged in as
// Evaluation Officer. No paid service, no expiring trial account.
//
// Multi-country: each country in COUNTRIES gets its own completely separate
// Google Sheet + Apps Script deployment (its URL is entered once in the app's
// Settings tab, after picking that country) — so data never overlaps between
// countries, the same "one project per event" approach already used for the
// fundraiser tools' Firebase projects. Countries added via the in-app "Add a
// country" box on the picker screen only persist on that one device/browser;
// add them here too if you want them to show up for everyone by default.

export const ORG_NAME = "Educate! — Survey Ops";
// E!EMS = Educate! Enumerator Management System. Shown as the big heading on
// the country picker, login screen, and app header (title bar text pairs it
// with " — E!Survey").
export const APP_TITLE = "E!EMS";

// Access PIN — soft deterrent, not real security, same approach as the other
// tools in this suite (see field-recorder.html, youth-id-config.js). Change
// before real use; don't share this PIN publicly. Gates the Evaluation
// Officer view (add/edit roster, assignments, attendance). Everyone else
// gets the read-only view with no PIN. Shared across all countries for now —
// say the word if you want a separate PIN per country instead.
export const ADMIN_PIN = "3040";

// Enumerator status options, in the order they appear in dropdowns/filters.
// "Deployed" is set automatically when an enumerator is put on an Active
// assignment, and reverts to "Active" automatically once that assignment is
// completed AND a performance rating has been entered for them — it can also
// still be set by hand here if needed.
export const STATUSES = ["Active", "Deployed", "Suspended", "Terminated"];

// Assignment (deployment) status options.
export const ASSIGNMENT_STATUSES = ["Planned", "Active", "Completed", "Cancelled"];

// Attendance status options.
export const ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Excused"];

// Countries offered on the picker screen shown when the app opens. Add more
// here to make them available on every device by default (see note above).
export const COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Rwanda"];

// Country codes used to build Enumerator IDs, e.g. Uganda -> "UG0001". A
// country not listed here (including ones added via "Add a country" on the
// picker) gets a code derived automatically from its name instead.
export const COUNTRY_CODES = { Uganda: "UG", Kenya: "KE", Tanzania: "TZ", Rwanda: "RW" };

// Region/district options per country, offered as suggestions on the Region
// field (typing a name not in the list is still allowed). A country with no
// entry here just gets a free-text field with no suggestions.
export const REGIONS_BY_COUNTRY = {
  Uganda: ["Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Mbarara", "Gulu", "Lira", "Masaka", "Arua"],
  Kenya: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kiambu", "Machakos", "Kakamega", "Meru", "Nyeri"],
  Tanzania: ["Arusha", "Dar es Salaam", "Dodoma", "Mwanza", "Mbeya", "Morogoro", "Tanga", "Kilimanjaro", "Iringa", "Singida"],
  Rwanda: ["Gasabo", "Kicukiro", "Nyarugenge", "Huye", "Muhanga", "Musanze", "Rubavu", "Nyagatare", "Rusizi", "Karongi"]
};
