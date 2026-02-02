'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { SentimentData } from '@/types/marketing-types'
import { Smile, Meh, Frown } from 'lucide-react'

interface SentimentAnalysisProps {
  data: SentimentData
}

export function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const sentimentColors = {
    positive: 'text-green-500',
    neutral: 'text-yellow-500',
    negative: 'text-red-500'
  }

  const sentimentIcons = {
    positive: Smile,
    neutral: Meh,
    negative: Frown
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Sentiment Analysis</CardTitle>
        <CardDescription>Based on {data.reviews.length * 100}+ reviews</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-background">
                <div className="text-center">
                  <p className="text-3xl font-bold">{data.overallScore}</p>
                  <p className="text-xs text-muted-foreground">/ 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${data.positive}%` }}
                />
              </div>
              <span className="text-sm font-bold text-green-500">{data.positive}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Meh className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-yellow-500 transition-all"
                  style={{ width: `${data.neutral}%` }}
                />
              </div>
              <span className="text-sm font-bold text-yellow-500">{data.neutral}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Frown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${data.negative}%` }}
                />
              </div>
              <span className="text-sm font-bold text-red-500">{data.negative}%</span>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Top Keywords</p>
          <div className="flex flex-wrap gap-2">
            {data.topKeywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Recent Reviews Sample */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Recent Reviews</p>
          <div className="space-y-2">
            {data.reviews.slice(0, 3).map((review) => {
              const Icon = sentimentIcons[review.sentiment]
              return (
                <div
                  key={review.id}
                  className="rounded-lg border bg-muted/50 p-3 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${sentimentColors[review.sentiment]}`} />
                    <p className="flex-1 text-muted-foreground">{review.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
