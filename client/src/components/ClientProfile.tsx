import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, Mail, Phone, MapPin, Calendar, AlertCircle, CheckCircle,
  Heart, Briefcase, Home, FileText, MessageCircle, Clock, Edit2,
  ChevronRight, Download, Share2
} from "lucide-react";

interface ClientProfileProps {
  clientId: number;
  onClose?: () => void;
}

export default function ClientProfile({ clientId, onClose }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Demo client data
  const client = {
    id: clientId,
    name: "James Martinez",
    email: "james.m@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    city: "Chico",
    county: "Butte",
    state: "CA",
    zipCode: "95926",
    status: "active",
    riskLevel: "low",
    caseManager: "Sarah Johnson",
    enrollmentDate: "2024-01-15",
    lastContact: "2 days ago",
    goals: 5,
    completedGoals: 2,
    appointmentsUpcoming: 2,
    appointmentsCompleted: 8,
  };

  const goals = [
    { id: 1, title: "Secure stable housing", status: "in_progress", dueDate: "2026-08-30", progress: 60 },
    { id: 2, title: "Maintain employment", status: "in_progress", dueDate: "2026-12-31", progress: 80 },
    { id: 3, title: "Complete GED", status: "not_started", dueDate: "2026-06-30", progress: 0 },
    { id: 4, title: "Build support network", status: "completed", dueDate: "2026-03-15", progress: 100 },
    { id: 5, title: "Attend weekly counseling", status: "in_progress", dueDate: "2026-12-31", progress: 90 },
  ];

  const appointments = [
    { id: 1, title: "Case Management Meeting", date: "2026-07-10", time: "2:00 PM", type: "case_management", status: "scheduled" },
    { id: 2, title: "Counseling Session", date: "2026-07-12", time: "10:00 AM", type: "counseling", status: "scheduled" },
    { id: 3, title: "Job Interview Prep", date: "2026-07-08", time: "1:00 PM", type: "employment", status: "completed" },
    { id: 4, title: "Housing Inspection", date: "2026-07-05", time: "3:00 PM", type: "housing", status: "completed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "at_risk":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "in_progress":
        return "bg-blue-50 border-blue-200";
      case "not_started":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
              <p className="text-sm text-gray-500">ID: {client.id} · Enrolled {client.enrollmentDate}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />Export
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={getStatusColor(client.status)}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Current Status</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{client.completedGoals}/{client.goals}</div>
            <p className="text-xs text-gray-500">Goals Completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{client.appointmentsCompleted}</div>
            <p className="text-xs text-gray-500">Appointments Completed</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="text-sm text-gray-600">Last contact</div>
            <p className="text-sm font-medium text-gray-900">{client.lastContact}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{client.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{client.city}, {client.county}, {client.state} {client.zipCode}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">{client.dateOfBirth} (Age 41)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Case Manager</p>
                    <p className="text-sm font-medium text-gray-900">{client.caseManager}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Enrollment Date</p>
                    <p className="text-sm font-medium text-gray-900">{client.enrollmentDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-1" />Send Message
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="w-4 h-4 mr-1" />Schedule Appointment
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-1" />Add Note
                </Button>
                <Button size="sm" variant="outline">
                  <Edit2 className="w-4 h-4 mr-1" />Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-3">
          {goals.map(goal => (
            <Card key={goal.id} className={`border-0 shadow-sm ${getGoalStatusColor(goal.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">Due: {goal.dueDate}</p>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap">
                    {goal.status === "completed" ? "✓ Completed" : goal.status === "in_progress" ? "In Progress" : "Not Started"}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      goal.status === "completed"
                        ? "bg-green-600"
                        : goal.status === "in_progress"
                        ? "bg-blue-600"
                        : "bg-gray-400"
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">{goal.progress}% complete</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-3">
          {appointments.map(apt => (
            <Card key={apt.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{apt.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {apt.status === "completed" ? "✓ Completed" : "Scheduled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{apt.date} at {apt.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 text-center py-8">No notes yet. Add one to get started.</p>
              <Button className="w-full" size="sm">
                <FileText className="w-4 h-4 mr-1" />Add Note
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
