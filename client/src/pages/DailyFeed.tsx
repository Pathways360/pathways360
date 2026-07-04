import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Sun, Utensils, Home, Bus, Calendar, Bell, Briefcase,
  Heart, AlertTriangle, MapPin, Clock, Phone, ExternalLink,
  CheckCircle, ChevronRight, Settings, Star
} from "lucide-react";

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

const EVENT_TYPE_ICONS: Record<string, typeof Utensils> = {
  meal: Utensils, food_distribution: Utensils, food_bank: Utensils, mobile_pantry: Utensils,
  emergency_shelter: Home, winter_shelter: Home, cooling_center: Home, warming_center: Home,
  mobile_medical: Heart, behavioral_health_outreach: Heart, medication_clinic: Heart, vaccination: Heart,
  bus_voucher: Bus, transportation: Bus,
  job_fair: Briefcase, hiring_event: Briefcase, resume_workshop: Briefcase, training: Briefcase,
  recovery_meeting: Star, support_group: Star, peer_support: Star,
  probation_outreach: AlertTriangle, parole_outreach: AlertTriangle,
  resource_fair: Star, emergency_alert: AlertTriangle,
};

const CONFIDENCE_COLORS: Record<string, string> = {
  verified_today: "bg-green-100 text-green-800 border-green-200",
  verified_this_week: "bg-blue-100 text-blue-800 border-blue-200",
  verified_this_month: "bg-yellow-100 text-yellow-800 border-yellow-200",
  pending: "bg-gray-100 text-gray-700 border-gray-200",
  unverified: "bg-red-100 text-red-700 border-red-200",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  verified_today: "Verified Today",
  verified_this_week: "Verified This Week",
  verified_this_month: "Verified This Month",
  pending: "Pending Verification",
  unverified: "Unverified",
};

function formatTime(t: string | null | undefined) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function EventCard({ event, onEngage }: { event: any; onEngage: (id: number, action: string) => void }) {
  const Icon = EVENT_TYPE_ICONS[event.eventType] || Star;
  const confidenceClass = CONFIDENCE_COLORS[event.confidenceLevel] || CONFIDENCE_COLORS.pending;

  return (
    <Card className="border border-border hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-sm leading-tight">{event.title}</h3>
              <Badge variant="outline" className={`text-xs shrink-0 ${confidenceClass}`}>
                {CONFIDENCE_LABELS[event.confidenceLevel] || "Pending"}
              </Badge>
            </div>
            {event.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
              {(event.startTime || event.endTime) && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ""}
                </span>
              )}
              {(event.locationName || event.address) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.locationName || event.address}
                </span>
              )}
              {event.organizationPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {event.organizationPhone}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => onEngage(event.id, "saved")}
              >
                <CheckCircle className="w-3 h-3 mr-1" /> Save
              </Button>
              {event.organizationPhone && (
                <a href={`tel:${event.organizationPhone}`}>
                  <Button size="sm" variant="outline" className="text-xs h-7">
                    <Phone className="w-3 h-3 mr-1" /> Call
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DailyFeed() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState("today");

  const { data: feed, isLoading } = trpc.dailyFeed.get.useQuery({ date: today });
  const engageMutation = trpc.communityEvents.engage.useMutation({
    onSuccess: () => toast.success("Saved to your list"),
    onError: () => toast.error("Could not save"),
  });

  const handleEngage = (eventId: number, action: string) => {
    engageMutation.mutate({ eventId, action: action as any });
  };

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <Sun className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Your Daily Feed</h2>
        <p className="text-muted-foreground mb-4">Sign in to see personalized resources for today.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  const context = feed?.context;
  const events = feed?.events || [];
  const appointments = feed?.appointments || [];
  const messages = feed?.providerMessages || [];
  const goals = feed?.activeGoals || [];
  const serviceAreas = feed?.serviceAreas || [];

  // Categorize events
  const mealEvents = events.filter(e => ["meal","food_distribution","food_bank","mobile_pantry"].includes(e.eventType));
  const shelterEvents = events.filter(e => ["emergency_shelter","winter_shelter","cooling_center","warming_center"].includes(e.eventType));
  const medicalEvents = events.filter(e => ["mobile_medical","behavioral_health_outreach","medication_clinic","vaccination"].includes(e.eventType));
  const employmentEvents = events.filter(e => ["job_fair","hiring_event","resume_workshop","training","community_college","education"].includes(e.eventType));
  const recoveryEvents = events.filter(e => ["recovery_meeting","support_group","peer_support"].includes(e.eventType));
  const legalEvents = events.filter(e => ["legal_clinic","expungement_event","probation_outreach","parole_outreach","dmv_outreach"].includes(e.eventType));
  const otherEvents = events.filter(e => !["meal","food_distribution","food_bank","mobile_pantry","emergency_shelter","winter_shelter","cooling_center","warming_center","mobile_medical","behavioral_health_outreach","medication_clinic","vaccination","job_fair","hiring_event","resume_workshop","training","community_college","education","recovery_meeting","support_group","peer_support","legal_clinic","expungement_event","probation_outreach","parole_outreach","dmv_outreach"].includes(e.eventType));

  const totalItems = events.length + appointments.length + messages.length;

  return (
    <div className="container py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold text-foreground">Today's Feed</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {serviceAreas.length > 0 && (
              <span className="ml-2">
                · {serviceAreas.map(sa => sa.county.charAt(0).toUpperCase() + sa.county.slice(1)).join(", ")} County
              </span>
            )}
          </p>
        </div>
        <Link href="/settings/service-areas">
          <Button variant="outline" size="sm" className="gap-1">
            <Settings className="w-4 h-4" /> Areas
          </Button>
        </Link>
      </div>

      {/* Context Banners */}
      {context && (
        <div className="flex flex-wrap gap-2 mb-4">
          {context.isHomeless && (
            <Badge className="bg-orange-100 text-orange-800 border border-orange-200 text-xs">
              🏠 Prioritizing shelter & meals
            </Badge>
          )}
          {context.isReentry && (
            <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">
              ⚖️ Prioritizing reentry resources
            </Badge>
          )}
          {context.isJobSeeking && (
            <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">
              💼 Prioritizing employment
            </Badge>
          )}
          {context.inRecovery && (
            <Badge className="bg-purple-100 text-purple-800 border border-purple-200 text-xs">
              ⭐ Prioritizing recovery support
            </Badge>
          )}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-primary">{events.length}</div>
          <div className="text-xs text-muted-foreground">Today's Events</div>
        </Card>
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-amber-600">{appointments.length}</div>
          <div className="text-xs text-muted-foreground">Appointments</div>
        </Card>
        <Card className="text-center p-3">
          <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
          <div className="text-xs text-muted-foreground">New Messages</div>
        </Card>
      </div>

      {/* No service areas notice */}
      {serviceAreas.length === 0 && (
        <Card className="mb-4 border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Set your service areas</p>
              <p className="text-xs text-amber-700">Add your county to see personalized local resources.</p>
            </div>
            <Link href="/profile">
              <Button size="sm" variant="outline" className="text-xs shrink-0">Set Up</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Provider Messages */}
      {messages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-500" /> Provider Messages
          </h2>
          <div className="space-y-2">
            {messages.map((msg: any) => (
              <Card key={msg.id} className="border-blue-200 bg-blue-50/50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Bell className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{msg.subject || "Message from your provider"}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{msg.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Today's Appointments */}
      {appointments.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-500" /> Today's Appointments
          </h2>
          <div className="space-y-2">
            {appointments.map((appt: any) => (
              <Card key={appt.id} className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{appt.title || appt.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(appt.appointmentDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        {appt.location && ` · ${appt.location}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Goals */}
      {goals.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-purple-500" /> Active Goals
          </h2>
          <div className="space-y-2">
            {goals.map((goal: any) => (
              <Card key={goal.id} className="border-purple-200 bg-purple-50/50">
                <CardContent className="p-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-500 shrink-0" />
                  <p className="text-sm font-medium flex-1">{goal.title}</p>
                  <Badge variant="outline" className="text-xs">{goal.category}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Events by Category */}
      {events.length === 0 ? (
        <Card className="text-center py-10">
          <CardContent>
            <Sun className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No events found for today in your service area.</p>
            <p className="text-xs text-muted-foreground mt-1">Check the <Link href="/community-events" className="text-primary underline">Community Events</Link> board for upcoming events.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {mealEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-orange-500" /> Today's Meals & Food
              </h2>
              <div className="space-y-2">
                {mealEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {shelterEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-500" /> Shelter & Housing
              </h2>
              <div className="space-y-2">
                {shelterEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {medicalEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" /> Medical & Behavioral Health
              </h2>
              <div className="space-y-2">
                {medicalEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {legalEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" /> Legal, Probation & ID
              </h2>
              <div className="space-y-2">
                {legalEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {employmentEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-500" /> Employment & Training
              </h2>
              <div className="space-y-2">
                {employmentEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {recoveryEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-purple-500" /> Recovery & Support Groups
              </h2>
              <div className="space-y-2">
                {recoveryEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
          {otherEvents.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-500" /> Other Community Events
              </h2>
              <div className="space-y-2">
                {otherEvents.map(e => <EventCard key={e.id} event={e} onEngage={handleEngage} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Footer link */}
      <div className="mt-8 text-center">
        <Link href="/community-events">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="w-4 h-4" /> View All Upcoming Events
          </Button>
        </Link>
      </div>
    </div>
  );
}
