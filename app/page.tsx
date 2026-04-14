import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PackageStrip } from "@/components/home/PackageStrip";
import { PopularTests } from "@/components/home/PopularTests";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LabsPreview } from "@/components/home/LabsPreview";

export const metadata: Metadata = {
  title: "Neighbourhood Diagnostics — Book Lab Tests Near You",
  description:
    "Book affordable lab tests at trusted diagnostic centres in Hyderabad. Home sample collection available. NABL accredited labs.",
};

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <TrustBar />
      <CategoryGrid />
      <PackageStrip />
      <PopularTests />
      <HowItWorks />
      <LabsPreview />
    </PageShell>
  );
}
