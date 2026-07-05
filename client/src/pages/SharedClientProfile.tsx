import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertTriangle, CheckCircle2, Users, FileText, Target,
  Building2, ChevronLeft, Plus, Send, Shield, Lightbulb, X
} from "lucide-react";
import { Link } from "wouter";
import { ReferralSuggestions } from "./ReferralSuggestions";

// ─── Gap flag labels ──────────────────────────────────────────────────────────
const GAP_LABELS: Record<string, string> = {
  no_housing_plan: "No Housing Plan",
  chronically_homeless: "Chronically Homeless",
  no_mental_health_provider: "No Mental Health Provider",
  no_substance_use_treatment: "No Substance Use Treatment",
  no_government_id: "No Government ID",
  no_income: "No Income",
  no_health_insurance: "No Health Insurance",
  no_employment_plan: "No Employment Plan",
  no_ecm_provider: "No ECM Provider",
  probation_compliance_risk: "Probation Compliance Risk",
  no_peer_support: "No Peer Support",
  no_transportation: "No Transportation",
  no_legal_representation: "No Legal Representation",
  no_education_plan: "No Education Plan",
  family_reunification_needed: "Family Reunification Needed",
  medication_not_managed: "Medication Not Managed",
  crisis_risk: "Crisis Risk",
  other: "Other",
};

const SEVERITY_COLOR: Record<string, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const NOTE_TYPE_LABELS: Record<string, string> = {
  progress: "Progress", concern: "Concern", milestone: "Milestone",
  handoff: "Handoff", referral: "Referral", crisis: "Crisis",
  housing_update: "Housing", employment_update: "Employment",
  recovery_update: "Recovery", legal_update: "Legal",
  medical_update: "Medical", general: "General",
};

const NOTE_TYPE_COLOR: Record<string, string> = {
  progress: "bg-green-100 text-green-800",
  concern: "bg-orange-100 text-orange-800",
  milestone: "bg-purple-100 text-purple-800",
  handoff: "bg-blue-100 text-blue-800",
  referral: "bg-teal-100 text-teal-800",
  crisis: "bg-red-100 text-red-800",
  housing_update: "bg-indigo-100 text-indigo-800",
  employment_update: "bg-cyan-100 text-cyan-800",
  recovery_update: "bg-emerald-100 text-emerald-800",
  legal_update: "bg-yellow-100 text-yellow-800",
  medical_update: "bg-pink-100 text-pink-800",
  general: "bg-gray-100 text-gray-700",
};

const MILESTONE_KEYS = [
  { key: "government_id_obtained", label: "Gov't ID" },
  { key: "benefits_approved", label: "Benefits" },
  { key: "housing_secured", label: "Housing" },
  { key: "treatment_completed", label: "Treatment" },
  { key: "recovery_milestone", label: "Recovery" },
  { key: "employment_obtained", label: "Employment" },
  { key: "income_established", label: "Income" },
  { key: "education_enrolled", label: "Education" },
  { key: "transportation_obtained", label: "Transport" },
  { key: "family_reunification", label: "Family" },
];

interface Props { clientId: number; onBack?: () => void; }

export default function SharedClientProfile({ clientId, onBack }: Props) {
  const { user } = useAuth();
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState<string>("general");
  const [noteVisibility, setNoteVisibility] = useState<string>("all_agencies");
  const [gapCategory, setGapCategory] = useState<string>("");
  const [gapSeverity, setGapSeverity] = useState<string>("medium");
  const [gapNotes, setGapNotes] = useState("");
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string>("");

  const { data: record, refetch } = trpc.multiAgency.getSharedClientRecord.useQuery({ clientId });
  const { data: recsData } = trpc.recommendations.getForClient.useQuery(
    { clientId, county: selectedCounty || undefined },
    { enabled: showRecommendations }
  );

  const addNoteMutation = trpc.multiAgency.addNote.useMutation({
    onSuccess: () => { toast.success("Note added"); setNoteContent(""); refetch(); },
    onError: () => toast.error("Failed to add note"),
  });

  const flagGapMutation = trpc.multiAgency.flagGap.useMutation({
    onSuccess: () => { toast.success("Gap flagged"); setShowFlagForm(false); setGapCategory(""); setGapNotes(""); refetch(); },
    onError: () => toast.error("Failed to flag gap"),
  });

  const resolveGapMutation = trpc.multiAgency.resolveGap.useMutation({
    onSuccess: () => { toast.success("Gap resolved"); refetch(); },
    onError: () => toast.error("Failed to resolve gap"),
  });

  const sendReminderMutation = trpc.recommendations.sendReminder.useMutation({
    onSuccess: () => toast.success("Resource reminder sent to client inbox"),
    onError: () => toast.error("Failed to send reminder"),
  });

  if (!record) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
    </div>
  );

  const { profile, assessment, goals, milestones, gapFlags, notes, enrollments } = record;
  const completedMilestones = milestones.filter(m => m.achieved).map(m => m.milestoneKey as string);
  const completedGoals = goals.filter(g => g.status === "completed").length;
  const activeGoals = goals.filter(g => g.status === "in_progress").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.firstName || record.user?.name || "Client"} {profile?.lastName || ""}
          </h1>
          <p className="text-sm text-gray-500">
            Shared Client Record · {enrollments.length} enrolled {enrollments.length === 1 ? "agency" : "agencies"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => setShowRecommendations(!showRecommendations)}
        >
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Resource Recommendations
        </Button>
      </div>

      {/* Gap Flags Alert Bar */}
      {gapFlags.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-800">{gapFlags.length} Unresolved Care Gap{gapFlags.length > 1 ? "s" : ""}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {gapFlags.map(flag => (
              <div key={flag.id} className="flex items-center gap-1">
                <Badge className={`${SEVERITY_COLOR[flag.severity]} text-xs`}>
                  {GAP_LABELS[flag.gapCategory] || flag.gapCategory}
                </Badge>
                <button
                  onClick={() => resolveGapMutation.mutate({ flagId: flag.id })}
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  title="Mark resolved"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Recommendations Panel */}
      {showRecommendations && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                Recommended Resources Based on Client Profile
              </CardTitle>
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger className="w-40 h-8 text-xs bg-white">
                  <SelectValue placeholder="All Counties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Counties</SelectItem>
                  <SelectItem value="butte">Butte County</SelectItem>
                  <SelectItem value="shasta">Shasta County</SelectItem>
                  <SelectItem value="trinity">Trinity County</SelectItem>
                  <SelectItem value="tehama">Tehama County</SelectItem>
                  <SelectItem value="humboldt">Humboldt County</SelectItem>
                  <SelectItem value="siskiyou">Siskiyou County</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {recsData?.neededCategories && recsData.neededCategories.length > 0 && (
              <p className="text-xs text-amber-700 mt-1">
                Detected needs: {recsData.neededCategories.slice(0, 6).join(" · ")}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!recsData ? (
              <p className="text-sm text-amber-700 py-2">Loading recommendations…</p>
            ) : recsData.recommendations.length === 0 ? (
              <p className="text-sm text-amber-700 py-2">No specific resource matches found. Try selecting a county filter or flag additional gaps.</p>
            ) : (
              <div className="space-y-2">
                {recsData.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start justify-between bg-white rounded-lg p-3 border border-amber-100">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-gray-900">{rec.name}</span>
                        <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                        <span className="text-xs text-gray-500 capitalize">{rec.county} County</span>
                      </div>
                      {rec.phone && <p className="text-xs text-gray-600 mt-0.5">📞 {rec.phone}</p>}
                      {rec.address && <p className="text-xs text-gray-500">{rec.address}, {rec.city}</p>}
                      <div className="flex gap-2 mt-1">
                        {rec.freeService && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Free</span>}
                        {rec.mediCalAccepted && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Medi-Cal</span>}
                        {rec.ecmEligible && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">ECM Eligible</span>}
                        {rec.walkInsWelcome && <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">Walk-ins</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-3 shrink-0 text-xs gap-1 border-amber-300 hover:bg-amber-100"
                      onClick={() => sendReminderMutation.mutate({
                        clientId,
                        resourceName: rec.name,
                        resourceCategory: rec.category,
                        resourcePhone: rec.phone || undefined,
                        resourceAddress: rec.address ? `${rec.address}, ${rec.city}` : undefined,
                        resourceWebsite: rec.website || undefined,
                        resourceCounty: rec.county,
                        reason: `Recommended based on identified gap: ${recsData.neededCategories[0] || rec.category}`,
                      })}
                    >
                      <Send className="h-3 w-3" /> Send to Client
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notes">
            Cross-Agency Notes
            {notes.length > 0 && <span className="ml-1.5 bg-teal-100 text-teal-700 text-xs px-1.5 py-0.5 rounded-full">{notes.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="goals">Goals & Milestones</TabsTrigger>
          <TabsTrigger value="referrals">Referral Suggestions</TabsTrigger>
          <TabsTrigger value="agencies">
            Agencies
            <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded-full">{enrollments.length}</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Goals</p>
                <p className="text-2xl font-bold text-teal-700">{completedGoals}</p>
                <p className="text-xs text-gray-500">completed · {activeGoals} active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Milestones</p>
                <p className="text-2xl font-bold text-purple-700">{completedMilestones.length}</p>
                <p className="text-xs text-gray-500">of {MILESTONE_KEYS.length} life milestones</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Open Gaps</p>
                <p className={`text-2xl font-bold ${gapFlags.length > 0 ? "text-red-600" : "text-green-600"}`}>{gapFlags.length}</p>
                <p className="text-xs text-gray-500">unresolved care gaps</p>
              </CardContent>
            </Card>
          </div>

          {/* Milestone Grid */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Life Milestone Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {MILESTONE_KEYS.map(m => {
                  const achieved = completedMilestones.includes(m.key as any);
                  return (
                    <div key={m.key} className={`rounded-lg p-2 text-center text-xs font-medium transition-colors ${achieved ? "bg-teal-100 text-teal-800 border border-teal-200" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                      {achieved ? <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-teal-600" /> : <div className="h-4 w-4 mx-auto mb-1 rounded-full border-2 border-gray-200" />}
                      {m.label}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Summary */}
          {assessment && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-500" /> Needs Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {[
                    { label: "Housing", value: assessment.housingStatus },
                    { label: "Employment", value: assessment.employmentStatus },
                    { label: "Mental Health", value: assessment.mentalHealthStatus },
                    { label: "In Recovery", value: assessment.inRecovery ? "Yes" : "No" },
                    { label: "Probation/Parole", value: assessment.onProbationOrParole ? "Yes" : "No" },
                    { label: "Veteran", value: assessment.isVeteran ? "Yes" : "No" },
                    { label: "Has Gov't ID", value: assessment.hasGovernmentId ? "Yes" : "No" },
                    { label: "Health Insurance", value: assessment.hasHealthInsurance ? (assessment.insuranceType || "Yes") : "No" },
                    { label: "Has Case Worker", value: assessment.hasCaseWorker ? "Yes" : "No" },
                  ].map(item => item.value ? (
                    <div key={item.label} className="bg-gray-50 rounded p-2">
                      <p className="text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-800 capitalize">{item.value}</p>
                    </div>
                  ) : null)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flag a Gap */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" /> Flag a Care Gap
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => setShowFlagForm(!showFlagForm)} className="gap-1 text-xs">
                  <Plus className="h-3 w-3" /> Flag Gap
                </Button>
              </div>
            </CardHeader>
            {showFlagForm && (
              <CardContent className="space-y-3">
                <Select value={gapCategory} onValueChange={setGapCategory}>
                  <SelectTrigger><SelectValue placeholder="Select gap category" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(GAP_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={gapSeverity} onValueChange={setGapSeverity}>
                  <SelectTrigger><SelectValue placeholder="Severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Notes (optional)" value={gapNotes} onChange={e => setGapNotes(e.target.value)} rows={2} />
                <Button
                  size="sm"
                  disabled={!gapCategory || flagGapMutation.isPending}
                  onClick={() => flagGapMutation.mutate({ clientId, gapCategory: gapCategory as any, severity: gapSeverity as any, notes: gapNotes || undefined })}
                >
                  {flagGapMutation.isPending ? "Flagging…" : "Flag Gap"}
                </Button>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* NOTES TAB */}
        <TabsContent value="notes" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Add Cross-Agency Note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger><SelectValue placeholder="Note type" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(NOTE_TYPE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={noteVisibility} onValueChange={setNoteVisibility}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_agencies">Visible to All Agencies</SelectItem>
                    <SelectItem value="own_agency">My Agency Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Write a progress note, concern, referral, or update visible to all enrolled agencies…"
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                disabled={!noteContent.trim() || addNoteMutation.isPending}
                onClick={() => addNoteMutation.mutate({ clientId, noteType: noteType as any, content: noteContent, visibility: noteVisibility as any })}
                className="gap-1"
              >
                <Send className="h-3 w-3" />
                {addNoteMutation.isPending ? "Posting…" : "Post Note"}
              </Button>
            </CardContent>
          </Card>

          {notes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No cross-agency notes yet. Be the first to add one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map(note => (
                <div key={note.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={`${NOTE_TYPE_COLOR[note.noteType] || "bg-gray-100 text-gray-700"} text-xs`}>
                      {NOTE_TYPE_LABELS[note.noteType] || note.noteType}
                    </Badge>
                    {note.visibility === "own_agency" && (
                      <Badge variant="outline" className="text-xs">My Agency Only</Badge>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(note.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* GOALS & MILESTONES TAB */}
        <TabsContent value="goals" className="space-y-4 mt-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Target className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No goals set yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {goals.map(goal => (
                <div key={goal.id} className="bg-white border rounded-lg p-3 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${goal.status === "completed" ? "bg-green-500" : goal.status === "in_progress" ? "bg-teal-500" : goal.status === "paused" ? "bg-yellow-400" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{goal.category} · {goal.status.replace("_", " ")}</p>
                  </div>
                  {goal.dueDate && <span className="text-xs text-gray-400">{new Date(goal.dueDate).toLocaleDateString()}</span>}
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AGENCIES TAB */}
        <TabsContent value="agencies" className="space-y-4 mt-4">
          {enrollments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No agencies enrolled on this client yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="bg-white border rounded-lg p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Organization #{enrollment.organizationId}</p>
                    <p className="text-xs text-gray-500 capitalize">{enrollment.agencyRole.replace("_", " ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {enrollment.consentGiven ? (
                      <Badge className="bg-green-100 text-green-800 text-xs gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Consent Given
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending Consent</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* REFERRAL SUGGESTIONS TAB */}
        <TabsContent value="referrals" className="space-y-4 mt-4">
          <ReferralSuggestions clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
