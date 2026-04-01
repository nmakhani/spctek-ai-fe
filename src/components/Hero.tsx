import { PrimaryButton } from "./PrimaryButton";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 md:px-12 pt-24 pb-6 max-w-7xl mx-auto relative">
      {/* 1. Headline - mb-8 reduced to mb-6 */}
      <h1 className="text-5xl md:text-7xl font-heading font-bold text-white leading-tight mb-6">
        Transform Operational Chaos <br className="hidden md:block" />
        Into{" "}
        <span className="text-[#a0a6fc] font-heading">Intelligent Systems</span>
      </h1>

      {/* 2. Subtitle - mb-12 reduced to mb-8 */}
      <p className="text-xl md:text-2xl text-white/80 font-poppins font-light max-w-[800px] leading-relaxed mb-8">
        AI automation is transforming industries, but most SMBs are unsure what
        to adopt or where to start. We help SMBs solve real operational problems
        using intelligent diagnostics and targeted automation.
      </p>

      {/* 3. CTA - mb-14 reduced to mb-10, rounded-xl changed to rounded-2xl */}
      <PrimaryButton className="mb-10 text-lg px-20 py-4 rounded-2xl shadow-glow-purple transition-all duration-300 hover:scale-[1.02]">
        Get My AI Playbook
      </PrimaryButton>

      {/* 4. Trust Badge - mt-4 removed to keep it tight to the button */}
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

        <p className="text-sm md:text-base text-white font-heading tracking-wide">
          Trusted by{" "}
          <span className="opacity-80">
            200+ SMB teams across Amazon & Shopify
          </span>
        </p>
      </div>
    </section>
  );
}
