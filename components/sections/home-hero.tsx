"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// === HERO ANIMATION CONFIG ===
// Static slot hold durations (AC slot is handled separately by its own frame sequence)
const HERO_SLOT_DURATIONS = [3000, 4000, 5000, 0, 4000]; // ms per slot: dark, sunrise, well-lit, ac (0 = controlled by frame sequence), heatpump
const HERO_CROSSFADE_MS = 800;     // crossfade transition duration between all slots

// AC animation frame sequence (slot 4) — plays ONCE per hero cycle, does NOT loop
const AC_MAIN_FRAME_MS = 200;     // ms per frame during build-up (frames 02-06). Change to 120 for fast/energetic.
const AC_SETTLE_FRAME_MS = 375;   // ms per frame during settle (frames 02, 01 at end). Slower = deceleration feel.
const AC_INITIAL_HOLD_MS = 800;   // ms to hold frame 01 before animation starts
const AC_FINAL_HOLD_MS = 600;     // ms to hold frame 01 after settle, before crossfade to heatpump

// Responsive
const MOBILE_BREAKPOINT = 768;     // px, below = mobile images, at/above = desktop

const AC_SLOT = 3;
const AC_FRAME_COUNT = 6;

/**
 * The scripted AC sequence, in display order. `frame` is a zero-based index
 * into AC_FRAMES. Steps 8 and 9 of the spec are the same frame (04-ac-01), so
 * they collapse into one step holding for the settle plus the final calm.
 */
const AC_SEQUENCE = [
  { frame: 0, hold: AC_INITIAL_HOLD_MS },                     // still room
  { frame: 1, hold: AC_MAIN_FRAME_MS },                       // air just starting
  { frame: 2, hold: AC_MAIN_FRAME_MS },                       // airflow building
  { frame: 3, hold: AC_MAIN_FRAME_MS },                       // strong airflow
  { frame: 4, hold: AC_MAIN_FRAME_MS },                       // curtains extended
  { frame: 5, hold: AC_MAIN_FRAME_MS },                       // peak
  { frame: 1, hold: AC_SETTLE_FRAME_MS },                     // settling down
  { frame: 0, hold: AC_SETTLE_FRAME_MS + AC_FINAL_HOLD_MS },  // settled, then calm
];

// 800 + (5 x 200) + 375 + (375 + 600) = 3150ms
const AC_TOTAL_MS = AC_SEQUENCE.reduce((sum, s) => sum + s.hold, 0);

/** The four still slots. Slot 3 is the AC frame sequence, handled separately. */
const STATIC_SLOTS = [
  {
    slot: 0,
    file: "01-dark.png",
    alt: "Energy upgrade project at night",
  },
  {
    slot: 1,
    file: "02-sunrise.png",
    alt: "Energy upgrade project at sunrise",
  },
  {
    slot: 2,
    file: "03-well-lit.png",
    alt: "Home fitted with solar, heat pump and air conditioning upgrades in daylight",
  },
  {
    slot: 4,
    file: "05-heatpump.png",
    alt: "Heat pump hot water system installed at a home",
  },
];

const AC_FRAMES = Array.from(
  { length: AC_FRAME_COUNT },
  (_, i) => `04-ac-0${i + 1}.png`,
);

// === MOBILE VIDEO SEQUENCE (below MOBILE_BREAKPOINT) ===
// The solar clip, then the aircon clip back to back, then the heat pump still
// for a fixed hold, then straight back to the solar clip. Repeats for as long
// as the page is open.
// The two clips keep the filenames they were uploaded under, hence the space.
const MOBILE_SOLAR_VIDEO = "/images/hero/mobile/Solar%20house.mp4";
const MOBILE_AIRCON_VIDEO = "/images/hero/mobile/Aircon.mp4";
const MOBILE_FINAL_IMAGE = "/images/hero/mobile/05-heatpump.png";

const MOBILE_HEATPUMP_HOLD_MS = 2000; // how long the still sits before the loop restarts

const STAGE_SOLAR = 0;
const STAGE_AIRCON = 1;
const STAGE_HEATPUMP = 2;

export function HomeHero() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slot, setSlot] = useState(0);
  const [acStep, setAcStep] = useState(0);
  const [acMounted, setAcMounted] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);

  // Mobile-only: which of the three assets is on screen.
  const [stage, setStage] = useState(STAGE_SOLAR);
  const solarRef = useRef<HTMLVideoElement>(null);
  const airconRef = useRef<HTMLVideoElement>(null);
  const loadedRef = useRef(false);
  const blockedRef = useRef(false);

  // A refresh should land at the top, because the hero sequence starts the
  // moment the page loads and is missed entirely if the browser drops the
  // reader back where they were. scrollRestoration goes back to what it was on
  // the way out, so this stays a rule about the page the hero is on.
  // The jump has to be instant: the site sets scroll-behavior: smooth, and an
  // animated scroll would be visible on load and would never finish at all
  // inside beforeunload.
  useEffect(() => {
    const toTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const supported = "scrollRestoration" in history;
    const prev = supported ? history.scrollRestoration : "auto";
    if (supported) history.scrollRestoration = "manual";
    toTop();
    window.addEventListener("beforeunload", toTop);
    return () => {
      window.removeEventListener("beforeunload", toTop);
      if (supported) history.scrollRestoration = prev;
    };
  }, []);

  // Pick the desktop or mobile image set, and keep it in sync on resize.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const apply = () => setIsMobile(mq.matches);
    apply();
    setMounted(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Advance through the slots on a loop. The AC slot runs for exactly as long
  // as its frame sequence, so the two always finish together.
  useEffect(() => {
    if (!mounted || isMobile) return;
    const hold = slot === AC_SLOT ? AC_TOTAL_MS : HERO_SLOT_DURATIONS[slot];
    const id = setTimeout(() => {
      setSlot((prev) => (prev + 1) % HERO_SLOT_DURATIONS.length);
    }, hold);
    return () => clearTimeout(id);
  }, [slot, mounted, isMobile]);

  // Mount the AC frames while the well-lit slot is holding, so the browser has
  // all six cached before the animation slot starts. They stay mounted after.
  useEffect(() => {
    if (isMobile) return;
    if (slot === AC_SLOT - 1) setAcMounted(true);
  }, [slot, isMobile]);

  // Walk the scripted AC sequence once, then hold on the final frame until the
  // slot advances. Restarts from step 1 every time the hero cycles back around.
  useEffect(() => {
    if (isMobile) return;
    if (slot !== AC_SLOT) return;
    setAcStep(0);
    let step = 0;
    let id: ReturnType<typeof setTimeout>;
    const advance = () => {
      if (step >= AC_SEQUENCE.length - 1) return;
      step += 1;
      setAcStep(step);
      id = setTimeout(advance, AC_SEQUENCE[step].hold);
    };
    id = setTimeout(advance, AC_SEQUENCE[0].hold);
    return () => clearTimeout(id);
  }, [slot, isMobile]);

  // Mobile: pull both clips down as soon as the elements exist, so the second
  // one is decoded well before the first one ends. Once only: load() restarts
  // resource selection, so calling it again later would cut off whatever is
  // playing.
  useEffect(() => {
    if (!mounted || !isMobile || loadedRef.current) return;
    const solar = solarRef.current;
    const aircon = airconRef.current;
    if (!solar || !aircon) return;
    loadedRef.current = true;
    solar.load();
    aircon.load();
  }, [mounted, isMobile]);

  // Mobile: keep whichever clip is off screen parked on its first frame. Both
  // elements carry the autoplay attribute, so without this the waiting clip
  // would quietly run itself out and the handover would land part way through
  // it. Parked, it still downloads and decodes, so revealing it is a paint
  // rather than a load.
  useEffect(() => {
    if (!mounted || !isMobile) return;
    const v = stage === STAGE_SOLAR ? airconRef.current : solarRef.current;
    if (!v) return;
    const park = () => {
      v.pause();
      v.currentTime = 0;
    };
    park();
    v.addEventListener("loadeddata", park);
    v.addEventListener("play", park);
    return () => {
      v.removeEventListener("loadeddata", park);
      v.removeEventListener("play", park);
    };
  }, [mounted, isMobile, stage]);

  // Mobile: start whichever clip owns the current stage. Muted and inline is
  // allowed to start without a gesture; if a browser still refuses, fall
  // through to the still rather than sitting on a dead frame.
  useEffect(() => {
    if (!mounted || !isMobile || blockedRef.current) return;
    const v =
      stage === STAGE_SOLAR
        ? solarRef.current
        : stage === STAGE_AIRCON
          ? airconRef.current
          : null;
    if (!v) return;
    // Every stage starts its clip from the top, including the solar clip on
    // each time round the loop.
    v.currentTime = 0;
    const started = v.play();
    if (started) {
      started.catch((err: unknown) => {
        // A blocked autoplay is terminal: park on the still for good rather
        // than cycling back into a clip that will be refused again. Anything
        // else is transient, usually an abort from the tab going to the
        // background, and the resume below picks it up.
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          blockedRef.current = true;
          setStage(STAGE_HEATPUMP);
        }
      });
    }
  }, [mounted, isMobile, stage]);

  // Mobile: the still holds for its fixed beat, then the sequence starts over.
  // Skipped when autoplay was refused, since there is nothing to go back to.
  useEffect(() => {
    if (!mounted || !isMobile) return;
    if (stage !== STAGE_HEATPUMP || blockedRef.current) return;
    const id = setTimeout(
      () => setStage(STAGE_SOLAR),
      MOBILE_HEATPUMP_HOLD_MS,
    );
    return () => clearTimeout(id);
  }, [mounted, isMobile, stage]);

  // Mobile: browsers pause video in a backgrounded tab and do not resume it on
  // return. Without this the sequence would strand on a frozen frame if
  // someone leaves the page part way through a clip and comes back.
  useEffect(() => {
    if (!mounted || !isMobile) return;
    const resume = () => {
      if (document.hidden) return;
      const v =
        stage === STAGE_SOLAR
          ? solarRef.current
          : stage === STAGE_AIRCON
            ? airconRef.current
            : null;
      if (v && v.paused && !v.ended) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [mounted, isMobile, stage]);

  const setDir = isMobile ? "mobile" : "desktop";
  const src = (file: string) => `/images/hero/${setDir}/${file}`;
  const acFrame = AC_SEQUENCE[acStep].frame;

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0B0F0C]">
      {mounted && !isMobile && (
        <>
          {STATIC_SLOTS.map((s) => (
            <div
              key={s.file}
              className="absolute inset-0 transition-opacity"
              style={{
                transitionDuration: `${HERO_CROSSFADE_MS}ms`,
                opacity: slot === s.slot ? 1 : 0,
              }}
            >
              <Image
                src={src(s.file)}
                alt={s.alt}
                fill
                priority={s.slot === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}

          {acMounted && (
            <div
              className="absolute inset-0 transition-opacity"
              style={{
                transitionDuration: `${HERO_CROSSFADE_MS}ms`,
                opacity: slot === AC_SLOT ? 1 : 0,
              }}
            >
              {AC_FRAMES.map((file, i) => (
                <Image
                  key={file}
                  src={src(file)}
                  alt={
                    i === 0
                      ? "Reverse cycle air conditioning unit running in a home"
                      : ""
                  }
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{ opacity: acFrame === i ? 1 : 0 }}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Mobile: all three assets are stacked in the same box and swapped by
          opacity with no transition, so a handover is frame-accurate and
          cannot shift the layout. Only the clip that is on screen is allowed
          to advance the stage, so a stray event off screen cannot skip one. */}
      {mounted && isMobile && (
        <>
          <video
            ref={solarRef}
            src={MOBILE_SOLAR_VIDEO}
            muted
            autoPlay
            playsInline
            loop={false}
            controls={false}
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onEnded={() => {
              if (stage === STAGE_SOLAR) setStage(STAGE_AIRCON);
            }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: stage === STAGE_SOLAR ? 1 : 0,
              transition: "none",
            }}
          />
          <video
            ref={airconRef}
            src={MOBILE_AIRCON_VIDEO}
            muted
            autoPlay
            playsInline
            loop={false}
            controls={false}
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            onEnded={() => {
              if (stage === STAGE_AIRCON) setStage(STAGE_HEATPUMP);
            }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: stage === STAGE_AIRCON ? 1 : 0,
              transition: "none",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: stage === STAGE_HEATPUMP ? 1 : 0,
              transition: "none",
            }}
          >
            <Image
              src={MOBILE_FINAL_IMAGE}
              alt="Heat pump hot water system installed at a home"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />

      <div className="absolute bottom-16 sm:bottom-20 lg:bottom-24 left-0 p-8 sm:p-12 lg:p-16 z-20">
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
        >
          Your Renewable Energy Upgrades.
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mt-4">
          Solar, heat pumps and air conditioning, assessed, installed and
          certified across{" "}
          <span className="font-bold" style={{ color: "#3D913C" }}>
            Victoria.
          </span>
        </p>
        <Link
          href="/book-an-assessment"
          className="inline-block mt-6 rounded-lg px-6 py-3 font-semibold text-white transition-all duration-300"
          style={{
            background: ctaHover
              ? "linear-gradient(135deg, #2E7D32 0%, #3D913C 100%)"
              : "linear-gradient(135deg, #3D913C 0%, #6DAF3B 100%)",
          }}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
        >
          Book an assessment
        </Link>
      </div>
    </section>
  );
}
