/* ============================================================================
   NEWS QUIZ — game logic. Content lives in data.js; look there to change questions.

   Flow:  start screen  ->  question (pick answer, read feedback)  ->  ...  ->  results
   ============================================================================ */
(function () {
  "use strict";

  const DATA = window.QUIZ_DATA;
  const screen = document.getElementById("screen");
  let state = null;   // { items: [{ q, choices, picked }], index, score }

  /* ---------- Small helpers ---------- */

  // Build a DOM element. Text is always inserted as text (never as HTML),
  // so quiz content can't break the page.
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

  function isHttpUrl(s) { return /^https?:\/\//i.test(s || ""); }

  /* ---------- Check the content before we start ---------- */

  function validate(data) {
    const errors = [];
    const warnings = [];
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
      errors.push("data.js needs a `questions` list with at least one question.");
      return { errors, warnings };
    }
    const ids = new Set();
    data.questions.forEach((q, n) => {
      const name = `Question ${n + 1}` + (q.id ? ` (${q.id})` : "");
      if (!q.prompt) errors.push(`${name}: missing prompt.`);
      if (!Array.isArray(q.choices) || q.choices.length < 2) errors.push(`${name}: needs at least 2 choices.`);
      else if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) errors.push(`${name}: \`answer\` must be a choice number starting at 0.`);
      if (!q.explanation) warnings.push(`${name}: no explanation.`);
      if (!q.sample && !(q.source && isHttpUrl(q.source.url))) warnings.push(`${name}: no source URL (required before publishing).`);
      if (q.id && ids.has(q.id)) warnings.push(`${name}: duplicate id.`);
      if (q.id) ids.add(q.id);
    });
    return { errors, warnings };
  }

  /* ---------- Page chrome (title, footer) ---------- */

  function renderChrome() {
    const meta = DATA.meta || {};
    document.title = meta.title || "News Quiz";
    document.getElementById("game-title").textContent = meta.title || "News Quiz";
    document.getElementById("game-subtitle").textContent = meta.subtitle || "";
    const footer = document.getElementById("game-footer");
    mount(footer, 
      meta.byline ? h("p", {}, "By ", meta.byline, ".") : null,
      meta.lastVerified ? h("p", {}, "Facts last checked ", formatDate(meta.lastVerified), ".") : null,
      meta.corrections ? h("p", {}, "Spot an error? ", h("a", { href: "mailto:" + meta.corrections }, meta.corrections), ".") : null
    );
  }

  /* ---------- Rounds ---------- */

  function roundSize() {
    const s = DATA.settings || {};
    const total = DATA.questions.length;
    return s.questionsPerRound > 0 ? Math.min(s.questionsPerRound, total) : total;
  }

  function newRound() {
    const s = DATA.settings || {};
    let qs = DATA.questions.slice();
    if (s.shuffleQuestions || s.questionsPerRound > 0) qs = shuffled(qs);
    qs = qs.slice(0, roundSize());
    const items = qs.map((q) => {
      let choices = q.choices.map((text, i) => ({ text, correct: i === q.answer }));
      if (s.shuffleChoices && q.type !== "true-false") choices = shuffled(choices);
      return { q, choices, picked: null };
    });
    state = { items, index: 0, score: 0 };
  }

  /* ---------- Screens ---------- */

  function renderStart() {
    const meta = DATA.meta || {};
    mount(screen, 
      meta.note ? h("p", { class: "notice" }, meta.note) : null,
      h("p", {}, `${roundSize()} questions. Each answer comes with an explanation and, where we have one, a source.`),
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: startRound }, "Start quiz"))
    );
  }

  function startRound() {
    newRound();
    renderQuestion();
  }

  function sourceLine(q) {
    if (q.source && isHttpUrl(q.source.url)) {
      return h("p", { class: "source" },
        "Source: ",
        h("a", { href: q.source.url, target: "_blank", rel: "noopener noreferrer" }, q.source.label || q.source.url),
        q.source.date ? ` (${q.source.date})` : "");
    }
    if (q.sample) return h("p", { class: "source" }, "Sample question. Add a source before publishing.");
    return h("p", { class: "source warn" }, "No source listed for this question.");
  }

  function renderQuestion() {
    const item = state.items[state.index];
    const q = item.q;
    const total = state.items.length;
    const isLast = state.index === total - 1;

    const heading = h("h2", { id: "prompt", tabindex: "-1" }, q.prompt);
    // role="status" lets screen readers announce the feedback when it appears.
    const feedback = h("div", { class: "feedback", role: "status" });
    const actions = h("div", { class: "actions" });
    const buttons = item.choices.map((c, i) =>
      h("button", { type: "button", class: "choice", onclick: () => pick(i) }, h("span", {}, c.text)));

    function pick(i) {
      if (item.picked !== null) return;   // ignore double taps
      item.picked = i;
      const right = item.choices[i].correct;
      if (right) state.score++;

      buttons.forEach((btn, idx) => {
        // aria-disabled (not `disabled`) so keyboard focus stays on the button you pressed.
        btn.setAttribute("aria-disabled", "true");
        if (idx !== i) btn.tabIndex = -1;
        const c = item.choices[idx];
        if (c.correct) {
          btn.classList.add("is-correct");
          btn.append(h("span", { class: "tag" }, idx === i ? "Correct (your answer)" : "Correct answer"));
        } else if (idx === i) {
          btn.classList.add("is-wrong");
          btn.append(h("span", { class: "tag" }, "Your answer"));
        }
      });

      feedback.classList.add(right ? "is-correct" : "is-wrong");
      feedback.append(
        h("h3", {}, right ? "Correct." : "Not quite."),
        q.explanation ? h("p", {}, q.explanation) : null,
        sourceLine(q)
      );
      actions.append(
        h("button", { type: "button", class: "btn", onclick: next }, isLast ? "See results" : "Next question"));
    }

    function next() {
      if (isLast) { renderResults(); return; }
      state.index++;
      renderQuestion();
    }

    mount(screen, 
      h("p", { class: "progress" }, `Question ${state.index + 1} of ${total}`),
      h("div", { class: "progress-bar", "aria-hidden": "true" },
        h("span", { style: `width:${(state.index / total) * 100}%` })),
      q.context ? h("p", { class: "context" }, q.context) : null,
      heading,
      h("ul", { class: "choices" }, buttons.map((b) => h("li", {}, b))),
      feedback,
      actions
    );
    heading.focus();
  }

  function renderResults() {
    const total = state.items.length;
    const pct = Math.round((state.score / total) * 100);
    const tier = (DATA.results || []).slice().sort((a, b) => b.minPercent - a.minPercent)
      .find((r) => pct >= r.minPercent);

    const marks = state.items.map((it) => (it.choices[it.picked].correct ? "\u2705" : "\u274C")).join("");
    const shareText = [
      `${DATA.meta.title}: ${state.score}/${total}`,
      marks,
      /^https?:/.test(location.href) ? location.href : ""
    ].filter(Boolean).join("\n");

    const status = h("p", { class: "muted", role: "status" });
    const heading = h("h2", { tabindex: "-1" }, `You got ${state.score} of ${total}`);

    const breakdown = h("ol", { class: "breakdown" }, state.items.map((it) => {
      const ok = it.choices[it.picked].correct;
      const answer = it.choices.find((c) => c.correct).text;
      return h("li", {},
        h("strong", {}, ok ? "Correct. " : "Missed. "),
        it.q.prompt,
        ok ? null : h("span", { class: "muted" }, ` Answer: ${answer}`));
    }));

    mount(screen, 
      heading,
      tier ? h("p", {}, tier.message) : null,
      breakdown,
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: () => shareResult(shareText, status) }, "Share result"),
        h("button", { type: "button", class: "btn secondary", onclick: startRound }, "Play again")),
      status
    );
    heading.focus();
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

  const check = validate(DATA);
  check.warnings.forEach((w) => console.warn("[quiz] " + w));
  renderChrome();
  if (check.errors.length) {
    check.errors.forEach((e) => console.error("[quiz] " + e));
    mount(screen, 
      h("div", { class: "notice error" },
        h("strong", {}, "This quiz can't start yet."),
        h("ul", {}, check.errors.map((e) => h("li", {}, e)))));
  } else {
    renderStart();
  }
})();
