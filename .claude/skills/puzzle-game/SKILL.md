---
name: puzzle-game
description: Build or modify a puzzle game for desktop and mobile browsers, such as grouping/connections puzzles, word puzzles, matching, sorting, ordering, or any "figure it out" game built from news content. Starts from templates/puzzle.
---

# Puzzle game

Puzzles turn news material (vocabulary, people, places, dates, headlines, data) into something people want to solve.
The template is a **grouping puzzle**: 16 tiles, four hidden groups of four, four mistakes.

## Start from the template

Copy `templates/puzzle/` to `games/<game-name>/`. Do not edit the template.
A new puzzle is mostly a new `data.js`: four `groups`, each with `label`, `level` (1 easiest to 4 hardest), four `words`, and a `note` that explains the group.
The game checks the data on load (four groups, four words each, no duplicates, unique levels) and shows what is wrong.

## What makes a good grouping puzzle

- **Red herrings.** At least one word should plausibly fit two groups. But there must be exactly one arrangement that makes all 16 words work. Check this by hand, then try to solve it a second way. If you can, rewrite it.
- **Specific labels.** "Parts of a news story" is a better label than "Journalism terms".
- **A difficulty ladder.** Level 1 is obvious on sight. Level 4 needs a lateral thought, or an insider's knowledge the note then teaches.
- **A note that teaches.** The note appears at the end. It should leave the player knowing something they didn't.
- **Short tiles.** One to three words. Long tiles wrap badly on a 320px phone.
- **Fair.** No obscure trivia that can't be learned from the note. No two groups that are really the same group.

## Making puzzles from news content

Ideas that work: the people in one story and their roles; places in a region's news; terms from a beat (courts, city hall, sports, weather); headline words that share a pattern; datelines; sections of a paper; names of a public agency's departments.

Rules for factual puzzles:

- Each word is a claim about its group. Check each one against a source. Add an optional `source` (label and URL) to the group in `data.js`, and show it with the end-of-game note.
- Time-sensitive facts (who holds an office, who plays for a team) need a date in the label or note, and `meta.lastVerified` updated.
- Don't build puzzles around victims of crime or tragedy, or use a private person's name.
- Names with more than one spelling or form: use the form the outlet's style guide uses and say which.

## Other puzzle formats (ask the student first; each needs new code)

- **Word guess (five-letter style):** You need your own word list from your beat's vocabulary. Do not copy another game's word list. Provide an on-screen keyboard, because phones are the main device. Don't rely on color alone for letter feedback: use a symbol or a pattern too.
- **Matching pairs:** cards that flip, or a two-column matcher. The two-column matcher is far more accessible than flip cards.
- **Put in order:** events by date, steps in a process, headline to correct lede. Use up/down buttons as well as dragging.
- **Mini crossword:** only if the student can write the grid and clues by hand. Generating a valid crossword is hard. Don't promise it.
- **Fill in the blank (cloze):** a short passage with missing words from a word bank.

## Daily puzzle and replay

For one puzzle a day, key it to the player's local date and keep the data as a list of puzzles:
`PUZZLES = [ { date: "2026-11-02", groups: [...] }, ... ]`, choosing the entry whose `date` matches today
and falling back to the most recent one. Say on the page when the next puzzle arrives.
To remember a finished puzzle, use `localStorage` inside try/catch and make the game work if it fails.

## Accessibility notes specific to puzzles

- Tiles are real `<button>`s with `aria-pressed`. Selection is shown with more than color (the template inverts contrast).
- After checking a guess, keyboard focus goes to the first tile, or to the end heading when the game is over.
- Share text uses emoji squares, which is spoiler-free and fits a text message. Keep a plain-text alternative.
- Give a way to play with no time pressure. Don't add a timer by default.

## Check it

Solve it, lose it, make a one-away guess, repeat a guess, shuffle, deselect, and play again.
View at 320px and 360px: no tile text should be clipped or break mid-word.
Tab through it. Open the console: bad data is reported there.
