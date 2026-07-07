import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

// Interactive recreation of the Adaptive Tone Framework:
// pick a message → the classifier reads it → typing dots run with
// variable latency (heavier emotion = longer pause) → adapted reply.
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

const TypingDots = () => (
  <div className="flex flex-row gap-1 px-4 py-3">
    {[0, 1, 2].map((dot) => (
      <motion.span
        key={dot}
        className="block w-[6px] h-[6px] rounded-full bg-current"
        animate={{ opacity: [0.2, 1, 0.2] }}
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
      <div className="text-xs font-bold uppercase tracking-[.14em]" style={{ color: "var(--accent, currentColor)" }}>
        Try it — pick a message
      </div>

      {/* sample chips */}
      <div className="flex flex-row flex-wrap gap-2 mt-4">
        {SAMPLES.map((sample, index) => (
          <button
            key={index}
            onClick={() => pick(sample)}
            className={`px-3 py-1.5 rounded-full ring-1 ring-current text-sm transition-opacity ${
              selected?.chip === sample.chip
                ? "ring-opacity-60"
                : "ring-opacity-15 opacity-60 hover:opacity-100"
            }`}
          >
            {sample.chip}
          </button>
        ))}
      </div>

      {/* conversation */}
      <div className="mt-6 min-h-[180px] flex flex-col gap-3">
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
                <div className="text-xs uppercase tracking-[.14em] font-bold opacity-40 mb-1 px-1">
                  User
                </div>
                <div className="px-4 py-3 text-sm md:text-base leading-snug rounded-2xl rounded-bl-md ring-1 ring-current ring-opacity-15 opacity-80">
                  {selected.message}
                </div>
              </div>

              <div className="self-end max-w-[85%] flex flex-col items-end">
                <div className="text-xs uppercase tracking-[.14em] font-bold opacity-40 mb-1 px-1">
                  {phase === "replied"
                    ? `AI · ${selected.state} → ${selected.tone}`
                    : "AI · reading the room"}
                </div>
                <div className="rounded-2xl rounded-br-md ring-1 ring-current ring-opacity-40">
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
                    className="text-xs opacity-40 mt-1 px-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
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
          <div className="text-sm opacity-40 pt-2">
            The classifier reads context, not keywords — and heavier emotions get a longer,
            more deliberate pause before the reply.
          </div>
        )}
      </div>

      <div className="text-sm opacity-40 mt-4 max-w-[50ch]">
        Recreation of the production framework — four tone states, variable latency of
        1–3s scaled to emotional weight.
      </div>
    </div>
  );
};

export default ToneDemo;
