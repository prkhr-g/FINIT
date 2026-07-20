import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <Link href="/" className="text-2xl font-black tracking-wider text-indigo-400">
          FINT
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 max-w-6xl mx-auto text-center space-y-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
          
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 border border-indigo-800 text-indigo-300">
            ✨ AI-Powered Financial Planning
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Take Control of Your Wealth with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-rose-400">
              Financial Intelligence
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            FINT helps you monitor assets, forecast retirement goals, optimize tax exposure, and chat with a dedicated AI advisor to build compound wealth.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 text-center cursor-pointer"
            >
              Enter Dashboard
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 text-base font-semibold text-slate-300 border border-slate-800 rounded-xl hover:bg-slate-900 transition-all text-center cursor-pointer"
            >
              Start Free Trial
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 md:py-24 bg-slate-900/40 border-t border-slate-900 px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight">Powerful Features, Engineered to Scale</h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm">Comprehensive modules built for high net-worth tracking and daily budgeting.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-950 flex items-center justify-center text-2xl">📊</div>
                <h3 className="text-xl font-semibold">Unified Dashboard</h3>
                <p className="text-slate-400 text-sm">Get a holistic 360° overview of your income, expenses, liquid balance, and net assets instantly.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 flex items-center justify-center text-2xl">🤖</div>
                <h3 className="text-xl font-semibold">Personalized AI Advisor</h3>
                <p className="text-slate-400 text-sm">Chat with FINT AI, our specialized financial model, to audit portfolios, analyze spending, and run simulations.</p>
              </div>

              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-950 flex items-center justify-center text-2xl">🎯</div>
                <h3 className="text-xl font-semibold">Goal Forecasting</h3>
                <p className="text-slate-400 text-sm">Define milestones like home buying or retirement, and simulate realistic projection paths under various yields.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-20 border-t border-slate-900 bg-slate-950 px-6 flex items-center justify-between text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} FINT Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:underline">Privacy Policy</Link>
          <Link href="#" className="hover:underline">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
