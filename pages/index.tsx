import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { useEffect } from "react";
import { useHomeScrollPosition } from "../components/HomeScrollPositionContext";
import { useContainerScroll } from "../components/ScrollContainer/ScrollContainer";
import { getAllPostSlugs, getPostBySlug } from "../lib/projects";
import { PROJECT_ORDER } from "../lib/constants";
import { NextSeo } from "next-seo";
import HomeLayout from "../components/HomeLayout/HomeLayout";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import AboutSheet from "../components/About/AboutSheet";
import { openAbout, closeAbout } from "../lib/about";
import ThemeToggle from "../components/ThemeToggle";

const GlassNav = dynamic(() => import("../components/GlassNav"), {
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
          const order = PROJECT_ORDER as readonly string[];
          const ia = order.indexOf(a.meta.slug);
          const ib = order.indexOf(b.meta.slug);
          if (ia !== -1 && ib !== -1) return ia - ib;
          if (ia !== -1) return -1;
          if (ib !== -1) return 1;
          return b.meta.weight - a.meta.weight;
        }),
    },
  };
};

const Home: NextPage = ({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <NextSeo
        title={`Jiho Kim — Product Designer`}
        description={`Product designer building AI products that adapt to people — and prototyping them in code. Cheffy, TAP, LePal, Project Sidewalk, and UIST 2024 Best Paper research CookAR.`}
      />
      {/* <LandingHero isViewingGrid={isViewingGrid} /> */}
      {/* <div ref={projectRef} /> */}
      {/* <ProjectGridSection
        isViewing={isViewingGrid}
        isViewingTopBar={isViewingGridBar}
        projects={projects}
      /> */}
      <HomeLayout
        projects={projects}
        onNameClick={(el) => openAbout(router, el)}
      />
      <GlassNav />
      <AboutSheet
        open={router.query.about === "1"}
        onClose={() => closeAbout(router)}
        themeToggle={<ThemeToggle inline />}
      />
    </>
  );
};

export default Home;
