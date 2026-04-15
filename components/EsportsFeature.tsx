"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Hand, Sparkles } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

/* ── Creative Work Data ─────────────────────────────────────────────── */
const FASHION_PHOTOS = [
  "/creative-work/fashion portfolio/자기소개 페이지.jpg",
  "/creative-work/fashion portfolio/무드보드1.jpg",
  "/creative-work/fashion portfolio/무드보드 2.jpg",
  "/creative-work/fashion portfolio/무드보드3.jpg",
  "/creative-work/fashion portfolio/01. PANTSS.jpg",
  "/creative-work/fashion portfolio/02. one piece.jpg",
  "/creative-work/fashion portfolio/PAGE 1.jpg",
  "/creative-work/fashion portfolio/outer 1.jpg",
  "/creative-work/fashion portfolio/skirt.jpg",
  "/creative-work/fashion portfolio/오버롤 페이지 1.jpg",
  "/creative-work/fashion portfolio/ㅇㅗㅂㅓㄹㅗㄹ ㅍㅔㅇㅣㅈㅣ 2.jpg",
];

const MUSEOLOGY_PHOTOS = [
  "/creative-work/museology/1.jpg",
  "/creative-work/museology/2.jpg",
  "/creative-work/museology/3.jpg",
  "/creative-work/museology/4.jpg",
  "/creative-work/museology/5.jpg",
  "/creative-work/museology/6.jpg",
  "/creative-work/museology/7.jpg",
  "/creative-work/museology/8.jpg",
  "/creative-work/museology/9.jpg",
  "/creative-work/museology/10.jpg",
  "/creative-work/museology/11.jpg",
  "/creative-work/museology/12.jpg",
];

/* ── Auto-scroll photo strip ─────────────────────────────────────────── */
function PhotoStrip({ photos, speed = 0.4 }: { photos: string[]; speed?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let x = 0;
    let raf: number;
    const step = () => {
      x -= speed;
      if (Math.abs(x) >= el.scrollWidth / 2) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed]);

  const items = [...photos, ...photos];
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-neutral-50 py-3">
      <div ref={trackRef} className="flex gap-2 will-change-transform" style={{ width: "max-content" }}>
        {items.map((src, i) => (
          <div key={i} className="relative h-[120px] w-[160px] flex-shrink-0 overflow-hidden rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── AI Lab demos ────────────────────────────────────────────────────── */
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

/* ── Main Component ──────────────────────────────────────────────────── */
export default function EsportsFeature() {
  const [activeTab, setActiveTab] = useState<"fashion" | "museology">("fashion");

  return (
    <SectionWrapper id="creative">
      {/* Header */}
      <div className="mb-12">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs uppercase tracking-widest text-text-muted"
        >
          Beyond UX
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-4xl font-extrabold tracking-tight text-text md:text-5xl"
        >
          Creative Work
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 max-w-lg text-sm leading-relaxed text-text-muted"
        >
          Before HCI, I studied fashion design and museology in Seoul. These roots still shape how I think about experience, narrative, and craft.
        </motion.p>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex gap-2"
      >
        {[
          { key: "fashion" as const, label: "Fashion Design" },
          { key: "museology" as const, label: "Museology" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-full px-5 py-2 font-mono text-xs font-medium tracking-wide transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-text text-white"
                : "bg-neutral-100 text-text-muted hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Photo Strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoStrip
              photos={activeTab === "fashion" ? FASHION_PHOTOS : MUSEOLOGY_PHOTOS}
              speed={activeTab === "fashion" ? 0.4 : 0.35}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* AI Lab Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-24"
      >
        <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
          AI & AR Experiments
        </span>
        <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-text md:text-4xl">
          AI Lab
        </h3>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-muted">
          Three experiments running entirely in your browser. No servers — just your camera, your drawings, and a neural network.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3"
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
