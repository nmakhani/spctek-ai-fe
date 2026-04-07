import { PrimaryButton } from "../ui/PrimaryButton";
import { SectionHeading } from "../ui/SectionHeading";

export default function AIPlaybook() {
  return (
    <section
      className="relative overflow-hidden px-6 md:px-12 font-poppins"
      id="ai-playbook"
    >
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading size="large">
          Let&apos;s Build Your Custom <br />
          <span className="text-[#606bfa]">AI Playbook</span>
        </SectionHeading>

        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mt-8">
          Take a quick assessment, and get a personalized roadmap of where AI
          and automation can have the biggest impact on your business.
        </p>

        <div className="flex justify-center">
          <PrimaryButton href="/#contact">Get My AI Playbook</PrimaryButton>
        </div>
      </div>
    </section>
  );
}
