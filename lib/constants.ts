export const SITE = {
  name: "Jiho Kim",
  title: "Product Designer",
  email: "jihokimdesign@gmail.com",
  // Gmail 컴포즈 — mailto가 데스크톱 기본 메일앱 없으면 안 열려서 이걸로 대체
  emailHref:
    "https://mail.google.com/mail/?view=cm&fs=1&to=jihokimdesign@gmail.com",
  linkedin: "https://www.linkedin.com/in/hoyak/",
  resumeUrl: "https://drive.google.com/file/d/1TOmwN3m3AOycdyIipj36yg4oe_6Mu0dh/view?usp=sharing",
} as const;

// Selected Work 순서 — 지원 타깃별로 이 배열만 바꾸면 된다 (마크업 수정 불필요).
// 여기 없는 슬러그는 weight 순으로 뒤에 붙는다.
export const PROJECT_ORDER = [
  "tap3d",
  "lepal",
  "sidewalk",
  "cheffy",
  "cookar",
] as const;

export const QUICK_ACTIONS_GENERAL = [
  { label: "My Projects", prompt: "Tell me about your most impactful design projects" },
  { label: "Design Process", prompt: "Walk me through your AI agent design process" },
  { label: "Skills", prompt: "What are your strongest design and technical skills?" },
  { label: "Experience", prompt: "Tell me about your work experience" },
];
