import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Heart, Home, Briefcase, Scale, Activity, Award, Download } from "lucide-react";

// Doctor ROI Metrics
const DOCTOR_METRICS = [
  { name: "Appointment Attendance", value: 92, target: 85, icon: <Activity className="w-5 h-5" /> },
  { name: "Medication Adherence", value: 88, target: 80, icon: <Heart className="w-5 h-5" /> },
  { name: "Health Outcomes Improved", value: 76, target: 70, icon: <TrendingUp className="w-5 h-5" /> },
  { name: "Cost Savings (Annual)", value: "$245K", target: "$200K", icon: <Award className="w-5 h-5" /> },
];

// Counselor ROI Metrics
const COUNSELOR_METRICS = [
  { name: "Treatment Engagement", value: 85, target: 75, icon: <Heart className="w-5 h-5" /> },
  { name: "Recovery Milestones", value: 72, target: 60, icon: <TrendingUp className="w-5 h-5" /> },
  { name: "Relapse Prevention", value: 81, target: 70, icon: <Activity className="w-5 h-5" /> },
  { name: "Cost Savings (Annual)", value: "$180K", target: "$150K", icon: <Award className="w-5 h-5" /> },
];

// Case Manager ROI Metrics
const CASE_MANAGER_METRICS = [
  { name: "Housing Stability", value: 89, target: 80, icon: <Home className="w-5 h-5" /> },
  { name: "Employment Placement", value: 74, target: 65, icon: <Briefcase className="w-5 h-5" /> },
  { name: "Multi-Agency Coordination", value: 91, target: 85, icon: <Users className="w-5 h-5" /> },
  { name: "Cost Savings (Annual)", value: "$320K", target: "$250K", icon: <Award className="w-5 h-5" /> },
];

// ECM Worker ROI Metrics
const ECM_METRICS = [
  { name: "Social Determinants Addressed", value: 87, target: 75, icon: <Home className="w-5 h-5" /> },
  { name: "Insurance Verification", value: 94, target: 90, icon: <Activity className="w-5 h-5" /> },
  { name: "Benefit Enrollment", value: 79, target: 70, icon: <Award className="w-5 h-5" /> },
  { name: "Cost Savings (Annual)", value: "$210K", target: "$180K", icon: <TrendingUp className="w-5 h-5" /> },
];

// Probation Officer ROI Metrics
const PROBATION_METRICS = [
  { name: "Compliance Rate", value: 93, target: 85, icon: <Scale className="w-5 h-5" /> },
  { name: "Recidivism Reduction", value: 68, target: 60, icon: <TrendingUp className="w-5 h-5" /> },
  { name: "Court Date Attendance", value: 96, target: 90, icon: <Activity className="w-5 h-5" /> },
  { name: "Cost Savings (Annual)", value: "$410K", target: "$350K", icon: <Award className="w-5 h-5" /> },
];

// Multi-Agency ROI
const MULTI_AGENCY_METRICS = [
  { name: "Combined Outcomes", value: 84, target: 75 },
  { name: "Inter-Agency Compacts", value: 78, target: 70 },
  { name: "Shared Client Progress", value: 81, target: 75 },
  { name: "Total Cost Savings", value: "$1.36M", target: "$1.1M" },
];

const TREND_DATA = [
  { month: "Jan", doctor: 78, counselor: 72, caseManager: 82, ecm: 80, probation: 88 },
  { month: "Feb", doctor: 81, counselor: 75, caseManager: 84, ecm: 82, probation: 90 },
  { month: "Mar", doctor: 85, counselor: 78, caseManager: 86, ecm: 85, probation: 91 },
  { month: "Apr", doctor: 88, counselor: 82, caseManager: 88, ecm: 87, probation: 92 },
  { month: "May", doctor: 90, counselor: 84, caseManager: 89, ecm: 89, probation: 93 },
  { month: "Jun", doctor: 92, counselor: 85, caseManager: 89, ecm: 87, probation: 93 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function MultiRoleROIDashboard() {
  const [selectedRole, setSelectedRole] = useState("doctor");

  const getRoleMetrics = () => {
    switch (selectedRole) {
      case "doctor": return DOCTOR_METRICS;
      case "counselor": return COUNSELOR_METRICS;
      case "caseManager": return CASE_MANAGER_METRICS;
      case "ecm": return ECM_METRICS;
      case "probation": return PROBATION_METRICS;
      default: return DOCTOR_METRICS;
    }
  };

  const metrics = getRoleMetrics();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Multi-Role ROI Dashboard</h1>
          <p className="text-gray-600 mt-2">Track outcomes and ROI across different provider roles and multi-agency collaboration</p>
        </div>

        {/* Role Selection */}
        <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="counselor">Counselor</TabsTrigger>
            <TabsTrigger value="caseManager">Case Manager</TabsTrigger>
            <TabsTrigger value="ecm">ECM Worker</TabsTrigger>
            <TabsTrigger value="probation">Probation</TabsTrigger>
            <TabsTrigger value="multiAgency">Multi-Agency</TabsTrigger>
          </TabsList>

          {/* Doctor ROI */}
          <TabsContent value="doctor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {DOCTOR_METRICS.map((metric, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-blue-600">{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">Target: {metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Appointment Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="doctor" stroke="#3b82f6" name="Doctor Attendance" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Counselor ROI */}
          <TabsContent value="counselor" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {COUNSELOR_METRICS.map((metric, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-green-600">{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">Target: {metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Treatment Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="counselor" stroke="#10b981" name="Treatment Engagement" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Case Manager ROI */}
          <TabsContent value="caseManager" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CASE_MANAGER_METRICS.map((metric, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-amber-600">{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">Target: {metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Housing & Employment Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="caseManager" fill="#f59e0b" name="Case Manager Outcomes" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ECM Worker ROI */}
          <TabsContent value="ecm" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {ECM_METRICS.map((metric, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-purple-600">{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">Target: {metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Probation Officer ROI */}
          <TabsContent value="probation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROBATION_METRICS.map((metric, i) => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-red-600">{metric.icon}</div>
                      <Badge variant="outline" className="text-xs">Target: {metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Compliance & Recidivism Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={TREND_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="probation" stroke="#ef4444" name="Compliance Rate" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Agency ROI */}
          <TabsContent value="multiAgency" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Combined Outcomes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="doctor" fill={COLORS[0]} name="Doctor" />
                      <Bar dataKey="counselor" fill={COLORS[1]} name="Counselor" />
                      <Bar dataKey="caseManager" fill={COLORS[2]} name="Case Manager" />
                      <Bar dataKey="ecm" fill={COLORS[3]} name="ECM" />
                      <Bar dataKey="probation" fill={COLORS[4]} name="Probation" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {MULTI_AGENCY_METRICS.map((metric, i) => (
                  <Card key={i} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                          <p className="text-xs text-gray-500">Target: {metric.target}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Export ROI Report
          </Button>
        </div>
      </div>
    </div>
  );
}
