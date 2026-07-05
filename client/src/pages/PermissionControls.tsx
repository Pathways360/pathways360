import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Lock, Users, Shield, Plus, Trash2, CheckCircle, Clock } from "lucide-react";

interface Permission {
  id: number;
  providerName: string;
  providerRole: string;
  organization: string;
  accessLevel: "view" | "edit" | "admin";
  dataTypes: string[];
  status: "active" | "pending" | "revoked";
  grantedDate: string;
  expiryDate?: string;
  consentStatus: "granted" | "pending" | "denied";
}

const DEMO_PERMISSIONS: Permission[] = [
  {
    id: 1,
    providerName: "Sarah Johnson",
    providerRole: "ECM (Employment Counselor)",
    organization: "WorkForce Development Center",
    accessLevel: "edit",
    dataTypes: ["Employment", "Goals", "Timeline", "Notes"],
    status: "active",
    grantedDate: "2026-06-15",
    expiryDate: "2027-06-15",
    consentStatus: "granted",
  },
  {
    id: 2,
    providerName: "Dr. Michael Chen",
    providerRole: "Mental Health Counselor",
    organization: "Community Mental Health Services",
    accessLevel: "edit",
    dataTypes: ["Mental Health", "Medications", "Timeline", "Notes"],
    status: "active",
    grantedDate: "2026-05-20",
    expiryDate: "2027-05-20",
    consentStatus: "granted",
  },
  {
    id: 3,
    providerName: "Jennifer Martinez",
    providerRole: "Housing Provider",
    organization: "Rapid Rehousing Program",
    accessLevel: "view",
    dataTypes: ["Housing", "Timeline"],
    status: "pending",
    grantedDate: "2026-07-02",
    consentStatus: "pending",
  },
  {
    id: 4,
    providerName: "Officer James Wilson",
    providerRole: "Probation Officer",
    organization: "County Probation Department",
    accessLevel: "view",
    dataTypes: ["Court/Probation", "Timeline", "Alerts"],
    status: "active",
    grantedDate: "2026-04-10",
    expiryDate: "2026-10-10",
    consentStatus: "granted",
  },
];

const ACCESS_LEVELS = [
  { level: "view", label: "View Only", description: "Can view client data" },
  { level: "edit", label: "Edit", description: "Can view and edit client data" },
  { level: "admin", label: "Admin", description: "Full access including permissions" },
];

const DATA_TYPES = [
  "Employment",
  "Mental Health",
  "Housing",
  "Court/Probation",
  "Medications",
  "Recovery",
  "Medical",
  "Goals",
  "Timeline",
  "Notes",
  "Alerts",
  "Referrals",
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "pending":
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case "revoked":
      return <Lock className="w-4 h-4 text-red-600" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "revoked":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getConsentColor = (consent: string) => {
  switch (consent) {
    case "granted":
      return "bg-green-50 border-green-200";
    case "pending":
      return "bg-yellow-50 border-yellow-200";
    case "denied":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

export default function PermissionControls() {
  const [permissions, setPermissions] = useState<Permission[]>(DEMO_PERMISSIONS);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

  const handleRevokePermission = (id: number) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, status: "revoked" } : p));
  };

  const handleApproveConsent = (id: number) => {
    setPermissions(permissions.map(p => p.id === id ? { ...p, consentStatus: "granted", status: "active" } : p));
  };

  const activePermissions = permissions.filter(p => p.status === "active").length;
  const pendingPermissions = permissions.filter(p => p.status === "pending").length;
  const revokedPermissions = permissions.filter(p => p.status === "revoked").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Permission Controls</h2>
          <p className="text-gray-600 mt-1">Manage provider access and data sharing permissions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />Grant Access
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Grant Provider Access</DialogTitle>
              <DialogDescription>Authorize a provider to access client data</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Provider Name</label>
                <input
                  type="text"
                  placeholder="Enter provider name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>ECM Worker</option>
                    <option>Counselor</option>
                    <option>Housing Provider</option>
                    <option>Probation Officer</option>
                    <option>Employment Specialist</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Access Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option>View Only</option>
                    <option>Edit</option>
                    <option>Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Data Access</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {DATA_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDataTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDataTypes([...selectedDataTypes, type]);
                          } else {
                            setSelectedDataTypes(selectedDataTypes.filter(t => t !== type));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                  Grant Access
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            <p className="text-xs text-gray-600 mt-1">Total Providers</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{activePermissions}</p>
            <p className="text-xs text-gray-600 mt-1">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-600">{pendingPermissions}</p>
            <p className="text-xs text-gray-600 mt-1">Pending Consent</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-600">{revokedPermissions}</p>
            <p className="text-xs text-gray-600 mt-1">Revoked</p>
          </CardContent>
        </Card>
      </div>

      {/* Permissions List */}
      <div className="space-y-3">
        {permissions.map(permission => (
          <Card key={permission.id} className={`border-0 shadow-sm hover:shadow-md transition-shadow border ${getConsentColor(permission.consentStatus)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{permission.providerName}</h3>
                    <Badge className={getStatusColor(permission.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(permission.status)}
                        {permission.status.charAt(0).toUpperCase() + permission.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{permission.providerRole} • {permission.organization}</p>
                </div>
                <div className="flex gap-1">
                  {permission.status !== "revoked" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleRevokePermission(permission.id)}
                    >
                      <Lock className="w-4 h-4 text-gray-400" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Access Level</span>
                  <p className="font-medium text-sm text-gray-900 capitalize">{permission.accessLevel}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Granted</span>
                  <p className="font-medium text-sm text-gray-900">{permission.grantedDate}</p>
                </div>
                {permission.expiryDate && (
                  <div>
                    <span className="text-xs text-gray-500">Expires</span>
                    <p className="font-medium text-sm text-gray-900">{permission.expiryDate}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-500">Consent</span>
                  <Badge className={permission.consentStatus === "granted" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                    {permission.consentStatus.charAt(0).toUpperCase() + permission.consentStatus.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Data Access:</p>
                <div className="flex flex-wrap gap-1">
                  {permission.dataTypes.map(type => (
                    <Badge key={type} variant="outline" className="text-xs bg-gray-50">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {permission.consentStatus === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                    onClick={() => handleApproveConsent(permission.id)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Deny
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
