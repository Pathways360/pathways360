import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, ChevronRight, AlertCircle, CheckCircle, Clock, User } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";

export default function ClientListPage() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  // Mock client data for demonstration
  const mockClients = [
    { id: 1, name: "John Smith", status: "active", riskLevel: "high", lastContact: "2026-07-03" },
    { id: 2, name: "Jane Doe", status: "active", riskLevel: "medium", lastContact: "2026-07-02" },
  ];
  
  const clients = mockClients;
  const isLoading = false;
  const error = null;

  // Filter by risk level
  const filtered = clients.filter((client: any) => {
    if (riskFilter !== "all" && client.riskLevel !== riskFilter) return false;
    return true;
  });

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">Error loading clients</p>
            <p className="text-sm text-gray-600 mt-1">{error ? (typeof error === 'string' ? error : 'An error occurred') : 'Unknown error'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Clients</h1>
              <p className="text-sm text-gray-500 mt-1">{filtered.length} clients</p>
            </div>
            <Button onClick={() => navigate("/client-create")} className="gradient-brand text-white">
              <Plus className="w-4 h-4 mr-1" />Add Client
            </Button>
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
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No clients found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or add a new client</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((client: any) => (
              <Card
                key={client.id}
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/client/${client.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{client.name}</h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status === "at_risk" ? "At Risk" : client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getRiskIcon(client.riskLevel)}
                          <span className="text-xs font-medium text-gray-600 capitalize">{client.riskLevel}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="text-xs text-gray-500">Email</span>
                          <p className="font-medium">{client.email}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Phone</span>
                          <p className="font-medium">{client.phone}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Location</span>
                          <p className="font-medium">{client.city}, {client.county}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Last Contact</span>
                          <p className="font-medium">{client.lastContact}</p>
                        </div>
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
    </div>
  );
}
