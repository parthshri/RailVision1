import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RailVision | AI Railway Safety and STEM Innovation",
    template: "%s | RailVision"
  },
  description:
    "RailVision builds AI-powered railway monitoring systems and STEM railway kits for the next generation of innovators.",
  keywords: [
    "RailVision",
    "railway safety",
    "AI railway inspection",
    "STEM kit",
    "predictive maintenance",
    "Razorpay",
    "Firebase"
  ],
  openGraph: {
    title: "RailVision",
    description: "AI railway safety systems and STEM railway learning kits.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
