import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function AdvancedSearch() {
  const [searchType, setSearchType] = useState<'clients' | 'resources' | 'providers' | 'events'>('resources');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    specialty: '',
    availability: '',
    status: '',
  });
  const [results, setResults] = useState<any[]>([]);
  const [savedSearches, setSavedSearches] = useState<any[]>([
    { id: 1, name: 'Mental Health Providers', type: 'providers', filters: { specialty: 'Mental Health' } },
    { id: 2, name: 'Housing Resources', type: 'resources', filters: { category: 'Housing' } },
  ]);
  const [searchAlerts, setSearchAlerts] = useState<any[]>([
    { id: 1, name: 'New Counselors', savedSearchId: 1, frequency: 'daily', matchCount: 3 },
  ]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSearch = () => {
    // Mock search results
    const mockResults = [
      { id: 1, name: 'John Counselor', type: 'provider', specialty: 'Mental Health', location: 'Butte County' },
      { id: 2, name: 'Mental Health Services', type: 'resource', category: 'Mental Health', location: 'Butte County' },
      { id: 3, name: 'Dr. Jane Smith', type: 'provider', specialty: 'Primary Care', location: 'Shasta County' },
    ];
    setResults(mockResults);
    toast.success(`Found ${mockResults.length} results`);
  };

  const handleSaveSearch = () => {
    if (!saveName.trim()) {
      toast.error('Please enter a search name');
      return;
    }
    const newSearch = {
      id: savedSearches.length + 1,
      name: saveName,
      type: searchType,
      filters,
    };
    setSavedSearches([...savedSearches, newSearch]);
    setSaveName('');
    setShowSaveDialog(false);
    toast.success('Search saved');
  };

  const handleDeleteSearch = (id: number) => {
    setSavedSearches(savedSearches.filter(s => s.id !== id));
    toast.success('Search deleted');
  };

  const handleCreateAlert = (savedSearchId: number) => {
    const newAlert = {
      id: searchAlerts.length + 1,
      name: `Alert for ${savedSearches.find(s => s.id === savedSearchId)?.name}`,
      savedSearchId,
      frequency: 'daily',
      matchCount: 0,
    };
    setSearchAlerts([...searchAlerts, newAlert]);
    toast.success('Search alert created');
  };

  const handleDeleteAlert = (id: number) => {
    setSearchAlerts(searchAlerts.filter(a => a.id !== id));
    toast.success('Alert deleted');
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advanced Search</h1>
        <p className="text-muted-foreground">Find clients, resources, providers, and events with advanced filters</p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="saved">Saved Searches</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>Refine your search with advanced filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search-type">Search Type</Label>
                  <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                    <SelectTrigger id="search-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clients">Clients</SelectItem>
                      <SelectItem value="resources">Resources</SelectItem>
                      <SelectItem value="providers">Providers</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="query">Search Query</Label>
                  <Input
                    id="query"
                    placeholder="Enter name, keyword, or ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={filters.location} onValueChange={(v) => setFilters({ ...filters, location: v })}>
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select county..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="butte">Butte County</SelectItem>
                      <SelectItem value="shasta">Shasta County</SelectItem>
                      <SelectItem value="trinity">Trinity County</SelectItem>
                      <SelectItem value="tehama">Tehama County</SelectItem>
                      <SelectItem value="humboldt">Humboldt County</SelectItem>
                      <SelectItem value="siskiyou">Siskiyou County</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty/Category</Label>
                  <Select value={filters.specialty} onValueChange={(v) => setFilters({ ...filters, specialty: v })}>
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Select specialty..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mental-health">Mental Health</SelectItem>
                      <SelectItem value="substance-abuse">Substance Abuse</SelectItem>
                      <SelectItem value="primary-care">Primary Care</SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="employment">Employment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={filters.availability} onValueChange={(v) => setFilters({ ...filters, availability: v })}>
                    <SelectTrigger id="availability">
                      <SelectValue placeholder="Select availability..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available Now</SelectItem>
                      <SelectItem value="waitlist">On Waitlist</SelectItem>
                      <SelectItem value="telehealth">Telehealth Only</SelectItem>
                      <SelectItem value="in-person">In-Person Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSearch}>Search</Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(true)}>
                  Save This Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Results ({results.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {results.map((result) => (
                    <div key={result.id} className="p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{result.name}</p>
                          <p className="text-sm text-muted-foreground">{result.location}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">{result.type}</Badge>
                            {result.specialty && <Badge variant="outline">{result.specialty}</Badge>}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Searches Tab */}
        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Searches</CardTitle>
              <CardDescription>Quickly access your frequently used searches</CardDescription>
            </CardHeader>
            <CardContent>
              {savedSearches.length === 0 ? (
                <p className="text-muted-foreground">No saved searches yet. Save a search to get started.</p>
              ) : (
                <div className="space-y-2">
                  {savedSearches.map((search) => (
                    <div key={search.id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{search.name}</p>
                        <p className="text-sm text-muted-foreground">Type: {search.type}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCreateAlert(search.id)}>
                          Create Alert
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteSearch(search.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Alerts</CardTitle>
              <CardDescription>Get notified when new matches are found</CardDescription>
            </CardHeader>
            <CardContent>
              {searchAlerts.length === 0 ? (
                <p className="text-muted-foreground">No search alerts yet. Create one from a saved search.</p>
              ) : (
                <div className="space-y-2">
                  {searchAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">{alert.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Frequency: {alert.frequency} • {alert.matchCount} new matches
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteAlert(alert.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Save This Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="save-name">Search Name</Label>
                <Input
                  id="save-name"
                  placeholder="e.g., Mental Health Providers in Butte"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveSearch}>Save</Button>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
