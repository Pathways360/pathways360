import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, Clock, CheckCircle, X } from "lucide-react";
import { useState } from "react";

interface Reminder {
  id: number;
  title: string;
  description: string;
  type: "appointment" | "medication" | "court" | "meeting" | "deadline" | "follow-up" | "celebration";
  dueDate: string;
  dueTime?: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "sent" | "acknowledged" | "completed";
  recipient: string;
  frequency?: "once" | "daily" | "weekly";
  remindersSent?: number;
}

const DEMO_REMINDERS: Reminder[] = [
  {
    id: 1,
    title: "Methadone Dose",
    description: "Daily methadone dose at clinic",
    type: "medication",
    dueDate: "2026-07-05",
    dueTime: "08:00 AM",
    priority: "high",
    status: "pending",
    recipient: "Client",
    frequency: "daily",
    remindersSent: 0
  },
  {
    id: 2,
    title: "Probation Check-in",
    description: "Monthly probation check-in appointment",
    type: "appointment",
    dueDate: "2026-07-10",
    dueTime: "02:00 PM",
    priority: "high",
    status: "pending",
    recipient: "Client & Probation Officer",
    remindersSent: 0
  },
  {
    id: 3,
    title: "Therapy Session",
    description: "Weekly counseling session",
    type: "appointment",
    dueDate: "2026-07-08",
    dueTime: "10:00 AM",
    priority: "medium",
    status: "pending",
    recipient: "Client & Therapist",
    frequency: "weekly",
    remindersSent: 0
  },
  {
    id: 4,
    title: "Court Hearing",
    description: "Probation review hearing - prepare documentation",
    type: "court",
    dueDate: "2026-07-15",
    dueTime: "09:00 AM",
    priority: "high",
    status: "pending",
    recipient: "Client, Case Manager, Attorney",
    remindersSent: 0
  },
  {
    id: 5,
    title: "Job Interview",
    description: "Interview at ABC Manufacturing",
    type: "deadline",
    dueDate: "2026-07-10",
    dueTime: "10:00 AM",
    priority: "high",
    status: "pending",
    recipient: "Client & Employment Counselor",
    remindersSent: 0
  },
  {
    id: 6,
    title: "Housing Lease Review",
    description: "Discuss lease renewal options with case manager",
    type: "follow-up",
    dueDate: "2026-07-20",
    priority: "medium",
    status: "pending",
    recipient: "Client & Case Manager",
    remindersSent: 0
  },
  {
    id: 7,
    title: "60-Day Sobriety Celebration",
    description: "Celebrate 60 days of continuous sobriety",
    type: "celebration",
    dueDate: "2026-07-25",
    priority: "low",
    status: "pending",
    recipient: "Recovery Community",
    remindersSent: 0
  },
  {
    id: 8,
    title: "Medical Appointment",
    description: "Routine physical examination",
    type: "appointment",
    dueDate: "2026-07-08",
    dueTime: "02:00 PM",
    priority: "medium",
    status: "sent",
    recipient: "Client & Doctor",
    remindersSent: 1
  },
  {
    id: 9,
    title: "Family Call",
    description: "Weekly call with mother",
    type: "follow-up",
    dueDate: "2026-07-06",
    dueTime: "06:00 PM",
    priority: "low",
    status: "acknowledged",
    recipient: "Client",
    frequency: "weekly",
    remindersSent: 1
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "low":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return "🏥";
    case "medication":
      return "💊";
    case "court":
      return "⚖️";
    case "meeting":
      return "👥";
    case "deadline":
      return "⏰";
    case "follow-up":
      return "📞";
    case "celebration":
      return "🎉";
    default:
      return "📝";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-blue-50 text-blue-700";
    case "sent":
      return "bg-purple-50 text-purple-700";
    case "acknowledged":
      return "bg-green-50 text-green-700";
    case "completed":
      return "bg-gray-50 text-gray-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export default function RemindersSection({ clientId }: { clientId: number }) {
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

  const pendingReminders = DEMO_REMINDERS.filter(r => !dismissedReminders.includes(r.id) && r.status === "pending");
  const sentReminders = DEMO_REMINDERS.filter(r => !dismissedReminders.includes(r.id) && r.status === "sent");
  const acknowledgedReminders = DEMO_REMINDERS.filter(r => !dismissedReminders.includes(r.id) && r.status === "acknowledged");
  const completedReminders = DEMO_REMINDERS.filter(r => !dismissedReminders.includes(r.id) && r.status === "completed");

  const handleDismiss = (id: number) => {
    setDismissedReminders([...dismissedReminders, id]);
  };

  const handleSendReminder = (id: number) => {
    // In a real app, this would call an API to send the reminder
    console.log(`Sending reminder ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reminders & Scheduling</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Create Reminder
        </Button>
      </div>

      {/* Reminder Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{pendingReminders.length}</p>
            <p className="text-xs text-gray-600">To Send</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{sentReminders.length}</p>
            <p className="text-xs text-gray-600">Sent</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{acknowledgedReminders.length}</p>
            <p className="text-xs text-gray-600">Acknowledged</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-gray-600">{completedReminders.length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Pending Reminders ({pendingReminders.length})</h4>
          <div className="space-y-2">
            {pendingReminders.map(reminder => (
              <Card key={reminder.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getTypeIcon(reminder.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{reminder.title}</h4>
                          <p className="text-sm text-gray-600">{reminder.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => handleDismiss(reminder.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </div>
                        {reminder.dueTime && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-3 h-3" />
                            {reminder.dueTime}
                          </div>
                        )}
                        {reminder.frequency && (
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 mb-2 text-xs">
                        <Badge className={getPriorityColor(reminder.priority)}>
                          {reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority
                        </Badge>
                        <Badge className={getStatusColor(reminder.status)}>
                          {reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                        </Badge>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">Recipients: {reminder.recipient}</p>

                      <div className="flex gap-2 pt-2 border-t border-gray-200">
                        <Button
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs flex-1"
                          onClick={() => handleSendReminder(reminder.id)}
                        >
                          Send Now
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs flex-1">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Reminders */}
      {sentReminders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Sent ({sentReminders.length})</h4>
          <div className="space-y-2">
            {sentReminders.map(reminder => (
              <Card key={reminder.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <div className="text-lg mt-1">{getTypeIcon(reminder.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                        <p className="text-xs text-gray-600">{new Date(reminder.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 text-xs">Sent</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Acknowledged Reminders */}
      {acknowledgedReminders.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Acknowledged ({acknowledgedReminders.length})</h4>
          <div className="space-y-2">
            {acknowledgedReminders.map(reminder => (
              <Card key={reminder.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{reminder.title}</p>
                        <p className="text-xs text-gray-600">{new Date(reminder.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">Acknowledged</Badge>
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
