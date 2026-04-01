type SolutionCard = {
  category: string;
  title: string;
  points: string[];
  cta: string;
};

const solutionCards: SolutionCard[] = [
  {
    category: "Revenue Recovery",
    title: "Reinstatement Estimator",
    points: [
      "Suspension root cause analysis",
      "Reinstatement probability assessment",
      "Appeal strategy guidance",
      "Automatic flagging of complex cases for review",
    ],
    cta: "Get Reinstatement Assessment",
  },
  {
    category: "Private AI",
    title: "Secure Local AI Deployment",
    points: [
      "Open-source LLM deployment",
      "Private & secure hosting",
      "Role-based access control with a user-friendly interface",
      "AI aligned with internal workflows and SOPS",
    ],
    cta: "Deploy Local AI",
  },
  {
    category: "Custom Solutions",
    title: "Custom Operational Solutions",
    points: [
      "Operations gap identification",
      "Custom workflow optimization",
      "System integration across tools",
      "AI solutions aligned with your operations",
    ],
    cta: "Get Custom Solutions",
  },
];

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1.1rem",
        height: "1.1rem",
        marginTop: "0.18rem",
        flexShrink: 0,
        color: "white",
      }}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M4 10.5L8 14.5L16 5.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function TargetedSolutions() {
  return (
    <section className="px-6 pb-24 pt-16 md:px-12 md:pb-28 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Header Section - Text made smaller and more balanced */}
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-[2rem] font-medium tracking-tight text-white md:text-[3.5rem]">
            Targeted <span className="text-[#606bfa]">AI Solutions</span> for
            High-Impact
            <br className="hidden md:block" />
            Business Problems
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[1.1rem] font-normal leading-relaxed text-white/70 md:text-[1.25rem]">
            Instead of offering generic AI services, we build targeted solutions
            that address specific operational challenges e-commerce businesses
            face today.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {solutionCards.map((card) => (
            <article
              key={card.title}
              className="relative isolate flex flex-col overflow-hidden rounded-[28px] px-8 pb-8 pt-10"
              style={{
                minHeight: "590px",
                background:
                  "linear-gradient(160deg, #111127 0%, #07070f 60%, #000000 100%)",
                border: "1px solid transparent",
                borderImage: "none",
                boxShadow:
                  "0 32px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.18), inset 1px 0 0 rgba(255,255,255,0.1)",
                borderRadius: "28px",
              }}
            >
              {/* Top-left corner glow */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "28px",
                  border: "1px solid rgba(255,255,255,0.13)",
                  borderTopColor: "rgba(255,255,255,0.32)",
                  borderLeftColor: "rgba(255,255,255,0.2)",
                }}
              />

              {/* Radial highlight top-left */}
              <div
                className="pointer-events-none absolute"
                style={{
                  top: 0,
                  left: 0,
                  width: "70%",
                  height: "55%",
                  borderRadius: "28px 0 0 0",
                  background:
                    "radial-gradient(ellipse at top left, rgba(255,255,255,0.13) 0%, transparent 65%)",
                }}
              />

              {/* Subtle inner shimmer overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  borderRadius: "28px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 40%, rgba(255,255,255,0.03) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 flex h-full flex-col">
                {/* Category */}
                <p
                  className="text-center font-medium tracking-widest uppercase"
                  style={{
                    fontSize: "0.85rem",
                    letterSpacing: "0.18em",
                    color: "#7c86fc",
                  }}
                >
                  {card.category}
                </p>

                {/* Title */}
                <h3
                  className="mt-6 text-center font-heading font-medium text-white"
                  style={{
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    lineHeight: "1.08",
                  }}
                >
                  {card.title}
                </h3>

                {/* Divider */}
                <div
                  className="mx-auto mt-8"
                  style={{
                    width: "100%",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                  }}
                />

                {/* Points */}
                <ul className="mt-8 space-y-5 flex-1">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <CheckIcon />
                      <span
                        className="text-white/90 font-medium leading-snug"
                        style={{ fontSize: "0.97rem" }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  type="button"
                  className="mt-10 w-full font-semibold text-white transition-all duration-200"
                  style={{
                    borderRadius: "14px",
                    padding: "1rem 1.25rem",
                    fontSize: "0.95rem",
                    background:
                      "linear-gradient(135deg, #606bfa 0%, #7880fb 100%)",
                    boxShadow: "0 4px 24px rgba(96,107,250,0.35)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #7078fb 0%, #8a91fc 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 32px rgba(96,107,250,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "linear-gradient(135deg, #606bfa 0%, #7880fb 100%)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 24px rgba(96,107,250,0.35)";
                  }}
                >
                  {card.cta}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <p
          className="mt-10 text-center italic text-white/50"
          style={{ fontSize: "1rem" }}
        >
          More solutions and tools coming soon
        </p>
      </div>
    </section>
  );
}
