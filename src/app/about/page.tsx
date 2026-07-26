import type { Metadata } from "next";

import {
  BadgeIndianRupee,
  Brain,
  BriefcaseBusiness,
  Globe2,
  Megaphone,
  Settings,
  ShieldCheck,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About RailVision",
  description:
    "Learn about RailVision's mission, vision, company story, STEM products, railway safety innovation, and leadership team.",
};

const stats = [
  {
    value: "10x",
    label: "faster inspection ambition",
  },
  {
    value: "6",
    label: "STEM and railway products",
  },
  {
    value: "AI",
    label: "built into railway safety",
  },
  {
    value: "STEM",
    label: "designed for future innovators",
  },
];

const team = [
  {
    name: "Parth Shrivastav",
    role: "CEO",
    fullRole: "Chief Executive Officer",
    icon: BriefcaseBusiness,
    description:
      "Leads RailVision's vision, product strategy, business development, and overall growth.",
  },
  {
    name: "Mohd Ahmar",
    role: "COO",
    fullRole: "Chief Operating Officer",
    icon: Settings,
    description:
      "Manages operations, execution, coordination, production planning, and order fulfilment.",
  },
  {
    name: "Slok Sagar",
    role: "CMO",
    fullRole: "Chief Marketing Officer",
    icon: Megaphone,
    description:
      "Leads marketing, creator collaborations, brand awareness, content strategy, and customer outreach.",
  },
  {
    name: "Rohan Kumar",
    role: "CFO",
    fullRole: "Chief Financial Officer",
    icon: BadgeIndianRupee,
    description:
      "Oversees pricing, financial planning, expenses, revenue tracking, and business sustainability.",
  },
  {
    name: "Abhinav Tiwari",
    role: "HR",
    fullRole: "Human Resources",
    icon: UserRoundCog,
    description:
      "Supports team coordination, responsibilities, communication, and internal management.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="subhero">
        <span className="eyebrow">
          About RailVision
        </span>

        <h1>
          Advancing railway safety while
          inspiring the next generation of
          innovators.
        </h1>

        <p>
          RailVision brings together railway
          engineering, artificial intelligence,
          automation, robotics, and practical
          STEM education. We are developing
          solutions that make railway systems
          smarter while helping students learn
          through real working projects.
        </p>
      </section>

      <section className="section split">
        <div className="panel">
          <ShieldCheck size={34} />

          <h2>Our Mission</h2>

          <p>
            To improve railway safety through
            intelligent monitoring and
            automation while making engineering,
            electronics, robotics, and AI
            accessible to students through
            practical STEM projects.
          </p>
        </div>

        <div className="panel">
          <Globe2 size={34} />

          <h2>Our Vision</h2>

          <p>
            To become a trusted railway
            innovation and STEM education brand
            that serves students, schools,
            educators, researchers, and railway
            organisations with meaningful,
            practical technology.
          </p>
        </div>
      </section>

      <section className="section story">
        <div>
          <span className="eyebrow">
            Our Story
          </span>

          <h2>
            From a railway safety idea to a
            growing STEM innovation platform.
          </h2>
        </div>

        <div>
          <p>
            RailVision began with a simple but
            important question: what if trains
            themselves could help identify
            railway track problems while they
            travel?
          </p>

          <p>
            That idea became RailVision Pro, an
            AI-assisted concept designed to
            transform trains into moving railway
            inspection units through sensors,
            wireless alerts, GPS-linked
            reporting, and predictive
            maintenance.
          </p>

          <p>
            The project later expanded into
            RailVision Junior and a broader
            collection of working science,
            railway safety, robotics, drone, and
            automation kits. These products help
            students understand real-world
            engineering through practical
            experimentation, science
            exhibitions, STEM learning, and
            innovation competitions.
          </p>
        </div>
      </section>

      <section className="section stats-grid">
        {stats.map((stat) => (
          <div
            className="stat-card"
            key={stat.label}
          >
            <span>{stat.value}</span>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="section">
        <div
          style={{
            maxWidth: 760,
            marginBottom: 32,
          }}
        >
          <span className="eyebrow">
            Leadership Team
          </span>

          <h2>
            Meet the team building RailVision.
          </h2>

          <p>
            RailVision is managed by a
            five-member student team working
            across product development,
            operations, marketing, finance, and
            team management.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 20,
          }}
        >
          {team.map((member) => (
            <article
              className="panel"
              key={member.name}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: 280,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    border:
                      "1px solid var(--line)",
                    background:
                      "rgba(85, 230, 255, 0.07)",
                  }}
                >
                  <member.icon size={27} />
                </div>

                <span
                  className="badge"
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 800,
                  }}
                >
                  {member.role}
                </span>
              </div>

              <h3
                style={{
                  marginBottom: 5,
                }}
              >
                {member.name}
              </h3>

              <strong
                style={{
                  color: "var(--cyan)",
                  marginBottom: 14,
                }}
              >
                {member.fullRole}
              </strong>

              <p
                style={{
                  marginBottom: 0,
                }}
              >
                {member.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section values">
        {[
          {
            icon: Brain,
            title: "Intelligent by design",
            text:
              "We use AI, sensors, electronics, and automation to solve practical railway and learning challenges.",
          },
          {
            icon: UsersRound,
            title: "Built for learners",
            text:
              "Our products are designed to help students understand technology through hands-on experimentation.",
          },
          {
            icon: ShieldCheck,
            title: "Safety with purpose",
            text:
              "Railway safety remains at the centre of our ideas, projects, and long-term innovation goals.",
          },
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