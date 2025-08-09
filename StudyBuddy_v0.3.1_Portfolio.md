# 📱 StudyBuddy – v0.3.1 (Portfolio Build)

A beautifully polished freemium flashcards app with AI-powered generation.  
Version 0.3.1 is a **portfolio-ready public build** — it showcases the freemium UX and core study features without exposing premium payment logic.

---

## 🎥 Demo Video
*(Replace with your actual MP4/GIF)*  

> ![Demo](docs/studybuddy-v0.3-demo.mp4)  
> *15-second loop showing ModeSelector, AI generation, fullscreen card flip, and set counters.*

---

## ✨ Features in v0.3.1 (Free)
- **AI-powered flashcard generation** from your own topics.  
- **Folder & set organization** with synced counters.  
- **Fullscreen study cards** with smooth swipes and single-tap flips.  
- **Freemium gateway**:
  - Solo Study (free).
  - StudyBuddy (Premium) locked, with upgrade modal + perks list.  
- **Progress indicator** for free tier (N/200 cards created).
- **Dev reset** tool for demo purposes.

---

## 🔒 What’s Coming in v0.4 (Premium)
- **StudyBuddy live mode** – real-time study with a friend via video PiP.  
- **Unlimited AI generation** (within fair-use guardrails).  
- **Priority processing** & faster generation times.  
- **Device sync** for flashcards & progress.  
- **Early feature access** for subscribers.

---

## 🗺 Roadmap for v0.3 Final Polish
**Goal:** Fully functional, beautiful free app for portfolio/demo use.  

### 🐞 Bug & UI Cleanup
1. Theme consistency – unify status bar & header colors across all screens.  
2. Counters polish:  
   - Footer: “Total Cards in Folder” → **“Total Cards in All Sets”**.  
   - Per-set pill: right-align `X cards` count.  
3. Safe area fixes – ensure UI respects iOS/Android safe zones.  
4. Minor spacing & font tweaks for visual consistency.  

### 🧭 ModeSelectorScreen (Freemium Showcase)
5. Rename “Live Mode” → **StudyBuddy (Premium)**.  
6. Add Upgrade Modal when tapped:  
   - Perks list (Study with a friend, Unlimited generation, Priority processing, Sync, Early access).  
   - “Coming Soon” CTA (no payments).  
7. Add subtle `N/200 cards created` progress hint for free users.  

### 👆 Gestures & Study UX
8. Implement single tap flip reliably.  
9. Fix iOS swipe-back gesture conflict with card swipes.  
10. Smooth card animations for swipe navigation.  

### 🧪 Dev Tools
11. Keep Dev Reset button (hidden or in settings) for demo resets.  
12. Toast/log confirmation when reset is used.

---

## 🛠 Local Setup
1. Clone repo:  
   ```bash
   git clone https://github.com/YOUR-USERNAME/studybuddy.git
   cd studybuddy
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Create `.env` file:  
   ```env
   OPENAI_API_KEY=your_key_here
   ```
4. Run app:  
   ```bash
   npm start
   ```

---

## 📜 License
MIT – You’re free to fork and explore, but this is a **portfolio demo**. Premium logic will be private in v0.4+.

---

# 🎬 MP4 Recording Script (15–20 seconds)
> Start in ModeSelector.  
> Tap “StudyBuddy (Premium)” → upgrade modal appears (scroll perks, show “Coming Soon” button).  
> Switch to Solo Study, generate a short set with AI (show loader briefly).  
> Open the fullscreen card view → tap to flip card, swipe to next card.  
> Back out to Sets screen → show counters & corrected footer.  
> Done.
