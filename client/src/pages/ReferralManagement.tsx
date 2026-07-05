import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Send, Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface Referral {
  id: number;
  service: string;
  provider: string;
  referralDate: string;
  dueDate: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "declined";
  notes: string;
  followUpDate?: string;
  outcome?: string;
  clientOutcome?: string;
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
    outcome: "Client engaged, attending sessions regularly",
  },
  {
    id: 2,
    service: "Mental Health Counseling",
    provider: "Community Mental Health Services",
    referralDate: "2026-06-15",
    dueDate: "2026-07-15",
    status: "completed",
    notes: "Client completed 8 sessions. Discharged with positive outcomes.",
    clientOutcome: "Improved coping skills, reduced anxiety symptoms",
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
];

const SERVICE_TYPES = [
  "Employment Training",
  "Mental Health Counseling",
  "Substance Use Treatment",
  "Housing Assistance",
  "Medical Services",
  "Legal Services",
  "Educational Programs",
  "Vocational Rehabilitation",
  "Childcare Services",
  "Transportation",
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

interface ReferralManagementProps {
  clientId: number;
}

export default function ReferralManagement({ clientId }: ReferralManagementProps) {
  const [referrals, setReferrals] = useState<Referral[]>(DEMO_REFERRALS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    service: "",
    provider: "",
    dueDate: "",
    notes: "",
  });

  const handleAddReferral = () => {
    if (formData.service && formData.provider && formData.dueDate) {
      const newReferral: Referral = {
        id: Math.max(...referrals.map(r => r.id), 0) + 1,
        service: formData.service,
        provider: formData.provider,
        referralDate: new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        status: "pending",
        notes: formData.notes,
      };
      setReferrals([...referrals, newReferral]);
      setFormData({ service: "", provider: "", dueDate: "", notes: "" });
      setShowAddDialog(false);
    }
  };

  const handleUpdateStatus = (id: number, newStatus: Referral["status"]) => {
    setReferrals(referrals.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleDeleteReferral = (id: number) => {
    setReferrals(referrals.filter(r => r.id !== id));
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === "pending").length,
    inProgress: referrals.filter(r => r.status === "in_progress").length,
    completed: referrals.filter(r => r.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Referral Management</h2>
          <p className="text-gray-600 mt-1">Create, track, and manage service referrals</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />New Referral
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Referral</DialogTitle>
              <DialogDescription>Add a new service referral for the client</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Service Type</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a service...</option>
                  {SERVICE_TYPES.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Provider Name</label>
                <Input
                  placeholder="e.g., WorkForce Development Center"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
                <Textarea
                  placeholder="Add any notes about this referral..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-20"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddReferral} className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                  Create Referral
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600 mt-1">Total Referrals</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600 mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-gray-600 mt-1">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-600 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals List */}
      <div className="space-y-3">
        {referrals.map(referral => (
          <Card key={referral.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{referral.service}</h3>
                    <Badge className={getStatusColor(referral.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(referral.status)}
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1).replace("_", " ")}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{referral.provider}</p>
                  <p className="text-sm text-gray-700">{referral.notes}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleDeleteReferral(referral.id)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
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

              {referral.status !== "pending" && (
                <div className="space-y-2 mb-3">
                  {referral.outcome && (
                    <div className="p-2 bg-blue-50 rounded text-sm text-blue-900">
                      <p className="text-xs font-medium mb-1">Provider Outcome:</p>
                      <p>{referral.outcome}</p>
                    </div>
                  )}
                  {referral.clientOutcome && (
                    <div className="p-2 bg-green-50 rounded text-sm text-green-900">
                      <p className="text-xs font-medium mb-1">Client Outcome:</p>
                      <p>{referral.clientOutcome}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status Update Buttons */}
              {referral.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    onClick={() => handleUpdateStatus(referral.id, "accepted")}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => handleUpdateStatus(referral.id, "declined")}
                  >
                    Decline
                  </Button>
                </div>
              )}
              {referral.status === "accepted" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  onClick={() => handleUpdateStatus(referral.id, "in_progress")}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />Start Service
                </Button>
              )}
              {referral.status === "in_progress" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={() => handleUpdateStatus(referral.id, "completed")}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />Mark Complete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
