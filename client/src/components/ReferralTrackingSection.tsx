import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, Clock, XCircle, FileText, User, Calendar, MessageSquare } from "lucide-react";

interface Referral {
  id: number;
  referralType: string;
  referringAgency: string;
  receivingAgency: string;
  referringStaff: string;
  receivingStaff?: string;
  dateReferred: string;
  dateAccepted?: string;
  dateCompleted?: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "denied";
  reason: string;
  notes?: string;
  roiAttached: boolean;
  consentObtained: boolean;
  priority: "high" | "medium" | "low";
}

const DEMO_REFERRALS: Referral[] = [
  {
    id: 1,
    referralType: "Employment Services",
    referringAgency: "Case Management",
    receivingAgency: "Workforce Development",
    referringStaff: "Sarah Martinez",
    receivingStaff: "John Smith",
    dateReferred: "2026-06-20",
    dateAccepted: "2026-06-22",
    status: "in_progress",
    reason: "Client needs job training and placement assistance",
    notes: "Client has completed GED. Ready for employment training.",
    roiAttached: true,
    consentObtained: true,
    priority: "high"
  },
  {
    id: 2,
    referralType: "Housing Assistance",
    referringAgency: "Case Management",
    receivingAgency: "Housing Authority",
    referringStaff: "Sarah Martinez",
    receivingStaff: "Jennifer Lee",
    dateReferred: "2026-06-25",
    dateAccepted: "2026-06-27",
    status: "in_progress",
    reason: "Client needs stable housing",
    notes: "Current lease expires August 4, 2026. Seeking affordable housing options.",
    roiAttached: true,
    consentObtained: true,
    priority: "high"
  },
  {
    id: 3,
    referralType: "Mental Health Counseling",
    referringAgency: "Medical Services",
    receivingAgency: "Mental Health Services",
    referringStaff: "Dr. Michael Chen",
    receivingStaff: "Dr. Patricia Johnson",
    dateReferred: "2026-07-01",
    dateAccepted: "2026-07-02",
    status: "in_progress",
    reason: "Client needs ongoing mental health support",
    notes: "Client reports anxiety and depression. Recommend weekly therapy.",
    roiAttached: true,
    consentObtained: true,
    priority: "medium"
  },
  {
    id: 4,
    referralType: "Family Reunification",
    referringAgency: "CPS",
    receivingAgency: "Family Services",
    referringStaff: "Officer James Wilson",
    dateReferred: "2026-05-15",
    dateAccepted: "2026-05-18",
    dateCompleted: "2026-06-30",
    status: "completed",
    reason: "Support family reunification process",
    notes: "Successful reunification with children. Ongoing support continuing.",
    roiAttached: true,
    consentObtained: true,
    priority: "high"
  },
  {
    id: 5,
    referralType: "Substance Abuse Treatment",
    referringAgency: "Probation",
    receivingAgency: "Treatment Services",
    referringStaff: "Officer James Wilson",
    dateReferred: "2026-06-10",
    status: "pending",
    reason: "Court-ordered substance abuse treatment",
    notes: "Pending acceptance. Waiting for treatment slot availability.",
    roiAttached: true,
    consentObtained: true,
    priority: "high"
  },
  {
    id: 6,
    referralType: "Legal Aid",
    referringAgency: "Case Management",
    receivingAgency: "Legal Services",
    referringStaff: "Sarah Martinez",
    dateReferred: "2026-06-28",
    status: "denied",
    reason: "Client needs legal representation for court case",
    notes: "Referral denied - client income exceeds eligibility threshold. Recommended private attorney.",
    roiAttached: false,
    consentObtained: false,
    priority: "medium"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "accepted":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "denied":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "accepted":
      return <CheckCircle className="w-4 h-4" />;
    case "in_progress":
      return <Send className="w-4 h-4" />;
    case "completed":
      return <CheckCircle className="w-4 h-4" />;
    case "denied":
      return <XCircle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700";
    case "medium":
      return "bg-yellow-50 text-yellow-700";
    case "low":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export default function ReferralTrackingSection({ clientId }: { clientId: number }) {
  const pendingReferrals = DEMO_REFERRALS.filter(r => r.status === "pending");
  const activeReferrals = DEMO_REFERRALS.filter(r => ["accepted", "in_progress"].includes(r.status));
  const completedReferrals = DEMO_REFERRALS.filter(r => r.status === "completed");
  const deniedReferrals = DEMO_REFERRALS.filter(r => r.status === "denied");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Referrals & Coordination</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Send Referral
        </Button>
      </div>

      {/* Referral Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingReferrals.length}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">{activeReferrals.length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{completedReferrals.length}</p>
            <p className="text-xs text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{deniedReferrals.length}</p>
            <p className="text-xs text-gray-600">Denied</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Referrals */}
      {pendingReferrals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Pending Acceptance ({pendingReferrals.length})</h4>
          <div className="space-y-2">
            {pendingReferrals.map(referral => (
              <Card key={referral.id} className="border-0 shadow-sm border-l-4 border-l-yellow-400">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{referral.referralType}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <User className="w-3 h-3" />
                        <span>{referral.referringAgency} → {referral.receivingAgency}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(referral.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(referral.status)}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </div>
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{referral.reason}</p>

                  <div className="flex flex-wrap gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      Referred: {new Date(referral.dateReferred).toLocaleDateString()}
                    </div>
                    <Badge className={getPriorityColor(referral.priority)}>
                      {referral.priority.charAt(0).toUpperCase() + referral.priority.slice(1)} Priority
                    </Badge>
                  </div>

                  {referral.notes && (
                    <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded mb-2">
                      <p className="font-medium text-gray-900 mb-1">Notes:</p>
                      <p>{referral.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 text-xs mb-2">
                    {referral.roiAttached && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ ROI Attached</Badge>
                    )}
                    {referral.consentObtained && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">✓ Consent Obtained</Badge>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs flex-1">
                      Follow Up
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Send Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Active Referrals */}
      {activeReferrals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Active Referrals ({activeReferrals.length})</h4>
          <div className="space-y-2">
            {activeReferrals.map(referral => (
              <Card key={referral.id} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{referral.referralType}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        <User className="w-3 h-3" />
                        <span>{referral.referringAgency} → {referral.receivingAgency}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(referral.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(referral.status)}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </div>
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 mb-2">{referral.reason}</p>

                  <div className="flex flex-wrap gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      Accepted: {referral.dateAccepted ? new Date(referral.dateAccepted).toLocaleDateString() : "N/A"}
                    </div>
                    {referral.receivingStaff && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="w-3 h-3" />
                        {referral.receivingStaff}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs flex-1">
                      Update Status
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Referrals */}
      {completedReferrals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Completed ({completedReferrals.length})</h4>
          <div className="space-y-2">
            {completedReferrals.map(referral => (
              <Card key={referral.id} className="border-0 shadow-sm opacity-75">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{referral.referralType}</p>
                      <p className="text-xs text-gray-600">{referral.referringAgency} → {referral.receivingAgency}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Denied Referrals */}
      {deniedReferrals.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Denied ({deniedReferrals.length})</h4>
          <div className="space-y-2">
            {deniedReferrals.map(referral => (
              <Card key={referral.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{referral.referralType}</p>
                      <p className="text-xs text-gray-600">{referral.notes}</p>
                    </div>
                    <Badge className="bg-red-100 text-red-700 text-xs">Denied</Badge>
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
