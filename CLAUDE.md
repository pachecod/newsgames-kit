# News Games Class Kit

This project is for a journalism class where students build small, web-based news games
(quizzes, puzzles, interactive stories, and arcade-style games) that play in a desktop or
mobile browser. Students are learning. Many are new to code. Be a patient collaborator,
not a black box.

## How this project is organized

- `templates/` holds three working baselines: `news-quiz`, `puzzle`, `narrative`. **Never edit these.** Copy them.
- `games/<game-name>/` is where each student's game lives. One folder per game. `games/index.html` is the published site's front page.
- `render.yaml` tells Render to publish `games/` (see the `publish-render` skill).
- `design/` holds game briefs. Template: `design/brief-template.md`.
- `.claude/skills/` holds a skill for each genre. Use the matching skill when building that genre.

## Starting a new game

1. Work out the genre (quiz, puzzle, story, or arcade) and the audience. If it isn't clear, ask one question.
2. Write a short brief at `design/<game-name>-brief.md` from the template. Show it to the student and get a yes before building. The brief must state what a player should learn or notice.
3. Copy the closest template into `games/<game-name>/` (use a lowercase-hyphen name).
4. Change `data.js` first (the content), then `style.css` (the look), then `game.js` (the logic) only if needed.
5. Run it and check it (see "Before you say it's done").

## Tech rules

- Plain HTML, CSS and JavaScript. No framework, no build step, no npm packages unless the student approves.
- Use classic `<script src>` tags, not ES modules, so a game works when `index.html` is double-clicked.
- Content lives in `data.js`. Logic lives in `game.js`. Appearance lives in `style.css`, with design tokens at the top. Keep them separate so a journalist can update content without touching code.
- Build page elements with `textContent` or the `h()` helper in each `game.js`. Never put game content into `innerHTML`.
- Real-time arcade games (reflexes, movement, collisions) may use Phaser 3 from a CDN at a pinned version. Ask first, and read the skill instructions if one is installed.
- No API keys or secrets in browser code. No analytics, trackers or third-party scripts without approval.
- Games must be fully playable without saved data. If you use `localStorage`, wrap every read and write in try/catch.
- Images and sounds must be original, public domain, or licensed, with credit shown in the game. Never use scraped images. Never generate realistic images of real people.

## Every game must work on a phone and a laptop

- `<meta name="viewport">` present. Layout works from 320px to wide desktop, with no sideways scrolling.
- Touch targets are at least 48px. Nothing depends on hover or on a keyboard-only action.
- Fully playable with a keyboard: visible focus, logical tab order, buttons for actions (not clickable divs).
- Never use color as the only signal. Pair it with text or a symbol. Text contrast meets WCAG AA.
- Respect `prefers-reduced-motion`. Avoid flashing. Avoid timers unless the game needs them, and offer an untimed option.
- Announce changes to screen readers (`role="status"`), and move focus sensibly when the screen changes.
- Works in light and dark mode.

## Editorial rules (this is a journalism class)

- **Never invent facts, quotes, statistics, names or URLs.** If you don't know, say so and leave a visible `TODO` for the student.
- Every factual claim a player can be told is true needs a `source` (a label and a working URL). Open the link or ask the student to. Do not guess a URL.
- Mark placeholder content `sample: true` or with a visible sample notice, and remove it before publishing.
- Label fiction as fiction. Real events are reported accurately, with sources. Composite or invented characters are said to be invented. Never put invented words in the mouth of a real person.
- Do not paste article text. Paraphrase, and quote only short phrases with attribution.
- Date-stamp time-sensitive content (`lastVerified`) and give readers a way to report errors (`corrections`).
- Handle tragedy, violence and other sensitive topics with care: no scoring or points for suffering, and a content note where needed.
- If AI wrote or helped write game content, the student decides how to disclose that. Remind them to.
- Don't collect personal data. Don't ask players for names or emails.

## How to work with the student

- After each change, say in two or three plain sentences what you changed and which file. Suggest one next step.
- Explain choices the student could make differently. Don't silently pick a style, a source, or a framing for them.
- Prefer small steps: get the smallest playable version running first, then improve it.
- If a request conflicts with a rule above, explain the rule briefly and offer an alternative.
- Don't edit `templates/`. Don't touch files outside `games/<game-name>/` and `design/` unless asked.

## Before you say it's done

1. Open the game and check the browser console for errors.
2. Play it through, including the end and "play again".
3. Check a phone-width view (about 360px) and a desktop view.
4. Tab through it with the keyboard.
5. For stories, open `index.html?debug` and clear every error and warning.
6. Tell the student exactly what you tested and what you couldn't (for example, if you have no browser tool).

## Genre skills

- Quiz or "real or fake" format: `news-quiz`
- Grouping, word, sorting or matching puzzles: `puzzle-game`
- Branching story or simulation that teaches through choices: `narrative-teaching-game`
- Putting games online, updating them, or taking them down: `publish-render`

## Publishing

Each game folder is a complete static site. Any static host works (GitHub Pages, Netlify Drop, or a
campus web space). Before publishing: no sample content left, every source link opens, `lastVerified` is
today's date, a corrections contact is real, and the student has played it on an actual phone.

The built-in path is Render: use the `publish-render` skill. It publishes all of `games/` as one free site
(`render.yaml`), with `games/index.html` as the front page. A class preview may still contain sample
content only if the sample notice stays visible. Publishing may edit `games/index.html`, `render.yaml` and Git
files. The student creates accounts and signs in themselves, and approves every push. Push only to the student's
own repository, never to the instructor's kit (`pachecod/newsgames-kit`).
