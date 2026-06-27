import { Eyebrow } from "@/components/ui/section";
import { cn } from "@/lib/cn";

/**
 * The money mechanism — PRD §3.1 / §7.2. The biggest single competitive gap is
 * that nobody explains how the money works. This renders the VEEC → retailer →
 * discount flow as a clear step diagram. `detailed` adds the "government is the
 * referee, not the buyer" nuance for the How It Works page.
 */

const STEPS = [
  {
    n: "01",
    title: "You install an eligible upgrade",
    body: "A heat pump, solar, efficient hot water — whatever fits your place.",
  },
  {
    n: "02",
    title: "We create the certificates",
    body: "Through our Accredited Person, Aussie Eco Marks, we generate VEECs from the energy your upgrade saves. Only an Accredited Person can do this.",
  },
  {
    n: "03",
    title: "Retailers buy them — not the government",
    body: "Energy retailers are legally required to buy a quota of certificates each year. That obligation creates the demand.",
  },
  {
    n: "04",
    title: "The value comes back as your discount",
    body: "The certificate value is passed to you as an upfront discount. Our margin sits in the spread and install — not a hidden fee.",
  },
];

export function MoneyFlow({ detailed = false }: { detailed?: boolean }) {
  return (
    <div>
      <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className="relative flex flex-col rounded-2xl border border-hairline bg-surface p-6"
          >
            <span className="figure text-sm font-semibold text-brand-ink">
              {s.n}
            </span>
            <span className="mt-3 text-h3 text-[1.125rem]">{s.title}</span>
            <span className="mt-2 text-sm leading-relaxed text-text-muted">
              {s.body}
            </span>
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-hairline lg:block"
              >
                <ArrowRight />
              </span>
            )}
          </li>
        ))}
      </ol>

      {detailed && (
        <div className="mt-6 rounded-2xl bg-business-tint p-6 sm:p-8">
          <Eyebrow>The government's role</Eyebrow>
          <p className="mt-3 max-w-3xl text-body">
            The government creates the <em>obligation</em> — it forces retailers
            to buy certificates and sets the rules. It's the referee that makes
            the market exist, not the buyer. The price is set by market supply
            and demand, not a fixed government rate. That's why your discount
            isn't a handout, and why it can move over time.
          </p>
        </div>
      )}
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-6 w-6", className)}
      fill="none"
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
