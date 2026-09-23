export const Q = {
  Pandas: [
    [
      "Which accessor is label based?",
      ["iloc", "loc", "shape", "dtype"],
      1,
    ],
    [
      "Which detects missing values?",
      ["isna()", "head()", "astype()", "sort_values()"],
      0,
    ],
    [
      "Which groups rows?",
      ["groupby()", "merge()", "concat()", "rename()"],
      0,
    ],
    [
      "Which is integer-position based?",
      ["loc", "iloc", "at", "columns"],
      1,
    ],
  ],

  Python: [
    [
      "Which stores key-value pairs?",
      ["List", "Tuple", "Dictionary", "Set"],
      2,
    ],
    [
      "Which defines a function?",
      ["func", "define", "def", "lambda"],
      2,
    ],
    [
      "Which is mutable?",
      ["Tuple", "String", "List", "Frozen set"],
      2,
    ],
  ],

  Statistics: [
    [
      "Mean means:",
      [
        "Middle value",
        "Arithmetic average",
        "Most frequent",
        "Spread",
      ],
      1,
    ],
    [
      "Standard deviation measures:",
      [
        "Central tendency",
        "Dispersion",
        "Causality",
        "Class balance",
      ],
      1,
    ],
    [
      "p-value is used in:",
      [
        "Hypothesis testing",
        "Resizing",
        "Sorting",
        "Tokenization",
      ],
      0,
    ],
  ],

  "Machine Learning": [
    [
      "Which is classification?",
      ["House price", "Spam/not spam", "Average", "Sort"],
      1,
    ],
    [
      "Why use a test set?",
      [
        "Train faster",
        "Measure generalization",
        "Increase labels",
        "Remove features",
      ],
      1,
    ],
    [
      "Which can reduce overfitting?",
      [
        "Dropout",
        "Data leakage",
        "Duplicates",
        "Remove validation",
      ],
      0,
    ],
  ],
};


export const W = [
  [
    "py",
    "Python Foundations",
    "Python",
    [
      [
        "py-1",
        "Python functions & data structures",
        "Learn",
        30,
      ],
      [
        "py-2",
        "Practice list, dict and set operations",
        "Practice",
        35,
      ],
      [
        "py-3",
        "Clean a small dataset",
        "Challenge",
        40,
      ],
    ],
  ],

  [
    "pd",
    "NumPy & Pandas",
    "Pandas",
    [
      [
        "pd-1",
        "NumPy arrays and vectorization",
        "Learn",
        30,
        "NumPy",
      ],
      [
        "pd-2",
        "Pandas DataFrame fundamentals",
        "Learn",
        35,
        "Pandas",
      ],
      [
        "pd-3",
        "loc, iloc and filtering",
        "Practice",
        35,
        "Pandas",
      ],
      [
        "pd-4",
        "Missing values and groupby",
        "Challenge",
        40,
        "Pandas",
      ],
    ],
  ],

  [
    "st",
    "Statistics for ML",
    "Statistics",
    [
      [
        "st-1",
        "Probability foundations",
        "Learn",
        35,
      ],
      [
        "st-2",
        "Mean, variance and distributions",
        "Practice",
        40,
      ],
      [
        "st-3",
        "Hypothesis testing",
        "Challenge",
        45,
      ],
    ],
  ],

  [
    "ml",
    "Machine Learning",
    "Machine Learning",
    [
      [
        "ml-1",
        "Regression vs classification",
        "Learn",
        35,
      ],
      [
        "ml-2",
        "Train/test split and metrics",
        "Practice",
        40,
      ],
      [
        "ml-3",
        "Build your first ML pipeline",
        "Challenge",
        60,
      ],
    ],
  ],
];


export function roadmap(u) {
  return W.map((w, i) => {
    const tasks = w[3].map((t) => ({
      id: t[0],
      title: t[1],
      type: t[2],
      minutes: t[3],
      skill: t[4] || w[2],
      done: (u.tasks || []).includes(t[0]),
    }));

    return {
      week: i + 1,
      title: w[1],
      skill: w[2],
      progress: Math.round(
        (tasks.filter((t) => t.done).length /
          tasks.length) *
          100
      ),
      status: i === 0 ? "current" : "upcoming",
      tasks,
    };
  });
}


export function rec(skill, score) {
  if (score >= 85) {
    return {
      title: `${skill} is looking strong`,
      body: "Move forward and keep a short review.",
      next: "Advance to next concept",
    };
  }

  if (score >= 60) {
    return {
      title: `Keep strengthening ${skill}`,
      body: "You have the basics; use targeted practice.",
      next: `30 min focused ${skill} practice`,
    };
  }

  return {
    title: `${skill} needs another pass`,
    body:
      "Verification found knowledge gaps. Reinforce fundamentals.",
    next: `Review ${skill} fundamentals and retry`,
  };
}


// Fallback response.
// Ollama will now be used for the real Mentor chat.
export function reply(t, u) {
  const s = t.toLowerCase();

  const weak = Object.entries(u.skills).sort(
    (a, b) => a[1] - b[1]
  )[0][0];

  if (s.includes("roadmap")) {
    return `Your roadmap targets ${u.goal}. Your lowest demonstrated skill is ${weak}.`;
  }

  if (s.includes("pandas")) {
    return "Focus on loc/iloc, missing values and groupby, then take the verification quiz.";
  }

  if (s.includes("statistics")) {
    return "Focus on probability, distributions, variance and hypothesis testing.";
  }

  if (s.includes("ml")) {
    return "Target regression/classification, train/test split, metrics and feature engineering.";
  }

  if (s.includes("weak")) {
    return `Your current weakest skill is ${weak}. Try targeted practice followed by verification.`;
  }

  return `For ${u.goal}, complete one focused task and verify what you learned. I will use the result to adapt the next step.`;
}