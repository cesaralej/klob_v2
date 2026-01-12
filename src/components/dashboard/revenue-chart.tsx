'use client'

import { useState, useEffect } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton'

interface RevenueChartProps {
  data: { date: string; revenue: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>Loading chart...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
          <CardDescription>No data available for the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center border-t">
          <p className="text-muted-foreground">Upload sales data to see the chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
        <CardDescription>
          Showing {data.length} data points from uploaded sales data.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                type="category"
                stroke="var(--muted-foreground)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => {
                  if (!value) return '';
                  try {
                    // split to avoid timezone shifts with hyphens
                    const [year, month, day] = String(value).split('-').map(Number);
                    if (year && month && day) {
                        const date = new Date(year, month - 1, day);
                        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                    }
                    
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return String(value);
                    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  } catch {
                    return String(value);
                  }
                }}
                minTickGap={30}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: 'var(--muted-foreground)' }}
                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--primary)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
