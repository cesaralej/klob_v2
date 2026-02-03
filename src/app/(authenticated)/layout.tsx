import { Sidebar } from '@/components/sidebar'
import { MobileHeader } from '@/components/mobile-header'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/40">
      <Sidebar />
      <MobileHeader />
      <div className="lg:ml-60">
        {children}
      </div>
    </div>
  )
}
