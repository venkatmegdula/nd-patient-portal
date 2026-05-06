import { cn } from "@/lib/utils";
import { NavbarClient } from "./NavbarClient";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";

interface PageShellProps {
  children: React.ReactNode;
  noPadBottom?: boolean;
  className?: string;
}

export function PageShell({
  children,
  noPadBottom = false,
  className,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarClient />

      <main
        className={cn(
          "flex-1 px-page py-4",
          !noPadBottom && "pb-24 sm:pb-6",
          noPadBottom && "pb-safe",
          className
        )}
      >
        <div className="max-page mx-auto">{children}</div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
