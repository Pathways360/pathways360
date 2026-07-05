import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Target, FileText, Calendar, AlertCircle, CheckCircle, Share2, MessageSquare } from "lucide-react";

interface AgencyMember {
  id: number;
  agency: string;
  worker: string;
  role: string;
  contact: string;
  joinedDate: string;
  status: "active" | "inactive";
}

interface SharedGoal {
  id: number;
  title: string;
  description: string;
  agencies: string[];
  progress: number;
  targetDate: string;
  status: "in_progress" | "completed" | "at_risk";
}

interface CollaborativeNote {
  id: number;
  title: string;
  content: string;
  author: string;
  agency: string;
  date: string;
  visibility: "all_agencies" | "specific_agencies";
}

const DEMO_AGENCIES: AgencyMember[] = [
  {
    id: 1,
    agency: "Butte County Case Management",
    worker: "Sarah Martinez",
    role: "Lead Case Manager",
    contact: "sarah.martinez@buttecounty.org",
    joinedDate: "2026-04-15",
    status: "active"
  },
  {
    id: 2,
    agency: "Butte County Probation",
    worker: "Officer James Wilson",
    role: "Probation Officer",
    contact: "james.wilson@probation.org",
    joinedDate: "2026-01-10",
    status: "active"
  },
  {
    id: 3,
    agency: "Butte County Health Services",
    worker: "Dr. Michael Chen",
    role: "Medical Provider",
    contact: "michael.chen@health.org",
    joinedDate: "2026-05-01",
    status: "active"
  },
  {
    id: 4,
    agency: "Mental Health Services",
    worker: "Dr. Patricia Johnson",
    role: "Therapist",
    contact: "patricia.johnson@mh.org",
    joinedDate: "2026-06-15",
    status: "active"
  },
  {
    id: 5,
    agency: "Recovery Support Services",
    worker: "Recovery Coach",
    role: "Recovery Coach",
    contact: "coach@recovery.org",
    joinedDate: "2026-07-01",
    status: "active"
  },
];

const DEMO_GOALS: SharedGoal[] = [
  {
    id: 1,
    title: "Secure Stable Housing",
    description: "Client to obtain and maintain stable housing",
    agencies: ["Case Management", "Probation", "Housing Authority"],
    progress: 75,
    targetDate: "2026-08-15",
    status: "in_progress"
  },
  {
    id: 2,
    title: "Achieve Employment",
    description: "Secure full-time employment with benefits",
    agencies: ["Case Management", "Workforce Development"],
    progress: 60,
    targetDate: "2026-09-01",
    status: "in_progress"
  },
  {
    id: 3,
    title: "Maintain Sobriety",
    description: "Continuous sobriety and recovery support",
    agencies: ["Probation", "Health Services", "Recovery Support", "Mental Health"],
    progress: 90,
    targetDate: "2026-12-31",
    status: "in_progress"
  },
  {
    id: 4,
    title: "Family Reunification",
    description: "Restore and maintain family relationships",
    agencies: ["CPS", "Case Management", "Mental Health"],
    progress: 100,
    targetDate: "2026-06-30",
    status: "completed"
  },
  {
    id: 5,
    title: "Mental Health Stability",
    description: "Manage mental health conditions with medication and therapy",
    agencies: ["Health Services", "Mental Health", "Probation"],
    progress: 70,
    targetDate: "2026-12-31",
    status: "in_progress"
  },
];

const DEMO_NOTES: CollaborativeNote[] = [
  {
    id: 1,
    title: "Multi-Agency Care Plan Update",
    content: "All agencies met to review progress. Client is exceeding expectations in recovery and employment areas. Continue current support plan with focus on housing stability.",
    author: "Sarah Martinez",
    agency: "Case Management",
    date: "2026-07-02",
    visibility: "all_agencies"
  },
  {
    id: 2,
    title: "Probation Compliance Report",
    content: "Client has maintained 100% compliance with probation requirements. No violations. Recommend continued current support plan.",
    author: "Officer James Wilson",
    agency: "Probation",
    date: "2026-07-01",
    visibility: "all_agencies"
  },
  {
    id: 3,
    title: "Medical & Recovery Coordination",
    content: "Coordinating medication management with recovery support. Client showing excellent medication compliance and recovery engagement.",
    author: "Dr. Michael Chen",
    agency: "Health Services",
    date: "2026-06-30",
    visibility: "all_agencies"
  },
];

const getGoalStatusColor = (status: string) => {
  switch (status) {
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "at_risk":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getGoalStatusIcon = (status: string) => {
  switch (status) {
    case "in_progress":
      return "🔄";
    case "completed":
      return "✅";
    case "at_risk":
      return "⚠️";
    default:
      return "📋";
  }
};

export default function MultiAgencyCollaborationView({ clientId }: { clientId: number }) {
  const activeAgencies = DEMO_AGENCIES.filter(a => a.status === "active");
  const inProgressGoals = DEMO_GOALS.filter(g => g.status === "in_progress");
  const completedGoals = DEMO_GOALS.filter(g => g.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Multi-Agency Collaboration</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Invite Agency
        </Button>
      </div>

      {/* Collaboration Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{activeAgencies.length}</p>
            <p className="text-xs text-gray-600">Agencies</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{inProgressGoals.length}</p>
            <p className="text-xs text-gray-600">Active Goals</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{DEMO_NOTES.length}</p>
            <p className="text-xs text-gray-600">Shared Notes</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Agencies & Workers */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          Assigned Agencies & Workers ({activeAgencies.length})
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeAgencies.map(agency => (
            <Card key={agency.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{agency.agency}</h4>
                    <p className="text-sm text-gray-600">{agency.worker}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{agency.role}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📧 {agency.contact}</p>
                  <p>📅 Joined {new Date(agency.joinedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shared Goals */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <Target className="w-4 h-4" />
          Shared Goals ({DEMO_GOALS.length})
        </h4>
        <div className="space-y-2">
          {DEMO_GOALS.map(goal => (
            <Card key={goal.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getGoalStatusIcon(goal.status)}</span>
                      <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <Badge className={getGoalStatusColor(goal.status)}>
                    {goal.status === "in_progress" ? "In Progress" : goal.status === "completed" ? "Completed" : "At Risk"}
                  </Badge>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progress</span>
                    <span className="text-xs font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        goal.progress >= 75 ? "bg-green-500" : goal.progress >= 50 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {goal.agencies.map((agency, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                      {agency}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Shared Notes & Coordination */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Shared Notes & Coordination ({DEMO_NOTES.length})
        </h4>
        <div className="space-y-2">
          {DEMO_NOTES.map(note => (
            <Card key={note.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{note.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <span>{note.author}</span>
                      <span>•</span>
                      <span>{note.agency}</span>
                      <span>•</span>
                      <span>{new Date(note.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                    {note.visibility === "all_agencies" ? "All Agencies" : "Specific"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{note.content}</p>
                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compact Agreements */}
      <Card className="border-0 shadow-sm bg-blue-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 text-sm mb-3">Inter-Agency Compacts</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Confidentiality & Data Sharing</p>
                <p className="text-gray-600">All agencies agree to maintain confidentiality and share data per ROI agreements</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Coordinated Care Planning</p>
                <p className="text-gray-600">Monthly multi-agency meetings to coordinate care and track progress</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Shared Outcome Metrics</p>
                <p className="text-gray-600">All agencies track and report on agreed-upon outcome metrics</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
