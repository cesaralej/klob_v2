
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface GeographicTabProps {
  data: {
    storePerformance: {
      store: string
      revenue: number
      margin: number
      marginPercent: number
      units: number
    }[]
  }
}

export function GeographicTab({ data }: GeographicTabProps) {
  const { storePerformance } = data

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Performance by Store</CardTitle>
          <CardDescription>Detailed metrics per location</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                    <TableHead className="text-right">Margin ($)</TableHead>
                    <TableHead className="text-right">Margin (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storePerformance.map((store) => (
                    <TableRow key={store.store}>
                      <TableCell className="font-medium">{store.store}</TableCell>
                      <TableCell className="text-right">${store.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">{store.units.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${store.margin.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">{store.marginPercent.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  {storePerformance.length === 0 && (
                      <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">No data available</TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
