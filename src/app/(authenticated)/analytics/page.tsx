

import { 
  getFilterOptions, 
  getOverviewData, 
  getGeographicData,
  getProductData,
  getPhotoData,
  DashboardFilters 
} from '@/lib/dashboard-data'
import { DashboardFilters as DashboardFiltersComponent } from '@/components/dashboard/dashboard-filters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OverviewTab } from '@/components/dashboard/tabs/overview-tab'
import { GeographicTab } from '@/components/dashboard/tabs/geographic-tab'
import { ProductTab } from '@/components/dashboard/tabs/product-tab'
import { PhotoTab } from '@/components/dashboard/tabs/photo-tab'

interface AnalyticsPageProps {
  searchParams: Promise<DashboardFilters>
}

export default async function AnalyticsPage(props: AnalyticsPageProps) {
  const searchParams = await props.searchParams
  
  // Parallel Data Fetching
  const [
    { seasons, families, stores },
    overviewData,
    geographicData,
    productData,
    photoData
  ] = await Promise.all([
    getFilterOptions(),
    getOverviewData(searchParams),
    getGeographicData(searchParams),
    getProductData(searchParams),
    getPhotoData(searchParams)
  ])

  return (
    <main className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      </div>
      
      {/* Global Filters */}
      <DashboardFiltersComponent 
        seasons={seasons} 
        families={families} 
        stores={stores} 
      />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="product">Product & Profitability</TabsTrigger>
          <TabsTrigger value="photo">Photo Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab data={overviewData} />
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
            <GeographicTab data={geographicData} />
        </TabsContent>

        <TabsContent value="product" className="space-y-4">
            <ProductTab data={productData} />
        </TabsContent>

        <TabsContent value="photo" className="space-y-4">
           <PhotoTab data={photoData} />
        </TabsContent>
      </Tabs>
    </main>
  )
}


