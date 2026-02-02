import type { Influencer, SentimentData, AudienceData, AIInsight } from '@/types/marketing-types'

export const mockInfluencers: Influencer[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    handle: '@sarahstyle',
    avatar: '🎨',
    followers: 245000,
    engagementRate: 8.5,
    postsThisMonth: 12,
    totalReach: 980000,
    salesAttributed: 45230,
    costPerAcquisition: 12.5,
    roi: 362,
    revenueGenerated: 45230
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    handle: '@marcusfitlife',
    avatar: '💪',
    followers: 180000,
    engagementRate: 7.2,
    postsThisMonth: 15,
    totalReach: 750000,
    salesAttributed: 32100,
    costPerAcquisition: 15.3,
    roi: 287,
    revenueGenerated: 32100
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    handle: '@emmabeauty',
    avatar: '✨',
    followers: 320000,
    engagementRate: 9.1,
    postsThisMonth: 10,
    totalReach: 1200000,
    salesAttributed: 58900,
    costPerAcquisition: 10.2,
    roi: 425,
    revenueGenerated: 58900
  },
  {
    id: '4',
    name: 'Alex Kim',
    handle: '@alextech',
    avatar: '🚀',
    followers: 95000,
    engagementRate: 6.8,
    postsThisMonth: 8,
    totalReach: 340000,
    salesAttributed: 18500,
    costPerAcquisition: 18.7,
    roi: 198,
    revenueGenerated: 18500
  },
  {
    id: '5',
    name: 'Olivia Taylor',
    handle: '@oliviahome',
    avatar: '🏡',
    followers: 156000,
    engagementRate: 7.9,
    postsThisMonth: 11,
    totalReach: 620000,
    salesAttributed: 28700,
    costPerAcquisition: 13.9,
    roi: 265,
    revenueGenerated: 28700
  },
  {
    id: '6',
    name: 'David Park',
    handle: '@davidfoodie',
    avatar: '🍜',
    followers: 210000,
    engagementRate: 8.3,
    postsThisMonth: 14,
    totalReach: 890000,
    salesAttributed: 39200,
    costPerAcquisition: 11.8,
    roi: 334,
    revenueGenerated: 39200
  },
  {
    id: '7',
    name: 'Lisa Wang',
    handle: '@lisatravel',
    avatar: '✈️',
    followers: 128000,
    engagementRate: 6.5,
    postsThisMonth: 9,
    totalReach: 480000,
    salesAttributed: 21400,
    costPerAcquisition: 16.2,
    roi: 215,
    revenueGenerated: 21400
  },
  {
    id: '8',
    name: 'Ryan Martinez',
    handle: '@ryanoutdoors',
    avatar: '🏔️',
    followers: 189000,
    engagementRate: 7.6,
    postsThisMonth: 13,
    totalReach: 710000,
    salesAttributed: 34800,
    costPerAcquisition: 14.1,
    roi: 298,
    revenueGenerated: 34800
  }
]

export const mockSentimentData: SentimentData = {
  overallScore: 8.2,
  positive: 68,
  neutral: 24,
  negative: 8,
  topKeywords: ['amazing', 'quality', 'fast shipping', 'love it', 'highly recommend', 'worth it', 'excellent', 'perfect'],
  reviews: [
    {
      id: '1',
      text: 'Absolutely love this product! The quality exceeded my expectations.',
      sentiment: 'positive',
      score: 9.5,
      date: new Date('2024-01-28')
    },
    {
      id: '2',
      text: 'Fast shipping and great customer service.',
      sentiment: 'positive',
      score: 8.7,
      date: new Date('2024-01-27')
    },
    {
      id: '3',
      text: 'Product is okay, but shipping took longer than expected.',
      sentiment: 'neutral',
      score: 6.0,
      date: new Date('2024-01-26')
    },
    {
      id: '4',
      text: 'Not as described. Disappointed with the quality.',
      sentiment: 'negative',
      score: 3.2,
      date: new Date('2024-01-25')
    },
    {
      id: '5',
      text: 'Exactly what I needed! Will definitely buy again.',
      sentiment: 'positive',
      score: 9.0,
      date: new Date('2024-01-24')
    }
  ],
  trend: [
    { date: '2024-01-01', score: 7.8 },
    { date: '2024-01-05', score: 8.0 },
    { date: '2024-01-10', score: 8.3 },
    { date: '2024-01-15', score: 8.1 },
    { date: '2024-01-20', score: 8.4 },
    { date: '2024-01-25', score: 8.0 },
    { date: '2024-01-30', score: 8.2 }
  ]
}

export const mockAudienceData: AudienceData = {
  ageDistribution: [
    { range: '18-24', percentage: 22 },
    { range: '25-34', percentage: 38 },
    { range: '35-44', percentage: 25 },
    { range: '45-54', percentage: 11 },
    { range: '55+', percentage: 4 }
  ],
  genderSplit: [
    { gender: 'Female', percentage: 62 },
    { gender: 'Male', percentage: 35 },
    { gender: 'Other', percentage: 3 }
  ],
  topLocations: [
    { location: 'United States', percentage: 45 },
    { location: 'United Kingdom', percentage: 18 },
    { location: 'Canada', percentage: 12 },
    { location: 'Australia', percentage: 10 },
    { location: 'Germany', percentage: 8 },
    { location: 'Other', percentage: 7 }
  ],
  peakEngagementHours: [
    { hour: 0, engagement: 12 },
    { hour: 3, engagement: 8 },
    { hour: 6, engagement: 15 },
    { hour: 9, engagement: 45 },
    { hour: 12, engagement: 68 },
    { hour: 15, engagement: 82 },
    { hour: 18, engagement: 95 },
    { hour: 21, engagement: 88 }
  ]
}

export const mockAIInsights: AIInsight[] = [
  {
    category: 'Post Type',
    recommendation: 'Carousel posts generate 3.2x more engagement than static images',
    impact: 'high',
    data: { carousel: 3.2, reel: 2.8, static: 1.0, story: 1.5 }
  },
  {
    category: 'Best Time to Post',
    recommendation: 'Post between 6-8 PM for maximum engagement (95% higher than average)',
    impact: 'high'
  },
  {
    category: 'Caption Length',
    recommendation: 'Captions between 100-150 characters have 40% higher conversion rates',
    impact: 'medium'
  },
  {
    category: 'Hashtags',
    recommendation: 'Use 5-7 hashtags per post. Top performing: #sustainable, #qualitymatters, #bestseller',
    impact: 'medium'
  },
  {
    category: 'Content Theme',
    recommendation: 'User-generated content drives 2.5x more sales than brand content',
    impact: 'high'
  },
  {
    category: 'Call-to-Action',
    recommendation: 'Posts with "Link in bio" CTAs convert 60% better than generic CTAs',
    impact: 'medium'
  }
]
