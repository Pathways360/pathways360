import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, Clock, MapPin, User, Phone, CheckCircle, AlertCircle,
  Plus, Edit2, Trash2, Send, ChevronRight
} from "lucide-react";

interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "case_management" | "counseling" | "employment" | "housing" | "medical" | "other";
  provider: string;
  location: string;
  phone: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  clientConfirmed: boolean;
  reminderSent: boolean;
}

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    title: "Case Management Meeting",
    date: "2026-07-10",
    time: "2:00 PM",
    type: "case_management",
    provider: "Sarah Johnson",
    location: "Community Center, Room 201",
    phone: "(555) 123-4567",
    notes: "Discuss housing progress and employment goals",
    status: "scheduled",
    clientConfirmed: true,
    reminderSent: false,
  },
  {
    id: 2,
    title: "Counseling Session",
    date: "2026-07-12",
    time: "10:00 AM",
    type: "counseling",
    provider: "Dr. Michael Chen",
    location: "Mental Health Clinic",
    phone: "(555) 234-5678",
    notes: "Weekly counseling for stress management",
    status: "scheduled",
    clientConfirmed: false,
    reminderSent: true,
  },
  {
    id: 3,
    title: "Job Interview Prep",
    date: "2026-07-08",
    time: "1:00 PM",
    type: "employment",
    provider: "Employment Specialist",
    location: "Workforce Development Center",
    phone: "(555) 345-6789",
    notes: "Interview preparation for manufacturing position",
    status: "completed",
    clientConfirmed: true,
    reminderSent: true,
  },
  {
    id: 4,
    title: "Housing Inspection",
    date: "2026-07-05",
    time: "3:00 PM",
    type: "housing",
    provider: "Housing Provider",
    location: "123 Oak Street, Apt 4B",
    phone: "(555) 456-7890",
    notes: "Monthly housing stability check",
    status: "completed",
    clientConfirmed: true,
    reminderSent: true,
  },
  {
    id: 5,
    title: "Medical Checkup",
    date: "2026-07-15",
    time: "9:30 AM",
    type: "medical",
    provider: "Community Health Clinic",
    location: "789 Health Blvd",
    phone: "(555) 567-8901",
    notes: "Annual physical examination",
    status: "scheduled",
    clientConfirmed: false,
    reminderSent: false,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "case_management":
      return "bg-blue-100 text-blue-700";
    case "counseling":
      return "bg-purple-100 text-purple-700";
    case "employment":
      return "bg-emerald-100 text-emerald-700";
    case "housing":
      return "bg-amber-100 text-amber-700";
    case "medical":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 border-blue-200";
    case "completed":
      return "bg-green-50 border-green-200";
    case "cancelled":
      return "bg-red-50 border-red-200";
    case "no_show":
      return "bg-yellow-50 border-yellow-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "cancelled":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "no_show":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
};

interface AppointmentsTrackerProps {
  clientId: number;
}

export default function AppointmentsTracker({ clientId }: AppointmentsTrackerProps) {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcoming = DEMO_APPOINTMENTS.filter(a => a.status === "scheduled");
  const completed = DEMO_APPOINTMENTS.filter(a => a.status === "completed");
  const cancelled = DEMO_APPOINTMENTS.filter(a => a.status === "cancelled" || a.status === "no_show");

  const renderAppointmentCard = (apt: Appointment) => (
    <Card key={apt.id} className={`border shadow-sm ${getStatusColor(apt.status)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">{apt.title}</h3>
              <Badge className={getTypeColor(apt.type)}>
                {apt.type.replace(/_/g, " ").charAt(0).toUpperCase() + apt.type.replace(/_/g, " ").slice(1)}
              </Badge>
              <div className="flex items-center gap-1">
                {getStatusIcon(apt.status)}
                <span className="text-xs font-medium text-gray-600 capitalize">{apt.status.replace(/_/g, " ")}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{apt.notes}</p>
          </div>
          {apt.status === "scheduled" && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{apt.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{apt.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>{apt.provider}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a href={`tel:${apt.phone}`} className="text-teal-600 hover:underline">{apt.phone}</a>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{apt.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-t">
          {apt.status === "scheduled" && (
            <>
              {!apt.clientConfirmed && (
                <Button size="sm" variant="outline" className="text-xs">
                  <Send className="w-3 h-3 mr-1" />Request Confirmation
                </Button>
              )}
              {apt.clientConfirmed && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ Client Confirmed
                </Badge>
              )}
              {!apt.reminderSent && (
                <Button size="sm" variant="outline" className="text-xs">
                  <Send className="w-3 h-3 mr-1" />Send Reminder
                </Button>
              )}
              {apt.reminderSent && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  📬 Reminder Sent
                </Badge>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
          <p className="text-sm text-gray-500 mt-1">Track and manage all client appointments</p>
        </div>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" />New Appointment
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-3">
          {upcoming.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No upcoming appointments</p>
              </CardContent>
            </Card>
          ) : (
            upcoming.map(apt => renderAppointmentCard(apt))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completed.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No completed appointments</p>
              </CardContent>
            </Card>
          ) : (
            completed.map(apt => renderAppointmentCard(apt))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-3">
          {cancelled.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No cancelled appointments</p>
              </CardContent>
            </Card>
          ) : (
            cancelled.map(apt => renderAppointmentCard(apt))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
