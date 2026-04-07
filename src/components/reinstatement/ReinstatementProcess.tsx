"use client";

import { SectionHeading } from "../ui/SectionHeading";
import { PrimaryButton } from "../ui/PrimaryButton";

type StepCard = {
  number: string;
  title: string;
  description: string;
  points?: string[];
};

const reinstatementSteps: StepCard[] = [
  {
    number: "01",
    title: "Submit Your Suspension Details",
    description: "Provide key information about your account and suspension.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our system evaluates your case based on Amazon policies, suspension categories, and historical outcomes.",
  },
  {
    number: "03",
    title: "Get Your Assessment",
    description: "Receive an instant assessment report with:",
    points: [
      "Reinstatement viability",
      "Root cause",
      "Recommended strategy",
      "Priority flag for human review if complexity is high",
    ],
  },
];

export default function ReinstatementProcess() {
  return (
    <section className="px-6 md:px-12 font-poppins">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-20 max-w-4xl text-center">
          <SectionHeading size="large">
            A Smarter and Faster <br />
            Way to Approach{" "}
            <span className="text-[#606bfa]">Reinstatement</span>
          </SectionHeading>
          <p className="mx-auto mt-6 max-w-4xl font-normal leading-relaxed text-white md:text-xl">
            Our Reinstatement Estimator analyzes your suspension details and
            provides a clear, structured evaluation of your case. Instead of
            guessing, you get data-backed insights to guide your next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-16">
          {reinstatementSteps.map((step) => (
            <article
              key={step.number}
              className="group relative flex flex-col items-center rounded-[35px] px-8 pb-12 pt-16 transition-all duration-500 hover:scale-[1.02]"
              style={{
                minHeight: "450px",
                backdropFilter: "blur(20px)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-[35px]"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.4) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "destination-out",
                  maskComposite: "exclude",
                }}
              />

              <div
                className="pointer-events-none absolute inset-0 rounded-[35px] overflow-hidden"
                style={{
                  background: `
                    radial-gradient(circle at 0% 0%, rgba(255,255,255,0.5) 0%, transparent 20%),
                    radial-gradient(circle at 100% 100%, rgba(255,255,255,0.5) 0%, transparent 10%)
                  `,
                }}
              />

              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[3px] border-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
                style={{
                  background:
                    "linear-gradient(135deg, #606bfa 0%, #131532 100%)",
                }}
              >
                <span className="text-white text-4xl font-bold tracking-tighter">
                  {step.number}
                </span>
              </div>

              <div className="relative z-10 flex flex-col text-left w-full mt-10">
                <h3 className="text-2xl font-bold text-white mb-6">
                  {step.title}
                </h3>

                <p className="text-white/70 text-lg font-light leading-relaxed mb-6">
                  {step.description}
                </p>

                {step.points && (
                  <ul className="space-y-3">
                    {step.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-white/80 text-base"
                      >
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#606bfa] shrink-0" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center">
          <PrimaryButton
            href="/report"
            config={{
              width: "auto",
              marginTop: "0px",
            }}
          >
            Get My Reinstatement Report
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
