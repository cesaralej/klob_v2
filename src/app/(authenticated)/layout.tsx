import { Sidebar } from '@/components/sidebar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/40">
      <Sidebar />
      <div className="ml-60">
        {children}
      </div>
    </div>
  )
}
