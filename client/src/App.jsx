import React, {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  Trophy,
  BarChart3,
  Clock3,
  BookOpen,
  Activity,
  LogOut,
  Sparkles,
  Target,
  Zap,
  Flame,
  CheckCircle2,
  ChevronRight,
  Send,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  X,
  CircleHelp,
  ArrowRight,
} from "lucide-react";

import {
  api,
  setToken,
  token,
  clearToken,
  streamChat,
} from "./services/api";


/* =====================================================
   NAVIGATION
===================================================== */

const NAV = [
  [
    "dashboard",
    "Dashboard",
    LayoutDashboard,
  ],

  [
    "roadmap",
    "Learning Path",
    Map,
  ],

  [
    "mentor",
    "AI Mentor",
    BrainCircuit,
  ],

  [
    "skills",
    "Skill Map",
    BarChart3,
  ],

  [
    "focus",
    "Focus Timer",
    Clock3,
  ],

  [
    "notes",
    "My Notes",
    BookOpen,
  ],

  [
    "activity",
    "Activity",
    Activity,
  ],

  [
    "achievements",
    "Achievements",
    Trophy,
  ],
];


/* =====================================================
   APP
===================================================== */

export default function App() {
  const [u, setU] =
    useState(null);

  const [page, setPage] =
    useState("dashboard");

  const [auth, setAuth] =
    useState("login");


  useEffect(() => {
    if (token()) {
      api("/api/me")
        .then((d) =>
          setU(d.user)
        )
        .catch(() =>
          clearToken()
        );
    }
  }, []);


  if (!u) {
    return (
      <Auth
        mode={auth}
        setMode={setAuth}
        done={(d) => {
          setToken(d.token);
          setU(d.user);
        }}
      />
    );
  }


  return (
    <Shell
      user={u}
      setUser={setU}
      page={page}
      setPage={setPage}
      logout={() => {
        clearToken();
        setU(null);
      }}
    />
  );
}


/* =====================================================
   AUTH
===================================================== */

function Auth({
  mode,
  setMode,
  done,
}) {
  const [f, setF] =
    useState({
      name: "",
      email: "",
      password: "",

      goal:
        "Become a Data Scientist",

      dailyMinutes: 120,
    });

  const [err, setErr] =
    useState("");


  async function go(e) {
    e.preventDefault();

    setErr("");

    try {
      const d =
        await api(
          `/api/auth/${
            mode === "login"
              ? "login"
              : "register"
          }`,
          {
            method: "POST",

            body:
              JSON.stringify(f),
          }
        );

      done(d);

    } catch (error) {
      setErr(
        error.message
      );
    }
  }


  return (
    <div className="auth">

      <form
        className="authbox"
        onSubmit={go}
      >

        <div className="authlogo">

          <Sparkles />

          <b>
            Mentor
            <span>AI</span>
          </b>

        </div>


        <small>
          ADAPTIVE LEARNING
        </small>


        <h1>
          {mode === "login"
            ? "Welcome back."
            : "Build your learning path."}
        </h1>


        <p>
          Learn → practice → verify → adapt.
        </p>


        {mode === "register" && (
          <input
            required
            placeholder="Name"
            value={f.name}
            onChange={(e) =>
              setF({
                ...f,
                name:
                  e.target.value,
              })
            }
          />
        )}


        <input
          required
          type="email"
          placeholder="Email"
          value={f.email}
          onChange={(e) =>
            setF({
              ...f,
              email:
                e.target.value,
            })
          }
        />


        <input
          required
          type="password"
          placeholder="Password"
          value={f.password}
          onChange={(e) =>
            setF({
              ...f,
              password:
                e.target.value,
            })
          }
        />


        {mode === "register" && (
          <select
            value={f.goal}
            onChange={(e) =>
              setF({
                ...f,
                goal:
                  e.target.value,
              })
            }
          >
            <option>
              Become a Data Scientist
            </option>

            <option>
              Become a Full Stack Developer
            </option>

            <option>
              Become an AI Engineer
            </option>
          </select>
        )}


        {err && (
          <div className="error">
            {err}
          </div>
        )}


        <button
          className="primary full"
        >
          {mode === "login"
            ? "Login"
            : "Create account"}
        </button>


        <button
          type="button"
          className="link"
          onClick={() =>
            setMode(
              mode === "login"
                ? "register"
                : "login"
            )
          }
        >
          {mode === "login"
            ? "Create account"
            : "Login instead"}
        </button>


        {mode === "login" && (
          <small>
            Demo:
            demo@mentorai.local / demo123
          </small>
        )}

      </form>

    </div>
  );
}


/* =====================================================
   SHELL
===================================================== */

function Shell({
  user,
  setUser,
  page,
  setPage,
  logout,
}) {
  return (
    <div className="app">

      <aside>

        <div className="brand">

          <div className="logo">
            <Sparkles size={18} />
          </div>

          <b>
            Mentor
            <span>AI</span>
          </b>

        </div>


        {NAV.map(
          ([id, label, Icon]) => (
            <button
              className={
                "nav " +
                (page === id
                  ? "active"
                  : "")
              }
              onClick={() =>
                setPage(id)
              }
              key={id}
            >
              <Icon size={17} />

              <span>
                {label}
              </span>
            </button>
          )
        )}


        <div className="bottom">

          <button
            className="profile"
            onClick={() =>
              setPage("profile")
            }
          >

            <i>
              {user.name?.[0] ||
                "U"}
            </i>

            <span>

              {user.name}

              <small>
                {(
                  user.goal ||
                  "Student"
                ).replace(
                  "Become a ",
                  ""
                )}
              </small>

            </span>

          </button>


          <button
            className="logout"
            onClick={logout}
          >
            <LogOut size={14} />
            Logout
          </button>

        </div>

      </aside>


      <main>

        <header>

          <div>

            <small>
              MENTOR AI / {page}
            </small>

            <h1>

              {page ===
              "dashboard"
                ? `Good evening, ${user.name} 👋`
                : page ===
                  "profile"
                ? "Your Profile"
                : page
                    .charAt(0)
                    .toUpperCase() +
                  page.slice(1)}

            </h1>

          </div>


          <div className="headchips">

            <span>
              🔥 {user.streak || 0} days
            </span>

            <span>
              ⚡ {user.xp || 0} XP
            </span>

          </div>

        </header>


        {page ===
          "dashboard" && (
          <Dashboard
            user={user}
            setUser={setUser}
            go={setPage}
          />
        )}


        {page ===
          "roadmap" && (
          <Roadmap
            user={user}
            setUser={setUser}
          />
        )}


        {page ===
          "mentor" && (
          <Mentor />
        )}


        {page ===
          "skills" && (
          <Skills
            user={user}
            setUser={setUser}
          />
        )}


        {page ===
          "focus" && (
          <Focus />
        )}


        {page ===
          "notes" && (
          <Notes />
        )}


        {page ===
          "activity" && (
          <ActivityPage />
        )}


        {page ===
          "achievements" && (
          <Achievements />
        )}


        {page ===
          "profile" && (
          <Profile
            user={user}
            setUser={setUser}
          />
        )}


        <footer>
          Mentor AI • Adaptive Learning Platform
        </footer>

      </main>

    </div>
  );
}


/* =====================================================
   DASHBOARD
===================================================== */
function Dashboard({
  user,
  setUser,
  go,
}) {
  const [roadmap, setRoadmap] = useState([]);
  const [quizSkill, setQuizSkill] = useState(null);

  const loadRoadmap = () => {
    api("/api/roadmap")
      .then((d) => setRoadmap(d.roadmap))
      .catch(console.error);
  };

  useEffect(() => {
    loadRoadmap();
  }, []);

  /* =========================
     TIME BASED GREETING
  ========================= */

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
      ? "Good afternoon"
      : "Good evening";

  /* =========================
     ROADMAP DATA
  ========================= */

  const allTasks = roadmap.flatMap(
    (week) => week.tasks || []
  );

  const completedTasks = allTasks.filter(
    (task) => task.done
  );

  const remainingTasks = allTasks.filter(
    (task) => !task.done
  );

  const progress = allTasks.length
    ? Math.round(
        (completedTasks.length /
          allTasks.length) *
          100
      )
    : 0;

  const todayTask = remainingTasks[0];

  /* =========================
     SKILL ANALYSIS
  ========================= */

  const skillEntries = Object.entries(
    user.skills || {}
  );

  const sortedSkills = [...skillEntries].sort(
    (a, b) => a[1] - b[1]
  );

  const weakestSkill =
    sortedSkills[0] || [
      "Not assessed",
      0,
    ];

  const strongestSkill =
    [...skillEntries].sort(
      (a, b) => b[1] - a[1]
    )[0] || [
      "Not assessed",
      0,
    ];

  /* =========================
     PERSONALIZED RECOMMENDATION
  ========================= */

  function recommendation() {
    if (!todayTask) {
      return {
        title: "Your roadmap is complete 🎉",
        text:
          "Take a verification challenge to prove your knowledge and unlock your next learning stage.",
        action: "Verify knowledge",
      };
    }

    if (weakestSkill[1] < 50) {
      return {
        title: `Strengthen ${weakestSkill[0]}`,
        text:
          `${weakestSkill[0]} is currently your weakest demonstrated skill. Focus on fundamentals before moving ahead.`,
        action: `Verify ${weakestSkill[0]}`,
      };
    }

    if (user.streak < 3) {
      return {
        title: "Build your consistency",
        text:
          "You don't need a long session today. Complete one focused learning task and keep your streak alive.",
        action: "Continue learning",
      };
    }

    return {
      title: "Keep your momentum",
      text:
        "Your skills are progressing. Complete today's task and verify what you learned.",
      action: "Continue learning",
    };
  }

  const aiRecommendation =
    recommendation();

  /* =========================
     COMPLETE TASK
  ========================= */

  async function completeTask() {
    if (!todayTask) return;

    try {
      const d = await api(
        `/api/tasks/${todayTask.id}/complete`,
        {
          method: "POST",
        }
      );

      setUser(d.user);
      loadRoadmap();
    } catch (error) {
      console.error(error);
    }
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="page">

      {/* =========================
          PERSONALIZED HERO
      ========================= */}

      <section className="hero personalizedHero">

        <div>

          <small>
            ✦ YOUR PERSONAL LEARNING DASHBOARD
          </small>

          <h2>
            {greeting},{" "}
            <em>{user.name}</em> 👋
          </h2>

          <p>
            You're working toward{" "}
            <strong>
              {user.goal || "your learning goal"}
            </strong>
            .
          </p>

          <p>
            You've planned{" "}
            <strong>
              {user.dailyMinutes || 60} minutes
            </strong>{" "}
            of focused learning today.
          </p>

          <div className="actions">

            <button
              className="primary"
              onClick={() => go("roadmap")}
            >
              Continue learning
              <ArrowRight size={15} />
            </button>

            <button
              className="secondary"
              onClick={() =>
                setQuizSkill(weakestSkill[0])
              }
            >
              Verify {weakestSkill[0]}
            </button>

          </div>

        </div>

        <div className="heroGoal">

          <div className="goalCircle">
            <strong>
              {progress}%
            </strong>

            <small>
              roadmap
            </small>
          </div>

          <small>
            Current goal
          </small>

          <b>
            {user.goal}
          </b>

        </div>

      </section>


      {/* =========================
          PERSONAL STATS
      ========================= */}

      <div className="stats">

        <Stat
          i={<Target />}
          l="Roadmap"
          v={`${progress}%`}
        />

        <Stat
          i={<Zap />}
          l="XP"
          v={user.xp || 0}
        />

        <Stat
          i={<Clock3 />}
          l="Daily goal"
          v={`${user.dailyMinutes || 60}m`}
        />

        <Stat
          i={<Flame />}
          l="Streak"
          v={`${user.streak || 0}d`}
        />

      </div>


      {/* =========================
          TODAY + AI RECOMMENDATION
      ========================= */}

      <div className="two">

        {/* TODAY */}

        <section className="card dashboardToday">

          <div className="sectionHeader">

            <div>
              <small>
                TODAY'S FOCUS
              </small>

              <h3>
                {todayTask
                  ? todayTask.title
                  : "Everything completed 🎉"}
              </h3>
            </div>

            <span className="statusBadge">
              {todayTask
                ? "NEXT"
                : "DONE"}
            </span>

          </div>

          {todayTask ? (
            <>
              <p>
                Your next learning activity is{" "}
                <strong>
                  {todayTask.skill}
                </strong>
                .
              </p>

              <div className="taskMeta">

                <span>
                  ⏱ {todayTask.minutes} min
                </span>

                <span>
                  📚 {todayTask.type}
                </span>

                <span>
                  🎯 {todayTask.skill}
                </span>

              </div>

              <div className="actions">

                <button
                  className="primary"
                  onClick={completeTask}
                >
                  <CheckCircle2 size={15} />
                  Mark complete
                </button>

                <button
                  className="secondary"
                  onClick={() =>
                    setQuizSkill(
                      todayTask.skill
                    )
                  }
                >
                  <CircleHelp size={15} />
                  Verify
                </button>

              </div>
            </>
          ) : (
            <button
              className="primary"
              onClick={() =>
                setQuizSkill(
                  weakestSkill[0]
                )
              }
            >
              Verify your knowledge
            </button>
          )}

        </section>


        {/* AI RECOMMENDATION */}

        <section className="card aiRecommendation">

          <div className="aiIcon">
            <Sparkles size={18} />
          </div>

          <small>
            AI RECOMMENDATION
          </small>

          <h3>
            {aiRecommendation.title}
          </h3>

          <p>
            {aiRecommendation.text}
          </p>

          <button
            className="link"
            onClick={() => {

              if (
                aiRecommendation.action.includes(
                  "Verify"
                )
              ) {
                setQuizSkill(
                  weakestSkill[0]
                );
              } else {
                go("roadmap");
              }

            }}
          >
            {aiRecommendation.action}
            <ChevronRight size={14} />
          </button>

        </section>

      </div>


      {/* =========================
          SKILL MAP
      ========================= */}

      <section className="card">

        <div className="sectionHeader">

          <div>

            <small>
              PERSONALIZED SKILL MAP
            </small>

            <h3>
              Your demonstrated knowledge
            </h3>

          </div>

          <button
            className="link"
            onClick={() => go("skills")}
          >
            View skill map
            <ChevronRight size={14} />
          </button>

        </div>


        <div className="skillSummary">

          <div>

            <span>
              Strongest
            </span>

            <strong>
              {strongestSkill[0]}
            </strong>

            <b>
              {strongestSkill[1]}%
            </b>

          </div>


          <div>

            <span>
              Needs attention
            </span>

            <strong>
              {weakestSkill[0]}
            </strong>

            <b>
              {weakestSkill[1]}%
            </b>

          </div>

        </div>


        <Bars
          s={user.skills || {}}
        />

      </section>


      {/* =========================
          LEARNING PROGRESS
      ========================= */}

      <section className="card">

        <small>
          LEARNING JOURNEY
        </small>

        <h3>
          {completedTasks.length} of{" "}
          {allTasks.length} tasks completed
        </h3>

        <div className="bigProgress">

          <div
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="progressLabels">

          <span>
            {progress}% complete
          </span>

          <span>
            {remainingTasks.length} tasks remaining
          </span>

        </div>

      </section>


      {/* =========================
          CONSISTENCY
      ========================= */}

      <section className="card consistencyCard">

        <div className="consistencyIcon">
          🔥
        </div>

        <div>

          <small>
            CONSISTENCY
          </small>

          <h3>
            {user.streak || 0} day streak
          </h3>

          <p>
            {user.streak >= 7
              ? "Excellent consistency. Keep the momentum going."
              : user.streak >= 3
              ? "You're building a habit. Keep going."
              : "Complete today's task to start building your streak."}
          </p>

        </div>

      </section>


      {/* =========================
          QUIZ MODAL
      ========================= */}

      {quizSkill && (
        <Quiz
          skill={quizSkill}
          close={() =>
            setQuizSkill(null)
          }
          done={(d) => {
            setUser(d.user);
            setQuizSkill(null);
            loadRoadmap();
          }}
        />
      )}

    </div>
  );
}


/* =====================================================
   STAT
===================================================== */

function Stat({
  i,
  l,
  v,
}) {
  return (
    <div className="stat">

      <div>
        {i}
      </div>

      <small>
        {l}
      </small>

      <strong>
        {v}
      </strong>

    </div>
  );
}


/* =====================================================
   BARS
===================================================== */

function Bars({ s }) {
  return (
    <div className="bars">

      {Object.entries(s).map(
        ([k, v]) => (
          <div key={k}>

            <label>
              {k}

              <b>
                {v}%
              </b>
            </label>

            <div className="track">

              <i
                style={{
                  width:
                    `${v}%`,
                }}
              />

            </div>

          </div>
        )
      )}

    </div>
  );
}


/* =====================================================
   ROADMAP
===================================================== */

function Roadmap({
  user,
  setUser,
}) {
  const [r, setR] =
    useState([]);

  const [q, setQ] =
    useState(null);


  const load = () =>
    api("/api/roadmap")
      .then((d) =>
        setR(d.roadmap)
      );


  useEffect(() => {
    load();
  }, []);


  async function done(id) {
    const d =
      await api(
        `/api/tasks/${id}/complete`,
        {
          method: "POST",
        }
      );

    setUser(d.user);

    load();
  }


  return (
    <div className="page narrow">

      <div className="intro">

        <div>

          <small>
            AI-GENERATED PATH
          </small>

          <h2>
            From beginner to Data Scientist
          </h2>

          <p>
            Your path adapts after verification.
          </p>

        </div>

        <span>
          {user.goal}
        </span>

      </div>


      {r.map(
        (w, i) => (
          <section
            className="week"
            key={
              w.id || i
            }
          >

            <div className="marker">
              {i + 1}
            </div>


            <div className="weekcard">

              <div className="row">

                <div>

                  <small>
                    WEEK {w.week}
                  </small>

                  <h3>
                    {w.title}
                  </h3>

                </div>

                <b>
                  {w.progress}%
                </b>

              </div>


              <div className="track">

                <i
                  style={{
                    width:
                      `${w.progress}%`,
                  }}
                />

              </div>


              {w.tasks.map(
                (t) => (
                  <div
                    className="task"
                    key={t.id}
                  >

                    <div className="check">

                      {t.done ? (
                        <CheckCircle2
                          size={16}
                        />
                      ) : (
                        <span />
                      )}

                    </div>


                    <div className="taskmain">

                      <b>
                        {t.title}
                      </b>

                      <small>
                        {t.type} •{" "}
                        {t.minutes} min •{" "}
                        {t.skill}
                      </small>

                    </div>


                    {!t.done && (
                      <button
                        onClick={() =>
                          done(t.id)
                        }
                      >
                        Done
                      </button>
                    )}


                    <button
                      className="verify"
                      onClick={() =>
                        setQ(t.skill)
                      }
                    >
                      <CircleHelp
                        size={14}
                      />
                    </button>

                  </div>
                )
              )}

            </div>

          </section>
        )
      )}


      {q && (
        <Quiz
          skill={q}
          close={() =>
            setQ(null)
          }
          done={(d) => {
            setUser(d.user);
            setQ(null);
            load();
          }}
        />
      )}

    </div>
  );
}


/* =====================================================
   QUIZ
===================================================== */

function Quiz({
  skill,
  close,
  done,
}) {
  const [q, setQ] =
    useState(null);

  const [a, setA] =
    useState([]);

  const [res, setRes] =
    useState(null);


  useEffect(() => {
    api(
      "/api/quiz/" +
        encodeURIComponent(
          skill
        )
    ).then((d) => {

      setQ(
        d.questions
      );

      setA(
        Array(
          d.questions.length
        ).fill(null)
      );

    });
  }, [skill]);


  async function submit() {
    const d =
      await api(
        "/api/quiz/" +
          encodeURIComponent(
            skill
          ) +
          "/submit",
        {
          method: "POST",

          body:
            JSON.stringify({
              answers: a,
            }),
        }
      );

    setRes(d);

    done(d);
  }


  if (!q) {
    return (
      <div className="modalbg">

        <div className="modal">
          Loading...
        </div>

      </div>
    );
  }


  return (
    <div className="modalbg">

      <div className="modal">

        <button
          className="close"
          onClick={close}
        >
          <X />
        </button>


        {!res ? (
          <>

            <small>
              KNOWLEDGE VERIFICATION
            </small>

            <h2>
              Verify {skill}
            </h2>


            {q.map(
              (x, i) => (
                <div
                  className="qq"
                  key={i}
                >

                  <b>
                    {i + 1}. {x.q}
                  </b>


                  {x.options.map(
                    (o, j) => (
                      <button
                        className={
                          a[i] === j
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setA(
                            (v) =>
                              v.map(
                                (
                                  old,
                                  k
                                ) =>
                                  k === i
                                    ? j
                                    : old
                              )
                          )
                        }
                        key={o}
                      >
                        {o}
                      </button>
                    )
                  )}

                </div>
              )
            )}


            <button
              className="primary full"
              disabled={
                a.includes(null)
              }
              onClick={submit}
            >
              Submit verification
            </button>

          </>
        ) : (
          <>

            <h2>
              {res.score}%
              {" "}
              demonstrated
            </h2>

            <p>
              {res.recommendation.body}
            </p>

            <b>
              Next:{" "}
              {res.recommendation.next}
            </b>

            <button
              className="primary full"
              onClick={close}
            >
              Continue
            </button>

          </>
        )}

      </div>

    </div>
  );
}


/* =====================================================
   VIRTUAL AVATAR COMPONENT
===================================================== */

function VirtualAvatar({ state = "idle", avatarType = "aria", setAvatarType }) {
  const [blink, setBlink] = useState(false);
  const [mouthPhase, setMouthPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state === "speaking") {
      const interval = setInterval(() => {
        setMouthPhase((prev) => (prev + 1) % 4);
      }, 120);
      return () => clearInterval(interval);
    }
  }, [state]);

  const personas = {
    aria: {
      name: "Aria",
      role: "Cyber AI Mentor",
      primaryColor: "#7258f5",
      accentColor: "#00f2fe",
      bgGradient: "radial-gradient(circle, #2d2060 0%, #151326 100%)",
      eyeColor: "#00f2fe"
    },
    atlas: {
      name: "Atlas",
      role: "Sage Academic",
      primaryColor: "#f59e0b",
      accentColor: "#fef08a",
      bgGradient: "radial-gradient(circle, #451a03 0%, #180902 100%)",
      eyeColor: "#fbbf24"
    },
    spark: {
      name: "Spark",
      role: "Coding Buddy",
      primaryColor: "#10b981",
      accentColor: "#a7f3d0",
      bgGradient: "radial-gradient(circle, #064e3b 0%, #022c22 100%)",
      eyeColor: "#34d399"
    }
  };

  const persona = personas[avatarType] || personas.aria;

  const getStatusText = () => {
    switch (state) {
      case "listening": return "Listening to you...";
      case "thinking": return "Analyzing response...";
      case "speaking": return "Explaining concept...";
      default: return `${persona.name} • Ready to help`;
    }
  };

  return (
    <div className="virtualAvatarContainer">
      <div
        className={`avatarCanvasCard avatarState-${state}`}
        style={{ background: persona.bgGradient }}
      >
        <div
          className={`avatarGlowRing ${state}`}
          style={{ borderColor: persona.accentColor }}
        />

        {state === "speaking" && (
          <div className="soundWaves">
            <span style={{ borderColor: persona.accentColor }} />
            <span style={{ borderColor: persona.primaryColor }} />
            <span style={{ borderColor: persona.accentColor }} />
          </div>
        )}

        <div className="avatarHeadWrapper">
          <svg viewBox="0 0 200 200" className="avatarSvg">
            <defs>
              <linearGradient id={`grad-${avatarType}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={persona.primaryColor} />
                <stop offset="100%" stopColor={persona.accentColor} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <path
              d="M 60 160 Q 100 130 140 160 L 160 200 L 40 200 Z"
              fill={`url(#grad-${avatarType})`}
              opacity="0.75"
            />

            <rect
              x="50"
              y="40"
              width="100"
              height="100"
              rx="30"
              fill="#1e1b2e"
              stroke={`url(#grad-${avatarType})`}
              strokeWidth="3"
            />

            <circle cx="100" cy="25" r="7" fill={persona.accentColor} filter="url(#glow)" />
            <line x1="100" y1="25" x2="100" y2="40" stroke={persona.primaryColor} strokeWidth="3" />

            <rect x="38" y="70" width="12" height="30" rx="5" fill={persona.primaryColor} />
            <rect x="150" y="70" width="12" height="30" rx="5" fill={persona.primaryColor} />

            <rect x="62" y="55" width="76" height="70" rx="16" fill="#0c0a17" stroke="#ffffff22" strokeWidth="1" />

            {state === "thinking" ? (
              <g filter="url(#glow)">
                <circle cx="82" cy="82" r="10" fill="none" stroke={persona.accentColor} strokeWidth="3" strokeDasharray="10 5" className="spinEye" />
                <circle cx="118" cy="82" r="10" fill="none" stroke={persona.accentColor} strokeWidth="3" strokeDasharray="10 5" className="spinEyeReverse" />
              </g>
            ) : blink ? (
              <g stroke={persona.eyeColor} strokeWidth="4" strokeLinecap="round">
                <line x1="74" y1="82" x2="90" y2="82" />
                <line x1="110" y1="82" x2="126" y2="82" />
              </g>
            ) : (
              <g fill={persona.eyeColor} filter="url(#glow)">
                <circle cx="82" cy="82" r={state === "listening" ? "10" : "8"} />
                <circle cx="118" cy="82" r={state === "listening" ? "10" : "8"} />
                <circle cx="84" cy="80" r="3" fill="#ffffff" />
                <circle cx="120" cy="80" r="3" fill="#ffffff" />
              </g>
            )}

            {state === "speaking" ? (
              <rect
                x="85"
                y="105"
                width="30"
                height={6 + mouthPhase * 4}
                rx="4"
                fill={persona.accentColor}
                filter="url(#glow)"
              />
            ) : state === "listening" ? (
              <circle cx="100" cy="108" r="5" fill={persona.primaryColor} />
            ) : state === "thinking" ? (
              <line x1="88" y1="108" x2="112" y2="108" stroke={persona.primaryColor} strokeWidth="3" strokeLinecap="round" />
            ) : (
              <path d="M 85 105 Q 100 115 115 105" fill="none" stroke={persona.primaryColor} strokeWidth="3" strokeLinecap="round" />
            )}
          </svg>
        </div>

        <div className="avatarStatusPill">
          <span className={`statusDot ${state}`} />
          <span className="statusText">{getStatusText()}</span>
        </div>
      </div>

      <div className="avatarToolbar">
        <div className="personaSelector">
          <small>VIRTUAL AVATAR:</small>
          <div className="personaButtons">
            {Object.keys(personas).map((key) => (
              <button
                key={key}
                className={avatarType === key ? "activePersona" : ""}
                onClick={() => setAvatarType && setAvatarType(key)}
              >
                {personas[key].name} ({personas[key].role})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* =====================================================
   AI MENTOR
===================================================== */

function Mentor() {
  const [avatarType, setAvatarType] = useState("aria");

  const [m, setM] =
    useState([
      {
        r: "ai",

        t:
          "Hi! I'm your Mentor AI. What are you learning today?",
      },
    ]);

  const [x, setX] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  const lastMsg = m[m.length - 1];
  const isSpeaking = lastMsg && lastMsg.r === "ai" && (lastMsg.streaming || loading);
  const avatarState = listening
    ? "listening"
    : loading && !lastMsg?.t
    ? "thinking"
    : isSpeaking
    ? "speaking"
    : "idle";


  const recognitionRef =
    React.useRef(null);


  /* =========================================
     TEXT TO SPEECH
  ========================================= */

  function speak(text) {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText =
      text
        .replace(
          /[*#`]/g,
          ""
        )
        .trim();

    if (!cleanText) {
      return;
    }

    const utterance =
      new SpeechSynthesisUtterance(
        cleanText
      );

    utterance.rate =
      1.05;

    utterance.pitch =
      1;

    utterance.volume =
      1;

    window.speechSynthesis.speak(
      utterance
    );
  }


  /* =========================================
     STOP SPEAKING
  ========================================= */

  function stopSpeaking() {
    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }
  }


  /* =========================================
     VOICE INPUT
  ========================================= */

  function startVoice() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Try Chrome or Edge."
      );

      return;
    }


    if (listening) {
      recognitionRef.current?.stop();

      setListening(false);

      return;
    }


    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-IN";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;


    recognition.onstart =
      () => {
        setListening(true);
      };


    recognition.onresult =
      (event) => {
        const transcript =
          event
            .results[0][0]
            .transcript;

        setX(
          transcript
        );

        setListening(false);

        setTimeout(() => {
          sendMessage(
            transcript
          );
        }, 100);
      };


    recognition.onerror =
      (event) => {
        console.error(
          "Speech recognition error:",
          event.error
        );

        setListening(false);
      };


    recognition.onend =
      () => {
        setListening(false);
      };


    recognitionRef.current =
      recognition;


    recognition.start();
  }


  /* =========================================
     SEND MESSAGE
  ========================================= */

  async function sendMessage(
    message
  ) {
    const text =
      String(
        message || ""
      ).trim();

    if (
      !text ||
      loading
    ) {
      return;
    }


    setX("");


    setM((v) => [
      ...v,

      {
        r: "u",
        t: text,
      },

      {
        r: "ai",
        t: "",
        streaming: true,
      },
    ]);


    setLoading(true);


    let answer = "";


    try {
      await streamChat(
        text,
        (chunk) => {
          answer += chunk;


          setM(
            (messages) => {
              const copy =
                [...messages];

              const last =
                copy.length - 1;

              copy[last] = {
                ...copy[last],

                t:
                  answer,

                streaming:
                  true,
              };

              return copy;
            }
          );
        }
      );


      setM(
        (messages) => {
          const copy =
            [...messages];

          const last =
            copy.length - 1;

          copy[last] = {
            ...copy[last],

            t:
              answer.trim(),

            streaming:
              false,
          };

          return copy;
        }
      );


      // Speak the completed answer.
      if (
        answer.trim()
      ) {
        speak(
          answer.trim()
        );
      }

    } catch (error) {
      console.error(
        "Mentor error:",
        error
      );


      setM(
        (messages) => {
          const copy =
            [...messages];

          const last =
            copy.length - 1;

          copy[last] = {
            r: "ai",

            t:
              "Sorry, I couldn't connect to Mentor AI.",

            streaming:
              false,
          };

          return copy;
        }
      );

    } finally {
      setLoading(false);
    }
  }


  /* =========================================
     NORMAL SEND
  ========================================= */

  function send() {
    sendMessage(x);
  }


  /* =========================================
     CLEANUP
  ========================================= */

  useEffect(() => {
    return () => {

      recognitionRef
        .current
        ?.stop();

      if (
        "speechSynthesis" in
        window
      ) {
        window.speechSynthesis.cancel();
      }

    };
  }, []);


  return (
    <div className="page narrow">


      {/* =====================================
          HEADER
      ===================================== */}

      <section className="mentor">

        <div>
          <Sparkles />
        </div>

        <article>

          <small>
            YOUR PERSONAL AI MENTOR
          </small>

          <h2>
            Learn smarter, not just longer.
          </h2>

          <p>
            Explain • plan • verify • adapt.
          </p>

        </article>

      </section>


      {/* =====================================
          VIRTUAL AVATAR DISPLAY
      ===================================== */}

      <VirtualAvatar
        state={avatarState}
        avatarType={avatarType}
        setAvatarType={setAvatarType}
      />


      {/* =====================================
          QUICK QUESTIONS
      ===================================== */}

      <div className="quick">

        <button
          disabled={loading}
          onClick={() =>
            sendMessage(
              "What should I focus on next?"
            )
          }
        >
          What next?
        </button>


        <button
          disabled={loading}
          onClick={() =>
            sendMessage(
              "What are my weak skills?"
            )
          }
        >
          Weak skills
        </button>


        <button
          disabled={loading}
          onClick={() =>
            sendMessage(
              "Give me a quick Pandas tip."
            )
          }
        >
          Pandas tip
        </button>

      </div>


      {/* =====================================
          CHAT
      ===================================== */}

      <section className="chat">

        <div className="messages">

          {m.map(
            (z, i) => (
              <div
                className={
                  "msg " +
                  z.r
                }
                key={i}
              >

                <small>
                  {z.r === "ai"
                    ? "Mentor AI"
                    : "You"}
                </small>


                <p>

                  {z.t}

                  {z.streaming &&
                    loading && (
                      <span className="typing">
                        ▌
                      </span>
                    )}

                </p>

              </div>
            )
          )}

        </div>


        {/* =====================================
            CHAT INPUT
        ===================================== */}

        <div className="chatinput">

          <input
            value={x}
            disabled={
              loading
            }
            onChange={(e) =>
              setX(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                send();
              }
            }}
            placeholder={
              listening
                ? "Listening..."
                : loading
                ? "Mentor is thinking..."
                : "Ask your mentor..."
            }
          />


          {/* VOICE INPUT */}

          <button
            type="button"
            className={
              listening
                ? "voice active"
                : "voice"
            }
            onClick={
              startVoice
            }
            disabled={
              loading
            }
            title={
              listening
                ? "Stop listening"
                : "Voice input"
            }
          >
            🎤
          </button>


          {/* STOP SPEECH */}

          <button
            type="button"
            className="voice"
            onClick={
              stopSpeaking
            }
            title="Stop voice"
          >
            🔇
          </button>


          {/* SEND */}

          <button
            onClick={send}
            disabled={
              loading ||
              !x.trim()
            }
          >
            {loading ? (
              "..."
            ) : (
              <Send size={15} />
            )}
          </button>

        </div>

      </section>

    </div>
  );
}


/* =====================================================
   SKILLS
===================================================== */

function Skills({
  user,
  setUser,
}) {
  const entries =
    Object.entries(
      user.skills || {}
    );

  const weak =
    entries.sort(
      (a, b) =>
        a[1] - b[1]
    )[0];

  const [q, setQ] =
    useState(null);


  return (
    <div className="page narrow">

      <section className="card">

        <small>
          DEMONSTRATED KNOWLEDGE
        </small>

        <h3>
          Your skill map
        </h3>

        <p>
          Scores change through verification,
          not only task completion.
        </p>

        <Bars
          s={
            user.skills || {}
          }
        />

      </section>


      {weak && (
        <section className="card">

          <small>
            GROWTH AREA
          </small>

          <h3>
            {weak[0]} — {weak[1]}%
          </h3>

          <p>
            Take a targeted verification
            to update this skill.
          </p>

          <button
            className="primary"
            onClick={() =>
              setQ(
                weak[0]
              )
            }
          >
            Verify {weak[0]}
          </button>

        </section>
      )}


      {q && (
        <Quiz
          skill={q}
          close={() =>
            setQ(null)
          }
          done={(d) => {
            setUser(d.user);
            setQ(null);
          }}
        />
      )}

    </div>
  );
}


/* =====================================================
   FOCUS TIMER
===================================================== */

function Focus() {
  const [s, setS] =
    useState(1500);

  const [run, setRun] =
    useState(false);


  useEffect(() => {
    if (!run) {
      return;
    }

    const id =
      setInterval(() => {
        setS((x) =>
          x <= 1
            ? (
                setRun(false),
                0
              )
            : x - 1
        );
      }, 1000);

    return () =>
      clearInterval(id);

  }, [run]);


  return (
    <div className="focus">

      <small>
        FOCUS SESSION
      </small>


      <div className="clock">

        {String(
          Math.floor(
            s / 60
          )
        ).padStart(
          2,
          "0"
        )}

        :

        {String(
          s % 60
        ).padStart(
          2,
          "0"
        )}

      </div>


      <p>
        One task. No distractions.
      </p>


      <button
        className="primary"
        onClick={() =>
          setRun(!run)
        }
      >

        {run ? (
          <Pause />
        ) : (
          <Play />
        )}

        {run
          ? "Pause"
          : "Start"}

      </button>


      <button
        className="secondary"
        onClick={() => {
          setRun(false);
          setS(1500);
        }}
      >
        <RotateCcw />
        Reset
      </button>

    </div>
  );
}


/* =====================================================
   NOTES
===================================================== */

function Notes() {
  const [n, setN] =
    useState([]);

  const [t, setT] =
    useState("");

  const [b, setB] =
    useState("");


  const load = () =>
    api("/api/notes")
      .then((d) =>
        setN(d.notes)
      );


  useEffect(() => {
    load();
  }, []);


  async function add() {
    if (!b.trim()) {
      return;
    }

    await api(
      "/api/notes",
      {
        method: "POST",

        body:
          JSON.stringify({
            title: t,
            body: b,
          }),
      }
    );

    setT("");
    setB("");

    load();
  }


  return (
    <div className="page narrow">

      <section className="card">

        <small>
          LEARNING NOTES
        </small>


        <input
          className="field"
          value={t}
          onChange={(e) =>
            setT(
              e.target.value
            )
          }
          placeholder="Title"
        />


        <textarea
          className="field area"
          value={b}
          onChange={(e) =>
            setB(
              e.target.value
            )
          }
          placeholder="Write what you learned..."
        />


        <button
          className="primary"
          onClick={add}
        >
          <Plus size={14} />
          Save note
        </button>

      </section>


      {n.map(
        (x) => (
          <article
            className="note"
            key={x.id}
          >

            <div>

              <small>
                {new Date(
                  x.createdAt
                ).toLocaleString()}
              </small>

              <h3>
                {x.title}
              </h3>

              <p>
                {x.body}
              </p>

            </div>


            <button
              onClick={async () => {

                await api(
                  "/api/notes/" +
                    x.id,
                  {
                    method:
                      "DELETE",
                  }
                );

                load();

              }}
            >
              <Trash2
                size={14}
              />
            </button>

          </article>
        )
      )}

    </div>
  );
}


/* =====================================================
   ACTIVITY
===================================================== */

function ActivityPage() {
  const [a, setA] =
    useState([]);


  useEffect(() => {
    api("/api/activities")
      .then((d) =>
        setA(
          d.activities
        )
      );
  }, []);


  return (
    <div className="page narrow card">

      <small>
        LEARNING HISTORY
      </small>

      <h3>
        Recent activity
      </h3>


      {a.map(
        (x) => (
          <div
            className="activity"
            key={x.id}
          >

            <b>
              ✓
            </b>

            <span>

              {x.title}

              <small>
                {new Date(
                  x.createdAt
                ).toLocaleString()}
              </small>

            </span>

          </div>
        )
      )}

    </div>
  );
}


/* =====================================================
   ACHIEVEMENTS
===================================================== */

function Achievements() {
  const [a, setA] =
    useState([]);


  useEffect(() => {
    api("/api/achievements")
      .then((d) =>
        setA(
          d.achievements
        )
      );
  }, []);


  return (
    <div className="achievementgrid">

      {a.map(
        (x) => (
          <article
            className={
              x.unlocked
                ? "unlocked"
                : ""
            }
            key={x.id}
          >

            <strong>
              {x.unlocked
                ? "🏆"
                : "🔒"}
            </strong>


            <div>

              <h3>
                {x.title}
              </h3>

              <p>
                {x.description}
              </p>

            </div>

          </article>
        )
      )}

    </div>
  );
}


/* =====================================================
   PROFILE
===================================================== */

function Profile({
  user,
  setUser,
}) {
  const [p, setP] =
    useState({
      ...user,
    });


  const [ok, setOk] =
    useState(false);


  async function save() {
    const d =
      await api(
        "/api/me",
        {
          method: "PUT",

          body:
            JSON.stringify({
              name:
                p.name,

              goal:
                p.goal,

              level:
                p.level,

              dailyMinutes:
                p.dailyMinutes,
            }),
        }
      );


    setUser(
      d.user
    );

    setOk(true);


    setTimeout(
      () => {
        setOk(false);
      },
      1000
    );
  }


  return (
    <div className="page narrow card">

      <small>
        YOUR PROFILE
      </small>


      <h3>
        Personalize Mentor AI
      </h3>


      <label>

        Name

        <input
          className="field"
          value={
            p.name || ""
          }
          onChange={(e) =>
            setP({
              ...p,
              name:
                e.target.value,
            })
          }
        />

      </label>


      <label>

        Goal

        <select
          className="field"
          value={
            p.goal ||
            "Become a Data Scientist"
          }
          onChange={(e) =>
            setP({
              ...p,
              goal:
                e.target.value,
            })
          }
        >

          <option>
            Become a Data Scientist
          </option>

          <option>
            Become a Full Stack Developer
          </option>

          <option>
            Become an AI Engineer
          </option>

        </select>

      </label>


      <label>

        Daily minutes

        <select
          className="field"
          value={
            p.dailyMinutes ||
            120
          }
          onChange={(e) =>
            setP({
              ...p,
              dailyMinutes:
                +e.target.value,
            })
          }
        >

          <option value="60">
            60
          </option>

          <option value="90">
            90
          </option>

          <option value="120">
            120
          </option>

          <option value="180">
            180
          </option>

        </select>

      </label>


      <button
        className="primary"
        onClick={save}
      >
        {ok
          ? "Saved ✓"
          : "Save profile"}
      </button>

    </div>
  );
}
