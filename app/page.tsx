"use client";

import { RecruiterProvider } from "@/lib/recruiter-context";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ImpactMetrics from "@/components/ImpactMetrics";
import AboutCard from "@/components/AboutCard";
import Projects from "@/components/Projects";
import AILab from "@/components/AILab";
import Skills from "@/components/Skills";
import Timeline from "@/components/Timeline";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatBar from "@/components/ChatBar";
import RecruiterSplash from "@/components/RecruiterSplash";
import CustomCursor from "@/components/CustomCursor";
import OnboardingTour from "@/components/OnboardingTour";
import { Agentation } from "agentation";

export default function Home() {
  return (
    <RecruiterProvider>
      <CustomCursor />
      <OnboardingTour />
      <RecruiterSplash />
      <Header initialDark />
      <main id="main">
        <Hero />
        <Projects />
        <AILab />
        <AboutCard />
        <Skills />
        <Timeline />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ChatBar />
      <Agentation />
    </RecruiterProvider>
  );
}
