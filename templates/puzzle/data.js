/* ============================================================================
   PUZZLE CONTENT — edit this file to make a new puzzle. No game logic lives here.

   A grouping puzzle has exactly 4 groups of exactly 4 words (16 tiles).
   Players find the four groups. The game checks this file when it loads and
   shows a clear error if something is off (wrong counts, duplicate words).

   Good puzzles have "red herrings": a word that could fit two groups, but
   only one arrangement works for all 16. Check that yours has exactly one.

   Editorial rules (see CLAUDE.md): every `note` is a claim about the world.
   Make sure it is accurate, and add a `source` when the term has a contested
   or technical meaning.
   ============================================================================ */
window.PUZZLE_DATA = {
  meta: {
    title: "Sort the Newsroom",
    subtitle: "Sixteen terms from the news business. Find the four groups.",
    byline: "Your name, your class or newsroom",
    lastVerified: "2026-10-28",              // YYYY-MM-DD
    corrections: "corrections@example.com",   // "" hides this
    note: "Sample puzzle. Make your own before you publish."   // "" hides this banner
  },

  settings: {
    maxMistakes: 4
  },

  // level 1 to 4 = how hard the group is (1 easiest). It sets the color and share emoji.
  groups: [
    {
      id: "story-parts",
      level: 1,
      label: "Parts of a news story",
      words: ["Lede", "Nut graf", "Byline", "Dateline"],
      note: "The lede opens the story. The nut graf explains why it matters. The byline credits the author. The dateline tells you where the story was reported."
    },
    {
      id: "story-types",
      level: 2,
      label: "Kinds of stories",
      words: ["Feature", "Obituary", "Explainer", "Editorial"],
      note: "Each is a different job: a feature tells a longer human story, an obituary marks a death, an explainer breaks down a topic, and an editorial gives the publication's opinion."
    },
    {
      id: "video-terms",
      level: 3,
      label: "Broadcast and video terms",
      words: ["Chyron", "B-roll", "Soundbite", "Stand-up"],
      note: "A chyron is on-screen text. B-roll is supporting footage. A soundbite is a short clip from an interview. A stand-up is a reporter speaking to the camera at the scene."
    },
    {
      id: "ground-rules",
      level: 4,
      label: "Ground rules for sharing information",
      words: ["On the record", "On background", "Off the record", "Embargo"],
      note: "Newsrooms define these slightly differently, so agree on the terms with a source before the interview starts. An embargo is a request to hold information until a set time."
    }
  ]
};
