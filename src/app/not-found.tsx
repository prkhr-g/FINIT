import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md space-y-6">
        <h1 className="text-8xl font-black text-indigo-600 animate-pulse">404</h1>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}