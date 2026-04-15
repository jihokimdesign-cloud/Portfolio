"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Hand, Sparkles } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

const DEMOS = [
  {
    title: "Bloom Garden",
    desc: "Open your hand and watch flowers bloom from your fingertips.",
    tech: "MediaPipe · Gesture",
    icon: <Hand size={18} />,
    video: "/Sub_proj/flower_bloom.mp4",
    color: "#6366F1",
  },
  {
    title: "Finger Spell",
    desc: "Spell out sentences with hand signs, letter by letter.",
    tech: "MediaPipe · Gesture",
    icon: <Sparkles size={18} />,
    video: "/Sub_proj/fingerspell_demo.mov",
    color: "#FF5210",
  },
  {
    title: "Kaleidoscope",
    desc: "Draw once, mirror eight times — create mandalas in seconds.",
    tech: "Canvas · Symmetry",
    icon: <Brain size={18} />,
    video: "/Sub_proj/AIlab_3_demo.mov",
    color: "#22C55E",
  },
];

function DemoVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);
  return (
    <video ref={ref} src={src} muted loop playsInline className="h-full w-full object-cover" />
  );
}

export default function AILab() {
  return (
    <SectionWrapper id="ailab">
      <div className="mb-12">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-widest text-text-muted"
        >
          AI & AR Experiments
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text md:text-5xl"
        >
          AI Lab
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-lg text-sm leading-relaxed text-text-muted"
        >
          Three experiments running entirely in your browser. No servers — just your camera, your drawings, and a neural network.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        {DEMOS.map((demo, i) => (
          <motion.div
            key={demo.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-smooth-hover"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-neutral-900">
              <DemoVideo src={demo.video} />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: demo.color }}
                >
                  {demo.icon}
                </div>
                <div>
                  <p className="font-display text-base font-extrabold text-text">{demo.title}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-muted">{demo.tech}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {demo.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* AR Research */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-smooth-hover">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#0c1a2e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Sub_proj/CookAR_gif.webp" alt="CookAR" className="h-full w-full object-cover" />
          </div>
          <div className="p-5">
            <p className="font-display text-base font-extrabold text-text">CookAR</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              AR system with real-time object affordance augmentations to support safe kitchen interactions.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700">UIST 2024 Best Paper</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-text-muted">AR/VR</span>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-smooth-hover">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a2e]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Sub_proj/XR_gif.png" alt="XR Furniture Shopping" className="h-full w-full object-cover" />
          </div>
          <div className="p-5">
            <p className="font-display text-base font-extrabold text-text">XR Furniture Shopping</p>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Investigating user engagement with 3D furniture representations in extended reality shopping.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">Medium Published</span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-text-muted">XR</span>
            </div>
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
