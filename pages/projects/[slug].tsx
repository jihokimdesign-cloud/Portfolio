import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
import LegacyEmbed from "../../components/ProjectView/LegacyEmbed";
import CaseStudyNav from "../../components/ProjectView/CaseStudyNav";
import CaseStudyTOC from "../../components/ProjectView/CaseStudyTOC";
import LegacyHero from "../../components/ProjectView/LegacyHero";
import { serialize } from "next-mdx-remote/serialize";
import { GetStaticProps, InferGetStaticPropsType, GetStaticPaths } from "next";
import { getAllPostSlugs, getPostBySlug } from "../../lib/projects";
import TestingComponent from "../../components/TestingComponent";
import ProjectView from "../../components/ProjectView/ProjectView";
import { motion } from "framer-motion";
import FullImage from "../../components/ProjectView/FullImage";
import Team from "../../components/ProjectView/Team";
import Image from "../../components/ProjectView/Image";
import { createParagraphProcessor } from "../../components/ProjectView/ParagraphProcessor";
import ProjectHeader from "../../components/Layouts/ProjectHeader";
import { NextSeo } from "next-seo";

import {
  getProjectCover,
  getProjectInfo,
  getProjectLogo,
  getProjectStyle,
} from "../../lib/ProjectInfo";
import {
  ColorShifter,
  ColorShifterContextProvider,
} from "../../components/ProjectView/ColorShifter";
import {
  LayoutMainContent,
  LayoutFull,
  Spacer,
} from "../../components/ProjectView/Layout";
import { Caption } from "../../components/ProjectView/Caption";
import Video, {
  VideoHoverContextProvider,
} from "../../components/ProjectView/Video";
import { List, ListItem } from "../../components/ProjectView/List";
import SlideShow from "../../components/ProjectView/SlideShow";
import StatGrid from "../../components/ProjectView/StatGrid";
import BeforeAfter from "../../components/ProjectView/BeforeAfter";
import Bars from "../../components/ProjectView/Bars";
import TradeOff from "../../components/ProjectView/TradeOff";
import SectionTitle from "../../components/ProjectView/SectionTitle";
import Flow from "../../components/ProjectView/Flow";
import ElbowDemo from "../../components/ProjectView/ElbowDemo";
import Insight from "../../components/ProjectView/Insight";
import Transcript from "../../components/ProjectView/Transcript";
import Placeholder from "../../components/ProjectView/Placeholder";
import Barriers from "../../components/ProjectView/Barriers";
import MethodNote from "../../components/ProjectView/MethodNote";
import ToneDemo from "../../components/ProjectView/ToneDemo";
import SystemDemo from "../../components/ProjectView/SystemDemo";
import {
  Header2,
  Header3,
  Paragraph,
  ParagraphBig,
  Link,
  paragraphProcessor,
  Quote,
  Emphasis,
} from "../../components/ProjectView/Typography";
import { EditableContextProvider } from "../../components/Editor/EditableContext";

export const getStaticPaths: GetStaticPaths = async ({}) => {
  // Return a list of possible value for id
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // MDX text - can be from a local file, database, anywhere
  if (!params) throw "params is empty";

  const source = getPostBySlug(params.slug as string);
  const nextProjectSource = getPostBySlug(source.meta.nextProject as string);
  const mdxSource = await serialize(source.content);

  const paths = getAllPostSlugs();
  const slugTitleMap = paths.map((path) => {
    const post = getPostBySlug(path.params.slug);
    return {
      title: post.meta.title,
      slug: path.params.slug,
    };
  });

  return {
    props: {
      source: mdxSource,
      meta: source.meta,
      nextProjectMeta: nextProjectSource.meta,
      slugTitleMap: slugTitleMap,
    },
  };
};

// THE TEMPATE
type PostProps = InferGetStaticPropsType<typeof getStaticProps>;
export default function Post({
  source,
  meta,
  nextProjectMeta,
  slugTitleMap,
}: PostProps) {
  const projectStyle = getProjectStyle(meta);
  const projectInfo = getProjectInfo(meta);
  const projectLogoSource = getProjectLogo(projectInfo.slug);

  const nextProjectStyle = getProjectStyle(nextProjectMeta);
  const nextProjectInfo = getProjectInfo(nextProjectMeta);

  // legacyHtml 스터디: 셸 크롬(히어로 밴드/푸터)이 고정 다크색이라 라이트
  // 테마에서 흰 본문 위아래로 어두운 띠가 생김 → 크롬을 테마 토큰으로 중립화
  const themeChrome = (s: typeof projectStyle) =>
    meta.legacyHtml
      ? { ...s, getBgColor: () => "transparent", getTextColor: () => "var(--fg)" }
      : s;
  const shellStyle = themeChrome(projectStyle);
  const shellNextStyle = themeChrome(nextProjectStyle);

  return (
    <>
      <NextSeo
        title={`${projectInfo.title} — Jiho Kim`}
        description={`${projectInfo.description}`}
      />
      {/* 라이브 사이트 타입 (fontTheme: live) — DM Sans 본문 + Plus Jakarta 헤딩 */}
      {meta.fontTheme === "live" && (
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
      )}
      {/* 사이트 공통 타이틀 폰트 + 케이스 스터디 배경을 본문과 통일
          (기본 캔버스 #f5f5f7 회색이 히어로 주변에 보였음 → 본문색과 맞춤) */}
      {meta.legacyHtml && (
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=TikTok+Sans:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <style>{`
            html[data-theme="light"] body { background-color: #ffffff !important; }
            html[data-theme="dark"] body { background-color: #0e0e10 !important; }
          `}</style>
        </Head>
      )}
      <VideoHoverContextProvider>
        <ColorShifterContextProvider
          initialColor={shellStyle.getTextColor()}
          initalBackground={shellStyle.getBgColor()}
        >
          <EditableContextProvider>
            <ProjectView
              projectInfo={projectInfo}
              projectStyle={shellStyle}
              nextProjectInfo={nextProjectInfo}
              nextProjectStyle={shellNextStyle}
              coverImage={getProjectCover(projectInfo.slug)}
              slugTitleMap={slugTitleMap}
            >
              {/* legacy: 커버 이미지 위에 타이틀 오버레이 히어로. 그 외엔 기존 헤더 */}
              {meta.legacyHtml && meta.heroImage ? (
                <LegacyHero
                  projectInfo={projectInfo}
                  coverImage={meta.heroImage}
                />
              ) : (
                <ProjectHeader
                  projectInfo={projectInfo}
                  invertLogo={!projectStyle.isDarkColorScheme}
                />
              )}
              <main
                className={`${
                  meta.fontTheme === "live" ? "live-type " : ""
                }grid grid-cols-6 gap-x-4 mx-6 2xl:mx-16 md:text-xl -tracking-[.016em]`}
                style={{ "--accent": projectStyle.accent } as React.CSSProperties}
              >
                {/* legacyHtml: 옛 케이스 스터디 본문을 셸(히어로/넥스트 푸터)
                    사이에 끼움 — 전환은 리디자인 그대로 */}
                {meta.legacyHtml ? (
                  <LegacyEmbed src={meta.legacyHtml} />
                ) : (
                <MDXRemote
                  {...source}
                  components={{
                    TestingComponent,
                    FullImage,
                    p: paragraphProcessor,
                    h2: Header2,
                    h3: Header3,
                    em: Emphasis,
                    Image: Image,
                    Video: Video,
                    Team,
                    a: Link,
                    ColorShifter,
                    LayoutFull,
                    LayoutMainContent,
                    Quote,
                    Caption,
                    List,
                    ListItem,
                    SlideShow,
                    Spacer,
                    StatGrid,
                    BeforeAfter,
                    Bars,
                    TradeOff,
                    SectionTitle,
                    Flow,
                    ElbowDemo,
                    Insight,
                    Transcript,
                    Placeholder,
                    Barriers,
                    MethodNote,
                    ToneDemo,
                    SystemDemo,
                  }}
                />
                )}
              </main>
            </ProjectView>
          </EditableContextProvider>
        </ColorShifterContextProvider>
      </VideoHoverContextProvider>
      {meta.legacyHtml && <CaseStudyNav />}
      {meta.legacyHtml && <CaseStudyTOC />}
    </>
  );
}
