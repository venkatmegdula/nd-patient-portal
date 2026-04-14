"use client";

import { useEffect } from "react";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl mb-5" role="img" aria-label="error">⚠️</p>
      <h1 className="font-heading text-2xl font-extrabold text-stone-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-stone-500 text-sm max-w-xs leading-relaxed mb-8">
        We hit an unexpected error. Please try again — it usually fixes itself.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          <RefreshCw size={15} />
          Try Again
        </button>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border bg-white text-stone-700 font-semibold text-sm hover:border-primary/40 transition-colors"
        >
          <Home size={15} />
          Go to Home
        </Link>
      </div>
    </div>
  );
}
