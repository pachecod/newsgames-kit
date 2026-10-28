# Make a news game with Claude Code

This guide gets you from nothing to a playable news game on your phone, and then online. Plan on about an hour.
You don't need to know how to code.

## What you need

- **Claude Code**, in the Claude desktop app (Code tab) or in a terminal.
- **A GitHub account** (free): only needed to publish. Sign up at https://github.com/signup. If you don't have one yet, you can still build your game and add the account later.
- **A Render account** (free): only needed to publish. You'll make it at the end by signing in with GitHub.

## Step 1: Get the kit (5 minutes)

1. Open Claude Code in a normal folder, such as your Documents folder.
2. Paste this and press Enter:

   > Set up the news games kit for me from https://github.com/pachecod/newsgames-kit. Follow the "Setting up with Claude Code" steps in its README.

3. Answer Claude's questions:
   - **Where to put it:** a new folder, such as `newsgames` in Documents.
   - **Do you have a GitHub account?** Say yes or no. With an account, Claude makes your own private copy on GitHub, which makes publishing easier.
   - **"Is this your GitHub account?"** Only say yes if the name it shows is really yours. On a lab computer it might be someone else's.
4. Claude tells you where the kit is and **stops**. That's expected.

## Step 2: Open the kit's folder (1 minute). Don't skip this.

Start a **new** Claude Code session with the kit's folder as its folder:

- **Desktop app:** start a new session and choose the `newsgames` folder.
- **Terminal:** `cd` into the folder (for example `cd ~/Documents/newsgames`), then run `claude`.

**Why it matters:** the kit's rules and game skills only load when a session *starts* in that folder. If you open the folder above it, or one of the game folders inside it, Claude won't know about the kit.

**Check:** ask *"Which news game skills can you see?"* You should hear about `news-quiz`, `puzzle-game`, `narrative-teaching-game` and `publish-render`. If you don't, you're in the wrong folder.

## Step 3: Pick a game (5 minutes)

| Kind | Good for | Try saying |
|---|---|---|
| **Quiz** | Teaching a skill, checking facts, "real or fake" | "I want to make a news quiz about how to spot manipulated photos." |
| **Puzzle** | Vocabulary, people, places, a beat you cover | "Make a grouping puzzle using terms from the local news beat I cover." |
| **Story** | Dilemmas and tradeoffs, "walk in someone's shoes" | "Make a branching story where the player is a reporter deciding whether to publish a tip." |

Say who it's for (for example "college students on their phones"). Claude will ask if you don't.

## Step 4: Approve the brief (5 minutes)

Before building anything, Claude writes a one-page **brief** in `design/` that covers who the game is for, what a player should learn, and how it plays.
Read it. Change anything that isn't what you meant. Then say **yes** and Claude builds.

## Step 5: Build the smallest version (10 minutes)

Claude copies a template into `games/<your-game>/` and fills in `data.js`, the file that holds all the words in your game.
You'll get **sample questions marked `TODO`**. That's on purpose: Claude won't make up facts, quotes or links.

Your game has three files you might touch:

- `data.js`: the content (questions, answers, sources). This is the one you'll change most.
- `style.css`: the look. Colors and fonts are at the top.
- `game.js`: how it works. You usually won't need to change this.

To play it, ask Claude to open it, or double-click `games/<your-game>/index.html`.

## Step 6: Make it real journalism (most of your time)

- **Replace every sample** with a real case and a source. Open every link yourself.
- Ask Claude to help you word things, for example: *"Make question 3's wrong answers more believable,"* or *"Shorten the explanations."*
- Put your **byline** (how you want to be credited) and a real **corrections** contact in `data.js`.
- **Sensitive topics:** no points for suffering, and add a content note if it's needed.
- **AI disclosure:** decide how you'll tell players that AI helped. That's your call, but make one.
- Play it on **your phone**, and have someone else play it without your help.

## Step 7: Publish it (15 minutes, the first time)

Say: *"Publish my game."*

Claude checks your game first. It will warn you about leftover samples, missing sources, or a placeholder corrections address. Then:

1. It saves your work to GitHub. It asks before every upload, and you sign in yourself if asked. Never paste a password into the chat.
2. You go to https://dashboard.render.com, sign in with GitHub, and click **New → Blueprint**. Claude walks you through each click.
3. When Render says **Live**, give Claude the `onrender.com` address and it checks the site.

Your site has a front page listing your games. Anyone with the link can see it.

**To update it:** make your change, then say *"Publish my update."* The site updates in a minute or two.

**To take it down:** in Render, open the site, go to **Settings**, scroll to the bottom and delete it. Free sites stay up until you delete them.

## If something goes wrong

- **Claude doesn't mention the kit, a brief, or the skills:** you're in the wrong folder. Go back to Step 2.
- **"git: command not found":** on a Mac, run `git --version` and accept the install. On Windows, install Git from https://git-scm.com, then try again.
- **A game page is blank:** ask Claude *"Check my game for errors in the browser console."*
- **It looks wrong on a phone:** tell Claude what you see, for example *"On my phone the buttons run off the edge."*
- **Stuck:** tell Claude exactly what you did and what you saw. Copy the error message if there is one.

## The rules Claude follows here (so you know what to expect)

- It won't invent facts, quotes, statistics, names or links. It leaves a `TODO` for you instead.
- Every fact a player is told needs a source.
- Fiction is labeled as fiction.
- Games work on phones and laptops, with a keyboard and with screen readers, in light and dark mode.
- It won't collect players' names or emails.
- It explains what it changed after each step. Ask "why?" any time.
