import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Influencer } from '@/types/marketing-types'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

interface InfluencerROICardProps {
  influencers: Influencer[]
}

export function InfluencerROICard({ influencers }: InfluencerROICardProps) {
  // Get top 3 influencers by ROI
  const topInfluencers = [...influencers]
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Top Performing Influencers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topInfluencers.map((influencer, index) => (
          <div
            key={influencer.id}
            className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-accent/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-2xl">
              {influencer.avatar}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{influencer.name}</p>
                  <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">{influencer.roi}%</p>
                  <p className="text-xs text-muted-foreground">ROI</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="rounded-md bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-semibold">
                    ${(influencer.revenueGenerated / 1000).toFixed(1)}k
                  </p>
                </div>
                <div className="rounded-md bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="text-sm font-semibold">{influencer.engagementRate}%</p>
                </div>
                <div className="rounded-md bg-muted p-2 text-center">
                  <p className="text-xs text-muted-foreground">CPA</p>
                  <p className="text-sm font-semibold">${influencer.costPerAcquisition}</p>
                </div>
              </div>
            </div>
            
            {index === 0 && (
              <div className="absolute -top-2 -right-2 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-bold text-yellow-950">
                #1
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
