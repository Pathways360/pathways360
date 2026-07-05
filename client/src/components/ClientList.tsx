import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, AlertCircle, CheckCircle, Clock, User, MapPin, Phone, Mail } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  county: string;
  status: "active" | "inactive" | "at_risk";
  lastContact: string;
  caseManager: string;
  goals: number;
  appointmentsUpcoming: number;
  riskLevel: "low" | "medium" | "high";
}

const DEMO_CLIENTS: Client[] = [
  {
    id: 1,
    name: "James Martinez",
    email: "james.m@email.com",
    phone: "(555) 123-4567",
    city: "Chico",
    county: "Butte",
    status: "active",
    lastContact: "2 days ago",
    caseManager: "Sarah Johnson",
    goals: 5,
    appointmentsUpcoming: 2,
    riskLevel: "low",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.g@email.com",
    phone: "(555) 234-5678",
    city: "Chico",
    county: "Butte",
    status: "at_risk",
    lastContact: "1 week ago",
    caseManager: "Michael Chen",
    goals: 3,
    appointmentsUpcoming: 1,
    riskLevel: "high",
  },
  {
    id: 3,
    name: "Robert Thompson",
    email: "robert.t@email.com",
    phone: "(555) 345-6789",
    city: "Oroville",
    county: "Butte",
    status: "active",
    lastContact: "3 days ago",
    caseManager: "Sarah Johnson",
    goals: 4,
    appointmentsUpcoming: 3,
    riskLevel: "medium",
  },
  {
    id: 4,
    name: "Angela Davis",
    email: "angela.d@email.com",
    phone: "(555) 456-7890",
    city: "Paradise",
    county: "Butte",
    status: "inactive",
    lastContact: "2 months ago",
    caseManager: "Jennifer Lee",
    goals: 2,
    appointmentsUpcoming: 0,
    riskLevel: "low",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.w@email.com",
    phone: "(555) 567-8901",
    city: "Chico",
    county: "Butte",
    status: "active",
    lastContact: "1 day ago",
    caseManager: "Michael Chen",
    goals: 6,
    appointmentsUpcoming: 2,
    riskLevel: "medium",
  },
];

interface ClientListProps {
  onSelectClient?: (clientId: number) => void;
}

export default function ClientList({ onSelectClient }: ClientListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastContact");

  const filtered = useMemo(() => {
    let result = DEMO_CLIENTS.filter(client => {
      if (statusFilter !== "all" && client.status !== statusFilter) return false;
      if (riskFilter !== "all" && client.riskLevel !== riskFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          client.name.toLowerCase().includes(s) ||
          client.email.toLowerCase().includes(s) ||
          client.phone.includes(s) ||
          client.city.toLowerCase().includes(s)
        );
      }
      return true;
    });

    // Sort
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "risk") {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    } else if (sortBy === "lastContact") {
      // Keep original order (most recent first)
    }

    return result;
  }, [search, statusFilter, riskFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "at_risk":
        return "bg-red-100 text-red-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Clients</h2>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} clients matching your filters</p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastContact">Last Contact</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="risk">Risk Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No clients found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map(client => (
            <Card
              key={client.id}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onSelectClient?.(client.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{client.name}</h3>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status === "at_risk" ? "At Risk" : client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getRiskIcon(client.riskLevel)}
                        <span className="text-xs font-medium text-gray-600 capitalize">{client.riskLevel}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{client.city}, {client.county}</span>
                      </div>
                      <div className="text-gray-500">
                        Last contact: <span className="font-medium">{client.lastContact}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>Case Manager: <span className="font-medium text-gray-900">{client.caseManager}</span></span>
                      <span>Goals: <span className="font-medium text-gray-900">{client.goals}</span></span>
                      <span>Upcoming: <span className="font-medium text-gray-900">{client.appointmentsUpcoming} appointments</span></span>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
