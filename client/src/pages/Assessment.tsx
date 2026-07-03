import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Home, Briefcase, Heart, Scale, RefreshCw, FileText,
  Car, Users, BookOpen, Smartphone, Target, ChevronRight,
  ChevronLeft, CheckCircle, Sparkles
} from "lucide-react";

type AssessmentData = {
  housingStatus?: string;
  employmentStatus?: string;
  hasIncome?: boolean;
  incomeSource?: string;
  hasHealthInsurance?: boolean;
  insuranceType?: string;
  hasMedicalConditions?: boolean;
  medicalConditions?: string;
  takesMedication?: boolean;
  hasDentalNeeds?: boolean;
  hasVisionNeeds?: boolean;
  mentalHealthStatus?: string;
  inRecovery?: boolean;
  substanceUseHistory?: string;
  hasSponsor?: boolean;
  attendsMeetings?: boolean;
  hasLegalIssues?: boolean;
  onProbationOrParole?: boolean;
  hasCourtDates?: boolean;
  hasGovernmentId?: boolean;
  hasSocialSecurityCard?: boolean;
  hasBirthCertificate?: boolean;
  hasTransportation?: boolean;
  hasDriversLicense?: boolean;
  hasChildren?: boolean;
  numberOfChildren?: number;
  domesticViolenceHistory?: boolean;
  isVeteran?: boolean;
  highestEducation?: string;
  hasPhone?: boolean;
  hasInternet?: boolean;
  techSkillLevel?: string;
  primaryGoals?: string;
  biggestObstacles?: string;
  hasCaseWorker?: boolean;
  caseWorkerName?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  faithBased?: boolean;
};

const STEPS = [
  { id: "housing", title: "Housing", icon: <Home className="w-5 h-5" />, color: "text-blue-600" },
  { id: "employment", title: "Employment", icon: <Briefcase className="w-5 h-5" />, color: "text-green-600" },
  { id: "health", title: "Health", icon: <Heart className="w-5 h-5" />, color: "text-red-500" },
  { id: "legal", title: "Legal", icon: <Scale className="w-5 h-5" />, color: "text-purple-600" },
  { id: "recovery", title: "Recovery", icon: <RefreshCw className="w-5 h-5" />, color: "text-orange-500" },
  { id: "documents", title: "Documents", icon: <FileText className="w-5 h-5" />, color: "text-pink-600" },
  { id: "family", title: "Family", icon: <Users className="w-5 h-5" />, color: "text-rose-500" },
  { id: "goals", title: "Goals", icon: <Target className="w-5 h-5" />, color: "text-brand-teal" },
];

function OptionButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150 font-medium text-sm active:scale-[0.98] ${
        selected
          ? "border-brand-teal bg-brand-teal/10 text-brand-teal-dark"
          : "border-border bg-card text-foreground hover:border-brand-teal/50 hover:bg-brand-teal/5"
      }`}
    >
      <div className="flex items-center gap-3">
        {selected && <CheckCircle className="w-4 h-4 text-brand-teal flex-shrink-0" />}
        {!selected && <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 flex-shrink-0" />}
        {label}
      </div>
    </button>
  );
}

function YesNo({ value, onChange }: { value?: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={() => onChange(true)}
        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${value === true ? "border-brand-teal bg-brand-teal/10 text-brand-teal-dark" : "border-border bg-card text-foreground hover:border-brand-teal/40"}`}
      >
        Yes
      </button>
      <button
        onClick={() => onChange(false)}
        className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${value === false ? "border-brand-rose bg-brand-rose/10 text-brand-rose" : "border-border bg-card text-foreground hover:border-brand-rose/40"}`}
      >
        No
      </button>
    </div>
  );
}

export default function Assessment() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>({});

  const saveAssessment = trpc.assessment.save.useMutation();
  const generateGoals = trpc.assessment.generateGoals.useMutation();

  const set = (key: keyof AssessmentData, value: any) => setData(d => ({ ...d, [key]: value }));

  const handleFinish = async () => {
    try {
      await saveAssessment.mutateAsync(data);
      toast.success("Assessment saved! Generating your personalized plan...");
      await generateGoals.mutateAsync();
      toast.success("Your life restoration plan is ready! 🎉");
      navigate("/coach-setup");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  const renderStep = () => {
    switch (STEPS[step].id) {
      case "housing":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Where are you currently staying?</p>
            {["Stable housing (renting or owning)", "Staying with family or friends", "In a shelter", "Transitional housing", "Outdoors or in a vehicle", "Other"].map(opt => (
              <OptionButton key={opt} label={opt} selected={data.housingStatus === opt} onClick={() => set("housingStatus", opt)} />
            ))}
          </div>
        );
      case "employment":
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">What is your current employment situation?</p>
              <div className="space-y-2">
                {["Employed full-time", "Employed part-time", "Self-employed", "Looking for work", "Not currently working", "Unable to work"].map(opt => (
                  <OptionButton key={opt} label={opt} selected={data.employmentStatus === opt} onClick={() => set("employmentStatus", opt)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have any income right now?</p>
              <YesNo value={data.hasIncome} onChange={v => set("hasIncome", v)} />
            </div>
          </div>
        );
      case "health":
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have health insurance?</p>
              <YesNo value={data.hasHealthInsurance} onChange={v => set("hasHealthInsurance", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you take any medications?</p>
              <YesNo value={data.takesMedication} onChange={v => set("takesMedication", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">How would you describe your mental health right now?</p>
              <div className="space-y-2">
                {["Doing well", "Some challenges, managing okay", "Struggling significantly", "In crisis, need help now"].map(opt => (
                  <OptionButton key={opt} label={opt} selected={data.mentalHealthStatus === opt} onClick={() => set("mentalHealthStatus", opt)} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have dental or vision needs?</p>
              <div className="flex gap-3">
                <button onClick={() => set("hasDentalNeeds", !data.hasDentalNeeds)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${data.hasDentalNeeds ? "border-brand-teal bg-brand-teal/10 text-brand-teal-dark" : "border-border bg-card text-foreground"}`}>
                  Dental
                </button>
                <button onClick={() => set("hasVisionNeeds", !data.hasVisionNeeds)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${data.hasVisionNeeds ? "border-brand-teal bg-brand-teal/10 text-brand-teal-dark" : "border-border bg-card text-foreground"}`}>
                  Vision
                </button>
              </div>
            </div>
          </div>
        );
      case "legal":
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have any current legal issues?</p>
              <YesNo value={data.hasLegalIssues} onChange={v => set("hasLegalIssues", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Are you currently on probation or parole?</p>
              <YesNo value={data.onProbationOrParole} onChange={v => set("onProbationOrParole", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have any upcoming court dates?</p>
              <YesNo value={data.hasCourtDates} onChange={v => set("hasCourtDates", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Are you a veteran?</p>
              <YesNo value={data.isVeteran} onChange={v => set("isVeteran", v)} />
            </div>
          </div>
        );
      case "recovery":
        return (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground bg-secondary/50 rounded-xl p-3">
              Your answers are private and confidential. This helps us connect you with the right support.
            </p>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Are you currently in recovery?</p>
              <YesNo value={data.inRecovery} onChange={v => set("inRecovery", v)} />
            </div>
            {data.inRecovery && (
              <>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Do you have a sponsor?</p>
                  <YesNo value={data.hasSponsor} onChange={v => set("hasSponsor", v)} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Are you attending meetings?</p>
                  <YesNo value={data.attendsMeetings} onChange={v => set("attendsMeetings", v)} />
                </div>
              </>
            )}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Is faith or spirituality important to you?</p>
              <YesNo value={data.faithBased} onChange={v => set("faithBased", v)} />
            </div>
          </div>
        );
      case "documents":
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">Which of these do you currently have? (Select all that apply)</p>
            {[
              { key: "hasGovernmentId", label: "Government-issued ID (driver's license, state ID)" },
              { key: "hasSocialSecurityCard", label: "Social Security Card" },
              { key: "hasBirthCertificate", label: "Birth Certificate" },
              { key: "hasTransportation", label: "Reliable transportation" },
              { key: "hasDriversLicense", label: "Driver's License" },
            ].map(({ key, label }) => (
              <OptionButton
                key={key}
                label={label}
                selected={!!(data as any)[key]}
                onClick={() => set(key as keyof AssessmentData, !(data as any)[key])}
              />
            ))}
          </div>
        );
      case "family":
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Do you have children?</p>
              <YesNo value={data.hasChildren} onChange={v => set("hasChildren", v)} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">What is your highest level of education?</p>
              <div className="space-y-2">
                {["Some high school", "High school diploma / GED", "Some college", "Associate degree", "Bachelor's degree or higher"].map(opt => (
                  <OptionButton key={opt} label={opt} selected={data.highestEducation === opt} onClick={() => set("highestEducation", opt)} />
                ))}
              </div>
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-3">What are your top priorities right now? (Select all that apply)</p>
              <div className="space-y-2">
                {["Find stable housing", "Get a job", "Get my ID / documents", "Access healthcare", "Stay sober / in recovery", "Handle legal issues", "Reconnect with family", "Get financial assistance", "Further my education"].map(opt => {
                  const goals = data.primaryGoals ? data.primaryGoals.split(",") : [];
                  const selected = goals.includes(opt);
                  return (
                    <OptionButton
                      key={opt}
                      label={opt}
                      selected={selected}
                      onClick={() => {
                        const updated = selected ? goals.filter(g => g !== opt) : [...goals, opt];
                        set("primaryGoals", updated.join(","));
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-white py-6 px-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              {STEPS[step].icon}
            </div>
            <div>
              <p className="text-white/70 text-xs">Step {step + 1} of {STEPS.length}</p>
              <h1 className="font-display font-bold text-lg">{STEPS[step].title}</h1>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-white/20" />
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-3 max-w-lg mx-auto">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                i === step ? "bg-brand-teal/10 text-brand-teal" :
                i < step ? "text-brand-green" : "text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle className="w-3 h-3" /> : s.icon}
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <span className={STEPS[step].color}>{STEPS[step].icon}</span>
              {STEPS[step].title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep(s => s + 1)} className="flex-1 gradient-brand text-white border-0">
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={saveAssessment.isPending || generateGoals.isPending}
              className="flex-1 gradient-brand text-white border-0"
            >
              {saveAssessment.isPending || generateGoals.isPending ? (
                <><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Building your plan...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" /> Build My Plan</>
              )}
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Your answers are private and only used to personalize your experience.
        </p>
      </div>
    </div>
  );
}
