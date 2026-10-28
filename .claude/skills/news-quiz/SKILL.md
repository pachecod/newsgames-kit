---
name: news-quiz
description: Build or modify a news quiz game for desktop and mobile browsers. Use for multiple choice, true/false, "real or fake", headline-check, news literacy, current events, or "how well do you know this story" quizzes. Starts from templates/news-quiz.
---

# News quiz

A quiz is the simplest news game and the best first project. The craft is in the questions, not the code.

## Start from the template

Copy `templates/news-quiz/` to `games/<game-name>/`. Do not edit the template.
The game reads everything from `data.js`: `meta`, `settings`, `results`, and `questions`.
Most quizzes need only `data.js` changes and a few color tokens at the top of `style.css`.

Question fields: `id`, `type` (`multiple-choice` or `true-false`), `prompt`, optional `context`
(a headline, quote or scenario shown above the prompt), `choices`, `answer` (index from 0),
`explanation`, `source` (`label`, `url`, optional `date`), and `sample: true` for placeholders.

## Formats that fit the template with no code changes

- **Multiple choice** with one correct answer.
- **True or false.** Write the claim as a full sentence.
- **Real or fake.** Put the headline, post or claim in `context`, ask "Is this real?", and use the explanation to show how you checked.
- **Which is the primary source?** One original record among secondary ones.
- **Spot the problem.** Show a short passage in `context` and ask which problem it has (missing attribution, loaded word, unsupported claim).

## Formats that need code (ask the student first)

- **Put in order** (timeline of events): drag or up/down buttons, with a keyboard alternative.
- **Guess the number** (a statistic): a slider or number field, with a tolerance and an explanation of the real figure and its source.
- **Image questions:** requires an image the student has rights to, and `alt` text on every image.
- **Daily quiz:** same questions for everyone on a given date. See the snippet below.

## Writing good questions

- One clear correct answer. Wrong choices should be plausible, not silly.
- The prompt must make sense without the choices. Avoid "all of the above" and trick wording.
- The explanation teaches in two or three sentences: why the answer is right, and what a reader could do next time.
- Mix easy and hard. Put the most interesting question early.
- Keep to 5 to 10 questions. People finish short quizzes and share them.
- Reading level: plain language. Define jargon in the explanation.

## Editorial checks (required before publishing)

- Every non-sample question has a `source` whose URL you have opened. Never guess a URL.
- Time-sensitive questions (officeholders, prices, records, laws) get a date in the prompt or explanation, and `meta.lastVerified` is updated.
- Don't build questions that need a player to know a private person's details, or that turn a tragedy into a score.
- "Gotcha" questions that punish people for not knowing a fact are weak. Prefer questions where the explanation gives readers a skill.
- If a real news story is the subject, quote only short phrases and link to the original. Do not paste article text.
- Check wording for stereotypes. If a question is about a group of people, have someone from that group or a second editor read it.

## Extensions

**Daily quiz** (stable order by local date, no server needed):

```js
function seedFromToday() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
function mulberry32(a) {            // small seeded random number generator
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Replace `Math.random()` in `shuffled()` with `const rand = mulberry32(seedFromToday())` and call `rand()`.
Remember that "daily" means the player's local midnight, and say so on the page.

**Timer:** only if the format needs it. Offer an untimed mode, never end the quiz on a timeout without warning, and do not announce every second to screen readers.

**Leaderboard:** needs a server and collects data, so it is out of scope. Use the share text instead.

## Check it

Play every question and both outcomes (right and wrong). View at 360px and desktop. Tab through it.
Open the console: warnings name any question missing a source or explanation.
