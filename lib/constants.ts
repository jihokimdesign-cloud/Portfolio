export const SITE = {
  name: "Jiho Kim",
  title: "Product Designer",
  email: "jihokimdesign@gmail.com",
  linkedin: "https://www.linkedin.com/in/hoyak/",
  resumeUrl: "https://drive.google.com/file/d/1lqlo2l6fnMgX0HX8WQLtgb4yDVCJF4Tr/view?usp=sharing",
} as const;

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
