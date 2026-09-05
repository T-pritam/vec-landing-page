import Image from "next/image";

export function ServingSection() {
  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 px-8 text-gray-900">
        For your home. For your business.
      </h2>

      <div className="relative w-full aspect-[16/7] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 55% 0, 45% 100%, 0 100%)" }}
        >
          <Image
            src="/images/Products/Residentiall.png"
            alt="A Victorian home fitted with residential energy upgrades"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}
        >
          <Image
            src="/images/Products/commercial.png"
            alt="A commercial property with large-scale energy upgrades"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
