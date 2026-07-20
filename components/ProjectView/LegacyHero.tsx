// 케이스 스터디 오버레이 히어로 — 커버 이미지를 풀블리드로 깔고 그 위에
// 워드마크/타이틀/스코프/태그를 스크림과 함께 얹는다.
import Image from "next/image";
import { getProjectLogo, ProjectInfo } from "../../lib/ProjectInfo";

type Props = {
  projectInfo: ProjectInfo;
  coverImage: string;
};

export default function LegacyHero({ projectInfo, coverImage }: Props) {
  return (
    <div className="relative mx-4 mt-2 overflow-hidden rounded-[1.25rem] lg:mx-8">
      <div className="relative h-[62vh] min-h-[420px] w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverImage}
          alt={projectInfo.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* 텍스트 가독용 스크림 — 아래는 진하게, 위는 살짝 */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* 상단: 워드마크 */}
        <div className="absolute left-6 top-6 lg:left-9 lg:top-8">
          {/* @ts-ignore */}
          <Image
            src={getProjectLogo(projectInfo.slug, false)}
            className="h-8 w-auto lg:h-10"
            style={{ filter: "brightness(0) invert(1)" }}
            alt=""
            width={160}
            height={48}
            priority
          />
        </div>

        {/* 하단: 타이틀 + 메타 */}
        <div className="absolute inset-x-0 bottom-0 p-6 lg:p-10">
          <div className="max-w-3xl">
            <h1
              className="text-2xl font-semibold leading-tight text-white lg:text-[2.5rem] lg:leading-[1.1]"
              style={{ letterSpacing: "-0.02em" }}
            >
              {projectInfo.description}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/70 lg:mt-6">
              {projectInfo.scope && <span>{projectInfo.scope}</span>}
              {projectInfo.scope && projectInfo.tags?.length ? (
                <span className="opacity-40">·</span>
              ) : null}
              {projectInfo.tags?.map((tag, i) => (
                <span key={i}>
                  {tag}
                  {i < (projectInfo.tags?.length ?? 0) - 1 && (
                    <span className="ml-3 opacity-40">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
