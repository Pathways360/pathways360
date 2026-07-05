import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Phone, Mail, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock client data for demo
const MOCK_CLIENTS = [
  {
    id: 1,
    name: "Sarah Johnson",
    dob: "1985-03-15",
    phone: "(530) 555-0101",
    email: "sarah.j@email.com",
    status: "Active",
    riskLevel: "Medium",
    lastContact: "2024-07-01",
    currentProviders: ["Counselor", "Case Manager"],
  },
  {
    id: 2,
    name: "Michael Chen",
    dob: "1992-07-22",
    phone: "(530) 555-0102",
    email: "m.chen@email.com",
    status: "Active",
    riskLevel: "High",
    lastContact: "2024-06-28",
    currentProviders: ["Doctor", "ECM Worker"],
  },
  {
    id: 3,
    name: "Jessica Martinez",
    dob: "1988-11-10",
    phone: "(530) 555-0103",
    email: "j.martinez@email.com",
    status: "Inactive",
    riskLevel: "Low",
    lastContact: "2024-05-15",
    currentProviders: ["Case Manager"],
  },
  {
    id: 4,
    name: "David Thompson",
    dob: "1980-01-05",
    phone: "(530) 555-0104",
    email: "d.thompson@email.com",
    status: "Active",
    riskLevel: "High",
    lastContact: "2024-07-02",
    currentProviders: ["Probation Officer", "Counselor"],
  },
  {
    id: 5,
    name: "Amanda Rodriguez",
    dob: "1995-09-18",
    phone: "(530) 555-0105",
    email: "a.rodriguez@email.com",
    status: "Active",
    riskLevel: "Medium",
    lastContact: "2024-06-30",
    currentProviders: ["Doctor"],
  },
];

interface ClientSearchProps {
  onSelectClient?: (client: typeof MOCK_CLIENTS[0]) => void;
}

export default function ClientSearch({ onSelectClient }: ClientSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<number[]>([]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_CLIENTS;
    
    const query = searchQuery.toLowerCase();
    return MOCK_CLIENTS.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.phone.includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.id.toString().includes(query)
    );
  }, [searchQuery]);

  const handleSelectClient = (clientId: number) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleAddClients = () => {
    if (selectedClients.length === 0) {
      toast.error("Please select at least one client");
      return;
    }
    
    const addedClients = MOCK_CLIENTS.filter(c => selectedClients.includes(c.id));
    toast.success(`Added ${addedClients.length} client(s) to your list`);
    setSelectedClients([]);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, phone, email, or client ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Found {filteredClients.length} client(s)
          </p>
        </CardContent>
      </Card>

      {/* Client List */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No clients found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          filteredClients.map(client => (
            <Card 
              key={client.id} 
              className={`border-0 shadow-sm cursor-pointer transition-all ${
                selectedClients.includes(client.id) ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => handleSelectClient(client.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client.id)}
                    onChange={() => handleSelectClient(client.id)}
                    className="mt-1 w-4 h-4 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Client Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        ID: {client.id}
                      </Badge>
                      <Badge className={`text-xs ${getRiskColor(client.riskLevel)}`}>
                        {client.riskLevel} Risk
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${client.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-700"}`}
                      >
                        {client.status}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        DOB: {new Date(client.dob).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {client.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last contact: {new Date(client.lastContact).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Current Providers */}
                    <div className="flex flex-wrap gap-1">
                      {client.currentProviders.map(provider => (
                        <Badge key={provider} variant="secondary" className="text-xs">
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Add Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClient?.(client);
                      toast.success(`${client.name} added to your client list`);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Selected Clients Button */}
      {selectedClients.length > 0 && (
        <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-lg border-t">
          <Button 
            onClick={handleAddClients}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {selectedClients.length} Selected Client{selectedClients.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  );
}
