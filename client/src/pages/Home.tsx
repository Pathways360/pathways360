import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import {
  Heart, MapPin, Star, Users, Shield, Sparkles,
  ArrowRight, CheckCircle, Phone, Calendar, Target,
  MessageCircle, BookOpen, Award
} from "lucide-react";
import { useLocation } from "wouter";

const FEATURES = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Life Coach",
    desc: "A personalized coach with a name and face you choose — checking in on you every day with encouragement, goals, and guidance.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Your Personal Goal Plan",
    desc: "We build a step-by-step life restoration plan based on your unique situation — and walk you through every step.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Resource Navigator",
    desc: "Find shelters, food banks, legal aid, recovery programs, and more — filtered by your location and needs.",
    color: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Calendar & Reminders",
    desc: "Never miss a court date, appointment, or medication again. We remind you so you can focus on moving forward.",
    color: "bg-brand-rose/10 text-brand-rose",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "24/7 AI Counselor",
    desc: "Talk to a compassionate AI counselor any time of day or night — no judgment, just support and coping strategies.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Case Manager Portal",
    desc: "Probation officers, social workers, and pastors can connect with clients and coordinate support — with your consent.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
];

const WHO_WE_SERVE = [
  "People experiencing homelessness",
  "Individuals in addiction recovery",
  "Reentry after incarceration",
  "Mental health challenges",
  "Domestic violence survivors",
  "Veterans",
  "Foster youth aging out",
  "Anyone rebuilding their life",
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/ChatGPTImageJul4,2026,09_09_23AM_c0e57724.png" alt="Pathways 360" className="h-10 w-auto" />
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/dashboard")} className="gradient-brand text-white border-0 text-xs sm:text-sm">
                <span className="hidden sm:inline">Go to </span>Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm" onClick={() => window.location.href = getLoginUrl()}>
                  Sign In
                </Button>
                <Button size="sm" onClick={handleGetStarted} className="gradient-brand text-white border-0 text-xs sm:text-sm">
                  <span className="hidden sm:inline">Get Started </span>Free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-amber blur-3xl" />
        </div>
        <div className="container relative py-16 md:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              Your Personal Life Restoration Platform
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
              Coordinate Care. Improve Outcomes. Transform Lives.
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
              Multi-agency collaboration platform connecting clients with resources, providers, and coordinated support for life restoration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gradient-warm text-foreground font-semibold border-0 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
              >
                Start Your Journey Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/resources")}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Resources Near Me
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy text-white py-6">
        <div className="container">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-teal-light" />
              100% Confidential
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal-light" />
              Always Free for Users
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-teal-light" />
              Works on Any Phone
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-brand-rose" />
              No Judgment. Ever.
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for everyone rebuilding their life
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're facing one challenge or many, Pathways 360 meets you exactly where you are.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {WHO_WE_SERVE.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border animate-fade-in-up card-hover"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need. All in one place.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pathways 360 combines tools that used to require a team of professionals — now available 24/7 in your pocket.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coach Highlight ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Your Personal AI Life Coach
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A coach who looks like<br />someone you trust.
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Name your coach. Choose their face from our diverse library — or upload a photo of someone
                who inspires you. Your coach checks in every morning, celebrates your wins, and guides you
                through every step of your journey.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Daily morning check-ins and encouragement",
                  "Goal-based coaching conversations",
                  "Optional daily devotionals (opt-in)",
                  "Milestone celebrations and rewards",
                  "Coping strategies when things get hard",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground">
                    <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={handleGetStarted} className="gradient-brand text-white border-0">
                Meet Your Coach
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-brand-teal/20 to-brand-amber/20 rounded-3xl p-8">
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Marcus</p>
                      <p className="text-xs text-muted-foreground">Your Life Coach • Online</p>
                    </div>
                    <div className="ml-auto w-3 h-3 rounded-full bg-brand-green animate-pulse-soft" />
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-sm text-foreground leading-relaxed">
                    "Good morning! Today is a new day and I'm proud of how far you've come. 
                    You have one goal to complete today — let's make it happen together. 
                    You've got this. 💪"
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 bg-brand-teal/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Goals Active</p>
                      <p className="font-bold text-brand-teal text-lg">3</p>
                    </div>
                    <div className="flex-1 bg-brand-amber/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                      <p className="font-bold text-brand-amber text-lg">7</p>
                    </div>
                    <div className="flex-1 bg-brand-green/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="font-bold text-brand-green text-lg">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="gradient-hero text-white py-20">
        <div className="container text-center">
          <Award className="w-12 h-12 text-brand-amber mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your path forward starts today.
          </h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Join thousands of people using Pathways 360 to rebuild their lives — one step at a time.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="gradient-warm text-foreground font-semibold border-0 text-base px-10 h-14"
          >
            Get Started — It's Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-white/50 text-sm mt-4">No credit card. No cost. Just support.</p>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-brand-navy text-white/60 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-display font-bold text-white">Pathways 360</span>
            </div>
            <p className="text-sm text-center">
              <span className="text-white/80 font-medium">You don't have to walk alone.</span>
              {" "}© {new Date().getFullYear()} Pathways 360. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
