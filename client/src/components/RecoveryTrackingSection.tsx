import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar, Users, Award, AlertCircle, TrendingUp } from "lucide-react";

interface RecoveryMilestone {
  id: number;
  title: string;
  description: string;
  daysAchieved: number;
  achievedDate: string;
  type: "sobriety" | "meeting" | "sponsor" | "employment" | "housing" | "family" | "health" | "custom";
  status: "achieved" | "in_progress" | "pending";
  notes?: string;
}

const DEMO_RECOVERY: RecoveryMilestone[] = [
  {
    id: 1,
    title: "30 Days Sober",
    description: "Maintained sobriety for 30 consecutive days",
    daysAchieved: 30,
    achievedDate: "2026-06-04",
    type: "sobriety",
    status: "achieved",
    notes: "Great progress! Client is highly motivated."
  },
  {
    id: 2,
    title: "90 Days Sober",
    description: "Maintained sobriety for 90 consecutive days",
    daysAchieved: 90,
    achievedDate: "2026-08-02",
    type: "sobriety",
    status: "in_progress",
    notes: "On track to achieve this milestone."
  },
  {
    id: 3,
    title: "Sponsor Connection",
    description: "Connected with a recovery sponsor",
    daysAchieved: 0,
    achievedDate: "2026-05-15",
    type: "sponsor",
    status: "achieved",
    notes: "Client has weekly sponsor meetings."
  },
  {
    id: 4,
    title: "30 Meetings in 30 Days",
    description: "Attended 30 support group meetings in 30 days",
    daysAchieved: 30,
    achievedDate: "2026-06-20",
    type: "meeting",
    status: "achieved",
    notes: "Excellent engagement with recovery community."
  },
  {
    id: 5,
    title: "Employment Placement",
    description: "Secured full-time employment",
    daysAchieved: 0,
    achievedDate: "2026-06-20",
    type: "employment",
    status: "achieved",
    notes: "Working at ABC Manufacturing as production assistant."
  },
  {
    id: 6,
    title: "Family Reconnection",
    description: "Restored contact with family members",
    daysAchieved: 0,
    achievedDate: "2026-06-10",
    type: "family",
    status: "achieved",
    notes: "Client has weekly calls with mother and sister."
  },
];

const getMilestoneIcon = (type: string) => {
  switch (type) {
    case "sobriety":
      return <RefreshCw className="w-4 h-4" />;
    case "meeting":
      return <Users className="w-4 h-4" />;
    case "sponsor":
      return <Users className="w-4 h-4" />;
    case "employment":
      return <TrendingUp className="w-4 h-4" />;
    case "housing":
      return <Award className="w-4 h-4" />;
    case "family":
      return <Users className="w-4 h-4" />;
    case "health":
      return <AlertCircle className="w-4 h-4" />;
    default:
      return <Award className="w-4 h-4" />;
  }
};

const getMilestoneColor = (type: string) => {
  switch (type) {
    case "sobriety":
      return "bg-purple-100 text-purple-700";
    case "meeting":
      return "bg-blue-100 text-blue-700";
    case "sponsor":
      return "bg-indigo-100 text-indigo-700";
    case "employment":
      return "bg-green-100 text-green-700";
    case "housing":
      return "bg-amber-100 text-amber-700";
    case "family":
      return "bg-pink-100 text-pink-700";
    case "health":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function RecoveryTrackingSection({ clientId }: { clientId: number }) {
  const achievedMilestones = DEMO_RECOVERY.filter(m => m.status === "achieved");
  const inProgressMilestones = DEMO_RECOVERY.filter(m => m.status === "in_progress");
  const pendingMilestones = DEMO_RECOVERY.filter(m => m.status === "pending");

  const totalDaysSober = Math.max(...DEMO_RECOVERY.filter(m => m.type === "sobriety" && m.status === "achieved").map(m => m.daysAchieved), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recovery Progress</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Log Milestone
        </Button>
      </div>

      {/* Sobriety Counter */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Days of Continuous Sobriety</p>
            <p className="text-5xl font-bold text-purple-700 mb-2">{totalDaysSober}</p>
            <p className="text-sm text-gray-600">Since {new Date(DEMO_RECOVERY.find(m => m.type === "sobriety" && m.daysAchieved === totalDaysSober)?.achievedDate || "").toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Achieved Milestones */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Achieved Milestones ({achievedMilestones.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievedMilestones.map(milestone => (
            <Card key={milestone.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getMilestoneColor(milestone.type)}`}>
                    {getMilestoneIcon(milestone.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{milestone.title}</h4>
                      <Badge className="bg-green-100 text-green-700 text-xs">Achieved</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(milestone.achievedDate).toLocaleDateString()}
                    </p>
                    {milestone.notes && (
                      <p className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded">{milestone.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* In Progress Milestones */}
      {inProgressMilestones.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">In Progress ({inProgressMilestones.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inProgressMilestones.map(milestone => (
              <Card key={milestone.id} className="border-0 shadow-sm border-l-4 border-l-yellow-400">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getMilestoneColor(milestone.type)}`}>
                      {getMilestoneIcon(milestone.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{milestone.title}</h4>
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">In Progress</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{milestone.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <p className="text-xs text-gray-500">~{Math.ceil((milestone.daysAchieved * 0.6))} / {milestone.daysAchieved} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Milestones */}
      {pendingMilestones.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Upcoming Goals ({pendingMilestones.length})</h4>
          <div className="space-y-2">
            {pendingMilestones.map(milestone => (
              <Card key={milestone.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${getMilestoneColor(milestone.type)}`}>
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{milestone.title}</p>
                        <p className="text-xs text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
