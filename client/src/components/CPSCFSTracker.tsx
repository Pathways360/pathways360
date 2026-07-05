import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Calendar, FileText, AlertCircle, CheckCircle, Plus, Phone } from "lucide-react";

interface CPSCase {
  id: number;
  caseNumber: string;
  caseWorker: string;
  phone: string;
  children: string[];
  status: "open" | "closed" | "pending" | "investigation";
  custody: "client" | "relative" | "foster" | "shared";
  visitation: string;
  nextHearing: string;
  reunificationGoal: string;
  notes: string;
}

const DEMO_CPS_CASES: CPSCase[] = [
  {
    id: 1,
    caseNumber: "CPS-2024-56789",
    caseWorker: "Jennifer Martinez",
    phone: "(555) 789-0123",
    children: ["Marcus (8)", "Sophia (6)"],
    status: "open",
    custody: "foster",
    visitation: "Supervised visits Saturdays 2-4 PM",
    nextHearing: "2026-08-15",
    reunificationGoal: "Return to client custody within 12 months",
    notes: "Progress on housing stability and employment is positive. Continue current services.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-red-100 text-red-700";
    case "closed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "investigation":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getCustodyLabel = (custody: string) => {
  switch (custody) {
    case "client":
      return "With Client";
    case "relative":
      return "With Relative";
    case "foster":
      return "In Foster Care";
    case "shared":
      return "Shared Custody";
    default:
      return custody;
  }
};

interface CPSCFSTrackerProps {
  clientId: number;
}

export default function CPSCFSTracker({ clientId }: CPSCFSTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Child Welfare (CPS/CFS)</h3>
          <p className="text-xs text-gray-500 mt-1">Track child custody, visitation, and reunification progress</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Add Case
        </Button>
      </div>

      <div className="space-y-3">
        {DEMO_CPS_CASES.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <User className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No CPS/CFS cases</p>
            </CardContent>
          </Card>
        ) : (
          DEMO_CPS_CASES.map(cpsCase => (
            <Card key={cpsCase.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{cpsCase.caseNumber}</h4>
                      <Badge className={getStatusColor(cpsCase.status)}>
                        {cpsCase.status.charAt(0).toUpperCase() + cpsCase.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">Children: {cpsCase.children.join(", ")}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{cpsCase.caseWorker}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${cpsCase.phone}`} className="text-teal-600 hover:underline">{cpsCase.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>Custody: {getCustodyLabel(cpsCase.custody)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Hearing: {cpsCase.nextHearing}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Visitation:</span>
                    <p className="text-gray-700">{cpsCase.visitation}</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Reunification Goal:</span>
                    <p className="text-gray-700">{cpsCase.reunificationGoal}</p>
                  </div>
                  <div className="text-sm p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium text-gray-900">Notes:</span>
                    <p className="text-gray-700">{cpsCase.notes}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                  <Button size="sm" variant="outline" className="text-xs">View Hearings</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
