export interface Influencer {
  id: string
  name: string
  handle: string
  avatar: string
  followers: number
  engagementRate: number
  postsThisMonth: number
  totalReach: number
  salesAttributed: number
  costPerAcquisition: number
  roi: number
  revenueGenerated: number
}

export interface Post {
  id: string
  influencerId: string
  type: 'carousel' | 'story' | 'reel' | 'static'
  caption: string
  likes: number
  comments: number
  shares: number
  sales: number
  postedAt: Date
}

export interface SentimentData {
  overallScore: number
  positive: number
  neutral: number
  negative: number
  topKeywords: string[]
  reviews: Review[]
  trend: { date: string; score: number }[]
}

export interface Review {
  id: string
  text: string
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
  date: Date
}

export interface AudienceData {
  ageDistribution: { range: string; percentage: number }[]
  genderSplit: { gender: string; percentage: number }[]
  topLocations: { location: string; percentage: number }[]
  peakEngagementHours: { hour: number; engagement: number }[]
}

export interface AIInsight {
  category: string
  recommendation: string
  impact: 'high' | 'medium' | 'low'
  data?: Record<string, any>
}

export interface TrackingLink {
  id: string
  influencerId: string
  campaign: string
  url: string
  clicks: number
  conversions: number
  createdAt: Date
}
