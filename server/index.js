import express from "express";
import cors from "cors";

import {
  userEmail,
  userId,
  createUser,
  update,
  session,
  sessionUser,
  activity,
  activities,
} from "./db.js";

import {
  Q,
  roadmap,
  rec,
  reply,
} from "./mentor.js";

import {
  askOllama,
  streamOllama,
} from "./ollama.js";


/* =====================================================
   APP
===================================================== */

const app = express();

app.use(cors());

app.use(express.json());


/* =====================================================
   AUTH MIDDLEWARE
===================================================== */

function auth(req, res, next) {
  const token =
    (req.headers.authorization || "")
      .replace("Bearer ", "");

  const s =
    sessionUser(token);

  if (!s) {
    return res.status(401).json({
      message:
        "Please login again.",
    });
  }

  const u =
    userId(s.userId);

  if (!u) {
    return res.status(401).json({
      message:
        "User not found",
    });
  }

  req.user = u;

  next();
}


/* =====================================================
   PUBLIC USER
   Remove password before sending to frontend
===================================================== */

function pub(u) {
  const {
    password,
    ...x
  } = u;

  return x;
}


/* =====================================================
   HEALTH
===================================================== */

app.get(
  "/api/health",
  (_, res) => {
    res.json({
      ok: true,
    });
  }
);


/* =====================================================
   OLLAMA TEST
===================================================== */

app.get(
  "/api/ai/test",
  async (_, res) => {
    try {
      const answer =
        await askOllama(
          "You are Mentor AI. Explain a personalized learning roadmap in one very short sentence."
        );

      res.json({
        answer,
      });
    } catch (error) {
      console.error(
        "Ollama test error:",
        error
      );

      res.status(500).json({
        message:
          "Ollama connection failed",
        error:
          error.message,
      });
    }
  }
);


/* =====================================================
   REGISTER
===================================================== */

app.post(
  "/api/auth/register",
  (req, res) => {
    const {
      x,
    } = req.body || {};

    if (
      !x?.name ||
      !x?.email ||
      !x?.password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required.",
      });
    }

    if (
      userEmail(x.email)
    ) {
      return res.status(409).json({
        message:
          "Email already registered.",
      });
    }

    const u =
      createUser(x);

    const t =
      session(u.id);

    activity(
      u.id,
      {
        type: "account",
        title:
          "Created Mentor AI account",
      }
    );

    res.status(201).json({
      token: t,
      user: pub(u),
    });
  }
);


/* =====================================================
   LOGIN
===================================================== */

app.post(
  "/api/auth/login",
  (req, res) => {
    const {
      email,
      password,
    } = req.body;

    const u =
      userEmail(
        email || ""
      );

    if (
      !u ||
      u.password !== password
    ) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    res.json({
      token:
        session(u.id),

      user:
        pub(u),
    });
  }
);


/* =====================================================
   CURRENT USER
===================================================== */

app.get(
  "/api/me",
  auth,
  (req, res) => {
    res.json({
      user:
        pub(req.user),
    });
  }
);


/* =====================================================
   UPDATE USER
===================================================== */

app.put(
  "/api/me",
  auth,
  (req, res) => {
    const updatedUser =
      update(
        req.user.id,
        {
          name:
            req.body.name,

          goal:
            req.body.goal,

          level:
            req.body.level,

          dailyMinutes:
            +req.body.dailyMinutes,
        }
      );

    res.json({
      user:
        pub(updatedUser),
    });
  }
);


/* =====================================================
   ROADMAP
===================================================== */

app.get(
  "/api/roadmap",
  auth,
  (req, res) => {
    res.json({
      roadmap:
        roadmap(req.user),
    });
  }
);


/* =====================================================
   COMPLETE TASK
===================================================== */

app.post(
  "/api/tasks/:id/complete",
  auth,
  (req, res) => {
    const taskId =
      req.params.id;

    if (
      (req.user.tasks || [])
        .includes(taskId)
    ) {
      return res.json({
        user:
          pub(req.user),

        roadmap:
          roadmap(req.user),
      });
    }

    const u =
      update(
        req.user.id,
        {
          tasks: [
            ...(req.user.tasks || []),
            taskId,
          ],

          xp:
            req.user.xp + 40,

          completedTasks:
            req.user.completedTasks + 1,
        }
      );

    activity(
      u.id,
      {
        type: "task",

        title:
          `Completed ${taskId}`,

        xp: 40,
      }
    );

    res.json({
      user:
        pub(u),

      roadmap:
        roadmap(u),
    });
  }
);


/* =====================================================
   GET QUIZ
===================================================== */

app.get(
  "/api/quiz/:skill",
  auth,
  (req, res) => {
    const qs =
      Q[req.params.skill];

    if (!qs) {
      return res.status(404).json({
        message:
          "Quiz unavailable",
      });
    }

    res.json({
      skill:
        req.params.skill,

      questions:
        qs.map(
          ([q, o]) => ({
            q,
            options: o,
          })
        ),
    });
  }
);


/* =====================================================
   SUBMIT QUIZ
===================================================== */

app.post(
  "/api/quiz/:skill/submit",
  auth,
  (req, res) => {
    const qs =
      Q[req.params.skill];

    const answers =
      req.body.answers || [];

    if (!qs) {
      return res.status(404).json({
        message:
          "Quiz unavailable",
      });
    }

    const correct =
      qs.reduce(
        (n, x, i) =>
          n +
          (
            answers[i] === x[2]
              ? 1
              : 0
          ),
        0
      );

    const score =
      Math.round(
        (correct /
          qs.length) *
          100
      );

    const old =
      req.user.skills[
        req.params.skill
      ] || 0;

    const newScore =
      Math.round(
        old * 0.55 +
        score * 0.45
      );

    const n =
      update(
        req.user.id,
        {
          xp:
            req.user.xp +
            score,

          skills: {
            ...req.user.skills,

            [req.params.skill]:
              newScore,
          },
        }
      );

    const recommendation =
      rec(
        req.params.skill,
        score
      );

    activity(
      n.id,
      {
        type:
          "verification",

        title:
          `Verified ${req.params.skill}`,

        score,

        xp: score,
      }
    );

    res.json({
      score,

      correct,

      total:
        qs.length,

      recommendation,

      user:
        pub(n),
    });
  }
);


/* =====================================================
   STREAMING AI MENTOR
===================================================== */

app.post(
  "/api/chat/stream",
  auth,
  async (req, res) => {
    const message =
      String(
        req.body.message || ""
      ).trim();

    if (!message) {
      return res.status(400).json({
        message:
          "Please enter a message.",
      });
    }

    try {
      const skillEntries =
        Object.entries(
          req.user.skills || {}
        );

      const weakestSkill =
        skillEntries.length
          ? [...skillEntries]
              .sort(
                (a, b) =>
                  a[1] - b[1]
              )[0][0]
          : "Not assessed";

      const skills =
        skillEntries.length
          ? skillEntries
              .map(
                ([skill, score]) =>
                  `${skill}: ${score}%`
              )
              .join(", ")
          : "Not assessed";


      /* =========================================
         SHORT AI PROMPT
      ========================================= */

      const prompt = `
You are Mentor AI, a concise personal learning mentor.

Student goal:
${req.user.goal || "Not specified"}

Student level:
${req.user.level || "Beginner"}

Daily study time:
${req.user.dailyMinutes || 60} minutes

Weakest skill:
${weakestSkill}

Skills:
${skills}

Student message:
${message}

Rules:
Answer in 1 to 3 short sentences.
Maximum 60 words.
Use simple English.
Be direct and practical.
Personalize the advice.
If explaining something technical, give one tiny example.
If asked what to learn next, focus on the relevant weak skill.
Do not repeat the student profile.
Do not give a long introduction.
Do not use unnecessary bullet points.

Answer:
`;


      /* =========================================
         STREAM RESPONSE
      ========================================= */

      res.status(200);

      res.setHeader(
        "Content-Type",
        "text/plain; charset=utf-8"
      );

      res.setHeader(
        "Cache-Control",
        "no-cache, no-transform"
      );

      res.setHeader(
        "Connection",
        "keep-alive"
      );

      res.setHeader(
        "X-Accel-Buffering",
        "no"
      );

      if (
        typeof res.flushHeaders ===
        "function"
      ) {
        res.flushHeaders();
      }


      let fullAnswer = "";


      await streamOllama(
        prompt,
        (token) => {
          fullAnswer += token;

          // Immediately send token
          res.write(token);
        }
      );


      res.end();


      activity(
        req.user.id,
        {
          type: "chat",
          title:
            "Asked Mentor AI",
        }
      );

    } catch (error) {
      console.error(
        "Ollama streaming error:",
        error
      );

      if (!res.headersSent) {
        return res.status(500).json({
          message:
            "Ollama connection failed",

          error:
            error.message,
        });
      }

      res.end();
    }
  }
);


/* =====================================================
   ACTIVITIES
===================================================== */

app.get(
  "/api/activities",
  auth,
  (req, res) => {
    res.json({
      activities:
        activities(
          req.user.id
        ),
    });
  }
);


/* =====================================================
   ACHIEVEMENTS
===================================================== */

app.get(
  "/api/achievements",
  auth,
  (req, res) => {
    res.json({
      achievements: [

        {
          id:
            "streak",

          title:
            "7 Day Streak",

          description:
            "Maintained a 7-day streak",

          unlocked:
            req.user.streak >= 7,
        },

        {
          id:
            "xp",

          title:
            "500 XP",

          description:
            "Earned 500 XP",

          unlocked:
            req.user.xp >= 500,
        },

        {
          id:
            "tasks",

          title:
            "First Steps",

          description:
            "Completed 5 tasks",

          unlocked:
            (req.user.tasks || [])
              .length >= 5,
        },

        {
          id:
            "verify",

          title:
            "Knowledge Verified",

          description:
            "Completed verification",

          unlocked:
            req.user.xp > 700,
        },

      ],
    });
  }
);


/* =====================================================
   NOTES
===================================================== */

app.get(
  "/api/notes",
  auth,
  (req, res) => {
    res.json({
      notes:
        req.user.notes || [],
    });
  }
);


app.post(
  "/api/notes",
  auth,
  (req, res) => {
    const note = {
      id:
        Math.random()
          .toString(36)
          .slice(2),

      title:
        req.body.title ||
        "Learning note",

      body:
        req.body.body || "",

      createdAt:
        new Date().toISOString(),
    };

    const u =
      update(
        req.user.id,
        {
          notes: [
            ...(req.user.notes || []),
            note,
          ],
        }
      );

    res.status(201).json({
      notes:
        u.notes,
    });
  }
);


app.delete(
  "/api/notes/:id",
  auth,
  (req, res) => {
    const u =
      update(
        req.user.id,
        {
          notes:
            (req.user.notes || [])
              .filter(
                (n) =>
                  n.id !==
                  req.params.id
              ),
        }
      );

    res.json({
      notes:
        u.notes,
    });
  }
);


/* =====================================================
   START SERVER
===================================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Mentor AI API running on http://localhost:${PORT}`
    );
  }
);