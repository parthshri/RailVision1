import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "RailVision | AI Railway Safety and STEM Innovation",
    template: "%s | RailVision",
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
    "Firebase",
  ],
  openGraph: {
    title: "RailVision",
    description:
      "AI railway safety systems and STEM railway learning kits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){
                (c[a].q=c[a].q||[]).push(arguments)
              };
              t=l.createElement(r);
              t.async=1;
              t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];
              y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xrvli113ay");
          `}
        </Script>

        <GoogleAnalytics gaId="G-W53D79RZPB" />
      </body>
    </html>
  );
}