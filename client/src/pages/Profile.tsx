import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  User, Bell, Shield, LogOut, ChevronLeft,
  Heart, Phone, MapPin, Globe, Calendar,
  CheckCircle, AlertTriangle, BookOpen, Sparkles, Target
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  // ── Profile state ─────────────────────────────────────────────────────────
  const { data: profile, isLoading: profileLoading } = trpc.profile.get.useQuery();
  const { data: notifPrefs, isLoading: notifLoading } = trpc.notifications.get.useQuery();

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    preferredLanguage: "English",
    zipCode: "",
    city: "",
    state: "",
  });

  const [notifForm, setNotifForm] = useState({
    appointmentReminders: true,
    medicationReminders: true,
    goalReminders: true,
    dailyCoachMessage: true,
    weeklyProgressSummary: true,
    devotionals: false,
    motivationalMessages: true,
    crisisAlerts: true,
    reminderLeadMinutes: 60,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  });

  const [privacyForm, setPrivacyForm] = useState({
    allowCaseManagerAccess: false,
  });

  // Populate forms once data loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        gender: profile.gender || "",
        preferredLanguage: profile.preferredLanguage || "English",
        zipCode: profile.zipCode || "",
        city: profile.city || "",
        state: profile.state || "",
      });
      setPrivacyForm({ allowCaseManagerAccess: profile.allowCaseManagerAccess ?? false });
    }
  }, [profile]);

  useEffect(() => {
    if (notifPrefs) {
      setNotifForm({
        appointmentReminders: notifPrefs.appointmentReminders,
        medicationReminders: notifPrefs.medicationReminders,
        goalReminders: notifPrefs.goalReminders,
        dailyCoachMessage: notifPrefs.dailyCoachMessage,
        weeklyProgressSummary: notifPrefs.weeklyProgressSummary,
        devotionals: notifPrefs.devotionals,
        motivationalMessages: notifPrefs.motivationalMessages,
        crisisAlerts: notifPrefs.crisisAlerts,
        reminderLeadMinutes: notifPrefs.reminderLeadMinutes,
        quietHoursStart: notifPrefs.quietHoursStart || "22:00",
        quietHoursEnd: notifPrefs.quietHoursEnd || "08:00",
      });
    }
  }, [notifPrefs]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const utils = trpc.useUtils();

  const updateProfile = trpc.profile.upsert.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      toast.success("Profile saved successfully!");
    },
    onError: () => toast.error("Failed to save profile. Please try again."),
  });

  const updateNotifs = trpc.notifications.upsert.useMutation({
    onSuccess: () => {
      utils.notifications.get.invalidate();
      toast.success("Notification preferences saved!");
    },
    onError: () => toast.error("Failed to save preferences. Please try again."),
  });

  const updatePrivacy = trpc.profile.upsert.useMutation({
    onSuccess: () => {
      utils.profile.get.invalidate();
      toast.success("Privacy settings saved!");
    },
    onError: () => toast.error("Failed to save privacy settings."),
  });

  const handleSaveProfile = () => {
    updateProfile.mutate(profileForm);
  };

  const handleSaveNotifs = () => {
    updateNotifs.mutate(notifForm);
  };

  const handleSavePrivacy = () => {
    updatePrivacy.mutate({ allowCaseManagerAccess: privacyForm.allowCaseManagerAccess });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : user?.name || "Your Profile";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-brand-teal text-white">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 -ml-2"
              onClick={() => navigate("/dashboard")}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>

          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/40">
              {initials || <User className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-white">{displayName}</h1>
              <p className="text-white/70 text-sm">{user?.email || ""}</p>
              {profile?.profileComplete && (
                <Badge className="mt-1 bg-brand-green/20 text-white border-white/30 text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Profile Complete
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 -mt-2 pb-24">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-white shadow-sm border border-border rounded-xl h-12">
            <TabsTrigger value="profile" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-brand-teal data-[state=active]:text-white">
              <User className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-brand-teal data-[state=active]:text-white">
              <Bell className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-brand-teal data-[state=active]:text-white">
              <Shield className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs sm:text-sm rounded-lg data-[state=active]:bg-brand-teal data-[state=active]:text-white">
              <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Profile Tab ─────────────────────────────────────────────────── */}
          <TabsContent value="profile" className="space-y-4 mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-teal" />
                  Personal Information
                </CardTitle>
                <CardDescription>This information helps us personalize your experience. It is always private.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="text-sm">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={profileForm.firstName}
                      onChange={e => setProfileForm(p => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={profileForm.lastName}
                      onChange={e => setProfileForm(p => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 000-0000"
                    value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="dob" className="text-sm flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={e => setProfileForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm">Gender Identity</Label>
                  <Select
                    value={profileForm.gender}
                    onValueChange={val => setProfileForm(p => ({ ...p, gender: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="nonbinary">Non-binary</SelectItem>
                      <SelectItem value="transgender">Transgender</SelectItem>
                      <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                    Preferred Language
                  </Label>
                  <Select
                    value={profileForm.preferredLanguage}
                    onValueChange={val => setProfileForm(p => ({ ...p, preferredLanguage: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish / Español</SelectItem>
                      <SelectItem value="French">French / Français</SelectItem>
                      <SelectItem value="Mandarin">Mandarin / 普通话</SelectItem>
                      <SelectItem value="Arabic">Arabic / العربية</SelectItem>
                      <SelectItem value="Portuguese">Portuguese / Português</SelectItem>
                      <SelectItem value="Vietnamese">Vietnamese / Tiếng Việt</SelectItem>
                      <SelectItem value="Tagalog">Tagalog</SelectItem>
                      <SelectItem value="Korean">Korean / 한국어</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    Location
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <Input
                        placeholder="ZIP"
                        value={profileForm.zipCode}
                        onChange={e => setProfileForm(p => ({ ...p, zipCode: e.target.value }))}
                        maxLength={10}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        placeholder="City"
                        value={profileForm.city}
                        onChange={e => setProfileForm(p => ({ ...p, city: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        placeholder="State"
                        value={profileForm.state}
                        onChange={e => setProfileForm(p => ({ ...p, state: e.target.value }))}
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Used to find resources near you. Never shared publicly.</p>
                </div>

                <Button
                  className="w-full gradient-brand text-white border-0"
                  onClick={handleSaveProfile}
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Notifications Tab ────────────────────────────────────────────── */}
          <TabsContent value="notifications" className="space-y-4 mt-0">
            {/* Reminders */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-teal" />
                  Reminders
                </CardTitle>
                <CardDescription>Choose what you want to be reminded about.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "appointmentReminders", label: "Appointment Reminders", desc: "Get notified before upcoming appointments", icon: <Calendar className="w-4 h-4 text-brand-teal" /> },
                  { key: "medicationReminders", label: "Medication Reminders", desc: "Daily reminders to take your medication", icon: <Heart className="w-4 h-4 text-brand-rose" /> },
                  { key: "goalReminders", label: "Goal Check-ins", desc: "Weekly nudges to review your goals", icon: <Target className="w-4 h-4 text-brand-amber" /> },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifForm[item.key as keyof typeof notifForm] as boolean}
                      onCheckedChange={val => setNotifForm(p => ({ ...p, [item.key]: val }))}
                    />
                  </div>
                ))}

                <Separator />

                <div className="space-y-1.5">
                  <Label className="text-sm">Remind me how far in advance?</Label>
                  <Select
                    value={String(notifForm.reminderLeadMinutes)}
                    onValueChange={val => setNotifForm(p => ({ ...p, reminderLeadMinutes: Number(val) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                      <SelectItem value="60">1 hour before</SelectItem>
                      <SelectItem value="120">2 hours before</SelectItem>
                      <SelectItem value="1440">1 day before</SelectItem>
                      <SelectItem value="2880">2 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Quiet hours start</Label>
                    <Input
                      type="time"
                      value={notifForm.quietHoursStart}
                      onChange={e => setNotifForm(p => ({ ...p, quietHoursStart: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Quiet hours end</Label>
                    <Input
                      type="time"
                      value={notifForm.quietHoursEnd}
                      onChange={e => setNotifForm(p => ({ ...p, quietHoursEnd: e.target.value }))}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">No notifications will be sent during quiet hours.</p>
              </CardContent>
            </Card>

            {/* Coach & Content */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-amber" />
                  Coach & Daily Content
                </CardTitle>
                <CardDescription>Personalize what your AI life coach sends you each day.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "dailyCoachMessage", label: "Daily Coach Message", desc: "A morning check-in from your personal life coach", icon: <Heart className="w-4 h-4 text-brand-teal" /> },
                  { key: "motivationalMessages", label: "Motivational Messages", desc: "Uplifting quotes and encouragement throughout the day", icon: <Sparkles className="w-4 h-4 text-brand-amber" /> },
                  { key: "weeklyProgressSummary", label: "Weekly Progress Summary", desc: "A recap of your wins and progress every week", icon: <CheckCircle className="w-4 h-4 text-brand-green" /> },
                  { key: "devotionals", label: "Daily Devotionals", desc: "Optional faith-based reflections (opt-in only)", icon: <BookOpen className="w-4 h-4 text-brand-rose" /> },
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifForm[item.key as keyof typeof notifForm] as boolean}
                      onCheckedChange={val => setNotifForm(p => ({ ...p, [item.key]: val }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Crisis Alerts */}
            <Card className="border-0 shadow-sm border-l-4 border-l-brand-rose">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-brand-rose mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Crisis Support Alerts</p>
                      <p className="text-xs text-muted-foreground">
                        If the app detects signs of a crisis in your messages, it will gently share crisis support resources with you.
                        We strongly recommend keeping this on.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifForm.crisisAlerts}
                    onCheckedChange={val => setNotifForm(p => ({ ...p, crisisAlerts: val }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full gradient-brand text-white border-0"
              onClick={handleSaveNotifs}
              disabled={updateNotifs.isPending}
            >
              {updateNotifs.isPending ? "Saving..." : "Save Notification Preferences"}
            </Button>
          </TabsContent>

          {/* ── Privacy Tab ──────────────────────────────────────────────────── */}
          <TabsContent value="privacy" className="space-y-4 mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-teal" />
                  Case Manager Access
                </CardTitle>
                <CardDescription>
                  You are always in control of who can see your information. No one can view your progress without your explicit consent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-brand-teal/5 border border-brand-teal/20 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Allow Case Manager Access</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        When enabled, a case manager or social worker assigned to your account can view your goals, appointments, and progress. They cannot see your private chat messages.
                      </p>
                    </div>
                    <Switch
                      checked={privacyForm.allowCaseManagerAccess}
                      onCheckedChange={val => setPrivacyForm(p => ({ ...p, allowCaseManagerAccess: val }))}
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Your private chat messages are <strong>never</strong> shared with anyone.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>You can revoke access at any time by turning this off.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>Your data is encrypted and stored securely.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green mt-0.5 flex-shrink-0" />
                    <span>We never sell or share your personal information with third parties.</span>
                  </div>
                </div>

                <Button
                  className="w-full gradient-brand text-white border-0"
                  onClick={handleSavePrivacy}
                  disabled={updatePrivacy.isPending}
                >
                  {updatePrivacy.isPending ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Data Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => toast.info("Data export coming soon.")}>
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm text-destructive hover:text-destructive" onClick={() => toast.info("Please contact support to request account deletion.")}>
                  Request Account Deletion
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Account Tab ──────────────────────────────────────────────────── */}
          <TabsContent value="account" className="space-y-4 mt-0">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{user?.name || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Email</span>
                    <span className="text-sm font-medium">{user?.email || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Role</span>
                    <Badge variant="outline" className="capitalize text-xs">{user?.role || "user"}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate("/coach-setup")}>
                  <Sparkles className="w-4 h-4 mr-2 text-brand-amber" />
                  Customize My Life Coach
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate("/assessment")}>
                  <Target className="w-4 h-4 mr-2 text-brand-teal" />
                  Redo Needs Assessment
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm border-destructive/20">
              <CardContent className="pt-4">
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/5"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
