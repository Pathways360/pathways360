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
  Download, FileText, X
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "food_banks", label: "Food Banks" },
  { id: "daily_meals", label: "Daily Meals" },
  { id: "clothing", label: "Clothing Closets" },
  { id: "laundry", label: "Laundry Services" },
  { id: "shelter", label: "Shelter" },
  { id: "detox", label: "Detox" },
  { id: "outpatient_treatment", label: "Outpatient Treatment" },
  { id: "inpatient_treatment", label: "Inpatient Treatment" },
  { id: "mat", label: "MAT Providers" },
  { id: "mental_health", label: "Mental Health" },
  { id: "probation_support", label: "Probation Support" },
  { id: "cps_support", label: "CPS/CFS Support" },
  { id: "court_support", label: "Court Support" },
  { id: "transportation", label: "Transportation" },
  { id: "employment", label: "Employment" },
  { id: "id_help", label: "ID/Document Help" },
  { id: "medical_care", label: "Medical Care" },
  { id: "emergency_services", label: "Emergency Services" },
];

const URGENCY_LEVELS = [
  { id: "all", label: "All Urgency Levels" },
  { id: "emergency", label: "Emergency (Immediate)" },
  { id: "urgent", label: "Urgent (Within 24 hours)" },
  { id: "standard", label: "Standard (1-7 days)" },
  { id: "routine", label: "Routine (Flexible)" },
];

const NEED_TYPES = [
  { id: "all", label: "All Need Types" },
  { id: "basic_needs", label: "Basic Needs" },
  { id: "housing", label: "Housing" },
  { id: "health", label: "Health & Medical" },
  { id: "mental_health", label: "Mental Health" },
  { id: "substance_use", label: "Substance Use" },
  { id: "legal", label: "Legal" },
  { id: "employment", label: "Employment" },
  { id: "family", label: "Family Services" },
  { id: "documentation", label: "Documentation" },
  { id: "transportation", label: "Transportation" },
  { id: "financial", label: "Financial Assistance" },
];

const COUNTIES = [
  "Butte", "Shasta", "Trinity", "Tehama", "Humboldt", "Siskiyou", "Other"
];

const DEMO_RESOURCES = [
  { id: 1, name: "City Rescue Mission", category: "shelter", description: "Emergency shelter, meals, and recovery programs for men, women, and families.", address: "123 Main St", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0001", hours: "24/7 emergency intake", urgency: "emergency", needType: "basic_needs", walkInsWelcome: true, appointmentRequired: false, eligibility: "Anyone in need", website: "", lat: 39.7285, lng: -121.8375 },
  { id: 2, name: "Community Food Bank", category: "food_banks", description: "Free groceries and hot meals. No ID required. Serving all community members.", address: "456 Oak Ave", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0002", hours: "Mon-Fri 9am-4pm, Sat 9am-12pm", urgency: "standard", needType: "basic_needs", walkInsWelcome: true, appointmentRequired: false, eligibility: "Open to all", website: "", lat: 39.7300, lng: -121.8400 },
  { id: 3, name: "Community Health Clinic", category: "medical_care", description: "Free and low-cost medical care on a sliding scale. Uninsured patients welcome.", address: "789 Health Blvd", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0003", hours: "Mon-Fri 8am-5pm", urgency: "standard", needType: "health", walkInsWelcome: true, appointmentRequired: false, eligibility: "Uninsured or underinsured", website: "", lat: 39.7250, lng: -121.8450 },
  { id: 4, name: "Recovery House Network", category: "inpatient_treatment", description: "Sober living homes and outpatient recovery support. AA/NA meetings on-site.", address: "321 Hope Lane", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0004", hours: "Call for intake hours", urgency: "urgent", needType: "substance_use", walkInsWelcome: false, appointmentRequired: true, eligibility: "Adults in recovery", website: "", lat: 39.7320, lng: -121.8350 },
  { id: 5, name: "Legal Aid Society", category: "court_support", description: "Free legal help for low-income individuals. Housing, family, and criminal record expungement.", address: "654 Justice Ave", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0005", hours: "Mon-Fri 9am-3pm", urgency: "standard", needType: "legal", walkInsWelcome: false, appointmentRequired: true, eligibility: "Income-based eligibility", website: "", lat: 39.7200, lng: -121.8500 },
  { id: 6, name: "Workforce Development Center", category: "employment", description: "Job training, resume help, interview coaching, and job placement assistance.", address: "987 Career St", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0006", hours: "Mon-Fri 8am-5pm", urgency: "routine", needType: "employment", walkInsWelcome: true, appointmentRequired: false, eligibility: "Adults seeking employment", website: "", lat: 39.7270, lng: -121.8380 },
  { id: 7, name: "Mental Health Crisis Line", category: "mental_health", description: "24/7 crisis support, counseling referrals, and mental health resources. Call or text 988.", address: "Online & Phone", city: "Statewide", state: "CA", zipCode: "", county: "Statewide", phone: "988", hours: "24/7", urgency: "emergency", needType: "mental_health", walkInsWelcome: false, appointmentRequired: false, eligibility: "Anyone in crisis", website: "https://988lifeline.org", lat: 39.7290, lng: -121.8360 },
  { id: 8, name: "Probation Support Services", category: "probation_support", description: "Support for individuals on probation or parole. Compliance monitoring and resource navigation.", address: "111 Justice Plaza", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0008", hours: "Mon-Fri 8am-4pm", urgency: "urgent", needType: "legal", walkInsWelcome: true, appointmentRequired: false, eligibility: "Probation/Parole clients", website: "", lat: 39.7240, lng: -121.8420 },
  { id: 9, name: "MAT Provider Clinic", category: "mat", description: "Medication-assisted treatment for opioid use disorder. Methadone and buprenorphine available.", address: "222 Recovery Way", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0009", hours: "Mon-Fri 8am-5pm, Sat 9am-1pm", urgency: "urgent", needType: "substance_use", walkInsWelcome: false, appointmentRequired: true, eligibility: "Opioid use disorder diagnosis", website: "", lat: 39.7310, lng: -121.8330 },
  { id: 10, name: "Transit Assistance Program", category: "transportation", description: "Free or reduced-fare bus passes for medical appointments, job interviews, and essential travel.", address: "333 Transit Plaza", city: "Chico", state: "CA", zipCode: "95926", county: "Butte", phone: "(555) 100-0010", hours: "Mon-Fri 9am-4pm", urgency: "routine", needType: "transportation", walkInsWelcome: true, appointmentRequired: false, eligibility: "Low-income individuals", website: "", lat: 39.7260, lng: -121.8410 },
];

type Resource = typeof DEMO_RESOURCES[0];

export default function Resources() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedNeedType, setSelectedNeedType] = useState("all");
  const [downloading, setDownloading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<any[]>([]);

  // Get unique cities from resources
  const cities = Array.from(new Set(DEMO_RESOURCES.map(r => r.city))).sort();

  // Filter resources based on all criteria
  const filtered = DEMO_RESOURCES.filter((r: any) => {
    if (selectedCounty !== "all" && r.county !== selectedCounty) return false;
    if (selectedCity !== "all" && r.city !== selectedCity) return false;
    if (selectedCategory !== "all" && r.category !== selectedCategory) return false;
    if (selectedUrgency !== "all" && r.urgency !== selectedUrgency) return false;
    if (selectedNeedType !== "all" && r.needType !== selectedNeedType) return false;
    if (search) {
      const s = search.toLowerCase();
      return r.name.toLowerCase().includes(s) || (r.description || "").toLowerCase().includes(s) || (r.city || "").toLowerCase().includes(s);
    }
    return true;
  });

  function downloadResourceGuide() {
    setDownloading(true);
    const resourcesToExport = filtered.slice(0, 50);
    const lines: string[] = [];
    lines.push("PATHWAYS 360 — COMMUNITY RESOURCE GUIDE");
    lines.push("You don't have to walk alone.");
    lines.push("");
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push(`Filters: County: ${selectedCounty === "all" ? "All" : selectedCounty} | City: ${selectedCity || "All"} | Category: ${selectedCategory === "all" ? "All" : CATEGORIES.find(c => c.id === selectedCategory)?.label}`);
    lines.push("");
    lines.push(`${resourcesToExport.length} resources found`);
    lines.push("=".repeat(70));
    lines.push("");
    resourcesToExport.forEach((r: any, i: number) => {
      lines.push(`${i + 1}. ${r.name}`);
      lines.push(`   Category: ${CATEGORIES.find(c => c.id === r.category)?.label || r.category}`);
      lines.push(`   Urgency: ${URGENCY_LEVELS.find(u => u.id === r.urgency)?.label || r.urgency}`);
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
    lines.push("=".repeat(70));
    lines.push("CRISIS RESOURCES (Always Available)");
    lines.push("988 Suicide & Crisis Lifeline: Call or text 988");
    lines.push("Crisis Text Line: Text HOME to 741741");
    lines.push("National DV Hotline: 1-800-799-7233");
    lines.push("211 Helpline: Call 211 for local resources");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Pathways360-Resources-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="font-bold text-xl leading-tight">Resource Navigator</h1>
              <p className="text-sm text-gray-500">Find help in your community by county, city, category, and urgency</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0 text-xs border-teal-300 text-teal-700 hover:bg-teal-50" onClick={downloadResourceGuide} disabled={downloading}>
              <Download className="w-4 h-4 mr-1" />{downloading ? "Saving..." : "Save Guide"}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Search by name, description, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Row 1: County, City, Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">County</label>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select county" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">City</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Row 2: Urgency, Need Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Urgency Level</label>
            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                {URGENCY_LEVELS.map(u => <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Need Type</label>
            <Select value={selectedNeedType} onValueChange={setSelectedNeedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select need type" />
              </SelectTrigger>
              <SelectContent>
                {NEED_TYPES.map(n => <SelectItem key={n.id} value={n.id}>{n.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedCounty !== "all" || selectedCity || selectedCategory !== "all" || selectedUrgency !== "all" || selectedNeedType !== "all" || search) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-600 font-medium">Active Filters:</span>
            {selectedCounty !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCounty}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCounty("all")} />
              </Badge>
            )}
            {selectedCity && (
              <Badge variant="secondary" className="gap-1">
                {selectedCity}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCity("")} />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
              </Badge>
            )}
            {selectedUrgency !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {URGENCY_LEVELS.find(u => u.id === selectedUrgency)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedUrgency("all")} />
              </Badge>
            )}
            {selectedNeedType !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {NEED_TYPES.find(n => n.id === selectedNeedType)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedNeedType("all")} />
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 font-medium">
          Found <span className="text-teal-600 font-bold">{filtered.length}</span> resource{filtered.length !== 1 ? "s" : ""} matching your search
        </div>

        {/* Resource List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No resources found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map(resource => (
              <Card key={resource.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{resource.city}, {resource.county}</p>
                    </div>
                    <Badge className={`${resource.urgency === "emergency" ? "bg-red-100 text-red-700" : resource.urgency === "urgent" ? "bg-orange-100 text-orange-700" : resource.urgency === "standard" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"} whitespace-nowrap`}>
                      {URGENCY_LEVELS.find(u => u.id === resource.urgency)?.label.split("(")[0].trim()}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700">{resource.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORIES.find(c => c.id === resource.category)?.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {NEED_TYPES.find(n => n.id === resource.needType)?.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    {resource.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{resource.address}</span>
                      </div>
                    )}
                    {resource.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={`tel:${resource.phone}`} className="text-teal-600 font-medium hover:underline">{resource.phone}</a>
                      </div>
                    )}
                    {resource.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        <span>{resource.hours}</span>
                      </div>
                    )}
                    {resource.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                        <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium hover:underline">Website</a>
                      </div>
                    )}
                  </div>

                  {resource.eligibility && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                      <p className="text-xs text-teal-700"><strong>Eligibility:</strong> {resource.eligibility}</p>
                    </div>
                  )}

                  <div className="flex gap-2 text-xs">
                    {resource.walkInsWelcome && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />Walk-ins Welcome
                      </Badge>
                    )}
                    {resource.appointmentRequired && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Info className="w-3 h-3 mr-1" />Appointment Required
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
