import type { Project, TimelineItem, SkillCategory } from "@/types";

export const SITE = {
  name: "Jiho Kim",
  title: "Product Designer",
  tagline:
    "The designer who turns technical ambiguity and complex AI into 'wow, that was easy'. I design AI agent experiences that feel human.",
  email: "jihokimdesign@gmail.com",
  phone: "",
  linkedin: "https://www.linkedin.com/in/hoyak/",
  github: "https://github.com/jihokimdesign-cloud",
  medium: "",
  portfolio: "#",
  location: "Open to Relocation",
  resumeUrl: "https://drive.google.com/file/d/1339iKvokajvEe63I9VeepkqOrsxVILGW/view?usp=sharing",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#journey" },
  { label: "Contact", href: "#contact" },
] as const;

export const ROTATING_WORDS = [
  "AI agent experiences",
  "complex enterprise SaaS",
  "multimodal interactions",
  "AR/VR prototypes",
  "design systems",
];

export const TICKER_ITEMS = [
  { name: "Stealth AI Startup", logo: "/landingimgs/startup_exp.png" },
  { name: "Lepal.ai", logo: "/landingimgs/lepal_exp.png" },
  { name: "TAP3D", logo: "/landingimgs/tap_exp.png" },
  { name: "Project Sidewalk", logo: "/landingimgs/sidewalk_exp.png" },
  { name: "University of Washington", logo: "/landingimgs/image2020.png" },
];

export const METRICS = [
  { value: 85, suffix: "%", label: "Retention Rate" },
  { value: 40, suffix: "%", label: "Faster Adoption" },
  { value: 50, suffix: "%", label: "Handoff Cycles Cut" },
  { value: 12, suffix: "k+", label: "Labels Mapped" },
] as const;

export const PROJECTS: Project[] = [
  {
    title: "TAP",
    subtitle: "AI Design · Enterprise SaaS · Product Design",
    impact: "9-month onboarding cliff reduced · 40% faster adoption",
    description:
      "From passive lists to proactive agents — reducing the 9-month onboarding cliff. Designed an AR-based onboarding experience for industrial engineers, reducing average training time by 30%.",
    techStack: ["AI Design", "Enterprise SaaS", "Product Design", "Unity", "ShapesXR"],
    image: "/landingimgs/tap_landing.png",
    link: "/tap3d-case-study.html",
    featured: true,
    cursorLabel: "View case study →",
  },
  {
    title: "Lepal",
    subtitle: "AI Design · Emotional Design · Gen Z",
    impact: "85% retention rate · 2.4x engagement lift",
    description:
      "Designing emotional continuity — beyond chatbot transcripts into genuine journaling. Designed native iOS/Android features for an AI wellness app, increasing user satisfaction by 60%.",
    techStack: ["AI Design", "Emotional Design", "iOS/Android", "A/B Testing", "Gen Z"],
    image: "/landingimgs/lepal_landing.png",
    link: "/myjournal-case-study.html",
    featured: true,
    cursorLabel: "View case study →",
  },
  {
    title: "Cheffy",
    subtitle: "Interaction Design · Gesture · Pre-Launch",
    impact: "72% of users pausing addressed · 3x faster tasks",
    description:
      "Rethinking hands-free cooking when 72% of users pause to wash their hands. Designed a multimodal video player with voice and gesture controls for hands-free navigation.",
    techStack: ["Interaction Design", "Gesture", "Sensor Integration", "Prototyping"],
    image: "/landingimgs/cheffy_landing.png",
    link: "/proxiplay-case-study.html",
    featured: false,
    cursorLabel: "View case study →",
  },
  {
    title: "Project Sidewalk",
    subtitle: "Design System · Accessibility · Civic Tech",
    impact: "0 defects shipped · 12,000+ labels mapped",
    description:
      "A zero-defect design system for civic accessibility mapping at scale. Redesigned the map-based navigation for 11,000+ users with WCAG 2.2 AA compliance.",
    techStack: ["Design Systems", "Accessibility", "Civic Tech", "WCAG 2.2", "Figma"],
    image: "/landingimgs/sidewalk_landing.png",
    link: "/sidewalk-case-study.html",
    featured: false,
    cursorLabel: "View case study →",
  },
];

export const TIMELINE: TimelineItem[] = [
  {
    role: "Product Designer & Founder",
    organization: "Stealth AI Startup",
    period: "Nov 2024 — Present",
    points: [
      "Designed multimodal video player with voice and gesture controls",
      "Embedded context-aware AI assistant within the playback flow",
      "Cut engineering handoff cycles by 50% through Cursor AI prototyping",
    ],
    color: "#6366F1",
  },
  {
    role: "Product Designer",
    organization: "Lepal.ai",
    period: "Sep — Nov 2024",
    points: [
      "Designed native iOS/Android features increasing user satisfaction by 60%",
      "Optimized subscription funnels and premium upgrade flows",
      "A/B tested generative chat flows, achieving 15% lift in Day-7 retention",
    ],
    color: "#FF5210",
  },
  {
    role: "Product Designer",
    organization: "TAP3D (XR Training)",
    period: "Mar — Aug 2024",
    points: [
      "Delivered AR-based onboarding reducing training time by 30%",
      "Led interaction design and prototyping using Unity and ShapesXR",
      "User testing with 8+ field engineers on spatial interactions",
    ],
    color: "#22C55E",
  },
  {
    role: "Product Designer",
    organization: "Project Sidewalk",
    period: "Sep 2023 — Aug 2024",
    points: [
      "Redesigned map-based navigation for 11,000+ users",
      "Architected WCAG 2.2 AA design system across 3 teams",
      "Eliminated accessibility debt in production design system",
    ],
    color: "#8E60F0",
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Design",
    icon: "pen-tool",
    skills: [
      "AI/Agent UX",
      "Interaction Design",
      "Visual Design",
      "Prototyping",
      "Information Architecture",
      "Design Systems",
      "Accessibility (WCAG 2.2)",
    ],
  },
  {
    title: "Research",
    icon: "search",
    skills: [
      "User Testing",
      "A/B Testing",
      "Journey Mapping",
      "Contextual Inquiry",
      "Competitive Analysis",
      "Heuristic Evaluation",
      "Data-Driven Design",
    ],
  },
  {
    title: "Tools",
    icon: "layout",
    skills: [
      "Figma",
      "Unity",
      "ShapesXR",
      "Cursor AI",
      "Claude Code",
      "GSAP",
      "Tailwind CSS",
    ],
  },
  {
    title: "Technical",
    icon: "code",
    skills: [
      "HTML / CSS",
      "JavaScript",
      "React / Next.js",
      "Node.js",
      "AR/VR Prototyping",
      "MediaPipe",
      "GSAP Animations",
    ],
  },
];

export const CHAT_PLACEHOLDERS = [
  "Ask about my AI design process...",
  "How do you approach agent UX?",
  "Tell me about the Lepal project...",
  "What's your design philosophy?",
];

export const RECRUITER_PLACEHOLDER =
  "Paste a job description to see if I'm a match...";

export const QUICK_ACTIONS_GENERAL = [
  { label: "My Projects", prompt: "Tell me about your most impactful design projects" },
  { label: "Design Process", prompt: "Walk me through your AI agent design process" },
  { label: "Skills", prompt: "What are your strongest design and technical skills?" },
  { label: "Experience", prompt: "Tell me about your work experience" },
];

export const QUICK_ACTIONS_RECRUITER = [
  { label: "Match Analysis", prompt: "Analyze my fit for this role" },
  { label: "Key Strengths", prompt: "What are my unique strengths for this role?" },
  { label: "Impact Metrics", prompt: "What measurable impact have I made?" },
  { label: "Relevant Work", prompt: "Which projects are most relevant for this role?" },
];

export const SKILL_PILLS = [
  "AI/Agent UX",
  "Product Design",
  "Interaction Design",
  "Design Systems",
  "AR/VR",
  "Prototyping",
];

export const ABOUT_TEXT = [
  "I'm a Product Designer who turns technical ambiguity and complex AI into experiences that feel effortless. I specialize in AI agent experiences, multimodal interactions, and enterprise SaaS.",
  "With a Master's in Human-Computer Interaction + Design from the University of Washington, I've designed products that achieved 85% retention rates, 40% faster adoption, and cut engineering handoff cycles by 50%.",
  "I bridge design, engineering, and AI — prototyping with Cursor AI, building with code, and always grounding decisions in user research and real-world testing.",
];

export const ABOUT_HIGHLIGHTS = [
  { label: "AI/Agent UX", icon: "pen-tool" },
  { label: "Interaction Design", icon: "search" },
  { label: "Design Systems", icon: "layout" },
  { label: "Accessibility", icon: "accessibility" },
  { label: "Prototyping", icon: "figma" },
  { label: "AR/VR Design", icon: "sitemap" },
];
