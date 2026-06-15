'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { path: '/today', label: '今日', icon: '🏠' },
  { path: '/workout', label: '训练', icon: '🏃' },
  { path: '/analysis', label: '分析', icon: '📊' },
  { path: '/history', label: '历史', icon: '📈' },
  { path: '/review', label: '复盘', icon: '📋' },
  { path: '/settings', label: '设置', icon: '⚙️' }
]

export function TabNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || pathname === tab.path + '/'
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-xl mb-0.5">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
