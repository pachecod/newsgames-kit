/* ============================================================================
   QUIZ CONTENT — edit this file to change the quiz. No game logic lives here.

   Editorial rules (see CLAUDE.md):
   - Every factual question needs a `source` with a label and a working URL.
   - Questions marked `sample: true` are placeholders. Delete them or replace
     them with sourced questions before publishing.
   - Update `lastVerified` whenever you re-check the facts.
   ============================================================================ */
window.QUIZ_DATA = {
  meta: {
    title: "Spot the Standard",
    subtitle: "Five quick questions on how reporters check what they publish.",
    byline: "Your name, your class or newsroom",
    lastVerified: "2026-10-28",              // YYYY-MM-DD
    corrections: "corrections@example.com",   // where readers can report an error ("" hides this)
    note: "Sample content. Replace the questions before you publish."   // "" hides this banner
  },

  settings: {
    shuffleQuestions: false,   // true = random order each round
    shuffleChoices: true,      // true = shuffle answer order (true/false questions are never shuffled)
    questionsPerRound: 0       // 0 = ask every question; 5 = ask 5 at random from a bigger bank
  },

  // Message shown on the results screen. The first row whose minPercent the score reaches wins.
  results: [
    { minPercent: 100, message: "A perfect round." },
    { minPercent: 80,  message: "Newsroom-ready. You caught almost everything." },
    { minPercent: 50,  message: "Solid. Read the explanations on the ones you missed." },
    { minPercent: 0,   message: "A tough round. Every question has an explanation worth reading." }
  ],

  questions: [
    {
      id: "spj-principles",
      type: "multiple-choice",            // "multiple-choice" or "true-false"
      prompt: "Which of these is NOT one of the four main principles of the SPJ Code of Ethics?",
      choices: [
        "Seek truth and report it",
        "Minimize harm",
        "Act independently",
        "Maximize clicks"
      ],
      answer: 3,                           // index into `choices`, counting from 0
      explanation: "The Society of Professional Journalists builds its code on four principles: seek truth and report it, minimize harm, act independently, and be accountable and transparent. Audience size is not among them.",
      source: { label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }
    },
    {
      id: "share-count",
      type: "true-false",
      prompt: "True or false: A story that has been shared thousands of times is probably accurate.",
      choices: ["True", "False"],
      answer: 1,
      explanation: "Shares measure attention, not accuracy. False and misleading posts can spread widely because people find them surprising or upsetting.",
      sample: true
    },
    {
      id: "screenshot",
      type: "multiple-choice",
      context: "A screenshot of a \u201cBREAKING\u201d headline is spreading on social media.",
      prompt: "What is the best first step?",
      choices: [
        "Share it so more people can help check it",
        "Go to the news outlet's own website or app and see whether it published the story",
        "Check how many people have liked the post",
        "Ask the person who posted it whether it is real"
      ],
      answer: 1,
      explanation: "A screenshot can be edited or taken out of context. The outlet's own site is the quickest way to see whether the story exists and what it actually says.",
      sample: true
    },
    {
      id: "circular-reporting",
      type: "true-false",
      prompt: "True or false: If three outlets report the same claim, you have three independent confirmations.",
      choices: ["True", "False"],
      answer: 1,
      explanation: "Not if they all got the claim from the same original source, or from each other. That is one source repeated three times. Independent confirmation means separate access to the facts.",
      sample: true
    },
    {
      id: "primary-source",
      type: "multiple-choice",
      prompt: "You are reporting on a city's budget. Which of these is a primary source?",
      choices: [
        "The city's adopted budget document",
        "A blog post summarizing the budget",
        "A social media thread about the budget",
        "A newspaper explainer about the budget"
      ],
      answer: 0,
      explanation: "A primary source is the original record. The budget document itself is primary; summaries and commentary about it are secondary.",
      sample: true
    }
  ]
};
