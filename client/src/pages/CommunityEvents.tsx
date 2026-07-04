import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Search, Filter, MapPin, Clock, Phone, Calendar,
  Utensils, Home, Heart, Briefcase, Star, AlertTriangle,
  Bus, Plus, CheckCircle, ExternalLink, Building2
} from "lucide-react";

const COUNTIES = [
  { value: "all", label: "All Counties" },
  { value: "butte", label: "Butte County" },
  { value: "shasta", label: "Shasta County" },
  { value: "humboldt", label: "Humboldt County" },
  { value: "tehama", label: "Tehama County" },
  { value: "trinity", label: "Trinity County" },
  { value: "siskiyou", label: "Siskiyou County" },
];

const CATEGORIES = [
  { value: "all", label: "All Categories", icon: Star },
  { value: "meals", label: "Meals & Food", icon: Utensils },
  { value: "shelter", label: "Shelter & Housing", icon: Home },
  { value: "medical", label: "Medical & Health", icon: Heart },
  { value: "employment", label: "Employment", icon: Briefcase },
  { value: "recovery", label: "Recovery & Support", icon: Star },
  { value: "legal", label: "Legal & Reentry", icon: AlertTriangle },
  { value: "transportation", label: "Transportation", icon: Bus },
  { value: "benefits", label: "Benefits & ID", icon: CheckCircle },
];

const CATEGORY_EVENT_TYPES: Record<string, string[]> = {
  meals: ["meal","food_distribution","food_bank","mobile_pantry"],
  shelter: ["emergency_shelter","winter_shelter","cooling_center","warming_center"],
  medical: ["mobile_medical","behavioral_health_outreach","medication_clinic","vaccination"],
  employment: ["job_fair","hiring_event","resume_workshop","training","community_college","education"],
  recovery: ["recovery_meeting","support_group","peer_support"],
  legal: ["legal_clinic","expungement_event","probation_outreach","parole_outreach"],
  transportation: ["bus_voucher","transportation"],
  benefits: ["resource_fair","dmv_outreach","disaster_assistance"],
};

const EVENT_TYPE_ICONS: Record<string, typeof Star> = {
  meal: Utensils, food_distribution: Utensils, food_bank: Utensils, mobile_pantry: Utensils,
  emergency_shelter: Home, winter_shelter: Home, cooling_center: Home, warming_center: Home,
  mobile_medical: Heart, behavioral_health_outreach: Heart, medication_clinic: Heart, vaccination: Heart,
  bus_voucher: Bus, transportation: Bus,
  job_fair: Briefcase, hiring_event: Briefcase, resume_workshop: Briefcase, training: Briefcase,
  recovery_meeting: Star, support_group: Star, peer_support: Star,
  probation_outreach: AlertTriangle, parole_outreach: AlertTriangle,
  resource_fair: Building2, dmv_outreach: CheckCircle, emergency_alert: AlertTriangle,
};

const CONFIDENCE_COLORS: Record<string, string> = {
  verified_today: "bg-green-100 text-green-800 border-green-200",
  verified_this_week: "bg-blue-100 text-blue-800 border-blue-200",
  verified_this_month: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending: "bg-gray-100 text-gray-600 border-gray-200",
  unverified: "bg-red-100 text-red-700 border-red-200",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  verified_today: "✓ Verified Today",
  verified_this_week: "✓ This Week",
  verified_this_month: "✓ This Month",
  pending: "Pending",
  unverified: "Unverified",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  meal: "Meal", food_distribution: "Food Distribution", food_bank: "Food Bank",
  mobile_pantry: "Mobile Pantry", emergency_shelter: "Emergency Shelter",
  winter_shelter: "Winter Shelter", cooling_center: "Cooling Center",
  warming_center: "Warming Center", mobile_medical: "Mobile Medical",
  behavioral_health_outreach: "Behavioral Health", medication_clinic: "Medication Clinic",
  vaccination: "Vaccination", clothing_closet: "Clothing Closet", laundry: "Laundry",
  shower_program: "Showers", bus_voucher: "Bus Vouchers", transportation: "Transportation",
  dmv_outreach: "DMV Outreach", legal_clinic: "Legal Clinic", expungement_event: "Expungement",
  job_fair: "Job Fair", hiring_event: "Hiring Event", resume_workshop: "Resume Workshop",
  training: "Training", community_college: "College", education: "Education",
  recovery_meeting: "Recovery Meeting", support_group: "Support Group",
  peer_support: "Peer Support", probation_outreach: "Probation Outreach",
  parole_outreach: "Parole Outreach", resource_fair: "Resource Fair",
  disaster_assistance: "Disaster Assistance", holiday_program: "Holiday Program",
  emergency_alert: "Emergency Alert", faith_based: "Faith-Based", veterans_event: "Veterans",
  native_american_services: "Native American Services", family_services: "Family Services",
  other: "Community Event",
};

function formatTime(t: string | null | undefined) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: string) {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  if (d === today) return "Today";
  if (d === tomorrow) return "Tomorrow";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function SubmitEventDialog({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", eventType: "meal", eventDate: "",
    startTime: "", endTime: "", county: "butte", city: "", address: "",
    locationName: "", organizationName: "", organizationPhone: "",
    needsCategories: "", isRecurring: false,
  });

  const submitMutation = trpc.communityEvents.submit.useMutation({
    onSuccess: () => {
      toast.success("Event submitted for review");
      setOpen(false);
      onSuccess();
    },
    onError: (e) => toast.error(e.message),
  });

  if (!user || user.role === "user") return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Submit Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Community Opportunity</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Free Lunch at Grace Church" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Event Type *</Label>
              <Select value={form.eventType} onValueChange={v => setForm(f => ({ ...f, eventType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(EVENT_TYPE_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>County *</Label>
              <Select value={form.county} onValueChange={v => setForm(f => ({ ...f, county: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTIES.filter(c => c.value !== "all").map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label>Date *</Label>
              <Input type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
            </div>
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" />
            </div>
            <div>
              <Label>Location Name</Label>
              <Input value={form.locationName} onChange={e => setForm(f => ({ ...f, locationName: e.target.value }))} placeholder="Building/venue name" />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Street address" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Organization</Label>
              <Input value={form.organizationName} onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))} placeholder="Org name" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.organizationPhone} onChange={e => setForm(f => ({ ...f, organizationPhone: e.target.value }))} placeholder="(xxx) xxx-xxxx" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What should people know before attending?" rows={3} />
          </div>
          <div>
            <Label>Needs Categories (comma-separated)</Label>
            <Input value={form.needsCategories} onChange={e => setForm(f => ({ ...f, needsCategories: e.target.value }))} placeholder="e.g., meals,shelter,medical" />
          </div>
          <Button
            className="w-full"
            onClick={() => submitMutation.mutate(form as any)}
            disabled={!form.title || !form.eventDate || submitMutation.isPending}
          >
            {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CommunityEvents() {
  const [county, setCounty] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("upcoming");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const { data: events = [], isLoading, refetch } = trpc.communityEvents.list.useQuery({
    county: county !== "all" ? county : undefined,
    upcoming: dateFilter === "upcoming",
    date: dateFilter === "today" ? new Date().toISOString().split("T")[0] : undefined,
    verifiedOnly: verifiedOnly || undefined,
    limit: 100,
  });

  const engageMutation = trpc.communityEvents.engage.useMutation({
    onSuccess: () => toast.success("Saved"),
  });

  const filtered = useMemo(() => {
    let result = [...events];
    if (category !== "all") {
      const types = CATEGORY_EVENT_TYPES[category] || [];
      result = result.filter(e => types.includes(e.eventType));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q) ||
        (e.organizationName || "").toLowerCase().includes(q) ||
        (e.city || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [events, category, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const e of filtered) {
      if (!map[e.eventDate]) map[e.eventDate] = [];
      map[e.eventDate].push(e);
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="container py-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Events</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time opportunities across Northern California</p>
        </div>
        <SubmitEventDialog onSuccess={() => refetch()} />
      </div>

      {/* Category Quick Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                category === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filters Row */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[160px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <Select value={county} onValueChange={setCounty}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today Only</SelectItem>
            <SelectItem value="upcoming">Next 7 Days</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => setVerifiedOnly(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
            verifiedOnly ? "bg-green-100 text-green-800 border-green-300" : "bg-background text-muted-foreground border-border hover:border-green-300"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" /> Verified Only
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="w-8 h-8 text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No events found matching your filters.</p>
            <p className="text-xs text-muted-foreground mt-1">Try changing the county, category, or date range.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, dayEvents]) => (
            <section key={date}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2">
                  {formatDate(date)}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-2">
                {dayEvents.map(event => {
                  const Icon = EVENT_TYPE_ICONS[event.eventType] || Star;
                  const confClass = CONFIDENCE_COLORS[event.confidenceLevel] || CONFIDENCE_COLORS.pending;
                  return (
                    <Card key={event.id} className={`border hover:shadow-md transition-shadow ${event.isFeatured ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${event.isFeatured ? "bg-primary/20" : "bg-muted"}`}>
                            <Icon className={`w-5 h-5 ${event.isFeatured ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm text-foreground leading-tight flex-1">{event.title}</h3>
                              <div className="flex gap-1.5 shrink-0">
                                {event.isFeatured && <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Featured</Badge>}
                                <Badge variant="outline" className={`text-xs ${confClass}`}>
                                  {CONFIDENCE_LABELS[event.confidenceLevel] || "Pending"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-1 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {event.county} County
                              </Badge>
                              {event.isRecurring && (
                                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Recurring</Badge>
                              )}
                            </div>
                            {event.description && (
                              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{event.description}</p>
                            )}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                              {(event.startTime || event.endTime) && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                                </span>
                              )}
                              {(event.locationName || event.address || event.city) && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.locationName || event.address || event.city}
                                </span>
                              )}
                              {event.organizationName && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {event.organizationName}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7"
                                onClick={() => engageMutation.mutate({ eventId: event.id, action: "saved" })}
                              >
                                <CheckCircle className="w-3 h-3 mr-1" /> Save
                              </Button>
                              {event.organizationPhone && (
                                <a href={`tel:${event.organizationPhone}`}>
                                  <Button size="sm" variant="outline" className="text-xs h-7">
                                    <Phone className="w-3 h-3 mr-1" /> {event.organizationPhone}
                                  </Button>
                                </a>
                              )}
                              {event.registrationUrl && (
                                <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                                  <Button size="sm" variant="outline" className="text-xs h-7">
                                    <ExternalLink className="w-3 h-3 mr-1" /> Register
                                  </Button>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        {filtered.length} event{filtered.length !== 1 ? "s" : ""} shown · Information verified by participating organizations and providers
      </p>
    </div>
  );
}
