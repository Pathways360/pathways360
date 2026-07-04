import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Users, Zap, AlertTriangle, MessageSquare, BookOpen, Star, ArrowRight } from "lucide-react";

export default function ECMPortal() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"clients"|"recommendations"|"resources">("clients");

  const { data: clients = [] } = trpc.caseManager.getClients.useQuery(undefined, { enabled: isAuthenticated });

  const role = (user as any)?.role;
  if (!isAuthenticated || role !== "ecm_worker") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h2 className="font-bold text-lg">Access Restricted</h2>
          <p className="text-muted-foreground text-sm mt-1">This portal is for ECM Workers only.</p>
          <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const highNeedClients = (clients as any[]).filter((c: any) =>
    c.profile?.housingStatus?.toLowerCase().includes("unsheltered") ||
    c.profile?.housingStatus?.toLowerCase().includes("shelter") ||
    c.profile?.onProbationOrParole
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-violet-700 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">ECM Worker Portal</h1>
              <p className="text-violet-200 text-sm mt-0.5">Enhanced Care Management — {(user as any)?.name}</p>
            </div>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/messaging")}>
              <MessageSquare className="w-4 h-4 mr-1" /> Messages
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "Active Clients", value: clients.length, icon: <Users className="w-4 h-4" /> },
              { label: "High Need", value: highNeedClients.length, icon: <AlertTriangle className="w-4 h-4" />, alert: highNeedClients.length > 0 },
              { label: "ECM Eligible Resources", value: 24, icon: <Star className="w-4 h-4" /> },
            ].map(stat => (
              <div key={stat.label} className={`rounded-xl p-3 ${stat.alert ? "bg-orange-500" : "bg-white/10"}`}>
                <div className="flex items-center gap-1.5 text-xs text-violet-100 mb-1">{stat.icon}{stat.label}</div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 flex gap-0">
          {(["clients","recommendations","resources"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-violet-600 text-violet-600" : "border-transparent text-muted-foreground hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {activeTab === "clients" && (
          <div className="space-y-3">
            {highNeedClients.length > 0 && (
              <div>
                <h2 className="font-semibold text-sm text-orange-600 uppercase tracking-wide mb-2">⚡ High Need ({highNeedClients.length})</h2>
                <div className="space-y-2">
                  {highNeedClients.map((client: any) => (
                    <div key={client.id} className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-orange-700 mt-0.5">{client.profile?.housingStatus}</p>
                        <div className="flex gap-1 mt-1">
                          {client.profile?.onProbationOrParole && <Badge className="bg-blue-100 text-blue-800 text-xs">Probation/Parole</Badge>}
                          {client.profile?.drugOfChoice && <Badge className="bg-purple-100 text-purple-800 text-xs">Recovery</Badge>}
                        </div>
                      </div>
                      <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white gap-1" onClick={() => navigate("/provider-portal")}>
                        Profile <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">All Clients ({clients.length})</h2>
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
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/provider-portal")} className="gap-1">
                    View <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "recommendations" && (
          <div className="bg-white rounded-xl border p-6 text-center">
            <Zap className="w-10 h-10 text-violet-400 mx-auto mb-3" />
            <p className="font-medium">AI Resource Recommendations</p>
            <p className="text-sm text-muted-foreground mt-1">Select a client from the Clients tab, then open their Shared Client Profile to see personalized resource recommendations.</p>
            <Button className="mt-4 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => navigate("/provider-portal")}>
              Open Provider Portal
            </Button>
          </div>
        )}
        {activeTab === "resources" && (
          <div className="space-y-3">
            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white gap-2" onClick={() => navigate("/county-directory")}>
              <BookOpen className="w-4 h-4" /> County Resource Directory
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/provider-portal")}>
              <Users className="w-4 h-4" /> Full Provider Portal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
