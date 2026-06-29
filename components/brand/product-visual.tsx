import type { CarouselSlide } from "@/components/ui/carousel";

/**
 * On-brand SVG product visuals (Change #1 + user decision: vector, not stock
 * photos — honours PRD §4/§5). A small library of premium geometric "scenes"
 * in the amber / ink / leaf-green palette, composed into per-product panels
 * that feed the product carousels. Each scene is self-contained SVG with soft
 * gradients, depth and grounding shadows so it reads as polished illustration,
 * not line-art. Swap for real photography later by replacing a slide's `node`
 * with an <img>.
 *
 * Gradient ids are scene-prefixed (e.g. "rs-panel") and each scene renders at
 * most once per page, so there are no id collisions across slides.
 */

const AMBER = "#F4A300";
const AMBER_DEEP = "#D98C00";
const SUN_LIGHT = "#FFD24D";
const INK = "#0B0E14";
const LEAF = "#1A7F4B";
const LEAF_LIGHT = "#3F9E54";

/* --------------------------------- frame --------------------------------- */

function Frame({
  children,
  caption,
  tint = "amber",
}: {
  children: React.ReactNode;
  caption: string;
  tint?: "amber" | "leaf" | "ink";
}) {
  const bg =
    tint === "leaf"
      ? "from-leaf-tint to-surface"
      : tint === "ink"
        ? "from-ink to-ink-soft"
        : "from-brand-tint to-surface";
  const captionCls =
    tint === "ink"
      ? "bg-white/10 text-white/80"
      : "bg-surface/85 text-ink shadow-sm";
  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br ${bg} p-6 sm:p-8`}
    >
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden>
        {children}
      </svg>
      <span
        className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${captionCls}`}
      >
        {caption}
      </span>
    </div>
  );
}

/* shared helpers ---------------------------------------------------------- */

/** Soft grounding shadow under an object. */
function Ground({ cx = 200, cy = 256, rx = 150, o = 0.07 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={13} fill={INK} opacity={o} />;
}

/** Glowing rising sun with a ray fan. */
function Sun({ x = 322, y = 64, r = 24 }: { x?: number; y?: number; r?: number }) {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return {
      x1: x + Math.cos(a) * (r + 7),
      y1: y + Math.sin(a) * (r + 7),
      x2: x + Math.cos(a) * (r + 17),
      y2: y + Math.sin(a) * (r + 17),
    };
  });
  return (
    <g>
      <circle cx={x} cy={y} r={r * 1.9} fill={AMBER} opacity={0.1} />
      <circle cx={x} cy={y} r={r * 1.35} fill={AMBER} opacity={0.12} />
      {rays.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={AMBER}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
      <circle cx={x} cy={y} r={r} fill={SUN_LIGHT} />
      <circle cx={x} cy={y} r={r} fill={AMBER} opacity={0.35} />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.4} fill="#fff" opacity={0.35} />
    </g>
  );
}

/* --------------------------------- scenes -------------------------------- */

function SceneRoofSolar() {
  return (
    <>
      <defs>
        <linearGradient id="rs-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#243044" />
          <stop offset="100%" stopColor="#0b0e14" />
        </linearGradient>
        <linearGradient id="rs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9edf2" />
        </linearGradient>
      </defs>
      <Ground />
      <Sun x={332} y={62} r={23} />

      {/* house behind */}
      <path d="M250 206 V150 L300 120 L350 150 V206 Z" fill="url(#rs-wall)" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <rect x="288" y="166" width="24" height="40" rx="2" fill={LEAF} opacity={0.85} />

      {/* tilted solar array */}
      <path d="M64 214 L232 214 L300 118 L132 118 Z" fill="url(#rs-panel)" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      {/* grid columns */}
      <g stroke="#5b6b86" strokeWidth={1.3} opacity={0.8}>
        <line x1="178" y1="118" x2="110" y2="214" />
        <line x1="216" y1="118" x2="148" y2="214" />
        <line x1="258" y1="118" x2="190" y2="214" />
        <line x1="113" y1="150" x2="278" y2="150" />
        <line x1="92" y1="182" x2="257" y2="182" />
      </g>
      {/* sheen */}
      <path d="M132 118 L168 118 L100 214 L64 214 Z" fill="#fff" opacity={0.07} />
      {/* legs */}
      <g stroke={INK} strokeWidth={3} strokeLinecap="round">
        <line x1="96" y1="214" x2="92" y2="236" />
        <line x1="204" y1="214" x2="208" y2="236" />
      </g>
    </>
  );
}

function SceneStack() {
  return (
    <>
      <defs>
        <linearGradient id="stk-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC04D" />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
        <linearGradient id="stk-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#52b06a" />
          <stop offset="100%" stopColor={LEAF} />
        </linearGradient>
        <linearGradient id="stk-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a3346" />
          <stop offset="100%" stopColor={INK} />
        </linearGradient>
      </defs>
      <Sun x={336} y={56} r={18} />
      {[
        { y: 198, label: "VEU", fill: "url(#stk-a)", text: INK },
        { y: 158, label: "STC", fill: "url(#stk-b)", text: "#fff" },
        { y: 118, label: "Solar Victoria", fill: "url(#stk-c)", text: "#fff" },
      ].map((l, i) => (
        <g key={i}>
          <rect x={72} y={l.y + 4} width={256} height={32} rx={9} fill={INK} opacity={0.08} />
          <rect x={70} y={l.y} width={256} height={32} rx={9} fill={l.fill} />
          <rect x={70} y={l.y} width={256} height={13} rx={9} fill="#fff" opacity={0.14} />
          <text x={88} y={l.y + 21} fontFamily="ui-sans-serif, system-ui" fontSize="15" fontWeight="700" fill={l.text}>
            {l.label}
          </text>
        </g>
      ))}
      <text x={72} y={256} fontFamily="ui-sans-serif, system-ui" fontSize="13.5" fontWeight="600" fill={INK}>
        = one combined upfront discount
      </text>
    </>
  );
}

function SceneHeatPump() {
  return (
    <>
      <defs>
        <linearGradient id="hp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6eaf0" />
        </linearGradient>
      </defs>
      <Ground cx={150} rx={120} />
      <Sun x={338} y={60} r={18} />
      {/* outdoor unit */}
      <rect x="64" y="116" width="172" height="118" rx="14" fill="url(#hp-body)" stroke={INK} strokeWidth={2.5} />
      <rect x="64" y="116" width="172" height="20" rx="14" fill="#fff" opacity={0.6} />
      {/* fan */}
      <circle cx="150" cy="178" r="44" fill="#f1f4f8" stroke={INK} strokeWidth={2.5} />
      <circle cx="150" cy="178" r="44" fill={AMBER} opacity={0.06} />
      <g stroke={AMBER} strokeWidth={5} strokeLinecap="round">
        <path d="M150 178 l30 -12" />
        <path d="M150 178 l-12 30" />
        <path d="M150 178 l-28 -16" />
      </g>
      <circle cx="150" cy="178" r="7" fill={INK} />
      <rect x="78" y="128" width="36" height="6" rx="3" fill={INK} opacity={0.18} />
      {/* warm airflow → green */}
      <g stroke={LEAF} strokeWidth={3.5} strokeLinecap="round" fill="none" opacity={0.85}>
        <path d="M252 150 q22 -13 44 0 t44 0" />
        <path d="M252 182 q22 -13 44 0 t44 0" />
        <path d="M252 214 q22 -13 44 0 t44 0" />
      </g>
    </>
  );
}

function SceneHotWaterTank() {
  return (
    <>
      <defs>
        <linearGradient id="hw-tank" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#eef2f6" />
          <stop offset="100%" stopColor="#dbe1e9" />
        </linearGradient>
        <linearGradient id="hw-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC04D" />
          <stop offset="100%" stopColor={AMBER_DEEP} />
        </linearGradient>
      </defs>
      <Ground rx={120} />
      <Sun x={66} y={62} r={18} />
      {/* tank */}
      <rect x="150" y="66" width="104" height="172" rx="22" fill="url(#hw-tank)" stroke={INK} strokeWidth={2.5} />
      {/* warm lower water */}
      <path d="M150 152 h104 v64 a22 22 0 0 1 -22 22 h-60 a22 22 0 0 1 -22 -22 Z" fill={AMBER} opacity={0.14} />
      <line x1="150" y1="152" x2="254" y2="152" stroke={INK} strokeWidth={1.5} opacity={0.4} />
      <rect x="160" y="78" width="14" height="150" rx="7" fill="#fff" opacity={0.5} />
      {/* heat-pump cap */}
      <rect x="166" y="44" width="72" height="30" rx="11" fill={LEAF} />
      <rect x="166" y="44" width="72" height="12" rx="11" fill="#fff" opacity={0.18} />
      {/* drop */}
      <path d="M202 104 c-15 17 -24 28 -24 41 a24 24 0 0 0 48 0 c0 -13 -9 -24 -24 -41 z" fill="url(#hw-drop)" />
      <path d="M196 136 a11 11 0 0 0 -8 10" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
    </>
  );
}

function SceneBattery() {
  return (
    <>
      <defs>
        <linearGradient id="bat-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6eaf0" />
        </linearGradient>
        <linearGradient id="bat-bolt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD24D" />
          <stop offset="100%" stopColor={AMBER_DEEP} />
        </linearGradient>
      </defs>
      <Ground rx={120} />
      <Sun x={332} y={60} r={20} />
      {/* battery */}
      <rect x="118" y="84" width="164" height="140" rx="20" fill="url(#bat-body)" stroke={INK} strokeWidth={2.5} />
      <rect x="118" y="84" width="164" height="24" rx="20" fill="#fff" opacity={0.6} />
      {/* charge level bar */}
      <rect x="140" y="196" width="120" height="12" rx="6" fill="#e3e8ef" />
      <rect x="140" y="196" width="78" height="12" rx="6" fill={LEAF} />
      {/* bolt */}
      <path d="M206 104 l-28 46 h23 l-9 42 l36 -54 h-23 z" fill="url(#bat-bolt)" stroke={AMBER_DEEP} strokeWidth={1.5} strokeLinejoin="round" />
    </>
  );
}

function SceneAirCon() {
  return (
    <>
      <defs>
        <linearGradient id="ac-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8ecf2" />
        </linearGradient>
      </defs>
      {/* wall hint */}
      <rect x="40" y="60" width="320" height="120" rx="10" fill={INK} opacity={0.03} />
      {/* indoor unit */}
      <rect x="78" y="92" width="244" height="66" rx="18" fill="url(#ac-body)" stroke={INK} strokeWidth={2.5} />
      <rect x="78" y="92" width="244" height="22" rx="18" fill="#fff" opacity={0.6} />
      <path d="M90 140 h220" stroke={INK} strokeWidth={2} opacity={0.5} />
      <path d="M90 148 h220" stroke={INK} strokeWidth={2} opacity={0.3} />
      <circle cx="300" cy="112" r="5" fill={LEAF} />
      {/* cool airflow */}
      <g stroke={AMBER} strokeWidth={3.5} strokeLinecap="round" fill="none" opacity={0.9}>
        <path d="M118 172 q10 28 0 58" />
        <path d="M170 174 q12 32 0 64" />
        <path d="M222 174 q-12 32 0 64" />
        <path d="M274 172 q-10 28 0 58" />
      </g>
    </>
  );
}

function SceneLedWarehouse() {
  return (
    <>
      <defs>
        <linearGradient id="led-shed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e9edf2" />
        </linearGradient>
        <linearGradient id="led-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SUN_LIGHT} stopOpacity={0.55} />
          <stop offset="100%" stopColor={AMBER} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Ground rx={150} />
      {/* warehouse shell */}
      <path d="M44 248 V150 L200 86 L356 150 V248 Z" fill="url(#led-shed)" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M44 150 L200 86 L356 150" fill="none" stroke={INK} strokeWidth={2.5} />
      {/* high-bay LED fixtures + light cones */}
      {[112, 200, 288].map((x) => (
        <g key={x}>
          <path d={`M${x - 30} 168 L${x + 30} 168 L${x + 52} 248 L${x - 52} 248 Z`} fill="url(#led-cone)" />
          <rect x={x - 18} y={156} width={36} height={12} rx={3} fill={INK} />
          <circle cx={x} cy={172} r={4.5} fill={SUN_LIGHT} />
        </g>
      ))}
      <rect x="60" y="150" width="22" height="22" rx="4" fill={LEAF} opacity={0.85} />
    </>
  );
}

function SceneWaterFilter() {
  return (
    <>
      <defs>
        <linearGradient id="wf-col" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ecf1" />
        </linearGradient>
        <linearGradient id="wf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfe6cd" />
          <stop offset="100%" stopColor={LEAF_LIGHT} />
        </linearGradient>
        <linearGradient id="wf-drop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7fc99a" />
          <stop offset="100%" stopColor={LEAF} />
        </linearGradient>
      </defs>
      <Ground rx={130} />
      {/* manifold */}
      <rect x="108" y="60" width="132" height="18" rx="9" fill={INK} />
      <rect x="108" y="60" width="132" height="7" rx="9" fill="#fff" opacity={0.18} />
      {/* twin filter columns */}
      {[120, 184].map((x) => (
        <g key={x}>
          <rect x={x} y={78} width={48} height={152} rx={22} fill="url(#wf-col)" stroke={INK} strokeWidth={2.5} />
          <rect x={x} y={150} width={48} height={80} rx={0} fill="url(#wf-water)" opacity={0.5} />
          <rect x={x + 7} y={92} width={9} height={120} rx={5} fill="#fff" opacity={0.55} />
        </g>
      ))}
      {/* clean filtered drop */}
      <path d="M292 118 c-17 19 -27 31 -27 45 a27 27 0 0 0 54 0 c0 -14 -10 -26 -27 -45 z" fill="url(#wf-drop)" />
      <path d="M285 150 a13 13 0 0 0 -9 11" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.75} />
    </>
  );
}

function SceneFullChain() {
  const steps = ["Assess", "Install", "Certify", "You save"];
  return (
    <>
      <defs>
        <linearGradient id="fc-node" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eef1f5" />
        </linearGradient>
        <linearGradient id="fc-last" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD24D" />
          <stop offset="100%" stopColor={AMBER} />
        </linearGradient>
      </defs>
      {steps.map((s, i) => {
        const x = 58 + i * 82;
        const last = i === steps.length - 1;
        return (
          <g key={s}>
            {i < steps.length - 1 && (
              <line x1={x + 27} y1={138} x2={x + 55} y2={138} stroke={LEAF} strokeWidth={3.5} strokeLinecap="round" />
            )}
            <ellipse cx={x} cy={170} rx={22} ry={6} fill={INK} opacity={0.06} />
            <circle cx={x} cy={138} r={26} fill={last ? "url(#fc-last)" : "url(#fc-node)"} stroke={last ? AMBER_DEEP : INK} strokeWidth={2.5} />
            <circle cx={x - 8} cy={130} r={8} fill="#fff" opacity={0.4} />
            {last ? (
              <path d={`M${x - 11} 138 l8 9 l15 -18`} stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <text x={x} y={144} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="15" fontWeight="700" fill={INK}>
                {i + 1}
              </text>
            )}
            <text x={x} y={196} textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontSize="13" fontWeight="600" fill={INK}>
              {s}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* ----------------------------- per-product map ---------------------------- */

type Panel = { id: string; label: string; scene: React.ReactNode; tint?: "amber" | "leaf" | "ink" };

const GALLERIES: Record<string, Panel[]> = {
  solar: [
    { id: "roof", label: "Rooftop array", scene: <SceneRoofSolar /> },
    { id: "stack", label: "Three-layer stack", scene: <SceneStack />, tint: "leaf" },
    { id: "chain", label: "We handle it all", scene: <SceneFullChain /> },
  ],
  "heat-pumps": [
    { id: "unit", label: "Reverse-cycle unit", scene: <SceneHeatPump /> },
    { id: "hw", label: "Heat-pump hot water", scene: <SceneHotWaterTank />, tint: "leaf" },
    { id: "stack", label: "Three-layer stack", scene: <SceneStack /> },
  ],
  battery: [
    { id: "store", label: "Home storage", scene: <SceneBattery /> },
    { id: "chain", label: "Sized with your solar", scene: <SceneFullChain />, tint: "leaf" },
  ],
  "air-con": [
    { id: "unit", label: "Reverse-cycle split", scene: <SceneAirCon /> },
    { id: "chain", label: "Discounted upfront", scene: <SceneFullChain />, tint: "leaf" },
  ],
  led: [
    { id: "warehouse", label: "High-bay LED", scene: <SceneLedWarehouse /> },
    { id: "scale", label: "Commercial scale", scene: <SceneFullChain />, tint: "leaf" },
  ],
  "distillo-water-filtration": [
    { id: "unit", label: "Filtration system", scene: <SceneWaterFilter />, tint: "leaf" },
    { id: "chain", label: "Professionally installed", scene: <SceneFullChain /> },
  ],
};

/** CarouselSlide[] for a product slug, or null if we have no visuals for it. */
export function getProductVisuals(slug: string): CarouselSlide[] | null {
  const panels = GALLERIES[slug];
  if (!panels) return null;
  return panels.map((p) => ({
    id: p.id,
    label: p.label,
    node: (
      <Frame caption={p.label} tint={p.tint}>
        {p.scene}
      </Frame>
    ),
  }));
}

/**
 * A single framed scene (the first panel) for a slug — used as an on-brand
 * fallback in image-led cards where a faithful stock photo isn't available
 * (e.g. home battery). Returns null if we have no visuals for the slug.
 */
export function getProductHeroVisual(slug: string): React.ReactNode | null {
  const panels = GALLERIES[slug];
  if (!panels || panels.length === 0) return null;
  const p = panels[0];
  return (
    <Frame caption={p.label} tint={p.tint}>
      {p.scene}
    </Frame>
  );
}
