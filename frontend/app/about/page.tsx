import { FaLayerGroup, FaCommentDots, FaInfinity, FaStar } from "react-icons/fa";
import Reveal from "@/components/Reveal";

const principles = [
  {
    title: "One record per action",
    body: "Every enrollment, review, and question is stored as its own entry — nothing is inferred or recomputed after the fact.",
  },
  {
    title: "Built to be extended",
    body: "This is a scaffold, not a finished product. Payments, video playback, and richer analytics are meant to be layered on top.",
  },
  {
    title: "No decoration without function",
    body: "If something's on the page, it's either real data or a real control. No placeholder numbers pretending to be metrics.",
  },
];

const features = [
  {
    icon: FaLayerGroup,
    title: "Level-tagged courses",
    body: "Every course is marked Beginner, Intermediate, or Advanced, so you know exactly what you're getting into before you enroll.",
  },
  {
    icon: FaCommentDots,
    title: "Direct Q&A",
    body: "Ask a question on any lesson and get a reply attached right where you asked it — no separate forum to dig through.",
  },
  {
    icon: FaInfinity,
    title: "Lifetime access",
    body: "Once you enroll, the course is yours. No recurring charges, no expiring subscription.",
  },
  {
    icon: FaStar,
    title: "Reviews from real students",
    body: "Ratings and feedback only come from people who've actually enrolled in the course being reviewed.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
            About
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-ink mb-6 leading-tight">
            A ledger for what you learn.
          </h1>
          <p className="text-ink/70 text-lg leading-relaxed">
            Ledger is a learning platform built around one idea: every course,
            enrollment, and review should be a real, permanent record — not a
            number that resets or a review nobody can verify. What you build
            here stays here.
          </p>
        </Reveal>
      </section>

      {/* Why learn here */}
      <section className="border-y border-ink/10 bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Reveal>
            <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
              Why learn here
            </p>
            <h2 className="font-display text-3xl text-ink mb-10">
              What you get with every course.
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delayMs={i * 100}>
                  <div className="flex gap-4">
                    <div className="w-11 h-11 rounded-full bg-ledger/10 border border-ledger/30 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-ink mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-ink/60 leading-relaxed">
                        {feature.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <p className="font-mono text-xs tracking-widest uppercase text-gold mb-3">
            How it's run
          </p>
          <h2 className="font-display text-3xl text-ink mb-10">
            A few things we hold to.
          </h2>
        </Reveal>
        <div className="grid sm:grid-cols-3 gap-10">
          {principles.map((p, i) => (
            <Reveal key={p.title} delayMs={i * 120}>
              <div className="group">
                <h3 className="font-display text-xl text-ink mb-2 transition-colors group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="text-ink/60 leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
