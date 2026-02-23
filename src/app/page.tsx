export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <section className="text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to SPCTEK AI</h1>
        <p className="text-xl text-gray-300 mb-8">
          Advanced AI Solutions for Modern Organizations
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Get Started
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition">
            Learn More
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-20">
        <div className="bg-slate-700 p-8 rounded-lg text-white hover:bg-slate-600 transition">
          <h3 className="text-2xl font-bold mb-4">⚡ Fast & Reliable</h3>
          <p className="text-gray-300">
            Built with cutting-edge technology for maximum performance and uptime.
          </p>
        </div>
        <div className="bg-slate-700 p-8 rounded-lg text-white hover:bg-slate-600 transition">
          <h3 className="text-2xl font-bold mb-4">🔒 Secure</h3>
          <p className="text-gray-300">
            Enterprise-grade security with encrypted data and secure API endpoints.
          </p>
        </div>
        <div className="bg-slate-700 p-8 rounded-lg text-white hover:bg-slate-600 transition">
          <h3 className="text-2xl font-bold mb-4">📈 Scalable</h3>
          <p className="text-gray-300">
            Easily scale from startup to enterprise with our robust infrastructure.
          </p>
        </div>
      </section>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
