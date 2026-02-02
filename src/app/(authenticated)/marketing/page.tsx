import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InfluencerROICard } from '@/components/marketing/influencer-roi-card'
import { InfluencerPerformanceGrid } from '@/components/marketing/influencer-performance-grid'
import { SentimentAnalysis } from '@/components/marketing/sentiment-analysis'
import { AudienceAnalytics } from '@/components/marketing/audience-analytics'
import { LinkGenerator } from '@/components/marketing/link-generator'
import { AIPostAnalyzer } from '@/components/marketing/ai-post-analyzer'
import {
  mockInfluencers,
  mockSentimentData,
  mockAudienceData,
  mockAIInsights
} from '@/lib/mock-marketing-data'
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react'

export default function MarketingPage() {
  // Calculate aggregate KPIs
  const totalROI = mockInfluencers.reduce((sum, inf) => sum + inf.revenueGenerated, 0)
  const activeInfluencers = mockInfluencers.length
  const totalReach = mockInfluencers.reduce((sum, inf) => sum + inf.totalReach, 0)
  const avgConversionRate = 3.2 // Mock conversion rate

  return (
    <main className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Digital Marketing</h2>
          <p className="text-muted-foreground mt-1">
            Influencer performance, audience insights, and AI-powered recommendations
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalROI / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">+18.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeInfluencers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">+2</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(totalReach / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This month's campaign reach
            </p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 font-semibold">+0.8%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <InfluencerROICard influencers={mockInfluencers} />
          <SentimentAnalysis data={mockSentimentData} />
          <LinkGenerator influencers={mockInfluencers} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AudienceAnalytics data={mockAudienceData} />
          <AIPostAnalyzer insights={mockAIInsights} />
        </div>
      </div>

      {/* Full Width Performance Grid */}
      <InfluencerPerformanceGrid influencers={mockInfluencers} />
    </main>
  )
}
