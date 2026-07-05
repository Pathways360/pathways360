import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Phone, AlertCircle, CheckCircle, Plus, FileText } from "lucide-react";

interface ProbationCheckin {
  id: number;
  date: string;
  officer: string;
  phone: string;
  type: "in_person" | "phone" | "virtual";
  location: string;
  status: "completed" | "scheduled" | "missed" | "rescheduled";
  conditions: string[];
  violations: string[];
  notes: string;
  nextCheckin: string;
}

const DEMO_CHECKINS: ProbationCheckin[] = [
  {
    id: 1,
    date: "2026-07-03",
    officer: "Officer David Lopez",
    phone: "(555) 234-5678",
    type: "in_person",
    location: "Probation Office, 456 Main St, Chico",
    status: "completed",
    conditions: ["Regular check-ins", "Drug testing", "No contact with victims", "Maintain employment"],
    violations: [],
    notes: "Client compliant. Employment going well. No violations noted.",
    nextCheckin: "2026-07-17",
  },
  {
    id: 2,
    date: "2026-07-17",
    officer: "Officer David Lopez",
    phone: "(555) 234-5678",
    type: "in_person",
    location: "Probation Office, 456 Main St, Chico",
    status: "scheduled",
    conditions: ["Regular check-ins", "Drug testing", "No contact with victims", "Maintain employment"],
    violations: [],
    notes: "",
    nextCheckin: "2026-07-31",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "in_person":
      return "bg-blue-100 text-blue-700";
    case "phone":
      return "bg-purple-100 text-purple-700";
    case "virtual":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "scheduled":
      return <Calendar className="w-4 h-4 text-blue-600" />;
    case "missed":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    case "rescheduled":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
};

interface ProbationCheckinsTrackerProps {
  clientId: number;
}

export default function ProbationCheckinsTracker({ clientId }: ProbationCheckinsTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Probation Check-ins</h3>
          <p className="text-xs text-gray-500 mt-1">Track compliance and violations</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Add Check-in
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_CHECKINS.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No probation check-ins</p>
            </CardContent>
          </Card>
        ) : (
          DEMO_CHECKINS.map(checkin => (
            <Card key={checkin.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{checkin.date}</h4>
                      <Badge className={getTypeColor(checkin.type)}>
                        {checkin.type.replace(/_/g, " ").charAt(0).toUpperCase() + checkin.type.replace(/_/g, " ").slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(checkin.status)}
                        <span className="text-xs font-medium text-gray-600 capitalize">{checkin.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{checkin.officer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${checkin.phone}`} className="text-teal-600 hover:underline">{checkin.phone}</a>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{checkin.location}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Conditions:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {checkin.conditions.map((cond, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{cond}</Badge>
                      ))}
                    </div>
                  </div>
                  {checkin.violations.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium text-red-700">Violations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {checkin.violations.map((v, i) => (
                          <Badge key={i} className="bg-red-100 text-red-700 text-xs">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {checkin.notes && (
                    <div className="text-sm p-2 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium text-gray-900">Notes:</span>
                      <p className="text-gray-700">{checkin.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                  <Button size="sm" variant="outline" className="text-xs">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
