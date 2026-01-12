import { Header } from '@/components/header'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/40">
      <Header />
      {children}
    </div>
  )
}
