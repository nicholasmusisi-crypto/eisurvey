// Config for the Enumerator Management tool (E!Survey — Educate! Tanzania Survey Ops).
//
// Backend: a Google Sheet + Apps Script web app you deploy yourself under your
// own free Google account — see the setup steps at the top of
// enumerator-backend.gs, or the Settings tab inside the app once logged in as
// Evaluation Officer. No paid service, no expiring trial account.

export const ORG_NAME = "Educate! Tanzania — Survey Ops";
export const APP_TITLE = "Enumerator Management";

// Access PIN — soft deterrent, not real security, same approach as the other
// tools in this suite (see field-recorder.html, youth-id-config.js). Change
// before real use; don't share this PIN publicly. Gates the Evaluation
// Officer view (add/edit roster, assignments, attendance). Everyone else
// gets the read-only view with no PIN.
export const ADMIN_PIN = "3040";

// Enumerator status options, in the order they appear in dropdowns/filters.
export const STATUSES = ["Active", "Suspended", "Terminated"];

// Assignment (deployment) status options.
export const ASSIGNMENT_STATUSES = ["Planned", "Active", "Completed", "Cancelled"];

// Attendance status options.
export const ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Excused"];

// Regions/locations offered in dropdowns. Add/remove as needed.
export const DISTRICTS = [
  "Arusha", "Dar es Salaam", "Dodoma", "Mwanza", "Mbeya",
  "Morogoro", "Tanga", "Kilimanjaro", "Iringa", "Singida"
];
