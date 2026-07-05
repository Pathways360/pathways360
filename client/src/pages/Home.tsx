import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import Footer from "@/components/Footer";
import {
  Heart, MapPin, Star, Users, Shield, Sparkles,
  ArrowRight, CheckCircle, Phone, Calendar, Target,
  MessageCircle, BookOpen, Award, Zap, TrendingUp, Lock
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const PROVIDER_FEATURES = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "One Client. One Plan.",
    desc: "All providers see the same client record. No duplication. No confusion. Complete coordination.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Real-Time Communication",
    desc: "Secure messaging between DHS, Probation, Healthcare, and community partners. Instant updates.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Unified Scheduling",
    desc: "Coordinate appointments across agencies. No conflicts. Automated SMS reminders.",
    color: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Real-Time Outcomes",
    desc: "Track progress, milestones, and compliance across all agencies on one dashboard.",
    color: "bg-brand-rose/10 text-brand-rose",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Alerts",
    desc: "SMS and push notifications for appointments, court dates, medication reminders, and milestones.",
    color: "bg-brand-teal/10 text-brand-teal",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "HIPAA-Ready & Secure",
    desc: "Role-based access control. Audit trails. Enterprise-grade security for sensitive data.",
    color: "bg-brand-amber/10 text-brand-amber",
  },
];

const AGENCIES = [
  "Shasta County DHS",
  "Probation Departments",
  "Healthcare Providers",
  "Behavioral Health",
  "ECM Providers",
  "Community Partners",
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
              Multi-Agency Care Coordination Platform
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-4">
              Connected Care. Stronger Outcomes.
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-8 max-w-2xl leading-relaxed">
              Pathways 360 connects your team, your agencies, and the people you serve. One client. One plan. Real-time coordination. Better lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gradient-warm text-foreground font-semibold border-0 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "mailto:hello@pathways360.com"}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14"
              >
                <Phone className="w-5 h-5 mr-2" />
                Request Demo
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
              HIPAA Ready
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-teal-light" />
              Real-Time Data
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-teal-light" />
              Multi-Agency
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-rose" />
              Instant Alerts
            </div>
          </div>
        </div>
      </section>

      {/* ── Who We Serve ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Multi-Agency Collaboration
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pathways 360 connects all the agencies and providers working to improve lives.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {AGENCIES.map((item, i) => (
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
              Powerful Tools for Care Coordination
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything your team needs to coordinate care, reduce duplication, and improve outcomes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROVIDER_FEATURES.map((f, i) => (
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

      {/* ── ROI Section ─────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Measurable Impact
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pathways 360 delivers real results for agencies and the people you serve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "40%", label: "Reduction in No-Shows", icon: <CheckCircle /> },
              { metric: "60%", label: "Less Administrative Time", icon: <Zap /> },
              { metric: "85%", label: "Improved Compliance", icon: <TrendingUp /> },
              { metric: "92%", label: "User Satisfaction", icon: <Star /> },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-2xl p-8 border border-border text-center card-hover">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-brand-teal/10 text-brand-teal">
                  {item.icon}
                </div>
                <p className="font-display text-3xl font-bold text-brand-teal mb-2">{item.metric}</p>
                <p className="text-muted-foreground text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              How Pathways 360 Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                num: "1",
                title: "One Client Record",
                desc: "All providers access the same real-time client profile. No duplicate data entry. No information silos.",
              },
              {
                num: "2",
                title: "Coordinated Care",
                desc: "DHS, Probation, Healthcare, and community partners communicate securely. Instant updates. Shared goals.",
              },
              {
                num: "3",
                title: "Better Outcomes",
                desc: "Reduced no-shows, improved compliance, faster progress. Real-time dashboards show what's working.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-card rounded-2xl p-8 border border-border text-center">
                  <div className="w-12 h-12 rounded-full gradient-brand text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {item.num}
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-brand-teal to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="gradient-hero text-white py-20">
        <div className="container text-center">
          <Award className="w-12 h-12 text-brand-amber mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Care Coordination?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join Shasta County and agencies nationwide using Pathways 360 to deliver better outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="gradient-warm text-foreground font-semibold border-0 px-8 h-14"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = "mailto:hello@pathways360.com"}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 h-14"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
