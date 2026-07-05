import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Target, Shield, Sparkles, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import Footer from "@/components/Footer";

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src="/manus-storage/ChatGPTImageJul4,2026,02_27_01PM_4abfa799.png" alt="Pathways 360" className="h-12 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button size="sm" onClick={() => navigate("/")} className="gradient-brand text-white border-0">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            About Pathways 360
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're building the future of multi-agency care coordination—where every person rebuilding their life has access to coordinated support, real-time information, and a path forward.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-muted-foreground">
              Pathways 360 connects clients with resources, providers, and coordinated support for life restoration. We believe that no one should have to navigate the system alone.
            </p>
            <p className="text-muted-foreground">
              Our platform enables multi-agency collaboration while respecting individual privacy, consent, and autonomy. Every person deserves a coordinated care team working toward their goals.
            </p>
          </div>
          <div className="bg-gradient-to-br from-brand-teal/10 to-brand-amber/10 rounded-lg p-8 flex items-center justify-center min-h-80">
            <Heart className="w-24 h-24 text-brand-teal/30" />
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-teal" />
                  Dignity & Respect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Every person deserves to be treated with dignity. We center the voices and choices of those we serve.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-amber" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Siloed systems fail people. We enable seamless coordination across agencies, with consent and transparency.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-green" />
                  Privacy First
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Your data is yours. Role-based access and consent controls ensure information is shared appropriately.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground text-center">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-teal" />
                  Resource Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Find shelters, food banks, legal aid, recovery programs, and more—filtered by location and needs.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-brand-amber" />
                  Personalized Care Plans
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Work with your care team to build a step-by-step life restoration plan tailored to your situation.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-green" />
                  AI Life Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Get daily encouragement, goal tracking, and guidance from your personalized AI coach.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-rose" />
                  Multi-Agency Coordination
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Your providers see the same timeline, reducing duplication and ensuring coordinated care.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-brand-teal to-brand-green rounded-lg p-12 text-center text-white space-y-4">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of people rebuilding their lives with coordinated support and real resources.
          </p>
          <Button size="lg" className="bg-white text-brand-teal hover:bg-white/90" onClick={() => navigate("/")}>
            Start Your Journey Free
          </Button>
        </section>
      </div>

      <Footer />
    </div>
  );
}
