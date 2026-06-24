import { Metadata } from "next";
import { Activity, DatabaseZap, MapPinned, RadioTower, Route, Satellite } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { ProductVisual } from "@/components/ProductVisual";

export const metadata: Metadata = {
  title: "RailVision Pro",
  description: "Enterprise AI railway health monitoring system by RailVision."
};

export default function ProPage() {
  return (
    <>
      <section className="subhero product-subhero">
        <div>
          <span className="eyebrow">Enterprise railway intelligence</span>
          <h1>Train-mounted wireless monitoring for continuous railway health insight.</h1>
          <p>
            RailVision Pro transforms operational trains into moving inspection units,
            combining edge sensing, AI defect detection, GPS context, and predictive
            maintenance workflows.
          </p>
          <a className="button primary" href="#enterprise-inquiry">Request Demo</a>
        </div>
        <ProductVisual label="RailVision Pro" variant="pro" />
      </section>

      <section className="coming-banner">COMING SOON</section>

      <section className="section process">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Wireless inspection intelligence mounted on active rolling stock.</h2>
        </div>
        {[
          { icon: RadioTower, title: "Deploy", text: "Wireless modules mount onto trains without heavy infrastructure changes." },
          { icon: Activity, title: "Sense", text: "Track, vibration, location, and condition signals are captured during normal movement." },
          { icon: DatabaseZap, title: "Analyze", text: "AI models identify anomalies, defects, trends, and maintenance risk." },
          { icon: MapPinned, title: "Alert", text: "GPS-linked alerts help teams locate issues and prioritize action quickly." }
        ].map((step) => (
          <article key={step.title}>
            <step.icon size={30} />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </section>

      <section className="section split">
        <div className="panel">
          <Route size={34} />
          <h2>Use cases</h2>
          <ul className="check-list">
            <li>Mainline route health monitoring</li>
            <li>Metro and commuter inspection programs</li>
            <li>Depot-to-route asset visibility</li>
            <li>Preventive maintenance planning</li>
          </ul>
        </div>
        <div className="panel">
          <Satellite size={34} />
          <h2>Future roadmap</h2>
          <ul className="check-list">
            <li>Advanced sensor fusion</li>
            <li>Operator command center dashboards</li>
            <li>Route risk scoring</li>
            <li>API integrations for railway systems</li>
          </ul>
        </div>
      </section>

      <section className="section split" id="enterprise-inquiry">
        <div>
          <span className="eyebrow">Enterprise inquiry</span>
          <h2>Tell us where RailVision Pro could support your network.</h2>
          <p>
            Submissions are stored securely in Firestore for the RailVision team to review
            from the admin dashboard.
          </p>
        </div>
        <InquiryForm />
      </section>
    </>
  );
}
