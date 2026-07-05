import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { 
  Heart, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  Apple, 
  Utensils, 
  Pill, 
  MessageCircle,
  CheckCircle,
  Clock,
  Bell
} from 'lucide-react';

/**
 * Live Feed Dashboard Component
 * 
 * Features:
 * - Real-time feed of jobs, resources, services, events, meals, medical, counseling
 * - Mark items as read
 * - Record interactions (viewed, clicked, applied, accepted, declined)
 * - Filter by type
 * - Unread count badge
 * - Responsive design for mobile/desktop
 */

const feedTypeIcons: Record<string, React.ReactNode> = {
  job: <Briefcase className="w-5 h-5" />,
  resource: <MapPin className="w-5 h-5" />,
  service: <Users className="w-5 h-5" />,
  event: <Calendar className="w-5 h-5" />,
  support_group: <Users className="w-5 h-5" />,
  meal: <Utensils className="w-5 h-5" />,
  medical: <Pill className="w-5 h-5" />,
  counseling: <MessageCircle className="w-5 h-5" />,
  referral: <Bell className="w-5 h-5" />,
  milestone: <CheckCircle className="w-5 h-5" />,
};

const feedTypeColors: Record<string, string> = {
  job: 'bg-blue-50 border-blue-200',
  resource: 'bg-green-50 border-green-200',
  service: 'bg-purple-50 border-purple-200',
  event: 'bg-orange-50 border-orange-200',
  support_group: 'bg-pink-50 border-pink-200',
  meal: 'bg-yellow-50 border-yellow-200',
  medical: 'bg-red-50 border-red-200',
  counseling: 'bg-indigo-50 border-indigo-200',
  referral: 'bg-cyan-50 border-cyan-200',
  milestone: 'bg-green-50 border-green-200',
};

const feedTypeBadgeColors: Record<string, string> = {
  job: 'bg-blue-100 text-blue-800',
  resource: 'bg-green-100 text-green-800',
  service: 'bg-purple-100 text-purple-800',
  event: 'bg-orange-100 text-orange-800',
  support_group: 'bg-pink-100 text-pink-800',
  meal: 'bg-yellow-100 text-yellow-800',
  medical: 'bg-red-100 text-red-800',
  counseling: 'bg-indigo-100 text-indigo-800',
  referral: 'bg-cyan-100 text-cyan-800',
  milestone: 'bg-green-100 text-green-800',
};

export function LiveFeedDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>();

  // Fetch feed items
  const { data: feedItems, isLoading, refetch } = trpc.liveFeed.getFeedItems.useQuery({
    type: selectedFilter as any,
    limit: 100,
  });

  // Fetch unread count
  const { data: unreadCount } = trpc.liveFeed.getUnreadCount.useQuery();

  // Fetch feed stats
  const { data: feedStats } = trpc.liveFeed.getFeedStats.useQuery();

  // Mark as read mutation
  const markAsReadMutation = trpc.liveFeed.markAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  // Record interaction mutation
  const recordInteractionMutation = trpc.liveFeed.recordInteraction.useMutation({
    onSuccess: () => refetch(),
  });

  // Mark all as read
  const markAllAsReadMutation = trpc.liveFeed.markAllAsRead.useMutation({
    onSuccess: () => refetch(),
  });

  const feedTypes = [
    { value: 'job', label: 'Jobs' },
    { value: 'resource', label: 'Resources' },
    { value: 'service', label: 'Services' },
    { value: 'event', label: 'Events' },
    { value: 'support_group', label: 'Support Groups' },
    { value: 'meal', label: 'Meals' },
    { value: 'medical', label: 'Medical' },
    { value: 'counseling', label: 'Counseling' },
    { value: 'referral', label: 'Referrals' },
    { value: 'milestone', label: 'Milestones' },
  ];

  const handleMarkAsRead = (itemId: number) => {
    markAsReadMutation.mutate(itemId);
  };

  const handleRecordInteraction = (itemId: number, type: string) => {
    recordInteractionMutation.mutate({
      feedItemId: itemId,
      interactionType: type as any,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Live Feed</h1>
              <p className="text-lg text-slate-600">Daily updates on jobs, resources, services, and more</p>
            </div>
            {unreadCount !== undefined && unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-red-100 text-red-800 text-lg px-3 py-1">
                  {unreadCount} New
                </Badge>
                <Button
                  variant="outline"
                  onClick={() => markAllAsReadMutation.mutate()}
                  size="sm"
                >
                  Mark All Read
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {feedStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{feedStats.total}</div>
                  <div className="text-xs text-slate-600 mt-1">Total Items</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{feedStats.unread}</div>
                  <div className="text-xs text-slate-600 mt-1">Unread</div>
                </div>
              </CardContent>
            </Card>
            {feedStats.byType && Object.entries(feedStats.byType).slice(0, 3).map(([type, count]: any) => (
              <Card key={type} className="bg-white border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{count}</div>
                    <div className="text-xs text-slate-600 mt-1 capitalize">{type.replace('_', ' ')}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="unread">Unread Only</TabsTrigger>
            <TabsTrigger value="types">Filter by Type</TabsTrigger>
          </TabsList>

          {/* All Items Tab */}
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : feedItems && feedItems.length > 0 ? (
              <div className="space-y-4">
                {feedItems.map((item: any) => (
                  <Card
                    key={item.id}
                    className={`border-l-4 cursor-pointer transition-all hover:shadow-md ${
                      feedTypeColors[item.type] || 'bg-white border-slate-200'
                    } ${!item.isRead ? 'ring-2 ring-yellow-300' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 text-slate-600">
                          {feedTypeIcons[item.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900">{item.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                            </div>
                            <Badge className={feedTypeBadgeColors[item.type] || 'bg-slate-100 text-slate-800'}>
                              {feedTypes.find(t => t.value === item.type)?.label || item.type}
                            </Badge>
                          </div>

                          {item.content && (
                            <p className="text-sm text-slate-700 mt-3 mb-3 line-clamp-2">{item.content}</p>
                          )}

                          <div className="flex gap-2 flex-wrap">
                            {!item.isRead && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsRead(item.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRecordInteraction(item.id, 'viewed')}
                            >
                              View Details
                            </Button>
                            {item.type === 'job' && (
                              <Button
                                size="sm"
                                onClick={() => handleRecordInteraction(item.id, 'applied')}
                              >
                                Apply
                              </Button>
                            )}
                            {item.type === 'referral' && (
                              <Button
                                size="sm"
                                onClick={() => handleRecordInteraction(item.id, 'accepted')}
                              >
                                Accept
                              </Button>
                            )}
                          </div>

                          <div className="text-xs text-slate-500 mt-3">
                            {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
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
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No feed items yet. Check back soon!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Unread Tab */}
          <TabsContent value="unread" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : feedItems?.filter((item: any) => !item.isRead).length ? (
              <div className="space-y-4">
                {feedItems.filter((item: any) => !item.isRead).map((item: any) => (
                  <Card
                    key={item.id}
                    className={`border-l-4 cursor-pointer transition-all hover:shadow-md ring-2 ring-yellow-300 ${
                      feedTypeColors[item.type] || 'bg-white border-slate-200'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 text-slate-600">
                          {feedTypeIcons[item.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-900">{item.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                            </div>
                            <Badge className={feedTypeBadgeColors[item.type] || 'bg-slate-100 text-slate-800'}>
                              {feedTypes.find(t => t.value === item.type)?.label || item.type}
                            </Badge>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkAsRead(item.id)}
                            >
                              Mark as Read
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRecordInteraction(item.id, 'viewed')}
                            >
                              View Details
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
                  <p className="text-slate-600">All caught up! No unread items.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Filter Tab */}
          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {feedTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedFilter === type.value ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter(selectedFilter === type.value ? undefined : type.value)}
                  className="w-full"
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {selectedFilter && (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner />
                  </div>
                ) : feedItems && feedItems.length > 0 ? (
                  <div className="space-y-4">
                    {feedItems.map((item: any) => (
                      <Card
                        key={item.id}
                        className={`border-l-4 cursor-pointer transition-all hover:shadow-md ${
                          feedTypeColors[item.type] || 'bg-white border-slate-200'
                        } ${!item.isRead ? 'ring-2 ring-yellow-300' : ''}`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 text-slate-600">
                              {feedTypeIcons[item.type]}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">{item.title}</h3>
                              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                              <Button
                                size="sm"
                                className="mt-3"
                                onClick={() => handleRecordInteraction(item.id, 'clicked')}
                              >
                                Learn More
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
                      <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">No {feedTypes.find(t => t.value === selectedFilter)?.label.toLowerCase()} items.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
