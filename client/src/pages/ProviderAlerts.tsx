import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Bell, Trash2, Archive, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Alert {
  id: number;
  clientName: string;
  clientId: number;
  type: "high-risk" | "missed-appointment" | "compliance" | "health" | "housing" | "info";
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  createdDate: Date;
  read: boolean;
  acknowledged: boolean;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 1,
    clientName: "Michael Chen",
    clientId: 2,
    type: "high-risk",
    title: "High-Risk Alert",
    description: "Client expressing suicidal ideation. Immediate intervention recommended.",
    severity: "critical",
    createdDate: new Date(Date.now() - 3600000),
    read: false,
    acknowledged: false,
  },
  {
    id: 2,
    clientName: "David Thompson",
    clientId: 4,
    type: "missed-appointment",
    title: "Missed Appointment",
    description: "Client missed probation check-in appointment. Follow-up required.",
    severity: "high",
    createdDate: new Date(Date.now() - 7200000),
    read: false,
    acknowledged: false,
  },
  {
    id: 3,
    clientName: "Sarah Johnson",
    clientId: 1,
    type: "compliance",
    title: "Compliance Issue",
    description: "Client missed 2 consecutive counseling sessions. Intervention needed.",
    severity: "high",
    createdDate: new Date(Date.now() - 86400000),
    read: true,
    acknowledged: true,
  },
  {
    id: 4,
    clientName: "Jessica Martinez",
    clientId: 3,
    type: "health",
    title: "Health Alert",
    description: "Client's blood pressure reading elevated. Doctor follow-up recommended.",
    severity: "medium",
    createdDate: new Date(Date.now() - 172800000),
    read: true,
    acknowledged: false,
  },
  {
    id: 5,
    clientName: "Amanda Rodriguez",
    clientId: 5,
    type: "housing",
    title: "Housing Status Change",
    description: "Client's housing status changed to unstable. Immediate support needed.",
    severity: "high",
    createdDate: new Date(Date.now() - 259200000),
    read: true,
    acknowledged: true,
  },
  {
    id: 6,
    clientName: "System",
    clientId: 0,
    type: "info",
    title: "System Update",
    description: "New features available in the provider dashboard. Check the updates section.",
    severity: "low",
    createdDate: new Date(Date.now() - 345600000),
    read: true,
    acknowledged: true,
  },
];

export default function ProviderAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredAlerts = alerts.filter(alert => {
    const typeMatch = filterType === "all" || alert.type === filterType;
    const severityMatch = filterSeverity === "all" || alert.severity === filterSeverity;
    return typeMatch && severityMatch;
  });

  const unreadCount = alerts.filter(a => !a.read).length;
  const unacknowledgedCount = alerts.filter(a => !a.acknowledged && a.severity !== "low").length;

  const handleMarkAsRead = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const handleAcknowledge = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success("Alert acknowledged");
  };

  const handleDelete = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert deleted");
  };

  const handleArchive = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success("Alert archived");
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high-risk": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "missed-appointment": return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case "compliance": return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case "health": return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case "housing": return <AlertCircle className="w-5 h-5 text-purple-600" />;
      case "info": return <Info className="w-5 h-5 text-gray-600" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-800 border-red-300";
      case "high": return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low": return "bg-blue-100 text-blue-800 border-blue-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600 mt-2">Stay informed about critical client events and status changes</p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                <Bell className="w-4 h-4 mr-1" />
                {unreadCount} Unread
              </Badge>
            )}
            {unacknowledgedCount > 0 && (
              <Badge className="bg-orange-500 text-white">
                {unacknowledgedCount} Action Required
              </Badge>
            )}
          </div>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Critical", count: alerts.filter(a => a.severity === "critical").length, color: "bg-red-50 text-red-700" },
            { label: "High", count: alerts.filter(a => a.severity === "high").length, color: "bg-orange-50 text-orange-700" },
            { label: "Medium", count: alerts.filter(a => a.severity === "medium").length, color: "bg-yellow-50 text-yellow-700" },
            { label: "Low", count: alerts.filter(a => a.severity === "low").length, color: "bg-blue-50 text-blue-700" },
          ].map(stat => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className={`p-4 ${stat.color}`}>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">Alert Type</label>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="high-risk">High-Risk</option>
                <option value="missed-appointment">Missed Appointment</option>
                <option value="compliance">Compliance</option>
                <option value="health">Health</option>
                <option value="housing">Housing</option>
                <option value="info">Info</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2">Severity</label>
              <select
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-300 mx-auto mb-3" />
                <p className="text-gray-600">No alerts to display</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map(alert => (
              <Card
                key={alert.id}
                className={`border-0 shadow-sm border-l-4 ${getSeverityColor(alert.severity)} ${
                  !alert.read ? "bg-opacity-50" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          {alert.clientId > 0 && (
                            <p className="text-sm text-gray-600">
                              Client: <span className="font-medium">{alert.clientName}</span> (ID: {alert.clientId})
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!alert.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                          {!alert.acknowledged && alert.severity !== "low" && (
                            <Badge className="bg-orange-500 text-white text-xs">Action</Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3">{alert.description}</p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {alert.createdDate.toLocaleString()}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {!alert.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Mark Read
                            </Button>
                          )}
                          {!alert.acknowledged && alert.severity !== "low" && (
                            <Button
                              size="sm"
                              onClick={() => handleAcknowledge(alert.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleArchive(alert.id)}
                          >
                            <Archive className="w-4 h-4 mr-1" />
                            Archive
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(alert.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
