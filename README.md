# AI Flashcard Generator

## Overview
AI-powered flashcard generator that transforms pasted text into study-ready flashcards. Complements Flipping99 and broadens portfolio with AI features.

## Features
- Paste text and generate flashcards via OpenAI API
- Flip card UI (tap to reveal)
- Save sets locally with AsyncStorage
- View saved sets in dedicated screen
- Export (JSON, future PDF)

## Tech Stack
- React Native + Expo
- OpenAI API
- AsyncStorage for local storage
- React Navigation for multi-screen flow

## Setup
1. Clone repo and install dependencies
2. Add `.env` file with your OpenAI API key
3. Run `npx expo start` to launch in Expo Go


# 🧠 AI Flashcards – README

**Version:** 0.1.0  
**Status:** In Development (Milestone 1 Complete)  
**Platform:** React Native (Expo)

---

## ✅ Tech Stack

- **Frontend:** React Native (via Expo)
- **Storage:** AsyncStorage for local persistence
- **AI Integration:** OpenAI API (via `.env` using `react-native-dotenv`)
- **Navigation:** React Navigation stack

---

## 📐 App Architecture

```
Folders → Sets → Flashcards
```

### Screens:
- `SavedFoldersScreen` → displays all folders
- `SavedSetsScreen` → shows all sets in selected folder
- `SetDetailsScreen` → displays flashcards in a selected set
- `FlashCardScreen` → generates new flashcards via AI

### Navigation Flow:
```
SavedFoldersScreen → SavedSetsScreen → SetDetailsScreen → FlashCardScreen
```

---

## 🗂 Folder Structure

```
app.config.js           # Expo configuration
App.js                  # App entry point + navigation
screens/
├── FlashCardScreen.js        # AI-powered flashcard generation
├── SavedFoldersScreen.js     # Folder list (swipe-to-delete ✅)
├── SavedSetsScreen.js        # Sets in a folder (swipe-to-delete ✅)
├── SetDetailsScreen.js       # View individual flashcards
utils/
├── ai.js                     # Handles OpenAI API logic
├── storage.js                # Folder/set-aware AsyncStorage helper
```

---

## 🚀 Usage Flow

1. Launch app → auto-creates **Default** folder
2. Land on `FlashCardScreen` → generate a set using AI
3. Save set → stored in current folder
4. View folders → tap folder → see saved sets → tap set → study cards
5. Swipe folder or set → trash icon appears → confirm deletion

---

## ✅ Milestone v0.1.0 – Complete

### Features Implemented:
- 🔁 Swipe-to-delete for **folders** and **sets**
- 🧠 Delete confirmation dialog (via `Alert.alert()`)
- 🧹 Removed scroll bar from `SavedFoldersScreen`
- 🐛 Fixed crash caused by undefined `folderName` on set deletion
- 📤 Pushed milestone to GitHub, tagged as `v0.1.0`
- 📄 `app.json` updated with version `0.1.0`

### Bug Fix Highlights:
- Trash icon now hides after deletion
- Swipe back recovery bug resolved (folders reappearing)
- Fixed AsyncStorage logic to **fully delete** folders/sets
- Clarified special handling of the `Default` folder (manually created)

---

## 🧪 Debug Tools (Dev Only)

- **Clear All Storage** button (dev utility)
- `.env` file with `OPENAI_API_KEY` (gitignored)

---

## 🔮 Upcoming Goals

### UI Polish:
- Improve typography and spacing in `SetDetailsScreen`
- Style headers for folders and sets

### Study Mode Prep:
- Convert `SetDetailsScreen` to study one flashcard at a time
- Add **flip animation** (front = term, back = definition)
- Track study progress (e.g. "2 of 20")
- Add "mark as known" or "bookmark" capability

### Future Ideas:
- Cloud sync via Firebase or Supabase
- Shuffle and filter decks (e.g. only unknown)
- Monetization (e.g. unlock full sets, premium tools)

---

## 📦 Version History

| Version | Status                       | Notes                                 |
|---------|------------------------------|----------------------------------------|
| 0.1.0   | ✅ Milestone 1 Complete      | Swipe delete + storage cleanup working |

---

## 🧠 Git Commands (for Reference)

```bash
# Commit milestone
$ git add .
$ git commit -m "Fix folder and set deletion with swipe gestures; remove scroll bar on folders"

# Tag the release
$ git tag v0.1.0
$ git push origin v0.1.0
```

---

## 💬 Notes to Self

> When you're deep in the code for days, this README is your anchor. Use it to remember the why behind the what.

- This app dynamically derives folder names from saved sets (except the hard-coded `Default` one)
- Swipe-to-delete was tricky — required fixing both UI gestures and `storage.js` cleanup logic
- Deletion confirmation is alert-based for now (might refactor into a custom modal later)
- You’ve built a strong foundation — Study Mode is the next big leap 💪
