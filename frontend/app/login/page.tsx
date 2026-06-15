'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/auth-store'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { login, register, isLoading, error, clearError } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      if (isRegister) {
        await register({ email, name, password })
      } else {
        await login({ email, password })
      }
      router.push('/today')
    } catch {
      // Error is handled by store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-white">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl">🏃</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            AthleteOS
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">智能训练计划跟踪系统</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="请输入您的邮箱"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="请输入您的密码"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2"
              disabled={isLoading}
            >
              {isLoading ? '处理中...' : isRegister ? '注册' : '登录'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  clearError()
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700"
              >
                {isRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center mb-4">
              演示账号（可直接使用）：
            </p>
            <div className="text-xs text-center space-y-1">
              <div>邮箱：demo@athleteos.app</div>
              <div>密码：demo123456</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
