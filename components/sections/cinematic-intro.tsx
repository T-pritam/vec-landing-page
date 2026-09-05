"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Phase = "black" | "logo" | "text" | "fadeout";

/**
 * Full-screen intro that plays once per page load, then removes itself from
 * the DOM. Black glass -> badge zooms in -> wordmark slides in -> fades out.
 */
export function CinematicIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("black");

  useEffect(() => {
    try {
      if (sessionStorage.getItem("aem-intro-played")) {
        setIsVisible(false);
        return;
      }
      sessionStorage.setItem("aem-intro-played", "true");
    } catch {
      // sessionStorage unavailable
    }

    const timers = [
      setTimeout(() => setPhase("logo"), 800),
      setTimeout(() => setPhase("text"), 1300),
      setTimeout(() => setPhase("fadeout"), 2500),
      setTimeout(() => setIsVisible(false), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!isVisible) return null;

  const fading = phase === "fadeout";
  const logoIn = phase === "logo" || phase === "text" || fading;
  const textIn = phase === "text" || fading;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ease-out",
        fading
          ? "bg-black/0 backdrop-blur-none opacity-0 pointer-events-none"
          : "bg-black/90 backdrop-blur-md opacity-100",
      )}
    >
      <div className="flex flex-row items-center gap-4">
        <Image
          src="/AEM.png"
          alt="AEM Energy"
          width={120}
          height={120}
          priority
          className={cn(
            "transition-all duration-500 ease-out",
            logoIn ? "opacity-100 scale-100" : "opacity-0 scale-50",
          )}
        />
        <div
          className={cn(
            "transition-all duration-[400ms] ease-out",
            textIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8",
          )}
        >
          <span className="block text-4xl font-bold bg-gradient-to-r from-[#3D913C] to-[#6DAF3B] bg-clip-text text-transparent">
            Energy
          </span>
          <span className="block text-sm uppercase tracking-[0.3em] text-[#016539]">
            Smarter Homes
          </span>
        </div>
      </div>
    </div>
  );
}
