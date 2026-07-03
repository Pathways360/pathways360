import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Calendar, Clock, MapPin, CheckCircle, Trash2, Pill, Scale, Briefcase, Home, Heart, RefreshCw, AlertCircle } from "lucide-react";

const APPT_TYPES = [
  { id: "medical", label: "Medical", icon: <Heart className="w-4 h-4" />, color: "bg-red-100 text-red-700" },
  { id: "legal", label: "Legal", icon: <Scale className="w-4 h-4" />, color: "bg-purple-100 text-purple-700" },
  { id: "court", label: "Court Date", icon: <AlertCircle className="w-4 h-4" />, color: "bg-orange-100 text-orange-700" },
  { id: "probation", label: "Probation/Parole", icon: <AlertCircle className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
  { id: "employment", label: "Employment", icon: <Briefcase className="w-4 h-4" />, color: "bg-green-100 text-green-700" },
  { id: "housing", label: "Housing", icon: <Home className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" },
  { id: "recovery", label: "Recovery/Meeting", icon: <RefreshCw className="w-4 h-4" />, color: "bg-teal-100 text-teal-700" },
  { id: "medication", label: "Medication Reminder", icon: <Pill className="w-4 h-4" />, color: "bg-pink-100 text-pink-700" },
  { id: "other", label: "Other", icon: <Calendar className="w-4 h-4" />, color: "bg-gray-100 text-gray-700" },
];

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}
function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function CalendarPage() {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "other", date: "", time: "", location: "" });

  const { data: appts = [], refetch } = trpc.appointments.list.useQuery();
  const createAppt = trpc.appointments.create.useMutation({ onSuccess: () => { refetch(); setOpen(false); setForm({ title: "", description: "", type: "other", date: "", time: "", location: "" }); toast.success("Appointment added!"); } });
  const completeAppt = trpc.appointments.complete.useMutation({ onSuccess: () => { refetch(); toast.success("Marked as done!"); } });
  const deleteAppt = trpc.appointments.delete.useMutation({ onSuccess: () => { refetch(); toast.success("Removed."); } });

  const upcoming = (appts as any[]).filter((a: any) => !a.completed && new Date(a.appointmentDate) >= new Date()).sort((a: any, b: any) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
  const past = (appts as any[]).filter((a: any) => a.completed || new Date(a.appointmentDate) < new Date()).sort((a: any, b: any) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

  const handleCreate = () => {
    if (!form.title || !form.date || !form.time) { toast.error("Please fill in title, date, and time."); return; }
    const appointmentDate = new Date(`${form.date}T${form.time}`).toISOString();
    createAppt.mutate({ title: form.title, description: form.description, type: form.type as any, appointmentDate, location: form.location });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-white py-6 px-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h1 className="font-display font-bold text-xl">My Calendar</h1>
            <p className="text-white/70 text-sm">{upcoming.length} upcoming</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Add Appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <Input placeholder="Title (e.g. Doctor appointment)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    {APPT_TYPES.map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Date</label>
                    <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Time</label>
                    <Input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
                  </div>
                </div>
                <Input placeholder="Location (optional)" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                <Textarea placeholder="Notes (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                <Button onClick={handleCreate} disabled={createAppt.isPending} className="w-full gradient-brand text-white border-0">
                  Add Appointment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Upcoming */}
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-3">UPCOMING</p>
          {upcoming.length === 0 ? (
            <Card className="border-dashed border-2 border-border">
              <CardContent className="p-8 text-center">
                <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">No upcoming appointments</p>
                <p className="text-sm text-muted-foreground">Add court dates, medical appointments, meetings, and more.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcoming.map((appt: any) => {
                const typeInfo = APPT_TYPES.find(t => t.id === appt.type) || APPT_TYPES[APPT_TYPES.length - 1];
                return (
                  <Card key={appt.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{appt.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" /> {formatDate(appt.appointmentDate)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" /> {formatTime(appt.appointmentDate)}
                            </span>
                          </div>
                          {appt.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <MapPin className="w-3 h-3" /> {appt.location}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => completeAppt.mutate({ id: appt.id })} className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center hover:bg-brand-green/20">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteAppt.mutate({ id: appt.id })} className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3">PAST</p>
            <div className="space-y-2">
              {past.slice(0, 5).map((appt: any) => {
                const typeInfo = APPT_TYPES.find(t => t.id === appt.type) || APPT_TYPES[APPT_TYPES.length - 1];
                return (
                  <Card key={appt.id} className="border border-border opacity-60">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-through">{appt.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(appt.appointmentDate)}</p>
                        </div>
                        <CheckCircle className="w-4 h-4 text-brand-green" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
