import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { MapView } from "@/components/Map";
import {
  ArrowLeft, Search, MapPin, Phone, Clock, Globe, ChevronRight,
  Home, Utensils, Heart, Scale, RefreshCw, Briefcase, Car, BookOpen,
  DollarSign, Users, Shield, Baby, Star, Map, List, Building2,
  Stethoscope, Brain, Pill, GraduationCap, Truck, HandHeart,
  Church, Library, Shirt, Zap, AlertTriangle, Eye, Smile,
  Baby as BabyIcon, TreePine, UserCheck, Info, CheckCircle, XCircle,
  Download, FileText
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All", icon: <Star className="w-3 h-3" /> },
  { id: "emergency_shelter", label: "Emergency Shelter", icon: <Home className="w-3 h-3" /> },
  { id: "housing_programs", label: "Housing Programs", icon: <Building2 className="w-3 h-3" /> },
  { id: "transitional_housing", label: "Transitional Housing", icon: <Home className="w-3 h-3" /> },
  { id: "recovery_housing", label: "Recovery Housing", icon: <RefreshCw className="w-3 h-3" /> },
  { id: "food_banks", label: "Food Banks", icon: <Utensils className="w-3 h-3" /> },
  { id: "community_meals", label: "Community Meals", icon: <Utensils className="w-3 h-3" /> },
  { id: "medical", label: "Medical Clinics", icon: <Stethoscope className="w-3 h-3" /> },
  { id: "behavioral_health", label: "Behavioral Health", icon: <Brain className="w-3 h-3" /> },
  { id: "substance_use", label: "Substance Use Treatment", icon: <RefreshCw className="w-3 h-3" /> },
  { id: "mat", label: "Medication Assisted Treatment", icon: <Pill className="w-3 h-3" /> },
  { id: "employment", label: "Employment Services", icon: <Briefcase className="w-3 h-3" /> },
  { id: "job_centers", label: "Job Centers", icon: <Briefcase className="w-3 h-3" /> },
  { id: "dmv", label: "DMV", icon: <Car className="w-3 h-3" /> },
  { id: "social_security", label: "Social Security", icon: <DollarSign className="w-3 h-3" /> },
  { id: "county_benefits", label: "County Benefits", icon: <Building2 className="w-3 h-3" /> },
  { id: "legal", label: "Legal Aid", icon: <Scale className="w-3 h-3" /> },
  { id: "probation", label: "Probation", icon: <UserCheck className="w-3 h-3" /> },
  { id: "parole", label: "Parole", icon: <UserCheck className="w-3 h-3" /> },
  { id: "veterans", label: "Veteran Services", icon: <Star className="w-3 h-3" /> },
  { id: "transportation", label: "Transportation", icon: <Truck className="w-3 h-3" /> },
  { id: "childcare", label: "Childcare", icon: <BabyIcon className="w-3 h-3" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="w-3 h-3" /> },
  { id: "peer_support", label: "Peer Support", icon: <HandHeart className="w-3 h-3" /> },
  { id: "support_groups", label: "Support Groups", icon: <Users className="w-3 h-3" /> },
  { id: "libraries", label: "Libraries", icon: <Library className="w-3 h-3" /> },
  { id: "clothing", label: "Clothing Closets", icon: <Shirt className="w-3 h-3" /> },
  { id: "emergency_assistance", label: "Emergency Assistance", icon: <AlertTriangle className="w-3 h-3" /> },
  { id: "financial", label: "Financial Help", icon: <DollarSign className="w-3 h-3" /> },
  { id: "utility_assistance", label: "Utility Assistance", icon: <Zap className="w-3 h-3" /> },
  { id: "domestic_violence", label: "Domestic Violence", icon: <Shield className="w-3 h-3" /> },
  { id: "youth", label: "Youth Programs", icon: <Baby className="w-3 h-3" /> },
  { id: "senior_services", label: "Senior Services", icon: <Heart className="w-3 h-3" /> },
  { id: "native_american", label: "Native American Services", icon: <TreePine className="w-3 h-3" /> },
  { id: "faith_based", label: "Faith Based Services", icon: <Church className="w-3 h-3" /> },
  { id: "community_centers", label: "Community Centers", icon: <Building2 className="w-3 h-3" /> },
  { id: "mental_health_crisis", label: "Mental Health Crisis", icon: <Brain className="w-3 h-3" /> },
  { id: "suicide_resources", label: "Suicide Resources", icon: <Heart className="w-3 h-3" /> },
  { id: "dental", label: "Dental", icon: <Smile className="w-3 h-3" /> },
  { id: "vision", label: "Vision", icon: <Eye className="w-3 h-3" /> },
  { id: "family_services", label: "Family Services", icon: <Users className="w-3 h-3" /> },
  { id: "pregnancy", label: "Pregnancy Services", icon: <Heart className="w-3 h-3" /> },
];

const CATEGORY_COLORS: Record<string, string> = {
  emergency_shelter: "bg-red-100 text-red-700",
  housing_programs: "bg-blue-100 text-blue-700",
  transitional_housing: "bg-blue-100 text-blue-700",
  recovery_housing: "bg-orange-100 text-orange-700",
  food_banks: "bg-green-100 text-green-700",
  community_meals: "bg-green-100 text-green-700",
  medical: "bg-rose-100 text-rose-700",
  behavioral_health: "bg-purple-100 text-purple-700",
  substance_use: "bg-orange-100 text-orange-700",
  mat: "bg-orange-100 text-orange-700",
  employment: "bg-emerald-100 text-emerald-700",
  job_centers: "bg-emerald-100 text-emerald-700",
  dmv: "bg-gray-100 text-gray-700",
  social_security: "bg-teal-100 text-teal-700",
  county_benefits: "bg-teal-100 text-teal-700",
  legal: "bg-violet-100 text-violet-700",
  probation: "bg-indigo-100 text-indigo-700",
  parole: "bg-indigo-100 text-indigo-700",
  veterans: "bg-amber-100 text-amber-700",
  transportation: "bg-cyan-100 text-cyan-700",
  childcare: "bg-pink-100 text-pink-700",
  education: "bg-yellow-100 text-yellow-700",
  peer_support: "bg-lime-100 text-lime-700",
  support_groups: "bg-lime-100 text-lime-700",
  libraries: "bg-yellow-100 text-yellow-700",
  clothing: "bg-fuchsia-100 text-fuchsia-700",
  emergency_assistance: "bg-red-100 text-red-700",
  financial: "bg-teal-100 text-teal-700",
  utility_assistance: "bg-sky-100 text-sky-700",
  domestic_violence: "bg-pink-100 text-pink-700",
  youth: "bg-indigo-100 text-indigo-700",
  senior_services: "bg-amber-100 text-amber-700",
  native_american: "bg-orange-100 text-orange-700",
  faith_based: "bg-purple-100 text-purple-700",
  community_centers: "bg-blue-100 text-blue-700",
  mental_health_crisis: "bg-red-100 text-red-700",
  suicide_resources: "bg-red-100 text-red-700",
  dental: "bg-sky-100 text-sky-700",
  vision: "bg-sky-100 text-sky-700",
  family_services: "bg-rose-100 text-rose-700",
  pregnancy: "bg-pink-100 text-pink-700",
  shelter: "bg-blue-100 text-blue-700",
  food: "bg-green-100 text-green-700",
  mental_health: "bg-purple-100 text-purple-700",
  recovery: "bg-orange-100 text-orange-700",
  other: "bg-gray-100 text-gray-700",
};

const DEMO_RESOURCES = [
  { id: 1, name: "City Rescue Mission", category: "emergency_shelter", description: "Emergency shelter, meals, and recovery programs for men, women, and families.", address: "123 Main St", city: "Los Angeles", state: "CA", zipCode: "90012", county: "Los Angeles County", phone: "(555) 100-0001", hours: "24/7 emergency intake", walkInsWelcome: true, appointmentRequired: false, eligibility: "Anyone in need", website: "", lat: 34.0522, lng: -118.2437 },
  { id: 2, name: "Community Food Bank", category: "food_banks", description: "Free groceries and hot meals. No ID required. Serving all community members.", address: "456 Oak Ave", city: "Los Angeles", state: "CA", zipCode: "90012", county: "Los Angeles County", phone: "(555) 100-0002", hours: "Mon-Fri 9am-4pm, Sat 9am-12pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Open to all", website: "", lat: 34.0595, lng: -118.2353 },
  { id: 3, name: "Community Health Clinic", category: "medical", description: "Free and low-cost medical care on a sliding scale. Uninsured patients welcome.", address: "789 Health Blvd", city: "Los Angeles", state: "CA", zipCode: "90013", county: "Los Angeles County", phone: "(555) 100-0003", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Uninsured or underinsured", website: "", lat: 34.0480, lng: -118.2580 },
  { id: 4, name: "Recovery House Network", category: "recovery_housing", description: "Sober living homes and outpatient recovery support. AA/NA meetings on-site.", address: "321 Hope Lane", city: "Los Angeles", state: "CA", zipCode: "90014", county: "Los Angeles County", phone: "(555) 100-0004", hours: "Call for intake hours", walkInsWelcome: false, appointmentRequired: true, eligibility: "Adults in recovery", website: "", lat: 34.0650, lng: -118.2490 },
  { id: 5, name: "Legal Aid Society", category: "legal", description: "Free legal help for low-income individuals. Housing, family, and criminal record expungement.", address: "654 Justice Ave", city: "Los Angeles", state: "CA", zipCode: "90015", county: "Los Angeles County", phone: "(555) 100-0005", hours: "Mon-Fri 9am-3pm", walkInsWelcome: false, appointmentRequired: true, eligibility: "Income-based eligibility", website: "", lat: 34.0430, lng: -118.2670 },
  { id: 6, name: "Workforce Development Center", category: "employment", description: "Job training, resume help, interview coaching, and job placement assistance.", address: "987 Career St", city: "Los Angeles", state: "CA", zipCode: "90016", county: "Los Angeles County", phone: "(555) 100-0006", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Adults seeking employment", website: "", lat: 34.0560, lng: -118.2300 },
  { id: 7, name: "Mental Health Crisis Line", category: "mental_health_crisis", description: "24/7 crisis support, counseling referrals, and mental health resources. Call or text 988.", address: "Online & Phone", city: "Statewide", state: "CA", zipCode: "", county: "Statewide", phone: "988", hours: "24/7", walkInsWelcome: false, appointmentRequired: false, eligibility: "Anyone in crisis", website: "https://988lifeline.org", lat: 34.0700, lng: -118.2550 },
  { id: 8, name: "Veterans Services Office", category: "veterans", description: "Benefits assistance, housing support, healthcare enrollment, and peer support for veterans.", address: "111 Veterans Way", city: "Los Angeles", state: "CA", zipCode: "90017", county: "Los Angeles County", phone: "(555) 100-0008", hours: "Mon-Fri 8am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Veterans and their families", website: "", lat: 34.0390, lng: -118.2400 },
  { id: 9, name: "Safe Harbor DV Shelter", category: "domestic_violence", description: "Confidential emergency shelter, legal advocacy, and counseling for survivors of domestic violence.", address: "Confidential", city: "Los Angeles", state: "CA", zipCode: "90018", county: "Los Angeles County", phone: "(555) 100-0009", hours: "24/7 hotline", walkInsWelcome: false, appointmentRequired: false, eligibility: "Survivors of domestic violence", website: "", lat: 34.0620, lng: -118.2620 },
  { id: 10, name: "Transit Assistance Program", category: "transportation", description: "Free or reduced-fare bus passes for medical appointments, job interviews, and essential travel.", address: "222 Transit Plaza", city: "Los Angeles", state: "CA", zipCode: "90019", county: "Los Angeles County", phone: "(555) 100-0010", hours: "Mon-Fri 9am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Low-income individuals", website: "", lat: 34.0510, lng: -118.2510 },
  { id: 11, name: "County Benefits Office", category: "county_benefits", description: "Apply for CalFresh, Medi-Cal, General Relief, and other county assistance programs.", address: "333 County Center Dr", city: "Los Angeles", state: "CA", zipCode: "90020", county: "Los Angeles County", phone: "(555) 100-0011", hours: "Mon-Fri 8am-5pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Low-income residents", website: "", lat: 34.0540, lng: -118.2440 },
  { id: 12, name: "Social Security Administration", category: "social_security", description: "Apply for SSI, SSDI, and Social Security benefits. Disability determinations.", address: "444 Federal Plaza", city: "Los Angeles", state: "CA", zipCode: "90021", county: "Los Angeles County", phone: "1-800-772-1213", hours: "Mon-Fri 9am-4pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "All eligible applicants", website: "https://ssa.gov", lat: 34.0470, lng: -118.2560 },
  { id: 13, name: "Peer Support Network", category: "peer_support", description: "Peer mentors with lived experience in recovery, reentry, and homelessness. One-on-one and group support.", address: "555 Community Blvd", city: "Los Angeles", state: "CA", zipCode: "90022", county: "Los Angeles County", phone: "(555) 100-0013", hours: "Mon-Sat 9am-6pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Anyone seeking peer support", website: "", lat: 34.0580, lng: -118.2380 },
  { id: 14, name: "Faith Community Outreach", category: "faith_based", description: "Food pantry, clothing closet, emergency assistance, and spiritual support. All faiths welcome.", address: "666 Grace Ave", city: "Los Angeles", state: "CA", zipCode: "90023", county: "Los Angeles County", phone: "(555) 100-0014", hours: "Sun 10am-2pm, Wed 5pm-7pm", walkInsWelcome: true, appointmentRequired: false, eligibility: "Open to all", website: "", lat: 34.0610, lng: -118.2470 },
  { id: 15, name: "Dental Care Clinic", category: "dental", description: "Free and low-cost dental services including extractions, fillings, and cleanings.", address: "777 Smile St", city: "Los Angeles", state: "CA", zipCode: "90024", county: "Los Angeles County", phone: "(555) 100-0015", hours: "Tue-Thu 8am-4pm", walkInsWelcome: false, appointmentRequired: true, eligibility: "Uninsured or Medi-Cal", website: "", lat: 34.0490, lng: -118.2600 },
];

type Resource = typeof DEMO_RESOURCES[0];

const DEMO_ORG_DIRECTORY = [
  { id: 1, name: "City Rescue Mission", type: "Emergency Shelter", county: "Los Angeles County", city: "Los Angeles", state: "CA", phone: "(555) 100-0001", website: "", servicesOffered: "Emergency shelter, hot meals, recovery programs, case management", populationsServed: "Men, women, families, veterans", hoursOfOperation: "24/7 emergency intake", acceptingClients: true, hasWaitlist: false, closureNotice: null, specialEvents: "Free Thanksgiving meal Nov 28" },
  { id: 2, name: "Recovery House Network", type: "Recovery Housing", county: "Los Angeles County", city: "Los Angeles", state: "CA", phone: "(555) 100-0004", website: "", servicesOffered: "Sober living, outpatient support, AA/NA meetings, life skills", populationsServed: "Adults in recovery from substance use", hoursOfOperation: "Call for intake hours", acceptingClients: true, hasWaitlist: true, closureNotice: null, specialEvents: null },
  { id: 3, name: "Workforce Development Center", type: "Employment Services", county: "Los Angeles County", city: "Los Angeles", state: "CA", phone: "(555) 100-0006", website: "", servicesOffered: "Job training, resume help, interview coaching, job placement", populationsServed: "Adults seeking employment, reentry individuals", hoursOfOperation: "Mon-Fri 8am-5pm", acceptingClients: true, hasWaitlist: false, closureNotice: null, specialEvents: "Job fair every 1st Friday of the month" },
  { id: 4, name: "Legal Aid Society", type: "Legal Services", county: "Los Angeles County", city: "Los Angeles", state: "CA", phone: "(555) 100-0005", website: "", servicesOffered: "Housing law, family law, criminal record expungement, benefits appeals", populationsServed: "Low-income individuals and families", hoursOfOperation: "Mon-Fri 9am-3pm", acceptingClients: true, hasWaitlist: false, closureNotice: "Closed Dec 24-Jan 2", specialEvents: null },
];

export default function Resources() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [zipFilter, setZipFilter] = useState("");
  const [selected, setSelected] = useState<Resource | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map" | "directory">("list");
  const [orgSearch, setOrgSearch] = useState("");
  const [downloading, setDownloading] = useState(false);

  function downloadResourceGuide() {
    setDownloading(true);
    const resourcesToExport = filtered.slice(0, 50);
    const lines: string[] = [];
    lines.push("PATHWAYS 360 — COMMUNITY RESOURCE GUIDE");
    lines.push("You don't have to walk alone.");
    lines.push("");
    lines.push(`Generated: ${new Date().toLocaleDateString()} | Filter: ${category === "all" ? "All Categories" : getCategoryLabel(category)}${zipFilter ? ` | ZIP: ${zipFilter}` : ""}`);
    lines.push("");
    lines.push(`${resourcesToExport.length} resources found`);
    lines.push("=".repeat(60));
    lines.push("");
    resourcesToExport.forEach((r: any, i: number) => {
      lines.push(`${i + 1}. ${r.name}`);
      lines.push(`   Category: ${getCategoryLabel(r.category)}`);
      if (r.address) lines.push(`   Address: ${r.address}${r.city ? `, ${r.city}` : ""}${r.state ? `, ${r.state}` : ""}${r.zipCode ? ` ${r.zipCode}` : ""}`);
      if (r.phone) lines.push(`   Phone: ${r.phone}`);
      if (r.hours) lines.push(`   Hours: ${r.hours}`);
      if (r.description) lines.push(`   About: ${r.description}`);
      if (r.eligibility) lines.push(`   Eligibility: ${r.eligibility}`);
      if (r.walkInsWelcome) lines.push(`   Walk-ins: Welcome`);
      if (r.appointmentRequired) lines.push(`   Appointment: Required`);
      if (r.website) lines.push(`   Website: ${r.website}`);
      lines.push("");
    });
    lines.push("=".repeat(60));
    lines.push("CRISIS RESOURCES (Always Available)");
    lines.push("988 Suicide & Crisis Lifeline: Call or text 988");
    lines.push("Crisis Text Line: Text HOME to 741741");
    lines.push("National DV Hotline: 1-800-799-7233");
    lines.push("211 Helpline: Call 211 for local resources");
    lines.push("");
    lines.push("Pathways 360 — pathways360.app");
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pathways360-resource-guide${zipFilter ? `-${zipFilter}` : ""}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  }
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Live county resources from DB
  const { data: countyResourcesData = [] } = trpc.countyResources.list.useQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
  });
  const allResources = (countyResourcesData as any[]).map((r: any) => ({ ...r, lat: parseFloat(r.latitude || "40.5865"), lng: parseFloat(r.longitude || "-122.3917") }));

  const filtered = allResources.filter((r: any) => {
    if (category !== "all" && r.category !== category) return false;
    if (zipFilter && r.zipCode && !r.zipCode.startsWith(zipFilter)) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.name.toLowerCase().includes(s) || (r.description || "").toLowerCase().includes(s) || r.category.toLowerCase().includes(s) || (r.city || "").toLowerCase().includes(s);
    }
    return true;
  });

  const filteredOrgs = (countyResourcesData as any[]).filter((o: any) => {
    if (!orgSearch) return true;
    const s = orgSearch.toLowerCase();
    return o.name.toLowerCase().includes(s) || (o.category || "").toLowerCase().includes(s) || (o.description || "").toLowerCase().includes(s) || (o.county || "").toLowerCase().includes(s);
  });

  function handleMapReady(map: google.maps.Map) {
    mapRef.current = map;
    if (!window.google) return;
    infoWindowRef.current = new window.google.maps.InfoWindow();
    markersRef.current.forEach(m => (m as any).map = null);
    markersRef.current = [];
    filtered.forEach((r: any) => {
      if (!r.lat || !r.lng) return;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: r.lat, lng: r.lng },
        title: r.name,
      });
      marker.addListener("click", () => {
        setSelected(r);
        infoWindowRef.current?.setContent(`<div style="max-width:220px"><strong>${r.name}</strong><br/><span style="font-size:12px;color:#666">${r.address || ""}, ${r.city || ""}</span><br/><span style="font-size:12px">${r.phone || ""}</span></div>`);
        infoWindowRef.current?.open(map, marker);
      });
      markersRef.current.push(marker);
    });
  }

  const getCategoryColor = (cat: string) => CATEGORY_COLORS[cat] || "bg-gray-100 text-gray-700";
  const getCategoryLabel = (cat: string) => CATEGORIES.find(c => c.id === cat)?.label || cat;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg leading-tight">Resource Navigator</h1>
            <p className="text-xs text-gray-500">Find help in your community</p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 text-xs border-teal-300 text-teal-700 hover:bg-teal-50" onClick={downloadResourceGuide} disabled={downloading}>
            <Download className="w-3.5 h-3.5 mr-1" />{downloading ? "Saving..." : "Save Guide"}
          </Button>
        </div>
        {/* View Mode Tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-2 flex gap-1">
          {[
            { id: "list", label: "List", icon: <List className="w-3.5 h-3.5" /> },
            { id: "map", label: "Map", icon: <Map className="w-3.5 h-3.5" /> },
            { id: "directory", label: "Org Directory", icon: <Building2 className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${viewMode === tab.id ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">

        {/* ── ORGANIZATION DIRECTORY TAB ── */}
        {viewMode === "directory" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Search organizations, services, county..."
                value={orgSearch}
                onChange={e => setOrgSearch(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">{filteredOrgs.length} organizations in directory</p>
            {filteredOrgs.map(org => (
              <Card key={org.id} className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{org.name}</h3>
                      <p className="text-xs text-gray-500">{org.type} · {org.county}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${org.acceptingClients ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {org.acceptingClients ? "Accepting Clients" : "Not Accepting"}
                      </span>
                      {org.hasWaitlist && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Waitlist</span>}
                    </div>
                  </div>
                  {org.closureNotice && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <p className="text-xs text-red-700">{org.closureNotice}</p>
                    </div>
                  )}
                  {org.specialEvents && (
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                      <Star className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <p className="text-xs text-teal-700">{org.specialEvents}</p>
                    </div>
                  )}
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-start gap-2"><Users className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /><span><strong>Serves:</strong> {org.populationsServed}</span></div>
                    <div className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" /><span><strong>Services:</strong> {org.servicesOffered}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" /><span>{org.hoursOfOperation}</span></div>
                    <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0 text-gray-400" /><a href={`tel:${org.phone}`} className="text-teal-600 font-medium">{org.phone}</a></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── MAP TAB ── */}
        {viewMode === "map" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <input className="w-24 px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="ZIP" value={zipFilter} onChange={e => setZipFilter(e.target.value)} maxLength={5} />
            </div>
            <div className="rounded-2xl overflow-hidden border shadow-sm" style={{ height: 380 }}>
              <MapView onMapReady={handleMapReady} />
            </div>
            {selected && (
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                    <Badge className={`text-xs shrink-0 ${getCategoryColor(selected.category)}`}>{getCategoryLabel(selected.category)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{selected.description}</p>
                  <div className="space-y-1.5 text-xs text-gray-500">
                    {selected.address && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span>{selected.address}, {selected.city}, {selected.state}</span></div>}
                    {selected.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /><a href={`tel:${selected.phone}`} className="text-teal-600 font-medium">{selected.phone}</a></div>}
                    {selected.hours && <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /><span>{selected.hours}</span></div>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── LIST TAB ── */}
        {viewMode === "list" && (
          <div className="space-y-3">
            {/* Search + ZIP */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className="w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Search by name, service, city..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <input className="w-24 px-3 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="ZIP" value={zipFilter} onChange={e => setZipFilter(e.target.value)} maxLength={5} />
            </div>

            {/* Category pills — scrollable */}
            <div className="overflow-x-auto pb-1 -mx-4 px-4">
              <div className="flex gap-2 w-max">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${category === cat.id ? "bg-teal-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}
                  >
                    {cat.icon}{cat.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500">{filtered.length} resource{filtered.length !== 1 ? "s" : ""} found{zipFilter ? ` near ${zipFilter}` : ""}</p>

            {/* Resource Cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No resources found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different category or ZIP code</p>
              </div>
            ) : (
              filtered.map((r: any) => (
                <Card key={r.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(selected?.id === r.id ? null : r)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{r.name}</h3>
                      <Badge className={`text-xs shrink-0 ${getCategoryColor(r.category)}`}>{getCategoryLabel(r.category)}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {r.address && r.address !== "Confidential" && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.city}, {r.state}</span>}
                      {r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-1 text-teal-600 font-medium" onClick={e => e.stopPropagation()}><Phone className="w-3 h-3" />{r.phone}</a>}
                      {r.hours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.hours}</span>}
                    </div>
                    {selected?.id === r.id && (
                      <div className="mt-3 pt-3 border-t space-y-2 text-xs text-gray-600">
                        {r.eligibility && <p><strong>Eligibility:</strong> {r.eligibility}</p>}
                        <div className="flex gap-3">
                          {r.walkInsWelcome && <span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-3.5 h-3.5" />Walk-ins welcome</span>}
                          {r.appointmentRequired && <span className="flex items-center gap-1 text-amber-600"><Info className="w-3.5 h-3.5" />Appointment required</span>}
                        </div>
                        {r.website && <a href={r.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-teal-600"><Globe className="w-3.5 h-3.5" />Visit website</a>}
                        <Button size="sm" className="w-full mt-1 bg-teal-600 hover:bg-teal-700 text-white text-xs h-8" onClick={e => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${encodeURIComponent(r.address + " " + r.city + " " + r.state)}`, "_blank"); }}>
                          <MapPin className="w-3.5 h-3.5 mr-1" />Get Directions
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
