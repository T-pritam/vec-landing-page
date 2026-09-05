import Image from "next/image";

const STEPS = [
  {
    image: "/images/steps/assess.png",
    title: "We assess",
    description:
      "An accredited assessment of your place and what qualifies, with no obligation.",
  },
  {
    image: "/images/steps/install.png",
    title: "We install",
    description:
      "Our registered installers do the work, to the program's standard.",
  },
  {
    image: "/images/steps/paperwork.png",
    title: "We handle the paperwork",
    description:
      "We create and sell the certificates and manage all the compliance.",
  },
  {
    image: "/images/steps/save.png",
    title: "You save",
    description:
      "You pay the reduced price. A real upfront discount, not a free gimmick.",
  },
];

export function FullChain() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
      {STEPS.map((step, i) => (
        <div
          key={step.title}
          className="relative rounded-2xl overflow-hidden h-80 sm:h-96"
        >
          <Image
            src={step.image}
            alt={step.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="font-mono uppercase tracking-widest text-white/60 text-sm">
              Step {i + 1}
            </p>
            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
            <p className="text-sm text-white/80 mt-1">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
