import { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { MapPin, Calendar, Clock, Building2, Briefcase, Search, Filter } from 'lucide-react';

/**
 * Job Board Component
 * 
 * Features:
 * - Browse active job postings (full-time, part-time, temp, seasonal, contract)
 * - Search and filter by county, job type
 * - Apply for jobs
 * - View temporary agencies by county
 * - Track job applications
 * - Client-friendly dashboard display
 */

export function JobBoard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [selectedJobType, setSelectedJobType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);

  // Fetch jobs
  const { data: jobs, isLoading: jobsLoading } = trpc.jobBoard.getJobs.useQuery({
    county: selectedCounty || undefined,
    jobType: (selectedJobType as any) || undefined,
    limit: 50,
  });

  // Fetch job stats
  const { data: jobStats } = trpc.jobBoard.getJobStats.useQuery({
    county: selectedCounty || undefined,
  });

  // Fetch temp agencies
  const { data: tempAgencies, isLoading: agenciesLoading } = trpc.jobBoard.getTempAgencies.useQuery({
    county: selectedCounty || undefined,
  });

  // Fetch user's applications
  const { data: myApplications, refetch: refetchApplications } = trpc.jobBoard.getMyApplications.useQuery();

  // Apply for job mutation
  const applyMutation = trpc.jobBoard.applyForJob.useMutation({
    onSuccess: () => {
      refetchApplications();
      setSelectedJob(null);
    },
  });

  // Filter jobs by search term
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    if (!searchTerm) return jobs;
    return jobs.filter((job: any) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  // Check if user has already applied
  const hasApplied = (jobId: number) => {
    return myApplications?.some((app: any) => app.jobPostingId === jobId);
  };

  const jobTypes = [
    { value: 'full_time', label: 'Full-Time' },
    { value: 'part_time', label: 'Part-Time' },
    { value: 'temporary', label: 'Temporary' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'contract', label: 'Contract' },
  ];

  const counties = [
    'Shasta',
    'Tehama',
    'Butte',
    'Glenn',
    'Colusa',
    'Sutter',
    'Yuba',
    'Placer',
    'El Dorado',
    'Amador',
    'Calaveras',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Job Board</h1>
          <p className="text-lg text-slate-600">Find employment opportunities in your area</p>
        </div>

        {/* Stats Cards */}
        {jobStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{jobStats.total}</div>
                  <div className="text-sm text-slate-600 mt-2">Total Jobs</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{jobStats.byType?.full_time || 0}</div>
                  <div className="text-sm text-slate-600 mt-2">Full-Time</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{jobStats.byType?.part_time || 0}</div>
                  <div className="text-sm text-slate-600 mt-2">Part-Time</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{jobStats.byType?.temporary || 0}</div>
                  <div className="text-sm text-slate-600 mt-2">Temporary</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="agencies">Temp Agencies</TabsTrigger>
            <TabsTrigger value="applications">My Applications ({myApplications?.length || 0})</TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            {/* Filters */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* County Filter */}
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Counties</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>
                        {county} County
                      </option>
                    ))}
                  </select>

                  {/* Job Type Filter */}
                  <select
                    value={selectedJobType}
                    onChange={(e) => setSelectedJobType(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            {jobsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : filteredJobs && filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job: any) => (
                  <Card key={job.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-slate-900">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-2">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </CardDescription>
                        </div>
                        <Badge
                          className={
                            job.jobType === 'full_time'
                              ? 'bg-green-100 text-green-800'
                              : job.jobType === 'part_time'
                              ? 'bg-blue-100 text-blue-800'
                              : job.jobType === 'temporary'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-purple-100 text-purple-800'
                          }
                        >
                          {jobTypes.find((t) => t.value === job.jobType)?.label || job.jobType}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 line-clamp-2">{job.description}</p>

                      <div className="space-y-2 text-sm text-slate-600">
                        {job.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {job.location}
                          </div>
                        )}
                        {job.salary && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            {job.salary}
                          </div>
                        )}
                        {job.postedDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            Posted {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedJob(job)}
                            disabled={hasApplied(job.id)}
                          >
                            {hasApplied(job.id) ? 'Already Applied' : 'View & Apply'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{job.title}</DialogTitle>
                            <DialogDescription>{job.company}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 max-h-96 overflow-y-auto">
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
                              <p className="text-slate-600">{job.description}</p>
                            </div>
                            {job.requirements && (
                              <div>
                                <h4 className="font-semibold text-slate-900 mb-2">Requirements</h4>
                                <p className="text-slate-600">{job.requirements}</p>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">Type:</span>
                                <p className="font-semibold">{jobTypes.find((t) => t.value === job.jobType)?.label}</p>
                              </div>
                              <div>
                                <span className="text-slate-600">Salary:</span>
                                <p className="font-semibold">{job.salary || 'Not specified'}</p>
                              </div>
                              <div>
                                <span className="text-slate-600">Location:</span>
                                <p className="font-semibold">{job.location}</p>
                              </div>
                              <div>
                                <span className="text-slate-600">County:</span>
                                <p className="font-semibold">{job.county}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedJob(null)}
                              className="flex-1"
                            >
                              Close
                            </Button>
                            <Button
                              onClick={() => {
                                applyMutation.mutate({
                                  jobPostingId: job.id,
                                  notes: `Interested in ${job.title} position`,
                                });
                              }}
                              disabled={hasApplied(job.id) || applyMutation.isPending}
                              className="flex-1"
                            >
                              {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No jobs found. Try adjusting your filters.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-6">
            {agenciesLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : tempAgencies && tempAgencies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tempAgencies.map((agency: any) => (
                  <Card key={agency.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-900">{agency.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <MapPin className="w-4 h-4" />
                        {agency.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-600 text-sm">{agency.description}</p>
                      <div className="space-y-2 text-sm text-slate-600">
                        {agency.phone && (
                          <div>
                            <span className="font-semibold">Phone:</span> {agency.phone}
                          </div>
                        )}
                        {agency.email && (
                          <div>
                            <span className="font-semibold">Email:</span> {agency.email}
                          </div>
                        )}
                        {agency.website && (
                          <div>
                            <span className="font-semibold">Website:</span>{' '}
                            <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {agency.website}
                            </a>
                          </div>
                        )}
                      </div>
                      <Button variant="outline" className="w-full">
                        Contact Agency
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No temp agencies found in your area.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            {myApplications && myApplications.length > 0 ? (
              <div className="space-y-4">
                {myApplications.map((app: any) => (
                  <Card key={app.id} className="bg-white border-0 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-slate-900">Job Application #{app.id}</h3>
                          <p className="text-sm text-slate-600 mt-1">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                          {app.notes && <p className="text-sm text-slate-600 mt-2">{app.notes}</p>}
                        </div>
                        <Badge
                          className={
                            app.status === 'applied'
                              ? 'bg-blue-100 text-blue-800'
                              : app.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }
                        >
                          {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">You haven't applied to any jobs yet.</p>
                  <Button
                    onClick={() => setActiveTab('jobs')}
                    className="mt-4"
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
