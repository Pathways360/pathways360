import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, CheckCircle, Upload, ArrowRight, Heart } from "lucide-react";

// Diverse avatar library using UI Avatars API (free, no copyright issues)
const AVATAR_LIBRARY = [
  { id: "marcus", name: "Marcus", bg: "1a6b4a", color: "ffffff", initials: "MA" },
  { id: "diana", name: "Diana", bg: "7c3aed", color: "ffffff", initials: "DI" },
  { id: "james", name: "James", bg: "1d4ed8", color: "ffffff", initials: "JA" },
  { id: "rosa", name: "Rosa", bg: "be185d", color: "ffffff", initials: "RO" },
  { id: "david", name: "David", bg: "b45309", color: "ffffff", initials: "DA" },
  { id: "keisha", name: "Keisha", bg: "0f766e", color: "ffffff", initials: "KE" },
  { id: "carlos", name: "Carlos", bg: "dc2626", color: "ffffff", initials: "CA" },
  { id: "grace", name: "Grace", bg: "6d28d9", color: "ffffff", initials: "GR" },
  { id: "tyrone", name: "Tyrone", bg: "0369a1", color: "ffffff", initials: "TY" },
  { id: "maria", name: "Maria", bg: "c2410c", color: "ffffff", initials: "MA" },
  { id: "pastor", name: "Pastor Ray", bg: "064e3b", color: "ffffff", initials: "PR" },
  { id: "coach", name: "Coach Sam", bg: "1e3a5f", color: "ffffff", initials: "CS" },
];

function getAvatarUrl(avatar: typeof AVATAR_LIBRARY[0]) {
  return `https://ui-avatars.com/api/?name=${avatar.initials}&background=${avatar.bg}&color=${avatar.color}&size=128&bold=true&rounded=true`;
}

const PERSONALITIES = [
  { id: "encouraging", label: "Encouraging", desc: "Uplifting, positive, celebrates every win" },
  { id: "direct", label: "Direct", desc: "Straight to the point, practical, action-focused" },
  { id: "gentle", label: "Gentle", desc: "Soft, patient, compassionate — never pushy" },
  { id: "faith_based", label: "Faith-Based", desc: "Incorporates prayer, scripture, and spiritual support" },
];

export default function CoachSetup() {
  const [, navigate] = useLocation();
  const [coachName, setCoachName] = useState("Alex");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_LIBRARY[0]);
  const [personality, setPersonality] = useState<"encouraging" | "direct" | "gentle" | "faith_based">("encouraging");
  const [devotionals, setDevotionals] = useState(false);
  const [motivational, setMotivational] = useState(true);
  const [checkIn, setCheckIn] = useState<"morning" | "morning_evening" | "three_times">("morning");

  const saveSettings = trpc.coach.saveSettings.useMutation();

  const handleSave = async () => {
    try {
      await saveSettings.mutateAsync({
        coachName: coachName || "Alex",
        avatarType: "library",
        avatarLibraryId: selectedAvatar.id,
        devotionalsEnabled: devotionals,
        motivationalEnabled: motivational,
        checkInFrequency: checkIn,
        coachPersonality: personality,
      });
      toast.success(`${coachName} is ready to guide you! 🎉`);
      navigate("/dashboard");
    } catch {
      toast.error("Could not save coach settings. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-white py-8 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Meet Your Life Coach</h1>
        <p className="text-white/80 text-sm max-w-sm mx-auto">
          Personalize your AI coach — give them a name and a face that feels right to you.
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Coach Name */}
        <Card>
          <CardContent className="p-5">
            <Label className="font-semibold text-foreground mb-3 block">What's your coach's name?</Label>
            <Input
              value={coachName}
              onChange={e => setCoachName(e.target.value)}
              placeholder="e.g. Marcus, Coach Ray, Big Sis..."
              className="text-lg font-medium"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-2">Call them whatever feels right to you.</p>
          </CardContent>
        </Card>

        {/* Avatar Preview */}
        <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border">
          <img
            src={getAvatarUrl(selectedAvatar)}
            alt={selectedAvatar.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <p className="font-display font-bold text-lg text-foreground">{coachName || "Your Coach"}</p>
            <p className="text-sm text-muted-foreground">Your Personal Life Coach</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-soft" />
              <span className="text-xs text-brand-green">Ready to guide you</span>
            </div>
          </div>
        </div>

        {/* Avatar Library */}
        <Card>
          <CardContent className="p-5">
            <Label className="font-semibold text-foreground mb-3 block">Choose a face</Label>
            <div className="grid grid-cols-4 gap-3">
              {AVATAR_LIBRARY.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedAvatar.id === avatar.id ? "bg-brand-teal/10 ring-2 ring-brand-teal" : "hover:bg-secondary"
                  }`}
                >
                  <img src={getAvatarUrl(avatar)} alt={avatar.name} className="w-12 h-12 rounded-full" />
                  <span className="text-xs text-muted-foreground truncate w-full text-center">{avatar.name}</span>
                  {selectedAvatar.id === avatar.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-teal flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personality */}
        <Card>
          <CardContent className="p-5">
            <Label className="font-semibold text-foreground mb-3 block">Coaching style</Label>
            <div className="space-y-2">
              {PERSONALITIES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersonality(p.id as any)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    personality === p.id ? "border-brand-teal bg-brand-teal/10" : "border-border hover:border-brand-teal/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {personality === p.id ? <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />}
                    <div>
                      <p className="font-medium text-sm text-foreground">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Check-in Frequency */}
        <Card>
          <CardContent className="p-5">
            <Label className="font-semibold text-foreground mb-3 block">How often should your coach check in?</Label>
            <div className="space-y-2">
              {[
                { id: "morning", label: "Once a day (morning)" },
                { id: "morning_evening", label: "Twice a day (morning & evening)" },
                { id: "three_times", label: "Three times a day" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCheckIn(opt.id as any)}
                  className={`w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    checkIn === opt.id ? "border-brand-teal bg-brand-teal/10 text-brand-teal-dark" : "border-border text-foreground hover:border-brand-teal/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Toggles */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <Label className="font-semibold text-foreground block">Content preferences</Label>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Daily devotionals</p>
                <p className="text-xs text-muted-foreground">Faith-based daily messages (opt-in)</p>
              </div>
              <Switch checked={devotionals} onCheckedChange={setDevotionals} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Motivational messages</p>
                <p className="text-xs text-muted-foreground">Daily encouragement and inspiration</p>
              </div>
              <Switch checked={motivational} onCheckedChange={setMotivational} />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={saveSettings.isPending}
          className="w-full gradient-brand text-white border-0 h-14 text-base font-semibold"
        >
          {saveSettings.isPending ? (
            <><Sparkles className="w-5 h-5 mr-2 animate-spin" /> Setting up your coach...</>
          ) : (
            <>Meet {coachName || "Your Coach"} <ArrowRight className="w-5 h-5 ml-2" /></>
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground pb-4">
          You can change your coach's name, face, and settings anytime.
        </p>
      </div>
    </div>
  );
}
