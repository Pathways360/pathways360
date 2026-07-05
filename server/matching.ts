/**
 * Automated Referral Matching Algorithm
 * Scores and ranks providers/resources based on client needs
 */

export interface ClientProfile {
  id: string;
  specialties: string[];
  languages: string[];
  insurance: string;
  location: string;
  needs: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  roiStatus: 'valid' | 'pending' | 'expired';
}

export interface ProviderProfile {
  id: string;
  name: string;
  specialties: string[];
  languages: string[];
  acceptedInsurance: string[];
  location: string;
  availability: 'available' | 'waitlist' | 'unavailable';
  roiAccepted: boolean;
  rating: number;
  successRate: number;
}

export interface ResourceProfile {
  id: string;
  name: string;
  category: string;
  specialties: string[];
  location: string;
  availability: 'available' | 'waitlist' | 'unavailable';
  rating: number;
  matchScore?: number;
}

export interface MatchResult {
  id: string;
  name: string;
  type: 'provider' | 'resource';
  score: number;
  reasons: string[];
  availability: string;
  contact?: string;
}

/**
 * Calculate matching score between client and provider
 * Score range: 0-100
 */
export function calculateProviderMatch(
  client: ClientProfile,
  provider: ProviderProfile
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Specialty match (0-30 points)
  const specialtyMatches = client.needs.filter(need =>
    provider.specialties.some(spec =>
      spec.toLowerCase().includes(need.toLowerCase()) ||
      need.toLowerCase().includes(spec.toLowerCase())
    )
  );
  const specialtyScore = (specialtyMatches.length / Math.max(client.needs.length, 1)) * 30;
  score += specialtyScore;
  if (specialtyMatches.length > 0) {
    reasons.push(`Specializes in ${specialtyMatches.join(', ')}`);
  }

  // Location match (0-20 points)
  if (provider.location === client.location) {
    score += 20;
    reasons.push('Located in same county');
  } else {
    score += 10;
    reasons.push('Located in nearby area');
  }

  // Insurance acceptance (0-20 points)
  if (provider.acceptedInsurance.includes(client.insurance)) {
    score += 20;
    reasons.push(`Accepts ${client.insurance}`);
  } else if (provider.acceptedInsurance.includes('All')) {
    score += 15;
    reasons.push('Accepts all insurance types');
  }

  // Language match (0-10 points)
  const languageMatch = client.languages.some(lang =>
    provider.languages.includes(lang)
  );
  if (languageMatch) {
    score += 10;
    reasons.push('Speaks client language');
  }

  // Availability (0-10 points)
  if (provider.availability === 'available') {
    score += 10;
    reasons.push('Currently accepting new clients');
  } else if (provider.availability === 'waitlist') {
    score += 5;
    reasons.push('On waitlist');
  }

  // ROI acceptance (0-10 points)
  if (provider.roiAccepted && client.roiStatus === 'valid') {
    score += 10;
    reasons.push('ROI verified and accepted');
  }

  // Provider rating (0-10 points bonus)
  const ratingBonus = (provider.rating / 5) * 10;
  score += ratingBonus;
  if (provider.rating >= 4.5) {
    reasons.push(`Highly rated (${provider.rating}/5)`);
  }

  // Success rate bonus (0-5 points)
  if (provider.successRate >= 0.8) {
    score += 5;
    reasons.push(`High success rate (${(provider.successRate * 100).toFixed(0)}%)`);
  }

  // Risk level adjustment
  if (client.riskLevel === 'critical' && provider.specialties.includes('Crisis')) {
    score += 10;
    reasons.push('Specialized in crisis intervention');
  }

  return {
    score: Math.min(100, Math.round(score)),
    reasons,
  };
}

/**
 * Calculate matching score between client and resource
 */
export function calculateResourceMatch(
  client: ClientProfile,
  resource: ResourceProfile
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Category match (0-40 points)
  const categoryMatches = client.needs.filter(need =>
    resource.category.toLowerCase().includes(need.toLowerCase()) ||
    resource.specialties.some(spec =>
      spec.toLowerCase().includes(need.toLowerCase())
    )
  );
  const categoryScore = (categoryMatches.length / Math.max(client.needs.length, 1)) * 40;
  score += categoryScore;
  if (categoryMatches.length > 0) {
    reasons.push(`Provides ${resource.category}`);
  }

  // Location match (0-30 points)
  if (resource.location === client.location) {
    score += 30;
    reasons.push('Located in same county');
  } else {
    score += 15;
    reasons.push('Located in nearby area');
  }

  // Availability (0-15 points)
  if (resource.availability === 'available') {
    score += 15;
    reasons.push('Currently available');
  } else if (resource.availability === 'waitlist') {
    score += 8;
    reasons.push('On waitlist');
  }

  // Resource rating (0-10 points bonus)
  const ratingBonus = (resource.rating / 5) * 10;
  score += ratingBonus;
  if (resource.rating >= 4.5) {
    reasons.push(`Highly rated (${resource.rating}/5)`);
  }

  return {
    score: Math.min(100, Math.round(score)),
    reasons,
  };
}

/**
 * Get top matched providers for a client
 */
export function getTopProviderMatches(
  client: ClientProfile,
  providers: ProviderProfile[],
  limit: number = 5
): MatchResult[] {
  return providers
    .map(provider => {
      const { score, reasons } = calculateProviderMatch(client, provider);
      return {
        id: provider.id,
        name: provider.name,
        type: 'provider' as const,
        score,
        reasons,
        availability: provider.availability,
        contact: `Contact ${provider.name}`,
      };
    })
    .filter(match => match.score >= 40) // Minimum 40% match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get top matched resources for a client
 */
export function getTopResourceMatches(
  client: ClientProfile,
  resources: ResourceProfile[],
  limit: number = 5
): MatchResult[] {
  return resources
    .map(resource => {
      const { score, reasons } = calculateResourceMatch(client, resource);
      return {
        id: resource.id,
        name: resource.name,
        type: 'resource' as const,
        score,
        reasons,
        availability: resource.availability,
      };
    })
    .filter(match => match.score >= 40) // Minimum 40% match
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get combined provider and resource matches
 */
export function getReferralSuggestions(
  client: ClientProfile,
  providers: ProviderProfile[],
  resources: ResourceProfile[],
  limit: number = 10
): MatchResult[] {
  const providerMatches = getTopProviderMatches(client, providers, limit);
  const resourceMatches = getTopResourceMatches(client, resources, limit);

  // Combine and sort by score
  return [...providerMatches, ...resourceMatches]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Calculate match explanation for UI display
 */
export function getMatchExplanation(match: MatchResult): string {
  if (match.reasons.length === 0) {
    return 'Recommended match';
  }
  return match.reasons.slice(0, 3).join(' • ');
}
