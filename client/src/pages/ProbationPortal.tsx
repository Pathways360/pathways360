import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Users, ClipboardList, AlertTriangle, CheckCircle, Calendar, MessageSquare, BookOpen, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function ProbationPortal() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"clients"|"tasks"|"resources">("clients");

  const { data: clients = [] } = trpc.caseManager.getClients.useQuery(undefined, { enabled: isAuthenticated });
  const tasks: any[] = [];

  const role = (user as any)?.role;
  if (!isAuthenticated || role !== "probation_officer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h2 className="font-bold text-lg">Access Restricted</h2>
          <p className="text-muted-foreground text-sm mt-1">This portal is for Probation Officers only.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const overdueTasks = (tasks as any[]).filter((t: any) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date());
  const upcomingTasks = (tasks as any[]).filter((t: any) => t.status !== "completed" && (!t.dueDate || new Date(t.dueDate) >= new Date()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Probation Officer Portal</h1>
              <p className="text-blue-200 text-sm mt-0.5">Welcome, {(user as any)?.name}</p>
            </div>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/messaging")}>
              <MessageSquare className="w-4 h-4 mr-1" /> Messages
            </Button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Active Cases", value: clients.length, icon: <Users className="w-4 h-4" /> },
              { label: "Overdue Tasks", value: overdueTasks.length, icon: <AlertTriangle className="w-4 h-4" />, alert: overdueTasks.length > 0 },
              { label: "Pending Tasks", value: upcomingTasks.length, icon: <ClipboardList className="w-4 h-4" /> },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl p-3 ${stat.alert ? "bg-red-500" : "bg-white/10"}`}>
                <div className="flex items-center gap-1.5 text-xs text-blue-100 mb-1">{stat.icon}{stat.label}</div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {(["clients","tasks","resources"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {activeTab === "clients" && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Active Cases ({clients.length})</h2>
            {(clients as any[]).length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No clients assigned yet.</p>
              </div>
            ) : (
              (clients as any[]).map((client: any) => (
                <div key={client.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{client.profile?.county || "County unknown"} · {client.profile?.housingStatus || "Housing unknown"}</p>
                    <div className="flex gap-1 mt-1">
                      {client.profile?.onProbationOrParole && <Badge className="bg-blue-100 text-blue-800 text-xs">On Probation</Badge>}
                      {client.profile?.hasMediCal && <Badge className="bg-green-100 text-green-800 text-xs">Medi-Cal</Badge>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/provider-portal`)} className="gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            {overdueTasks.length > 0 && (
              <div>
                <h2 className="font-semibold text-sm text-red-600 uppercase tracking-wide mb-2">⚠ Overdue ({overdueTasks.length})</h2>
                <div className="space-y-2">
                  {overdueTasks.map((task: any) => (
                    <div key={task.id} className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-red-600 mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Upcoming Tasks ({upcomingTasks.length})</h2>
              {upcomingTasks.length === 0 ? (
                <div className="bg-white rounded-xl border p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All tasks up to date!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingTasks.map((task: any) => (
                    <div key={task.id} className="bg-white rounded-xl border p-3">
                      <p className="font-medium text-sm">{task.title}</p>
                      {task.dueDate && <p className="text-xs text-muted-foreground mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Quick access to reentry and probation-specific resources in your county.</p>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2" onClick={() => navigate("/county-directory")}>
              <BookOpen className="w-4 h-4" /> Open County Resource Directory
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/community-events")}>
              <Calendar className="w-4 h-4" /> View Community Events
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
