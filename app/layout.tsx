import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { PageTransition } from "@/components/layout/PageTransition";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Neighbourhood Diagnostics",
    template: "%s | Neighbourhood Diagnostics",
  },
  description:
    "Book lab tests near you. Compare prices across trusted diagnostic centres in Hyderabad. Home sample collection available.",
  keywords: ["lab tests", "diagnostics", "blood test", "Hyderabad", "home sample collection"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0D9488",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <PageTransition>{children}</PageTransition>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { fontFamily: "var(--font-inter)", fontSize: "15px" },
          }}
        />
      </body>
    </html>
  );
}
