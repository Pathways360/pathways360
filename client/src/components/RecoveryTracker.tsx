import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Users, Heart, Plus, Calendar } from "lucide-react";

interface RecoveryData {
  id: number;
  cleanDate: string;
  daysClean: number;
  primaryDrug: string;
  meetings: {
    type: string;
    frequency: string;
    lastAttended: string;
  }[];
  sponsor: {
    name: string;
    phone: string;
    lastContact: string;
  };
  triggers: string[];
  milestones: {
    date: string;
    milestone: string;
    achieved: boolean;
  }[];
  relapsePrevention: string;
  supportNetwork: string;
}

const DEMO_RECOVERY: RecoveryData = {
  id: 1,
  cleanDate: "2024-03-15",
  daysClean: 477,
  primaryDrug: "Methamphetamine",
  meetings: [
    {
      type: "NA (Narcotics Anonymous)",
      frequency: "3x per week",
      lastAttended: "2026-07-03",
    },
    {
      type: "SMART Recovery",
      frequency: "1x per week",
      lastAttended: "2026-07-02",
    },
  ],
  sponsor: {
    name: "James Wilson",
    phone: "(555) 234-5678",
    lastContact: "2026-07-02",
  },
  triggers: ["Stress", "Social situations with old friends", "Boredom"],
  milestones: [
    { date: "2024-03-15", milestone: "30 days clean", achieved: true },
    { date: "2024-04-14", milestone: "60 days clean", achieved: true },
    { date: "2024-06-15", milestone: "6 months clean", achieved: true },
    { date: "2025-03-15", milestone: "1 year clean", achieved: true },
    { date: "2026-03-15", milestone: "18 months clean", achieved: true },
  ],
  relapsePrevention: "Daily meditation, exercise, therapy sessions",
  supportNetwork: "Sponsor, NA group, family, therapist",
};

interface RecoveryTrackerProps {
  clientId: number;
}

export default function RecoveryTracker({ clientId }: RecoveryTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Recovery Journey</h3>
          <p className="text-xs text-gray-500 mt-1">Track sobriety, meetings, and milestones</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />Update
        </Button>
      </div>

      {/* Clean Date & Days */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Clean Since</p>
              <p className="text-lg font-bold text-green-700">{DEMO_RECOVERY.cleanDate}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Days Clean</p>
              <p className="text-lg font-bold text-teal-700">{DEMO_RECOVERY.daysClean}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Drug */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600 mb-1">Primary Substance</p>
          <p className="font-semibold text-gray-900">{DEMO_RECOVERY.primaryDrug}</p>
        </CardContent>
      </Card>

      {/* Meetings */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm">Support Meetings</h4>
        {DEMO_RECOVERY.meetings.map((meeting, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{meeting.type}</p>
                  <p className="text-xs text-gray-600">{meeting.frequency}</p>
                  <p className="text-xs text-gray-500 mt-1">Last attended: {meeting.lastAttended}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sponsor */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">Sponsor</p>
              <p className="font-semibold text-gray-900">{DEMO_RECOVERY.sponsor.name}</p>
              <p className="text-xs text-gray-600 mt-1">{DEMO_RECOVERY.sponsor.phone}</p>
              <p className="text-xs text-gray-500 mt-1">Last contact: {DEMO_RECOVERY.sponsor.lastContact}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triggers */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-red-600" />Identified Triggers
        </h4>
        <div className="flex flex-wrap gap-2">
          {DEMO_RECOVERY.triggers.map((trigger, i) => (
            <Badge key={i} variant="outline" className="bg-red-50 text-red-700">{trigger}</Badge>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-600" />Milestones
        </h4>
        <div className="space-y-2">
          {DEMO_RECOVERY.milestones.map((m, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{m.milestone}</p>
                  <p className="text-xs text-gray-500">{m.date}</p>
                </div>
                {m.achieved && <Badge className="bg-green-100 text-green-700">✓ Achieved</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Relapse Prevention */}
      <Card className="border-0 shadow-sm bg-blue-50 border border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-blue-900 font-medium mb-1">Relapse Prevention Plan</p>
              <p className="text-sm text-blue-900">{DEMO_RECOVERY.relapsePrevention}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
