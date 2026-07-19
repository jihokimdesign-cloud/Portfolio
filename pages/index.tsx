import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useEffect } from "react";
import { useHomeScrollPosition } from "../components/HomeScrollPositionContext";
import { useContainerScroll } from "../components/ScrollContainer/ScrollContainer";
import { getAllPostSlugs, getPostBySlug } from "../lib/projects";
import { NextSeo } from "next-seo";
import HomeLayout from "../components/HomeLayout/HomeLayout";
import dynamic from "next/dynamic";
import Head from "next/head";

const GlassNav = dynamic(() => import("../components/GlassNav"), {
  ssr: false,
});

const RecruiterNav = dynamic(() => import("../components/RecruiterNav"), {
  ssr: false,
});

export const getStaticProps: GetStaticProps = () => {
  const allProjectsSlugs = getAllPostSlugs();
  return {
    props: {
      projects: allProjectsSlugs
        .map((project) => {
          return getPostBySlug(project.params.slug);
        })
        //@ts-ignore
        .sort((a, b) => {
          return b.meta.weight - a.meta.weight;
        }),
    },
  };
};

const Home: NextPage = ({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { scrollY, scrollContainerRef } = useContainerScroll();
  // const [isViewingGrid, setIsViewingGrid] = useState(false);
  // const [isViewingGridBar, setIsViewingGridBar] = useState(false);
  const homeScroll = useHomeScrollPosition();

  useEffect(() => {
    scrollContainerRef.current.scrollTo(0, homeScroll.scrollY);
    return () => {
      homeScroll.setScrollY(scrollY.get());
    };
  }, [scrollY]);

  // useEffect(() => {
  //   const cleanupScroll = scrollY.onChange((amount) => {
  //     if (amount > window.innerHeight / 6) {
  //       setIsViewingGrid(true);
  //     } else {
  //       setIsViewingGrid(false);
  //     }
  //     if (amount > window.innerHeight * 0.7) {
  //       setIsViewingGridBar(true);
  //     } else {
  //       setIsViewingGridBar(false);
  //     }
  //   });

  //   return () => {
  //     cleanupScroll();
  //   };
  // }, [scrollY]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=TikTok+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NextSeo
        title={`Jiho Kim — Product Designer`}
        description={`Product designer who turns technical ambiguity and complex AI into experiences that feel effortless. Currently building AI agent experiences at a stealth startup.`}
      />
      {/* <LandingHero isViewingGrid={isViewingGrid} /> */}
      {/* <div ref={projectRef} /> */}
      {/* <ProjectGridSection
        isViewing={isViewingGrid}
        isViewingTopBar={isViewingGridBar}
        projects={projects}
      /> */}
      <HomeLayout projects={projects} />
      <GlassNav />
      <RecruiterNav />
    </>
  );
};

export default Home;
