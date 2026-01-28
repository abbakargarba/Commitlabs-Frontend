import { HeroSection } from "@/components/landing-page/sections/HeroSection";
import { Navigation } from "@/components/landing-page/Navigation";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] overflow-hidden">
      <Navigation />
      <main id="main-content">
        <HeroSection />
      </main>
    </div>
  );
}
