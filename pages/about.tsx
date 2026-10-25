import Head from "next/head";
import dynamic from "next/dynamic";
import AboutContent from "../components/About/AboutContent";

// Same floating nav the other pages use (client-only, like pages/index.tsx)
const GlassNav = dynamic(() => import("../components/GlassNav"), { ssr: false });

/**
 * Direct visit to /about: same content as the sheet, as a normal page,
 * wrapped in the site's usual nav (the _app ScrollContainer handles the rest).
 */
export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About · Jiho Kim</title>
      </Head>
      <GlassNav />
      <main className="jk-about-page">
        <AboutContent />
      </main>
    </>
  );
}
