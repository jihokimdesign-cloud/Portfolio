"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Caveat } from "next/font/google";
import SectionWrapper from "./SectionWrapper";

const caveat = Caveat({ subsets: ["latin"], weight: ["400", "700"] });

/* ─── Highlight marker ──────────────────────────────────────────────────── */
type HiColor = "yellow" | "green" | "blue" | "pink" | "purple";
function Hi({ children, color = "yellow" }: { children: React.ReactNode; color?: HiColor }) {
  const palette: Record<HiColor, string> = {
    yellow: "bg-yellow-200/90 text-yellow-900",
    green:  "bg-green-200/90  text-green-900",
    blue:   "bg-sky-200/90    text-sky-900",
    pink:   "bg-pink-200/90   text-pink-900",
    purple: "bg-purple-200/90 text-purple-900",
  };
  return (
    <mark className={`${palette[color]} px-1 rounded-[3px] not-italic`}>
      {children}
    </mark>
  );
}

/* ─── Cursive accent ────────────────────────────────────────────────────── */
function Cur({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${caveat.className} text-primary text-[1.18em] italic font-bold`}>
      {children}
    </span>
  );
}

/* ─── Project link with GIF tooltip ────────────────────────────────────── */
function PLink({ href, label, gif }: { href: string; label: string; gif: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <Link
        href={href}
        className="text-primary font-medium underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-all"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {label}
      </Link>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-64 rounded-xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={gif} alt={`${label} preview`} className="w-full h-auto block" />
        </motion.div>
      )}
    </span>
  );
}

/* ─── Polaroid — square ─────────────────────────────────────────────────── */
function Polaroid({
  src,
  caption,
  rotate = 0,
  delay = 0,
}: {
  src: string;
  caption: string;
  rotate?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, rotate: 0, zIndex: 20 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate: `${rotate}deg` }}
      className="relative bg-white p-[10px] pb-9 shadow-md cursor-pointer"
    >
      <div className="w-full aspect-square overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} className="w-full h-full object-cover" />
      </div>
      <p className={`${caveat.className} absolute bottom-1.5 left-0 right-0 text-center text-[13px] text-neutral-500 px-1`}>
        {caption}
      </p>
    </motion.div>
  );
}

/* ─── Polaroid — landscape ──────────────────────────────────────────────── */
function PolaroidLandscape({
  src,
  caption,
  rotate = 0,
  delay = 0,
  aspectClass = "aspect-video",
}: {
  src: string;
  caption: string;
  rotate?: number;
  delay?: number;
  aspectClass?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, rotate: 0, zIndex: 20 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotate: `${rotate}deg` }}
      className="relative bg-white p-[10px] pb-9 shadow-md cursor-pointer"
    >
      <div className={`w-full ${aspectClass} overflow-hidden bg-neutral-100`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption} className="w-full h-full object-cover" />
      </div>
      <p className={`${caveat.className} absolute bottom-1.5 left-0 right-0 text-center text-[13px] text-neutral-500 px-1`}>
        {caption}
      </p>
    </motion.div>
  );
}

/* ─── Data ──────────────────────────────────────────────────────────────── */

// Remaining photos not in the float column — shown in the loop strip
const LOOP_PHOTOS = [
  { src: "/About m/At MHCI+D studio!.JPG",                    caption: "at MHCI+D studio! 🎓",        rotate:  2  },
  { src: "/About m/Dreaming in NYC.JPG",                       caption: "dreaming in NYC 🗽",           rotate: -1, pos: "center 70%"  },
  { src: "/About m/I LOVE KOREAN FOOD.JPG",                    caption: "I love Korean food 🍜",        rotate: -3  },
  { src: "/About m/me in Paris.JPG",                           caption: "me in Paris 🇫🇷",              rotate:  1  },
  { src: "/About m/me doing prototon.JPG",                     caption: "prototyping 🛠️",              rotate: -2  },
  { src: "/About m/solving puzzle at Amazon.JPG",              caption: "solving puzzles at Amazon 🧩", rotate:  2  },
  { src: "/About m/I love hiking hehe.JPG",                    caption: "I love hiking 🥾",             rotate: -1  },
  { src: "/About m/with the pattern i designed!.JPG",          caption: "with the pattern I designed! 🎨", rotate:  3, pos: "center 70%"  },
];

const EXPERIENCES = [
  { company: "Stealth AI Startup",              role: "Product Designer & Founder",             period: "Nov 2024 – Present", href: null                   },
  { company: "Lepal.ai",                        role: "Product Designer",                       period: "Sep – Nov 2024",     href: "/myjournal-case-study.html" },
  { company: "TAP3D (XR Training)",             role: "Product Designer",                       period: "Mar – Aug 2024",     href: "/tap3d-case-study.html"    },
  { company: "Project Sidewalk",                role: "Product Designer",                       period: "Sep 2023 – Aug 2024", href: "/sidewalk-case-study.html" },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function About() {
  return (
    <SectionWrapper id="about" alternate>

      {/* Tag */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-mono text-xs font-medium uppercase tracking-widest text-primary"
      >
        About Me
      </motion.span>

      {/* Hero heading */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08 }}
        className="mt-4"
      >
        <h2 className="font-heading text-4xl font-bold leading-tight text-text md:text-[3.25rem]">
          Hi, I&apos;m Jiho.
        </h2>
        <p className="mt-2 font-mono text-sm tracking-wide text-text-secondary">
          Product Designer &nbsp;·&nbsp; Seeking Full-time roles
        </p>
      </motion.div>

      {/* Story + polaroids — float layout so text stretches full-width below photos */}
      <div className="mt-12">

        {/* Polaroid column — floated right, text wraps around it */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="float-right ml-10 mb-6 flex w-[300px] flex-col gap-5 md:w-[340px]"
        >
          {/* 1 — landscape workshop */}
          <PolaroidLandscape
            src="/About m/Workshop with friends!.JPG"
            caption="workshop with friends! 🤝"
            rotate={-1.5}
            delay={0.1}
            aspectClass="aspect-video"
          />
          {/* 2 — big landscape */}
          <PolaroidLandscape
            src="/About m/Summer in Seattle.JPG"
            caption="summer in Seattle ☀️"
            rotate={2}
            delay={0.18}
            aspectClass="aspect-[3/2]"
          />
          {/* 3 — two square polaroids */}
          <div className="grid grid-cols-2 gap-4">
            <Polaroid
              src="/About m/I love COFFEE.JPG"
              caption="my design partner ☕"
              rotate={-2.5}
              delay={0.26}
            />
            <Polaroid
              src="/About m/me doing user interview.JPG"
              caption="user research mode 🎤"
              rotate={2}
              delay={0.32}
            />
          </div>
        </motion.div>

        {/* Story — stretches to full width once polaroid column ends */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="space-y-5 text-[15.5px] leading-[1.82] text-text-secondary"
        >
          <p>
            I studied <Hi color="blue">fashion design and museology</Hi> in Seoul — two fields that are really about the same thing: how people experience objects, spaces, and stories. That instinct led me to the <Hi color="blue">University of Washington</Hi> for a Master&apos;s in HCI+Design, where I found my focus:{" "}
            <Hi color="yellow">making complex AI feel effortless.</Hi>
          </p>
          <p>
            My first major project was <Hi color="green">Project Sidewalk</Hi>, where a single design inconsistency could mean someone in a wheelchair can&apos;t navigate their own neighborhood. I built a zero-defect design system and helped map <Hi color="yellow">12,000+ accessibility labels</Hi>.{" "}
            <Cur>That&apos;s where I learned what &quot;no room for error&quot; really means.</Cur>
          </p>
          <p>
            From there, I designed <Hi color="pink">AR onboarding for factory floors</Hi> at TAP3D, then built <Hi color="purple">emotional AI features</Hi> at Lepal.ai that hit <Hi color="green">85% retention</Hi>. Now I&apos;m founding a <Hi color="yellow">stealth AI startup</Hi>, designing multimodal interfaces with voice and gesture controls.
          </p>
          <p>
            Outside of products, I build AI experiments in the browser and do AR research. My CookAR work won a <Hi color="blue">UIST 2024 Best Paper Award</Hi> from ACM. <Cur>I believe the best way to understand a technology is to build with it.</Cur>
          </p>
        </motion.div>

        {/* Clear float so experiences section sits below everything */}
        <div className="clear-both" />
      </div>

      {/* Experiences */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mt-20"
      >
        <p className="mb-6 font-mono text-xs font-medium uppercase tracking-widest text-primary">
          Experience
        </p>
        <div className="divide-y divide-border/30">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i }}
              className="group flex items-center justify-between py-4"
            >
              <div>
                <p className="text-[15px] font-medium text-text transition-colors group-hover:text-primary">
                  {exp.href ? (
                    <Link href={exp.href}>{exp.company}</Link>
                  ) : (
                    exp.company
                  )}
                </p>
                <p className="mt-0.5 text-sm text-text-secondary">{exp.role}</p>
              </div>
              <span className="ml-6 whitespace-nowrap font-mono text-xs text-text-secondary/50">
                {exp.period}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Infinite photo loop ───────────────────────────────────────────── */}
      <div
        className="mt-16 -mx-8 overflow-hidden py-8 md:-mx-16 lg:-mx-24"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, ease: "linear", repeat: Infinity, repeatType: "loop" }}
          className="flex gap-4"
          style={{ width: "max-content" }}
        >
          {/* Duplicate array for seamless loop */}
          {[...LOOP_PHOTOS, ...LOOP_PHOTOS].map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.06, rotate: 0, zIndex: 20 }}
              transition={{ duration: 0.25 }}
              style={{ rotate: `${p.rotate}deg`, minWidth: 360 }}
              className="relative bg-white p-[10px] pb-10 shadow-md cursor-pointer flex-shrink-0"
            >
              <div className="w-[340px] aspect-[3/2] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.caption} className="w-full h-full object-cover" style={p.pos ? { objectPosition: p.pos } : undefined} />
              </div>
              <p className={`${caveat.className} absolute bottom-1 left-0 right-0 text-center text-[12px] text-neutral-500 px-1`}>
                {p.caption}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </SectionWrapper>
  );
}
