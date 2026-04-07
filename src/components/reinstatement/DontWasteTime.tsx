"use client";

import Image from "next/image";

import { GlassNumber } from "../ui/GlassNumber";
import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowBackground } from "../ui/GlowBackground";

const issuesList = [
  { number: "1", title: "Waste time with manual assessment & chasing experts" },
  { number: "2", title: "Submit appeals without understanding the root cause" },
  { number: "3", title: "Use generic templates that get rejected" },
  { number: "4", title: "Waste days waiting for unclear guidance" },
  { number: "5", title: "Make mistakes that reduce reinstatement chances" },
];

export default function DontWasteTime() {
  return (
    <section className="px-6 md:px-12 font-poppins">
      <div className="max-w-5xl mx-auto">
        <SectionHeading size="large">
          Don&apos;t Risk Your Account
          <br className="hidden md:block" /> With{" "}
          <span className="text-[#606bfa]">Delays and Wrong</span> Appeals
        </SectionHeading>

        <p className="mt-8 font-normal text-center text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          When your Amazon account gets suspended, every decision matters. It
          can take 5-7 days to assess if your case is worth pursuing, and most
          sellers:
        </p>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col items-start">
            <div className="w-full max-w-[280px] md:max-w-[450px] divide-y divide-white/2">
              {issuesList.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-4 transition-all duration-300"
                >
                  <GlassNumber number={issue.number} />
                  <span className="text-white/90 font-medium text-lg tracking-tight">
                    {issue.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center items-center">
            <div className="absolute bg-[#606bfa]/10 blur-[100px] rounded-full w-80 h-80 -z-10" />

            <div className="relative bobbing-image w-full flex justify-center">
              <GlowBackground
                style={{
                  top: "40%",
                  left: "50%",
                  width: "90%",
                  height: "80%",
                  background:
                    "radial-gradient(ellipse at center, rgba(96, 107, 250, 0.5) 0%, rgba(96, 107, 250, 0.5) 50%, transparent 80%)",
                  transform: "translate(-50%, -50%) rotate(-55deg) scale(1.2)",
                  filter: "blur(40px)",
                }}
              />

              <Image
                width={500}
                height={400}
                src="/reinstatement/files.png"
                alt="3D AI Robot Illustration"
                className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 text-center flex flex-col items-center">
          <p className="text-lg text-white/60 font-light max-w-xl mx-auto leading-relaxed">
            One wrong move can delay recovery or
            <span className="text-white">
              {" "}
              permanently damage your account.
            </span>
          </p>
          <PrimaryButton href="/#contact">
            Get My Reinstatement Report
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
