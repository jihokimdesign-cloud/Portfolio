import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// Interactive recreation of the Adaptive Tone Framework:
// pick a message → the classifier reads it → typing dots run with
// variable latency (heavier emotion = longer pause) → adapted reply.
// The conversation area is skinned in Lepal's design language (space-purple
// night sky, pink glow, teal chips — matching the published app shots);
// classifier annotations stay editorial so they read as case-study voiceover.
interface Sample {
  chip: string;
  message: string;
  state: string;
  tone: string;
  reply: string;
  latency: number; // ms — variable latency by emotional weight
}

const SAMPLES: Sample[] = [
  {
    chip: "😰 anxious",
    message: "Just got back from meeting my advisor.",
    state: "Anxious",
    tone: "Calm & Validating",
    reply:
      "That sounds like it took a lot out of you. No rush — want to tell me the one thing still on your mind?",
    latency: 2600,
  },
  {
    chip: "😢 sad",
    message: "My friend hasn't texted me back in a week.",
    state: "Sad",
    tone: "Warm & Gentle",
    reply: "A week of silence can feel heavy. I'm here — what's the hardest part?",
    latency: 2200,
  },
  {
    chip: "😐 neutral",
    message: "Finished my last exam today.",
    state: "Neutral",
    tone: "Curious & Open",
    reply: "Big milestone. How are you feeling now that it's done?",
    latency: 1400,
  },
  {
    chip: "😊 positive",
    message: "I got the internship!!",
    state: "Positive",
    tone: "Celebratory & Affirming",
    reply: "YES! You worked for this. What was the moment you found out like?",
    latency: 1000,
  },
];

const lepal = {
  surface: "linear-gradient(165deg, #221440 0%, #1A0F33 55%, #241243 100%)",
  glow:
    "radial-gradient(42% 30% at 78% 8%, rgba(255,79,163,.28), transparent 70%), radial-gradient(50% 36% at 12% 92%, rgba(139,92,246,.35), transparent 70%)",
  pink: "#FF4FA3",
  teal: "#63E6C8",
  bubbleAI: "linear-gradient(135deg, #FF6FB5 0%, #8B5CF6 100%)",
};

const TypingDots = () => (
  <div className="flex flex-row gap-1 px-4 py-3">
    {[0, 1, 2].map((dot) => (
      <motion.span
        key={dot}
        className="block w-[6px] h-[6px] rounded-full bg-white"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1, repeat: Infinity, delay: dot * 0.18 }}
      />
    ))}
  </div>
);

const ToneDemo = () => {
  const [selected, setSelected] = useState<Sample | null>(null);
  const [phase, setPhase] = useState<"idle" | "thinking" | "replied">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const pick = (sample: Sample) => {
    clearTimeout(timeoutRef.current);
    setSelected(sample);
    setPhase("thinking");
    timeoutRef.current = setTimeout(() => setPhase("replied"), sample.latency);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div className="col-span-full md:col-start-2 md:col-span-3 mt-16 mb-8">
      <div
        className="text-xs font-bold uppercase tracking-[.14em]"
        style={{ color: "var(--accent, currentColor)" }}
      >
        Try it — pick a message
      </div>

      {/* phone surface — product voice */}
      <div
        className="relative mt-4 rounded-[1.75rem] p-5 md:p-6 text-white overflow-hidden shadow-xl"
        style={{ background: lepal.surface }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: lepal.glow }}
        />

        {/* spirit header */}
        <div className="relative flex flex-row items-center justify-between">
          <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-black/40">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
              style={{ background: lepal.bubbleAI }}
            >
              ✦
            </div>
            <div className="leading-none">
              <div className="text-xs font-bold" style={{ color: lepal.pink }}>
                Spirit
              </div>
              <div className="text-[10px] text-white/60 mt-0.5">LV. 9</div>
            </div>
          </div>
          <div className="text-xs text-white/40">9:41</div>
        </div>

        {/* sample chips */}
        <div className="relative flex flex-row flex-wrap gap-2 mt-5">
          {SAMPLES.map((sample, index) => (
            <button
              key={index}
              onClick={() => pick(sample)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                selected?.chip === sample.chip
                  ? "text-[#1A0F33]"
                  : "text-white/80 bg-white/10 hover:bg-white/20"
              }`}
              style={
                selected?.chip === sample.chip
                  ? { backgroundColor: lepal.teal }
                  : undefined
              }
            >
              {sample.chip}
            </button>
          ))}
        </div>

        {/* conversation */}
        <div className="relative mt-6 min-h-[190px] flex flex-col gap-3">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.div
                key={selected.chip}
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: AnimationConfig.NORMAL, ease: AnimationConfig.EASING }}
              >
                <div className="self-start max-w-[85%]">
                  <div className="text-xs uppercase tracking-[.14em] font-bold text-white/40 mb-1 px-1">
                    User
                  </div>
                  <div className="px-4 py-3 text-sm md:text-base leading-snug rounded-2xl rounded-bl-md bg-white text-[#2A1A4E]">
                    {selected.message}
                  </div>
                </div>

                <div className="self-end max-w-[85%] flex flex-col items-end">
                  <div className="text-xs uppercase tracking-[.14em] font-bold text-white/40 mb-1 px-1">
                    {phase === "replied"
                      ? `AI · ${selected.state} → ${selected.tone}`
                      : "AI · reading the room"}
                  </div>
                  <div
                    className="rounded-2xl rounded-br-md shadow-[0_0_24px_rgba(255,79,163,.25)]"
                    style={{ background: lepal.bubbleAI }}
                  >
                    {phase === "thinking" ? (
                      <TypingDots />
                    ) : (
                      <motion.div
                        className="px-4 py-3 text-sm md:text-base leading-snug"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: AnimationConfig.NORMAL }}
                      >
                        {selected.reply}
                      </motion.div>
                    )}
                  </div>
                  {phase === "replied" && (
                    <motion.div
                      className="text-xs text-white/40 mt-1 px-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      thought for {(selected.latency / 1000).toFixed(1)}s —{" "}
                      {selected.latency > 2000
                        ? "heavy emotional share"
                        : selected.latency > 1200
                        ? "moderate"
                        : "light check-in"}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {!selected && (
            <div className="text-sm text-white/50 pt-2">
              The classifier reads context, not keywords — and heavier emotions
              get a longer, more deliberate pause before the reply.
            </div>
          )}
        </div>

        {/* input pill — non-interactive, authenticity beat */}
        <div className="relative mt-5 flex items-center justify-between bg-white rounded-full px-4 py-2.5">
          <div className="text-sm text-[#2A1A4E]/50">say hi to your spirit</div>
          <div className="flex items-end gap-[2px] h-4" aria-hidden>
            {[6, 12, 8, 14, 7].map((bar, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full"
                style={{ height: bar, backgroundColor: lepal.pink }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm opacity-60 mt-4 max-w-[50ch]">
        Recreation of the production framework in the product&apos;s design
        language — four tone states, variable latency of 1–3s scaled to
        emotional weight.
      </div>
    </div>
  );
};

export default ToneDemo;
