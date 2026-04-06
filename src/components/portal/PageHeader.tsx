import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
  buttonText: string;
  buttonOnClick: () => void;
  showForm?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  backLink,
  backText,
  buttonText,
  buttonOnClick,
  showForm,
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 px-6 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-5">
        <div>
          {backLink && (
            <Link
              href={backLink}
              className="mb-2 inline-block text-sm text-white/60 transition hover:text-[#a9b2ff]"
            >
              {backText || "← Back"}
            </Link>
          )}
          <h1 className="text-2xl font-semibold text-white md:text-4xl">
            {title} <span className="text-[#606bfa]">{subtitle}</span>
          </h1>
        </div>
        <button
          onClick={buttonOnClick}
          className="shrink-0 rounded-xl bg-[#606bfa] px-5 py-2.5 font-semibold text-white transition hover:bg-[#6f79ff] hover:shadow-[0_0_18px_rgba(96,107,250,0.5)]"
        >
          {showForm ? "Cancel" : buttonText}
        </button>
      </div>
    </header>
  );
}
