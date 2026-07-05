import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  indication: string;
  sideEffects?: string[];
  compliance: number; // percentage
  lastTaken?: string;
  nextDue?: string;
  status: "active" | "completed" | "discontinued" | "pending";
  notes?: string;
  refillsRemaining?: number;
}

const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 1,
    name: "Methadone",
    dosage: "60mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "2026-01-15",
    indication: "Opioid Use Disorder - Medication-Assisted Treatment",
    compliance: 95,
    lastTaken: "2026-07-04 08:00 AM",
    nextDue: "2026-07-05 08:00 AM",
    status: "active",
    refillsRemaining: 3,
    sideEffects: ["Constipation", "Drowsiness"],
    notes: "Client is compliant and showing good progress. Continue current dose."
  },
  {
    id: 2,
    name: "Sertraline",
    dosage: "100mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Sarah Johnson",
    startDate: "2026-02-01",
    indication: "Depression & Anxiety",
    compliance: 88,
    lastTaken: "2026-07-04 09:30 AM",
    nextDue: "2026-07-05 09:30 AM",
    status: "active",
    refillsRemaining: 2,
    sideEffects: ["Nausea", "Insomnia"],
    notes: "Client reports improved mood. Continue monitoring."
  },
  {
    id: 3,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Patricia Martinez",
    startDate: "2026-03-10",
    indication: "Hypertension",
    compliance: 92,
    lastTaken: "2026-07-04 07:00 AM",
    nextDue: "2026-07-05 07:00 AM",
    status: "active",
    refillsRemaining: 1,
    notes: "Blood pressure well controlled."
  },
  {
    id: 4,
    name: "Naltrexone",
    dosage: "50mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    indication: "Alcohol Use Disorder",
    compliance: 100,
    status: "completed",
    notes: "Completed 2-month course. Client doing well in recovery."
  },
];

export default function MedicationTrackingSection({ clientId }: { clientId: number }) {
  const activeMeds = DEMO_MEDICATIONS.filter(m => m.status === "active");
  const completedMeds = DEMO_MEDICATIONS.filter(m => m.status === "completed" || m.status === "discontinued");

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 90) return "bg-green-100 text-green-700";
    if (compliance >= 75) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "discontinued":
        return "bg-gray-100 text-gray-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Medication Management</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Add Medication
        </Button>
      </div>

      {/* Active Medications */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 text-sm">Current Medications ({activeMeds.length})</h4>
        {activeMeds.length === 0 ? (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <p>No active medications</p>
          </div>
        ) : (
          activeMeds.map(med => (
            <Card key={med.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-teal-600" />
                      <span className="font-semibold text-gray-900">{med.name}</span>
                      <Badge className={`text-xs ${getStatusColor(med.status)}`}>
                        {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Dosage</p>
                        <p className="font-medium text-gray-900">{med.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Frequency</p>
                        <p className="font-medium text-gray-900">{med.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Prescribed By</p>
                        <p className="font-medium text-gray-900">{med.prescribedBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Indication</p>
                        <p className="font-medium text-gray-900">{med.indication}</p>
                      </div>
                    </div>

                    {/* Compliance & Status */}
                    <div className="flex gap-3 mb-3">
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${getComplianceColor(med.compliance)}`}>
                        <CheckCircle className="w-3 h-3" />
                        {med.compliance}% Compliant
                      </div>
                      {med.lastTaken && (
                        <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                          <Clock className="w-3 h-3" />
                          Last: {new Date(med.lastTaken).toLocaleTimeString()}
                        </div>
                      )}
                      {med.refillsRemaining !== undefined && (
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${med.refillsRemaining > 1 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                          <AlertCircle className="w-3 h-3" />
                          {med.refillsRemaining} Refills
                        </div>
                      )}
                    </div>

                    {/* Side Effects */}
                    {med.sideEffects && med.sideEffects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Known Side Effects:</p>
                        <div className="flex flex-wrap gap-1">
                          {med.sideEffects.map((effect, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-orange-50">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {med.notes && (
                      <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded border border-blue-200">
                        <p className="font-medium text-gray-900 mb-1">Notes:</p>
                        <p>{med.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-200">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs flex-1">
                    Log Dose
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs flex-1">
                    Refill Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Completed/Discontinued Medications */}
      {completedMeds.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Completed/Discontinued</h4>
          <div className="space-y-2">
            {completedMeds.map(med => (
              <Card key={med.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{med.name}</p>
                      <p className="text-xs text-gray-600">{med.dosage} • {med.indication}</p>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(med.status)}`}>
                      {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
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
