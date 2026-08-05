'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Something went wrong!</h2>
        <p className="text-slate-500 dark:text-slate-400">An unexpected error occurred while loading this page. Please try again.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}