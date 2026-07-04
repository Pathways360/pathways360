import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Users, FileText, AlertTriangle, Calendar, Plus, CheckCircle, Clock, Shield, BookOpen } from "lucide-react";

const GAP_LABELS: Record<string, string> = {
  probation_compliance_risk: "Compliance Risk", no_housing_plan: "No Housing Plan",
  no_income: "No Income", no_government_id: "No Government ID",
  no_mental_health_provider: "No Mental Health Provider",
  no_substance_use_treatment: "No Substance Use Treatment",
  crisis_risk: "Crisis Risk", other: "Other",
};

const NOTE_TYPES = [
  { value: "progress", label: "Progress Note" }, { value: "concern", label: "Concern" },
  { value: "legal_update", label: "Legal Update" }, { value: "housing_update", label: "Housing Update" },
  { value: "recovery_update", label: "Recovery Update" }, { value: "general", label: "General" },
];

export default function ProbationPortal() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"roster" | "profile" | "notes" | "schedule" | "resources">("roster");
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [scheduleForm, setScheduleForm] = useState({ title: "", date: "", time: "", location: "" });
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [flagGap, setFlagGap] = useState("");

  const { data: clients = [], isLoading: clientsLoading } = trpc.caseManager.getAllClients.useQuery(undefined, { enabled: isAuthenticated });
  const { data: clientData, refetch: refetchClient } = trpc.caseManager.getClientProfile.useQuery(
    { clientId: selectedClientId! }, { enabled: !!selectedClientId }
  );
  const { data: notes = [], refetch: refetchNotes } = trpc.caseManager.getNotes.useQuery(
    { clientId: selectedClientId! }, { enabled: !!selectedClientId }
  );

  const addNote = trpc.caseManager.addNote.useMutation({
    onSuccess: () => { refetchNotes(); setNoteContent(""); toast.success("Note added."); },
    onError: () => toast.error("Failed to add note."),
  });
  const scheduleAppt = trpc.appointments.scheduleForClient.useMutation({
    onSuccess: () => { refetchClient(); setShowScheduleForm(false); setScheduleForm({ title: "", date: "", time: "", location: "" }); toast.success("Appointment scheduled."); },
    onError: () => toast.error("Failed to schedule."),
  });
  const flagGapMutation = trpc.caseManager.flagGap.useMutation({
    onSuccess: () => { refetchClient(); setFlagGap(""); toast.success("Gap flagged."); },
    onError: () => toast.error("Failed to flag gap."),
  });

  const selectedClient = (clients as any[]).find((c: any) => c.id === selectedClientId);
  const role = (user as any)?.role;

  if (!isAuthenticated || !["probation_officer", "admin"].includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Access restricted to probation officers.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-base">Probation Officer Portal</h1>
            <p className="text-xs text-muted-foreground">Compliance tracking &amp; case management · {(user as any)?.name}</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800 text-xs">Probation Officer</Badge>
        </div>
        <div className="max-w-5xl mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {[
            { id: "roster", label: "Roster", icon: <Users className="w-3.5 h-3.5" /> },
            { id: "profile", label: "Profile", icon: <FileText className="w-3.5 h-3.5" /> },
            { id: "notes", label: "Notes", icon: <FileText className="w-3.5 h-3.5" /> },
            { id: "schedule", label: "Schedule", icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: "resources", label: "Resources", icon: <BookOpen className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {activeTab === "roster" && (
          <div>
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Client Roster ({(clients as any[]).length})
            </h2>
            {clientsLoading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl border animate-pulse" />)}</div>
            ) : (clients as any[]).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No clients yet. Clients will appear here once they register.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(clients as any[]).map((client: any) => (
                  <div key={client.id} onClick={() => { setSelectedClientId(client.id); setActiveTab("profile"); }}
                    className="bg-white rounded-xl border p-3 flex items-center justify-between cursor-pointer hover:border-orange-300 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm">
                        {(client.name || "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{client.name}</p>
                        <p className="text-xs text-muted-foreground">Joined {new Date(client.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge className="bg-orange-50 text-orange-700 text-xs">View →</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-4">
            {!selectedClientId ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a client from the roster to view their profile.</p>
                <Button variant="outline" className="mt-3" onClick={() => setActiveTab("roster")}>Go to Roster</Button>
              </div>
            ) : !clientData ? (
              <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl border animate-pulse" />)}</div>
            ) : (
              <>
                <div className="bg-white rounded-xl border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                      {(selectedClient?.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{selectedClient?.name}</h3>
                      <p className="text-xs text-muted-foreground">Client ID #{selectedClientId}</p>
                    </div>
                  </div>
                  {clientData.profile && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {clientData.profile.phone && <div><span className="text-muted-foreground text-xs block">Phone</span><p className="font-medium">{clientData.profile.phone}</p></div>}
                      {clientData.profile.housingStatus && <div><span className="text-muted-foreground text-xs block">Housing</span><p className="font-medium capitalize">{clientData.profile.housingStatus.replace(/_/g," ")}</p></div>}
                      {clientData.profile.employmentStatus && <div><span className="text-muted-foreground text-xs block">Employment</span><p className="font-medium capitalize">{clientData.profile.employmentStatus.replace(/_/g," ")}</p></div>}
                      <div><span className="text-muted-foreground text-xs block">Probation/Parole</span><p className="font-medium">{clientData.profile.onProbationOrParole ? "Yes" : "No"}</p></div>
                    </div>
                  )}
                </div>
                {clientData.gapFlags.length > 0 && (
                  <div className="bg-white rounded-xl border p-4">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-amber-500" />Active Gap Flags</h4>
                    <div className="flex flex-wrap gap-2">
                      {clientData.gapFlags.map((g: any) => (
                        <Badge key={g.id} className={`text-xs ${g.severity === "critical" ? "bg-red-100 text-red-800" : g.severity === "high" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {GAP_LABELS[g.gapCategory] || g.gapCategory}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-white rounded-xl border p-4">
                  <h4 className="font-semibold text-sm mb-2">Flag a Care Gap</h4>
                  <div className="flex gap-2">
                    <Select value={flagGap} onValueChange={setFlagGap}>
                      <SelectTrigger className="flex-1 h-9 text-sm"><SelectValue placeholder="Select gap..." /></SelectTrigger>
                      <SelectContent>{Object.entries(GAP_LABELS).map(([v,l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                    <Button size="sm" disabled={!flagGap || flagGapMutation.isPending}
                      onClick={() => flagGapMutation.mutate({ clientId: selectedClientId!, gapCategory: flagGap as any, severity: "high" })}
                      className="bg-orange-600 hover:bg-orange-700 text-white">Flag</Button>
                  </div>
                </div>
                {clientData.goals.length > 0 && (
                  <div className="bg-white rounded-xl border p-4">
                    <h4 className="font-semibold text-sm mb-2">Goals ({clientData.goals.length})</h4>
                    <div className="space-y-1.5">
                      {clientData.goals.map((g: any) => (
                        <div key={g.id} className="flex items-center gap-2 text-sm">
                          {g.status === "completed" ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                          <span className={g.status === "completed" ? "line-through text-muted-foreground" : ""}>{g.title}</span>
                          <Badge className="ml-auto text-xs bg-gray-100 text-gray-700 capitalize">{g.status.replace(/_/g," ")}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            {!selectedClientId ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a client first.</p>
                <Button variant="outline" className="mt-3" onClick={() => setActiveTab("roster")}>Go to Roster</Button>
              </div>
            ) : (
              <>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Add Note for {selectedClient?.name}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={noteType} onValueChange={setNoteType}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{NOTE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                    </Select>
                    <Textarea placeholder="Enter case note..." value={noteContent} onChange={e => setNoteContent(e.target.value)} rows={3} className="text-sm" />
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={!noteContent.trim() || addNote.isPending}
                      onClick={() => addNote.mutate({ clientId: selectedClientId!, content: noteContent, noteType: noteType as any })}>
                      <Plus className="w-4 h-4 mr-1" />{addNote.isPending ? "Saving..." : "Add Note"}
                    </Button>
                  </CardContent>
                </Card>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Notes ({(notes as any[]).length})</h3>
                  {(notes as any[]).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No notes yet.</div>
                  ) : (
                    (notes as any[]).map((note: any) => (
                      <div key={note.id} className="bg-white rounded-xl border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className="text-xs bg-orange-50 text-orange-700 capitalize">{note.noteType.replace(/_/g," ")}</Badge>
                          <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="space-y-4">
            {!selectedClientId ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Select a client first.</p>
                <Button variant="outline" className="mt-3" onClick={() => setActiveTab("roster")}>Go to Roster</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Schedule for {selectedClient?.name}</h3>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                    <Plus className="w-4 h-4 mr-1" />New Appointment
                  </Button>
                </div>
                {showScheduleForm && (
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <input className="w-full h-9 border rounded-lg px-3 text-sm" placeholder="Title (e.g. Probation Check-in)" value={scheduleForm.title} onChange={e => setScheduleForm(f => ({...f, title: e.target.value}))} />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="date" className="h-9 border rounded-lg px-3 text-sm" value={scheduleForm.date} onChange={e => setScheduleForm(f => ({...f, date: e.target.value}))} />
                        <input type="time" className="h-9 border rounded-lg px-3 text-sm" value={scheduleForm.time} onChange={e => setScheduleForm(f => ({...f, time: e.target.value}))} />
                      </div>
                      <input className="w-full h-9 border rounded-lg px-3 text-sm" placeholder="Location (optional)" value={scheduleForm.location} onChange={e => setScheduleForm(f => ({...f, location: e.target.value}))} />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setShowScheduleForm(false)}>Cancel</Button>
                        <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                          disabled={!scheduleForm.title || !scheduleForm.date || !scheduleForm.time || scheduleAppt.isPending}
                          onClick={() => scheduleAppt.mutate({ clientId: selectedClientId!, title: scheduleForm.title, type: "probation", appointmentDate: new Date(`${scheduleForm.date}T${scheduleForm.time}`).toISOString(), location: scheduleForm.location })}>
                          {scheduleAppt.isPending ? "Scheduling..." : "Schedule"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {clientData?.appointments && clientData.appointments.length > 0 ? (
                  <div className="space-y-2">
                    {clientData.appointments.map((a: any) => (
                      <div key={a.id} className="bg-white rounded-xl border p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(a.appointmentDate).toLocaleString()}{a.location ? ` · ${a.location}` : ""}</p>
                        </div>
                        <Badge className={`text-xs ${a.completed ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>{a.completed ? "Done" : "Upcoming"}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">No appointments yet.</div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Quick access to reentry and probation-specific resources.</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={() => navigate("/county-directory")}>
              <BookOpen className="w-4 h-4" /> Open County Resource Directory
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/community-events")}>
              <Calendar className="w-4 h-4" /> View Community Events
            </Button>
            <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/provider-portal")}>
              <Shield className="w-4 h-4" /> Open Full Provider Portal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
