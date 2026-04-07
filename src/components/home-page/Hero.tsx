import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";
import { GlowBackground } from "../ui/GlowBackground";

export default function Hero() {
  return (
    <section className="relative mx-auto mt-36 flex max-w-7xl flex-col items-center justify-center px-6 text-center md:px-12 font-poppins">
      <GlowBackground
        style={{
          top: "-35%",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at center, rgba(96, 107, 250, 0.4) 0%, transparent 75%)",
          filter: "blur(100px)",
        }}
      />

      <SectionHeading size="hero">
        Transform Operational Chaos <br className="hidden md:block" />
        Into <span className="text-[#a0a6fc]">Intelligent Systems</span>
      </SectionHeading>

      <p className="text-xl md:text-2xl text-white font-poppins font-light max-w-[800px] leading-relaxed mt-8">
        AI automation is transforming industries, but most SMBs are
        <br /> unsure what to adopt or where to start. We help SMBs solve real
        operational problems using intelligent diagnostics, secure AI systems,
        and targeted automation solutions.
      </p>

      <div className="mb-10">
        <PrimaryButton href="/#contact">Get My AI Playbook</PrimaryButton>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="flex -space-x-2">
          <div className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-br from-[#818cf8] to-[#4f46e5] flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
            MR
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
            JK
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-br from-[#fb923c] to-[#ea580c] flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
            SA
          </div>
          <div className="w-9 h-9 rounded-full border-2 border-black bg-gradient-to-br from-[#f472b6] to-[#db2777] flex items-center justify-center text-[10px] font-bold text-white shadow-xl">
            DP
          </div>
        </div>

        <p className="text-sm md:text-base text-white font-poppins tracking-wide">
          Trusted by{" "}
          <span className="opacity-80">
            200+ SMB teams across Amazon & Shopify
          </span>
        </p>
      </div>
    </section>
  );
}
