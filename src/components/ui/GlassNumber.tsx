export const GlassNumber = ({ number }: { number: string }) => (
  <div className="relative shrink-0 w-8 h-8 flex items-center justify-center">
    <div
      className="absolute inset-0 rounded-lg p-[1px]"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.1) 60%, rgba(255,255,255,0.8) 100%)",
      }}
    >
      <div className="h-full w-full rounded-[7px] bg-[#121212]" />
    </div>

    <div
      className="absolute inset-[1px] rounded-[7px] pointer-events-none overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(0,0,0,0.3) 100%)",
      }}
    />

    <div
      className="absolute inset-[1px] rounded-[7px] pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.12) 0%, transparent 50%)",
      }}
    />

    <span className="relative z-10 text-[#606bfa] font-bold text-xl tracking-tighter">
      {number}
    </span>
  </div>
);
