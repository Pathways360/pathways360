import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { CheckCircle, ChevronRight, ChevronLeft, Briefcase, Award, Users, Target, TrendingUp, Share2, Lock } from "lucide-react";

const STEPS = [
  { id: 1, title: "Role & Organization", icon: <Briefcase className="w-5 h-5" /> },
  { id: 2, title: "Credentials", icon: <Award className="w-5 h-5" /> },
  { id: 3, title: "Services", icon: <Users className="w-5 h-5" /> },
  { id: 4, title: "Specializations", icon: <Target className="w-5 h-5" /> },
  { id: 5, title: "Client Outcomes", icon: <TrendingUp className="w-5 h-5" /> },
  { id: 6, title: "Capacity", icon: <Briefcase className="w-5 h-5" /> },
  { id: 7, title: "Data Sharing", icon: <Share2 className="w-5 h-5" /> },
];

const PROVIDER_ROLES = [
  "Counselor",
  "Case Manager",
  "ECM Worker",
  "Probation Officer",
  "Insurance Provider",
  "Housing Provider",
  "Employment Specialist",
  "Peer Support Specialist",
  "Medical Provider",
  "Admin",
];

const SERVICES_BY_ROLE: Record<string, string[]> = {
  "Counselor": ["Individual Therapy", "Group Therapy", "Assessment", "Treatment Planning", "Crisis Intervention", "Discharge Planning"],
  "Case Manager": ["Care Coordination", "Resource Navigation", "Advocacy", "Benefits Assistance", "Care Planning", "Follow-up"],
  "ECM Worker": ["Enrollment", "Eligibility Verification", "Benefits Navigation", "Recertification", "Appeals Support", "Documentation"],
  "Probation Officer": ["Compliance Monitoring", "Drug Testing", "Court Coordination", "Incentives", "Violation Processing", "Reentry Support"],
  "Insurance Provider": ["Authorization", "Claims Processing", "Coverage Verification", "Appeals", "Billing Support", "Network Management"],
  "Housing Provider": ["Placement", "Lease Support", "Inspections", "Rent Assistance", "Stability Tracking", "Eviction Prevention"],
  "Employment Specialist": ["Job Coaching", "Resume Building", "Interview Prep", "Job Placement", "Retention Support", "Career Planning"],
  "Peer Support Specialist": ["Peer Mentoring", "Support Groups", "Recovery Coaching", "Advocacy", "Community Connection", "Lived Experience Sharing"],
  "Medical Provider": ["Primary Care", "Specialist Referrals", "Medication Management", "Health Screening", "Preventive Care", "Emergency Care"],
  "Admin": ["System Management", "User Management", "Reporting", "Data Analysis", "Compliance", "Training"],
};

const SPECIALIZATIONS = [
  "Substance Abuse",
  "Mental Health",
  "Trauma",
  "Housing",
  "Employment",
  "Legal",
  "Family Reunification",
  "Child Welfare",
  "Veterans",
  "LGBTQ+",
];

const TARGET_POPULATIONS = [
  "Homeless",
  "Justice Involved",
  "Foster Youth",
  "Veterans",
  "Seniors",
  "Individuals with Disabilities",
  "Families with Children",
  "Uninsured/Underinsured",
];

export default function ProviderOnboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [licenseVerified, setLicenseVerified] = useState(false);
  const [verifyingLicense, setVerifyingLicense] = useState(false);

  const [form, setForm] = useState({
    providerRole: "",
    organizationName: "",
    organizationType: "",
    licenseNumber: "",
    licenseType: "",
    licenseState: "CA",
    licenseExpiration: "",
    yearsOfExperience: "",
    certifications: [] as string[],
    servicesProvided: [] as string[],
    specializations: [] as string[],
    targetPopulations: [] as string[],
    primaryClientOutcome: "",
    secondaryOutcomes: [] as string[],
    measurableMetrics: [] as string[],
    maxClientsPerMonth: "",
    averageClientsServed: "",
    acceptingNewClients: true,
    serviceDeliveryMethod: "In-Person",
    collaboratingAgencies: [] as string[],
    dataSharing: false,
    consentRequired: true,
    phone: "",
    email: user?.email || "",
  });

  const upsertMutation = trpc.provider.upsertProfile.useMutation({
    onSuccess: () => {
      if (step < STEPS.length) {
        setStep(s => s + 1);
      } else {
        toast.success("Provider profile complete! You can now search and add clients.");
        navigate("/provider-search");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  const verifyLicense = async () => {
    if (!form.licenseNumber) {
      toast.error("Please enter a license number");
      return;
    }
    
    setVerifyingLicense(true);
    // Simulate license verification - in production, call actual verification service
    setTimeout(() => {
      // Demo: Licenses starting with "LIC" are verified, "PND" are pending
      if (form.licenseNumber.startsWith("LIC")) {
        setLicenseVerified(true);
        toast.success("License verified!");
      } else if (form.licenseNumber.startsWith("PND")) {
        toast.error("License verification pending. Admin approval required.");
      } else {
        toast.error("License not found in system. Please check and try again.");
      }
      setVerifyingLicense(false);
    }, 1500);
  };

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const toggleArray = (key: string, value: string) => {
    const arr = form[key as keyof typeof form] as string[];
    if (arr.includes(value)) {
      set(key, arr.filter(v => v !== value));
    } else {
      set(key, [...arr, value]);
    }
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1 && (!form.providerRole || !form.organizationName)) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (step === 2 && !licenseVerified && form.licenseNumber) {
      toast.error("Please verify your license first");
      return;
    }

    if (step === STEPS.length) {
      upsertMutation.mutate(form as any);
    } else {
      setStep(s => s + 1);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to continue.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Provider Setup</h1>
          <p className="text-gray-500 text-sm mt-1">Complete your profile to access the provider dashboard and search for clients</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                step === s.id ? "bg-blue-600 text-white" : step > s.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s.id ? <CheckCircle className="w-3.5 h-3.5" /> : s.icon}
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 min-w-2 ${step > s.id ? "bg-blue-400" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="font-semibold text-xl text-gray-900">{STEPS[step - 1].title}</h2>

          {/* STEP 1: Role & Organization */}
          {step === 1 && (
            <>
              <div>
                <Label className="font-semibold">Provider Role *</Label>
                <Select value={form.providerRole} onValueChange={v => set("providerRole", v)}>
                  <SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger>
                  <SelectContent>
                    {PROVIDER_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold">Organization Name *</Label>
                <Input value={form.organizationName} onChange={e => set("organizationName", e.target.value)} placeholder="Your organization" />
              </div>
              <div>
                <Label className="font-semibold">Organization Type</Label>
                <Select value={form.organizationType} onValueChange={v => set("organizationType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {["Non-Profit", "Government", "Private", "Healthcare", "Community Based"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* STEP 2: Credentials & License Verification */}
          {step === 2 && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>License Verification:</strong> Your license must be verified to access the client database. Enter your license number and we'll verify it in our system.
                </div>
              </div>

              <div>
                <Label className="font-semibold">License Number</Label>
                <div className="flex gap-2">
                  <Input value={form.licenseNumber} onChange={e => set("licenseNumber", e.target.value)} placeholder="e.g., LIC123456" />
                  <Button onClick={verifyLicense} disabled={verifyingLicense || !form.licenseNumber} variant="outline">
                    {verifyingLicense ? "Verifying..." : "Verify"}
                  </Button>
                </div>
                {licenseVerified && <p className="text-sm text-green-600 mt-2">✓ License verified</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">License Type</Label>
                  <Input value={form.licenseType} onChange={e => set("licenseType", e.target.value)} placeholder="e.g., LCSW, LMFT, RN" />
                </div>
                <div>
                  <Label className="font-semibold">License State</Label>
                  <Input value={form.licenseState} onChange={e => set("licenseState", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Expiration Date</Label>
                  <Input type="date" value={form.licenseExpiration} onChange={e => set("licenseExpiration", e.target.value)} />
                </div>
                <div>
                  <Label className="font-semibold">Years of Experience</Label>
                  <Input type="number" value={form.yearsOfExperience} onChange={e => set("yearsOfExperience", e.target.value)} placeholder="0" />
                </div>
              </div>

              <div>
                <Label className="font-semibold">Certifications</Label>
                <div className="space-y-2">
                  {["CADC", "CPRP", "CPR", "Trauma-Informed", "Motivational Interviewing", "Other"].map(cert => (
                    <div key={cert} className="flex items-center gap-2">
                      <Checkbox checked={form.certifications.includes(cert)} onCheckedChange={() => toggleArray("certifications", cert)} />
                      <label className="text-sm">{cert}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Services */}
          {step === 3 && (
            <>
              <div>
                <Label className="font-semibold mb-3 block">Services You Provide</Label>
                <div className="space-y-2">
                  {(SERVICES_BY_ROLE[form.providerRole] || []).map(service => (
                    <div key={service} className="flex items-center gap-2">
                      <Checkbox checked={form.servicesProvided.includes(service)} onCheckedChange={() => toggleArray("servicesProvided", service)} />
                      <label className="text-sm">{service}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 4: Specializations */}
          {step === 4 && (
            <>
              <div>
                <Label className="font-semibold mb-3 block">Your Specializations</Label>
                <div className="grid grid-cols-2 gap-3">
                  {SPECIALIZATIONS.map(spec => (
                    <div key={spec} className="flex items-center gap-2">
                      <Checkbox checked={form.specializations.includes(spec)} onCheckedChange={() => toggleArray("specializations", spec)} />
                      <label className="text-sm">{spec}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">Target Populations</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TARGET_POPULATIONS.map(pop => (
                    <div key={pop} className="flex items-center gap-2">
                      <Checkbox checked={form.targetPopulations.includes(pop)} onCheckedChange={() => toggleArray("targetPopulations", pop)} />
                      <label className="text-sm">{pop}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 5: Client Outcomes */}
          {step === 5 && (
            <>
              <div>
                <Label className="font-semibold">Primary Client Outcome Goal</Label>
                <Input value={form.primaryClientOutcome} onChange={e => set("primaryClientOutcome", e.target.value)} placeholder="e.g., Housing stability, Sobriety, Employment" />
              </div>

              <div>
                <Label className="font-semibold mb-3 block">Secondary Outcomes You Track</Label>
                <div className="space-y-2">
                  {["Improved Health", "Family Reunification", "Legal Resolution", "Financial Stability", "Education/Training", "Community Integration"].map(outcome => (
                    <div key={outcome} className="flex items-center gap-2">
                      <Checkbox checked={form.secondaryOutcomes.includes(outcome)} onCheckedChange={() => toggleArray("secondaryOutcomes", outcome)} />
                      <label className="text-sm">{outcome}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-semibold mb-3 block">Measurable Metrics</Label>
                <div className="space-y-2">
                  {["% Housed", "Days Sober", "Employment Rate", "Appointment Attendance", "Family Contact", "Program Completion"].map(metric => (
                    <div key={metric} className="flex items-center gap-2">
                      <Checkbox checked={form.measurableMetrics.includes(metric)} onCheckedChange={() => toggleArray("measurableMetrics", metric)} />
                      <label className="text-sm">{metric}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 6: Capacity */}
          {step === 6 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Max Clients/Month</Label>
                  <Input type="number" value={form.maxClientsPerMonth} onChange={e => set("maxClientsPerMonth", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <Label className="font-semibold">Avg Clients Served</Label>
                  <Input type="number" value={form.averageClientsServed} onChange={e => set("averageClientsServed", e.target.value)} placeholder="0" />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Checkbox checked={form.acceptingNewClients} onCheckedChange={v => set("acceptingNewClients", v)} />
                <label className="text-sm font-medium">Currently accepting new clients</label>
              </div>

              <div>
                <Label className="font-semibold">Service Delivery Method</Label>
                <Select value={form.serviceDeliveryMethod} onValueChange={v => set("serviceDeliveryMethod", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["In-Person", "Virtual", "Hybrid"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* STEP 7: Data Sharing */}
          {step === 7 && (
            <>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox checked={form.dataSharing} onCheckedChange={v => set("dataSharing", v)} className="mt-1" />
                  <div>
                    <Label className="font-semibold">Willing to Share Client Data</Label>
                    <p className="text-sm text-gray-600">Allow other providers to view relevant client information for better coordination</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox checked={form.consentRequired} onCheckedChange={v => set("consentRequired", v)} className="mt-1" />
                  <div>
                    <Label className="font-semibold">Require Client Consent</Label>
                    <p className="text-sm text-gray-600">Require explicit client consent before sharing their data</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Phone</Label>
                  <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="(555) 000-0000" />
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <Input type="email" value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-sm text-green-800">
                  <strong>Ready to go!</strong> Once you complete this setup, you'll be able to search for and add clients to your roster, then start tracking their progress, communicating with them, and collaborating with other providers.
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button onClick={handleNext} disabled={upsertMutation.isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {upsertMutation.isPending ? "Saving..." : step === STEPS.length ? "Complete Setup" : "Continue"}
              {step < STEPS.length && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
