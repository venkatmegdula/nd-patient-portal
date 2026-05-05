export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 flex flex-col items-center justify-between px-6 py-12">
      {/* Logo area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-extrabold text-3xl shadow-xl">
          ND
        </div>
        <div>
          <h1 className="text-white font-extrabold text-3xl leading-tight mb-2">
            Neighbourhood<br />Diagnostics
          </h1>
          <p className="text-white/75 text-base leading-relaxed">
            Trusted lab tests near you.<br />
            Transparent prices. Fast results.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {["NABL Accredited", "Up to 40% off MRP", "Reports in 4–24 hrs"].map((b) => (
            <span key={b} className="bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* CTA — plain <a> for full-page navigation (avoids RSC prefetch issues in dev) */}
      <div className="w-full flex flex-col gap-3">
        <a
          href="/onboarding/setup"
          className="w-full h-12 rounded-2xl bg-white text-teal-700 font-bold text-base hover:bg-teal-50 transition-colors flex items-center justify-center"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="w-full h-12 rounded-2xl bg-white/15 text-white font-semibold text-base hover:bg-white/25 transition-colors flex items-center justify-center"
        >
          I already have an account
        </a>
      </div>
    </div>
  );
}
