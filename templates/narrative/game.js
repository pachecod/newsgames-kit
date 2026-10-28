/* ============================================================================
   INTERACTIVE STORY ENGINE — game logic. The story lives in data.js.

   Flow:  start screen  ->  story screens (make choices)  ->  ending
          ->  debrief (your path, the ideas behind it, sources)

   Add ?debug to the address to run the story checker and jump to any screen.
   ============================================================================ */
(function () {
  "use strict";

  const STORY = window.STORY_DATA;
  const screen = document.getElementById("screen");
  const DEBUG = new URLSearchParams(window.location.search).has("debug");
  const SETTINGS = Object.assign({ showMetersWhilePlaying: false, meterMax: 6 }, STORY && STORY.settings);

  let run = null;                 // the current playthrough, see freshRun()
  const seenEndings = new Set();  // endings found since the page loaded
  let check = null;               // result of validateStory()

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

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function isHttpUrl(s) { return /^https?:\/\//i.test(s || ""); }

  /* ---------- The story checker ---------- */

  function validateStory(story) {
    const errors = [];
    const warnings = [];
    if (!story || !story.nodes || !story.start) {
      errors.push("data.js needs a `start` node id and a `nodes` object.");
      return { errors, warnings, endings: [] };
    }
    const nodes = story.nodes;
    const concepts = story.concepts || {};
    const vars = story.vars || {};
    const ids = Object.keys(nodes);

    if (!nodes[story.start]) errors.push(`The start node "${story.start}" does not exist.`);

    // Which screens can a player actually reach from the start?
    const reachable = new Set();
    const todo = nodes[story.start] ? [story.start] : [];
    while (todo.length) {
      const id = todo.pop();
      if (reachable.has(id)) continue;
      reachable.add(id);
      (nodes[id].choices || []).forEach((c) => { if (nodes[c.to] && !reachable.has(c.to)) todo.push(c.to); });
    }

    ids.forEach((id) => {
      const n = nodes[id];
      if (!Array.isArray(n.text) || n.text.length === 0) errors.push(`Screen "${id}": needs a \`text\` list of paragraphs.`);
      const choices = n.choices || [];
      if (n.ending) {
        if (choices.length) warnings.push(`Screen "${id}" is an ending but also has choices (they are ignored).`);
        (n.ending.concepts || []).forEach((cid) => {
          if (!concepts[cid]) errors.push(`Ending "${id}": concept "${cid}" is not defined.`);
        });
      } else if (choices.length === 0) {
        errors.push(`Screen "${id}": no choices and not an ending. Players would get stuck.`);
      }
      choices.forEach((c, i) => {
        const where = `Screen "${id}", choice ${i + 1}`;
        if (!c.label) errors.push(`${where}: missing label.`);
        if (!nodes[c.to]) errors.push(`${where}: goes to "${c.to}", which does not exist.`);
        if (c.concept && !concepts[c.concept]) errors.push(`${where}: concept "${c.concept}" is not defined.`);
        Object.keys(c.effects || {}).forEach((k) => {
          if (!(k in vars)) errors.push(`${where}: effect "${k}" is not in \`vars\`.`);
        });
      });
      if (!reachable.has(id)) warnings.push(`Screen "${id}" can't be reached from the start.`);
    });

    // Can every reachable screen eventually reach an ending?
    const endings = ids.filter((id) => nodes[id].ending);
    if (endings.length === 0) errors.push("The story has no ending.");
    const canEnd = new Set(endings);
    let grew = true;
    while (grew) {
      grew = false;
      ids.forEach((id) => {
        if (!canEnd.has(id) && (nodes[id].choices || []).some((c) => canEnd.has(c.to))) { canEnd.add(id); grew = true; }
      });
    }
    ids.forEach((id) => {
      if (reachable.has(id) && !canEnd.has(id)) errors.push(`Screen "${id}" can't lead to any ending (a loop with no exit).`);
    });

    Object.keys(concepts).forEach((cid) => {
      const c = concepts[cid];
      if (!c.explanation) warnings.push(`Concept "${cid}": no explanation.`);
      if (!Array.isArray(c.sources) || c.sources.length === 0) warnings.push(`Concept "${cid}": no sources yet (required before publishing).`);
    });

    return { errors, warnings, endings };
  }

  /* ---------- A playthrough ---------- */

  function freshRun() {
    return { nodeId: STORY.start, vars: Object.assign({}, STORY.vars), path: [], history: [] };
  }

  function beginStory() {
    run = freshRun();
    renderNode();
  }

  function applyEffects(vars, effects) {
    Object.keys(effects || {}).forEach((k) => {
      if (k in vars) vars[k] = clamp(vars[k] + effects[k], 0, SETTINGS.meterMax);
    });
  }

  function choose(choice) {
    const node = STORY.nodes[run.nodeId];
    run.history.push({ nodeId: run.nodeId, vars: Object.assign({}, run.vars), pathLength: run.path.length });
    run.path.push({ label: node.label || run.nodeId, choice: choice.label, concept: choice.concept || null });
    applyEffects(run.vars, choice.effects);
    run.nodeId = choice.to;
    renderNode();
  }

  function goBack() {
    const prev = run.history.pop();
    if (!prev) return;
    run.nodeId = prev.nodeId;
    run.vars = prev.vars;
    run.path.length = prev.pathLength;
    renderNode();
  }

  /* ---------- Page chrome ---------- */

  function renderChrome() {
    const meta = STORY.meta || {};
    document.title = meta.title || "Interactive Story";
    document.getElementById("game-title").textContent = meta.title || "Interactive Story";
    document.getElementById("game-subtitle").textContent = meta.subtitle || "";
    mount(document.getElementById("game-footer"),
      meta.byline ? h("p", {}, "By ", meta.byline, ".") : null,
      meta.lastVerified ? h("p", {}, "Facts last checked ", formatDate(meta.lastVerified), ".") : null,
      meta.corrections ? h("p", {}, "Spot an error? ", h("a", { href: "mailto:" + meta.corrections }, meta.corrections), ".") : null
    );
  }

  /* ---------- Screens ---------- */

  function renderStart() {
    const meta = STORY.meta || {};
    mount(screen,
      meta.note ? h("p", { class: "notice" }, meta.note) : null,
      meta.fictionNote ? h("p", { class: "fiction-note" }, meta.fictionNote) : null,
      Array.isArray(STORY.learning) && STORY.learning.length
        ? [h("h2", {}, "What you will practice"), h("ul", { class: "learning" }, STORY.learning.map((l) => h("li", {}, l)))]
        : null,
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: beginStory }, "Begin")),
      debugPanel()
    );
  }

  function meterBlock() {
    const keys = Object.keys(STORY.vars || {});
    if (!keys.length) return null;
    const labels = STORY.varLabels || {};
    return h("div", { class: "meters" }, keys.map((k) => {
      const val = run.vars[k];
      const max = SETTINGS.meterMax;
      const name = labels[k] || k;
      return h("div", { class: "meter", role: "img", "aria-label": `${name}: ${val} out of ${max}` },
        h("span", { class: "meter-label" }, name),
        h("span", { class: "meter-track" }, h("span", { class: "meter-fill", style: `width:${(val / max) * 100}%` })),
        h("span", { class: "meter-value" }, `${val}/${max}`));
    }));
  }

  function renderNode() {
    const node = STORY.nodes[run.nodeId];
    if (!node) { renderMissing(); return; }
    if (node.ending) { renderEnding(node); return; }

    const heading = h("h2", { tabindex: "-1" }, node.label || "");
    mount(screen,
      heading,
      SETTINGS.showMetersWhilePlaying ? meterBlock() : null,
      h("div", { class: "story-text" }, node.text.map((p) => h("p", {}, p))),
      h("ul", { class: "choices" }, (node.choices || []).map((c) =>
        h("li", {}, h("button", { type: "button", class: "choice", onclick: () => choose(c) }, h("span", {}, c.label))))),
      run.history.length
        ? h("div", { class: "actions" }, h("button", { type: "button", class: "btn secondary", onclick: goBack }, "Go back one step"))
        : null,
      debugPanel()
    );
    heading.focus();
  }

  function renderMissing() {
    mount(screen,
      h("div", { class: "notice error" },
        h("strong", {}, "This part of the story is missing."),
        h("p", {}, `There is no screen called "${run.nodeId}". Check the \`to\` value of the choice that led here.`)),
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: beginStory }, "Start over"))
    );
  }

  function renderEnding(node) {
    seenEndings.add(run.nodeId);
    const heading = h("h2", { tabindex: "-1" }, (node.ending && node.ending.title) || node.label || "The end");
    mount(screen,
      heading,
      h("div", { class: "story-text" }, node.text.map((p) => h("p", {}, p))),
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: () => renderDebrief(node) }, "See what your choices showed"),
        run.history.length ? h("button", { type: "button", class: "btn secondary", onclick: goBack }, "Go back one step") : null),
      debugPanel()
    );
    heading.focus();
  }

  function renderDebrief(endNode) {
    const heading = h("h2", { tabindex: "-1" }, "What your choices showed");
    const concepts = STORY.concepts || {};

    // Ideas touched by your choices, plus any the ending itself teaches. No repeats.
    const conceptIds = [];
    run.path.forEach((p) => { if (p.concept && !conceptIds.includes(p.concept)) conceptIds.push(p.concept); });
    ((endNode.ending && endNode.ending.concepts) || []).forEach((cid) => { if (!conceptIds.includes(cid)) conceptIds.push(cid); });

    const labels = STORY.varLabels || {};
    const totalEndings = check.endings.length;

    mount(screen,
      heading,
      h("h3", {}, "Your path"),
      run.path.length
        ? h("ol", { class: "path" }, run.path.map((p) =>
            h("li", {},
              h("strong", {}, p.label + ". "),
              "You chose: " + p.choice + ".",
              p.concept && concepts[p.concept] ? h("span", { class: "idea" }, "Idea: " + concepts[p.concept].title) : null)))
        : h("p", { class: "muted" }, "You reached this ending without making a choice."),

      conceptIds.length ? h("h3", {}, "The ideas behind it") : null,
      conceptIds.map((cid) => conceptCard(cid, concepts[cid])),

      Object.keys(STORY.vars || {}).length
        ? [h("h3", {}, "How your choices traded off"),
           meterBlock(),
           h("p", { class: "muted" }, "These meters are a simplified model to show trade-offs. Real newsrooms do not score stories this way.")]
        : null,

      h("p", {}, `Endings found: ${seenEndings.size} of ${totalEndings}. Play again and choose differently to find the others.`),
      h("div", { class: "actions" },
        h("button", { type: "button", class: "btn", onclick: beginStory }, "Play again")),
      debugPanel()
    );
    heading.focus();
  }

  function conceptCard(cid, c) {
    if (!c) return null;
    const hasSources = Array.isArray(c.sources) && c.sources.length > 0;
    return h("div", { class: "concept" },
      h("h4", {}, c.title || cid),
      h("p", {}, c.explanation || ""),
      hasSources
        ? h("p", { class: "concept-sources" }, "Sources: ",
            c.sources.map((s, i) => [
              i > 0 ? ", " : null,
              isHttpUrl(s.url) ? h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer" }, s.label || s.url) : (s.label || "")
            ]))
        : (DEBUG ? h("p", { class: "concept-sources warn" }, "No sources yet. Add one before publishing.") : null)
    );
  }

  /* ---------- Debug panel (?debug) ---------- */

  function debugPanel() {
    if (!DEBUG) return null;
    const ids = Object.keys(STORY.nodes || {});
    const jump = h("select", { "aria-label": "Jump to a screen", onchange: (e) => {
      if (!e.target.value) return;
      if (!run) run = freshRun();
      run.nodeId = e.target.value;
      renderNode();
    } }, h("option", { value: "" }, "Jump to a screen..."), ids.map((id) => h("option", { value: id }, id)));

    return h("details", { class: "debug", open: true },
      h("summary", {}, `Story checker: ${check.errors.length} errors, ${check.warnings.length} warnings`),
      check.errors.length === 0 && check.warnings.length === 0 ? h("p", {}, "No problems found.") : null,
      check.errors.length ? h("ul", { class: "debug-errors" }, check.errors.map((e) => h("li", {}, "Error: " + e))) : null,
      check.warnings.length ? h("ul", {}, check.warnings.map((w) => h("li", {}, "Warning: " + w))) : null,
      h("p", {}, `${ids.length} screens, ${check.endings.length} endings.`),
      jump
    );
  }

  /* ---------- Start ---------- */

  renderChrome();
  check = validateStory(STORY);
  check.warnings.forEach((w) => console.warn("[story] " + w));
  if (check.errors.length) {
    check.errors.forEach((e) => console.error("[story] " + e));
    mount(screen,
      h("div", { class: "notice error" },
        h("strong", {}, "This story can't start yet."),
        h("ul", {}, check.errors.map((e) => h("li", {}, e)))),
      DEBUG ? debugPanel() : null);
  } else {
    renderStart();
  }
})();
