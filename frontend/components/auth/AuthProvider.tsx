'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

const PUBLIC_PATHS = ['/login']

export default function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loadUserFromStorage } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const initAuth = async () => {
      await loadUserFromStorage()
      setIsLoading(false)
    }
    initAuth()
  }, [loadUserFromStorage])

  useEffect(() => {
    if (isLoading) return

    const isPublicPath = PUBLIC_PATHS.some(path => pathname?.startsWith(path))

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login')
    } else if (isAuthenticated && pathname === '/login') {
      router.push('/today')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return <>{children}</>
}
