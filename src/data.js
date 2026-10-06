// Sample posts (original wording). Posts you publish on the site are saved in the browser.
export const seed = [
  { id: "the-sail", title: "The Storm and the Sail", variant: "bust", date: "2026-09-02", tags: ["control", "discipline"],
    quote: "You do not control the storm. You control the sail.",
    body: "Most of our suffering comes from trying to command what was never ours: other people's opinions, the traffic, the outcome. The Stoic move is quieter. Name what is yours (your effort, your judgment, your next action) and give it everything. Then let the rest be weather." },
  { id: "the-path", title: "When the Path Is Blocked", variant: "column", date: "2026-09-09", tags: ["resilience", "obstacles"],
    quote: "What blocks the path becomes the path, if you let it train you.",
    body: "A setback arrives as an insult to your plan. Look again. It is also a rep, a lesson, a test of the character you claim to have. You are not asked to enjoy it. You are asked to use it. Ask what this obstacle can build in you, and begin there." },
  { id: "spend-time", title: "Spend Time Like a Sovereign", variant: "bust", date: "2026-09-16", tags: ["time", "focus"],
    quote: "Time is not lost. It is spent. Spend it like a sovereign.",
    body: "Nobody steals your hours as thoroughly as you give them away. A sovereign knows the treasury is finite and rules it with intent. Tonight, review the day like an accountant: what did you buy with your attention, and was it worth the price?" },
  { id: "anger-debt", title: "Anger Is a Debt", variant: "column", date: "2026-09-23", tags: ["anger", "peace"],
    quote: "Anger is a debt you pay with your own peace.",
    body: "When someone wrongs you, the injury happens once. Anger makes you relive it, again and again, and the payments come from your calm. Pause before you answer. A steady reply costs nothing, and it keeps your mind yours." },
  { id: "morning-friction", title: "Expect the Friction", variant: "bust", date: "2026-09-30", tags: ["morning", "preparation"],
    quote: "Begin the day by expecting friction, and meet it unafraid.",
    body: "The Stoic does not hope for an easy day. He prepares for an honest one: delays, difficult people, small failures. Rehearse them in the morning and they lose their power to surprise you. Calm is mostly preparation." },
  { id: "enough", title: "Enough Is a Decision", variant: "column", date: "2026-10-04", tags: ["virtue", "contentment"],
    quote: "Enough is not a number. It is a decision.",
    body: "There is always a next level, a bigger target, a better version of what you own. If you wait for a number to feel enough, you will wait forever. Decide what a good life requires, protect it, and spend the surplus on becoming better, not having more." },
];

export const makeCaption = (p) =>
  `${p.body}\n\nSave this as a reminder and share it with someone who needs it today.\n\n@stoichonour\n\nKeywords: ${["stoicism", "mindset", ...p.tags].join(", ")}\n\n#Stoic #Stoicism ${p.tags.map((t) => "#" + t.replace(/\W/g, "")).join(" ")}`;
