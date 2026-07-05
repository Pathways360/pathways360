import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, XCircle, Clock, Briefcase, MapPin, Users } from 'lucide-react';

/**
 * Recommendations Dashboard Component
 * 
 * Features:
 * - Display personalized recommendations based on assessment
 * - Accept/decline recommendations
 * - Convert accepted recommendations to feed items
 * - Track recommendation status
 * - View recommendation statistics
 */

export function RecommendationsDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch recommendations
  const { data: recommendations, isLoading, refetch } = trpc.postAssessmentRecommendations.getRecommendations.useQuery({
    status: activeTab as any,
  });

  // Fetch recommendation stats
  const { data: stats } = trpc.postAssessmentRecommendations.getRecommendationStats.useQuery();

  // Accept recommendation mutation
  const acceptMutation = trpc.postAssessmentRecommendations.acceptRecommendation.useMutation({
    onSuccess: () => refetch(),
  });

  // Decline recommendation mutation
  const declineMutation = trpc.postAssessmentRecommendations.declineRecommendation.useMutation({
    onSuccess: () => refetch(),
  });

  // Complete recommendation mutation
  const completeMutation = trpc.postAssessmentRecommendations.completeRecommendation.useMutation({
    onSuccess: () => refetch(),
  });

  const recommendationTypes = [
    { value: 'job', label: 'Job Opportunities', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'resource', label: 'Resources', icon: <MapPin className="w-5 h-5" /> },
    { value: 'service', label: 'Services', icon: <Users className="w-5 h-5" /> },
    { value: 'event', label: 'Events', icon: <Clock className="w-5 h-5" /> },
    { value: 'support_group', label: 'Support Groups', icon: <Users className="w-5 h-5" /> },
    { value: 'meal', label: 'Meal Programs', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'medical', label: 'Medical Services', icon: <Briefcase className="w-5 h-5" /> },
    { value: 'counseling', label: 'Counseling', icon: <Users className="w-5 h-5" /> },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Personalized Recommendations</h1>
          <p className="text-lg text-slate-600">Based on your assessment, here are tailored opportunities and resources for you</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-slate-600 mt-2">Pending</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
                  <div className="text-sm text-slate-600 mt-2">Accepted</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">{stats.declined}</div>
                  <div className="text-sm text-slate-600 mt-2">Declined</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.completed}</div>
                  <div className="text-sm text-slate-600 mt-2">Completed</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="pending">Pending ({stats?.pending || 0})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({stats?.accepted || 0})</TabsTrigger>
            <TabsTrigger value="declined">Declined ({stats?.declined || 0})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({stats?.completed || 0})</TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec: any) => (
                  <Card key={rec.id} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{rec.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(rec.priority)}>
                                {rec.priority?.charAt(0).toUpperCase() + rec.priority?.slice(1)} Priority
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-800">
                                {recommendationTypes.find(t => t.value === rec.type)?.label || rec.type}
                              </Badge>
                            </div>
                          </div>

                          {rec.reason && (
                            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <p className="text-sm text-slate-700">
                                <span className="font-semibold">Why this recommendation:</span> {rec.reason}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2 mt-4">
                            <Button
                              onClick={() => acceptMutation.mutate(rec.id)}
                              disabled={acceptMutation.isPending}
                              className="flex-1"
                            >
                              {acceptMutation.isPending ? 'Accepting...' : 'Accept'}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => declineMutation.mutate(rec.id)}
                              disabled={declineMutation.isPending}
                              className="flex-1"
                            >
                              {declineMutation.isPending ? 'Declining...' : 'Decline'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-4" />
                  <p className="text-slate-600">No pending recommendations. Great job!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Accepted Tab */}
          <TabsContent value="accepted" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec: any) => (
                  <Card key={rec.id} className="bg-green-50 border-l-4 border-green-500 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{rec.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                          <div className="mt-3 flex gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              {recommendationTypes.find(t => t.value === rec.type)?.label || rec.type}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-800">
                              Accepted {rec.acceptedDate ? new Date(rec.acceptedDate).toLocaleDateString() : ''}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={() => completeMutation.mutate(rec.id)}
                            disabled={completeMutation.isPending}
                          >
                            {completeMutation.isPending ? 'Marking...' : 'Mark as Completed'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No accepted recommendations yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Declined Tab */}
          <TabsContent value="declined" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec: any) => (
                  <Card key={rec.id} className="bg-red-50 border-l-4 border-red-500 shadow-sm opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{rec.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                          <div className="mt-3 flex gap-2">
                            <Badge className="bg-red-100 text-red-800">
                              {recommendationTypes.find(t => t.value === rec.type)?.label || rec.type}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-800">Declined</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No declined recommendations.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Completed Tab */}
          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.map((rec: any) => (
                  <Card key={rec.id} className="bg-blue-50 border-l-4 border-blue-500 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{rec.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                          <div className="mt-3 flex gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {recommendationTypes.find(t => t.value === rec.type)?.label || rec.type}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-800">
                              Completed {rec.completedDate ? new Date(rec.completedDate).toLocaleDateString() : ''}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="py-12 text-center">
                  <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No completed recommendations yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
