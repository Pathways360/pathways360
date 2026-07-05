import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, TrendingUp, Share2, Plus, Send } from "lucide-react";

interface Agency {
  id: number;
  name: string;
  type: string;
  contact: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  clientsServing: number;
  lastContact: string;
}

interface Collaboration {
  id: number;
  title: string;
  agencies: string[];
  status: "active" | "completed" | "planned";
  startDate: string;
  outcomes: string[];
  notes: string;
}

const DEMO_AGENCIES: Agency[] = [
  {
    id: 1,
    name: "WorkForce Development Center",
    type: "Employment Services",
    contact: "Sarah Johnson",
    email: "sarah@workforcedev.org",
    phone: "(555) 123-4567",
    status: "active",
    clientsServing: 12,
    lastContact: "2026-07-03",
  },
  {
    id: 2,
    name: "Community Mental Health Services",
    type: "Mental Health",
    contact: "Dr. Michael Chen",
    email: "mchen@cmhs.org",
    phone: "(555) 234-5678",
    status: "active",
    clientsServing: 8,
    lastContact: "2026-07-02",
  },
  {
    id: 3,
    name: "Rapid Rehousing Program",
    type: "Housing",
    contact: "Jennifer Martinez",
    email: "jmartinez@rapidrehousing.org",
    phone: "(555) 345-6789",
    status: "active",
    clientsServing: 15,
    lastContact: "2026-07-01",
  },
  {
    id: 4,
    name: "County Probation Department",
    type: "Justice System",
    contact: "Officer James Wilson",
    email: "jwilson@probation.county.gov",
    phone: "(555) 456-7890",
    status: "active",
    clientsServing: 6,
    lastContact: "2026-06-30",
  },
];

const DEMO_COLLABORATIONS: Collaboration[] = [
  {
    id: 1,
    title: "Employment & Housing Coordination",
    agencies: ["WorkForce Development Center", "Rapid Rehousing Program"],
    status: "active",
    startDate: "2026-06-01",
    outcomes: ["5 clients placed in jobs", "3 clients housed"],
    notes: "Coordinating employment readiness with housing stability for better outcomes",
  },
  {
    id: 2,
    title: "Mental Health & Substance Use Integration",
    agencies: ["Community Mental Health Services", "Treatment Center"],
    status: "active",
    startDate: "2026-05-15",
    outcomes: ["Improved medication adherence", "Reduced ED visits"],
    notes: "Integrated treatment approach for dual diagnosis clients",
  },
  {
    id: 3,
    title: "Justice System Reentry Program",
    agencies: ["County Probation Department", "Employment Services", "Housing"],
    status: "planned",
    startDate: "2026-08-01",
    outcomes: [],
    notes: "Comprehensive reentry support for justice-involved individuals",
  },
];

export default function MultiAgencyHub() {
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(DEMO_AGENCIES[0]);
  const [message, setMessage] = useState("");

  const activeAgencies = DEMO_AGENCIES.filter(a => a.status === "active").length;
  const totalClientsServed = DEMO_AGENCIES.reduce((sum, a) => sum + a.clientsServing, 0);
  const activeCollaborations = DEMO_COLLABORATIONS.filter(c => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Agency Collaboration Hub</h2>
          <p className="text-gray-600 mt-1">Coordinate care across agencies and track collaborative outcomes</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="w-4 h-4 mr-2" />New Collaboration
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{DEMO_AGENCIES.length}</p>
            <p className="text-xs text-gray-600 mt-1">Partner Agencies</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{activeAgencies}</p>
            <p className="text-xs text-gray-600 mt-1">Active Partners</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{totalClientsServed}</p>
            <p className="text-xs text-gray-600 mt-1">Clients Served</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-teal-600">{activeCollaborations}</p>
            <p className="text-xs text-gray-600 mt-1">Active Collaborations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="agencies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agencies">Partner Agencies</TabsTrigger>
          <TabsTrigger value="collaborations">Collaborations</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
        </TabsList>

        {/* Partner Agencies Tab */}
        <TabsContent value="agencies" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Agency List */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">Agencies</h3>
              {DEMO_AGENCIES.map(agency => (
                <Card
                  key={agency.id}
                  className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                    selectedAgency?.id === agency.id ? "ring-2 ring-teal-500" : ""
                  }`}
                  onClick={() => setSelectedAgency(agency)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">{agency.name}</h4>
                        <p className="text-xs text-gray-500">{agency.type}</p>
                        <p className="text-xs text-gray-600 mt-1">{agency.clientsServing} clients</p>
                      </div>
                      <Badge className={agency.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                        {agency.status.charAt(0).toUpperCase() + agency.status.slice(1)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agency Details */}
            {selectedAgency && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedAgency.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="font-medium text-gray-900">{selectedAgency.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Primary Contact</p>
                    <p className="font-medium text-gray-900">{selectedAgency.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900 break-all">{selectedAgency.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{selectedAgency.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Clients Served</p>
                    <p className="font-medium text-gray-900">{selectedAgency.clientsServing}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Contact</p>
                    <p className="font-medium text-gray-900">{selectedAgency.lastContact}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm">
                      <MessageCircle className="w-3 h-3 mr-1" />Contact
                    </Button>
                    <Button variant="outline" className="flex-1 text-sm">
                      <Share2 className="w-3 h-3 mr-1" />Share Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Collaborations Tab */}
        <TabsContent value="collaborations" className="mt-6 space-y-4">
          {DEMO_COLLABORATIONS.map(collab => (
            <Card key={collab.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{collab.title}</h3>
                      <Badge className={collab.status === "active" ? "bg-green-100 text-green-700" : collab.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}>
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{collab.notes}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Partner Agencies:</p>
                  <div className="flex flex-wrap gap-1">
                    {collab.agencies.map(agency => (
                      <Badge key={agency} variant="outline" className="text-xs bg-gray-50">
                        {agency}
                      </Badge>
                    ))}
                  </div>
                </div>

                {collab.outcomes.length > 0 && (
                  <div className="mb-3 p-2 bg-green-50 rounded">
                    <p className="text-xs text-gray-500 mb-1">Outcomes:</p>
                    <ul className="text-sm text-green-900 space-y-1">
                      {collab.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" />{outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Messaging Tab */}
        <TabsContent value="messaging" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-teal-600" />
                Agency Communications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 min-h-64 max-h-96 overflow-y-auto space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-900">
                      <p className="text-sm">Hi, how are the employment outcomes looking for our shared clients?</p>
                      <p className="text-xs text-gray-600 mt-1">Sarah Johnson - 2:15 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-teal-600 text-white">
                      <p className="text-sm">Great! We have 5 clients placed this month. Let's schedule a sync.</p>
                      <p className="text-xs text-teal-100 mt-1">You - 2:30 PM</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
