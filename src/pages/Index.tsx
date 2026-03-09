import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Search, AlertTriangle, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Search,
    title: "AI-Powered Analysis",
    desc: "Paste any internship offer and our AI evaluates it for red flags, scam patterns, and legitimacy.",
  },
  {
    icon: AlertTriangle,
    title: "Report Scams",
    desc: "Help other students by reporting fraudulent internship offers you've encountered.",
  },
  {
    icon: Users,
    title: "Community Database",
    desc: "Browse reported scams to check if an offer has already been flagged by other students.",
  },
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(348_83%_47%/0.08),transparent_60%)]" />
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Don't Fall for{" "}
              <span className="text-gradient">Fake Internships</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              ScamShield uses AI to analyze internship offers and detect scam patterns. 
              Protect yourself and help others by reporting fraudulent postings.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/analyze">
                <Button variant="hero" size="lg">
                  <Search className="mr-2 h-5 w-5" />
                  Analyze an Offer
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="outline" size="lg">
                  Browse Reports
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-xl border bg-card p-6 card-shadow"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary/5 py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold">Spotted a Scam?</h2>
          <p className="mt-2 text-muted-foreground">
            Report it so other students don't fall victim.
          </p>
          <Link to="/report">
            <Button variant="hero" size="lg" className="mt-6">
              Report a Scam
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
