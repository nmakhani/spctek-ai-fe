import { SectionHeading } from "../ui/SectionHeading";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const featuredTestimonial: Testimonial = {
  quote:
    "SPCTEK helped us replace disconnected workflows with one operational system. Within weeks, our team cut manual coordination time and made faster decisions with confidence.",
  name: "Nadia R.",
  role: "COO, Paisa Wala Group",
};

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 font-poppins"
      id="testimonials"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <SectionHeading size="large">
            What <span className="text-[#606bfa]">Our Clients</span> Say About
            Us
          </SectionHeading>
        </div>

        <div className="relative mx-auto w-full max-w-5xl py-6">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#606bfa]/15 blur-[110px]" />

          {/* Key change: A single container with text-right and flex layout */}
          <div className="relative z-10 flex flex-col items-end text-right">
            {/* The entire quote and attribution are in one unified text block */}
            <div className="w-full text-left">
              <p className="inline-block text-2xl font-light leading-relaxed text-white/95 md:text-[2.15rem] md:leading-relaxed">
                {/* Inline start quote */}
                <span className="inline-block mr-3 font-heading text-4xl leading-none text-[#7d89ff]/45 md:text-5xl">
                  &ldquo;
                </span>

                {featuredTestimonial.quote}

                {/* Inline end quote (kept closer) */}
                <span className="inline-block ml-3 font-heading text-4xl leading-none text-[#7d89ff]/45 md:text-5xl">
                  &rdquo;
                </span>
              </p>
            </div>

            {/* Attribution with tighter spacing (mt-2 instead of previous structure) */}
            <div className="mt-2.5 max-w-[300px] shrink-0">
              <p className="text-xl font-semibold leading-snug text-white md:text-2xl">
                {featuredTestimonial.name}
              </p>
              <p className="text-sm leading-snug text-white/65 md:text-base">
                {featuredTestimonial.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
