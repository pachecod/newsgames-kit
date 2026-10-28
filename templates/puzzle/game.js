/* ============================================================================
   GROUPING PUZZLE — game logic. Content lives in data.js; look there to change the puzzle.

   Flow:  pick 4 tiles  ->  Check  ->  correct group locks in / mistake counts
          -> win (all 4 groups) or lose (out of mistakes, groups revealed)
   ============================================================================ */
(function () {
  "use strict";

  const DATA = window.PUZZLE_DATA;
  const screen = document.getElementById("screen");
  const MAX_MISTAKES = (DATA.settings && DATA.settings.maxMistakes) || 4;
  // Share emoji by group level 1..4 (yellow, green, blue, purple squares)
  const LEVEL_EMOJI = {
    1: String.fromCodePoint(0x1F7E8),
    2: String.fromCodePoint(0x1F7E9),
    3: String.fromCodePoint(0x1F7E6),
    4: String.fromCodePoint(0x1F7EA)
  };

  let state = null;   // see newGame()
  let ui = null;      // DOM pieces, see buildUI()
  let groupOf = null; // Map: tile word -> its group

  /* ---------- Small helpers ---------- */

  // Build a DOM element. Text is always inserted as text (never as HTML).
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs || {})) {
      if (val === false || val == null) continue;
      if (key === "class") el.className = val;
      else if (key.startsWith("on") && typeof val === "function") el.addEventListener(key.slice(2), val);
      else el.setAttribute(key, val === true ? "" : val);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid);
    }
    return el;
  }

  // Replace everything inside `parent`. Skips null/false so `cond ? el : null` is safe.
  function mount(parent, ...kids) {
    parent.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  }

  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  /* ---------- Check the content before we start ---------- */

  function validate(data) {
    const errors = [];
    if (!data || !Array.isArray(data.groups) || data.groups.length !== 4) {
      errors.push("data.js needs exactly 4 groups.");
      return errors;
    }
    const seen = new Map();
    const levels = new Set();
    data.groups.forEach((g, n) => {
      const name = `Group ${n + 1}` + (g.label ? ` (${g.label})` : "");
      if (!g.label) errors.push(`${name}: missing label.`);
      if (![1, 2, 3, 4].includes(g.level)) errors.push(`${name}: level must be 1, 2, 3 or 4.`);
      else if (levels.has(g.level)) errors.push(`${name}: level ${g.level} is used twice. Each group needs its own level.`);
      else levels.add(g.level);
      if (!Array.isArray(g.words) || g.words.length !== 4) {
        errors.push(`${name}: needs exactly 4 words.`);
        return;
      }
      g.words.forEach((w) => {
        const key = String(w).trim().toLowerCase();
        if (seen.has(key)) errors.push(`The word "${w}" appears twice (in "${seen.get(key)}" and "${g.label}").`);
        else seen.set(key, g.label);
      });
    });
    return errors;
  }

  /* ---------- Game state ---------- */

  function newGame() {
    groupOf = new Map();
    DATA.groups.forEach((g) => g.words.forEach((w) => groupOf.set(w, g)));
    state = {
      order: shuffled(Array.from(groupOf.keys())),   // tiles still in play, in display order
      selected: new Set(),
      solved: [],                                     // groups found, in the order found
      revealed: new Set(),                            // ids of groups shown after losing
      tried: new Set(),                               // guesses already made
      guesses: [],                                    // emoji rows for sharing
      mistakes: 0,
      over: false,
      won: false
    };
  }

  /* ---------- Building the screen ---------- */

  function buildUI() {
    const meta = DATA.meta || {};
    ui = {
      lives: h("p", { class: "lives" }),
      solved: h("div", { class: "solved" }),
      board: h("div", { class: "board", role: "group", "aria-label": "Word tiles" }),
      message: h("p", { class: "message", role: "status" }),
      shuffle: h("button", { type: "button", class: "btn secondary", onclick: shuffleTiles }, "Shuffle"),
      clear: h("button", { type: "button", class: "btn secondary", onclick: clearSelection }, "Deselect all"),
      check: h("button", { type: "button", class: "btn", onclick: checkGuess }, "Check"),
      end: h("div", { class: "end" })
    };
    ui.controls = h("div", { class: "actions controls" }, ui.shuffle, ui.clear, ui.check);

    mount(screen,
      meta.note ? h("p", { class: "notice" }, meta.note) : null,
      h("p", {}, "Pick four words that belong together, then press Check."),
      ui.lives,
      ui.solved,
      ui.board,
      ui.message,
      ui.controls,
      ui.end
    );
  }

  function renderChrome() {
    const meta = DATA.meta || {};
    document.title = meta.title || "Grouping Puzzle";
    document.getElementById("game-title").textContent = meta.title || "Grouping Puzzle";
    document.getElementById("game-subtitle").textContent = meta.subtitle || "";
    mount(document.getElementById("game-footer"),
      meta.byline ? h("p", {}, "By ", meta.byline, ".") : null,
      meta.lastVerified ? h("p", {}, "Facts last checked ", formatDate(meta.lastVerified), ".") : null,
      meta.corrections ? h("p", {}, "Spot an error? ", h("a", { href: "mailto:" + meta.corrections }, meta.corrections), ".") : null
    );
  }

  function groupRow(g) {
    const missed = state.revealed.has(g.id);
    return h("div", { class: `group level-${g.level}` },
      h("h3", {}, g.label, missed ? h("span", { class: "flag" }, "Missed") : null),
      h("p", { class: "words" }, g.words.join(", ")),
      // Notes appear at the end so rows stay short while you are still playing.
      state.over && g.note ? h("p", { class: "note" }, g.note) : null
    );
  }

  function tile(word) {
    const on = state.selected.has(word);
    return h("button", {
      type: "button",
      class: "tile" + (on ? " is-selected" : ""),
      "aria-pressed": String(on),
      "data-word": word,
      onclick: () => toggle(word)
    }, word);
  }

  function dots() {
    const left = MAX_MISTAKES - state.mistakes;
    return "\u25CF".repeat(left) + "\u25CB".repeat(state.mistakes);
  }

  // Redraw everything that changes between guesses. `focus` is "tile" to
  // move keyboard focus to the first tile (used after Check).
  function render(focus) {
    const left = MAX_MISTAKES - state.mistakes;
    mount(ui.lives, `Mistakes left: ${left} of ${MAX_MISTAKES} `, h("span", { "aria-hidden": "true", class: "dots" }, dots()));
    mount(ui.solved, state.solved.map(groupRow));
    mount(ui.board, state.order.map(tile));
    ui.board.hidden = state.over;
    ui.controls.hidden = state.over;
    ui.check.disabled = state.selected.size !== 4;
    ui.clear.disabled = state.selected.size === 0;
    renderEnd();

    if (state.over) {
      const heading = ui.end.querySelector("h2");
      if (heading) heading.focus();
    } else if (focus === "tile") {
      const first = ui.board.querySelector(".tile");
      if (first) first.focus();
    }
  }

  function renderEnd() {
    if (!state.over) { mount(ui.end); return; }
    const status = h("p", { class: "muted", role: "status" });
    const heading = h("h2", { tabindex: "-1" },
      state.won
        ? (state.mistakes === 0 ? "Perfect. No mistakes." : `Solved with ${state.mistakes} ${state.mistakes === 1 ? "mistake" : "mistakes"}.`)
        : "Out of mistakes.");
    const shareText = [
      `${DATA.meta.title}: ${state.won ? "solved" : "not solved"}`,
      state.guesses.map((row) => row.join("")).join("\n"),
      /^https?:/.test(location.href) ? location.href : ""
    ].filter(Boolean).join("\n");

    mount(ui.end,
      heading,
      h("p", {}, state.won ? "You found all four groups." : "Here are the groups you missed."),
      h("p", { class: "muted" }, "Each group has a note that explains the terms."),
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: () => shareResult(shareText, status) }, "Share result"),
        h("button", { type: "button", class: "btn secondary", onclick: playAgain }, "Play again")),
      status
    );
  }

  function say(text) { ui.message.textContent = text; }

  /* ---------- Player actions ---------- */

  function toggle(word) {
    if (state.over) return;
    if (state.selected.has(word)) {
      state.selected.delete(word);
    } else if (state.selected.size < 4) {
      state.selected.add(word);
    } else {
      say("You can pick four at a time. Deselect one first.");
      return;
    }
    say("");
    // Update in place (no rebuild) so keyboard focus stays on the tile.
    const btn = Array.from(ui.board.children).find((b) => b.dataset.word === word);
    const on = state.selected.has(word);
    btn.classList.toggle("is-selected", on);
    btn.setAttribute("aria-pressed", String(on));
    ui.check.disabled = state.selected.size !== 4;
    ui.clear.disabled = state.selected.size === 0;
  }

  function clearSelection() {
    state.selected.clear();
    say("");
    render();
  }

  function shuffleTiles() {
    state.order = shuffled(state.order);
    render();
  }

  function checkGuess() {
    if (state.over || state.selected.size !== 4) return;
    const words = Array.from(state.selected);
    const key = words.map((w) => w.toLowerCase()).sort().join("|");
    if (state.tried.has(key)) { say("You already tried that set."); return; }
    state.tried.add(key);

    // How many of the four share a group? 4 = solved, 3 = "one away".
    const counts = new Map();
    words.forEach((w) => counts.set(groupOf.get(w), (counts.get(groupOf.get(w)) || 0) + 1));
    const [bestGroup, best] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
    state.guesses.push(words.map((w) => LEVEL_EMOJI[groupOf.get(w).level]));

    if (best === 4) {
      state.solved.push(bestGroup);
      state.order = state.order.filter((w) => !bestGroup.words.includes(w));
      say(`Correct: ${bestGroup.label}.`);
      if (state.solved.length === 4) finish(true);
    } else {
      state.mistakes++;
      say(best === 3 ? "One away. Three of those four belong together." : "Not a group.");
      if (state.mistakes >= MAX_MISTAKES) finish(false);
    }
    state.selected.clear();
    render("tile");
  }

  function finish(won) {
    state.over = true;
    state.won = won;
    if (!won) {
      const found = new Set(state.solved.map((g) => g.id));
      DATA.groups.filter((g) => !found.has(g.id)).sort((a, b) => a.level - b.level)
        .forEach((g) => { state.solved.push(g); state.revealed.add(g.id); });
      state.order = [];
    }
    say("");   // the end-of-game heading takes over from here
  }

  function playAgain() {
    newGame();
    buildUI();
    render();
  }

  /* ---------- Sharing ---------- */

  async function shareResult(text, statusEl) {
    const isTouch = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (navigator.share && isTouch) {
      try { await navigator.share({ text }); return; }
      catch (err) { if (err && err.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      statusEl.textContent = "Result copied. Paste it anywhere.";
      return;
    } catch (err) { /* fall through to the older method */ }

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.append(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { /* ignore */ }
    ta.remove();
    statusEl.textContent = ok ? "Result copied. Paste it anywhere." : "Could not copy automatically. Select and copy this instead: " + text;
  }

  /* ---------- Start ---------- */

  renderChrome();
  const errors = validate(DATA);
  if (errors.length) {
    errors.forEach((e) => console.error("[puzzle] " + e));
    mount(screen,
      h("div", { class: "notice error" },
        h("strong", {}, "This puzzle can't start yet."),
        h("ul", {}, errors.map((e) => h("li", {}, e)))));
  } else {
    newGame();
    buildUI();
    render();
  }
})();
