// Firebase config for the Youth Recruitment ID + Verification tool.
// This is a SEPARATE Firebase project from the fundraiser tools (firebase-config.js).
//
// To set this up:
//  1. Go to https://console.firebase.google.com → Add project (e.g. "eo-youth-id").
//  2. Build → Realtime Database → Create database → start in test mode (region: pick
//     one close to you). Then go to the Rules tab and paste:
//       { "rules": { ".read": true, ".write": true } }
//     (This app has no user accounts — the PINs below are a soft deterrent only,
//     same approach as the fundraiser tools. Don't share the register/admin links publicly.)
//  3. Build → Storage → Get started → start in test mode. Then Rules tab, paste:
//       rules_version = '2';
//       service firebase.storage {
//         match /b/{bucket}/o {
//           match /{allPaths=**} { allow read, write: if true; }
//         }
//       }
//  4. Project settings (gear icon) → General → scroll to "Your apps" → Add app → Web (</>).
//     Register the app, then copy the firebaseConfig object it gives you and paste the
//     values below, replacing the placeholders.
export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  databaseURL: "https://REPLACE_ME-default-rtdb.firebaseio.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.firebasestorage.app",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

// Shown on the ID card header and generated ID codes (e.g. EO26-00001).
export const ORG_NAME = "Experience Educate";
export const ID_PREFIX = "EO";

// Access PINs — soft deterrent, not real security. Change before a live recruitment drive.
export const CAPTURE_PIN = "2026"; // Register a new youth, print ID cards
export const ADMIN_PIN = "3040";   // Search / browse all registered youth

// Districts offered in the registration form dropdown. Add/remove as needed.
export const DISTRICTS = [
  "Kampala", "Wakiso", "Mukono", "Jinja", "Mbale", "Mbarara", "Gulu", "Lira", "Masaka", "Arua"
];
