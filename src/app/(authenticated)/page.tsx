import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { DollarSign, Package, BarChart3, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

async function getDashboardData() {
  const supabase = await createClient()
  
  // Fetch sales data
  const { data: sales, error } = await supabase
    .from('sales')
    .select('sale_date, net_revenue, quantity, sku')
    .order('sale_date', { ascending: true })

  if (error) {
    console.error('Error fetching sales data:', error)
    return null
  }

  // DEBUG: Log the first few rows to verify date format
  if (sales && sales.length > 0) {
      console.log('DEBUG: First 3 sales rows from DB:', JSON.stringify(sales.slice(0, 3), null, 2))
  }

  if (!sales || sales.length === 0) {
    return null
  }

  // Aggregate metrics
  const totalRevenue = sales.reduce((sum, s) => sum + Number(s.net_revenue), 0)
  const totalUnits = sales.reduce((sum, s) => sum + s.quantity, 0)
  const uniqueSkus = new Set(sales.map(s => s.sku)).size
  const avgOrderValue = totalRevenue / sales.length

  // Aggregate chart data
  const chartDataMap = sales.reduce((acc: Record<string, number>, sale) => {
    let dateStr = 'Unknown'
    if (sale.sale_date) {
      try {
        const d = new Date(sale.sale_date)
        if (!isNaN(d.getTime())) {
          // Use YYYY-MM-DD format for consistency
          dateStr = d.toISOString().split('T')[0]
        }
      } catch {
        dateStr = 'Unknown'
      }
    }
    acc[dateStr] = (acc[dateStr] || 0) + Number(sale.net_revenue || 0)
    return acc
  }, {})

  const chartData = Object.entries(chartDataMap)
    .map(([date, revenue]) => ({
      date,
      revenue: Number(revenue)
    }))
    .filter(item => item.date !== 'Unknown')
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })

  return {
    totalRevenue,
    totalUnits,
    uniqueSkus,
    avgOrderValue,
    chartData
  }
}

export default async function Home() {
  const data = await getDashboardData()

  return (
      <main className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
             <Link href="/upload" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Upload New Data
            </Link>
          </div>
        </div>

        {!data ? (
          <div className="flex h-[450px] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-background p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="rounded-full bg-muted p-4 mb-4">
              <BarChart3 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No data available</h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-xs">
              Upload your sales data to see insights and trends for your business.
            </p>
            <Link href="/upload" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <KPICard 
                title="Total Revenue" 
                value={`$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                description="+20.1% from last month" // Placeholder trend
              />
              <KPICard 
                title="Units Sold" 
                value={data.totalUnits.toLocaleString()} 
                icon={<Package className="h-4 w-4 text-muted-foreground" />}
                description="+180.1% from last month"
              />
              <KPICard 
                title="Active SKUs" 
                value={data.uniqueSkus.toLocaleString()} 
                icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                description="Unique products sold"
              />
              <KPICard 
                title="Avg. Order Value" 
                value={`$${data.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                description="Across all transactions"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4 transition-all hover:shadow-md">
                <RevenueChart data={data.chartData} />
              </div>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Upcoming Features</CardTitle>
                  <CardDescription>
                    What we're working on next.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SkeletonItem title="Top Performing Products" />
                  <SkeletonItem title="Inventory Forecast" />
                  <SkeletonItem title="Channel Distribution" />
                  <SkeletonItem title="Customer Retention" />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
  )
}

function KPICard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function SkeletonItem({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Soon</div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
