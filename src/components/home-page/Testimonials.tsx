import { useEffect, useState } from "react";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowBackground } from "../ui/GlowBackground";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "SPCTEK helped us replace disconnected workflows with one operational system. Within weeks, our team cut manual coordination time and made faster decisions with confidence.",
    name: "Nadia R.",
    role: "COO, Mehjabeen Pharmaceuticals",
  },
  {
    quote:
      "Our reporting cycle dropped from days to hours. The automation layer removed repetitive tasks and gave our teams real visibility into what needed our attention first.",
    name: "Ahsan M.",
    role: "Director Operations, Meridian Foods",
  },
  {
    quote:
      "From lead capture to follow-ups, everything now moves in one clean flow. Conversion improved because no opportunities are slipping through handoff gaps anymore.",
    name: "Sara K.",
    role: "Head of Growth, NovaEdge Retail",
  },
  {
    quote:
      "We needed structure without slowing execution. SPCTEK delivered workflows that feel lightweight for teams but still give leadership the control and data we needed.",
    name: "Bilal T.",
    role: "VP Strategy, Orion Ventures",
  },
  {
    quote:
      "Implementation was fast and practical. Instead of another dashboard nobody uses, we got a working system teams adopted immediately across departments.",
    name: "Hira J.",
    role: "General Manager, Apex Services",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    let swapTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      swapTimeout = setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        setIsTransitioning(false);
      }, 640);
    }, 9600);

    return () => {
      clearInterval(interval);
      if (swapTimeout) clearTimeout(swapTimeout);
    };
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="relative px-6 md:px-12 font-poppins" id="testimonials">
      <GlowBackground
        style={{
          top: "30%",
          left: "50%",
          width: "80%",
          height: "160%",
          background:
            "radial-gradient(ellipse at center, rgba(96, 107, 250, 0.72) 0%, transparent 100%)",
          transform: "translate(-50%, -50%) rotate(-40deg) scale(1.25)",
          filter: "blur(100px)",
          opacity: 0.8,
        }}
      />

      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <SectionHeading size="large">
            What <span className="text-[#606bfa]">Our Clients</span> Say About
            Us
          </SectionHeading>
        </div>

        <div className="relative mx-auto w-full max-w-5xl py-6">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#606bfa]/15 blur-[110px]" />

          <div
            className={`relative z-10 overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.07] p-6 shadow-[0_25px_80px_rgba(6,12,35,0.55)] backdrop-blur-2xl transition-all duration-700 md:p-10 ${
              isTransitioning
                ? "opacity-0 blur-[1.5px] saturate-125"
                : "opacity-100 blur-0 saturate-100"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(130deg,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0.02)_42%,rgba(96,107,250,0.16)_100%)]" />
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                isTransitioning ? "opacity-70" : "opacity-0"
              }`}
              style={{
                backgroundImage:
                  "radial-gradient(circle at 18% 24%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 46%), radial-gradient(circle at 78% 70%, rgba(128,138,255,0.32) 0%, rgba(128,138,255,0) 50%), linear-gradient(120deg, rgba(15,20,48,0.00) 0%, rgba(15,20,48,0.35) 55%, rgba(15,20,48,0.62) 100%)",
              }}
            />

            <div className="relative flex flex-col items-end text-right">
              <div className="w-full text-left">
                <p
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  className="inline-block text-2xl font-light leading-relaxed text-white/95 md:text-[2.15rem] md:leading-relaxed"
                >
                  {activeTestimonial.quote}
                </p>
              </div>

              <div className="mt-2.5 max-w-[300px] shrink-0">
                <p className="text-xl font-semibold leading-snug text-white md:text-2xl">
                  {activeTestimonial.name}
                </p>
                <p className="text-sm leading-snug text-white/65 md:text-base">
                  {activeTestimonial.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
