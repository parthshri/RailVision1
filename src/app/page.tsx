import Link from "next/link";
import {
  Activity,
  BellRing,
  BrainCircuit,
  CheckCircle2,
  MapPin,
  Radio,
  ShieldCheck,
  Sparkles,
  TrainFront
} from "lucide-react";
import { ProductVisual } from "@/components/ProductVisual";

const proFeatures = [
  { icon: BrainCircuit, label: "AI defect detection" },
  { icon: MapPin, label: "GPS-linked alerts" },
  { icon: Activity, label: "Predictive maintenance" },
  { icon: Radio, label: "Wireless deployment" }
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={16} /> AI railway intelligence</span>
          <h1>RailVision turns rail safety into a live, intelligent network.</h1>
          <p>
            From train-mounted inspection systems to child-friendly STEM kits, RailVision
            builds railway technology that watches, learns, teaches, and protects.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/railvision-pro">
              <TrainFront size={18} /> Explore Pro
            </Link>
            <Link className="button secondary" href="/shop">
              Shop Junior
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-label="RailVision AI railway visualization">
          <div className="rail-lines" />
          <div className="scan-orbit" />
          <TrainFront size={96} />
          <div className="floating-chip chip-one">Track anomaly: 0.03 mm</div>
          <div className="floating-chip chip-two">GPS alert synced</div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Featured systems</span>
          <h2>One platform for the railway of today and the innovators of tomorrow.</h2>
        </div>
        <div className="product-grid">
          <article className="product-card featured">
            <div className="badge">Coming Soon</div>
            <ProductVisual label="RailVision Pro" variant="pro" />
            <h3>RailVision Pro</h3>
            <p>
              AI-powered wireless railway health monitoring that transforms trains into
              moving inspection units for real-time infrastructure intelligence.
            </p>
            <div className="feature-list compact">
              {proFeatures.map((feature) => (
                <span key={feature.label}>
                  <feature.icon size={16} /> {feature.label}
                </span>
              ))}
            </div>
            <Link className="button primary" href="/railvision-pro">
              Request Demo
            </Link>
          </article>

          <article className="product-card">
            <div className="badge green">Available</div>
            <ProductVisual label="RailVision Junior"
            imageUrl="/railvision-junior.png" 
            />
            <h3>RailVision Junior</h3>
            <p>
              A premium STEM railway kit designed for children to learn engineering,
              AI thinking, safety systems, and creative problem solving.
            </p>
            <div className="feature-list compact">
              {["Engineering play", "AI concepts", "Railway safety", "Guided challenges"].map(
                (feature) => (
                  <span key={feature}>
                    <CheckCircle2 size={16} /> {feature}
                  </span>
                )
              )}
            </div>
            <Link className="button secondary" href="/shop">
              <BellRing size={18} /> Shop Now
            </Link>
          </article>
        </div>
      </section>

      <section className="section band">
        <div className="metric">
          <strong>24/7</strong>
          <span>inspection readiness</span>
        </div>
        <div className="metric">
          <strong>AI</strong>
          <span>defect intelligence</span>
        </div>
        <div className="metric">
          <strong>STEM</strong>
          <span>learning by building</span>
        </div>
        <div className="metric">
          <strong>GPS</strong>
          <span>asset-aware alerts</span>
        </div>
      </section>
    </>
  );
}
