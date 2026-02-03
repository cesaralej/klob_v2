
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface DashboardFiltersProps {
  seasons: string[]
  families: string[]
  stores: string[]
}

export function DashboardFilters({ seasons, families, stores }: DashboardFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (key: string, value: string | null) => {
    router.push(`?${createQueryString(key, value)}`, { scroll: false })
  }

  // Current values
  const currentSeason = searchParams.get('season')
  const currentFamily = searchParams.get('family')
  const currentStore = searchParams.get('store')
  const dateFrom = searchParams.get('from')
  const dateTo = searchParams.get('to')

  return (
    <div className="grid grid-cols-1 gap-4 bg-card p-4 rounded-lg border shadow-sm sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
      {/* Season Filter */}
      <div className="flex flex-col space-y-1.5 lg:w-[180px]">
        <label className="text-xs font-semibold text-muted-foreground">Season</label>
        <Select 
          value={currentSeason || 'all'} 
          onValueChange={(val) => handleFilterChange('season', val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Seasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seasons</SelectItem>
            {seasons.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Family Filter */}
      <div className="flex flex-col space-y-1.5 lg:w-[180px]">
        <label className="text-xs font-semibold text-muted-foreground">Family</label>
        <Select 
          value={currentFamily || 'all'} 
          onValueChange={(val) => handleFilterChange('family', val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Families" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Families</SelectItem>
            {families.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

       {/* Store Filter */}
       <div className="flex flex-col space-y-1.5 lg:w-[180px]">
        <label className="text-xs font-semibold text-muted-foreground">Store</label>
        <Select 
          value={currentStore || 'all'} 
          onValueChange={(val) => handleFilterChange('store', val === 'all' ? null : val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {stores.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col space-y-1.5 sm:col-span-2 lg:col-span-1 lg:flex-1">
          <label className="text-xs font-semibold text-muted-foreground">Date Range</label>
          <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full lg:w-[240px] justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? (
                        dateTo ? (
                            <>
                            {format(new Date(dateFrom), "LLL dd, y")} -{" "}
                            {format(new Date(dateTo), "LLL dd, y")}
                            </>
                        ) : (
                            format(new Date(dateFrom), "LLL dd, y")
                        )
                    ) : (
                    <span>Pick a date range</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                 <div className="p-4">
                     <p className="text-xs text-muted-foreground mb-2">Select Start & End</p>
                     <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <input 
                            type="date" 
                            className="border rounded px-2 py-1 text-sm w-full"
                            value={dateFrom || ''} 
                            onChange={(e) => handleFilterChange('from', e.target.value)}
                        />
                        <span className="hidden sm:inline">-</span>
                        <input 
                            type="date" 
                            className="border rounded px-2 py-1 text-sm w-full"
                            value={dateTo || ''} 
                            onChange={(e) => handleFilterChange('to', e.target.value)}
                        />
                     </div>
                 </div>
                </PopoverContent>
            </Popover>
             {(dateFrom || dateTo || currentSeason || currentFamily || currentStore) && (
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => router.push('/analytics')}
                    title="Clear Filters"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
          </div>
      </div>
    </div>
  )
}
