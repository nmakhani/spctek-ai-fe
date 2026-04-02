import { PrimaryButton } from "../PrimaryButton";

export default function AIPlaybook() {
  return (
    <section className="px-6 overflow-hidden relative" id="ai-playbook">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-4">
          Let&apos;s Build Your Custom <br />
          <span className="text-accent">AI Playbook</span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mt-8 mb-12">
          Take a quick assessment, and get a personalized roadmap of where AI
          and automation can have the biggest impact on your business.
        </p>

        <div className="flex justify-center mt-6">
          <PrimaryButton onClick={() => window.open("#contact", "_self")}>
            Get My AI Playbook
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
