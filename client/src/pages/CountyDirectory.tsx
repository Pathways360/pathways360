import React, { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone, Globe, MapPin, Clock, CheckCircle2, AlertCircle,
  Search, Download, Filter, Users, Building2, Heart
} from "lucide-react";

const COUNTIES = [
  { value: "butte", label: "Butte County" },
  { value: "shasta", label: "Shasta County" },
  { value: "trinity", label: "Trinity County" },
  { value: "tehama", label: "Tehama County" },
  { value: "humboldt", label: "Humboldt County" },
  { value: "siskiyou", label: "Siskiyou County" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Emergency Shelter": "🏠",
  "Housing Programs": "🏡",
  "Transitional Housing": "🏘️",
  "Recovery Housing": "🌿",
  "Mental Health": "🧠",
  "Behavioral Health": "🧩",
  "Substance Use Treatment": "💊",
  "AA/NA": "🤝",
  "Medical": "🏥",
  "Benefits": "📋",
  "Employment": "💼",
  "Education": "🎓",
  "Food Bank": "🥫",
  "Legal Aid": "⚖️",
  "Veterans": "🎖️",
  "Domestic Violence": "🛡️",
  "Reentry": "🔓",
  "Case Management": "📁",
  "Peer Support": "👥",
  "Information & Referral": "ℹ️",
  "Transportation": "🚌",
  "Counseling": "💬",
  "ID Services": "🪪",
};

const CATEGORY_COLOR: Record<string, string> = {
  "Emergency Shelter": "bg-red-100 text-red-800 border-red-200",
  "Housing Programs": "bg-blue-100 text-blue-800 border-blue-200",
  "Transitional Housing": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Recovery Housing": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Mental Health": "bg-purple-100 text-purple-800 border-purple-200",
  "Substance Use Treatment": "bg-teal-100 text-teal-800 border-teal-200",
  "AA/NA": "bg-green-100 text-green-800 border-green-200",
  "Medical": "bg-pink-100 text-pink-800 border-pink-200",
  "Benefits": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Employment": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Education": "bg-orange-100 text-orange-800 border-orange-200",
  "Food Bank": "bg-lime-100 text-lime-800 border-lime-200",
  "Legal Aid": "bg-slate-100 text-slate-800 border-slate-200",
  "Veterans": "bg-amber-100 text-amber-800 border-amber-200",
  "Domestic Violence": "bg-rose-100 text-rose-800 border-rose-200",
  "Reentry": "bg-violet-100 text-violet-800 border-violet-200",
};

function ResourceCard({ resource, compact = false }: { resource: any; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLOR[resource.category] || "bg-gray-100 text-gray-700 border-gray-200";
  const catIcon = CATEGORY_ICONS[resource.category] || "📍";

  return (
    <div className={`bg-white border rounded-xl p-4 hover:shadow-md transition-shadow ${expanded ? "shadow-md" : ""}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0 mt-0.5">{catIcon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 text-sm leading-tight">{resource.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5 capitalize">{resource.city}{resource.city ? " · " : ""}{resource.county} County</p>
            </div>
            <Badge className={`${catColor} text-xs border shrink-0`}>{resource.category}</Badge>
          </div>

          {/* Quick info row */}
          <div className="flex flex-wrap gap-2 mt-2">
            {resource.freeService && (
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">Free</span>
            )}
            {resource.mediCalAccepted && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Medi-Cal</span>
            )}
            {resource.ecmEligible && (
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">ECM Eligible</span>
            )}
            {resource.slidingScale && (
              <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">Sliding Scale</span>
            )}
            {resource.walkInsWelcome && (
              <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">Walk-ins</span>
            )}
            {resource.acceptingClients ? (
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" /> Accepting
              </span>
            ) : (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="h-2.5 w-2.5" /> Closed
              </span>
            )}
            {resource.hasWaitlist && (
              <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">Waitlist</span>
            )}
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
            {resource.phone && (
              <a href={`tel:${resource.phone}`} className="flex items-center gap-1 hover:text-teal-700 transition-colors">
                <Phone className="h-3 w-3" /> {resource.phone}
              </a>
            )}
            {resource.website && (
              <a href={resource.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-teal-700 transition-colors">
                <Globe className="h-3 w-3" /> Website
              </a>
            )}
            {resource.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {resource.address}
              </span>
            )}
          </div>

          {/* Expandable details */}
          {!compact && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-teal-600 hover:text-teal-800 mt-2 font-medium"
              >
                {expanded ? "Show less ↑" : "Show more ↓"}
              </button>
              {expanded && (
                <div className="mt-3 space-y-2 text-xs text-gray-700 border-t pt-3">
                  {resource.description && <p>{resource.description}</p>}
                  {resource.hours && (
                    <p className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" /> <strong>Hours:</strong> {resource.hours}
                    </p>
                  )}
                  {resource.eligibility && (
                    <p className="flex items-start gap-1">
                      <Users className="h-3 w-3 text-gray-400 mt-0.5 shrink-0" /> <strong>Eligibility:</strong> {resource.eligibility}
                    </p>
                  )}
                  {resource.subCategory && (
                    <p><strong>Services:</strong> {resource.subCategory}</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CountyDirectory() {
  const { user } = useAuth();
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [ecmOnly, setEcmOnly] = useState(false);
  const [mediCalOnly, setMediCalOnly] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("directory");

  const { data: allResources = [], isLoading } = trpc.countyResources.list.useQuery({
    county: selectedCounty || undefined,
    ecmEligible: ecmOnly || undefined,
    mediCalAccepted: mediCalOnly || undefined,
    freeService: freeOnly || undefined,
  });

  const { data: categories = [] } = trpc.countyResources.getCategories.useQuery();

  const filtered = useMemo(() => {
    let list = allResources;
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(s) ||
        (r.description || "").toLowerCase().includes(s) ||
        r.category.toLowerCase().includes(s) ||
        (r.city || "").toLowerCase().includes(s) ||
        (r.subCategory || "").toLowerCase().includes(s)
      );
    }
    if (selectedCategory) {
      list = list.filter(r => r.category === selectedCategory);
    }
    return list;
  }, [allResources, search, selectedCategory]);

  // Group by county for the county-view tab
  const byCounty = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const r of filtered) {
      if (!map[r.county]) map[r.county] = [];
      map[r.county].push(r);
    }
    return map;
  }, [filtered]);

  // Group by category for the category-view tab
  const byCategory = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    for (const r of filtered) {
      if (!map[r.category]) map[r.category] = [];
      map[r.category].push(r);
    }
    return map;
  }, [filtered]);

  const handleDownload = () => {
    const lines: string[] = [
      "PATHWAYS 360 — NORTHERN CALIFORNIA RESOURCE DIRECTORY",
      `Generated: ${new Date().toLocaleDateString()}`,
      selectedCounty ? `County: ${selectedCounty.charAt(0).toUpperCase() + selectedCounty.slice(1)}` : "All Counties",
      selectedCategory ? `Category: ${selectedCategory}` : "",
      `Total Resources: ${filtered.length}`,
      "=".repeat(60),
      "",
    ];
    for (const [county, resources] of Object.entries(byCounty)) {
      lines.push(`\n${"═".repeat(50)}`);
      lines.push(`${county.toUpperCase()} COUNTY (${resources.length} resources)`);
      lines.push("═".repeat(50));
      const byCat: Record<string, typeof resources> = {};
      for (const r of resources) {
        if (!byCat[r.category]) byCat[r.category] = [];
        byCat[r.category].push(r);
      }
      for (const [cat, recs] of Object.entries(byCat)) {
        lines.push(`\n  ${CATEGORY_ICONS[cat] || "•"} ${cat.toUpperCase()}`);
        for (const r of recs) {
          lines.push(`    ${r.name}`);
          if (r.phone) lines.push(`      📞 ${r.phone}`);
          if (r.address) lines.push(`      📍 ${r.address}, ${r.city}`);
          if (r.website) lines.push(`      🌐 ${r.website}`);
          if (r.hours) lines.push(`      🕐 ${r.hours}`);
          const tags = [r.freeService && "Free", r.mediCalAccepted && "Medi-Cal", r.ecmEligible && "ECM Eligible", r.slidingScale && "Sliding Scale"].filter(Boolean);
          if (tags.length) lines.push(`      ✓ ${tags.join(" | ")}`);
          lines.push("");
        }
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pathways360-resources-${selectedCounty || "all-counties"}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-teal-600" />
            Northern California Resource Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Butte · Shasta · Trinity · Tehama · Humboldt · Siskiyou — {filtered.length} resources
          </p>
        </div>
        <Button onClick={handleDownload} variant="outline" className="gap-2 shrink-0">
          <Download className="h-4 w-4" /> Download Guide
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, service, city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Counties</SelectItem>
                {COUNTIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-52">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_ICONS[c] || "•"} {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setEcmOnly(!ecmOnly)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${ecmOnly ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"}`}
            >
              ECM Eligible
            </button>
            <button
              onClick={() => setMediCalOnly(!mediCalOnly)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${mediCalOnly ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
            >
              Medi-Cal Accepted
            </button>
            <button
              onClick={() => setFreeOnly(!freeOnly)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${freeOnly ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}
            >
              Free Services
            </button>
            {(selectedCounty || selectedCategory || search || ecmOnly || mediCalOnly || freeOnly) && (
              <button
                onClick={() => { setSelectedCounty(""); setSelectedCategory(""); setSearch(""); setEcmOnly(false); setMediCalOnly(false); setFreeOnly(false); }}
                className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Quick-Nav */}
      <div className="flex flex-wrap gap-2">
        {["Emergency Shelter", "Housing Programs", "Mental Health", "Substance Use Treatment", "AA/NA", "Employment", "Benefits", "Medical", "Food Bank", "Legal Aid", "Veterans", "Reentry"].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedCategory === cat ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
          >
            {CATEGORY_ICONS[cat] || "•"} {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="directory">All Resources ({filtered.length})</TabsTrigger>
          <TabsTrigger value="by-county">By County</TabsTrigger>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No resources match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-county" className="mt-4 space-y-6">
          {COUNTIES.filter(c => !selectedCounty || c.value === selectedCounty).map(county => {
            const resources = byCounty[county.value] || [];
            if (resources.length === 0) return null;
            return (
              <div key={county.value}>
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-teal-600" />
                  {county.label}
                  <span className="text-sm font-normal text-gray-400">({resources.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map(r => <ResourceCard key={r.id} resource={r} compact />)}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="by-category" className="mt-4 space-y-6">
          {Object.entries(byCategory).sort(([a], [b]) => a.localeCompare(b)).map(([cat, resources]) => (
            <div key={cat}>
              <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-xl">{CATEGORY_ICONS[cat] || "📍"}</span>
                {cat}
                <span className="text-sm font-normal text-gray-400">({resources.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.map(r => <ResourceCard key={r.id} resource={r} compact />)}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
