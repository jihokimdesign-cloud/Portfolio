import type { CSSProperties, ReactNode } from "react";
import { useCopyEmail } from "../../lib/about";
import Timeline, { type TimelineItem } from "./Timeline";

const EMAIL = "jihokimdesign@gmail.com";
const PHOTO = "/about/profile.jpg";

/* ---------- content ---------- */

const Chip = ({ children, icon }: { children: ReactNode; icon?: string }) => (
  <span className={`jk-ichip jk-glass${icon ? "" : " t"}`}>
    {icon && <img src={icon} alt="" width={16} height={16} />}
    {children}
  </span>
);

const Trophy = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M5 2.5h6v3.5a3 3 0 0 1-6 0zM5 3.5H3a2 2 0 0 0 2 3M11 3.5h2a2 2 0 0 1-2 3M8 9v3M5.5 13.5h5" />
  </svg>
);

const FOCUS = [
  "Designing AI-native products",
  "Multimodal & adaptive UI",
  "Delivering 0-to-1 products",
  "Design systems",
  "Accessibility",
  "Prototyping in code",
];

const TIMELINE: TimelineItem[] = [
  { date: "2020", title: "Curatorial Intern", org: "Seoul Women's University Museum",
    desc: "Assisted a hanbok exhibition that now runs as an online VR exhibition." },
  { date: "2021 – 2023", title: "UX Designer", org: "Seoul Women's University",
    desc: "Designed data-dense LMS dashboards for students and faculty." },
  { date: "2023 – 2024", title: "MHCI+D", org: "University of Washington",
    desc: "Human-computer interaction and design. Capstone: TAP3D.",
    sub: [
      <><b>Makeability Lab</b> · CookAR, and Project Sidewalk as Lead Product Designer</>,
      <><span className="jk-award jk-glass"><Trophy />UIST 2024 Best Paper</span>Belonging &amp; Inclusion award for CookAR</>,
    ] },
  { date: "2024", title: "Lead Product Designer (Contract)", org: "TAP",
    desc: "Led design of a B2B VR training platform and its AI agent, validated with a Wizard-of-Oz study (n=24)." },
  { date: "2024", title: "Product Designer (Contract)", org: "LePal.ai",
    desc: "Designed an adaptive tone framework to break the 72-hour drop-off in an emotion-aware AI journal." },
  { date: "2024 – 2026", title: "Founding Designer", org: "Early-stage AI product",
    desc: "Built a 40–50 component multimodal design system with Figma and Claude Code, and took the product to a 500-person beta." },
  { date: "Now", title: "Open to new roles", desc: "Looking for a team building AI products for real people.", now: true },
];

/* ---------- component ---------- */

type Props = {
  /** sheet scroll container (for the timeline); omit on the full page */
  scrollEl?: HTMLElement | null;
};

export default function AboutContent({ scrollEl }: Props) {
  const { copied, copy } = useCopyEmail(EMAIL);
  const rv = (i: number) => ({ "--i": i } as CSSProperties);

  return (
    <article className="jk-about">
      <img className="jk-photo jk-rv" style={rv(0)} src={PHOTO} alt="Jiho Kim" width={88} height={88} />

      <h2 className="jk-headline jk-rv" id="jk-about-title" style={rv(1)}>
        Jiho is a product designer who builds AI products that adapt to people.
      </h2>

      <div className="jk-mail jk-rv" style={rv(2)}>
        <button type="button" className={`jk-copy jk-glass${copied ? " done" : ""}`} onClick={copy} aria-live="polite">
          {copied ? (
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <rect x="5" y="5" width="8.5" height="8.5" rx="2" />
              <path d="M10.5 5V3.5A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5H5" />
            </svg>
          )}
          <span>{copied ? "Copied" : "Copy email"}</span>
        </button>
        <span className="jk-addr">{EMAIL}</span>
      </div>

      <div className="jk-prose">
        <p className="jk-rv" style={rv(3)}>
          Jiho is a product designer with five years of experience designing AI-native and multimodal products,
          from early concepts to shipped systems. The work centers on AI that notices context and adapts, so people
          never have to adjust to the product. A graduate of the <b>University of Washington MHCI+D</b> program, Jiho
          pairs research rigor with hands-on prototyping in code.
        </p>
        <p className="jk-rv" style={rv(4)}>
          Most recently, Jiho was the founding designer of an early-stage AI product for hands-free cooking, building a
          multimodal design system in <Chip icon="/icon/figma.png">Figma</Chip> and{" "}
          <Chip icon="/icon/claude.png">Claude Code</Chip> and taking it to a 500-person beta. Before that, Jiho led
          design for <Chip>TAP</Chip>, a VR training platform with an AI agent, and <Chip>LePal.ai</Chip>, an
          emotion-aware AI journal.
        </p>
        <p className="jk-rv" style={rv(5)}>
          At the Makeability Lab, Jiho co-created <Chip>CookAR</Chip>, wearable AR for low-vision cooks that won a{" "}
          <b>UIST 2024 Best Paper</b> award, and led the design system for <Chip>Project Sidewalk</Chip>, used by
          11,000+ volunteers. The path started in fashion design and museum curation, which still shapes how Jiho thinks
          about craft and about how people feel.
        </p>
      </div>

      <p className="jk-label jk-rv" style={rv(6)}>Focus</p>
      <div className="jk-skills jk-rv" style={rv(7)}>
        {FOCUS.map((f) => (
          <span key={f} className="jk-glass">{f}</span>
        ))}
      </div>

      <p className="jk-label jk-rv" style={rv(8)}>Experience</p>
      <div className="jk-rv" style={rv(9)}>
        <Timeline items={TIMELINE} scrollEl={scrollEl} />
      </div>
    </article>
  );
}
