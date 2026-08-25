# 📘 KidAI Studio: Complete Architecture & Feature Documentation

Yeh document KidAI Studio ke poore system ka complete technical aur functional blueprint hai — frontend routes, backend database, AI pipeline, game engines, aur verification workflows.

---

## 🌟 1. Core Architecture Overview (How KidAI Works End-to-End)

KidAI Studio ek **AI-Powered Gamified EdTech Ecosystem** hai jo bacho ke physical homework, textbooks aur handwritten copies ko real-time educational games mein convert karta hai, jisme **Anti-Hallucination Grounding, CBSE Government Curriculum Alignment, aur Parent Supervision Gatekeeper** integrated hai.

```
                                  ┌─────────────────────────────┐
                                  │   📸 Child Scans Homework   │
                                  │ (Camera / Gallery Upload)   │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Client-Side Tesseract OCR   │
                                  │   + Image Fast WebP Comp    │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Multi-Provider Vision AI    │
                                  │ (Gemini 2.5 / Claude Vision)│
                                  │ + Strict CBSE Class Ground  │
                                  │ + Blur Gate & Scribble Filt │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ Supabase Pending Queue      │
                                  │ (status: pending_approval,  │
                                  │  is_active: false)          │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │ 👨‍👩‍👧 Parent / Teacher Hub    │
                                  │ Split-Screen Evidence Modal │
                                  │ (Photo Left | Q&A Right)    │
                                  │ [Approve 🚀] / [Reject ❌]  │
                                  └──────────────┬──────────────┘
                                                 │
                                       ┌─────────┴─────────┐
                         [Approved ✅] │                   │ [Rejected ❌]
                                       ▼                   ▼
                        ┌─────────────────────┐   ┌─────────────────┐
                        │ 🎒 Child's Library  │   │ Archived / Alert│
                        │ Unlocked & Playable │   │ Rescan Request  │
                        └──────────┬──────────┘   └─────────────────┘
                                   │
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │ 🎮 Play Arena & Spaced Repetition Engine (SRS)  │
          │ (3D Ludo, Snakes & Ladders, Math Racer, Chess)  │
          │  + XP & Coin Economy, Badges, & Streak Tracking │
          └─────────────────────────────────────────────────┘
```

---

## 🗺️ 2. Complete Routes Map (All 51 App Routes)

### 👦 Child Experience (`app/(child)/*`)
1. `/home`: Main Child Dashboard (XP, Streak, Daily Quests, Arya AI greeting, Growth graph).
2. `/scanner`: Smart Camera Scanner with instant client-side OCR & Vision AI processing.
3. `/seekho`: Chapter-wise learning modules & AI lessons.
4. `/play`: Game Arcade Hub with 10+ games.
5. `/play/ludo-game`: Real 3D Ludo Classic with realistic 3D glossy pawns & bot AI.
6. `/play/snakes-ladders`: 3D Animated Snakes & Ladders with 4 distinct avatars & emotion animations.
7. `/play/car-race-game`: 3D Highway Car Racing survival game.
8. `/play/math-racing`: Turbo Math Racing with speed gates.
9. `/play/chess`: Full Chess board against AI or local pass-and-play.
10. `/play/memory-match`: Visual brain memory cards.
11. `/play/tic-tac-toe`: Classic zero-kata.
12. `/play/typing-ninja`: Fast typing word slash arcade.
13. `/library`: Approved homework games & personal practice bank.
14. `/profile`: Student Profile (Class, Board, Age, Medium, Avatar, Skills, Badges).
15. `/chat`: Conversational AI Tutor (Arya) for instant doubt solving.
16. `/history`: Learning analytics, mastered topics, and weak areas.
17. `/story`: AI interactive story generator.
18. `/code-magic`: Child coding blocks playground.
19. `/create`: Custom game & quiz creator for kids.

### 👨‍👩‍👧 Parent & Teacher Experience (`app/(parent)/*`)
20. `/dashboard`: **AI Verification & Approval Hub** (Split-Screen Review Modal with Zoomable original photo, editable Q&A, `sourceQuote` book proof, and 1-click Approve/Reject).
21. `/reports`: Detailed child performance, time-spent analytics, and syllabus completion reports.

### 🎨 Creative Creator Studio (`app/studio/*`)
22. `/studio`: Central Creative Hub.
23. `/studio/magic-scanner`: Creative scanner.
24. `/studio/2d-animation`: 2D cartoon animation builder.
25. `/studio/story-video`: Text-to-video story generator.
26. `/studio/comic-maker`: Comic book creator.
27. `/studio/coloring-book`: Interactive digital coloring book.
28. `/studio/logo-maker`: Kid-friendly logo design tool.
29. `/studio/brand-promo`: Educational promo video creator.
30. `/studio/library`: Saved studio creations.

### ⚙️ Admin & Management (`app/admin/*`)
31. `/admin`: Admin Master Dashboard.
32. `/admin/scanner`: Batch scan inspector & AI model confidence logs.
33. `/admin/blog`: Content management for SEO blogs.

### 🌐 Public & Onboarding Routes
34. `/`: Main Landing Page with hero showcase.
35. `/select-profile`: Onboarding Profile Selector (Class 1-10, Board CBSE/ICSE, Age, Medium).
36. `/login`: User Authentication.
37. `/signup`: New Account Registration with referral bonus.
38. `/pricing`: Subscription tiers & XP packages.
39. `/about`: Mission & Company Vision.
40. `/blog` & `/blog/[slug]`: SEO Educational Articles.
41. `/faq`: Frequently Asked Questions.
42. `/reviews`: 5-Star Parent & Teacher Trust Reviews.
43. `/earn`: Referral & rewards program.
44. `/contact` & `/help`: Support & Feedback system.

### 🔌 API Backend Routes (`app/api/*`)
45. `/api/ai/scan`: Vision AI scan & game generation endpoint.
46. `/api/ai/chat`: Arya conversational doubt solver.
47. `/api/ai/quiz`: Instant CBSE syllabus quiz generator.
48. `/api/ai/story`: Creative AI narrative engine.
49. `/api/ai/parent`: Parent advice & curriculum guidance.
50. `/api/games/ai-move`: Real-time Bot game engine moves (Chess, Ludo).
51. `/api/referral/apply`: Referral code verification & bonus credit.

---

## 🗄️ 3. Database Architecture (Supabase Clean Schema)
* **`students`**: Tracks name, DOB, dynamic age, `current_class` (1-12), `board` (CBSE/ICSE/State), `medium`, XP, coins, streak, `last_class_promoted_at`.
* **`library`**: Stores all homework scans, generated games, `source_image_url`, `ai_confidence_score`, `status` (`pending_approval` / `approved` / `rejected`), `is_active`, and reviewer ID.
* **`quizzes` & `quiz_attempts`**: 2000+ scalable questions with **SM-2 Spaced Repetition Algorithm** (calculating `ease_factor`, `interval_days`, `next_review_date`).
* **`class_progressions`**: Historical record of annual promotions with weak topics carried forward for revision.
* **`daily_sessions`**: Daily XP, quizzes solved, and time-spent logging.
