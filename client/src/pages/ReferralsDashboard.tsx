import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Clock, Send, Bell, MapPin, Calendar } from 'lucide-react';

/**
 * Bi-Directional Referrals Dashboard Component
 * 
 * Features:
 * - View referrals sent by case managers
 * - Accept/decline referrals
 * - Mark referrals as completed
 * - One-click referral sending (for case managers)
 * - Automatic reminders
 * - Real-time status tracking
 */

export function ReferralsDashboard() {
  const [activeTab, setActiveTab] = useState('received');
  const [selectedReferral, setSelectedReferral] = useState<any>(null);

  // Fetch client referrals
  const { data: referrals, isLoading, refetch } = trpc.biDirectionalReferrals.getClientReferrals.useQuery({});

  // Fetch referral stats
  const { data: stats } = trpc.biDirectionalReferrals.getReferralStats.useQuery({});

  // Respond to referral mutation
  const respondMutation = trpc.biDirectionalReferrals.respondToReferral.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedReferral(null);
    },
  });

  // Send reminder mutation
  const sendReminderMutation = trpc.biDirectionalReferrals.sendReminder.useMutation({
    onSuccess: () => refetch(),
  });

  const referralTypes = [
    { value: 'job', label: 'Job Opportunity', color: 'bg-blue-100 text-blue-800' },
    { value: 'resource', label: 'Resource', color: 'bg-green-100 text-green-800' },
    { value: 'service', label: 'Service', color: 'bg-purple-100 text-purple-800' },
    { value: 'event', label: 'Event', color: 'bg-orange-100 text-orange-800' },
    { value: 'meal', label: 'Meal Program', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'medical', label: 'Medical Service', color: 'bg-red-100 text-red-800' },
    { value: 'counseling', label: 'Counseling', color: 'bg-indigo-100 text-indigo-800' },
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const filterReferrals = (status: string) => {
    return referrals?.filter((ref: any) => ref.status === status) || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Referrals</h1>
          <p className="text-lg text-slate-600">Manage referrals from your case manager and support team</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{stats.pending}</div>
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
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{stats.sent}</div>
                  <div className="text-sm text-slate-600 mt-2">Total Sent</div>
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
            ) : filterReferrals('sent').length > 0 ? (
              <div className="space-y-4">
                {filterReferrals('sent').map((ref: any) => (
                  <Card key={ref.id} className="bg-white border-l-4 border-yellow-400 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">{ref.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{ref.description}</p>
                            </div>
                            <Badge className={referralTypes.find(t => t.value === ref.referralType)?.color || 'bg-slate-100 text-slate-800'}>
                              {referralTypes.find(t => t.value === ref.referralType)?.label || ref.referralType}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm text-slate-600 mt-3">
                            {ref.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {ref.location}
                              </div>
                            )}
                            {ref.eventDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(ref.eventDate).toLocaleDateString()} {ref.eventTime && `at ${ref.eventTime}`}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedReferral(ref)}
                                  className="flex-1"
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>{ref.title}</DialogTitle>
                                  <DialogDescription>{ref.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-slate-900 mb-2">Details</h4>
                                    <div className="space-y-2 text-sm text-slate-600">
                                      {ref.location && <div>📍 Location: {ref.location}</div>}
                                      {ref.eventDate && <div>📅 Date: {new Date(ref.eventDate).toLocaleDateString()}</div>}
                                      {ref.eventTime && <div>⏰ Time: {ref.eventTime}</div>}
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => {
                                        respondMutation.mutate({
                                          referralId: ref.id,
                                          status: 'accepted',
                                        });
                                      }}
                                      disabled={respondMutation.isPending}
                                      className="flex-1"
                                    >
                                      {respondMutation.isPending ? 'Processing...' : 'Accept Referral'}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        respondMutation.mutate({
                                          referralId: ref.id,
                                          status: 'declined',
                                        });
                                      }}
                                      disabled={respondMutation.isPending}
                                      className="flex-1"
                                    >
                                      {respondMutation.isPending ? 'Processing...' : 'Decline'}
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendReminderMutation.mutate({
                                referralId: ref.id,
                                reminderMethod: 'in_app',
                              })}
                              disabled={sendReminderMutation.isPending}
                            >
                              <Bell className="w-4 h-4" />
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
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No pending referrals. Check back soon!</p>
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
            ) : filterReferrals('accepted').length > 0 ? (
              <div className="space-y-4">
                {filterReferrals('accepted').map((ref: any) => (
                  <Card key={ref.id} className="bg-green-50 border-l-4 border-green-500 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{ref.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{ref.description}</p>
                          <div className="mt-3 flex gap-2 flex-wrap">
                            <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                            <Badge className={referralTypes.find(t => t.value === ref.referralType)?.color || 'bg-slate-100 text-slate-800'}>
                              {referralTypes.find(t => t.value === ref.referralType)?.label || ref.referralType}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                              respondMutation.mutate({
                                referralId: ref.id,
                                status: 'completed',
                              });
                            }}
                            disabled={respondMutation.isPending}
                          >
                            {respondMutation.isPending ? 'Marking...' : 'Mark as Completed'}
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
                  <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No accepted referrals yet.</p>
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
            ) : filterReferrals('declined').length > 0 ? (
              <div className="space-y-4">
                {filterReferrals('declined').map((ref: any) => (
                  <Card key={ref.id} className="bg-red-50 border-l-4 border-red-500 shadow-sm opacity-75">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{ref.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{ref.description}</p>
                          <div className="mt-3 flex gap-2">
                            <Badge className="bg-red-100 text-red-800">Declined</Badge>
                            <Badge className={referralTypes.find(t => t.value === ref.referralType)?.color || 'bg-slate-100 text-slate-800'}>
                              {referralTypes.find(t => t.value === ref.referralType)?.label || ref.referralType}
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
                  <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No declined referrals.</p>
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
            ) : filterReferrals('completed').length > 0 ? (
              <div className="space-y-4">
                {filterReferrals('completed').map((ref: any) => (
                  <Card key={ref.id} className="bg-blue-50 border-l-4 border-blue-500 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{ref.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{ref.description}</p>
                          <div className="mt-3 flex gap-2">
                            <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                            <Badge className={referralTypes.find(t => t.value === ref.referralType)?.color || 'bg-slate-100 text-slate-800'}>
                              {referralTypes.find(t => t.value === ref.referralType)?.label || ref.referralType}
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
                  <p className="text-slate-600">No completed referrals yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
