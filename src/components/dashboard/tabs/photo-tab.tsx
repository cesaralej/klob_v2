
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getProductImageUrl } from '@/lib/constants'

interface PhotoTabProps {
  data: {
    topProducts: {
      sku: string
      revenue: number
      units: number
    }[]
    bottomProducts: {
        sku: string
        revenue: number
        units: number
    }[]
  }
}

function ProductGrid({ products, title }: { products: any[], title: string }) {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
                    <div key={product.sku} className="border rounded-md overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-muted flex items-center justify-center text-muted-foreground relative group">
                            {/* In a real app, use Next.js Image with a fallback */}
                            <img 
                                src={getProductImageUrl(product.sku)} 
                                alt={product.sku}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'; 
                                    e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                    e.currentTarget.parentElement!.innerText = 'No Image';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-2 text-center text-xs">
                                {product.sku}
                            </div>
                        </div>
                        <div className="p-3">
                            <h4 className="font-semibold text-sm truncate" title={product.sku}>{product.sku}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-muted-foreground">Units: {product.units}</p>
                                <p className="text-sm font-bold text-primary">${product.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="col-span-full py-8 text-center text-muted-foreground">
                        No products found based on current filters.
                    </div>
                )}
            </div>
        </div>
    )
}

export function PhotoTab({ data }: PhotoTabProps) {
  const { topProducts, bottomProducts } = data

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Visual Product Analysis</CardTitle>
          <CardDescription>Visual performance grid of best and worst selling products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
             <ProductGrid products={topProducts} title="Top 20 Best Sellers" />
             <div className="border-t pt-8">
                <ProductGrid products={bottomProducts} title="Bottom 20 Sellers" />
             </div>
        </CardContent>
      </Card>
    </div>
  )
}
