import Link from "next/link";

export const metadata = {
  title: "About Us — Meziva Beauty",
  description:
    "Meziva Beauty makes clean, dermatologically tested lip care built for Indian skin and weather. Learn about our story and what goes into every balm.",
};

const VALUES = [
  {
    title: "Made For Indian Weather",
    text: "Formulated with SPF 30 to handle real Indian summers — sun, heat, and everything in between.",
  },
  {
    title: "Clean Ingredients",
    text: "Shea butter, Vitamin E and real fruit extracts. No parabens, nothing hidden.",
  },
  {
    title: "Dermatologically Tested",
    text: "Every formula is tested for safety before it reaches you — gentle enough for daily use.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section className="container-x py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest3 text-wine mb-3">
            Our Story
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-charcoal leading-tight">
            Lip care, made honestly.
          </h1>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed mt-6">
            Meziva Beauty started with a simple problem — most lip balms
            available in India were either imported, overpriced, or full of
            ingredients nobody could pronounce. We wanted something
            different: hydrating, SPF-protected lip care made specifically
            for Indian skin and Indian weather, using ingredients we'd be
            comfortable naming out loud.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-blush/30 py-14 md:py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {VALUES.map((v) => (
              <div key={v.title} className="text-center md:text-left">
                <h3 className="font-serif text-lg md:text-xl text-charcoal mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="container-x py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-5">
            What We Believe
          </h2>
          <p className="text-sm md:text-base text-charcoal/70 leading-relaxed">
            Good skincare shouldn't require a chemistry degree to understand,
            and it shouldn't cost a fortune either. Every Meziva product is
            built around a short, honest ingredient list, real SPF
            protection, and a price that makes sense for everyday use — not
            an occasional treat.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal py-14 md:py-16">
        <div className="container-x text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4">
            Ready to try it for yourself?
          </h2>
          <p className="text-sm text-white/60 mb-8 max-w-md mx-auto">
            Explore the full range and find your everyday lip balm.
          </p>
          <Link
            href="/shop"
            className="inline-block border border-white px-8 py-3 text-sm uppercase tracking-widest2 text-white hover:bg-wine hover:border-wine transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
