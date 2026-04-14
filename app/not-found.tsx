import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl mb-5" role="img" aria-label="not found">🔬</p>
      <h1 className="font-heading text-3xl font-extrabold text-stone-900 mb-2">
        Page Not Found
      </h1>
      <p className="text-stone-500 text-sm max-w-xs leading-relaxed mb-8">
        We couldn't find what you were looking for. The page may have moved or doesn't exist.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-teal-700 transition-colors"
        >
          <Home size={15} />
          Go to Home
        </Link>
        <Link
          href="/tests"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border bg-white text-stone-700 font-semibold text-sm hover:border-primary/40 transition-colors"
        >
          <Search size={15} />
          Browse Tests
        </Link>
      </div>
    </div>
  );
}
