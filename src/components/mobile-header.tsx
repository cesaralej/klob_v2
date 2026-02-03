'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { SidebarNav, UserAccount } from '@/components/sidebar'
import { useState } from 'react'

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b text-left">
            <SheetTitle className="text-xl font-bold">KLOB</SheetTitle>
            <SheetDescription className="sr-only">Main Navigation Menu</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav onItemClick={() => setOpen(false)} />
          </div>
          <div className="border-t p-3">
            <UserAccount />
          </div>
        </SheetContent>
      </Sheet>
      <Link href="/dashboard" className="text-lg font-bold">
        KLOB
      </Link>
    </header>
  )
}
