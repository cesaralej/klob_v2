import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Influencer } from '@/types/marketing-types'
import { ArrowUpDown } from 'lucide-react'

interface InfluencerPerformanceGridProps {
  influencers: Influencer[]
}

export function InfluencerPerformanceGrid({ influencers }: InfluencerPerformanceGridProps) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Influencer Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Influencer</TableHead>
                <TableHead className="text-right">
                  <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                    Posts <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                    Reach <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                    Engagement <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                    Sales <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors">
                    ROI <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {influencers.map((influencer) => (
                <TableRow key={influencer.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xl">
                        {influencer.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{influencer.name}</p>
                        <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {influencer.postsThisMonth}
                  </TableCell>
                  <TableCell className="text-right">
                    {(influencer.totalReach / 1000).toFixed(0)}k
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="rounded-full bg-green-500/10 px-2 py-1 text-sm font-medium text-green-500">
                      {influencer.engagementRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${influencer.salesAttributed.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`text-lg font-bold ${
                      influencer.roi >= 300 ? 'text-green-500' :
                      influencer.roi >= 200 ? 'text-yellow-500' :
                      'text-orange-500'
                    }`}>
                      {influencer.roi}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
