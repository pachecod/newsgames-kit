/* ============================================================================
   STORY CONTENT — edit this file to write a new story. No game logic lives here.

   How it fits together
   - `nodes` are the story's screens. Each has `text` (a list of paragraphs) and
     either `choices` (buttons that go to other nodes) or an `ending`.
   - `concepts` are the ideas the story teaches. Tag a choice with `concept: "id"`
     and the debrief explains that idea, with its sources, after the ending.
   - `vars` are simple counters (like Accuracy). A choice's `effects` nudge them.
     They are a simplified model, not a score: say so in the debrief.

   Open index.html?debug to run the story checker. It finds broken links,
   unreachable screens, dead ends, and concepts that still lack sources.

   Editorial rules (see CLAUDE.md):
   - Fiction is labeled as fiction. Real events need sources.
   - Never put invented quotes in the mouth of a real person.
   - Every concept needs at least one source before you publish.
   ============================================================================ */
window.STORY_DATA = {
  meta: {
    title: "The Tip",
    subtitle: "A short interactive story about checking a tip before you publish it.",
    byline: "Your name, your class or newsroom",
    lastVerified: "2026-10-28",              // YYYY-MM-DD
    corrections: "corrections@example.com",   // "" hides this
    note: "Sample story. Replace it with your own before you publish.",   // "" hides this banner
    fictionNote: "This is fiction. The newspaper, the people and the events are invented."   // "" hides this
  },

  // What players should be able to do or understand after playing. Write these first.
  learning: [
    "Weigh speed against accuracy when a deadline is close",
    "Ask why a source is giving you information",
    "See why independent confirmation matters"
  ],

  settings: {
    showMetersWhilePlaying: false,   // the meters always appear in the debrief
    meterMax: 6
  },

  // Counters your choices can change. Keys here must match the keys used in `effects`.
  vars:      { accuracy: 3, speed: 3, trust: 3 },
  varLabels: { accuracy: "Accuracy", speed: "Speed", trust: "Reader trust" },

  start: "intro",

  concepts: {
    "source-motive": {
      title: "Ask why a source is talking to you",
      explanation: "People share information for reasons: public interest, a grievance, an advantage, or a mix. Knowing a source's motive does not mean dismissing them. It tells you what to double-check. The SPJ code asks journalists to consider sources' motives before promising anonymity.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    },
    "anonymous-tips": {
      title: "A tip is a lead, not a story",
      explanation: "A tip from someone who will not give a name still may point you to records or people who can confirm it. If a source asks for anonymity, many newsrooms have their own rules about when to grant it and who must approve it. The SPJ code advises reserving anonymity for sources who may face danger or retribution and who have information that cannot be obtained elsewhere.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    },
    "documents": {
      title: "Documents can be wrong or altered",
      explanation: "A document that looks official can still be incomplete, out of date or edited. Treat it as a lead until you have checked it against another record or person. The SPJ code asks journalists to verify information before releasing it and to use original sources whenever possible.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    },
    "independent-confirmation": {
      title: "Independent confirmation",
      explanation: "Two people repeating the same claim, or two copies of the same file, are not two independent confirmations. Look for someone with separate access to the facts.",
      sources: []   // TODO: add a source before publishing
    },
    "right-of-reply": {
      title: "Give the subject a chance to respond",
      explanation: "Reaching out to the people or agencies named in a story lets you hear their side and often turns up facts you did not have. The SPJ code asks journalists to diligently seek the subjects of coverage so they can respond to allegations of wrongdoing.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    },
    "deadline-pressure": {
      title: "A deadline is pressure, not a reason",
      explanation: "Being first matters less than being right. The SPJ code states that neither speed nor the format of a story excuses inaccuracy.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    },
    "show-your-work": {
      title: "Show your work",
      explanation: "Telling readers what you confirmed, what you could not, and what you are still checking helps them judge the reporting for themselves.",
      sources: []   // TODO: add a source before publishing
    },
    "corrections": {
      title: "Own mistakes quickly and visibly",
      explanation: "When you get something wrong, a correction should be prompt, prominent and specific about what changed. Quietly editing a published story leaves readers who already saw the error uninformed.",
      sources: [{ label: "SPJ Code of Ethics", url: "https://www.spj.org/ethicscode.asp" }]
    }
  },

  nodes: {
    intro: {
      label: "A tip arrives",
      text: [
        "It is 4:40 p.m. on a Thursday at the Riverside Ledger, a small-town daily. Your school board story is filed. The next deadline is 6:00.",
        "An email arrives from an address you do not recognize. The subject line reads: “County road money: spreadsheet attached.” The sender says they work for the county and want the story out today."
      ],
      choices: [
        { label: "Open the attachment and start reading", to: "look" },
        { label: "Reply first: ask who they are and how they got the file", to: "sender",
          effects: { accuracy: 1 }, concept: "source-motive" }
      ]
    },

    sender: {
      label: "Questioning the sender",
      text: [
        "The reply comes within minutes. The sender will not give a name. They say the file shows the county moving road repair money into other accounts.",
        "“If you wait, it gets buried,” they write. “Run it tonight.”"
      ],
      choices: [
        { label: "Say you will check it independently first, and ask for a phone call", to: "look",
          effects: { accuracy: 1, trust: 1 }, concept: "source-motive" },
        { label: "Stop here. You will not open a file from someone with no name", to: "ending_declined",
          concept: "anonymous-tips" }
      ]
    },

    look: {
      label: "Reading the spreadsheet",
      text: [
        "The spreadsheet has the county seal, tidy columns and an alarming total. Nothing about it looks fake. It also does not say who made it or when.",
        "It is 4:55 p.m."
      ],
      choices: [
        { label: "Call the county finance office for comment", to: "call",
          effects: { speed: -1, trust: 1 }, concept: "right-of-reply" },
        { label: "Look for a second person who has their own access to the numbers", to: "second",
          effects: { accuracy: 2, speed: -1 }, concept: "independent-confirmation" },
        { label: "File a short story now and add details later", to: "ending_correction",
          effects: { speed: 2, accuracy: -2, trust: -1 }, concept: "deadline-pressure" }
      ]
    },

    call: {
      label: "Calling the finance office",
      text: [
        "A spokesperson says the office cannot confirm a document it has not seen, and that some transfers between accounts are routine bookkeeping. They offer to walk you through the budget records tomorrow morning.",
        "It is 5:15 p.m."
      ],
      choices: [
        { label: "Hold the story and take the records walkthrough", to: "ending_thorough",
          effects: { accuracy: 2, speed: -1 }, concept: "documents" },
        { label: "Publish tonight with the county's response and say the review is continuing", to: "ending_balanced",
          effects: { speed: 1 }, concept: "show-your-work" }
      ]
    },

    second: {
      label: "Finding a second source",
      text: [
        "A former county budget analyst, reached through a mutual contact, looks at the figures you describe. Some of the numbers match the public budget. One total does not add up.",
        "They say that could be a simple error, an older version of the file, or an edit. They cannot tell which."
      ],
      choices: [
        { label: "Request the official budget records and compare them line by line", to: "ending_thorough",
          effects: { accuracy: 2, speed: -1 }, concept: "documents" },
        { label: "Publish only the figures that match the public budget", to: "ending_narrow",
          effects: { accuracy: 1, speed: 1 }, concept: "show-your-work" }
      ]
    },

    /* ---------- Endings ---------- */

    ending_declined: {
      label: "The tip goes unchecked",
      ending: { title: "The tip goes unchecked", concepts: [] },
      text: [
        "You close the email. If the claim was true, it stays unreported by you. If it was false, you avoided it. Either way, you never found out.",
        "A source without a name can still point you toward records or people who can confirm a story. Declining to publish on a tip is sound. Declining to look into it is a choice with a cost."
      ]
    },

    ending_thorough: {
      label: "The slower story",
      ending: { title: "The slower story", concepts: [] },
      text: [
        "Over the next two days you compare the spreadsheet with the official records. One total in the file had been changed, and the real transfers were smaller than the tipster claimed.",
        "Your story runs Saturday. It is less dramatic than the tip promised, but every figure in it traces to an official record, and you can show your work."
      ]
    },

    ending_balanced: {
      label: "A careful story, an open question",
      ending: { title: "A careful story, an open question", concepts: [] },
      text: [
        "You publish at 5:50 p.m. The story reports the county's response, says the spreadsheet could not be authenticated, and says you are still reviewing it.",
        "Readers can see what you know and what you do not. But the story raises more questions than it answers, and you still do not know whether the spreadsheet is genuine."
      ]
    },

    ending_narrow: {
      label: "The smaller story",
      ending: { title: "The smaller story", concepts: [] },
      text: [
        "You publish a short, verified explainer on how the county budgets road repairs, using only figures from the public budget. It is not the scoop the tipster wanted.",
        "The altered total stays out of the paper. You keep working on whether the rest of the file holds up."
      ]
    },

    ending_correction: {
      label: "A correction",
      ending: { title: "A correction", concepts: ["corrections"] },
      text: [
        "You file at 5:52 p.m. The story says the county “appears to have moved” road money, based on a spreadsheet you have not confirmed.",
        "At 7:10 p.m. the county's spokesperson emails: one total in the file was edited, and the transfers did not happen as described. You have to correct the story. Some readers who saw the first version may never see the correction."
      ]
    }
  }
};
