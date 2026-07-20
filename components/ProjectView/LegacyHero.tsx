// 케이스 스터디 히어로 — 옛 포트폴리오처럼 커버 이미지를 위에 두고
// 타이틀/스코프/태그를 이미지 바로 아래에 얹는다(오버레이 아님).
import Image from "next/image";
import { getProjectLogo, ProjectInfo } from "../../lib/ProjectInfo";

type Props = {
  projectInfo: ProjectInfo;
  coverImage: string;
};

export default function LegacyHero({ projectInfo, coverImage }: Props) {
  return (
    <div className="mx-4 mt-2 lg:mx-8">
      {/* 커버 이미지 */}
      <div className="relative overflow-hidden rounded-[1.25rem]">
        {/* 워드마크 (좌상단, 흰색) */}
        <div className="absolute left-6 top-6 z-10 lg:left-8 lg:top-7">
          {/* @ts-ignore */}
          <Image
            src={getProjectLogo(projectInfo.slug, false)}
            className="h-7 w-auto lg:h-9"
            style={{ filter: "brightness(0) invert(1)" }}
            alt=""
            width={160}
            height={44}
            priority
          />
        </div>
        <div className="relative h-[54vh] min-h-[360px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={projectInfo.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* 타이틀 + 메타 — 이미지 바로 아래, 중앙 정렬 */}
      <div className="mx-auto max-w-3xl px-4 pb-6 pt-12 text-center lg:pt-16">
        <h1
          className="text-[1.6rem] font-semibold leading-tight lg:text-[2.4rem] lg:leading-[1.1]"
          style={{ letterSpacing: "-0.02em", color: "var(--fg)" }}
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
