import React, { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Users, TrendingUp, FileText, Share2, Plus, Filter, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";

export default function ProviderDashboardFull() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("clients");

  // Demo data - providers' assigned clients
  const [myClients] = useState([
    { id: 1, name: "John Smith", status: "Active", riskLevel: "High", lastUpdate: "2 days ago", progress: 65 },
    { id: 2, name: "Maria Garcia", status: "Active", riskLevel: "Medium", lastUpdate: "1 day ago", progress: 78 },
    { id: 3, name: "David Johnson", status: "Inactive", riskLevel: "Low", lastUpdate: "1 week ago", progress: 92 },
    { id: 4, name: "Sarah Williams", status: "Active", riskLevel: "High", lastUpdate: "Today", progress: 45 },
    { id: 5, name: "Michael Brown", status: "Active", riskLevel: "Medium", lastUpdate: "3 days ago", progress: 71 },
  ]);

  // Demo data - available clients to add (from database search)
  const [availableClients] = useState([
    { id: 101, name: "James Miller", county: "Butte", status: "Seeking Services", matchScore: 95 },
    { id: 102, name: "Lisa Anderson", county: "Shasta", status: "Seeking Services", matchScore: 87 },
    { id: 103, name: "Robert Taylor", county: "Trinity", status: "Seeking Services", matchScore: 92 },
    { id: 104, name: "Jennifer White", county: "Butte", status: "Seeking Services", matchScore: 78 },
  ]);

  const [resources] = useState([
    { id: 1, name: "Housing Support Program", type: "Housing", available: true },
    { id: 2, name: "Job Training Initiative", type: "Employment", available: true },
    { id: 3, name: "Mental Health Counseling", type: "Mental Health", available: true },
    { id: 4, name: "Substance Abuse Treatment", type: "Treatment", available: true },
    { id: 5, name: "Family Reunification Services", type: "Family", available: true },
  ]);

  const [messages] = useState([
    { id: 1, clientName: "John Smith", preview: "I'm doing well with the program...", time: "2 hours ago", unread: true },
    { id: 2, clientName: "Maria Garcia", preview: "Can we schedule an appointment?", time: "Yesterday", unread: false },
    { id: 3, clientName: "David Johnson", preview: "Thanks for your support!", time: "3 days ago", unread: false },
  ]);

  const [referrals] = useState([
    { id: 1, clientName: "John Smith", service: "Housing Support", status: "Pending", date: "2 days ago" },
    { id: 2, clientName: "Maria Garcia", service: "Employment Training", status: "Accepted", date: "1 week ago" },
    { id: 3, clientName: "Sarah Williams", service: "Mental Health", status: "In Progress", date: "5 days ago" },
  ]);

  const [roiMetrics] = useState({
    housingStability: 78,
    treatmentEngagement: 85,
    medicationAdherence: 72,
    appointmentAttendance: 81,
    employmentPlacement: 65,
    familyReunification: 58,
    costSavings: 125000,
    clientsServed: 24,
  });

  const filteredClients = myClients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Settings</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">+ Add Client</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="clients" className="flex gap-2">
              <Users className="w-4 h-4" /> My Clients
            </TabsTrigger>
            <TabsTrigger value="messaging" className="flex gap-2">
              <MessageSquare className="w-4 h-4" /> Messages
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex gap-2">
              <FileText className="w-4 h-4" /> Resources
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex gap-2">
              <Share2 className="w-4 h-4" /> Referrals
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex gap-2">
              <TrendingUp className="w-4 h-4" /> Progress
            </TabsTrigger>
            <TabsTrigger value="roi" className="flex gap-2">
              <TrendingUp className="w-4 h-4" /> ROI
            </TabsTrigger>
          </TabsList>

          {/* MY CLIENTS TAB */}
          <TabsContent value="clients" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="Search clients..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
            </div>

            <div className="grid gap-4">
              {filteredClients.map(client => (
                <Card key={client.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedClient(client)}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{client.name}</h3>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={client.status === "Active" ? "default" : "secondary"}>{client.status}</Badge>
                          <Badge variant={client.riskLevel === "High" ? "destructive" : client.riskLevel === "Medium" ? "secondary" : "outline"}>
                            {client.riskLevel} Risk
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Last update: {client.lastUpdate}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{client.progress}%</div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline"><MessageSquare className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Clients from Database */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Search & Add Clients from Database</h3>
              <div className="grid gap-3">
                {availableClients.map(client => (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{client.name}</h4>
                        <p className="text-sm text-gray-500">{client.county} County • {client.status}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">{client.matchScore}% Match</p>
                        </div>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* MESSAGING TAB */}
          <TabsContent value="messaging" className="space-y-4">
            <div className="grid grid-cols-3 gap-4 h-96">
              {/* Message List */}
              <div className="col-span-1 border rounded-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <Input placeholder="Search conversations..." />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm">{msg.clientName}</h4>
                        {msg.unread && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">{msg.preview}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Thread */}
              <div className="col-span-2 border rounded-lg flex flex-col bg-white">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">John Smith</h3>
                  <p className="text-sm text-gray-500">Active • Last seen 2 hours ago</p>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">How are you doing with the program?</p>
                      <p className="text-xs opacity-70 mt-1">2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm">I'm doing well! The counseling sessions have been really helpful.</p>
                      <p className="text-xs text-gray-500 mt-1">2:45 PM</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input placeholder="Type a message..." />
                  <Button className="bg-blue-600 hover:bg-blue-700">Send</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* RESOURCES TAB */}
          <TabsContent value="resources" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {resources.map(resource => (
                <Card key={resource.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge>{resource.type}</Badge>
                      <div className="flex gap-2">
                        {resource.available && <Badge variant="outline" className="bg-green-50 text-green-700">Available</Badge>}
                        <Button size="sm" variant="outline">Refer</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* REFERRALS TAB */}
          <TabsContent value="referrals" className="space-y-4">
            <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" /> New Referral</Button>
            
            <div className="space-y-3">
              {referrals.map(referral => (
                <Card key={referral.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{referral.clientName}</h4>
                        <p className="text-sm text-gray-500">{referral.service}</p>
                        <p className="text-xs text-gray-400 mt-1">{referral.date}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {referral.status === "Pending" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                        {referral.status === "Accepted" && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {referral.status === "In Progress" && <Clock className="w-5 h-5 text-blue-500" />}
                        <Badge>{referral.status}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PROGRESS TRACKING TAB */}
          <TabsContent value="progress" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {filteredClients.map(client => (
                  <div key={client.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{client.name}</h4>
                      <span className="text-sm font-semibold text-blue-600">{client.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${client.progress}%` }}></div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Grade Progress</Button>
                      <Button size="sm" variant="outline">Add Note</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROI DASHBOARD TAB */}
          <TabsContent value="roi" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Housing Stability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{roiMetrics.housingStability}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Treatment Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{roiMetrics.treatmentEngagement}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Medication Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">{roiMetrics.medicationAdherence}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Appointment Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{roiMetrics.appointmentAttendance}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">${roiMetrics.costSavings.toLocaleString()}</div>
                  <p className="text-sm text-gray-500 mt-2">Estimated annual savings from improved outcomes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clients Served</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">{roiMetrics.clientsServed}</div>
                  <p className="text-sm text-gray-500 mt-2">Total clients in your caseload</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Agency Collaboration Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Family Reunification</p>
                    <div className="text-2xl font-bold text-indigo-600">{roiMetrics.familyReunification}%</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Employment Placement</p>
                    <div className="text-2xl font-bold text-teal-600">{roiMetrics.employmentPlacement}%</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Agencies Collaborating</p>
                    <div className="text-2xl font-bold text-rose-600">4</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
