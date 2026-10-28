---
name: publish-render
description: Publish the student's games to a free Render static site, update a published site, or take it down. Use when the student says publish, put it online, share a link, deploy, Render, GitHub, or "get a URL for my game". Uses render.yaml and games/index.html.
---

# Publish to Render

Render hosts the `games/` folder as a free static site, at an address like `https://newsgames-abc.onrender.com`.
Render deploys from a Git repository, so the path is: this folder → a GitHub repository → Render.
After the first setup, every `git push` updates the site in about a minute.

What gets published: only `games/` (set by `staticPublishPath` in `render.yaml`). `templates/`, `design/` and the briefs stay off the site.
The site is public. Anyone with the link can open it, even if the GitHub repository is private.

## Rules for you (Claude)

- The student creates accounts and signs in. Never type a password, token or verification code for them, and never ask them to paste one into chat.
- Creating a GitHub repository, pushing, and deleting a site all go outside this computer. Say what you are about to do and get a yes each time.
- Never use `git push --force`. Never commit secrets, personal data, or files the student hasn't seen.
- If a step fails, show the error in plain words and stop. Don't try workarounds that change the student's accounts.

## Step 1: Check the games (every time)

For each folder in `games/` that will be published, check and report in a short list:

- The game loads with no console errors, and plays through to the end. Use the "Before you say it's done" checks in `CLAUDE.md`.
- Sample content: any `sample: true`, sample banner (`meta.note`), or `TODO` left.
- Every `source` URL opens. `lastVerified` is a real date. `corrections` is a real contact, not `corrections@example.com`.
- The byline is what the student wants the public to see. Remind them not to publish a full name if they'd rather not.

A class preview with sample content is fine **if the sample notice stays visible**. Ask the student: "This still has sample content. Publish it as a preview with the sample notice showing, or fix it first?" Never remove a sample notice just to publish.

## Step 2: Update the front page

`games/index.html` is the site's home page. Add one `<li>` per game that should be listed, using the pattern in the comment there:
the game's `meta.title` and a one-line description, linking to `game-folder-name/`. Remove entries for folders that no longer exist.
Use plain text in the link. Keep the existing styles.

Ask whether to change the `<h1>` and subtitle (for example, to the student's name or class). Don't guess.

## Step 3: Name the site (first time only)

The site address comes from `name` in `render.yaml` (default `newsgames-student`). Suggest `newsgames-` plus something short the student picks, such as initials.
Lowercase letters, numbers and hyphens. If the name is taken, Render may add a few extra characters to the address. That's fine. The real address appears in the Render dashboard.

## Step 4: Put the folder on the student's GitHub (first time only)

1. Check for the tools: `git --version` and `gh --version`.
   - No `git`: on a Mac, running `git --version` offers to install the command line tools. On Windows, the student installs Git from git-scm.com. Stop until that's done.
2. Find out where this folder pushes: `git remote -v`.
   - **`origin` is the student's own repository** (they made it from the template): skip creating a repository in item 5 below. Commit, then `git push` after a yes.
   - **`origin` is `pachecod/newsgames-kit`** (they cloned the instructor's kit directly): never push there. Run `git remote rename origin upstream`, then create their own repository in item 5.
   - **No remotes, or not a Git repository at all** (`git status` fails, for example the kit came from a zip): run `git init -b main` if needed, then create their repository in item 5.
3. Check `git config user.name` and `git config user.email`. If either is empty, ask the student what to use (a GitHub "noreply" email is fine) and set it for this repository only, without `--global`.
4. Show the student the list of files about to be committed (`git status --short`), then commit: `git add -A` and `git commit -m "Publish news games"`. `.gitignore` already leaves out `.zip` files and system junk.
5. Create the repository and push (skip if `origin` is already theirs). Recommend a **private** repository: Render can still read it, and the briefs stay private.
   - **If `gh` is installed:** run `gh auth status`. If the student isn't signed in, ask them to run `gh auth login` themselves in the terminal and follow its prompts (it opens the browser). Then, after a yes: `gh repo create <repo-name> --private --source . --push`.
   - **Without `gh`:** the student goes to `https://github.com/new`, creates an **empty** private repository (no README, no license), and gives you its URL. Then: `git remote add origin <url>` and `git push -u origin main`. If Git asks them to sign in, they do it in the window that opens.
6. Confirm the push worked: `git log --oneline -1` and `git status` show nothing left to push.

## Step 5: Connect Render (first time only)

The student does this in the browser. Walk them through it one step at a time and wait for each:

1. Go to `https://dashboard.render.com` and sign up or sign in. Signing in with GitHub is the easiest choice.
2. Click **New**, then **Blueprint**.
3. If Render asks, connect the GitHub account and allow access to this repository. Choosing only this repository is fine.
4. Click **Connect** next to the repository. Give the Blueprint any name, and leave the branch as `main`.
5. Render shows one static site to create. Click **Deploy Blueprint**.
6. Open the new static site in the dashboard. When the deploy says **Live**, copy the `onrender.com` address at the top.

Without Blueprints: **New → Static Site**, pick the repository, leave the build command empty (or use `echo ok`), set **Publish directory** to `games`, then **Create Static Site**.

## Step 6: Check the live site

Ask for the address. Open it and check:

- The front page lists every game, and each link opens its game.
- One game played through on the live site, with no console errors.
- The student opens the address on their own phone. That's required before calling it published.

Tell the student exactly what you checked and what you couldn't.

## Updating a published game

Make the change, test it locally, then (after a yes) `git add -A`, `git commit -m "<what changed>"`, `git push`.
Render redeploys automatically. Check the live address after a minute or two. A hard refresh may be needed.

## Taking it down

Free static sites on Render don't expire. They stay up until deleted. When the student is done (for example, at the end of the semester):

1. In the Render dashboard, open the static site → **Settings** → scroll to the bottom → click the delete button, and confirm.
2. If they used a Blueprint, they can also delete the Blueprint under **Blueprints**.
3. Deleting or keeping the GitHub repository is their choice. Deleting the site does not delete the repository.

Only the student clicks delete. You can tell them where the button is.

## If something goes wrong

- **Render says it can't find the repository:** the GitHub connection doesn't include it. In Render, go to account settings → GitHub → configure, and add the repository.
- **Deploy fails with a publish-path error:** check `render.yaml` is at the top of the repository and `games/` was committed (it has to hold at least one file).
- **The front page loads but a game shows a 404:** the link in `games/index.html` must match the folder name exactly, including case, and end in `/`.
- **A change doesn't show up:** check the push went through (`git status`), then check the deploy log in Render.
