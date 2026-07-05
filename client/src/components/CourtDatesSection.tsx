import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Phone, FileText, AlertCircle } from "lucide-react";

interface CourtDate {
  id: number;
  date: string;
  time: string;
  courtName: string;
  judge?: string;
  caseNumber: string;
  chargeOrReason: string;
  location: string;
  courtOfficer?: string;
  courtOfficerPhone?: string;
  status: "scheduled" | "completed" | "postponed" | "cancelled";
  notes?: string;
  clientPrepared: boolean;
  transportationArranged: boolean;
  documents: string[];
}

const DEMO_COURT_DATES: CourtDate[] = [
  {
    id: 1,
    date: "2026-07-15",
    time: "09:00 AM",
    courtName: "Butte County Superior Court",
    judge: "Judge Patricia Martinez",
    caseNumber: "2024-CV-12345",
    chargeOrReason: "Probation Review Hearing",
    location: "Courtroom 3, 1st Floor",
    courtOfficer: "Officer James Wilson",
    courtOfficerPhone: "(530) 555-1234",
    status: "scheduled",
    clientPrepared: true,
    transportationArranged: true,
    documents: ["Progress Report", "Employment Verification", "Housing Lease"],
    notes: "Client is on track with probation requirements. Recommend continuation of current support plan."
  },
  {
    id: 2,
    date: "2026-08-10",
    time: "02:00 PM",
    courtName: "Butte County Superior Court",
    judge: "Judge Robert Chen",
    caseNumber: "2024-CV-12346",
    chargeOrReason: "CPS Permanency Hearing",
    location: "Courtroom 1, 2nd Floor",
    status: "scheduled",
    clientPrepared: false,
    transportationArranged: false,
    documents: ["Case Plan", "Visitation Records"],
    notes: "Preparing documentation for family reunification hearing."
  },
  {
    id: 3,
    date: "2026-06-20",
    time: "10:30 AM",
    courtName: "Butte County Superior Court",
    judge: "Judge Sarah Johnson",
    caseNumber: "2024-CV-12344",
    chargeOrReason: "Probation Check-in",
    location: "Courtroom 2, 1st Floor",
    status: "completed",
    clientPrepared: true,
    transportationArranged: true,
    documents: ["Monthly Report", "Drug Test Results"],
  },
];

export default function CourtDatesSection({ clientId }: { clientId: number }) {
  const upcomingDates = DEMO_COURT_DATES.filter(d => new Date(d.date) > new Date() && d.status !== "cancelled");
  const pastDates = DEMO_COURT_DATES.filter(d => new Date(d.date) <= new Date() || d.status === "completed");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "postponed":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Court Dates & Hearings</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Add Court Date
        </Button>
      </div>

      {/* Upcoming Court Dates */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Upcoming Hearings</h4>
        {upcomingDates.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <p>No upcoming court dates scheduled</p>
          </div>
        ) : (
          upcomingDates.map(courtDate => (
            <Card key={courtDate.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-gray-900">{courtDate.chargeOrReason}</span>
                      <Badge className={`text-xs ${getStatusColor(courtDate.status)}`}>
                        {courtDate.status.charAt(0).toUpperCase() + courtDate.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(courtDate.date).toLocaleDateString()} at {courtDate.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{courtDate.courtName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        <span>Case #{courtDate.caseNumber}</span>
                      </div>
                      {courtDate.judge && (
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          <span>{courtDate.judge}</span>
                        </div>
                      )}
                    </div>

                    {/* Preparation Status */}
                    <div className="flex gap-3 mb-3">
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${courtDate.clientPrepared ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        <AlertCircle className="w-3 h-3" />
                        {courtDate.clientPrepared ? "Client Prepared" : "Preparation Needed"}
                      </div>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${courtDate.transportationArranged ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                        <AlertCircle className="w-3 h-3" />
                        {courtDate.transportationArranged ? "Transportation Arranged" : "Transportation Needed"}
                      </div>
                    </div>

                    {/* Documents */}
                    {courtDate.documents.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Required Documents:</p>
                        <div className="flex flex-wrap gap-1">
                          {courtDate.documents.map((doc, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Court Officer Contact */}
                    {courtDate.courtOfficer && (
                      <div className="text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded">
                        <p className="font-medium text-gray-900">{courtDate.courtOfficer}</p>
                        {courtDate.courtOfficerPhone && (
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{courtDate.courtOfficerPhone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {courtDate.notes && (
                      <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="font-medium text-gray-900 mb-1">Notes:</p>
                        <p>{courtDate.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Send Reminder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Past Court Dates */}
      {pastDates.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Past Hearings</h4>
          <div className="space-y-2">
            {pastDates.map(courtDate => (
              <Card key={courtDate.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{courtDate.chargeOrReason}</p>
                      <p className="text-xs text-gray-600">{new Date(courtDate.date).toLocaleDateString()} • {courtDate.courtName}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(courtDate.status)}`}>
                      {courtDate.status.charAt(0).toUpperCase() + courtDate.status.slice(1)}
                    </Badge>
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
