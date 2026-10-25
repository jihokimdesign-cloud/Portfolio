export interface ProjectInfo {
  title: string;
  description: string;
  tags?: string[];
  slug: string;
  scope: string;
  previewVideo: string;
  thumbAutoplay?: boolean; // 호버 없이도 썸네일 영상 계속 재생
  thumbHtml?: string; // 애니메이션 HTML 썸네일 (iframe으로 프리뷰)
  thumbImage?: string; // 정적/애니 이미지 썸네일 (object-cover로 채움)
  heroHtml?: string; // 히어로를 이미지 대신 HTML로 (iframe)
  heroAspect?: string; // heroHtml의 종횡비 (예: "1600 / 620")
  hook?: string; // 카드 1행 타이틀 — 회사명이 아니라 '무엇을 했는지'
  cardTitle?: string; // 랜딩 카드 문장형 타이틀 (hook보다 우선)
  cardMeta?: string; // 랜딩 카드 보조 라벨 ("Name · tag · tag")
  award?: string; // 수상 칩 (예: "UIST 2024 Best Paper")
  hidden: boolean;
}

export function getProjectInfo(meta: any): ProjectInfo {
  return {
    slug: meta.slug,
    title: meta.title,
    tags: meta.tags && meta.tags.split(",").map((tag: string) => tag.trim()),
    scope: meta.scope,
    description: meta.description,
    previewVideo: meta.previewVideo,
    thumbAutoplay: meta.thumbAutoplay ?? false,
    thumbHtml: meta.thumbHtml ?? null,
    thumbImage: meta.thumbImage ?? null,
    heroHtml: meta.heroHtml ?? null,
    heroAspect: meta.heroAspect ?? null,
    hook: meta.hook ?? null,
    cardTitle: meta.cardTitle ?? null,
    cardMeta: meta.cardMeta ?? null,
    award: meta.award ?? null,
    hidden: meta.hidden,
  };
}

export interface ProjectStyle {
  light: string;
  accent: string;
  dark: string;
  darkest: string;
  isDarkColorScheme: boolean;
  getTextColor: () => string;
  getBgColor: () => string;
}

export function getProjectStyle(meta: any): ProjectStyle {
  const isDarkColorScheme = meta.colorScheme === "dark";
  return {
    accent: meta.colorAccent,
    light: meta.colorLight,
    dark: meta.colorDark,
    darkest: meta.colorDarkest,
    isDarkColorScheme: isDarkColorScheme,
    getTextColor: () =>
      isDarkColorScheme ? meta.colorLight : meta.colorDarkest,
    getBgColor: () => (isDarkColorScheme ? meta.colorDarkest : meta.colorLight),
  };
}

export function getProjectCover(slug: string) {
  return `/project-assets/${slug}/${slug}-cover.jpg`;
}

export function getProjectLogo(slug: string, small?: boolean) {
  if (small) return `/project-assets/${slug}/${slug}-logo-sm.png`;
  return `/project-assets/${slug}/${slug}-logo.png`;
}

export function getProjectLink(slug: string) {
  return `/projects/${slug}`;
}
