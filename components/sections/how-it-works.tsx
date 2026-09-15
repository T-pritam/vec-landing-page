"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import StackingCards, { StackingCardItem } from "@/components/ui/stacking-cards";

const steps = [
  {
    bgColor: "bg-[#3D913C]",
    title: "We assess",
    step: "STEP 1",
    description: "An accredited assessment of your place and what qualifies, with no obligation.",
    image: "/images/steps/assess.png",
  },
  {
    bgColor: "bg-[#2E7D32]",
    title: "We install",
    step: "STEP 2",
    description: "Our registered installers do the work, to the program's standard.",
    image: "/images/steps/install.png",
  },
  {
    bgColor: "bg-[#1B5E20]",
    title: "We handle the paperwork",
    step: "STEP 3",
    description: "We create and sell the certificates and manage all the compliance.",
    image: "/images/steps/paperwork.png",
  },
  {
    bgColor: "bg-[#016539]",
    title: "You save",
    step: "STEP 4",
    description: "You pay the reduced price. A real upfront discount, not a gimmick.",
    image: "/images/steps/save.png",
  },
];

export default function HowItWorks() {
  return (
    <section>
      <div className="text-center py-16 px-8">
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">Four steps. The whole chain, in-house.</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">Because we work with a registered Accredited Provider and manage the whole job ourselves, every step sits within one accredited structure.</p>
      </div>
      <StackingCards totalCards={steps.length} className="relative">
        {steps.map(({ bgColor, description, image, title, step }, index) => (
          <StackingCardItem key={index} index={index} className="h-screen">
            <div className={cn(bgColor, "h-[85%] flex-col sm:flex-row px-8 sm:px-16 py-10 flex w-11/12 rounded-3xl mx-auto relative text-white")}>
              <div className="flex-1 flex flex-col justify-center pr-8">
                <span className="font-mono uppercase tracking-widest text-white/60 text-sm mb-2">{step}</span>
                <h3 className="font-bold text-3xl sm:text-4xl lg:text-5xl mb-5">{title}</h3>
                <p className="text-lg text-white/80 max-w-md">{description}</p>
              </div>
              <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden">
                <Image src={image} alt={title} className="object-cover" fill />
              </div>
            </div>
          </StackingCardItem>
        ))}
      </StackingCards>
    </section>
  );
}
