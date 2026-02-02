
import { createClient } from '@/lib/supabase/server'

export async function getFilterOptions() {
  const supabase = await createClient()

  // Parallel fetching of distinct values
  const [seasonsResult, familiesResult, storesResult] = await Promise.all([
    supabase.from('products').select('temporada').not('temporada', 'is', null),
    supabase.from('products').select('familia').not('familia', 'is', null),
    supabase.from('sales').select('tienda').not('tienda', 'is', null) // Stores from sales to ensure relevance
  ])

  // Extract unique values and sort
  const seasons = Array.from(new Set(seasonsResult.data?.map(d => d.temporada) || [])).sort()
  const families = Array.from(new Set(familiesResult.data?.map(d => d.familia) || [])).sort()
  const stores = Array.from(new Set(storesResult.data?.map(d => d.tienda) || [])).sort()

  return {
    seasons,
    families,
    stores
  }
}

export interface DashboardFilters {
  season?: string
  family?: string
  store?: string
  dateFrom?: string
  dateTo?: string
}

export async function getOverviewData(filters: DashboardFilters) {
  const supabase = await createClient()

  let query = supabase.from('sales').select(`
    subtotal,
    cantidad,
    precio_coste,
    fecha_venta,
    tienda,
    codigo_unico
  `)

  // Apply Filters
  if (filters.season && filters.season !== 'all') {
    query = query.eq('temporada', filters.season)
  }
  if (filters.family && filters.family !== 'all') {
    query = query.eq('familia', filters.family)
  }
  if (filters.store && filters.store !== 'all') {
    query = query.eq('tienda', filters.store)
  }
  if (filters.dateFrom) {
    query = query.gte('fecha_venta', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('fecha_venta', filters.dateTo)
  }

  const { data: sales, error } = await query

  if (error) {
    console.error('Error fetching overview data:', error)
    return {
      kpis: { netSales: 0, margin: 0, returns: 0, avgTicket: 0 },
      chartData: [],
      storePerformance: []
    }
  }

  if (!sales || sales.length === 0) {
     return {
      kpis: { netSales: 0, margin: 0, returns: 0, avgTicket: 0 },
      chartData: [],
      storePerformance: []
    }
  }

  // Calculate Metrics
  const totalRevenue = sales.reduce((sum, s) => sum + (Number(s.subtotal) || 0), 0)
  const totalCost = sales.reduce((sum, s) => sum + ((Number(s.precio_coste) || 0) * (Number(s.cantidad) || 0)), 0)
  const totalMargin = totalRevenue - totalCost
  const marginPercentage = totalRevenue ? (totalMargin / totalRevenue) * 100 : 0

  // Returns: Assuming negative Quantity represents return
  const returns = sales.filter(s => (s.cantidad || 0) < 0)
  const totalReturnsValue = returns.reduce((sum, s) => sum + (Number(s.subtotal) || 0), 0)
  // KPI typically shows return % relative to gross sales (positive sales + abs(returns)) or just net sales?
  // Let's assume % of Gross Sales value.
  const positiveSales = sales.filter(s => (s.cantidad || 0) > 0)
  const grossSalesValue = positiveSales.reduce((sum, s) => sum + (Number(s.subtotal) || 0), 0)
  const returnsPercentage = grossSalesValue ? (Math.abs(totalReturnsValue) / grossSalesValue) * 100 : 0

  // Avg Ticket: Revenue / Count of transactions (approximated by row count if no transaction ID, but let's assume each row is line item. 
  // We don't have transaction ID. We can approximate by grouping common fields or just use total/count.
  // Using Total Revenue / Total Units as proxy if no order ID, OR just Total Revenue / Row Count.
  // BETTER: Total Revenue / Total Rows (average line item value) -- User might want Avg Order Value but we lack Order ID.
  // Let's use Average Line Item Value for now or ask user. 
  // Wait, previous dashboard used "Avg Order Value = totalRevenue / sales.length". sticking to that for continuity.
  const avgTicket = sales.length ? totalRevenue / sales.length : 0

  // Chart Data (Daily)
  const chartDataMap = sales.reduce((acc: Record<string, number>, sale) => {
     const date = sale.fecha_venta || 'Unknown'
     acc[date] = (acc[date] || 0) + (Number(sale.subtotal) || 0)
     return acc
  }, {})
  
  const chartData = Object.entries(chartDataMap)
    .map(([date, revenue]) => ({ date, revenue: Number(revenue) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Store Performance
  const storeMap = sales.reduce((acc: Record<string, number>, sale) => {
    const store = sale.tienda || 'Unknown'
    acc[store] = (acc[store] || 0) + (Number(sale.subtotal) || 0)
    return acc
  }, {})

  const storePerformance = Object.entries(storeMap)
    .map(([store, revenue]) => ({ store, revenue: Number(revenue) }))
    .sort((a, b) => b.revenue - a.revenue) // Descending
    .slice(0, 10) // Top 10

  return {
    kpis: {
      netSales: totalRevenue,
      margin: marginPercentage,
      returns: returnsPercentage,
      avgTicket: avgTicket
    },
    chartData,
    storePerformance
  }
}

export async function getGeographicData(filters: DashboardFilters) {
  const supabase = await createClient()

  let query = supabase.from('sales').select('subtotal, cantidad, precio_coste, tienda')

  if (filters.season && filters.season !== 'all') query = query.eq('temporada', filters.season)
  if (filters.family && filters.family !== 'all') query = query.eq('familia', filters.family)
  if (filters.store && filters.store !== 'all') query = query.eq('tienda', filters.store)
  if (filters.dateFrom) query = query.gte('fecha_venta', filters.dateFrom)
  if (filters.dateTo) query = query.lte('fecha_venta', filters.dateTo)

  const { data: sales, error } = await query

  if (error || !sales) return { storePerformance: [] }

  const storeMap = sales.reduce((acc: Record<string, { revenue: number, cost: number, units: number }>, sale) => {
    const store = sale.tienda || 'Unknown'
    if (!acc[store]) acc[store] = { revenue: 0, cost: 0, units: 0 }
    
    acc[store].revenue += Number(sale.subtotal) || 0
    acc[store].cost += (Number(sale.precio_coste) || 0) * (Number(sale.cantidad) || 0)
    acc[store].units += Number(sale.cantidad) || 0
    return acc
  }, {})

  const storePerformance = Object.entries(storeMap)
    .map(([store, metrics]) => {
        const margin = metrics.revenue - metrics.cost
        const marginPercent = metrics.revenue ? (margin / metrics.revenue) * 100 : 0
        return {
            store,
            revenue: metrics.revenue,
            margin: margin,
            marginPercent: marginPercent,
            units: metrics.units
        }
    })
    .sort((a, b) => b.revenue - a.revenue)

  return { storePerformance }
}

export async function getProductData(filters: DashboardFilters) {
  const supabase = await createClient()

  let query = supabase.from('sales').select('subtotal, cantidad, precio_coste, familia, codigo_unico')

  if (filters.season && filters.season !== 'all') query = query.eq('temporada', filters.season)
  if (filters.family && filters.family !== 'all') query = query.eq('familia', filters.family)
  if (filters.store && filters.store !== 'all') query = query.eq('tienda', filters.store)
  if (filters.dateFrom) query = query.gte('fecha_venta', filters.dateFrom)
  if (filters.dateTo) query = query.lte('fecha_venta', filters.dateTo)

  const { data: sales, error } = await query

  if (error || !sales) return { familyPerformance: [], productPerformance: [] }

  const familyMap = sales.reduce((acc: Record<string, { revenue: number, cost: number, returns: number }>, sale) => {
    const family = sale.familia || 'Unknown'
    if (!acc[family]) acc[family] = { revenue: 0, cost: 0, returns: 0 }
    
    acc[family].revenue += Number(sale.subtotal) || 0
    acc[family].cost += (Number(sale.precio_coste) || 0) * (Number(sale.cantidad) || 0)
    if ((sale.cantidad || 0) < 0) {
        acc[family].returns += Math.abs(Number(sale.subtotal) || 0)
    }
    return acc
  }, {})

   const familyPerformance = Object.entries(familyMap)
    .map(([family, metrics]) => {
        const margin = metrics.revenue - metrics.cost
        const marginPercent = metrics.revenue ? (margin / metrics.revenue) * 100 : 0
        return {
            family,
            revenue: metrics.revenue,
            marginPercent: marginPercent,
            returns: metrics.returns
        }
    })
    .sort((a, b) => b.revenue - a.revenue)

    const skuMap = sales.reduce((acc: Record<string, { revenue: number, units: number }>, sale) => {
        const sku = sale.codigo_unico || 'Unknown'
         if (!acc[sku]) acc[sku] = { revenue: 0, units: 0 }
         acc[sku].revenue += Number(sale.subtotal) || 0
         acc[sku].units += Number(sale.cantidad) || 0
         return acc
    }, {})

    const productPerformance = Object.entries(skuMap)
        .map(([sku, metrics]) => ({ sku, ...metrics }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 50)

  return { familyPerformance, productPerformance }
}

export async function getPhotoData(filters: DashboardFilters) {
  const supabase = await createClient()

  let query = supabase.from('sales').select('subtotal, cantidad, codigo_unico')
  
  if (filters.season && filters.season !== 'all') query = query.eq('temporada', filters.season)
  if (filters.family && filters.family !== 'all') query = query.eq('familia', filters.family)
  if (filters.store && filters.store !== 'all') query = query.eq('tienda', filters.store)
  if (filters.dateFrom) query = query.gte('fecha_venta', filters.dateFrom)
  if (filters.dateTo) query = query.lte('fecha_venta', filters.dateTo)

  const { data: sales, error } = await query

  if (error || !sales) return { topProducts: [], bottomProducts: [] }

  const skuMap = sales.reduce((acc: Record<string, { revenue: number, units: number }>, sale) => {
    const sku = sale.codigo_unico || 'Unknown'
     if (!acc[sku]) acc[sku] = { revenue: 0, units: 0 }
     acc[sku].revenue += Number(sale.subtotal) || 0
     acc[sku].units += Number(sale.cantidad) || 0
     return acc
    }, {})

    const sortedProducts = Object.entries(skuMap)
        .map(([sku, metrics]) => ({ sku, ...metrics }))
        .sort((a, b) => b.revenue - a.revenue)

    const topProducts = sortedProducts.slice(0, 20)
    const bottomProducts = [...sortedProducts].reverse().slice(0, 20)

  return { topProducts, bottomProducts }
}

