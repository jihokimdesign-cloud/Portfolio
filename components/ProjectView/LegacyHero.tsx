// 케이스 스터디 히어로 — 커버 이미지를 위에 두고, 그 아래 브랜드 로고 +
// 타이틀/스코프/태그를 중앙에 얹는다(오버레이 아님, 옛 포트폴리오 스타일).
import { ProjectInfo } from "../../lib/ProjectInfo";

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
  return (
    <div className="mx-4 mt-2 lg:mx-8">
      {/* 커버 이미지 — 넉넉한 높이 */}
      <div className="relative overflow-hidden rounded-[1.25rem]">
        <div className="relative h-[72vh] min-h-[460px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={projectInfo.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* 브랜드 로고 + 타이틀 + 메타 — 이미지 바로 아래, 중앙 정렬 */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-12 text-center lg:pt-16">
        {logo && (
          <div className="mb-8 flex justify-center">
            {/* 브랜드 로고(원색 유지)를 흰 칩 위에 — 라이트/다크 둘 다 가독 */}
            <span
              className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt={projectInfo.title}
                className="h-7 w-auto object-contain lg:h-9"
              />
            </span>
          </div>
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
        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm"
          style={{ color: "var(--fg-secondary)" }}
        >
          {projectInfo.scope && <span>{projectInfo.scope}</span>}
          {projectInfo.scope && projectInfo.tags?.length ? (
            <span className="opacity-40">·</span>
          ) : null}
          {projectInfo.tags?.map((tag, i) => (
            <span key={i} className="flex items-center gap-3">
              {tag}
              {i < (projectInfo.tags?.length ?? 0) - 1 && (
                <span className="opacity-40">·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
