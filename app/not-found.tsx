import { Button } from "@/components/ui/button";
import { PRIMARY_CTA } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-surface-muted">
      <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="text-display mt-4 text-[clamp(2.5rem,6vw,4rem)]">
          This page isn't here.
        </h1>
        <p className="text-lead mx-auto mt-5 max-w-md">
          The page you're after may have moved. Let's get you back to something
          useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            Back to home
          </Button>
          <Button href={PRIMARY_CTA.href} size="lg" variant="secondary">
            {PRIMARY_CTA.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
