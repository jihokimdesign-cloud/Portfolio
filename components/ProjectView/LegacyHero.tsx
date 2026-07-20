// 케이스 스터디 히어로 — 커버 이미지를 위에 두고, 그 아래 브랜드 로고 +
// 타이틀/스코프/태그를 중앙에 얹는다(오버레이 아님, 옛 포트폴리오 스타일).
import { ProjectInfo } from "../../lib/ProjectInfo";
import { useSiteTheme } from "../../hooks/useSiteTheme";

// 브랜드 로고(있는 케이스만) — /public/logos
const BRAND_LOGO: Record<string, string> = {
  tap3d: "/logos/taplogo.png",
  lepal: "/logos/lepallogo.png",
  sidewalk: "/logos/sidewalklogo.png",
};

type Props = {
  projectInfo: ProjectInfo;
  coverImage: string;
};

export default function LegacyHero({ projectInfo, coverImage }: Props) {
  const logo = BRAND_LOGO[projectInfo.slug];
  const theme = useSiteTheme();
  const heroSrc = projectInfo.heroHtml?.replace("{theme}", theme);
  return (
    <div className="mx-4 mt-2 lg:mx-8">
      {/* 히어로 — HTML(heroHtml) 또는 커버 이미지. 넉넉한 높이 */}
      <div className="relative overflow-hidden rounded-[1.25rem]">
        <div className="relative h-[86vh] min-h-[540px] w-full">
          {heroSrc ? (
            <iframe
              key={heroSrc}
              src={heroSrc}
              title={projectInfo.title}
              scrolling="no"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={projectInfo.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {/* 브랜드 로고 + 타이틀 + 메타 — 이미지 바로 아래, 중앙 정렬 */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-12 text-center lg:pt-16">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt={projectInfo.title}
            className="mx-auto mb-6 h-5 w-auto object-contain lg:h-6"
            // 배경/그림자 없이 — 다크 테마에선 흰색으로(가독)
            style={{ filter: "var(--logo-filter, none)" }}
          />
        )}
        <h1
          className="text-[1.6rem] leading-tight lg:text-[2.4rem] lg:leading-[1.1]"
          style={{
            fontFamily: '"TikTok Sans", Inter, sans-serif',
            fontWeight: 400,
            letterSpacing: "-0.025em",
            color: "var(--title)",
          }}
        >
          {projectInfo.description}
        </h1>
      </div>
    </div>
  );
}
