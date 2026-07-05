import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Footer from "@/components/Footer";
import {
  Heart, MapPin, Sparkles, ArrowRight, CheckCircle, Phone, Calendar,
  Target, MessageCircle, Award, Zap, TrendingUp, Lock, Users, Smile
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const FEATURES = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Your Personal AI Coach",
    desc: "A supportive coach who knows your story, celebrates your wins, and guides you through every step of your recovery journey.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Your Personal Recovery Plan",
    desc: "Build a step-by-step plan tailored to your unique situation. Track progress toward the life you're rebuilding.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Find Resources Near You",
    desc: "Discover shelters, food banks, recovery programs, legal aid, and community support—all filtered for your needs.",
    color: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Never Miss an Appointment",
    desc: "SMS reminders for court dates, medical appointments, and check-ins. Stay on track without the stress.",
    color: "bg-brand-rose/10 text-brand-rose",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "24/7 Support When You Need It",
    desc: "Talk to a compassionate AI counselor anytime. Get coping strategies, encouragement, and real support.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Your Support Network",
    desc: "Your case manager, probation officer, and healthcare providers all work together—with your permission—to support your recovery.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
];

const JOURNEYS = [
  "Experiencing homelessness",
  "In addiction recovery",
  "Rebuilding after incarceration",
  "Managing mental health",
  "Healing from trauma",
  "Aging out of foster care",
  "Starting over after loss",
  "Anyone ready to transform",
];

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/portal-redirect");
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
            <img src="/manus-storage/ChatGPTImageJul4,2026,02_27_01PM_4abfa799.png" alt="Pathways 360" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button size="sm" onClick={() => navigate("/portal-redirect")} className="gradient-brand text-white border-0 text-xs sm:text-sm">
                <span className="hidden sm:inline">Go to </span>Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm" onClick={() => window.location.href = getLoginUrl()}>
                  Sign In
                </Button>
                <Button size="sm" onClick={handleGetStarted} className="gradient-brand text-white border-0 text-xs sm:text-sm">
                  Start Free
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
              <Heart className="w-4 h-4 text-brand-amber" />
              Your Path to Real Help
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
              You're not alone on your journey.
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
              Pathways 360 connects you with trusted providers, real support, and the tools you need to rebuild your life. One step at a time. You've got this.
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
                Find Resources
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
              <Lock className="w-4 h-4 text-brand-teal-light" />
              100% Confidential
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal-light" />
              Always Free
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
              No matter what you're facing, Pathways 360 meets you exactly where you are with compassion and real support.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {JOURNEYS.map((item, i) => (
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
              Everything you need to move forward
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pathways 360 brings together support, resources, and tools that used to require a team of people—now available 24/7 in your pocket.
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

      {/* ── Your Coach ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Your Personal AI Coach
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                A coach who believes in you.
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Choose a coach with a name and face you trust. Every morning, they check in with encouragement, celebrate your wins, and help you stay focused on your goals. You're never alone.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Daily morning check-ins and encouragement",
                  "Personalized goal coaching",
                  "Milestone celebrations and rewards",
                  "Coping strategies when things get hard",
                  "24/7 support whenever you need it",
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
                      <p className="text-xs text-muted-foreground">Your Life Coach • Always Here</p>
                    </div>
                    <div className="ml-auto w-3 h-3 rounded-full bg-brand-green animate-pulse-soft" />
                  </div>
                  <div className="bg-secondary rounded-xl p-4 text-sm text-foreground leading-relaxed">
                    "Good morning! I'm proud of how far you've come. You have strength inside you that you might not see yet. Let's make today count. You've got this. 💪"
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 bg-brand-teal/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Goals</p>
                      <p className="font-bold text-brand-teal text-lg">3</p>
                    </div>
                    <div className="flex-1 bg-brand-amber/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="font-bold text-brand-amber text-lg">7</p>
                    </div>
                    <div className="flex-1 bg-brand-green/10 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Wins</p>
                      <p className="font-bold text-brand-green text-lg">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Milestones ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Celebrate Every Step Forward
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Recovery isn't about perfection—it's about progress. Every milestone matters.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: "Earn Certificates",
                desc: "Get recognized for your achievements. Share your wins with your support network.",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Track Progress",
                desc: "See how far you've come. Visual progress keeps you motivated and focused.",
              },
              {
                icon: <Smile className="w-8 h-8" />,
                title: "Celebrate Wins",
                desc: "Every goal completed, every day sober, every appointment kept—it all counts.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border text-center card-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-brand-teal/10 text-brand-teal">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Stories ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real People. Real Results.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                quote: "Pathways 360 gave me hope when I had none. My coach believed in me before I believed in myself.",
                name: "James",
                status: "6 months sober",
              },
              {
                quote: "I never missed an appointment again. The reminders kept me accountable and on track.",
                name: "Maria",
                status: "Completed probation early",
              },
              {
                quote: "Having my case manager, probation officer, and doctor all on the same page changed everything.",
                name: "David",
                status: "Stable housing, new job",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 border border-border card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-brand-amber">★</span>
                  ))}
                </div>
                <p className="text-foreground italic mb-4">"{item.quote}"</p>
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-sm text-brand-teal">{item.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="gradient-hero text-white py-20">
        <div className="container text-center">
          <Heart className="w-12 h-12 text-brand-amber mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your journey starts here.
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            You deserve support, hope, and real tools to rebuild your life. Pathways 360 is here for you—completely free, completely confidential.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="gradient-warm text-foreground font-semibold border-0 px-8 h-14"
          >
            Start Your Free Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
