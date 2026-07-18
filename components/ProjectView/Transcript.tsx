import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimationConfig } from "../AnimationConfig";

interface Message {
  from: string; // e.g. "User, Day 3" or "AI"
  text: string;
  tone?: "bad" | "good"; // bad = the mismatch moment, gets emphasis
  side?: "left" | "right"; // defaults: first speaker left, others right
}

type Props = {
  messages: Message[];
  caption?: string;
};

// A conversation, staged as a scene — user on the left, system on the right.
const Transcript = ({ messages, caption }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const firstSpeaker = messages[0]?.from;

  return (
    <div
      ref={ref}
      className="col-span-full md:col-start-2 md:col-span-3 mt-16 mb-8"
    >
      <div className="flex flex-col gap-3">
        {messages.map((message, index) => {
          const isLeft = message.side
            ? message.side === "left"
            : message.from === firstSpeaker;
          return (
            <motion.div
              key={index}
              className={`flex flex-col max-w-[85%] md:max-w-[75%] ${
                isLeft ? "self-start items-start" : "self-end items-end"
              }`}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 14,
              }}
              transition={{
                duration: AnimationConfig.SLOW,
                ease: AnimationConfig.EASING,
                delay: index * 0.25,
              }}
            >
              <div className="text-xs uppercase tracking-[.14em] font-bold opacity-60 mb-1 px-1">
                {message.from}
              </div>
              <div
                className={`px-4 py-3 text-sm md:text-base leading-snug rounded-2xl ring-1 ring-current ${
                  isLeft ? "rounded-bl-md" : "rounded-br-md"
                } ${
                  message.tone === "bad"
                    ? "ring-opacity-60"
                    : message.tone === "good"
                    ? "ring-opacity-40"
                    : "ring-opacity-15 opacity-80"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          );
        })}
      </div>
      {caption && (
        <div className="text-sm opacity-60 mt-4 max-w-[50ch]">{caption}</div>
      )}
    </div>
  );
};

export default Transcript;
