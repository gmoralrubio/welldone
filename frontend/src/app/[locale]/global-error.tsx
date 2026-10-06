'use client';

import { useEffect } from 'react';

import './globals.css';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900 antialiased dark:bg-black dark:text-zinc-50">
        <section className="mx-auto grid max-w-xl gap-4 p-6 py-10 sm:p-8">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Critical error
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300">
            A critical failure occurred in the application shell. Try again to
            recover, or reload the page.
          </p>
          <button
            type="button"
            onClick={reset}
            className="w-fit rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Try again
          </button>
        </section>
      </body>
    </html>
  );
}
