import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, ChevronRight, ChevronLeft, User, Home, Heart, Briefcase, Shield } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", icon: <User className="w-5 h-5" /> },
  { id: 2, title: "Housing & Location", icon: <Home className="w-5 h-5" /> },
  { id: 3, title: "Health & Recovery", icon: <Heart className="w-5 h-5" /> },
  { id: 4, title: "Employment & Legal", icon: <Briefcase className="w-5 h-5" /> },
  { id: 5, title: "Emergency Contact", icon: <Shield className="w-5 h-5" /> },
];

const COUNTIES = ["Butte","Shasta","Trinity","Tehama","Humboldt","Siskiyou","Other"];
const HOUSING_OPTIONS = ["Stably Housed","Unstably Housed","Couch Surfing","Shelter","Transitional Housing","Vehicle","Unsheltered/Outdoors","Other"];
const EMPLOYMENT_OPTIONS = ["Employed Full-Time","Employed Part-Time","Unemployed - Seeking Work","Unemployed - Not Seeking","Disabled","Student","Retired","Other"];
const INSURANCE_OPTIONS = ["Medi-Cal","Medicare","Private Insurance","VA Benefits","None","Unknown"];
const LANGUAGE_OPTIONS = ["English","Spanish","Hmong","Tagalog","Vietnamese","Other"];

export default function Onboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", dateOfBirth: "", gender: "", preferredLanguage: "English",
    zipCode: "", city: "", state: "CA", county: "",
    housingStatus: "", isVeteran: false, insuranceType: "", hasMediCal: false,
    drugOfChoice: "", sobrietyDate: "", inRecovery: false,
    employmentStatus: "", onProbationOrParole: false, probationCounty: "",
    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "",
    hasTransportation: false,
  });

  const upsertMutation = trpc.profile.upsert.useMutation({
    onSuccess: () => {
      if (step < STEPS.length) { setStep(s => s + 1); }
      else {
        toast.success("Profile complete! Welcome to Pathways 360.");
        navigate("/dashboard");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = () => {
    if (step === STEPS.length) {
      upsertMutation.mutate({ ...form, profileComplete: true });
    } else {
      upsertMutation.mutate(form as any);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to continue.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Pathways 360</h1>
          <p className="text-gray-500 text-sm mt-1">Let's set up your profile to personalize your experience</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step === s.id ? "bg-teal-600 text-white" : step > s.id ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle className="w-3.5 h-3.5" /> : s.icon}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 w-4 ${step > s.id ? "bg-teal-400" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg text-gray-900">{STEPS[step - 1].title}</h2>

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>First Name *</Label><Input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="First name" /></div>
                <div><Label>Last Name *</Label><Input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Last name" /></div>
              </div>
              <div><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)} /></div>
              <div><Label>Phone Number</Label><Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" /></div>
              <div><Label>Gender</Label>
                <Select value={form.gender} onValueChange={v => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select (optional)" /></SelectTrigger>
                  <SelectContent>
                    {["Male","Female","Non-binary","Prefer not to say","Other"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Preferred Language</Label>
                <Select value={form.preferredLanguage} onValueChange={v => set("preferredLanguage", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LANGUAGE_OPTIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div><Label>County *</Label>
                <Select value={form.county} onValueChange={v => set("county", v)}>
                  <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                  <SelectContent>{COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>City</Label><Input value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" /></div>
                <div><Label>ZIP Code</Label><Input value={form.zipCode} onChange={e => set("zipCode", e.target.value)} placeholder="ZIP" maxLength={5} /></div>
              </div>
              <div><Label>Housing Status *</Label>
                <Select value={form.housingStatus} onValueChange={v => set("housingStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>{HOUSING_OPTIONS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <input type="checkbox" id="transport" checked={form.hasTransportation} onChange={e => set("hasTransportation", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <label htmlFor="transport" className="text-sm font-medium">I have reliable transportation</label>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <input type="checkbox" id="veteran" checked={form.isVeteran} onChange={e => set("isVeteran", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <label htmlFor="veteran" className="text-sm font-medium">I am a Veteran</label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div><Label>Insurance Type</Label>
                <Select value={form.insuranceType} onValueChange={v => set("insuranceType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select insurance" /></SelectTrigger>
                  <SelectContent>{INSURANCE_OPTIONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <input type="checkbox" id="medcal" checked={form.hasMediCal} onChange={e => set("hasMediCal", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <label htmlFor="medcal" className="text-sm font-medium">I have Medi-Cal</label>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <input type="checkbox" id="recovery" checked={form.inRecovery} onChange={e => set("inRecovery", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <label htmlFor="recovery" className="text-sm font-medium">I am in recovery</label>
              </div>
              {form.inRecovery && (
                <>
                  <div><Label>Primary Substance (optional)</Label><Input value={form.drugOfChoice} onChange={e => set("drugOfChoice", e.target.value)} placeholder="e.g., Alcohol, Methamphetamine" /></div>
                  <div><Label>Sobriety Date (optional)</Label><Input type="date" value={form.sobrietyDate} onChange={e => set("sobrietyDate", e.target.value)} /></div>
                </>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <div><Label>Employment Status</Label>
                <Select value={form.employmentStatus} onValueChange={v => set("employmentStatus", v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>{EMPLOYMENT_OPTIONS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <input type="checkbox" id="probation" checked={form.onProbationOrParole} onChange={e => set("onProbationOrParole", e.target.checked)} className="w-4 h-4 accent-teal-600" />
                <label htmlFor="probation" className="text-sm font-medium">I am on probation or parole</label>
              </div>
              {form.onProbationOrParole && (
                <div><Label>Probation County</Label>
                  <Select value={form.probationCounty} onValueChange={v => set("probationCounty", v)}>
                    <SelectTrigger><SelectValue placeholder="Select county" /></SelectTrigger>
                    <SelectContent>{COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-sm text-gray-500">Emergency contact information is used only in case of urgent need and is never shared without your consent.</p>
              <div><Label>Contact Name</Label><Input value={form.emergencyContactName} onChange={e => set("emergencyContactName", e.target.value)} placeholder="Full name" /></div>
              <div><Label>Contact Phone</Label><Input value={form.emergencyContactPhone} onChange={e => set("emergencyContactPhone", e.target.value)} placeholder="(555) 000-0000" /></div>
              <div><Label>Relationship</Label>
                <Select value={form.emergencyContactRelation} onValueChange={v => set("emergencyContactRelation", v)}>
                  <SelectTrigger><SelectValue placeholder="Select relationship" /></SelectTrigger>
                  <SelectContent>
                    {["Parent","Sibling","Spouse/Partner","Friend","Other Family","Case Worker","Other"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 text-sm text-teal-800">
                <strong>You're almost done!</strong> After completing your profile, you'll be taken to your personalized dashboard where you can find resources, set goals, and connect with your support team.
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={upsertMutation.isPending} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white">
              {upsertMutation.isPending ? "Saving..." : step === STEPS.length ? "Complete Profile" : "Continue"}
              {step < STEPS.length && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
          <button onClick={() => navigate("/dashboard")} className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-1">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
