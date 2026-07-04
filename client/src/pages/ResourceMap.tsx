import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, Phone, Globe, Navigation, Heart, ExternalLink, Locate, Search, Clock, X } from "lucide-react";
import { toast } from "sonner";

const COUNTIES = ["All Counties", "Butte", "Shasta", "Trinity", "Tehama", "Humboldt", "Siskiyou"];
const CATEGORIES = [
  "All Categories", "emergency_shelter", "transitional_housing", "recovery_housing", "stph",
  "mat_program", "aa_na", "mental_health", "counseling", "ecm_provider", "employment",
  "education", "food_bank", "legal_aid", "reentry", "veterans", "domestic_violence",
  "county_benefits", "peer_support", "transportation", "medical"
];
const CATEGORY_LABELS: Record<string, string> = {
  emergency_shelter: "Emergency Shelter", transitional_housing: "Transitional Housing",
  recovery_housing: "Recovery Housing", stph: "STPH", mat_program: "MAT Program",
  aa_na: "AA/NA", mental_health: "Mental Health", counseling: "Counseling",
  ecm_provider: "ECM Provider", employment: "Employment", education: "Education",
  food_bank: "Food Bank", legal_aid: "Legal Aid", reentry: "Reentry",
  veterans: "Veterans", domestic_violence: "Domestic Violence", county_benefits: "County Benefits",
  peer_support: "Peer Support", transportation: "Transportation", medical: "Medical"
};
const CATEGORY_COLORS: Record<string, string> = {
  emergency_shelter: "bg-red-100 text-red-800", transitional_housing: "bg-orange-100 text-orange-800",
  recovery_housing: "bg-purple-100 text-purple-800", stph: "bg-indigo-100 text-indigo-800",
  mat_program: "bg-blue-100 text-blue-800", aa_na: "bg-teal-100 text-teal-800",
  mental_health: "bg-green-100 text-green-800", counseling: "bg-emerald-100 text-emerald-800",
  ecm_provider: "bg-cyan-100 text-cyan-800", employment: "bg-yellow-100 text-yellow-800",
  education: "bg-lime-100 text-lime-800", food_bank: "bg-amber-100 text-amber-800",
  legal_aid: "bg-rose-100 text-rose-800", reentry: "bg-pink-100 text-pink-800",
  veterans: "bg-blue-100 text-blue-800", domestic_violence: "bg-red-100 text-red-800",
  county_benefits: "bg-gray-100 text-gray-800", peer_support: "bg-violet-100 text-violet-800",
  transportation: "bg-sky-100 text-sky-800", medical: "bg-green-100 text-green-800"
};

// Approximate county center coordinates for distance calculation
const COUNTY_COORDS: Record<string, { lat: number; lng: number }> = {
  Butte: { lat: 39.73, lng: -121.60 },
  Shasta: { lat: 40.59, lng: -122.39 },
  Trinity: { lat: 40.65, lng: -123.11 },
  Tehama: { lat: 40.12, lng: -122.23 },
  Humboldt: { lat: 40.74, lng: -124.01 },
  Siskiyou: { lat: 41.59, lng: -122.54 },
};

// Haversine formula — returns distance in miles
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const RECENT_SEARCHES_KEY = "pathways360_recent_searches";
function loadRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || "[]"); } catch { return []; }
}
function saveRecentSearch(term: string) {
  if (!term.trim()) return;
  const prev = loadRecentSearches().filter(s => s !== term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify([term, ...prev].slice(0, 8)));
}

export default function ResourceMap() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedCounty, setSelectedCounty] = useState("All Counties");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [keyword, setKeyword] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [sortByDistance, setSortByDistance] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);
  const [showRecent, setShowRecent] = useState(false);

  const { data: resources = [] } = trpc.countyResources.list.useQuery({
    county: selectedCounty === "All Counties" ? undefined : selectedCounty,
    category: selectedCategory === "All Categories" ? undefined : selectedCategory,
    search: appliedKeyword || undefined,
  });

  const addFavMutation = trpc.favorites.add.useMutation({
    onSuccess: (_, vars) => {
      setFavoritedIds(prev => { const next = new Set(Array.from(prev)); next.add(vars.resourceId); return next; });
      toast.success("Saved to favorites");
    },
    onError: (e) => toast.error(e.message),
  });
  const trackViewMutation = trpc.favorites.trackView.useMutation();

  const handleSelectResource = (r: any) => {
    setSelectedResource(r);
    if (isAuthenticated) trackViewMutation.mutate({ resourceId: r.id, resourceName: r.name });
  };

  const handleSearch = useCallback(() => {
    const term = keyword.trim();
    setAppliedKeyword(term);
    if (term) {
      saveRecentSearch(term);
      setRecentSearches(loadRecentSearches());
    }
    setShowRecent(false);
  }, [keyword]);

  const handleRecentSearch = (term: string) => {
    setKeyword(term);
    setAppliedKeyword(term);
    setShowRecent(false);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortByDistance(true);
        setLocationLoading(false);
        toast.success("Location found — resources sorted by distance.");
      },
      () => {
        setLocationLoading(false);
        toast.error("Could not get your location. Please allow location access and try again.");
      },
      { timeout: 10000 }
    );
  };

  // Compute distances and sort
  const resourcesWithDistance = (resources as any[]).map((r: any) => {
    let distance: number | null = null;
    if (userLocation && r.county && COUNTY_COORDS[r.county]) {
      const cc = COUNTY_COORDS[r.county];
      distance = haversineDistance(userLocation.lat, userLocation.lng, cc.lat, cc.lng);
    }
    return { ...r, distance };
  });

  const sortedResources = sortByDistance && userLocation
    ? [...resourcesWithDistance].sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      })
    : resourcesWithDistance;

  // Group by county for list view (unless sorted by distance)
  const grouped: Record<string, any[]> = {};
  if (!sortByDistance || !userLocation) {
    sortedResources.forEach((r: any) => {
      if (!grouped[r.county]) grouped[r.county] = [];
      grouped[r.county].push(r);
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/resources")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Resource Map</h1>
            <p className="text-xs text-muted-foreground">
              {sortedResources.length} resources
              {userLocation ? " · sorted by distance" : " · across Northern California"}
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={requestLocation} disabled={locationLoading}>
            <Locate className="w-3.5 h-3.5" />
            {locationLoading ? "Locating..." : userLocation ? "Near Me" : "Use My Location"}
          </Button>
        </div>
        {/* Filters */}
        <div className="max-w-5xl mx-auto px-4 pb-3 space-y-2">
          {/* Search bar */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  onFocus={() => setShowRecent(true)}
                  onBlur={() => setTimeout(() => setShowRecent(false), 150)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  className="pl-8 h-8 text-xs"
                />
              </div>
              <Button size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white px-3" onClick={handleSearch}>Search</Button>
              {appliedKeyword && (
                <Button size="sm" variant="ghost" className="h-8 text-xs px-2" onClick={() => { setKeyword(""); setAppliedKeyword(""); }}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
            {/* Recent searches dropdown */}
            {showRecent && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-xl shadow-lg z-20 mt-1 py-1">
                <div className="flex items-center justify-between px-3 py-1">
                  <span className="text-xs text-muted-foreground font-medium">Recent Searches</span>
                  <button onClick={clearRecentSearches} className="text-xs text-red-500 hover:underline">Clear</button>
                </div>
                {recentSearches.map(term => (
                  <button key={term} onMouseDown={() => handleRecentSearch(term)}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />{term}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* County / Category filters */}
          <div className="flex gap-2 overflow-x-auto">
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="h-8 text-xs w-36 flex-shrink-0"><SelectValue /></SelectTrigger>
              <SelectContent>{COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-8 text-xs w-44 flex-shrink-0"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c === "All Categories" ? c : (CATEGORY_LABELS[c] || c)}</SelectItem>)}</SelectContent>
            </Select>
            {userLocation && (
              <Button size="sm" variant={sortByDistance ? "default" : "outline"}
                className={`h-8 text-xs flex-shrink-0 ${sortByDistance ? "bg-teal-600 hover:bg-teal-700 text-white" : ""}`}
                onClick={() => setSortByDistance(v => !v)}>
                <Navigation className="w-3.5 h-3.5 mr-1" />Nearest First
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full flex-1 flex gap-4 p-4">
        {/* Resource list */}
        <div className={`w-full md:w-80 flex-shrink-0 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)] ${selectedResource ? "hidden md:block" : "block"}`}>
          {sortedResources.length === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center">
              <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No resources found for these filters.</p>
            </div>
          ) : sortByDistance && userLocation ? (
            <div className="space-y-2">
              {sortedResources.map((r: any) => (
                <button key={r.id} onClick={() => handleSelectResource(r)}
                  className={`w-full text-left bg-white rounded-xl border p-3 hover:border-teal-400 transition-colors ${selectedResource?.id === r.id ? "border-teal-500 bg-teal-50" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${CATEGORY_COLORS[r.category] || "bg-gray-100 text-gray-800"}`}>
                          {CATEGORY_LABELS[r.category] || r.category}
                        </Badge>
                        {r.distance !== null && (
                          <span className="text-xs text-teal-600 font-medium">~{r.distance.toFixed(1)} mi</span>
                        )}
                      </div>
                    </div>
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  </div>
                  {r.address && <p className="text-xs text-muted-foreground mt-1 truncate">{r.address}</p>}
                </button>
              ))}
            </div>
          ) : (
            Object.entries(grouped).map(([county, items]) => (
              <div key={county}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 px-1">{county} County ({items.length})</h3>
                <div className="space-y-2">
                  {items.map((r: any) => (
                    <button key={r.id} onClick={() => handleSelectResource(r)}
                      className={`w-full text-left bg-white rounded-xl border p-3 hover:border-teal-400 transition-colors ${selectedResource?.id === r.id ? "border-teal-500 bg-teal-50" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{r.name}</p>
                          <Badge className={`text-xs mt-1 ${CATEGORY_COLORS[r.category] || "bg-gray-100 text-gray-800"}`}>
                            {CATEGORY_LABELS[r.category] || r.category}
                          </Badge>
                        </div>
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      </div>
                      {r.address && <p className="text-xs text-muted-foreground mt-1 truncate">{r.address}</p>}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className={`flex-1 ${selectedResource ? "block" : "hidden md:flex md:items-center md:justify-center"}`}>
          {!selectedResource ? (
            <div className="text-center text-muted-foreground">
              <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-medium">Select a resource</p>
              <p className="text-sm mt-1">Click any resource to see details, contact info, and directions.</p>
              {!userLocation && (
                <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={requestLocation} disabled={locationLoading}>
                  <Locate className="w-3.5 h-3.5" />
                  {locationLoading ? "Locating..." : "Sort by Distance"}
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h2 className="font-bold text-lg">{selectedResource.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${CATEGORY_COLORS[selectedResource.category] || "bg-gray-100 text-gray-800"}`}>
                      {CATEGORY_LABELS[selectedResource.category] || selectedResource.category}
                    </Badge>
                    {selectedResource.distance !== null && selectedResource.distance !== undefined && (
                      <span className="text-xs text-teal-600 font-medium">~{selectedResource.distance.toFixed(1)} mi away</span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedResource(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </div>

              {selectedResource.description && (
                <p className="text-sm text-gray-700">{selectedResource.description}</p>
              )}

              <div className="space-y-2">
                {selectedResource.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{selectedResource.address}</p>
                      <p className="text-muted-foreground">{[selectedResource.city, selectedResource.state, selectedResource.zipCode].filter(Boolean).join(", ")}</p>
                    </div>
                  </div>
                )}
                {selectedResource.phone && (
                  <a href={`tel:${selectedResource.phone}`} className="flex items-center gap-2 text-sm text-teal-600 hover:underline">
                    <Phone className="w-4 h-4" />{selectedResource.phone}
                  </a>
                )}
                {selectedResource.website && (
                  <a href={selectedResource.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <Globe className="w-4 h-4" />Visit Website <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedResource.isEcmEligible && <Badge className="bg-cyan-100 text-cyan-800 text-xs">ECM Eligible</Badge>}
                {selectedResource.acceptsMediCal && <Badge className="bg-green-100 text-green-800 text-xs">Medi-Cal Accepted</Badge>}
                {selectedResource.isFree && <Badge className="bg-teal-100 text-teal-800 text-xs">Free Service</Badge>}
                {selectedResource.acceptingClients === false && <Badge className="bg-red-100 text-red-800 text-xs">Not Accepting Clients</Badge>}
                {selectedResource.hasWaitlist && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Waitlist</Badge>}
              </div>

              {selectedResource.hours && (
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <p className="font-medium text-xs text-muted-foreground uppercase mb-1">Hours</p>
                  <p>{selectedResource.hours}</p>
                </div>
              )}

              <div className="flex gap-2">
                {selectedResource.address && (
                  <a href={`https://maps.google.com/?q=${encodeURIComponent([selectedResource.address, selectedResource.city, selectedResource.state].filter(Boolean).join(", "))}`}
                    target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 text-sm">
                      <Navigation className="w-4 h-4" /> Get Directions
                    </Button>
                  </a>
                )}
                {isAuthenticated && (
                  <Button variant="outline" className="gap-2 text-sm"
                    onClick={() => addFavMutation.mutate({ resourceId: selectedResource.id, resourceName: selectedResource.name })}
                    disabled={favoritedIds.has(selectedResource.id)}>
                    <Heart className={`w-4 h-4 ${favoritedIds.has(selectedResource.id) ? "fill-red-500 text-red-500" : ""}`} />
                    {favoritedIds.has(selectedResource.id) ? "Saved" : "Save"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
