# 🧠 Bookmarking Logic and Live/Study Mode Strategy

## 🎯 Core Insight

> **Live Mode = interactive experience**  
> **Study Mode = personal review + reflection**

---

## ✅ Key Observations

- **Live Mode may not need bookmarking during sessions**
  - User's focus is on interaction (teacher, chat, video)
  - Not ideal for stopping to tag/bookmark

- **Users may want to review Live Mode content later**
  - Bookmarking becomes valuable _after_ the live session
  - Best done in Study Mode

---

## 🧩 Recommended Architecture

### 1. **Shared Flashcard Storage System**

All flashcards live in the same system (AsyncStorage, database, etc), with a structure like:

```json
{
  "id": 123456,
  "folder": "Session A",
  "title": "Basics of React",
  "cards": [...],
  "createdAt": "2025-08-07T15:00:00Z",
  "mode": "live" // or "study"
}
```

---

### 2. **Tag Content by Mode**

- Use a `mode` field to identify the origin of the content
  - `mode: "study"` for standard sets
  - `mode: "live"` for live-session-generated cards
- Filter screens accordingly:
  - Study Mode: `mode === "study"`
  - Live Mode: `mode === "live"`

---

### 3. **Bookmarking Only in Study Mode**

- Simplifies UX
- Keeps Live Mode focused and clean
- Study Mode becomes the review hub

---

## 🔮 Future Possibilities

| Feature                       | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| 🔁 Auto-duplicate Live sets   | Copy Live Mode sets into Study Mode for bookmarking later    |
| 🕓 Timeline Review            | Show history of learning/review for each card                |
| 🧠 Smart Bookmark Suggestions | Recommend cards to review based on past usage or performance |

---

## 🧭 Summary

- **Live Mode is about the experience**
- **Study Mode is where reflection and bookmarking happen**
- **Connecting the two modes through shared data ensures seamless flow**

╭────────────────────────────╮
│ 🧑‍🏫 [Teacher Video Bubble] │ ← top reserved space
├────────────────────────────┤
│ │
│ [Term or Definition] │ ← fullscreen flip card
│ │
├────────────────────────────┤
│ 🧑 [Student Video Bubble] │ ← bottom reserved space
│ 💬 [Chat Icon] │
╰────────────────────────────╯
