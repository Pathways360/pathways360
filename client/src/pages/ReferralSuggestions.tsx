import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, MapPin, Star, TrendingUp } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ReferralSuggestionsProps {
  clientId: number;
  onSendReferral?: (providerId: string, providerName: string) => void;
}

export function ReferralSuggestions({ clientId, onSendReferral }: ReferralSuggestionsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'providers' | 'resources'>('all');
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  // Fetch all three types of suggestions
  const { data: allSuggestions, isLoading: isLoadingAll } = trpc.matching.getReferralSuggestions.useQuery(
    { clientId },
    { enabled: activeTab === 'all' }
  );

  const { data: providerMatches, isLoading: isLoadingProviders } = trpc.matching.getMatchedProviders.useQuery(
    { clientId },
    { enabled: activeTab === 'providers' }
  );

  const { data: resourceMatches, isLoading: isLoadingResources } = trpc.matching.getMatchedResources.useQuery(
    { clientId },
    { enabled: activeTab === 'resources' }
  );

  const isLoading = isLoadingAll || isLoadingProviders || isLoadingResources;

  const getMatches = () => {
    if (activeTab === 'all') return allSuggestions || [];
    if (activeTab === 'providers') return providerMatches || [];
    return resourceMatches || [];
  };

  const matches = getMatches();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const getTypeIcon = (type: string) => {
    if (type === 'provider') {
      return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
    return <MapPin className="w-4 h-4 text-green-600" />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'provider' ? 'Provider' : 'Resource';
  };

  const handleSendReferral = (match: any) => {
    if (match.type === 'provider' && onSendReferral) {
      onSendReferral(match.id, match.name);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Suggestions</CardTitle>
          <CardDescription>Finding best matches for this client...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referral Suggestions</CardTitle>
          <CardDescription>No matches found for this client</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No suitable providers or resources found based on client needs.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral Suggestions</CardTitle>
        <CardDescription>AI-powered recommendations based on client assessment</CardDescription>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('all')}
          >
            All ({(allSuggestions?.length || 0)})
          </Button>
          <Button
            variant={activeTab === 'providers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('providers')}
          >
            Providers ({(providerMatches?.length || 0)})
          </Button>
          <Button
            variant={activeTab === 'resources' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('resources')}
          >
            Resources ({(resourceMatches?.length || 0)})
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {matches.map((match: any) => (
            <div
              key={`${match.type}-${match.id}`}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMatch === `${match.type}-${match.id}`
                  ? 'bg-blue-50 border-blue-300'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
              onClick={() => setSelectedMatch(`${match.type}-${match.id}`)}
            >
              {/* Header with name and score */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {getTypeIcon(match.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{match.name}</h3>
                    <p className="text-sm text-gray-600">{getTypeLabel(match.type)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(match.score)}`}>
                    {match.score}%
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    {getScoreBadge(match.score)}
                  </Badge>
                </div>
              </div>

              {/* Match Reasons */}
              {match.explanation && (
                <div className="mb-3 p-3 bg-white border border-gray-200 rounded">
                  <p className="text-sm text-gray-700">{match.explanation}</p>
                </div>
              )}

              {/* Detailed Reasons */}
              {match.reasons && match.reasons.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Why this match:</p>
                  <ul className="space-y-1">
                    {match.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {match.availability === 'available' ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Currently accepting</span>
                    </>
                  ) : match.availability === 'waitlist' ? (
                    <>
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span>On waitlist</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span>Not available</span>
                    </>
                  )}
                </div>

                {match.type === 'provider' && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReferral(match);
                    }}
                  >
                    Send Referral
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Matching Algorithm Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <h4 className="font-semibold text-sm text-blue-900">How Matching Works</h4>
          </div>
          <p className="text-xs text-blue-800">
            Suggestions are scored based on specialty match, location, insurance acceptance, language, 
            availability, ROI status, provider ratings, and success rates. Scores above 40% are shown.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
