import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import {
  Target, Plus, CheckCircle, Clock, Pause, ArrowLeft,
  Trash2, Play, Award, ChevronDown, ChevronUp, TrendingUp, Star
} from "lucide-react";

const CATEGORIES = ["housing","employment","health","legal","recovery","education","identity","financial","family","transportation","other"];
const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-brand-amber/10 text-brand-amber",
  completed: "bg-brand-green/10 text-brand-green",
  paused: "bg-muted text-muted-foreground",
};
const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  paused: "Paused",
};
const CATEGORY_COLORS: Record<string, string> = {
  housing: "bg-blue-100 text-blue-700",
  employment: "bg-green-100 text-green-700",
  health: "bg-red-100 text-red-700",
  legal: "bg-purple-100 text-purple-700",
  recovery: "bg-orange-100 text-orange-700",
  education: "bg-yellow-100 text-yellow-700",
  identity: "bg-pink-100 text-pink-700",
  financial: "bg-emerald-100 text-emerald-700",
  family: "bg-rose-100 text-rose-700",
  transportation: "bg-cyan-100 text-cyan-700",
  other: "bg-gray-100 text-gray-700",
};

export default function Goals() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", category: "other", steps: "" });

  const { data: goalsList = [], refetch } = trpc.goals.list.useQuery();
  const createGoal = trpc.goals.create.useMutation({ onSuccess: () => { refetch(); setOpen(false); setForm({ title: "", description: "", category: "other", steps: "" }); toast.success("Goal created!"); } });
  const updateStatus = trpc.goals.updateStatus.useMutation({ onSuccess: () => { refetch(); toast.success("Goal updated!"); } });
  const deleteGoal = trpc.goals.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Goal removed."); } });

  const completed = goalsList.filter((g: any) => g.status === "completed");
  const active = goalsList.filter((g: any) => g.status !== "completed");

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-white py-6 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl">My Goals</h1>
            <p className="text-white/70 text-sm">{active.length} active · {completed.length} completed</p>
          </div>
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                  <Plus className="w-4 h-4 mr-1" /> Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Create a New Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <Input placeholder="Goal title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                  <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                  <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                    <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Textarea placeholder="Steps (one per line, optional)" value={form.steps} onChange={e => setForm(f => ({ ...f, steps: e.target.value }))} rows={3} />
                  <Button
                    onClick={() => createGoal.mutate({ title: form.title, description: form.description, category: form.category as any, steps: form.steps ? form.steps.split("\n").filter(Boolean) : [] })}
                    disabled={!form.title || createGoal.isPending}
                    className="w-full gradient-brand text-white border-0"
                  >
                    Create Goal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Progress Overview */}
        {goalsList.length > 0 && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-teal-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-gray-900">Your Progress</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-teal-600">{goalsList.length}</p>
                  <p className="text-xs text-gray-500">Total Goals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">{active.length}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{completed.length}</p>
                  <p className="text-xs text-gray-500">Done</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Overall completion</span>
                  <span className="font-medium">{goalsList.length > 0 ? Math.round((completed.length / goalsList.length) * 100) : 0}%</span>
                </div>
                <Progress value={goalsList.length > 0 ? (completed.length / goalsList.length) * 100 : 0} className="h-2" />
              </div>
              {completed.length > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 font-medium">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  {completed.length === 1 ? "1 goal completed — great work!" : `${completed.length} goals completed — you're making real progress!`}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {active.length === 0 && completed.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold text-foreground mb-1">No goals yet</p>
            <p className="text-sm text-muted-foreground mb-4">Complete your needs assessment to get a personalized plan, or add a goal manually.</p>
            <Button onClick={() => navigate("/assessment")} className="gradient-brand text-white border-0">Start Assessment</Button>
          </div>
        )}

        {active.map((goal: any) => (
          <Card key={goal.id} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge className={`text-xs ${CATEGORY_COLORS[goal.category] || ""}`}>{goal.category}</Badge>
                    <Badge className={`text-xs ${STATUS_COLORS[goal.status]}`}>{STATUS_LABELS[goal.status]}</Badge>
                  </div>
                  <p className="font-semibold text-foreground">{goal.title}</p>
                  {goal.description && <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>}
                </div>
                <button onClick={() => setExpandedId(expandedId === goal.id ? null : goal.id)} className="text-muted-foreground hover:text-foreground">
                  {expandedId === goal.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {expandedId === goal.id && (
                <div className="mt-3 space-y-3">
                  {goal.steps && Array.isArray(goal.steps) && goal.steps.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">STEPS</p>
                      <ul className="space-y-1">
                        {goal.steps.map((step: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-5 h-5 rounded-full bg-brand-teal/10 text-brand-teal text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {goal.status !== "in_progress" && goal.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: goal.id, status: "in_progress" })}>
                        <Play className="w-3 h-3 mr-1" /> Start
                      </Button>
                    )}
                    {goal.status === "in_progress" && (
                      <Button size="sm" className="bg-brand-green/10 text-brand-green border-brand-green/20 hover:bg-brand-green/20" onClick={() => updateStatus.mutate({ id: goal.id, status: "completed" })}>
                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Complete
                      </Button>
                    )}
                    {goal.status !== "paused" && goal.status !== "completed" && (
                      <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: goal.id, status: "paused" })}>
                        <Pause className="w-3 h-3 mr-1" /> Pause
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => deleteGoal.mutate({ id: goal.id })}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {completed.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-brand-amber" />
              <p className="text-sm font-semibold text-muted-foreground">COMPLETED ({completed.length})</p>
            </div>
            {completed.map((goal: any) => (
              <Card key={goal.id} className="border border-border opacity-70 mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground line-through">{goal.title}</p>
                      <Badge className={`text-xs ${CATEGORY_COLORS[goal.category] || ""}`}>{goal.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
