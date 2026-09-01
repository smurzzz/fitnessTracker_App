# agent.md

Instructions for an AI coding agent (Claude Code, Cursor, etc.) building **FitTrack**,
a mobile fitness tracking app. Follow this file as the source of truth for scope,
stack, and how to execute tasks in this repo.

## Stack (do not substitute)

- React Native + **Expo** (managed workflow)
- Auth: **Clerk** (`@clerk/clerk-expo`)
- Database: **Firebase Firestore** (offline persistence on)
- Exercise data: **Exercise Database API** (`exercisedb.dev`)
- Sensors: `expo-sensors` (pedometer)
- Navigation: React Navigation
- Build: EAS Build → APK

## Design System

The confirmed visual design lives in `design/` (Stitch export — "FitTrack
Energetic Student System"). Treat `design/fittrack_energetic_student_system/DESIGN.md`
as the source of truth for all colors, typography, spacing, and component
styles — **do not invent your own values**. Each screen folder under
`design/` also has a `screen.png` reference and a `code.html` reference
implementation to match against.

**Key tokens (see DESIGN.md for the full list):**
- Primary: Fresh Teal `#006b5f` — main actions, active nav state
- Secondary/Accent: Coral `#a93349` — motivational highlights, streaks
- Tertiary/Success: Mint Green `#006d36` — completed workouts, positive progress
- Background/Surface: `#f4fbf8`
- Headline font: Plus Jakarta Sans (Bold/ExtraBold)
- Body font: Inter (Regular, SemiBold for emphasis)
- Radius: 16px cards, 12px buttons, 8px badges/chips
- Spacing: 8px base scale, 20px mobile side margins, 32px between sections

**Confirmed screens (exact names, one folder per screen in `design/`):**
`sign_up_login`, `profile_setup`, `dashboard`, `exercise_library`,
`exercise_detail_loaded`, `exercise_detail_loading`, `exercise_detail_offline`,
`log_workout`, `my_goals`, `workout_history`, `profile_settings`

Note the exercise detail screen has **three separate confirmed states**
(loaded / loading / offline) — implement all three, not just the happy path.
The offline state includes a "Queue Download" affordance for when the user
reconnects. Library and dashboard cards also have a small cached-status dot
indicator (see DESIGN.md's "Cached Indicator" component) — implement this
using the same on-device GIF cache check described in the Exercise Library
feature below.



1. Work one task at a time from the **Build Order** below. Don't jump ahead.
2. Before writing a feature, check if a `/lib` wrapper already exists for the
   data access it needs (Firestore, Clerk, exercise API). Create one if not —
   screens/components should never call Firestore or `fetch` directly.
3. After each task, run the app (`npx expo start`) and confirm it renders
   without errors before moving to the next task.
4. Do not add packages outside the stack above without asking first.
5. Do not implement anything under "Out of Scope" unless explicitly told to.

## Features — what the app must do

### 1. Authentication
- User can sign up with email/password via Clerk.
- User can log in / log out.
- Unauthenticated users are redirected to the sign-in screen; authenticated
  users land on the Home/Dashboard screen.
- Session persists across app restarts (Clerk handles this automatically).

### 2. Profile
- On first login, user fills out a profile: height, weight, age, gender, and
  a fitness goal (e.g., lose weight, build muscle, general fitness).
- User can edit their profile later from a Profile/Settings screen.
- Profile data is saved to `users/{userId}` in Firestore.

### 3. Exercise Library
- User can browse a list of exercises (name, thumbnail/GIF, target body part).
- User can search exercises by name.
- User can filter by body part and/or equipment.
- Tapping an exercise opens a detail screen showing: GIF/demo, target muscle,
  secondary muscles, equipment needed, and step-by-step instructions.
- Exercise data is fetched from the Exercise Database API **once**, cached
  into Firestore's `exercises` collection, and read from that cache afterward
  — the app should not hit the live API on every library screen open.
- GIF demo images are loaded lazily via `expo-image` with `cachePolicy="disk"`
  — they are NOT pre-downloaded during the Firestore cache step. This means
  the exercise detail screen needs three states, matching
  `design/exercise_detail_loaded`, `_loading`, and `_offline`:
  1. **Loaded** — GIF plays normally (already viewed before, or online now).
  2. **Loading** — skeleton/shimmer while first fetch completes.
  3. **Offline & uncached** — "Preview unavailable offline" placeholder with
     a "Queue Download" action, per the confirmed design.
- Library and dashboard cards show a small cached-status dot (per DESIGN.md's
  "Cached Indicator" component) reflecting whether that exercise's GIF has
  already been viewed/cached on this device.

### 4. Workout Logging
- From an exercise detail screen (or a general "Log Workout" button), the
  user can log a completed workout: exercise name, sets, reps, duration
  (whichever apply), and date/time (defaults to now).
- User can also log a quick freeform activity (e.g., "Ran 5km") without
  picking from the exercise library.
- Logging works fully offline — the entry saves locally immediately and
  syncs to Firestore once back online.
- Logged workouts appear immediately in History (see #7).

### 5. Step Tracking
- App reads step count from the device's pedometer sensor (`expo-sensors`)
  in the background while the app is open.
- Daily step totals are saved to `activityDaily/{userId}_{date}`.
- Home/Dashboard shows today's step count vs. the user's daily step goal.
- If sensor permission is denied, show a clear message — don't crash, and
  don't block the rest of the app.

### 6. Goals
- User can set a daily step goal and a weekly workout-count goal from a
  Goals screen.
- Dashboard shows progress toward each goal (e.g., "6,200 / 8,000 steps",
  "3 / 5 workouts this week").
- Goals are editable at any time; changing a goal doesn't erase past history.

### 7. History & Calendar View
- User can view a list of past workout logs, most recent first.
- User can filter/browse by date (simple calendar or date-picker view).
- Tapping a past log shows its details (same info that was entered when
  logged).

### 8. Dashboard (Home Screen)
- Shows: today's step count vs. goal, this week's workout count vs. goal,
  and one chart (e.g., steps over the last 7 days).
- Acts as the app's landing screen after login.
- Pulls from `activityDaily`, `workoutLogs`, and `goals` — all read from
  Firestore's local cache first so it renders instantly even offline.

### 9. Offline Behavior (cross-cutting, not a screen)
- Any screen that writes data (workout logging, step sync, goal updates,
  profile edits) must work with no internet connection.
- Firestore's `persistentLocalCache()` handles this — do not add custom
  queueing logic on top of it unless a specific case proves it's needed.
- When connectivity returns, syncing is automatic; no "sync now" button is
  required for MVP.

## Build Order (matches the 8-week plan)

1. **Project init** — `npx create-expo-app`, install Clerk + Firebase SDKs, set up
   `.env` + `app.config.js` for env vars, initialize Firestore with
   `persistentLocalCache()`.
2. **Auth** — Clerk provider at app root, sign-up/sign-in screens, protected
   route wrapper that redirects unauthenticated users.
3. **Profile** — form for height, weight, age, gender, goal; save to
   `users/{userId}` in Firestore.
4. **Exercise library** — fetch from Exercise Database API once, cache results
   into `exercises/` collection; build list + search/filter screen reading
   from Firestore (not the live API).
5. **Workout logging** — form to log exercise + sets/reps/duration; write to
   `workoutLogs/{logId}` tagged with `userId`; must work offline.
6. **Step tracking** — `expo-sensors` pedometer hook; write daily totals to
   `activityDaily/{userId}_{date}`.
7. **Dashboard** — one chart (weekly steps or workout count) reading from
   Firestore.
8. **Goals** — simple form (daily step target, weekly workout count) stored in
   `goals/{goalId}`; dashboard shows progress against it.
9. **History view** — list/calendar of past `workoutLogs` by date.
10. **Polish + EAS build** — fix bugs found in manual offline test, then
    `eas build --platform android --profile preview`.

## Data model

```
users/{userId}            { height, weight, age, gender, goal }
exercises/{exerciseId}    { name, bodyParts[], equipments[], targetMuscles[], gifUrl, instructions[] }
workoutLogs/{logId}       { userId, exerciseId, sets, reps, duration, date }
goals/{goalId}            { userId, type, target, period }
activityDaily/{userId_date} { userId, date, steps }
```

All queries filter client-side with `where('userId', '==', currentUser.id)`.
There is **no server-side Firestore rule enforcement** in this version — this is
a known, accepted simplification. Don't add security rules unless asked.

## Conventions

- Functional components + hooks only.
- One feature = one folder under `/screens`, with its own hooks in `/hooks` if
  logic grows past ~30 lines.
- Firestore/Clerk/API access only through `/lib/firebase.js`, `/lib/clerk.js`,
  `/lib/exerciseApi.js`.
- Optimistic local writes — never block the UI on a network round trip.
- Keep components under ~200 lines.
- All UI must match `design/fittrack_energetic_student_system/DESIGN.md` —
  colors, fonts, spacing, and radii come from there, not from defaults or
  guesses. Cross-check each screen against its `screen.png` and `code.html`
  reference before considering it done.

## Out of scope — do not build

Wearable/Bluetooth sync, social features/leaderboards, gamification/badges,
push notifications, water intake tracker, BMI calculator, nutrition/medical
advice features.

## Definition of done (per task)

- Runs in Expo Go with no console errors.
- Works with Airplane Mode on (for any data-writing feature) and syncs after
  reconnecting.
- No hardcoded API keys or secrets in committed files.