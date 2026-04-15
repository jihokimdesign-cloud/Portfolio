"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

/* ── Data ─────────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Tim Raftis",
    role: "CPO",
    company: "TAP3D",
    period: "2024",
    avatar: "/Tim Raftis.jpeg",
    accentColor: "#6366F1",
    defaultRotate: -18,
    defaultX: -200,
    defaultY: 20,
    quote:
      "Jiho just gets how to make complicated things feel simple. She'd show up with prototypes before we even finished talking about the problem.",
    fullQuote:
      "Jiho just gets how to make complicated things feel simple. We were building AR training tools for engineers who had zero patience for clunky interfaces, and she'd show up with prototypes before we even finished talking about the problem. She wasn't waiting for specs, she was out testing with actual engineers on the factory floor. The training time dropped by 30% and honestly I think that's because she designed it like someone who'd have to use it herself. Really solid to work with.",
  },
  {
    name: "Jongtea Lee",
    role: "Professor",
    company: "Seoul Women's University",
    period: "2023",
    avatar: "/Jongtealee.jpg",
    accentColor: "#34D399",
    defaultRotate: 18,
    defaultX: 200,
    defaultY: 20,
    quote:
      "Jiho redesigned our department dashboard and the difference was night and day. Both professors and students actually started using it without asking how.",
    fullQuote:
      "Jiho redesigned the dashboard system for our department, both the professor and student sides. Before, nobody really used it because it was confusing and felt like an afterthought. She sat down with faculty and students, asked the right questions, and came back with something that just worked. The professors stopped emailing me about where to find things, and the students started checking it on their own. That tells you everything. She has a good eye for what people actually need, not just what looks nice.",
  },
];

/* ── Full testimonial modal ────────────────────────────────────────────── */
function TestimonialModal({
  t,
  onClose,
}: {
  t: (typeof TESTIMONIALS)[0];
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-[24px] bg-white p-8 shadow-2xl"
          style={{ border: "1px solid #e5e7eb" }}
        >

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200 transition-colors"
          >
            <X size={14} />
          </button>

          {/* Person */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="relative h-12 w-12 overflow-hidden rounded-full"
              style={{ boxShadow: `0 0 0 2px ${t.accentColor}` }}
            >
              <Image src={t.avatar} alt={t.name} fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{t.name}</p>
              <p className="font-mono text-[11px]" style={{ color: t.accentColor }}>{t.role}</p>
              <p className="font-mono text-[10px] text-neutral-400">{t.company} · {t.period}</p>
            </div>
          </div>

          {/* Full quote */}
          <p className="text-[14px] leading-[1.8] text-neutral-600">
            &ldquo;{t.fullQuote}&rdquo;
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function Testimonials() {
  const [hovered, setHovered]   = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

  function getCardStyle(i: number) {
    const t = TESTIMONIALS[i];
    const isActive = hovered === i;
    const isIdle   = hovered === null;

    if (isActive) {
      return { rotate: 0, x: t.defaultX, y: t.defaultY - 16, scale: 1.04, zIndex: 50 };
    }
    if (isIdle) {
      return { rotate: t.defaultRotate, x: t.defaultX, y: t.defaultY, scale: 1, zIndex: 10 - i };
    }
    const diff = i - hovered!;
    const sign = diff > 0 ? 1 : -1;
    return {
      rotate: t.defaultRotate + sign * 8,
      x: t.defaultX + sign * 60,
      y: t.defaultY + 14,
      scale: 0.95,
      zIndex: 5 - Math.abs(diff),
    };
  }

  return (
    <SectionWrapper id="testimonials">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-4 flex items-start gap-4"
      >
        <div>
          <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
            What others say!
          </h2>
          <p className="mt-1 text-sm italic text-text-secondary">
            I didn&apos;t come up with these, I swear
          </p>
        </div>
      </motion.div>

      {/* ── Mobile: horizontal swipe snap ─────────────────────────────── */}
      <div
        className="md:hidden mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.name}
            className="w-[78vw] max-w-[300px] shrink-0 snap-center rounded-[22px] border border-neutral-200 bg-white p-5"
            style={{ boxShadow: "0 4px 18px rgba(0,0,0,0.07)" }}
          >
            <p className="mb-3 text-right font-mono text-[10px] text-neutral-400">{t.period}</p>
            <div className="mb-4 flex items-center gap-3">
              <div
                className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                style={{ boxShadow: `0 0 0 2px ${t.accentColor}` }}
              >
                <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <p className="text-[12px] font-semibold leading-tight text-neutral-900">{t.name}</p>
                <p className="text-[10px] font-mono" style={{ color: t.accentColor }}>{t.role}</p>
                <p className="text-[9px] font-mono text-neutral-400">{t.company}</p>
              </div>
            </div>
            <p className="text-[12px] leading-relaxed text-neutral-500">&ldquo;{t.quote}&rdquo;</p>
            <button
              onClick={() => setExpanded(i)}
              className="mt-4 font-mono text-[10px] font-semibold text-neutral-400 underline underline-offset-2"
            >
              read full testimonial →
            </button>
          </div>
        ))}
      </div>
      <p className="md:hidden mt-3 text-center font-mono text-[11px] text-text-secondary/40">
        swipe to read more
      </p>

      {/* ── Desktop: fan deck ──────────────────────────────────────────── */}
      <div
        className="relative hidden items-center justify-center md:flex"
        style={{ height: 500, marginTop: 40 }}
      >
        {TESTIMONIALS.map((t, i) => {
          const style    = getCardStyle(i);
          const isActive = hovered === i;

          return (
            <motion.div
              key={t.name}
              animate={style}
              initial={{ rotate: t.defaultRotate, x: t.defaultX, y: t.defaultY, scale: 1, zIndex: 10 - i }}
              transition={SPRING}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              className="absolute cursor-pointer select-none"
              style={{
                width: isActive ? 290 : 260,
                pointerEvents: hovered !== null && hovered !== i ? "none" : "auto",
              }}
            >
              <div
                className="relative overflow-hidden rounded-[22px] p-6"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  boxShadow: isActive
                    ? "0 16px 40px rgba(0,0,0,0.11)"
                    : "0 4px 18px rgba(0,0,0,0.07)",
                }}
              >
                <p className="mb-4 text-right font-mono text-[10px] text-neutral-400">{t.period}</p>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full"
                    style={{
                      filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                      boxShadow: isActive ? `0 0 0 2px ${t.accentColor}` : "0 0 0 2px #e5e7eb",
                      transition: "filter 0.4s, box-shadow 0.3s",
                    }}
                  >
                    <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold leading-tight text-neutral-900">{t.name}</p>
                    <p
                      className="text-[10px] font-mono"
                      style={{ color: isActive ? t.accentColor : "#9ca3af", transition: "color 0.3s" }}
                    >
                      {t.role}
                    </p>
                    <p className="text-[9px] font-mono text-neutral-400">{t.company}</p>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-neutral-500">&ldquo;{t.quote}&rdquo;</p>
                <div style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.25s" }} className="mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(i); }}
                    className="font-mono text-[10px] font-semibold text-neutral-400 underline underline-offset-2 hover:text-neutral-700 transition-colors"
                  >
                    read full testimonial →
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-6 hidden text-center font-mono text-[11px] text-text-secondary/40 md:block">
        hover a card to read · click to expand
      </p>

      {/* Full testimonial modal */}
      {expanded !== null && (
        <TestimonialModal t={TESTIMONIALS[expanded]} onClose={() => setExpanded(null)} />
      )}
    </SectionWrapper>
  );
}
