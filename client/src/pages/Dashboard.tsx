import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  Heart, MapPin, Calendar, Target, MessageCircle,
  Sparkles, ChevronRight, CheckCircle, Clock, AlertCircle,
  Plus, Star, Award, ArrowRight, BookOpen, Phone, Briefcase, Shield, Bell, Mail, Building2
} from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";

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

const QUICK_ACTIONS = [
  { icon: <MapPin className="w-5 h-5" />, label: "Find Resources", path: "/resources", color: "bg-brand-teal/10 text-brand-teal hover:bg-brand-teal/20" },
  { icon: <Building2 className="w-5 h-5" />, label: "County Directory", path: "/county-directory", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
  { icon: <MessageCircle className="w-5 h-5" />, label: "Talk to Counselor", path: "/counselor", color: "bg-brand-rose/10 text-brand-rose hover:bg-brand-rose/20" },
  { icon: <Calendar className="w-5 h-5" />, label: "Add Appointment", path: "/calendar", color: "bg-brand-amber/10 text-brand-amber hover:bg-brand-amber/20" },
  { icon: <Target className="w-5 h-5" />, label: "My Goals", path: "/goals", color: "bg-brand-green/10 text-brand-green hover:bg-brand-green/20" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const { data: dashData, isLoading } = trpc.dashboard.getSummary.useQuery();
  const { data: coachMsg } = trpc.coach.getTodayMessage.useQuery();
  const { data: providerMsgs } = trpc.providerMessages.getMyMessages.useQuery();
  const markReadMutation = trpc.providerMessages.markRead.useMutation();
  const utils = trpc.useUtils();

  function handleMarkRead(id: number) {
    markReadMutation.mutate({ messageId: id }, {
      onSuccess: () => utils.providerMessages.getMyMessages.invalidate()
    });
  }

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = dashData?.profile?.firstName || user?.name?.split(" ")[0] || "Friend";

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Nav ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">Pathways 360</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/coach")}>
              <Sparkles className="w-4 h-4 mr-1 text-brand-teal" />
              My Coach
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/profile")}>
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {firstName[0]?.toUpperCase()}
              </div>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-6 space-y-6">
        {/* ── Greeting ──────────────────────────────────────────────────────── */}
        <div className="animate-fade-in-up">
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate max-w-full">
            {greeting()}, {firstName} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — Let's keep moving forward.
          </p>
        </div>

        {/* ── Coach Message ────────────────────────────────────────────────── */}
        {coachMsg && (
          <Card className="border-0 gradient-brand text-white animate-fade-in-up delay-100">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {coachMsg.coachName?.[0] || "A"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white/90 text-sm mb-1">
                    {coachMsg.coachName || "Your Coach"} says:
                  </p>
                  <p className="text-white leading-relaxed text-sm sm:text-base">{coachMsg.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 flex-shrink-0"
                  onClick={() => navigate("/coach")}
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Quick Actions ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up delay-200">
          {QUICK_ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium text-sm transition-all duration-200 active:scale-95 ${action.color}`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Today's Goals ─────────────────────────────────────────────── */}
          <Card className="animate-fade-in-up delay-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-teal" />
                Today's Goals
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/goals")}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : dashData?.goals?.length ? (
                dashData.goals.slice(0, 4).map((goal: any) => (
                  <div key={goal.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => navigate("/goals")}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${goal.status === "completed" ? "bg-brand-green" : goal.status === "in_progress" ? "bg-brand-amber" : "bg-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{goal.title}</p>
                      <Badge variant="secondary" className={`text-xs mt-0.5 ${CATEGORY_COLORS[goal.category] || ""}`}>
                        {goal.category}
                      </Badge>
                    </div>
                    {goal.status === "completed" && <CheckCircle className="w-4 h-4 text-brand-green flex-shrink-0" />}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Target className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No goals yet</p>
                  <Button size="sm" onClick={() => navigate("/goals")} className="gradient-brand text-white border-0">
                    <Plus className="w-4 h-4 mr-1" /> Create Your First Goal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Upcoming Appointments ─────────────────────────────────────── */}
          <Card className="animate-fade-in-up delay-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-amber" />
                Upcoming
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/calendar")}>
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : dashData?.appointments?.length ? (
                dashData.appointments.slice(0, 3).map((appt: any) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer" onClick={() => navigate("/calendar")}>
                    <div className="w-10 h-10 rounded-xl bg-brand-amber/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-amber" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{appt.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(appt.appointmentDate), "MMM d 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No upcoming appointments</p>
                  <Button size="sm" onClick={() => navigate("/calendar")} className="gradient-brand text-white border-0">
                    <Plus className="w-4 h-4 mr-1" /> Add Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Progress Overview ────────────────────────────────────────────── */}
        {dashData?.stats && (
          <Card className="animate-fade-in-up delay-400">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-amber" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-brand-teal/5 rounded-xl">
                  <p className="font-display font-bold text-2xl text-brand-teal">{dashData.stats.goalsCompleted}</p>
                  <p className="text-xs text-muted-foreground mt-1">Goals Completed</p>
                </div>
                <div className="text-center p-4 bg-brand-amber/5 rounded-xl">
                  <p className="font-display font-bold text-2xl text-brand-amber">{dashData.stats.goalsInProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                </div>
                <div className="text-center p-4 bg-brand-green/5 rounded-xl">
                  <p className="font-display font-bold text-2xl text-brand-green">{dashData.stats.milestones}</p>
                  <p className="text-xs text-muted-foreground mt-1">Milestones</p>
                </div>
              </div>
              {dashData.stats.totalGoals > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium text-foreground">
                      {Math.round((dashData.stats.goalsCompleted / dashData.stats.totalGoals) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(dashData.stats.goalsCompleted / dashData.stats.totalGoals) * 100}
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Provider Messages Inbox ────────────────────────────────────────────────── */}
        {providerMsgs && providerMsgs.length > 0 && (
          <Card className="animate-fade-in-up">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-teal-600" />
                Messages from Your Team
                {providerMsgs.filter((m: any) => !m.read).length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                    {providerMsgs.filter((m: any) => !m.read).length}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {providerMsgs.slice(0, 5).map((msg: any) => (
                <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${!msg.read ? 'bg-teal-50 border border-teal-100' : 'bg-secondary/50'}`} onClick={() => !msg.read && handleMarkRead(msg.id)}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.read ? 'bg-teal-500' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    {msg.subject && <p className="text-sm font-semibold text-foreground">{msg.subject}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        msg.messageType === 'alert' ? 'bg-red-100 text-red-700' :
                        msg.messageType === 'appointment' ? 'bg-blue-100 text-blue-700' :
                        msg.messageType === 'task' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{msg.messageType}</span>
                      <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                      {!msg.read && <span className="text-xs text-teal-600 font-medium">Tap to mark read</span>}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ── Provider Portal shortcut (for case managers / org admins) ─────── */}
        {(user?.role === "case_manager" || user?.role === "org_admin") && (
          <Card className="border-teal-200 bg-teal-50 animate-fade-in-up cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/provider-portal")}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Provider Portal</p>
                <p className="text-sm text-gray-600">Manage your caseload, send messages, and track client progress.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-teal-600 flex-shrink-0" />
            </CardContent>
          </Card>
        )}

        {/* ── Assessment prompt if not done ────────────────────────────────── */}
        {!isLoading && !dashData?.profile?.assessmentComplete && (
          <Card className="border-brand-amber/30 bg-brand-amber/5 animate-fade-in-up">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-amber/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-brand-amber" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Complete your needs assessment</p>
                <p className="text-sm text-muted-foreground">Help us build your personalized life restoration plan.</p>
              </div>
              <Button onClick={() => navigate("/assessment")} className="gradient-warm text-foreground border-0 flex-shrink-0">
                Start <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Bottom Nav (mobile) ──────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border md:hidden z-50">
        <div className="grid grid-cols-5 h-16">
          {[
            { icon: <Heart className="w-5 h-5" />, label: "Home", path: "/dashboard" },
            { icon: <Target className="w-5 h-5" />, label: "Goals", path: "/goals" },
            { icon: <MapPin className="w-5 h-5" />, label: "Resources", path: "/resources" },
            { icon: <Calendar className="w-5 h-5" />, label: "Calendar", path: "/calendar" },
            { icon: <MessageCircle className="w-5 h-5" />, label: "Chat", path: "/counselor" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-brand-teal transition-colors"
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  );
}
