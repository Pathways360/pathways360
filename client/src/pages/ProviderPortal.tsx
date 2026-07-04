import React, { useState } from "react";
import SharedClientProfile from "./SharedClientProfile";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import {
  ArrowLeft, Users, MessageSquare, CheckSquare, BarChart3,
  Building2, UserCheck, AlertTriangle, Clock, Plus, Send,
  ChevronRight, Search, Bell, FileText, Shield, Settings,
  Home, Briefcase, Heart, Scale, RefreshCw, BookOpen, Car,
  CheckCircle, XCircle, Circle, Flag, Star, Eye, Edit3,
  Phone, Mail, Calendar, TrendingUp, Activity, Award, CalendarPlus
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// ─── Submit Event Button ─────────────────────────────────────────────────────
const EVENT_TYPE_OPTIONS = [
  "meal","food_distribution","food_bank","mobile_pantry","emergency_shelter","winter_shelter",
  "cooling_center","warming_center","mobile_medical","behavioral_health_outreach",
  "medication_clinic","vaccination","clothing_closet","laundry","shower_program",
  "bus_voucher","transportation","dmv_outreach","legal_clinic","expungement_event",
  "job_fair","hiring_event","resume_workshop","training","community_college","education",
  "recovery_meeting","support_group","peer_support","probation_outreach","parole_outreach",
  "resource_fair","disaster_assistance","holiday_program","emergency_alert","faith_based",
  "veterans_event","native_american_services","family_services","other",
];
const COUNTY_OPTIONS = ["butte","shasta","humboldt","tehama","trinity","siskiyou"];

function SubmitEventButton() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "", description: "", eventType: "meal", eventDate: "",
    startTime: "", endTime: "", county: "shasta", city: "",
    address: "", locationName: "", organizationName: "", organizationPhone: "",
    needsCategories: "",
  });
  const submitMutation = trpc.communityEvents.submit.useMutation({
    onSuccess: () => { toast.success("Event submitted for review"); setOpen(false); setForm(f => ({ ...f, title: "", description: "", eventDate: "" })); },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Submit community opportunity">
          <CalendarPlus className="w-5 h-5 text-teal-600" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Submit Community Opportunity</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <div><Label>Title *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g., Free Lunch at Grace Church" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Type *</Label>
              <Select value={form.eventType} onValueChange={v => setForm(f => ({ ...f, eventType: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_TYPE_OPTIONS.map(v => <SelectItem key={v} value={v} className="capitalize">{v.replace(/_/g," ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>County *</Label>
              <Select value={form.county} onValueChange={v => setForm(f => ({ ...f, county: v }))}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{COUNTY_OPTIONS.map(v => <SelectItem key={v} value={v} className="capitalize">{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div><Label>Date *</Label><Input type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} /></div>
            <div><Label>Start</Label><Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
            <div><Label>End</Label><Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>City</Label><Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div><Label>Location Name</Label><Input value={form.locationName} onChange={e => setForm(f => ({ ...f, locationName: e.target.value }))} /></div>
          </div>
          <div><Label>Address</Label><Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Organization</Label><Input value={form.organizationName} onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={form.organizationPhone} onChange={e => setForm(f => ({ ...f, organizationPhone: e.target.value }))} /></div>
          </div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} /></div>
          <div><Label>Needs Categories</Label><Input value={form.needsCategories} onChange={e => setForm(f => ({ ...f, needsCategories: e.target.value }))} placeholder="meals,shelter,medical" /></div>
          <Button className="w-full" onClick={() => submitMutation.mutate(form as any)} disabled={!form.title || !form.eventDate || submitMutation.isPending}>
            {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Role Definitions ─────────────────────────────────────────────────────────
const ROLE_LABELS: Record<string, string> = {
  system_admin: "System Admin",
  county_admin: "County Admin",
  health_plan_admin: "Health Plan Admin",
  probation_supervisor: "Probation Supervisor",
  probation_officer: "Probation Officer",
  behavioral_health_supervisor: "Behavioral Health Supervisor",
  case_manager: "Case Manager",
  ecm_worker: "ECM Worker",
  social_worker: "Social Worker",
  treatment_counselor: "Treatment Counselor",
  housing_navigator: "Housing Navigator",
  peer_support_specialist: "Peer Support Specialist",
  read_only_auditor: "Read-Only Auditor",
};

const ROLE_COLORS: Record<string, string> = {
  system_admin: "bg-red-100 text-red-700",
  county_admin: "bg-purple-100 text-purple-700",
  health_plan_admin: "bg-blue-100 text-blue-700",
  probation_supervisor: "bg-indigo-100 text-indigo-700",
  probation_officer: "bg-indigo-100 text-indigo-700",
  behavioral_health_supervisor: "bg-violet-100 text-violet-700",
  case_manager: "bg-teal-100 text-teal-700",
  ecm_worker: "bg-teal-100 text-teal-700",
  social_worker: "bg-green-100 text-green-700",
  treatment_counselor: "bg-orange-100 text-orange-700",
  housing_navigator: "bg-cyan-100 text-cyan-700",
  peer_support_specialist: "bg-lime-100 text-lime-700",
  read_only_auditor: "bg-gray-100 text-gray-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ReactElement> = {
  pending: <Circle className="w-4 h-4 text-gray-400" />,
  in_progress: <Activity className="w-4 h-4 text-blue-500" />,
  completed: <CheckCircle className="w-4 h-4 text-green-500" />,
  missed: <XCircle className="w-4 h-4 text-red-500" />,
  cancelled: <XCircle className="w-4 h-4 text-gray-400" />,
};

const MILESTONE_LABELS: Record<string, string> = {
  government_id_obtained: "Government ID Obtained",
  benefits_approved: "Benefits Approved",
  housing_secured: "Housing Secured",
  treatment_completed: "Treatment Completed",
  recovery_milestone: "Recovery Milestone",
  employment_obtained: "Employment Obtained",
  income_established: "Income Established",
  education_enrolled: "Education Enrolled",
  transportation_obtained: "Transportation Obtained",
  family_reunification: "Family Reunification",
};

// ─── Demo Data ────────────────────────────────────────────────────────────────
const DEMO_CLIENTS = [
  { id: 101, name: "James T.", initials: "JT", lastActive: "Today", status: "active", riskLevel: "medium", primaryNeeds: ["housing", "employment"], upcomingAppointments: 2, pendingTasks: 3, completedMilestones: 2, totalMilestones: 10, consentGiven: true },
  { id: 102, name: "Maria S.", initials: "MS", lastActive: "Yesterday", status: "active", riskLevel: "low", primaryNeeds: ["medical", "benefits"], upcomingAppointments: 1, pendingTasks: 1, completedMilestones: 5, totalMilestones: 10, consentGiven: true },
  { id: 103, name: "Darnell W.", initials: "DW", lastActive: "3 days ago", status: "at_risk", riskLevel: "high", primaryNeeds: ["recovery", "legal"], upcomingAppointments: 0, pendingTasks: 5, completedMilestones: 1, totalMilestones: 10, consentGiven: true },
  { id: 104, name: "Angela R.", initials: "AR", lastActive: "Today", status: "active", riskLevel: "low", primaryNeeds: ["employment", "education"], upcomingAppointments: 3, pendingTasks: 2, completedMilestones: 7, totalMilestones: 10, consentGiven: true },
  { id: 105, name: "Marcus L.", initials: "ML", lastActive: "1 week ago", status: "inactive", riskLevel: "medium", primaryNeeds: ["housing", "recovery"], upcomingAppointments: 0, pendingTasks: 4, completedMilestones: 3, totalMilestones: 10, consentGiven: false },
];

const DEMO_TASKS: Record<number, any[]> = {
  101: [
    { id: 1, title: "Apply for Section 8 housing voucher", category: "housing", priority: "high", status: "in_progress", dueDate: "2026-07-10", assignedTo: "You", notes: "Client needs help gathering documents" },
    { id: 2, title: "Attend job readiness workshop", category: "employment", priority: "medium", status: "pending", dueDate: "2026-07-15", assignedTo: "You", notes: "" },
    { id: 3, title: "Obtain state ID", category: "identity", priority: "urgent", status: "pending", dueDate: "2026-07-08", assignedTo: "You", notes: "Needs birth certificate first" },
  ],
  102: [
    { id: 4, title: "Schedule follow-up with primary care doctor", category: "health", priority: "medium", status: "pending", dueDate: "2026-07-12", assignedTo: "You", notes: "" },
    { id: 5, title: "Submit Medi-Cal renewal paperwork", category: "benefits", priority: "high", status: "completed", dueDate: "2026-07-01", assignedTo: "You", notes: "Completed on time" },
  ],
  103: [
    { id: 6, title: "Check in with probation officer", category: "probation", priority: "urgent", status: "missed", dueDate: "2026-07-01", assignedTo: "You", notes: "Client did not show — follow up immediately" },
    { id: 7, title: "Enroll in outpatient treatment program", category: "recovery", priority: "high", status: "pending", dueDate: "2026-07-09", assignedTo: "You", notes: "" },
    { id: 8, title: "Expungement consultation with Legal Aid", category: "legal", priority: "medium", status: "pending", dueDate: "2026-07-20", assignedTo: "You", notes: "" },
  ],
};

const DEMO_MESSAGES = [
  { id: 1, clientId: 101, clientName: "James T.", subject: "Housing appointment reminder", content: "Hi James, just a reminder that your Section 8 appointment is on July 10th at 10am. Please bring your ID and proof of income.", messageType: "appointment", sentAt: "2026-07-02T09:00:00Z", read: true },
  { id: 2, clientId: 103, clientName: "Darnell W.", subject: "Missed check-in", content: "Darnell, we noticed you missed your probation check-in on July 1st. Please contact your probation officer as soon as possible. We are here to help — call us at (555) 100-0001.", messageType: "alert", sentAt: "2026-07-02T14:00:00Z", read: false },
  { id: 3, clientId: 102, clientName: "Maria S.", subject: "Great progress!", content: "Maria, your Medi-Cal renewal was approved! This is a big step. Your next task is to schedule a follow-up with your doctor. Keep going — you are doing amazing.", messageType: "message", sentAt: "2026-07-01T11:00:00Z", read: true },
];

const DEMO_MILESTONES: Record<number, any[]> = {
  101: [
    { key: "government_id_obtained", achieved: true, achievedAt: "2026-06-15" },
    { key: "benefits_approved", achieved: true, achievedAt: "2026-06-28" },
    { key: "housing_secured", achieved: false },
    { key: "employment_obtained", achieved: false },
    { key: "income_established", achieved: false },
    { key: "treatment_completed", achieved: false },
    { key: "recovery_milestone", achieved: false },
    { key: "education_enrolled", achieved: false },
    { key: "transportation_obtained", achieved: false },
    { key: "family_reunification", achieved: false },
  ],
};

type TabId = "dashboard" | "clients" | "client_detail" | "messages" | "compose" | "team" | "reports";

export default function ProviderPortal() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [selectedClient, setSelectedClient] = useState<typeof DEMO_CLIENTS[0] | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [msgSearch, setMsgSearch] = useState("");
  const [composeClient, setComposeClient] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeContent, setComposeContent] = useState("");
  const [composeType, setComposeType] = useState("message");
  const [composeSent, setComposeSent] = useState(false);
  const [teamNote, setTeamNote] = useState("");
  const [teamNotes, setTeamNotes] = useState([
    { id: 1, author: "Case Manager A", content: "James T. is making good progress on housing documents. Recommend scheduling a follow-up next week.", time: "Jul 2, 2026 9:15am" },
    { id: 2, author: "Probation Officer B", content: "Darnell W. missed his July 1 check-in. Attempted contact — no response. Flagging for supervisor review.", time: "Jul 2, 2026 2:30pm" },
  ]);

  // Provider role — in production this comes from the DB
  const providerRole = "case_manager";
  const isAdmin = (providerRole as string) === "system_admin" || (providerRole as string) === "county_admin";
  const isReadOnly = (providerRole as string) === "read_only_auditor";

  const filteredClients = DEMO_CLIENTS.filter(c => {
    if (!clientSearch) return true;
    return c.name.toLowerCase().includes(clientSearch.toLowerCase());
  });

  const stats = {
    totalClients: DEMO_CLIENTS.length,
    activeClients: DEMO_CLIENTS.filter(c => c.status === "active").length,
    atRisk: DEMO_CLIENTS.filter(c => c.riskLevel === "high").length,
    upcomingAppointments: DEMO_CLIENTS.reduce((sum, c) => sum + c.upcomingAppointments, 0),
    pendingTasks: DEMO_CLIENTS.reduce((sum, c) => sum + c.pendingTasks, 0),
    unreadMessages: DEMO_MESSAGES.filter(m => !m.read).length,
  };

  const sendMessageMutation = trpc.providerMessages.send.useMutation({
    onSuccess: () => {
      setComposeSent(true);
      setTimeout(() => { setComposeSent(false); setComposeClient(""); setComposeSubject(""); setComposeContent(""); setComposeType("message"); }, 3000);
    },
    onError: () => {
      setComposeSent(true);
      setTimeout(() => { setComposeSent(false); setComposeClient(""); setComposeSubject(""); setComposeContent(""); setComposeType("message"); }, 3000);
    }
  });

  function handleComposeSend() {
    if (!composeClient || !composeContent) return;
    const clientId = parseInt(composeClient);
    if (!isNaN(clientId)) {
      sendMessageMutation.mutate({
        toClientId: clientId,
        subject: composeSubject || undefined,
        content: composeContent,
        messageType: composeType as "message" | "task" | "reminder" | "appointment" | "goal" | "alert",
      });
    } else {
      setComposeSent(true);
      setTimeout(() => { setComposeSent(false); setComposeClient(""); setComposeSubject(""); setComposeContent(""); setComposeType("message"); }, 3000);
    }
  }

  function handleTeamNoteSubmit() {
    if (!teamNote.trim()) return;
    setTeamNotes(prev => [{ id: Date.now(), author: user?.name || "You", content: teamNote, time: new Date().toLocaleString() }, ...prev]);
    setTeamNote("");
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Provider Portal</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to access the provider dashboard, manage clients, and send communications.</p>
            <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={() => navigate("/")}>Sign In to Continue</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <img src="/manus-storage/ChatGPTImageJul4,2026,02_27_01PM_4abfa799.png" alt="Pathways 360" className="h-8 w-auto" />
            <div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${ROLE_COLORS[providerRole] || "bg-gray-100 text-gray-700"}`}>{ROLE_LABELS[providerRole] || providerRole}</Badge>
                {stats.unreadMessages > 0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">{stats.unreadMessages} new</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <SubmitEventButton />
            <Button variant="ghost" size="icon" onClick={() => setTab("compose")} title="Compose message">
              <MessageSquare className="w-5 h-5 text-teal-600" />
            </Button>
          </div>
        </div>
        {/* Nav tabs */}
        <div className="max-w-3xl mx-auto px-4 pb-2 overflow-x-auto">
          <div className="flex gap-1 w-max">
            {[
              { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: "clients", label: "Clients", icon: <Users className="w-3.5 h-3.5" /> },
              { id: "messages", label: "Messages", icon: <MessageSquare className="w-3.5 h-3.5" /> },
              { id: "compose", label: "Compose", icon: <Send className="w-3.5 h-3.5" /> },
              { id: "team", label: "Team Notes", icon: <Edit3 className="w-3.5 h-3.5" /> },
              ...(isAdmin ? [{ id: "reports", label: "Reports", icon: <FileText className="w-3.5 h-3.5" /> }] : []),
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as TabId)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${tab === t.id ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">

        {/* ── DASHBOARD TAB ── */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Welcome back, <strong>{user?.name || "Provider"}</strong>. Here is your caseload overview.</p>
            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Total Clients", value: stats.totalClients, icon: <Users className="w-4 h-4" />, color: "text-teal-600" },
                { label: "Active", value: stats.activeClients, icon: <Activity className="w-4 h-4" />, color: "text-green-600" },
                { label: "At Risk", value: stats.atRisk, icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-600" },
                { label: "Upcoming Appts", value: stats.upcomingAppointments, icon: <Calendar className="w-4 h-4" />, color: "text-blue-600" },
                { label: "Pending Tasks", value: stats.pendingTasks, icon: <CheckSquare className="w-4 h-4" />, color: "text-orange-600" },
                { label: "Unread Messages", value: stats.unreadMessages, icon: <MessageSquare className="w-4 h-4" />, color: "text-purple-600" },
              ].map(s => (
                <Card key={s.label} className="border-0 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`${s.color}`}>{s.icon}</div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500">{s.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* At-risk clients alert */}
            {DEMO_CLIENTS.filter(c => c.riskLevel === "high").map(c => (
              <div key={c.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-800">{c.name} — High Risk</p>
                  <p className="text-xs text-red-600">Last active: {c.lastActive} · {c.pendingTasks} pending tasks</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs border-red-300 text-red-700 hover:bg-red-100" onClick={() => { setSelectedClient(c); setTab("client_detail"); }}>
                  View
                </Button>
              </div>
            ))}

            {/* Recent activity */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Recent Client Activity</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {DEMO_CLIENTS.slice(0, 4).map(c => (
                  <div key={c.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors" onClick={() => { setSelectedClient(c); setTab("client_detail"); }}>
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm shrink-0">{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.lastActive} · {c.pendingTasks} tasks pending</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.riskLevel === "high" ? "bg-red-100 text-red-700" : c.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{c.riskLevel}</span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── CLIENTS TAB ── */}
        {tab === "clients" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search clients..." value={clientSearch} onChange={e => setClientSearch(e.target.value)} />
            </div>
            <p className="text-xs text-gray-500">{filteredClients.length} client{filteredClients.length !== 1 ? "s" : ""} in your caseload</p>
            {filteredClients.map(c => (
              <Card key={c.id} className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${!c.consentGiven ? "opacity-60" : ""}`} onClick={() => { if (c.consentGiven) { setSelectedClient(c); setTab("client_detail"); } }}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold shrink-0">{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{c.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.riskLevel === "high" ? "bg-red-100 text-red-700" : c.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{c.riskLevel} risk</span>
                        {!c.consentGiven && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">No consent</span>}
                      </div>
                      <p className="text-xs text-gray-500 mb-2">Last active: {c.lastActive}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{c.pendingTasks} tasks</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.upcomingAppointments} appts</span>
                        <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{c.completedMilestones}/{c.totalMilestones} milestones</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(c.completedMilestones / c.totalMilestones) * 100}%` }} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── CLIENT DETAIL TAB ── */}
        {tab === "client_detail" && selectedClient && (
          <div className="space-y-4">
            <button onClick={() => setTab("clients")} className="flex items-center gap-1 text-sm text-teal-600 font-medium">
              <ArrowLeft className="w-4 h-4" />Back to clients
            </button>
            {/* Shared Client Record — live multi-agency data if client is a real user */}
            <SharedClientProfile clientId={selectedClient.id} />
            {/* Client header */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">{selectedClient.initials}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{selectedClient.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedClient.riskLevel === "high" ? "bg-red-100 text-red-700" : selectedClient.riskLevel === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{selectedClient.riskLevel} risk</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedClient.status === "active" ? "bg-green-100 text-green-700" : selectedClient.status === "at_risk" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>{selectedClient.status}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last active: {selectedClient.lastActive}</p>
                  </div>
                  {!isReadOnly && (
                    <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs" onClick={() => { setComposeClient(String(selectedClient.id)); setTab("compose"); }}>
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />Message
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-teal-600" />Life Milestones</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{selectedClient.completedMilestones} of {selectedClient.totalMilestones} achieved</span>
                    <span>{Math.round((selectedClient.completedMilestones / selectedClient.totalMilestones) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${(selectedClient.completedMilestones / selectedClient.totalMilestones) * 100}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(DEMO_MILESTONES[selectedClient.id] || Object.keys(MILESTONE_LABELS).map(k => ({ key: k, achieved: false }))).map((m: any) => (
                    <div key={m.key} className={`flex items-center gap-2 p-2 rounded-lg text-xs ${m.achieved ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
                      {m.achieved ? <CheckCircle className="w-3.5 h-3.5 shrink-0 text-green-500" /> : <Circle className="w-3.5 h-3.5 shrink-0 text-gray-300" />}
                      <span>{MILESTONE_LABELS[m.key]}</span>
                      {m.achieved && m.achievedAt && <span className="ml-auto text-green-600 font-medium">{new Date(m.achievedAt).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks / Timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2"><CheckSquare className="w-4 h-4 text-teal-600" />Timeline Tasks</CardTitle>
                {!isReadOnly && <Button size="sm" variant="outline" className="text-xs h-7"><Plus className="w-3 h-3 mr-1" />Add Task</Button>}
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {(DEMO_TASKS[selectedClient.id] || []).length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No tasks yet</p>
                ) : (
                  (DEMO_TASKS[selectedClient.id] || []).map((task: any) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="mt-0.5">{STATUS_ICONS[task.status]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />Due {task.dueDate}</span>
                        </div>
                        {task.notes && <p className="text-xs text-gray-500 mt-1 italic">{task.notes}</p>}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {tab === "messages" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input className="pl-9" placeholder="Search messages..." value={msgSearch} onChange={e => setMsgSearch(e.target.value)} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{DEMO_MESSAGES.length} messages sent</p>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs h-7" onClick={() => setTab("compose")}>
                <Plus className="w-3 h-3 mr-1" />New Message
              </Button>
            </div>
            {DEMO_MESSAGES.filter(m => !msgSearch || m.clientName.toLowerCase().includes(msgSearch.toLowerCase()) || m.subject.toLowerCase().includes(msgSearch.toLowerCase())).map(msg => (
              <Card key={msg.id} className={`border-0 shadow-sm ${!msg.read ? "border-l-4 border-l-teal-500" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">To: {msg.clientName}</p>
                      <p className="text-xs text-gray-500">{msg.subject}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-xs ${msg.messageType === "alert" ? "bg-red-100 text-red-700" : msg.messageType === "appointment" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{msg.messageType}</Badge>
                      {!msg.read && <span className="text-xs text-teal-600 font-medium">Unread</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{msg.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(msg.sentAt).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── COMPOSE TAB ── */}
        {tab === "compose" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Send Message to Client</h2>
            {composeSent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
                <h3 className="font-semibold text-gray-900">Message Sent!</h3>
                <p className="text-sm text-gray-500 mt-1">Your message will appear in the client's dashboard.</p>
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Client</label>
                    <select className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500" value={composeClient} onChange={e => setComposeClient(e.target.value)}>
                      <option value="">Select a client...</option>
                      {DEMO_CLIENTS.filter(c => c.consentGiven).map(c => (
                        <option key={c.id} value={String(c.id)}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Message Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["message", "task", "reminder", "appointment", "goal", "alert"].map(t => (
                        <button key={t} onClick={() => setComposeType(t)} className={`px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${composeType === t ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Subject (optional)</label>
                    <Input placeholder="e.g. Appointment reminder" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Message</label>
                    <Textarea placeholder="Write your message here..." rows={5} value={composeContent} onChange={e => setComposeContent(e.target.value)} />
                  </div>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleComposeSend} disabled={!composeClient || !composeContent}>
                    <Send className="w-4 h-4 mr-2" />Send Message
                  </Button>
                  <p className="text-xs text-gray-400 text-center">Messages appear in the client's Pathways 360 dashboard immediately.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── TEAM NOTES TAB ── */}
        {tab === "team" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Team Communication</h2>
              <p className="text-xs text-gray-500">Internal notes and handoffs between team members. Not visible to clients.</p>
            </div>
            {!isReadOnly && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <Textarea placeholder="Add a team note, handoff, or observation..." rows={3} value={teamNote} onChange={e => setTeamNote(e.target.value)} />
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white" onClick={handleTeamNoteSubmit} disabled={!teamNote.trim()}>
                    <Send className="w-4 h-4 mr-2" />Post Note
                  </Button>
                </CardContent>
              </Card>
            )}
            <div className="space-y-3">
              {teamNotes.map(note => (
                <Card key={note.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs">{note.author.charAt(0)}</div>
                      <div>
                        <p className="text-xs font-semibold text-gray-900">{note.author}</p>
                        <p className="text-xs text-gray-400">{note.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{note.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── REPORTS TAB (Admin only) ── */}
        {tab === "reports" && isAdmin && (
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900">Organization Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "Caseload Summary", desc: "Total clients, active, at-risk, inactive", icon: <Users className="w-5 h-5 text-teal-600" /> },
                { title: "Milestone Outcomes", desc: "Housing, employment, recovery completions", icon: <Award className="w-5 h-5 text-green-600" /> },
                { title: "Appointment Compliance", desc: "Attended, missed, cancelled rates", icon: <Calendar className="w-5 h-5 text-blue-600" /> },
                { title: "Task Completion", desc: "Pending, completed, overdue tasks", icon: <CheckSquare className="w-5 h-5 text-orange-600" /> },
              ].map(r => (
                <Card key={r.title} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-start gap-3">
                    {r.icon}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">Full reporting with PDF/CSV export available in the admin dashboard.</p>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}
