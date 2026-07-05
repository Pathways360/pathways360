import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientList from "@/components/ClientList";
import ClientProfile from "@/components/ClientProfile";
import ClientTimeline from "@/components/ClientTimeline";
import AppointmentsTracker from "@/components/AppointmentsTracker";
import MedicationTracker from "@/components/MedicationTracker";
import RecoveryTracker from "@/components/RecoveryTracker";
import NotesSection from "@/components/NotesSection";
import ReferralTracker from "@/components/ReferralTracker";
import AlertsReminders from "@/components/AlertsReminders";
import MessagingCenter from "@/components/MessagingCenter";
import { ArrowLeft, Users, Calendar, Target, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";

export default function ProviderDashboard() {
  const [, navigate] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("clients");

  // Demo stats
  const stats = {
    totalClients: 12,
    activeClients: 10,
    atRiskClients: 2,
    upcomingAppointments: 5,
    goalsCompleted: 8,
    appointmentsCompleted: 24,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
                <p className="text-sm text-gray-500">Manage clients, track progress, and coordinate care</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-gray-900">{stats.totalClients}</div>
                <p className="text-xs text-gray-500">Total Clients</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-green-600">{stats.activeClients}</div>
                <p className="text-xs text-gray-500">Active</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-red-600">{stats.atRiskClients}</div>
                <p className="text-xs text-gray-500">At Risk</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-blue-600">{stats.upcomingAppointments}</div>
                <p className="text-xs text-gray-500">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-teal-600">{stats.goalsCompleted}</div>
                <p className="text-xs text-gray-500">Goals Done</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="text-2xl font-bold text-purple-600">{stats.appointmentsCompleted}</div>
                <p className="text-xs text-gray-500">Appointments</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {selectedClientId ? (
          // Client Detail View
          <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => setSelectedClientId(null)}>
              <ArrowLeft className="w-4 h-4 mr-1" />Back to Clients
            </Button>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="recovery">Recovery</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <ClientProfile clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <ClientTimeline clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <AppointmentsTracker clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="medications" className="mt-6">
                <MedicationTracker clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="recovery" className="mt-6">
                <RecoveryTracker clientId={selectedClientId} />
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <NotesSection clientId={selectedClientId} />
              </TabsContent>
            </Tabs>

            {/* Additional Tracking Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <ReferralTracker clientId={selectedClientId} />
              <AlertsReminders clientId={selectedClientId} />
            </div>

            <MessagingCenter clientId={selectedClientId} />
          </div>
        ) : (
          // Client List View
          <ClientList onSelectClient={setSelectedClientId} />
        )}
      </div>
    </div>
  );
}
