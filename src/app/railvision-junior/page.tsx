import { Metadata } from "next";
import { BrainCircuit, GraduationCap, ShieldCheck, Wrench } from "lucide-react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { ProductVisual } from "@/components/ProductVisual";
import { getProduct } from "@/lib/products";

export const metadata: Metadata = {
  title: "RailVision Junior",
  description: "RailVision Junior is a premium STEM railway kit for children."
};

const product = getProduct("railvision-junior")!;

const faqs = [
  ["What age is RailVision Junior for?", "It is designed for curious young learners, with parent or educator guidance recommended for younger children."],
  ["Does it teach real AI coding?", "It introduces AI thinking, pattern recognition, sensors, and safety logic through guided STEM activities."],
  ["Can schools use it?", "Yes. The kit is planned for homes, maker spaces, STEM labs, and classroom demonstrations."]
];

export default function JuniorPage() {
  return (
    <>
      <section className="subhero product-subhero">
        <div>
          <span className="eyebrow">STEM railway kit</span>
          <h1>RailVision Junior makes railway engineering feel buildable.</h1>
          <p>
            A premium kit for children to explore tracks, inspection logic, AI concepts,
            safety signals, and engineering creativity through guided hands-on play.
          </p>
          <CheckoutButton product={product} label="Buy Now" />
        </div>
<ProductVisual
  label={product.name}
  imageUrl={
    product.id === "railvision-junior"
      ? "/railvision-junior.png"
      : undefined
  }
  variant={product.id === "pro" ? "pro" : "kit"}
/>

      </section>

      <section className="section feature-grid">
        {[
          { icon: Wrench, title: "Build and test", text: "Assemble railway-inspired modules and experiment with inspection challenges." },
          { icon: BrainCircuit, title: "AI concepts", text: "Learn how intelligent systems detect patterns and trigger decisions." },
          { icon: ShieldCheck, title: "Safety learning", text: "Understand why inspection, maintenance, and alerts matter in real railways." },
          { icon: GraduationCap, title: "STEM benefits", text: "Supports problem solving, systems thinking, creativity, and engineering confidence." }
        ].map((item) => (
          <article className="panel" key={item.title}>
            <item.icon size={32} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </section>


      <section className="section split">
        <div>
          <span className="eyebrow">Customer reviews</span>
          <h2>Early families and educators are excited about railway STEM.</h2>
        </div>
        <div className="review-list">
          {[
            "A beautiful way to make infrastructure and AI tangible for children.",
            "The railway theme makes engineering feel purposeful and memorable.",
            "Perfect for STEM clubs that want a premium, India-relevant kit."
          ].map((review, index) => (
            <blockquote key={review}>
              <span>{index + 1}</span>
              {review}
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section faq">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>Common questions</h2>
        </div>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
