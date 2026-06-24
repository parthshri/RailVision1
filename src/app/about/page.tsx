import { Metadata } from "next";
import { Brain, Globe2, ShieldCheck, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about RailVision's mission, vision, and company story."
};

const stats = [
  { value: "10x", label: "faster inspection ambition" },
  { value: "2", label: "connected product lines" },
  { value: "AI", label: "built into the safety layer" },
  { value: "STEM", label: "designed for future innovators" }
];

export default function AboutPage() {
  return (
    <>
      <section className="subhero">
        <span className="eyebrow">About RailVision</span>
        <h1>Revolutionizing railway safety while inspiring future innovators.</h1>
        <p>
          RailVision exists at the meeting point of railway engineering, artificial
          intelligence, and education. We are building tools that make infrastructure
          smarter and learning more hands-on.
        </p>
      </section>

      <section className="section split">
        <div className="panel">
          <ShieldCheck size={34} />
          <h2>Mission</h2>
          <p>
            Revolutionize railway safety with intelligent monitoring systems while
            inspiring children to explore engineering, AI, and public safety.
          </p>
        </div>
        <div className="panel">
          <Globe2 size={34} />
          <h2>Vision</h2>
          <p>
            Become a global leader in railway innovation and STEM education by building
            products that are trusted by operators, educators, parents, and learners.
          </p>
        </div>
      </section>

      <section className="section story">
        <div>
          <span className="eyebrow">Company story</span>
          <h2>Built for tracks, classrooms, and the future between them.</h2>
        </div>
        <p>
          RailVision began with a simple question: what if every train could help inspect
          the railway it travels on? That idea expanded into a wider mission. RailVision Pro
          brings wireless, AI-assisted monitoring to enterprise railway operations, while
          RailVision Junior gives young builders a physical way to understand engineering,
          sensors, safety, and intelligent systems.
        </p>
      </section>

      <section className="section stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span>{stat.value}</span>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="section values">
        {[
          { icon: Brain, title: "Intelligent by design", text: "We treat AI as a practical safety layer, not a buzzword." },
          { icon: UsersRound, title: "Human-centered", text: "Operators, educators, children, and families shape the experience." },
          { icon: ShieldCheck, title: "Safety first", text: "Every product is grounded in clearer awareness and better decisions." }
        ].map((value) => (
          <article key={value.title}>
            <value.icon size={30} />
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
