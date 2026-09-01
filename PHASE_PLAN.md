# FitTrack — Phased Build Plan

A sequenced set of phases, each with a ready-to-paste prompt (for Claude Code,
Cursor, or this chat). Do them in order — each phase assumes the previous one
is done and working before moving on. UI/UX comes first so every screen exists
and is click-through-able before any backend is wired in; backend phases then
connect real data into that existing UI, feature by feature.

Reference `agent.md` in every phase — it's the source of truth for structure,
tech stack, data model, and feature behavior. Reference `design/` (the
confirmed Stitch export) for every visual detail in Phase 1 — colors, fonts,
spacing, and per-screen layouts. If a prompt below conflicts with either,
those files win; update this plan instead of drifting.

---

## Phase 0 — Project Setup
**Goal:** A running Expo app with the full stack installed. No screens yet.

```
Set up a fresh Expo project (TypeScript, React Navigation) in this folder.
Install and configure: @clerk/clerk-expo, firebase, expo-sensors,
expo-constants. Create a .env template with placeholders for
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, FIREBASE_API_KEY, FIREBASE_PROJECT_ID, and
EXERCISEDB_API_KEY. Confirm `npx expo start` runs cleanly on Expo Go with no
errors before moving on.
```

**Done when:** `npx expo start` shows a blank running app in Expo Go with no
console errors, and `.env` has all four variables listed (placeholders okay).

---

## Phase 1 — UI/UX & Frontend
**Goal:** Every screen exists and is navigable, using static/mock data — no
backend connected yet. Build to the confirmed design, not from scratch.

```
Using agent.md's feature list and the confirmed design in
design/fittrack_energetic_student_system/DESIGN.md, build all core screens
with React Navigation, matching each screen's reference exactly (colors,
fonts, spacing, component shapes) — cross-check against design/<screen>/screen.png
and design/<screen>/code.html for each:
sign_up_login, profile_setup, dashboard, exercise_library,
exercise_detail_loaded, exercise_detail_loading, exercise_detail_offline,
log_workout, my_goals, workout_history, profile_settings.
Wire up navigation (bottom tab bar: Home, Library, Log, History, Profile) so
every screen is reachable. Build shared UI components (buttons, cards, input
fields, list items, chart placeholder, filter chips, cached-status dot) per
DESIGN.md's Components section. Populate every screen with hardcoded mock
data (mock exercise list, mock workout history, mock step count, mock goals)
so the whole app is fully click-through-able, including all three exercise
detail states (loaded/loading/offline) using mock conditions to switch
between them. Do not connect Firebase, Clerk, or any real API yet — that
starts in Phase 2.
```

**Done when:** every screen is reachable, visually matches its `screen.png`
reference, and all navigation works — including manually toggling between
the three exercise detail states — even though nothing is saved or real yet.

---

## Phase 2 — Firebase & Clerk Configuration
**Goal:** Backend services are live and reachable from the app, per `agent.md`.

```
Using agent.md's data model, initialize Firebase in lib/firebase.js with
Firestore and persistentLocalCache() enabled for offline support. Set up the
Clerk provider in lib/clerk.js and wrap the app root with it. Create the
Firestore collections referenced in agent.md: users, exercises, workoutLogs,
goals, activityDaily. Write a temporary test screen that writes one document
to Firestore and reads it back, to confirm the connection works end to end.
```

**Done when:** the test screen successfully writes and reads a document, and
you can see it appear in the Firebase console.

---

## Phase 3 — Auth
**Goal:** Replace the mock sign-up/login from Phase 1 with real auth.

```
Using agent.md's Authentication feature spec, connect the sign-up and sign-in
screens built in Phase 1 to @clerk/clerk-expo. Add a protected-route wrapper
so unauthenticated users are redirected to sign-in, and authenticated users
land on the Home/Dashboard screen. Confirm the session persists across an app
restart.
```

**Done when:** you can sign up, close and reopen the app, and land straight
on the dashboard without signing in again — and signing out returns you to
the sign-in screen.

---

## Phase 4 — Profile
**Goal:** Connect the Phase 1 profile screens to real data.

```
Using agent.md's Profile feature spec, connect the profile setup form (height,
weight, age, gender, fitness goal) and the editable Profile/Settings screen
from Phase 1 to Firestore. Save to users/{userId} via a wrapper function in
lib/firebase.js, not inline in the screen. Remove the mock profile data.
```

**Done when:** a new user is prompted to fill out their profile once, the data
persists in Firestore, and editing it later saves correctly.

---

## Phase 5 — Exercise Library
**Goal:** Replace the mock exercise list with real, cached data.

```
Using agent.md's Exercise Library feature spec, write lib/exerciseApi.js to
fetch all pages from the Exercise Database API once and cache them into the
exercises collection in Firestore. Connect the Phase 1 library and detail
screens to read from that Firestore cache (not the live API), with search by
name and filter by body part/equipment working against real data.
```

**Done when:** the library loads instantly from Firestore on repeat visits,
search and filters work, and tapping an exercise shows full real detail.

---

## Phase 6 — Workout Logging
**Goal:** Real logging that works offline.

```
Using agent.md's Workout Logging feature spec, connect the Phase 1 log-workout
screen to Firestore, supporting both a picked exercise (sets/reps/duration)
and a freeform entry. Write to workoutLogs/{logId} tagged with the current
userId. Confirm writes succeed with the device in Airplane Mode and sync once
reconnected.
```

**Done when:** a workout logged in Airplane Mode appears immediately in the
app, and appears in the Firestore console once the device reconnects.

---

## Phase 7 — Step Tracking
**Goal:** Real daily step counts from the device sensor.

```
Using agent.md's Step Tracking feature spec, add a usePedometer hook with
expo-sensors that reads step count while the app is open and writes daily
totals to activityDaily/{userId}_{date}. Handle permission denial gracefully
with a clear inline message — don't crash or block the rest of the app.
```

**Done when:** walking with the app open increases the step count shown in
the app, and denying the sensor permission shows a message instead of a crash.

---

## Phase 8 — Goals
**Goal:** Real goal setting connected to the Phase 1 Goals screen.

```
Using agent.md's Goals feature spec, connect the Phase 1 Goals screen to
Firestore so users can set a daily step target and a weekly workout-count
target, saved to goals/{goalId}. Changing a goal must not erase past history.
```

**Done when:** a goal set today is visible and editable, and editing it
doesn't affect previously logged workouts or step history.

---

## Phase 9 — Dashboard
**Goal:** The home screen reflects real data instead of mocks.

```
Using agent.md's Dashboard feature spec, connect the Phase 1 dashboard screen
to show today's steps vs. goal, this week's workout count vs. goal, and a
real 7-day step chart. Read from activityDaily, workoutLogs, and goals via
Firestore's local cache so it renders instantly even offline.
```

**Done when:** the dashboard reflects real logged data, updates after a new
workout or step sync, and still renders (from cache) with the device offline.

---

## Phase 10 — History & Calendar
**Goal:** Real history browsing.

```
Using agent.md's History & Calendar feature spec, connect the Phase 1 history
screen to list real past workout logs, most-recent-first, with a working date
filter/calendar view. Tapping a past log shows the same detail as when it was
logged.
```

**Done when:** logs appear in the list immediately after logging, and
filtering by date shows only that day's entries.

---

## Phase 11 — Testing & Offline Verification
**Goal:** Find and fix what's broken before anyone else sees it.

```
Manually test every screen and flow in agent.md's feature list, including
empty states (no workouts logged yet, no goals set, sensor permission
denied). Then do a full offline pass: enable Airplane Mode, log a workout,
let steps accumulate, reconnect, and confirm both sync to Firestore. Fix any
bugs found and tighten loading/error states.
```

**Done when:** no known crashes remain, every empty state shows a sensible
message instead of a blank screen, and the offline-to-sync flow works
reliably on repeat tries.

---

## Phase 12 — Deployment
**Goal:** A signed, installable build ready for submission/defense.

```
Run `eas build --platform android --profile preview` to produce an
installable APK. Confirm no API keys or secrets are hardcoded anywhere in the
committed source. Prepare screenshots and a short written summary of known
limitations (see agent.md's Out of Scope list) for the final documentation.
```

**Done when:** the APK installs and runs correctly on a physical Android
device with no dev server running.

---

## Still-open scope (resolve before the phase that needs them)
1. **Calorie estimation** — mentioned as a stretch feature in earlier planning
   but not in `agent.md`'s feature list; decide before Phase 6 if it's in or out.
2. **Notifications/reminders** — explicitly out of scope for the MVP; revisit
   only after Phase 12 if time remains.

## How to use this file
- Copy one phase's prompt at a time into Claude Code (or this chat) — don't
  paste multiple phases at once.
- After each phase, verify the "Done when" condition before starting the next.
- If a phase reveals `agent.md` needs updating (new collection field, new
  screen, changed behavior), update `agent.md` immediately — don't let it
  drift out of sync with the real code.