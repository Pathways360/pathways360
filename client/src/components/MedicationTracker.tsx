import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, AlertCircle, CheckCircle, Plus, Clock } from "lucide-react";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  prescriber: string;
  startDate: string;
  endDate?: string;
  compliance: number; // percentage
  sideEffects: string[];
  monitoring: string;
  refillDate: string;
  status: "active" | "discontinued" | "pending";
}

const DEMO_MEDICATIONS: Medication[] = [
  {
    id: 1,
    name: "Methadone",
    dosage: "60mg",
    frequency: "Daily",
    prescriber: "Dr. Sarah Chen, MD",
    startDate: "2025-06-15",
    compliance: 95,
    sideEffects: ["Drowsiness", "Constipation"],
    monitoring: "Weekly drug screens, vital signs",
    refillDate: "2026-07-15",
    status: "active",
  },
  {
    id: 2,
    name: "Sertraline",
    dosage: "100mg",
    frequency: "Once daily",
    prescriber: "Dr. Michael Rodriguez, MD",
    startDate: "2025-03-01",
    compliance: 88,
    sideEffects: ["Nausea (mild)", "Insomnia"],
    monitoring: "Monthly check-ins",
    refillDate: "2026-07-20",
    status: "active",
  },
];

interface MedicationTrackerProps {
  clientId: number;
}

export default function MedicationTracker({ clientId }: MedicationTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Medications</h3>
          <p className="text-xs text-gray-500 mt-1">Track medications and compliance</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Add Medication
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_MEDICATIONS.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <Pill className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No medications recorded</p>
            </CardContent>
          </Card>
        ) : (
          DEMO_MEDICATIONS.map(med => (
            <Card key={med.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <Badge className={med.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-teal-600">{med.compliance}%</div>
                    <p className="text-xs text-gray-500">Compliance</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div>
                    <span className="text-xs text-gray-500">Prescriber</span>
                    <p className="font-medium">{med.prescriber}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Monitoring</span>
                    <p className="font-medium">{med.monitoring}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Started</span>
                    <p className="font-medium">{med.startDate}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Refill: {med.refillDate}</span>
                  </div>
                </div>

                {med.sideEffects.length > 0 && (
                  <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs font-medium text-yellow-900 mb-1">Side Effects:</p>
                    <div className="flex flex-wrap gap-1">
                      {med.sideEffects.map((effect, i) => (
                        <Badge key={i} variant="outline" className="text-xs bg-yellow-50">{effect}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                  <Button size="sm" variant="outline" className="text-xs">View History</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
