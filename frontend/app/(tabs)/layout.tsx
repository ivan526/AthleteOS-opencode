'use client'

import { TabNavigation } from '@/components/layout/TabNavigation'

export default function TabsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-lg font-semibold text-gray-800">AthleteOS</h1>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
            MVP v1.1
          </span>
        </div>
      </header>

      <main className="px-4 py-4 max-w-md mx-auto">
        {children}
      </main>

      <TabNavigation />
    </div>
  )
}
