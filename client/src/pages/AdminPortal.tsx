import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { Users, Shield, CheckCircle, AlertTriangle, BarChart3, Calendar } from "lucide-react";
import { toast } from "sonner";

const ROLES = ["user","case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"] as const;
const ROLE_LABELS: Record<string, string> = {
  user: "Client", case_manager: "Case Manager", ecm_worker: "ECM Worker",
  probation_officer: "Probation Officer", counselor: "Counselor", org_admin: "Org Admin", admin: "Admin"
};
const ROLE_COLORS: Record<string, string> = {
  user: "bg-gray-100 text-gray-800", case_manager: "bg-teal-100 text-teal-800",
  ecm_worker: "bg-violet-100 text-violet-800", probation_officer: "bg-blue-100 text-blue-800",
  counselor: "bg-emerald-100 text-emerald-800", org_admin: "bg-orange-100 text-orange-800",
  admin: "bg-red-100 text-red-800"
};

export default function AdminPortal() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"overview"|"users"|"events">("overview");

  const { data: stats } = trpc.admin.getStats.useQuery(undefined, { enabled: isAuthenticated && (user as any)?.role === "admin" });
  const { data: allUsers = [], refetch: refetchUsers } = trpc.admin.getAllUsers.useQuery(undefined, { enabled: isAuthenticated && (user as any)?.role === "admin" });
  const { data: pendingEvents = [], refetch: refetchEvents } = trpc.admin.getPendingEvents.useQuery(undefined, { enabled: isAuthenticated && (user as any)?.role === "admin" });

  const setRoleMutation = trpc.admin.setUserRole.useMutation({
    onSuccess: () => { refetchUsers(); toast.success("Role updated"); },
    onError: (e) => toast.error(e.message),
  });

  const verifyEventMutation = trpc.admin.verifyEvent.useMutation({
    onSuccess: () => { refetchEvents(); toast.success("Event verified"); },
    onError: (e) => toast.error(e.message),
  });

  const role = (user as any)?.role;
  if (!isAuthenticated || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h2 className="font-bold text-lg">Access Restricted</h2>
          <p className="text-muted-foreground text-sm mt-1">This portal is for System Admins only.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-700 to-rose-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Admin Portal</h1>
              <p className="text-red-200 text-sm mt-0.5">System Administration — {(user as any)?.name}</p>
            </div>
            <Badge className="bg-white/20 text-white">System Admin</Badge>
          </div>
          {stats && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: <Users className="w-4 h-4" /> },
                { label: "Total Goals", value: stats.totalGoals, icon: <CheckCircle className="w-4 h-4" /> },
                { label: "Resources", value: stats.totalResources, icon: <Shield className="w-4 h-4" /> },
                { label: "Events", value: stats.totalEvents, icon: <Calendar className="w-4 h-4" /> },
              ].map(stat => (
                <div key={stat.label} className="bg-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs text-red-100 mb-1">{stat.icon}{stat.label}</div>
                  <p className="text-2xl font-bold">{String(stat.value)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {(["overview","users","events"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-red-600 text-red-600" : "border-transparent text-muted-foreground hover:text-gray-700"}`}>
              {tab === "events" ? `Events (${pendingEvents.length} pending)` : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {activeTab === "overview" && stats && (
          <div className="space-y-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Recent Users</h2>
            <div className="space-y-2">
              {stats.recentUsers.map((u: any) => (
                <div key={u.id} className="bg-white rounded-xl border p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={`text-xs ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-800"}`}>{ROLE_LABELS[u.role] || u.role}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">All Users ({allUsers.length})</h2>
            <div className="space-y-2">
              {(allUsers as any[]).map((u: any) => (
                <div key={u.id} className="bg-white rounded-xl border p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Select value={u.role} onValueChange={(newRole) => setRoleMutation.mutate({ userId: u.id, role: newRole as any })}>
                    <SelectTrigger className="h-8 text-xs w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(r => <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Pending Verification ({pendingEvents.length})</h2>
            {pendingEvents.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">
                <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No events pending verification.</p>
              </div>
            ) : (
              (pendingEvents as any[]).map((event: any) => (
                <div key={event.id} className="bg-white rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.county} · {event.eventType} · {event.location}</p>
                      {event.description && <p className="text-xs text-gray-600 mt-1">{event.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Submitted: {new Date(event.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1 flex-shrink-0"
                      onClick={() => verifyEventMutation.mutate({ eventId: event.id })}
                      disabled={verifyEventMutation.isPending}>
                      <CheckCircle className="w-3 h-3" /> Verify
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
