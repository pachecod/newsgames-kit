# News Games Class Kit

A starter kit for teaching students to build small web-based news games with Claude Code.
It runs on desktop and mobile browsers, needs no build step, and works by double-clicking `index.html`.

## What is in it

```
CLAUDE.md                    Project rules Claude Code reads every session
.claude/skills/
  news-quiz/                 Quizzes, real-or-fake, news literacy
  puzzle-game/               Grouping, word, sorting and matching puzzles
  narrative-teaching-game/   Branching stories that teach through choices
  publish-render/            Put games online as a free Render site, update it, take it down
templates/                   Working baselines. Students copy, never edit.
  news-quiz/                 Multiple choice and true/false, feedback with sources, shareable result
  puzzle/                    Four groups of four, one-away hints, mistakes, share grid
  narrative/                 Branching story, back button, debrief with ideas and sources, ?debug checker
games/                       Where each student's game goes (one folder per game)
  index.html                 Front page of the published site, listing each game
design/brief-template.md     One-page game brief to fill in before building
render.yaml                  Render Blueprint: publishes games/ as one static site
```

## Quick start (students)

The kit lives at **https://github.com/pachecod/newsgames-kit**. Each student makes their own copy of it.
**Students: follow [STUDENT-GUIDE.md](STUDENT-GUIDE.md)** for the full walkthrough, from setup to publishing. The short version:

1. Open Claude Code in any folder (for example your Documents folder) and paste:

   > Set up the news games kit for me from https://github.com/pachecod/newsgames-kit. Follow the "Setting up with Claude Code" steps in its README.

2. Claude makes your own copy, tells you the folder it's in, and stops.
3. **Start a new Claude Code session in that folder.** This step matters: Claude Code only loads the kit's rules and skills when a session *starts* in the kit's folder.
4. Tell Claude what to build, for example: *"I want to make a news quiz about how to spot manipulated photos."* Claude writes a brief with you, copies the quiz template into `games/`, and builds the smallest playable version.
5. When you want it online, say *"Publish my game."*

To preview without Claude, open `games/<name>/index.html` in a browser. To test on a phone, run `python3 -m http.server` in the kit folder and open the address on a phone on the same network.

## Setting up with Claude Code

These steps are for Claude Code when a student asks it to set up this kit. Explain each step in plain words, and stop if one fails.

1. **Check the tools.** Run `git --version`. If Git is missing on a Mac, running that command offers to install the command line tools. On Windows, the student installs Git from https://git-scm.com. Then run `gh --version` and, if it works, `gh auth status`. If `gh` is signed in, tell the student the account name and ask: "Is this your GitHub account?" On a shared or lab computer it may be someone else's. If it isn't theirs, don't use `gh` for anything.
2. **Pick a folder.** Ask where the kit should go. Suggest `~/newsgames` (or `Documents/newsgames`). Check that it doesn't exist yet or is empty (`ls -A <folder>`). If it has files, ask for another name.
3. **Make the student's own copy.** Ask whether they have a GitHub account.
   - **GitHub account and `gh` signed in as them (best):** after a yes, run this from the parent folder, using the folder name as the repository name so the clone lands in the right place:
     `gh repo create <folder-name> --template pachecod/newsgames-kit --private --clone`
     This gives them their own private repository, ready for publishing later. If `gh` isn't signed in, ask them to run `gh auth login` themselves and follow its prompts.
   - **GitHub account but no `gh`:** they open https://github.com/pachecod/newsgames-kit, click **Use this template → Create a new repository**, make it private, and give you the new repository's URL. Then `git clone <that-url> <folder>`.
   - **No GitHub account yet (or `gh` is signed in as someone else):** `git clone https://github.com/pachecod/newsgames-kit <folder>`, then `git -C <folder> remote rename origin upstream` and `git -C <folder> remote set-url --push upstream no-push` so a later push can't go to the instructor's repository. They can still build games. Publishing will create their own repository later (see the `publish-render` skill).
4. **Check it worked.** The folder has `CLAUDE.md`, `.claude/skills/` with four skills, `templates/` and `games/`.
5. **Hand off.** Tell the student the full path, and that they must now start a **new** Claude Code session with that folder as its working folder. The rules and skills load only then. In the Claude desktop app: start a new session and choose that folder. In a terminal: `cd` into the folder and run `claude`. Don't start building a game in this session.

Never type a password or token for the student, and never push to `pachecod/newsgames-kit`.

## What the templates already do

- Phone and desktop layouts, light and dark mode, 48px touch targets, visible keyboard focus.
- Screen reader announcements for feedback, and focus that moves sensibly between screens.
- Every answer can carry a source link. Missing sources are flagged on screen or in the console.
- A "last checked" date and a corrections contact in the footer.
- Content checks on load, with plain-language error messages when data is wrong.
- Share text for the result (the quiz and puzzle), using the share sheet on phones and the clipboard elsewhere.

## What was tested, and what was not

Tested in headless Chromium: each template at 320, 360 and 390px wide and at 1280px wide, in light and dark mode. This covered
full playthroughs (every question, every ending, win and loss paths, replay), keyboard navigation, the share fallback,
bad-data error screens, and the story checker on deliberately broken stories.

Tested in Claude Code (October 28, 2026): a session started in the kit's folder loaded `CLAUDE.md` and the three genre skills.
Given "I want to make a news quiz about how to spot manipulated photos," it wrote a brief and waited for approval. After
approval it built a playable quiz with sample questions marked `sample: true` and `TODO` sources, then ran the checklist. A
session started in the *parent* folder loaded none of it, which is why students must open the kit's own folder.

Not tested:

- **Claude Code with the puzzle and story skills** (only the quiz was run end to end), and the "Setting up with Claude Code" and `publish-render` steps with a student's own GitHub and Render accounts.
- Real phones, Safari, or screen readers. Please try at least one iPhone and one Android phone.

## Sample content: check it before it reaches students

- The SPJ Code of Ethics claims (the four principles, and the verify, speed, motive, response and corrections points) were checked against copies of the code retrieved while building this.
- The remaining quiz questions and the puzzle notes are general journalism-literacy statements, marked `sample: true` or labeled as a sample puzzle. Read them before use. Newsroom practice varies, especially for the puzzle's "on the record / on background" terms.
- The story is fiction. Two of its concepts (independent confirmation, show your work) have no sources on purpose, so that `index.html?debug` has something to flag. Add sources before publishing a story like it.
- `corrections@example.com` is a placeholder address.

## Publishing to Render

Ask Claude to "publish my game" and it uses the `publish-render` skill. Render deploys from Git, so each student needs
a GitHub account (a private repository works) and a Render account (signing in with GitHub is easiest). Claude commits
and pushes to the student's own repository (creating one if they cloned the kit directly), and walks the student
through **New → Blueprint** in Render.
Only `games/` is published, with `games/index.html` as the front page. Each later `git push` updates the site.

Free Render static sites don't sleep or expire. They stay up until the student deletes them in the Render dashboard,
which the skill also covers. The site is public to anyone with the link.

## Making it yours

- **Restyle:** change the design tokens at the top of each `style.css`. Colors, fonts and corner radius all read from them.
- **Change the rules:** edit `CLAUDE.md`. It is plain language. Anything you want Claude Code to always or never do, put there.
- **Add a genre:** copy a skill folder, change its `name` and `description`, and write down your own template and rules. A map game or a data explainer would be natural next ones.
- **Arcade-style games** (movement, collisions, real-time): this kit does not include a baseline for those. Community Claude Code skills for Phaser and Three.js exist. Review any you install, since skills can include scripts.

## Conventions worth teaching

- Content, logic and look are separate files. A reporter can fix a fact without touching code.
- Sources and dates are part of the game, the same way a byline is part of a story.
- The brief comes first. A game with no learning goal is usually a worse game.
