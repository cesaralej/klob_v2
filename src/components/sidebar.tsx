'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Megaphone,
  Upload,
  User,
  Settings,
  LogOut,
  ChevronUp,
} from 'lucide-react'

const mainNavItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Forecasting',
    href: '/forecasting',
    icon: TrendingUp,
  },
  {
    title: 'Marketing',
    href: '/marketing',
    icon: Megaphone,
  },
]

const dataNavItems = [
  {
    title: 'Upload Data',
    href: '/upload',
    icon: Upload,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight">
          KLOB
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>

      {/* User section */}
      <div className="border-t p-3">
        <UserAccount />
      </div>
    </aside>
  )
}

export function SidebarNav({ className, onItemClick }: { className?: string, onItemClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className={cn('flex-1 space-y-6 px-3 py-4', className)}>
      {/* Analytics Section */}
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Analytics
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 shrink-0',
                isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
              )} />
              {item.title}
            </Link>
          )
        })}
      </div>

      {/* Data Management Section */}
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Data
        </p>
        {dataNavItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn(
                'h-5 w-5 shrink-0',
                isActive ? 'text-sidebar-primary' : 'text-muted-foreground'
              )} />
              {item.title}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export function UserAccount() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <User className="h-4 w-4 text-sidebar-accent-foreground" />
          </div>
          <span className="flex-1 text-left">Account</span>
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive" className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

