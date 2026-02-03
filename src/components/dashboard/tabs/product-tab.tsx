
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProductTabProps {
  data: {
    familyPerformance: {
      family: string
      revenue: number
      marginPercent: number
      returns: number
    }[]
    productPerformance: {
      sku: string
      revenue: number
      units: number
    }[]
  }
}

export function ProductTab({ data }: ProductTabProps) {
  const { familyPerformance, productPerformance } = data

  return (
    <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                <CardTitle>Margin by Family</CardTitle>
                <CardDescription>Profitability percentage per category</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={familyPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
                            <XAxis type="number" unit="%" />
                            <YAxis dataKey="family" type="category" width={100} tick={{fontSize: 12}} interval={0} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                formatter={(value: any) => [`${Number(value).toFixed(1)}%`, "Margin"]}
                            />
                            <Bar dataKey="marginPercent" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Returns Value by Family</CardTitle>
                <CardDescription>Total return value per category</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={familyPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--muted-foreground)" opacity={0.1} />
                            <XAxis type="number" />
                            <YAxis dataKey="family" type="category" width={100} tick={{fontSize: 12}} interval={0} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Returns Value"]}
                            />
                            <Bar dataKey="returns" fill="var(--destructive)" radius={[0, 4, 4, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
         <Card>
            <CardHeader>
            <CardTitle>Top Products by Revenue</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="rounded-md border h-[400px] overflow-auto">
                 <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productPerformance.map((product) => (
                        <TableRow key={product.sku}>
                          <TableCell className="font-medium">{product.sku}</TableCell>
                          <TableCell className="text-right">${product.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{product.units}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>
               </div>
            </CardContent>
        </Card>
    </div>
  )
}
