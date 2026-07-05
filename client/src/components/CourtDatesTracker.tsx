import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, FileText, AlertCircle, CheckCircle, Plus } from "lucide-react";

interface CourtDate {
  id: number;
  caseNumber: string;
  courtName: string;
  date: string;
  time: string;
  judge: string;
  location: string;
  caseType: "criminal" | "civil" | "family" | "probation" | "other";
  status: "scheduled" | "completed" | "postponed" | "cancelled";
  notes: string;
  attorney: string;
  reminder: boolean;
}

const DEMO_COURT_DATES: CourtDate[] = [
  {
    id: 1,
    caseNumber: "2024-CV-12345",
    courtName: "Butte County Superior Court",
    date: "2026-07-20",
    time: "9:00 AM",
    judge: "Judge Patricia Martinez",
    location: "Courtroom 3, 1 Court Street, Chico, CA 95926",
    caseType: "probation",
    status: "scheduled",
    notes: "Probation violation hearing - attendance mandatory",
    attorney: "Sarah Thompson, Public Defender",
    reminder: true,
  },
  {
    id: 2,
    caseNumber: "2024-CR-67890",
    courtName: "Butte County Superior Court",
    date: "2026-06-15",
    time: "2:00 PM",
    judge: "Judge Robert Chen",
    location: "Courtroom 1, 1 Court Street, Chico, CA 95926",
    caseType: "criminal",
    status: "completed",
    notes: "Sentencing hearing - completed successfully",
    attorney: "Sarah Thompson, Public Defender",
    reminder: true,
  },
];

const getCaseTypeColor = (type: string) => {
  switch (type) {
    case "criminal":
      return "bg-red-100 text-red-700";
    case "civil":
      return "bg-blue-100 text-blue-700";
    case "family":
      return "bg-purple-100 text-purple-700";
    case "probation":
      return "bg-orange-100 text-orange-700";
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
    case "postponed":
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    case "cancelled":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

interface CourtDatesTrackerProps {
  clientId: number;
}

export default function CourtDatesTracker({ clientId }: CourtDatesTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Court Dates</h3>
          <p className="text-xs text-gray-500 mt-1">Track all court appearances and hearings</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Add Court Date
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_COURT_DATES.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No court dates recorded</p>
            </CardContent>
          </Card>
        ) : (
          DEMO_COURT_DATES.map(court => (
            <Card key={court.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{court.caseNumber}</h4>
                      <Badge className={getCaseTypeColor(court.caseType)}>
                        {court.caseType.charAt(0).toUpperCase() + court.caseType.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(court.status)}
                        <span className="text-xs font-medium text-gray-600 capitalize">{court.status}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{court.courtName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{court.date} at {court.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{court.judge}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{court.location}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{court.attorney}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                  <FileText className="w-4 h-4 inline mr-1" />{court.notes}
                </p>

                <div className="flex gap-2">
                  {court.reminder && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      📬 Reminder Set
                    </Badge>
                  )}
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
