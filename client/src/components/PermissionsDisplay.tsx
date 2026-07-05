import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, AlertCircle, CheckCircle, Clock, Eye, EyeOff, Trash2 } from "lucide-react";

interface Permission {
  id: number;
  agency: string;
  worker: string;
  accessType: "view_only" | "edit" | "admin";
  roiStatus: "valid" | "expired" | "pending" | "revoked";
  roiExpirationDate: string;
  dateGranted: string;
  dataAccess: string[];
  canEdit: boolean;
  canDelete: boolean;
}

const DEMO_PERMISSIONS: Permission[] = [
  {
    id: 1,
    agency: "Butte County Case Management",
    worker: "Sarah Martinez",
    accessType: "edit",
    roiStatus: "valid",
    roiExpirationDate: "2026-10-15",
    dateGranted: "2026-04-15",
    dataAccess: ["profile", "timeline", "appointments", "notes", "referrals", "alerts"],
    canEdit: true,
    canDelete: false
  },
  {
    id: 2,
    agency: "Butte County Probation",
    worker: "Officer James Wilson",
    accessType: "view_only",
    roiStatus: "valid",
    roiExpirationDate: "2026-12-31",
    dateGranted: "2026-01-10",
    dataAccess: ["profile", "timeline", "appointments", "court_dates", "probation_notes"],
    canEdit: false,
    canDelete: false
  },
  {
    id: 3,
    agency: "Butte County Health Services",
    worker: "Dr. Michael Chen",
    accessType: "edit",
    roiStatus: "valid",
    roiExpirationDate: "2026-09-30",
    dateGranted: "2026-05-01",
    dataAccess: ["profile", "timeline", "appointments", "medication", "medical_notes", "recovery"],
    canEdit: true,
    canDelete: false
  },
  {
    id: 4,
    agency: "Mental Health Services",
    worker: "Dr. Patricia Johnson",
    accessType: "edit",
    roiStatus: "expired",
    roiExpirationDate: "2026-06-15",
    dateGranted: "2026-03-15",
    dataAccess: ["profile", "timeline", "appointments"],
    canEdit: false,
    canDelete: true
  },
  {
    id: 5,
    agency: "Recovery Support Services",
    worker: "Recovery Coach",
    accessType: "view_only",
    roiStatus: "pending",
    roiExpirationDate: "TBD",
    dateGranted: "2026-07-01",
    dataAccess: ["profile", "recovery_milestones", "appointments"],
    canEdit: false,
    canDelete: false
  },
  {
    id: 6,
    agency: "CPS/CFS",
    worker: "Social Worker",
    accessType: "view_only",
    roiStatus: "revoked",
    roiExpirationDate: "2026-06-01",
    dateGranted: "2026-02-01",
    dataAccess: [],
    canEdit: false,
    canDelete: true
  },
];

const getROIStatusColor = (status: string) => {
  switch (status) {
    case "valid":
      return "bg-green-100 text-green-700";
    case "expired":
      return "bg-red-100 text-red-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "revoked":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getROIStatusIcon = (status: string) => {
  switch (status) {
    case "valid":
      return <CheckCircle className="w-4 h-4" />;
    case "expired":
      return <AlertCircle className="w-4 h-4" />;
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "revoked":
      return <Lock className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getAccessTypeColor = (type: string) => {
  switch (type) {
    case "admin":
      return "bg-red-50 text-red-700";
    case "edit":
      return "bg-blue-50 text-blue-700";
    case "view_only":
      return "bg-gray-50 text-gray-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
};

export default function PermissionsDisplay({ clientId }: { clientId: number }) {
  const validPermissions = DEMO_PERMISSIONS.filter(p => p.roiStatus === "valid");
  const expiredPermissions = DEMO_PERMISSIONS.filter(p => p.roiStatus === "expired");
  const pendingPermissions = DEMO_PERMISSIONS.filter(p => p.roiStatus === "pending");
  const revokedPermissions = DEMO_PERMISSIONS.filter(p => p.roiStatus === "revoked");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Access Permissions & ROI</h3>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white text-sm">
          + Grant Access
        </Button>
      </div>

      {/* Permission Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{validPermissions.length}</p>
            <p className="text-xs text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{expiredPermissions.length}</p>
            <p className="text-xs text-gray-600">Expired</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{pendingPermissions.length}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-gray-600">{revokedPermissions.length}</p>
            <p className="text-xs text-gray-600">Revoked</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Permissions */}
      {validPermissions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Active Permissions ({validPermissions.length})</h4>
          <div className="space-y-2">
            {validPermissions.map(perm => (
              <Card key={perm.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{perm.agency}</h4>
                      <p className="text-sm text-gray-600">{perm.worker}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getROIStatusColor(perm.roiStatus)}>
                        <div className="flex items-center gap-1">
                          {getROIStatusIcon(perm.roiStatus)}
                          Valid
                        </div>
                      </Badge>
                      <Badge className={getAccessTypeColor(perm.accessType)}>
                        {perm.accessType === "view_only" ? "View Only" : perm.accessType === "edit" ? "Edit" : "Admin"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-3 h-3" />
                      Expires: {new Date(perm.roiExpirationDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="w-3 h-3" />
                      {perm.dataAccess.length} data types
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {perm.dataAccess.map((access, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs bg-gray-50">
                        {access.replace(/_/g, " ")}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Edit Access
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs flex-1">
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Expired Permissions */}
      {expiredPermissions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Expired ({expiredPermissions.length})</h4>
          <div className="space-y-2">
            {expiredPermissions.map(perm => (
              <Card key={perm.id} className="border-0 shadow-sm border-l-4 border-l-red-400 opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{perm.agency}</h4>
                      <p className="text-sm text-gray-600">{perm.worker}</p>
                      <p className="text-xs text-red-600 mt-1">
                        <AlertCircle className="w-3 h-3 inline mr-1" />
                        Expired on {new Date(perm.roiExpirationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                        Renew
                      </Button>
                      {perm.canDelete && (
                        <Button size="sm" variant="outline" className="text-xs">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Permissions */}
      {pendingPermissions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Pending ROI ({pendingPermissions.length})</h4>
          <div className="space-y-2">
            {pendingPermissions.map(perm => (
              <Card key={perm.id} className="border-0 shadow-sm border-l-4 border-l-yellow-400">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{perm.agency}</h4>
                      <p className="text-sm text-gray-600">{perm.worker}</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Awaiting ROI signature
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Revoked Permissions */}
      {revokedPermissions.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Revoked ({revokedPermissions.length})</h4>
          <div className="space-y-2">
            {revokedPermissions.map(perm => (
              <Card key={perm.id} className="border-0 shadow-sm opacity-60">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{perm.agency}</p>
                      <p className="text-xs text-gray-600">{perm.worker}</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-700 text-xs">Revoked</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Access Control Legend */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 text-sm mb-3">Access Levels</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700"><strong>View Only:</strong> Can view client data but cannot edit</span>
            </div>
            <div className="flex items-center gap-2">
              <Unlock className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700"><strong>Edit:</strong> Can view and edit client data</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-600" />
              <span className="text-gray-700"><strong>Admin:</strong> Full access including permission management</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
