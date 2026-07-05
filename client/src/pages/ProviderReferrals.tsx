import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, CheckCircle2, Clock, AlertCircle, Plus, Send, FileText } from "lucide-react";
import { toast } from "sonner";

interface Referral {
  id: number;
  clientName: string;
  clientId: number;
  fromProvider: string;
  toProvider: string;
  serviceType: string;
  reason: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdDate: Date;
  targetDate: Date;
  notes: string;
}

const MOCK_REFERRALS: Referral[] = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    clientId: 1,
    fromProvider: "Case Manager",
    toProvider: "Housing Provider",
    serviceType: "Housing Assistance",
    reason: "Client needs stable housing for employment",
    status: "accepted",
    createdDate: new Date(Date.now() - 604800000),
    targetDate: new Date(Date.now() + 604800000),
    notes: "Priority case - client has job offer pending housing",
  },
  {
    id: 2,
    clientName: "Michael Chen",
    clientId: 2,
    fromProvider: "Doctor",
    toProvider: "Counselor",
    serviceType: "Mental Health Counseling",
    reason: "Depression screening positive, needs therapy",
    status: "pending",
    createdDate: new Date(Date.now() - 259200000),
    targetDate: new Date(Date.now() + 259200000),
    notes: "Urgent - client expressing suicidal ideation",
  },
  {
    id: 3,
    clientName: "Jessica Martinez",
    clientId: 3,
    fromProvider: "Counselor",
    toProvider: "Employment Specialist",
    serviceType: "Job Training",
    reason: "Client ready for employment after 6 months sobriety",
    status: "completed",
    createdDate: new Date(Date.now() - 1209600000),
    targetDate: new Date(Date.now() - 604800000),
    notes: "Client successfully placed in entry-level position",
  },
  {
    id: 4,
    clientName: "David Thompson",
    clientId: 4,
    fromProvider: "Probation Officer",
    toProvider: "ECM Worker",
    serviceType: "Benefits Navigation",
    reason: "Client needs Medicaid and food assistance",
    status: "rejected",
    createdDate: new Date(Date.now() - 432000000),
    targetDate: new Date(Date.now() + 259200000),
    notes: "ECM worker at capacity - referred to alternative provider",
  },
];

const SERVICE_TYPES = [
  "Housing Assistance",
  "Mental Health Counseling",
  "Job Training",
  "Benefits Navigation",
  "Medical Care",
  "Substance Abuse Treatment",
  "Legal Services",
  "Transportation",
  "Childcare",
  "Other",
];

const PROVIDERS = [
  "Case Manager",
  "Counselor",
  "Doctor",
  "Housing Provider",
  "Employment Specialist",
  "ECM Worker",
  "Probation Officer",
  "Peer Support Specialist",
];

export default function ProviderReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewReferral, setShowNewReferral] = useState(false);
  const [newReferral, setNewReferral] = useState({
    clientName: "",
    toProvider: "",
    serviceType: "",
    reason: "",
    notes: "",
  });

  const filteredReferrals = filterStatus === "all" 
    ? referrals 
    : referrals.filter(r => r.status === filterStatus);

  const handleCreateReferral = () => {
    if (!newReferral.clientName || !newReferral.toProvider || !newReferral.serviceType) {
      toast.error("Please fill in all required fields");
      return;
    }

    const referral: Referral = {
      id: Math.max(...referrals.map(r => r.id), 0) + 1,
      clientName: newReferral.clientName,
      clientId: Math.floor(Math.random() * 1000),
      fromProvider: "Your Organization",
      toProvider: newReferral.toProvider,
      serviceType: newReferral.serviceType,
      reason: newReferral.reason,
      status: "pending",
      createdDate: new Date(),
      targetDate: new Date(Date.now() + 604800000),
      notes: newReferral.notes,
    };

    setReferrals([...referrals, referral]);
    setNewReferral({ clientName: "", toProvider: "", serviceType: "", reason: "", notes: "" });
    setShowNewReferral(false);
    toast.success("Referral created successfully");
  };

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setReferrals(referrals.map(r => 
      r.id === id ? { ...r, status: newStatus as any } : r
    ));
    toast.success("Referral status updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "accepted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "accepted": return <CheckCircle2 className="w-4 h-4" />;
      case "rejected": return <AlertCircle className="w-4 h-4" />;
      case "completed": return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    pending: referrals.filter(r => r.status === "pending").length,
    accepted: referrals.filter(r => r.status === "accepted").length,
    rejected: referrals.filter(r => r.status === "rejected").length,
    completed: referrals.filter(r => r.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
            <p className="text-gray-600 mt-2">Send and track client referrals to other providers</p>
          </div>
          <Button 
            onClick={() => setShowNewReferral(!showNewReferral)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Referral
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: stats.pending, color: "bg-yellow-50 text-yellow-700" },
            { label: "Accepted", value: stats.accepted, color: "bg-green-50 text-green-700" },
            { label: "Rejected", value: stats.rejected, color: "bg-red-50 text-red-700" },
            { label: "Completed", value: stats.completed, color: "bg-blue-50 text-blue-700" },
          ].map(stat => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className={`p-4 ${stat.color}`}>
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Referral Form */}
        {showNewReferral && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Create New Referral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Client Name *</label>
                  <Input
                    placeholder="Enter client name"
                    value={newReferral.clientName}
                    onChange={e => setNewReferral({ ...newReferral, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Refer To Provider *</label>
                  <Select value={newReferral.toProvider} onValueChange={v => setNewReferral({ ...newReferral, toProvider: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Service Type *</label>
                  <Select value={newReferral.serviceType} onValueChange={v => setNewReferral({ ...newReferral, serviceType: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Reason</label>
                  <Input
                    placeholder="Why is this referral needed?"
                    value={newReferral.reason}
                    onChange={e => setNewReferral({ ...newReferral, reason: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  placeholder="Additional notes for the receiving provider..."
                  value={newReferral.notes}
                  onChange={e => setNewReferral({ ...newReferral, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateReferral} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Referral
                </Button>
                <Button onClick={() => setShowNewReferral(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <Tabs value={filterStatus} onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="all">All ({referrals.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={filterStatus} className="space-y-4 mt-6">
            {filteredReferrals.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No referrals found</p>
                </CardContent>
              </Card>
            ) : (
              filteredReferrals.map(referral => (
                <Card key={referral.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{referral.clientName}</h3>
                          <Badge variant="outline" className="text-xs">ID: {referral.clientId}</Badge>
                          <Badge className={`text-xs flex items-center gap-1 ${getStatusColor(referral.status)}`}>
                            {getStatusIcon(referral.status)}
                            {referral.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <span className="font-medium">{referral.fromProvider}</span>
                          <ArrowRight className="w-4 h-4" />
                          <span className="font-medium">{referral.toProvider}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Service Type</p>
                            <p className="font-medium">{referral.serviceType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Target Date</p>
                            <p className="font-medium">{referral.targetDate.toLocaleDateString()}</p>
                          </div>
                        </div>

                        {referral.reason && (
                          <div className="mb-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-xs text-gray-500 mb-1">Reason</p>
                            <p className="text-sm text-gray-700">{referral.reason}</p>
                          </div>
                        )}

                        {referral.notes && (
                          <div className="p-3 bg-blue-50 rounded-md">
                            <p className="text-xs text-blue-600 mb-1">Notes</p>
                            <p className="text-sm text-blue-900">{referral.notes}</p>
                          </div>
                        )}
                      </div>

                      {referral.status === "pending" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(referral.id, "accepted")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(referral.id, "rejected")}
                            variant="outline"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
