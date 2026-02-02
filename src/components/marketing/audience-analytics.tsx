'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AudienceData } from '@/types/marketing-types'
import { Users, Globe, Clock } from 'lucide-react'

interface AudienceAnalyticsProps {
  data: AudienceData
}

export function AudienceAnalytics({ data }: AudienceAnalyticsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Audience Analytics
        </CardTitle>
        <CardDescription>Demographics and engagement patterns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Age Distribution */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">Age Distribution</p>
          {data.ageDistribution.map((age) => (
            <div key={age.range} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{age.range}</span>
                <span className="font-semibold">{age.percentage}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                  style={{ width: `${age.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Gender Split */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">Gender Distribution</p>
          <div className="grid grid-cols-3 gap-2">
            {data.genderSplit.map((gender) => (
              <div
                key={gender.gender}
                className="rounded-lg border bg-muted/50 p-3 text-center"
              >
                <p className="text-2xl font-bold text-primary">{gender.percentage}%</p>
                <p className="text-xs text-muted-foreground">{gender.gender}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="space-y-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Top Locations
          </p>
          {data.topLocations.map((location, index) => (
            <div key={location.location} className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{location.location}</span>
                  <span className="font-semibold">{location.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Peak Engagement Hours */}
        <div className="space-y-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Peak Engagement Hours
          </p>
          <div className="flex items-end justify-between gap-1">
            {data.peakEngagementHours.map((hour) => (
              <div key={hour.hour} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-purple-500 to-blue-500"
                  style={{
                    height: `${(hour.engagement / 100) * 60}px`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {hour.hour}:00
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Best time to post: 6-8 PM
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
