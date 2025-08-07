# 📍 AI Flashcards – Roadmap v0.2.0

**Status:** Planning  
**Tag:** v0.2.0  
**Focus:** Study Mode foundation, UX polish, and forward-compatible layout

---

## ✅ Core UX & Flow Improvements

- [ ] **Fix generate button (no double tap)**  
  Currently requires 2 taps due to keyboard dismissal. Refactor to trigger generation on first press.

- [ ] **Ensure iOS back arrow always shows**  
  Back arrow is inconsistent on iOS. Should persist reliably like it does on Android.

- [ ] **Auto-navigate to SetDetailsScreen after generation**  
  After generating a flashcard set, user should be immediately taken into the set (not back to the SavedSetsScreen).

- [ ] **Polish SetDetailsScreen layout**  
  Begin transitioning it into a fullscreen flashcard view to support both study and future live interactions.

---

## 🧠 Study Mode Transformation (Main Focus of v0.2.0)

- [ ] Display only one flashcard at a time
- [ ] Implement swipe or button navigation (next/prev)
- [ ] Tap to flip between front (term) and back (definition)
- [ ] Optionally remove header for a full-screen card experience
- [ ] Add progress tracker: `X / Y cards studied`
- [ ] Save user position in AsyncStorage (e.g., last studied index)

---

## 🌐 Dual Mode Architecture (Forward-Compatible)

> ⚠️ Start planning for two operational modes in the app.

### 1. Study Mode (default / public)
- Pure flashcard navigation and progress tracking
- Open-source friendly

### 2. Live Mode (future / possibly private)
- Interactive chat embedded inside flashcard view
- Picture-in-picture (PiP) video
- Real-time interaction during studying
- Requires screen layout to reserve flexible space (chat input, video)

🛠 While building Study Mode, architect screens to allow future expansion for Live Mode without major rewrites.

---

## 🔓 Mode Selector Screen (NEW)

- [ ] Add a ModeSelectorScreen as the first screen users see
- [ ] Show two options: Study Mode (unlocked), Live Mode (locked)
- [ ] Study Mode → navigates into standard app flow
- [ ] Live Mode → shows "Coming Soon" or grayed-out button for future monetization
- [ ] Future-ready for in-app purchases or subscription gating

---

## 🧪 Stretch Goals (Optional for 0.2.0)

- [ ] Add bookmark or "mark as known" feature
- [ ] Add card shuffle toggle
- [ ] UI theme options (light/dark mode or accent color picker)

---

## 🧭 Suggested Order of Development

### 🥇 Phase 1 – Immediate UX Fixes
1. Fix keyboard dismiss issue on Generate button
2. Ensure iOS back arrow always visible
3. After generating, navigate directly to SetDetailsScreen

### 🥈 Phase 2 – Architecture & Flow Setup
4. Create and plug in ModeSelectorScreen (Study vs Live)
5. Set up navigation stacks to support both modes
6. Stub out Live Mode as locked/coming soon

### 🥉 Phase 3 – Study Mode Core
7. Refactor SetDetailsScreen to display one flashcard at a time
8. Add tap-to-flip and swipe/next-prev navigation
9. Remove header (optional) for fullscreen card layout
10. Add study progress tracker (X / Y)
11. Save last studied index in AsyncStorage

### 🧪 Phase 4 – Stretch Goals (Optional)
12. Add card shuffle toggle
13. Add bookmark/favorite/known card tagging
14. Add theme toggle (light/dark mode)

---

## 📦 Summary

v0.2.0 is focused on:
- Smoother generation and navigation UX
- Redesigning flashcards for single-view study
- Structuring UI with enough flexibility for future Live Mode features

Keep the architecture simple, but forward-thinking.