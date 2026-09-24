# 🧠 MentorAI — AI-Powered Personal Learning & Career Mentor

> **An adaptive learning platform that helps students set goals, build personalized learning roadmaps, stay focused, verify their knowledge, identify weak skills, and continuously improve.**

MentorAI is a **full-stack adaptive learning platform** built for students who want a structured way to manage their learning and career preparation.

Instead of using separate applications for goal planning, learning roadmaps, productivity, quizzes, notes, progress tracking, and AI guidance, MentorAI brings these capabilities together into a single platform.

---

## 🎯 Problem Statement

Students often know **what they want to achieve**, but struggle with:

* Knowing what to learn next
* Creating a realistic learning roadmap
* Maintaining consistency
* Staying focused during study sessions
* Knowing whether they actually understood a topic
* Identifying their weak skills
* Tracking long-term progress
* Getting personalized guidance

Most productivity and learning applications treat these activities separately.

**MentorAI addresses this gap by connecting planning, learning, verification, feedback, and progress tracking into one continuous system.**

---

## 💡 Our Solution

MentorAI acts as a **digital learning mentor** for students.

A student can:

1. Define a learning or career goal
2. Create a personalized roadmap
3. Work on daily learning tasks
4. Use Focus/Pomodoro sessions
5. Mark tasks as completed
6. Verify their knowledge through quizzes
7. Update their skill scores
8. Identify weak areas
9. Receive recommendations
10. Track their overall learning journey

### Core Learning Loop

```text
                    ┌───────────────┐
                    │   SET GOAL    │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    ROADMAP    │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  DAILY TASKS  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ FOCUS & LEARN │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    QUIZ /     │
                    │ VERIFICATION  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ SKILL UPDATE  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │   FEEDBACK &  │
                    │ RECOMMENDATION│
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    PROGRESS   │
                    └───────┬───────┘
                            │
                            └──────────→ 🔄
```

---

# 🚀 Features

## 🔐 Authentication

* User registration
* User login
* Demo account
* Persistent user data

## 👤 Goal & Profile Setup

Students can define their learning goals and create a profile that represents their learning journey.

## 📊 Personalized Dashboard

The dashboard provides a central view of:

* Current goals
* Learning tasks
* XP
* Skill progress
* Recent activity
* Achievements
* Recommendations

## 🗺️ Learning Roadmap

MentorAI organizes learning into a structured roadmap so that students can understand:

**What to learn → What to practice → What to do next**

## ✅ Task Management

Students can:

* View learning tasks
* Complete tasks
* Track completed activities
* Earn XP through task completion

## 🧠 Knowledge Verification

Instead of simply accepting a completed task, MentorAI provides quizzes to check whether the student understands the topic.

Example:

```text
Student:
"I completed Python Functions."

            ↓

Knowledge Verification

Q1. What is a function?
Q2. What is the difference between
    parameters and arguments?
Q3. What does return do?

            ↓

Quiz Result
            ↓
Skill Score Update
```

## 📈 Adaptive Skill Scores

Skill scores are updated based on the student's learning and verification performance.

This helps the system identify areas where the student may need additional practice.

## 🎯 Weak-Skill Recommendations

MentorAI identifies weaker areas and provides recommendations for what the student should focus on next.

Example:

```text
Python       ████████░░  80%
SQL          ██████░░░░  60%
Statistics   █████░░░░░  50%
ML           ███████░░░  70%

Recommendation:
Focus on Statistics fundamentals next.
```

## 🤖 AI Mentor

MentorAI includes an AI Mentor chat designed to provide learning guidance without requiring an external API key.

Students can use the mentor for:

* Learning guidance
* Topic explanations
* Study assistance
* Recommendations
* Learning-related conversations

## ⏱️ Focus / Pomodoro Timer

Students can start focused study sessions for specific tasks.

The focus system helps connect:

```text
Task → Focus Session → Completion → Progress
```

## 📝 Notes

Students can create and manage personal learning notes.

Supported operations:

* Create
* Read
* Update
* Delete

## 📜 Activity History

MentorAI records learning activities so students can review their learning journey.

## 🏆 Achievements & XP

The platform uses gamification to encourage consistency.

Students can earn:

* XP
* Achievements
* Progress milestones

## 🔌 REST API

The application uses a REST API architecture to connect the frontend with the backend.

---

# 🏗️ System Architecture

```text
┌─────────────────────────────┐
│           STUDENT           │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│       React Frontend        │
│                             │
│ Dashboard                   │
│ Goals                       │
│ Roadmap                     │
│ Tasks                       │
│ AI Mentor                   │
│ Focus Timer                 │
│ Notes                       │
│ Progress                    │
└──────────────┬──────────────┘
               │
               │ REST API
               ↓
┌─────────────────────────────┐
│    Node.js + Express API    │
│                             │
│ Authentication              │
│ Goals & Tasks               │
│ Quiz / Verification         │
│ Skills                      │
│ Notes                       │
│ Activities                  │
│ Achievements                │
└──────────────┬──────────────┘
               │
               ↓
┌─────────────────────────────┐
│   Persistent JSON Storage   │
└─────────────────────────────┘
               │
               │
               ↓
┌─────────────────────────────┐
│        AI Mentor Layer      │
└─────────────────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Database

* Persistent local JSON database

### AI

* API-key-free AI Mentor implementation

---

# 📁 Project Structure

```text
MentorAI/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── routes/
│   ├── data/
│   ├── package.json
│   └── ...
│
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd MentorAI
```

---

## 2. Install Root Dependencies

```bash
npm install
```

---

## 3. Install Frontend Dependencies

```bash
npm --prefix client install
```

---

## 4. Install Backend Dependencies

```bash
npm --prefix server install
```

---

## 5. Start the Application

```bash
npm run dev
```

The application will start the frontend and backend development servers.

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:5000
```

---

# 🔑 Demo Account

For demonstration purposes:

```text
Email: demo@mentorai.local
Password: demo123
```

---

# 🔄 Example User Journey

A student wants to become a **Data Scientist**.

### Step 1 — Set Goal

```text
Goal:
Become a Data Scientist
```

### Step 2 — Follow Roadmap

```text
Python
   ↓
NumPy & Pandas
   ↓
Statistics
   ↓
SQL
   ↓
EDA
   ↓
Machine Learning
   ↓
Projects
```

### Step 3 — Complete Tasks

```text
☑ Learn Pandas
☑ Practice SQL
☐ Study Statistics
☐ Solve DSA Problems
```

### Step 4 — Verify Knowledge

The student completes a quiz related to the completed topic.

### Step 5 — Update Skills

The system updates the student's skill score based on performance.

### Step 6 — Recommendation

If Statistics is identified as a weaker area, MentorAI can recommend additional Statistics practice.

### Step 7 — Continue Learning

The student follows the next recommended action.

---

# 🌟 Key USP

The main idea behind MentorAI is not simply providing an AI chatbot.

It connects the complete student learning cycle:

```text
GOAL
  ↓
ROADMAP
  ↓
TASK
  ↓
FOCUS
  ↓
LEARNING
  ↓
KNOWLEDGE VERIFICATION
  ↓
SKILL ANALYSIS
  ↓
RECOMMENDATION
  ↓
PROGRESS
```

This creates a **continuous adaptive learning experience**.

---

# 🎯 Why MentorAI?

MentorAI aims to solve the gap between:

**"I want to learn something"**

and

**"I know what I should do next and whether I am actually improving."**

It provides students with a structured environment where they can plan, learn, practice, verify, and track their progress.

---

# 🔮 Future Scope

MentorAI can be extended with:

* AI-powered career guidance
* Resume analysis
* AI mock interviews
* Personalized interview preparation
* Advanced adaptive learning algorithms
* Cloud database integration
* Advanced learning analytics
* Mobile application
* External learning platform integration
* More intelligent skill-gap analysis
* Personalized career roadmaps

---

# 🏆 Hackathon Focus

MentorAI is designed as a **functional prototype for demonstrating adaptive student learning**.

The core demonstration focuses on:

```text
Personalization
      +
Productivity
      +
Knowledge Verification
      +
Adaptive Skills
      +
AI Guidance
      +
Progress Tracking
```

---

# 👩‍💻 Developed By

**Sanika Galgunde**

Computer Science Engineering
PCCOER, Ravet

---

## 📜 License

This project is developed for educational and hackathon purposes.
