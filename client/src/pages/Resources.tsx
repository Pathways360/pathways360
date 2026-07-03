import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { MapView } from "@/components/Map";
import {
  ArrowLeft, Search, MapPin, Phone, Clock,
  Home, Utensils, Heart, Scale, RefreshCw, Briefcase,
  Car, BookOpen, DollarSign, Users, Shield, Baby, Star, Map, List
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
  other: "bg-gray-100 text-gray-700",
};

const DEMO_RESOURCES = [
  { id: 1, name: "City Rescue Mission", category: "shelter", description: "Emergency shelter, meals, and recovery programs for men, women, and families.", address: "123 Main St", city: "Los Angeles", state: "CA", phone: "(555) 100-0001", hours: "24/7 emergency intake", walkInsWelcome: true, appointmentRequired: false, eligibility: "Anyone in need", lat: 34.0522, lng: -118.2437 },
  { id: 2, name: "Community Food Bank", category: "food", description: "Free groceries and hot meals. No ID required. Serving all community members.", address: "456 Oak Ave", city: "Los Angeles", state: "CA", phone: "(555) 100-0002", hours: "Mon-Fri 9am-4pm, Sat 9am-12pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Open to all", lat: 34.0595, lng: -118.2353 },
  { id: 3, name: "Community Health Clinic", category: "medical", description: "Free and low-cost medical care on a sliding scale. Uninsured patients welcome.", address: "789 Health Blvd", city: "Los Angeles", state: "CA", phone: "(555) 100-0003", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Uninsured or underinsured", lat: 34.0480, lng: -118.2580 },
  { id: 4, name: "Recovery House Network", category: "recovery", description: "Sober living homes and outpatient recovery support. AA/NA meetings on-site.", address: "321 Hope Lane", city: "Los Angeles", state: "CA", phone: "(555) 100-0004", hours: "Call for intake hours", walkInsWelcome: false, appointmentRequired: true, eligibility: "Adults in recovery", lat: 34.0650, lng: -118.2490 },
  { id: 5, name: "Legal Aid Society", category: "legal", description: "Free legal help for low-income individuals. Specializing in housing, family, and criminal record expungement.", address: "654 Justice Ave", city: "Los Angeles", state: "CA", phone: "(555) 100-0005", hours: "Mon-Fri 9am-3pm", walkInsWelcome: false, appointmentRequired: true, eligibility: "Income-based eligibility", lat: 34.0430, lng: -118.2670 },
  { id: 6, name: "Workforce Development Center", category: "employment", description: "Job training, resume help, interview coaching, and job placement assistance.", address: "987 Career St", city: "Los Angeles", state: "CA", phone: "(555) 100-0006", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Adults seeking employment", lat: 34.0560, lng: -118.2300 },
  { id: 7, name: "Mental Health Crisis Line", category: "mental_health", description: "24/7 crisis support, counseling referrals, and mental health resources. Call or text 988.", address: "Online & Phone", city: "Statewide", state: "", phone: "988", hours: "24/7", walkInsWelcome: false, appointmentRequired: false, eligibility: "Anyone in crisis", lat: 34.0700, lng: -118.2550 },
  { id: 8, name: "Veterans Services Office", category: "veterans", description: "Benefits assistance, housing support, healthcare enrollment, and peer support for veterans.", address: "111 Veterans Way", city: "Los Angeles", state: "CA", phone: "(555) 100-0008", hours: "Mon-Fri 8am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Veterans and their families", lat: 34.0390, lng: -118.2400 },
  { id: 9, name: "Safe Harbor DV Shelter", category: "domestic_violence", description: "Confidential emergency shelter, legal advocacy, and counseling for survivors of domestic violence.", address: "Confidential", city: "Los Angeles", state: "CA", phone: "(555) 100-0009", hours: "24/7 hotline", walkInsWelcome: false, appointmentRequired: false, eligibility: "Survivors of domestic violence", lat: 34.0620, lng: -118.2620 },
  { id: 10, name: "Transit Assistance Program", category: "transportation", description: "Free or reduced-fare bus passes for medical appointments, job interviews, and essential travel.", address: "222 Transit Plaza", city: "Los Angeles", state: "CA", phone: "(555) 100-0010", hours: "Mon-Fri 9am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Low-income individuals", lat: 34.0510, lng: -118.2510 },
];

type Resource = typeof DEMO_RESOURCES[0];

export default function Resources() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Resource | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const filtered = DEMO_RESOURCES.filter(r => {
    if (category !== "all" && r.category !== category) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s) || r.category.toLowerCase().includes(s);
    }
    return true;
  });

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    // Place markers for all resources
    markersRef.current.forEach(m => (m.map = null));
    markersRef.current = [];

    filtered.forEach(resource => {
      if (!resource.lat || !resource.lng) return;

      const pin = document.createElement("div");
      pin.style.cssText = `
        background: #0d9488; color: white; border-radius: 50%; width: 32px; height: 32px;
        display: flex; align-items: center; justify-content: center; font-size: 14px;
        border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer;
      `;
      pin.textContent = "📍";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: resource.lat, lng: resource.lng },
        title: resource.name,
        content: pin,
      });

      marker.addListener("click", () => {
        const content = `
          <div style="max-width:240px; font-family: sans-serif; padding: 4px;">
            <p style="font-weight:700; font-size:14px; margin:0 0 4px 0; color:#0f172a">${resource.name}</p>
            <span style="background:#ccfbf1; color:#0d9488; padding:2px 8px; border-radius:999px; font-size:11px;">${resource.category}</span>
            <p style="font-size:12px; color:#64748b; margin:6px 0 4px 0;">${resource.description.slice(0, 80)}...</p>
            <p style="font-size:12px; color:#0d9488; font-weight:600; margin:0;">📞 ${resource.phone}</p>
          </div>
        `;
        infoWindowRef.current?.setContent(content);
        infoWindowRef.current?.open(map, marker);
        setSelected(resource);
      });

      markersRef.current.push(marker);
    });
  }, [filtered]);

  // Detail view
  if (selected && viewMode === "list") {
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
                      <p className="text-sm text-muted-foreground">{selected.city}{selected.state ? `, ${selected.state}` : ""}</p>
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
              {/* Mini map for this resource */}
              {selected.lat && selected.lng && (
                <div className="rounded-xl overflow-hidden border border-border">
                  <MapView
                    className="h-48"
                    initialCenter={{ lat: selected.lat, lng: selected.lng }}
                    initialZoom={15}
                    onMapReady={(map) => {
                      new google.maps.marker.AdvancedMarkerElement({
                        map,
                        position: { lat: selected.lat, lng: selected.lng },
                        title: selected.name,
                      });
                    }}
                  />
                </div>
              )}
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Button className="w-full gradient-brand text-white border-0">
                    <Phone className="w-4 h-4 mr-2" /> Call Now
                  </Button>
                </a>
              )}
              {selected.lat && selected.lng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" /> Get Directions
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-hero text-white py-6 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex-1">
              <h1 className="font-display font-bold text-xl">Resources</h1>
              <p className="text-white/70 text-sm">Find help near you</p>
            </div>
            {/* List / Map toggle */}
            <div className="flex items-center bg-white/20 rounded-lg p-1 gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === "list" ? "bg-white text-brand-teal" : "text-white/80 hover:text-white"}`}
              >
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${viewMode === "map" ? "bg-white text-brand-teal" : "text-white/80 hover:text-white"}`}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
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
      <div className="bg-white border-b border-border overflow-x-auto flex-shrink-0 scrollbar-hide">
        <div className="flex gap-2 px-4 py-3" style={{ minWidth: 'max-content' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                category === cat.id ? "bg-brand-teal text-white" : "bg-secondary text-muted-foreground hover:bg-brand-teal/10 hover:text-brand-teal"
              }`}
            >
              <span className="w-3.5 h-3.5 flex-shrink-0">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Map View */}
      {viewMode === "map" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative" style={{ minHeight: "60vh" }}>
            <MapView
              className="w-full h-full"
              initialCenter={{ lat: 34.0522, lng: -118.2437 }}
              initialZoom={12}
              onMapReady={handleMapReady}
            />
          </div>
          {/* Selected resource card at bottom of map */}
          {selected && (
            <div className="bg-white border-t border-border p-4 max-w-lg mx-auto w-full">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                  {CATEGORIES.find(c => c.id === selected.category)?.icon || <Star className="w-5 h-5 text-brand-teal" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{selected.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{selected.description}</p>
                  <div className="flex gap-2 mt-2">
                    <a href={`tel:${selected.phone}`}>
                      <Button size="sm" className="gradient-brand text-white border-0 h-7 text-xs">
                        <Phone className="w-3 h-3 mr-1" /> Call
                      </Button>
                    </a>
                    {selected.lat && selected.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          <MapPin className="w-3 h-3 mr-1" /> Directions
                        </Button>
                      </a>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto" onClick={() => setSelected(null)}>
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!selected && (
            <div className="bg-white border-t border-border p-3 text-center">
              <p className="text-xs text-muted-foreground">{filtered.length} resources shown — tap a pin to see details</p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="max-w-lg mx-auto px-4 py-4 w-full">
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} resources found</p>
          <div className="space-y-3">
            {filtered.map(resource => (
              <Card
                key={resource.id}
                className="border border-border cursor-pointer hover:border-brand-teal/40 transition-all"
                onClick={() => setSelected(resource)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center flex-shrink-0">
                      {CATEGORIES.find(c => c.id === resource.category)?.icon || <Star className="w-5 h-5 text-brand-teal" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{resource.name}</p>
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
      )}
    </div>
  );
}
