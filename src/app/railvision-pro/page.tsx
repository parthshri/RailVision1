import type { Metadata } from "next";

import {
  Activity,
  DatabaseZap,
  MapPinned,
  RadioTower,
  Route,
  Satellite,
} from "lucide-react";

import { InquiryForm } from "@/components/InquiryForm";
import { ProductVisual } from "@/components/ProductVisual";

export const metadata: Metadata = {
  title: "RailVision Pro",
  description:
    "Explore RailVision Pro, an upcoming AI-powered railway health monitoring platform designed for continuous track inspection, defect detection, and predictive maintenance.",
};

export default function ProPage() {
  const processSteps = [
    {
      icon: RadioTower,
      title: "Deploy",
      text: "Wireless prototype modules are designed to mount onto trains without requiring major infrastructure changes.",
    },
    {
      icon: Activity,
      title: "Sense",
      text: "Track condition, vibration, location, and surrounding railway data can be captured during normal train movement.",
    },
    {
      icon: DatabaseZap,
      title: "Analyze",
      text: "AI models are planned to identify anomalies, potential defects, patterns, and maintenance risks.",
    },
    {
      icon: MapPinned,
      title: "Alert",
      text: "GPS-linked alerts are intended to help maintenance teams locate issues and prioritize inspections.",
    },
  ];

  return (
    <>
      <section className="subhero product-subhero">
        <div>
          <span className="eyebrow">
            Enterprise railway intelligence
          </span>

          <h1>
            Train-mounted wireless monitoring for continuous railway
            health insights.
          </h1>

          <p>
            RailVision Pro is an upcoming AI-powered railway inspection
            concept designed to transform operational trains into moving
            monitoring units using edge sensing, defect detection, GPS
            context, and predictive-maintenance workflows.
          </p>

          <a
            className="button primary"
            href="#enterprise-inquiry"
          >
            Request Information
          </a>
        </div>

        <ProductVisual
          label="RailVision Pro"
          imageUrl="/railvision-pro.png"
          variant="pro"
        />
      </section>

      <section className="coming-banner">
        CURRENTLY UNDER DEVELOPMENT
      </section>

      <section className="section process">
        <div className="section-heading">
          <span className="eyebrow">
            Proposed workflow
          </span>

          <h2>
            Wireless inspection intelligence designed for active
            rolling stock.
          </h2>

          <p>
            RailVision Pro is currently in the concept and prototype
            development stage. Final capabilities, hardware, and
            deployment methods may change.
          </p>
        </div>

        {processSteps.map((step) => (
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

          <h2>Potential use cases</h2>

          <ul className="check-list">
            <li>Mainline route health monitoring</li>
            <li>Metro and commuter inspection programs</li>
            <li>Depot-to-route asset visibility</li>
            <li>Preventive maintenance planning</li>
          </ul>
        </div>

        <div className="panel">
          <Satellite size={34} />

          <h2>Development roadmap</h2>

          <ul className="check-list">
            <li>Prototype sensor-fusion modules</li>
            <li>AI-assisted railway defect analysis</li>
            <li>Operator command-centre dashboards</li>
            <li>Route risk scoring and GPS alerts</li>
            <li>Railway-system API integrations</li>
          </ul>
        </div>
      </section>

      <section
        className="section split"
        id="enterprise-inquiry"
      >
        <div>
          <span className="eyebrow">
            Enterprise inquiry
          </span>

          <h2>
            Tell us how RailVision Pro could support your railway
            network.
          </h2>

          <p>
            RailVision Pro is currently under development. You can
            submit an inquiry to discuss potential requirements,
            partnerships, pilot opportunities, or future demonstrations.
          </p>
        </div>

        <InquiryForm />
      </section>
    </>
  );
}