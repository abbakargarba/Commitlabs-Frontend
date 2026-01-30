import SolutionSection from "@/components/SolutionSection";
import CommitmentJourney from "@/components/CommitmentJourney/CommitmentJourney";
import { HeroSection } from "@/components/landing-page/sections/HeroSection";
import { ProblemSection } from "@/components/landing-page/sections/ProblemSection";
import { Navigation } from "@/components/landing-page/Navigation";
import ImpactSection from "@/components/ImpactSection";
import Footer from "@/components/landing-page/Footer";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Navigation />
      <main className="flex w-full flex-col items-center justify-center">
        <HeroSection />
        <ProblemSection />
        <CommitmentJourney />
        <ImpactSection />
        <SolutionSection />
      </main>
      <Footer />
    </div>
  );
}
