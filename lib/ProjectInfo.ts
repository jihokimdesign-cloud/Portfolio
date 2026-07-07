export interface ProjectInfo {
  title: string;
  description: string;
  tags?: string[];
  slug: string;
  scope: string;
  previewVideo: string;
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
