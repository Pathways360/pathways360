import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Calendar, FileText, CheckCircle, AlertCircle, Heart, Briefcase,
  Home, GraduationCap, Users, MessageCircle, Award, Pill, DollarSign
} from "lucide-react";

interface TimelineEvent {
  id: number;
  date: string;
  type: "appointment" | "note" | "milestone" | "goal" | "medication" | "referral" | "housing" | "employment" | "education" | "message" | "achievement" | "alert" | "case_note" | "court_date" | "assessment" | "goal_update";
  title: string;
  description: string;
  createdBy: string;
  visibleToRoles: string[];
}

const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 1,
    date: "2026-07-04",
    type: "achievement",
    title: "Completed 30 days of employment",
    description: "James has successfully maintained employment for 30 consecutive days at ABC Manufacturing.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 2,
    date: "2026-07-02",
    type: "appointment",
    title: "Case Management Meeting",
    description: "Discussed housing options and employment progress. James is on track with goals.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 3,
    date: "2026-06-30",
    type: "goal",
    title: "Goal Updated: Maintain employment",
    description: "Progress updated to 80%. James is performing well at his new job.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 4,
    date: "2026-06-28",
    type: "housing",
    title: "Housing Inspection Completed",
    description: "Apartment inspection passed. James is maintaining the unit well.",
    createdBy: "Housing Provider",
    visibleToRoles: ["case_manager", "housing_provider", "client"],
  },
  {
    id: 5,
    date: "2026-06-25",
    type: "milestone",
    title: "Milestone: 90 Days Stable Housing",
    description: "James has maintained stable housing for 90 consecutive days.",
    createdBy: "System",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 6,
    date: "2026-06-20",
    type: "employment",
    title: "Employment Placement Confirmed",
    description: "James started employment at ABC Manufacturing as a production assistant.",
    createdBy: "Employment Specialist",
    visibleToRoles: ["case_manager", "employment_specialist", "client"],
  },
  {
    id: 7,
    date: "2026-06-15",
    type: "note",
    title: "Case Note: Progress Review",
    description: "James is making excellent progress on all goals. Motivation is high.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker"],
  },
  {
    id: 8,
    date: "2026-06-10",
    type: "referral",
    title: "Referral: GED Program",
    description: "Referred to community college GED program. Enrollment pending.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 9,
    date: "2026-06-01",
    type: "appointment",
    title: "Initial Intake Assessment",
    description: "Completed comprehensive needs assessment. Created personalized life restoration plan.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 10,
    date: "2026-07-05",
    type: "case_note",
    title: "Case Note: Monthly Progress Review",
    description: "James continues to demonstrate strong commitment to his goals. All milestones on track. Recommended continuation of current support plan.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker"],
  },
  {
    id: 11,
    date: "2026-07-10",
    type: "court_date",
    title: "Court Hearing - Probation Review",
    description: "Probation review hearing scheduled. James to present progress report on employment and housing stability.",
    createdBy: "Probation Officer",
    visibleToRoles: ["case_manager", "probation_officer", "client"],
  },
  {
    id: 12,
    date: "2026-07-03",
    type: "assessment",
    title: "Assessment: 6-Month Progress Evaluation",
    description: "Comprehensive 6-month assessment completed. Overall progress: 85%. Strengths in employment and housing. Areas for growth: financial literacy.",
    createdBy: "Sarah Johnson",
    visibleToRoles: ["case_manager", "ecm_worker", "client"],
  },
  {
    id: 13,
    date: "2026-06-28",
    type: "goal_update",
    title: "Goal Update: Employment Goal",
    description: "Employment goal progress updated to 95%. James has exceeded initial 6-month employment target.",
    createdBy: "Employment Specialist",
    visibleToRoles: ["case_manager", "employment_specialist", "client"],
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Calendar className="w-4 h-4" />;
    case "note":
      return <FileText className="w-4 h-4" />;
    case "milestone":
      return <Award className="w-4 h-4" />;
    case "goal":
      return <CheckCircle className="w-4 h-4" />;
    case "medication":
      return <Pill className="w-4 h-4" />;
    case "referral":
      return <Users className="w-4 h-4" />;
    case "housing":
      return <Home className="w-4 h-4" />;
    case "employment":
      return <Briefcase className="w-4 h-4" />;
    case "education":
      return <GraduationCap className="w-4 h-4" />;
    case "message":
      return <MessageCircle className="w-4 h-4" />;
    case "achievement":
      return <Award className="w-4 h-4" />;
    case "alert":
      return <AlertCircle className="w-4 h-4" />;
    case "case_note":
      return <FileText className="w-4 h-4" />;
    case "court_date":
      return <Calendar className="w-4 h-4" />;
    case "assessment":
      return <CheckCircle className="w-4 h-4" />;
    case "goal_update":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case "appointment":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "note":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "milestone":
      return "bg-green-100 text-green-700 border-green-200";
    case "goal":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "medication":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "referral":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "housing":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "employment":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "education":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "message":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "achievement":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "alert":
      return "bg-red-100 text-red-700 border-red-200";
    case "case_note":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "court_date":
      return "bg-red-100 text-red-700 border-red-200";
    case "assessment":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "goal_update":
      return "bg-teal-100 text-teal-700 border-teal-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

interface ClientTimelineProps {
  clientId: number;
  userRole?: string;
}

export default function ClientTimeline({ clientId, userRole = "client" }: ClientTimelineProps) {
  const { user } = useAuth();
  const userRoleToUse = userRole || user?.role || "client";
  
  // Fetch timeline from backend
  const { data: timelineEvents, isLoading, error } = trpc.timeline.getClientTimeline.useQuery(
    { clientId },
    { enabled: !!clientId }
  );
  
  // Map backend events to UI format
  const events = timelineEvents?.map((event: any) => ({
    id: event.id,
    date: new Date(event.eventDate).toISOString().split('T')[0],
    type: event.eventType,
    title: event.title,
    description: event.description || '',
    createdBy: event.createdByRole || 'System',
    visibleToRoles: event.visibleToRoles ? JSON.parse(event.visibleToRoles) : [],
  })) || [];
  
  // Filter events based on user role visibility
  const visibleEvents = (events.length > 0 ? events : DEMO_TIMELINE).filter(event => 
    event.visibleToRoles.includes(userRoleToUse) || event.visibleToRoles.includes("client")
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">Error loading timeline: {error.message}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">360° Client Timeline</h2>
        <p className="text-sm text-gray-500 mt-1">Chronological history of all client interactions, milestones, and progress</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline Events */}
        <div className="space-y-4">
          {visibleEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No timeline events visible for your role</p>
            </div>
          ) : (
            visibleEvents.map((event, index) => (
            <div key={event.id} className="relative pl-16">
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-2 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>

              {/* Event Card */}
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="outline" className={`text-xs ${getEventColor(event.type)}`}>
                          {event.type.replace(/_/g, " ").charAt(0).toUpperCase() + event.type.replace(/_/g, " ").slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{event.date}</span>
                        <span>By: {event.createdBy}</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Visible to: {event.visibleToRoles.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
