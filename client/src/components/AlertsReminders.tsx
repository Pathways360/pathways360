import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Clock, CheckCircle, Plus, X } from "lucide-react";

interface Alert {
  id: number;
  type: "warning" | "reminder" | "info";
  title: string;
  message: string;
  date: string;
  priority: "high" | "medium" | "low";
  actionRequired: boolean;
}

const DEMO_ALERTS: Alert[] = [
  {
    id: 1,
    type: "warning",
    title: "Medication Refill Due",
    message: "Methadone prescription refill due in 3 days",
    date: "2026-07-06",
    priority: "high",
    actionRequired: true,
  },
  {
    id: 2,
    type: "reminder",
    title: "Court Date Approaching",
    message: "Probation check-in scheduled for July 10, 2026 at 2:00 PM",
    date: "2026-07-10",
    priority: "high",
    actionRequired: true,
  },
  {
    id: 3,
    type: "info",
    title: "Housing Inspection Scheduled",
    message: "Annual lease compliance inspection on July 15",
    date: "2026-07-15",
    priority: "medium",
    actionRequired: false,
  },
  {
    id: 4,
    type: "reminder",
    title: "Therapy Appointment",
    message: "Weekly therapy session tomorrow at 10:00 AM",
    date: "2026-07-04",
    priority: "medium",
    actionRequired: false,
  },
  {
    id: 5,
    type: "info",
    title: "Employment Interview",
    message: "Interview with ABC Manufacturing on July 8 at 1:00 PM",
    date: "2026-07-08",
    priority: "low",
    actionRequired: false,
  },
];

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case "reminder":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "info":
      return <Bell className="w-4 h-4 text-gray-600" />;
    default:
      return null;
  }
};

const getAlertColor = (type: string, priority: string) => {
  if (type === "warning" || priority === "high") return "bg-red-50 border-red-200";
  if (type === "reminder" || priority === "medium") return "bg-blue-50 border-blue-200";
  return "bg-gray-50 border-gray-200";
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface AlertsRemindersProps {
  clientId: number;
}

export default function AlertsReminders({ clientId }: AlertsRemindersProps) {
  const actionRequiredCount = DEMO_ALERTS.filter(a => a.actionRequired).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Alerts & Reminders</h3>
          <p className="text-xs text-gray-500 mt-1">{actionRequiredCount} action(s) required</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Add Reminder
        </Button>
      </div>

      {/* Action Required Banner */}
      {actionRequiredCount > 0 && (
        <Card className="border-0 shadow-sm bg-red-50 border border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-900">{actionRequiredCount} Action(s) Required</p>
              <p className="text-sm text-red-800">Please review and complete these items</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {DEMO_ALERTS.map(alert => (
          <Card
            key={alert.id}
            className={`border-0 shadow-sm hover:shadow-md transition-shadow border ${getAlertColor(alert.type, alert.priority)}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <Badge className={getPriorityBadgeColor(alert.priority)}>
                        {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                      </Badge>
                      {alert.actionRequired && (
                        <Badge className="bg-red-100 text-red-700">Action Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.date}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              </div>

              {alert.actionRequired && (
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />Mark Complete
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">View Details</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
