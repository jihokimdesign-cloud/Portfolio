// Editable copy for the interactive hero. Keep the AI-bar sentences here so
// they're easy to tweak without touching the component logic.

export type PhraseKey = "ai" | "people" | "code";

// Caption shown under the divider while a phrase is hovered (crossfade).
export const PHRASE_CAPTIONS: Record<PhraseKey, string> = {
  ai: "AI that notices your situation and speaks up first.",
  people:
    "I test ideas with real people first, from 24 trainees to 11,000+ volunteers.",
  code: "Figma for concepts, Claude Code for everything that moves.",
};

// §4-1 — AI bar loops through these situations while "AI products" is hovered.
export const AI_SITUATIONS: { situation: string; reply: string }[] = [
  {
    situation: "Hands full while cooking",
    reply: `No problem. Say "next" and I'll read the step.`,
  },
  {
    situation: "After a long day",
    reply: "Rough day? Let's keep tonight's entry short.",
  },
  {
    situation: "End of the training week",
    reply: "You got better at 3 skills. Here's what to try next.",
  },
  {
    situation: "Stuck on a step",
    reply: "Looks like step 4 is tricky. Want a hint?",
  },
];

// §4-2 — people chips. Numbers count up from 0; 11,000+ gets comma formatting.
export const PEOPLE_CHIPS: {
  value: number;
  suffix: string;
  label: string;
}[] = [
  { value: 24, suffix: "", label: "trainees tested it first" },
  { value: 500, suffix: "", label: "beta testers" },
  { value: 11000, suffix: "+", label: "volunteers" },
];

// §4-3 — tool icons. 3 on the left, 2 on the right. Assets live in public/icon/.
export const TOOL_ICONS: { name: string; src: string }[] = [
  { name: "Figma", src: "/icon/figma.png" },
  { name: "Claude", src: "/icon/claude.png" },
  { name: "Cursor", src: "/icon/cursor.png" },
  { name: "React", src: "/icon/react.png" },
  { name: "After Effects", src: "/icon/ae.png" },
];
