
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts"

interface OverviewTabProps {
  data: {
    kpis: {
      netSales: number
      margin: number
      returns: number
      avgTicket: number
    }
    chartData: { date: string; revenue: number }[]
    storePerformance: { store: string; revenue: number }[]
  }
}

export function OverviewTab({ data }: OverviewTabProps) {
  const { kpis, chartData, storePerformance } = data

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI Cards */}
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ${kpis.netSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Margin</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">
                    {kpis.margin.toFixed(1)}%
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Returns (est)</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">
                    {kpis.returns.toFixed(1)}%
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Ticket</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="text-2xl font-bold">
                    ${kpis.avgTicket.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily sales performance</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
                    <XAxis 
                        dataKey="date" 
                        stroke="var(--muted-foreground)"
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(val) => {
                             const date = new Date(val);
                             if (isNaN(date.getTime())) return val;
                             return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        }}
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
                        formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                         labelFormatter={(val) => {
                             const date = new Date(val);
                             if (isNaN(date.getTime())) return val;
                             return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        dot={false}
                    />
                </LineChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Stores</CardTitle>
            <CardDescription>Top 10 performing locations</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={storePerformance} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="store" 
                            type="category" 
                            width={100} 
                            tick={{fontSize: 12}}
                            interval={0}
                        />
                         <Tooltip 
                             cursor={{fill: 'transparent'}}
                             contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                             formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                         />
                        <Bar 
                            dataKey="revenue" 
                            fill="var(--primary)" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20}
                        />
                     </BarChart>
                </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
