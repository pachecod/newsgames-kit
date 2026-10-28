---
name: narrative-teaching-game
description: Build or modify a branching story, role-play, decision game or simple simulation that teaches something through the player's choices, for desktop and mobile browsers. Use for newsroom dilemmas, "walk in someone's shoes" explainers, civic process explainers, and choose-your-path stories. Starts from templates/narrative.
---

# Narrative teaching game

A narrative game teaches by letting the player make choices and see the consequences. The story is the delivery
vehicle. The learning is the point. Start with the lesson, not the plot.

## Start from the template

Copy `templates/narrative/` to `games/<game-name>/`. Do not edit the template.
Everything is in `data.js`: `meta`, `learning`, `vars`, `concepts`, `nodes`.
Open `index.html?debug` to run the story checker and jump to any screen.

How the data fits together:

- A **node** is one screen: `label`, `text` (a list of paragraphs), and either `choices` or an `ending`.
- A **choice** has `label`, `to` (the next node), optional `effects` (changes to `vars`), and optional `concept`.
- A **concept** is an idea the story teaches: `title`, `explanation`, `sources`. After the ending, the debrief explains each concept the player touched.
- `vars` are simple counters. They show trade-offs. They are not a grade.

## Design the lesson first

Before writing any story, fill in the brief (`design/brief-template.md`) and write:

1. **Two or three learning goals**, each starting with a verb a player could show: "weigh", "identify", "explain".
2. **The decisions that matter.** Each should be a real dilemma with something to lose either way.
3. **The concepts** that explain those decisions, each with a source.

Then write the nodes. If a node doesn't serve a learning goal, cut it.

## Writing the story

- **Length:** 8 to 15 screens, three to five endings, five to ten minutes. Short stories get finished and replayed.
- **Second person, present or past tense, plain language.** Two short paragraphs per screen is plenty on a phone.
- **Real dilemmas, defensible options.** If one choice is obviously stupid, players learn nothing. Make the options all reasonable, with different costs.
- **No single "right" ending.** Include a best-reasoned ending, but also endings that are mixed or costly. Say honestly what each choice gained and cost.
- **Consequences are visible.** The next screen should show what the last choice caused.
- **Choices are specific actions**, not vague attitudes. "Call the county finance office" beats "Be thorough".
- **Don't punish curiosity.** An ending that blames a player for exploring is a bad ending.
- **Branch shapes that stay manageable:** a short spine with side paths that rejoin (a "bottleneck"), or two or three early forks that each lead to their own ending.

## The debrief is where the learning happens

After an ending, the template shows: the player's path, the ideas behind each choice (with sources), the meters, and how many endings they have found.
Write concept explanations in plain language, two to four sentences, and say what the idea means for what the player just did.
Every concept needs at least one source before publishing. The checker lists any that don't.

## Editorial and ethical rules for story games

- **Fiction is labeled.** `meta.fictionNote` says so. If it's based on a real case, say which, and source the real facts. Change identifying details of private people.
- **Never put invented quotes in a real person's mouth.** Invent a composite character and say so.
- **Real policies and processes must be accurate.** If you describe how a court, a city council or an agency works, check it against an official source and cite it. Say when practices vary by place.
- **Content notes** for violence, abuse, self-harm or other heavy topics, shown before the story starts. Avoid depicting graphic harm. Do not turn suffering into points.
- **Don't build manipulative persuasion.** A teaching game may argue a position, but it should say so and show the other side's strongest case in the debrief.
- **Simplified models are labeled.** The template's debrief says meters are a simplification. Keep that sentence, or write a better one.

## Extending the engine (ask the student first)

- **Flags and requirements:** add `flags: {}` to the run, let a choice `set` a flag, and let a later choice have `requires`. Update the checker so it doesn't flag unreachable choices incorrectly.
- **Images:** need rights and `alt` text. Keep the story readable without them.
- **Saving progress:** `localStorage` inside try/catch. The story must still work if it fails.
- **Hidden meters:** if you don't want players optimizing numbers, keep `showMetersWhilePlaying: false` (the default).
- **Import from Twine:** possible, but it brings a lot of code. A simple converter from Twee text to `nodes` is usually better than adopting Twine's runtime.

## Check it

1. Run `index.html?debug`. Fix every error. Fix warnings, or know why you're leaving them.
2. Play every ending at least once. Use the jump menu to reach screens quickly.
3. Check the debrief makes sense after each ending, including endings reached by only one choice.
4. View on a phone-width screen. Tab through it. Check the "Go back one step" button.
5. Read the whole thing aloud once. Awkward sentences show up.
