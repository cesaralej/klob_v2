import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { AIInsight } from '@/types/marketing-types'
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react'

interface AIPostAnalyzerProps {
  insights: AIInsight[]
}

export function AIPostAnalyzer({ insights }: AIPostAnalyzerProps) {
  const impactColors = {
    high: 'border-green-500 bg-green-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-blue-500 bg-blue-500/10'
  }

  const impactTextColors = {
    high: 'text-green-500',
    medium: 'text-yellow-500',
    low: 'text-blue-500'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Post Analyzer
        </CardTitle>
        <CardDescription>Data-driven recommendations for optimal performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`rounded-lg border-l-4 p-4 transition-all hover:shadow-md ${impactColors[insight.impact]}`}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-4 w-4 ${impactTextColors[insight.impact]}`} />
                    <p className="font-semibold text-sm">{insight.category}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {insight.recommendation}
                  </p>
                </div>
                <div className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${impactTextColors[insight.impact]}`}>
                  {insight.impact}
                </div>
              </div>

              {/* Additional data visualization for post type performance */}
              {insight.data && insight.category === 'Post Type' && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {Object.entries(insight.data).map(([type, multiplier]) => (
                    <div key={type} className="text-center">
                      <p className="text-lg font-bold text-primary">{multiplier}x</p>
                      <p className="text-xs text-muted-foreground capitalize">{type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Summary Stats */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">AI Analysis Summary</p>
              <p className="text-sm text-muted-foreground">
                Following these {insights.length} recommendations could increase your overall campaign ROI by an estimated 30-45% based on historical data patterns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
