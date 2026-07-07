import "../styles/globals.css";
import ReactGA from "react-ga4";
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { WindowDimensionContextProvider } from "../hooks/useWindowDimension";
import { ScrollContainer } from "../components/ScrollContainer/ScrollContainer";
import { PageTransitionProvider } from "../components/PageTransition/PageTransitionContext";
import { HomeScrollPositionContextProvider } from "../components/HomeScrollPositionContext";
import { useImagePreload } from "../hooks/useImagePreload";
import { HistoryProvider } from "../contexts/History";
import { RecruiterProvider } from "../contexts/recruiter-context";
import Head from "next/head";
import { useEffect, useState } from "react";
import { initGA, logEvent, logPageView } from "../lib/analytics";
import dynamic from "next/dynamic";

const ChatBar = dynamic(() => import("../components/ChatBar"), { ssr: false });
const RecruiterSplash = dynamic(() => import("../components/RecruiterSplash"), { ssr: false });

const IMAGE_PRELOAD_LIST: string[] = [
  "/_next/image?url=%2Flandingimgs%2Ftap_landing.png&w=3840&q=75",
  "/_next/image?url=%2Flandingimgs%2Flepal_landing.png&w=3840&q=75",
  "/_next/image?url=%2Flandingimgs%2Fcheffy_landing.png&w=3840&q=75",
  "/_next/image?url=%2Flandingimgs%2Fsidewalk_landing.png&w=3840&q=75",
];

function MyApp({ Component, pageProps, router }: AppProps) {
  const isRouteHome = router.asPath === "/";
  const isAllImagesLoaded = useImagePreload(IMAGE_PRELOAD_LIST);

  useEffect(() => {
    initGA();
    // `routeChangeComplete` won't run for the first page load unless the query string is
    // hydrated later on, so here we log a page view if this is the first render and
    // there's no query string
    if (!router.asPath.includes("?")) {
      logPageView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Listen for page changes after a navigation or when the query changes
    router.events.on("routeChangeComplete", logPageView);
    return () => {
      router.events.off("routeChangeComplete", logPageView);
    };
  }, [router.events]);

  // const [scrollPercentages, setScrollPercentages] = useState(new Set());

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollTop = window.scrollY;
  //     const docHeight =
  //       document.documentElement.scrollHeight - window.innerHeight;
  //     const scrollPercentage = Math.round((scrollTop / docHeight) * 100);

  //     const percentages = [25, 50, 75, 100];

  //     percentages.forEach((percentage) => {
  //       if (
  //         scrollPercentage >= percentage &&
  //         !scrollPercentages.has(percentage)
  //       ) {
  //         setScrollPercentages((prev) => new Set(prev).add(percentage));

  //         ReactGA.event({
  //           category: "Scroll",
  //           action: "Scrolled",
  //           label: `Scrolled ${percentage}%`,
  //           value: percentage,
  //         });
  //       }
  //     });
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [scrollPercentages]);

  return (
    <>
      <Head>
        <meta name="pinterest" content="nopin" />
      </Head>
      <RecruiterProvider>
        <HistoryProvider>
          <WindowDimensionContextProvider>
            <HomeScrollPositionContextProvider>
              <PageTransitionProvider>
                <AnimatePresence initial={true}>
                  <ScrollContainer
                    key={router.asPath}
                    zIndex={isRouteHome ? 10 : 100}
                  >
                    <Component {...pageProps} />
                  </ScrollContainer>
                </AnimatePresence>
              </PageTransitionProvider>
            </HomeScrollPositionContextProvider>
          </WindowDimensionContextProvider>
        </HistoryProvider>
        <RecruiterSplash />
        <ChatBar />
      </RecruiterProvider>
      {/* <!-- Default Statcounter code for portfolio https://alvinn.design --> */}
      {/* <script type="text/javascript">
        {`var sc_project=12719687; var sc_invisible=1; var sc_security="ce1e7f94";`}
      </script> */}
      {/* <script
        type="text/javascript"
        src="https://www.statcounter.com/counter/counter.js"
        async
      ></script> */}
      {/* <!-- End of Statcounter Code --> */}
    </>
  );
}

export default MyApp;
