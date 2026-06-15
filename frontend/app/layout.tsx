import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import { ToastContainer } from '@/components/ui/toast'

export const metadata: Metadata = {
  title: 'AthleteOS - 智能训练助手',
  description: '基于运动科学的智能训练计划跟踪与决策系统'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
