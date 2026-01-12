import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight">KLOB</Link>
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="text-primary transition-colors hover:text-primary/80">Overview</Link>
          <Link href="/upload" className="text-muted-foreground transition-colors hover:text-primary">Upload</Link>
        </nav>
      </div>
      <LogoutButton />
    </header>
  )
}
