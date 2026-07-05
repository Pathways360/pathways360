import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";

interface Referral {
  id: number;
  service: string;
  provider: string;
  referralDate: string;
  dueDate: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "declined";
  notes: string;
  followUpDate?: string;
}

const DEMO_REFERRALS: Referral[] = [
  {
    id: 1,
    service: "Employment Training Program",
    provider: "WorkForce Development Center",
    referralDate: "2026-06-20",
    dueDate: "2026-07-20",
    status: "in_progress",
    notes: "Client attending 3x per week. Showing good progress.",
    followUpDate: "2026-07-10",
  },
  {
    id: 2,
    service: "Mental Health Counseling",
    provider: "Community Mental Health Services",
    referralDate: "2026-06-15",
    dueDate: "2026-07-15",
    status: "completed",
    notes: "Client completed 8 sessions. Discharged with positive outcomes.",
  },
  {
    id: 3,
    service: "Housing Assistance",
    provider: "Rapid Rehousing Program",
    referralDate: "2026-06-25",
    dueDate: "2026-07-25",
    status: "pending",
    notes: "Awaiting provider response.",
  },
  {
    id: 4,
    service: "Substance Use Treatment",
    provider: "Regional Treatment Center",
    referralDate: "2026-06-10",
    dueDate: "2026-07-10",
    status: "declined",
    notes: "Provider at capacity. Alternative referral being made.",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "declined":
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700";
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "declined":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface ReferralTrackerProps {
  clientId: number;
}

export default function ReferralTracker({ clientId }: ReferralTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Referrals</h3>
          <p className="text-xs text-gray-500 mt-1">Track service referrals and outcomes</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />New Referral
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{DEMO_REFERRALS.filter(r => r.status === "in_progress").length}</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{DEMO_REFERRALS.filter(r => r.status === "pending").length}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{DEMO_REFERRALS.filter(r => r.status === "completed").length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{DEMO_REFERRALS.filter(r => r.status === "declined").length}</p>
            <p className="text-xs text-gray-600">Declined</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <div className="space-y-3">
        {DEMO_REFERRALS.map(referral => (
          <Card key={referral.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{referral.service}</h4>
                    <Badge className={getStatusColor(referral.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(referral.status)}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1).replace("_", " ")}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{referral.provider}</p>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  <Send className="w-3 h-3 mr-1" />Follow Up
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                <div>
                  <span className="text-xs text-gray-500">Referred</span>
                  <p className="font-medium">{referral.referralDate}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Due Date</span>
                  <p className="font-medium">{referral.dueDate}</p>
                </div>
                {referral.followUpDate && (
                  <div>
                    <span className="text-xs text-gray-500">Follow Up</span>
                    <p className="font-medium">{referral.followUpDate}</p>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-700 mb-2">{referral.notes}</p>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">View Details</Button>
                <Button size="sm" variant="outline" className="text-xs">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
