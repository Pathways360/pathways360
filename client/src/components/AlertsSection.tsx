import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, Clock, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "health" | "compliance" | "appointment" | "medication" | "court" | "housing" | "employment" | "family" | "recovery";
  createdDate: string;
  dueDate?: string;
  status: "active" | "acknowledged" | "resolved";
  actionRequired: boolean;
  relatedClient?: string;
  notes?: string;
}

const DEMO_ALERTS: Alert[] = [
  {
    id: 1,
    title: "Missed Medication Dose",
    description: "Client missed scheduled Methadone dose today at 8:00 AM. This is the first missed dose in 3 months.",
    severity: "high",
    type: "medication",
    createdDate: "2026-07-04",
    dueDate: "2026-07-04",
    status: "active",
    actionRequired: true,
    notes: "Follow up with client immediately to ensure medication compliance."
  },
  {
    id: 2,
    title: "Court Date Approaching",
    description: "Probation review hearing scheduled for July 15, 2026 at 9:00 AM. Client preparation needed.",
    severity: "medium",
    type: "court",
    createdDate: "2026-07-03",
    dueDate: "2026-07-15",
    status: "active",
    actionRequired: true,
    notes: "Ensure client has all required documents and transportation arranged."
  },
  {
    id: 3,
    title: "Appointment Reminder - Medical Check-up",
    description: "Routine medical appointment scheduled for July 8, 2026 at 2:00 PM.",
    severity: "low",
    type: "appointment",
    createdDate: "2026-07-02",
    dueDate: "2026-07-08",
    status: "active",
    actionRequired: false,
    notes: "Send reminder to client 24 hours before appointment."
  },
  {
    id: 4,
    title: "Housing Lease Expiration",
    description: "Current housing lease expires in 30 days (August 4, 2026). Need to discuss renewal or new housing options.",
    severity: "medium",
    type: "housing",
    createdDate: "2026-07-01",
    dueDate: "2026-08-04",
    status: "active",
    actionRequired: true,
    notes: "Schedule meeting with case manager to discuss housing options."
  },
  {
    id: 5,
    title: "Employment Interview Scheduled",
    description: "Client has job interview at ABC Manufacturing on July 10, 2026 at 10:00 AM. Preparation recommended.",
    severity: "low",
    type: "employment",
    createdDate: "2026-06-30",
    dueDate: "2026-07-10",
    status: "active",
    actionRequired: false,
    notes: "Help client prepare resume and practice interview skills."
  },
  {
    id: 6,
    title: "Recovery Milestone - 60 Days Sober",
    description: "Client is approaching 60 days of continuous sobriety. Plan celebration and recognition.",
    severity: "low",
    type: "recovery",
    createdDate: "2026-06-28",
    dueDate: "2026-07-25",
    status: "acknowledged",
    actionRequired: false,
    notes: "Celebrate milestone with recovery community and sponsor."
  },
  {
    id: 7,
    title: "High-Risk Behavior Detected",
    description: "Client reported increased stress and social isolation. Recommend increased counseling frequency.",
    severity: "critical",
    type: "health",
    createdDate: "2026-07-04",
    dueDate: "2026-07-04",
    status: "active",
    actionRequired: true,
    notes: "Schedule emergency counseling session. Monitor for crisis indicators."
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-700 border-l-4 border-l-red-600";
    case "high":
      return "bg-orange-100 text-orange-700 border-l-4 border-l-orange-600";
    case "medium":
      return "bg-yellow-100 text-yellow-700 border-l-4 border-l-yellow-600";
    case "low":
      return "bg-blue-100 text-blue-700 border-l-4 border-l-blue-600";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case "high":
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    case "medium":
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case "low":
      return <AlertCircle className="w-5 h-5 text-blue-600" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-red-50 text-red-700";
    case "acknowledged":
      return "bg-yellow-50 text-yellow-700";
    case "resolved":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export default function AlertsSection({ clientId }: { clientId: number }) {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const activeAlerts = DEMO_ALERTS.filter(a => !dismissedAlerts.includes(a.id) && a.status === "active");
  const acknowledgedAlerts = DEMO_ALERTS.filter(a => !dismissedAlerts.includes(a.id) && a.status === "acknowledged");
  const resolvedAlerts = DEMO_ALERTS.filter(a => !dismissedAlerts.includes(a.id) && a.status === "resolved");

  const criticalCount = activeAlerts.filter(a => a.severity === "critical").length;
  const highCount = activeAlerts.filter(a => a.severity === "high").length;

  const handleDismiss = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        {(criticalCount > 0 || highCount > 0) && (
          <Badge className="bg-red-100 text-red-700 text-sm">
            {criticalCount + highCount} Urgent
          </Badge>
        )}
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-gray-600">Critical</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{highCount}</p>
            <p className="text-xs text-gray-600">High Priority</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{activeAlerts.filter(a => a.severity === "medium").length}</p>
            <p className="text-xs text-gray-600">Medium</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{activeAlerts.filter(a => a.severity === "low").length}</p>
            <p className="text-xs text-gray-600">Low</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Active Alerts ({activeAlerts.length})</h4>
          <div className="space-y-2">
            {activeAlerts.map(alert => (
              <Card key={alert.id} className={`border-0 shadow-sm ${getSeverityColor(alert.severity)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getSeverityIcon(alert.severity)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDismiss(alert.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{alert.description}</p>
                      
                      {alert.dueDate && (
                        <p className="text-xs text-gray-700 mb-2">
                          Due: {new Date(alert.dueDate).toLocaleDateString()}
                        </p>
                      )}

                      {alert.notes && (
                        <div className="text-xs text-gray-800 mb-2 p-2 bg-white/50 rounded">
                          <p className="font-medium mb-1">Action:</p>
                          <p>{alert.notes}</p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {alert.actionRequired && (
                          <Badge className="bg-red-600 text-white text-xs">Action Required</Badge>
                        )}
                        <Badge className={`text-xs ${getStatusColor(alert.status)}`}>
                          {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Acknowledged ({acknowledgedAlerts.length})</h4>
          <div className="space-y-2">
            {acknowledgedAlerts.map(alert => (
              <Card key={alert.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">Acknowledged</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Resolved Alerts */}
      {resolvedAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Resolved ({resolvedAlerts.length})</h4>
          <div className="space-y-2">
            {resolvedAlerts.map(alert => (
              <Card key={alert.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.description}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">Resolved</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 && resolvedAlerts.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">All clear! No active alerts.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
