import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import {
  ArrowLeft, Search, MapPin, Phone, Globe, Clock,
  Home, Utensils, Heart, Scale, RefreshCw, Briefcase,
  Car, BookOpen, DollarSign, Users, Shield, Baby, Star, Filter
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: <Star className="w-4 h-4" /> },
  { id: "shelter", label: "Shelter", icon: <Home className="w-4 h-4" /> },
  { id: "food", label: "Food", icon: <Utensils className="w-4 h-4" /> },
  { id: "medical", label: "Medical", icon: <Heart className="w-4 h-4" /> },
  { id: "mental_health", label: "Mental Health", icon: <Heart className="w-4 h-4" /> },
  { id: "recovery", label: "Recovery", icon: <RefreshCw className="w-4 h-4" /> },
  { id: "employment", label: "Jobs", icon: <Briefcase className="w-4 h-4" /> },
  { id: "legal", label: "Legal", icon: <Scale className="w-4 h-4" /> },
  { id: "transportation", label: "Transport", icon: <Car className="w-4 h-4" /> },
  { id: "education", label: "Education", icon: <BookOpen className="w-4 h-4" /> },
  { id: "financial", label: "Financial", icon: <DollarSign className="w-4 h-4" /> },
  { id: "family", label: "Family", icon: <Users className="w-4 h-4" /> },
  { id: "domestic_violence", label: "DV Support", icon: <Shield className="w-4 h-4" /> },
  { id: "youth", label: "Youth", icon: <Baby className="w-4 h-4" /> },
  { id: "veterans", label: "Veterans", icon: <Star className="w-4 h-4" /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  shelter: "bg-blue-100 text-blue-700",
  food: "bg-green-100 text-green-700",
  medical: "bg-red-100 text-red-700",
  mental_health: "bg-purple-100 text-purple-700",
  recovery: "bg-orange-100 text-orange-700",
  employment: "bg-emerald-100 text-emerald-700",
  legal: "bg-violet-100 text-violet-700",
  transportation: "bg-cyan-100 text-cyan-700",
  education: "bg-yellow-100 text-yellow-700",
  financial: "bg-teal-100 text-teal-700",
  family: "bg-rose-100 text-rose-700",
  domestic_violence: "bg-pink-100 text-pink-700",
  youth: "bg-indigo-100 text-indigo-700",
  veterans: "bg-amber-100 text-amber-700",
  clothing: "bg-lime-100 text-lime-700",
  hygiene: "bg-sky-100 text-sky-700",
  other: "bg-gray-100 text-gray-700",
};

// Sample resources for demo
const DEMO_RESOURCES = [
  { id: 1, name: "City Rescue Mission", category: "shelter", description: "Emergency shelter, meals, and recovery programs for men, women, and families.", address: "123 Main St", city: "Your City", phone: "(555) 100-0001", hours: "24/7 emergency intake", walkInsWelcome: true, appointmentRequired: false, eligibility: "Anyone in need", isActive: true },
  { id: 2, name: "Community Food Bank", category: "food", description: "Free groceries and hot meals. No ID required. Serving all community members.", address: "456 Oak Ave", city: "Your City", phone: "(555) 100-0002", hours: "Mon-Fri 9am-4pm, Sat 9am-12pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Open to all", isActive: true },
  { id: 3, name: "Community Health Clinic", category: "medical", description: "Free and low-cost medical care on a sliding scale. Uninsured patients welcome.", address: "789 Health Blvd", city: "Your City", phone: "(555) 100-0003", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Uninsured or underinsured", isActive: true },
  { id: 4, name: "Recovery House Network", category: "recovery", description: "Sober living homes and outpatient recovery support. AA/NA meetings on-site.", address: "321 Hope Lane", city: "Your City", phone: "(555) 100-0004", hours: "Call for intake hours", walkInsWelcome: false, appointmentRequired: true, eligibility: "Adults in recovery", isActive: true },
  { id: 5, name: "Legal Aid Society", category: "legal", description: "Free legal help for low-income individuals. Specializing in housing, family, and criminal record expungement.", address: "654 Justice Ave", city: "Your City", phone: "(555) 100-0005", hours: "Mon-Fri 9am-3pm", walkInsWelcome: false, appointmentRequired: true, eligibility: "Income-based eligibility", isActive: true },
  { id: 6, name: "Workforce Development Center", category: "employment", description: "Job training, resume help, interview coaching, and job placement assistance.", address: "987 Career St", city: "Your City", phone: "(555) 100-0006", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Adults seeking employment", isActive: true },
  { id: 7, name: "Mental Health Crisis Line", category: "mental_health", description: "24/7 crisis support, counseling referrals, and mental health resources. Call or text 988.", address: "Online & Phone", city: "Statewide", phone: "988", hours: "24/7", walkInsWelcome: false, appointmentRequired: false, eligibility: "Anyone in crisis", isActive: true },
  { id: 8, name: "Veterans Services Office", category: "veterans", description: "Benefits assistance, housing support, healthcare enrollment, and peer support for veterans.", address: "111 Veterans Way", city: "Your City", phone: "(555) 100-0008", hours: "Mon-Fri 8am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Veterans and their families", isActive: true },
  { id: 9, name: "Safe Harbor DV Shelter", category: "domestic_violence", description: "Confidential emergency shelter, legal advocacy, and counseling for survivors of domestic violence.", address: "Confidential", city: "Your City", phone: "(555) 100-0009", hours: "24/7 hotline", walkInsWelcome: false, appointmentRequired: false, eligibility: "Survivors of domestic violence", isActive: true },
  { id: 10, name: "Transit Assistance Program", category: "transportation", description: "Free or reduced-fare bus passes for medical appointments, job interviews, and essential travel.", address: "222 Transit Plaza", city: "Your City", phone: "(555) 100-0010", hours: "Mon-Fri 9am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Low-income individuals", isActive: true },
];

export default function Resources() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<typeof DEMO_RESOURCES[0] | null>(null);

  const filtered = DEMO_RESOURCES.filter(r => {
    if (category !== "all" && r.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s) || r.category.toLowerCase().includes(s);
    }
    return true;
  });

  if (selected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-hero text-white py-6 px-4">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg">{selected.name}</h1>
              <Badge className={`text-xs mt-1 ${CATEGORY_COLORS[selected.category] || ""}`}>{selected.category}</Badge>
            </div>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <p className="text-foreground">{selected.description}</p>
              <div className="space-y-3">
                {selected.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{selected.address}</p>
                      <p className="text-sm text-muted-foreground">{selected.city}</p>
                    </div>
                  </div>
                )}
                {selected.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-brand-teal flex-shrink-0" />
                    <a href={`tel:${selected.phone}`} className="text-sm font-medium text-brand-teal">{selected.phone}</a>
                  </div>
                )}
                {selected.hours && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{selected.hours}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {selected.walkInsWelcome && <Badge className="bg-brand-green/10 text-brand-green">Walk-ins Welcome</Badge>}
                {selected.appointmentRequired && <Badge className="bg-brand-amber/10 text-brand-amber">Appointment Required</Badge>}
              </div>
              {selected.eligibility && (
                <div className="bg-secondary/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">WHO CAN USE THIS</p>
                  <p className="text-sm text-foreground">{selected.eligibility}</p>
                </div>
              )}
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Button className="w-full gradient-brand text-white border-0">
                    <Phone className="w-4 h-4 mr-2" /> Call Now
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-white py-6 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl">Resources</h1>
              <p className="text-white/70 text-sm">Find help near you</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full bg-white/20 text-white placeholder-white/60 pl-9 pr-4 py-2.5 rounded-xl text-sm border border-white/20 focus:outline-none focus:border-white/50"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-2 px-4 py-3 max-w-lg mx-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                category === cat.id ? "bg-brand-teal text-white" : "bg-secondary text-muted-foreground hover:bg-brand-teal/10 hover:text-brand-teal"
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} resources found</p>
        <div className="space-y-3">
          {filtered.map(resource => (
            <Card key={resource.id} className="border border-border cursor-pointer hover:border-brand-teal/40 transition-all" onClick={() => setSelected(resource)}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                    {CATEGORIES.find(c => c.id === resource.category)?.icon || <Star className="w-5 h-5 text-brand-teal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground text-sm">{resource.name}</p>
                    </div>
                    <Badge className={`text-xs mb-1 ${CATEGORY_COLORS[resource.category] || ""}`}>{resource.category}</Badge>
                    <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      {resource.city && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" /> {resource.city}
                        </span>
                      )}
                      {resource.walkInsWelcome && <span className="text-xs text-brand-green font-medium">Walk-ins OK</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No resources found</p>
              <p className="text-sm text-muted-foreground">Try a different search or category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
