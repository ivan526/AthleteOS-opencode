'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/auth-store'
import { apiClient } from '@/lib/api'
import { successToast, errorToast } from '@/lib/toast'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const [apiKey, setApiKey] = useState('')
  const [athleteId, setAthleteId] = useState('')
  const [syncStatus, setSyncStatus] = useState<{
    activity_count: number
    daily_state_count: number
    latest_activity_date: string | null
  } | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasSavedCredentials, setHasSavedCredentials] = useState(false)

  useEffect(() => {
    loadSettings()
    loadSyncStatus()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await apiClient.getSettings() as any
      if (settings.intervals_api_key) setApiKey(settings.intervals_api_key)
      if (settings.intervals_athlete_id) setAthleteId(settings.intervals_athlete_id)
      setHasSavedCredentials(settings.has_credentials || false)
    } catch {
      // Ignore
    }
  }

  const loadSyncStatus = async () => {
    try {
      const status = await apiClient.getSyncStatus() as any
      setSyncStatus(status)
    } catch {
      // Ignore
    }
  }

  const handleSaveSettings = async () => {
    if (!apiKey || !athleteId) {
      errorToast('请输入 API Key 和 Athlete ID')
      return
    }

    setIsSaving(true)

    try {
      await apiClient.updateSettings({
        intervals_api_key: apiKey,
        intervals_athlete_id: athleteId
      })
      setHasSavedCredentials(true)
      successToast('设置保存成功！')
    } catch {
      errorToast('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)

    try {
      if (hasSavedCredentials) {
        await apiClient.syncWithSavedCredentials(90)
      } else {
        if (!apiKey || !athleteId) {
          errorToast('请输入 API Key 和 Athlete ID')
          setIsSyncing(false)
          return
        }
        await apiClient.syncIntervalsIcu(apiKey, athleteId, 90)
      }
      successToast('数据同步成功！')
      await loadSyncStatus()
    } catch {
      errorToast('同步失败，请检查您的凭据')
    } finally {
      setIsSyncing(false)
    }
  }

  const isConnected = syncStatus && syncStatus.activity_count > 0

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-medium text-gray-800">设置</h1>
      </div>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-gray-800">数据源连接</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-lg">📊</span>
              </div>
              <div>
                <div className="font-medium text-gray-800">Intervals.icu</div>
                <div className="text-sm text-gray-500">训练数据分析平台</div>
              </div>
            </div>
            <Badge variant="secondary" className={isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
              {isConnected ? '已连接' : '未连接'}
            </Badge>
          </div>

          {isConnected && syncStatus && (
            <div className="text-sm text-gray-600 space-y-1 p-3 bg-emerald-50 rounded-lg">
              <div>已同步活动：{syncStatus.activity_count} 条</div>
              <div>体能数据：{syncStatus.daily_state_count} 天</div>
              {syncStatus.latest_activity_date && (
                <div>最新活动：{new Date(syncStatus.latest_activity_date).toLocaleDateString('zh-CN')}</div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="1gzdnhjs6ya48kx0zgb3m22ap"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Athlete ID
              </label>
              <input
                type="text"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                placeholder="i212288"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? '保存中...' : '保存设置'}
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? '同步中...' : isConnected ? '重新同步' : '同步数据'}
            </Button>
          </div>

          {hasSavedCredentials && (
            <p className="text-xs text-emerald-600 text-center">
              ✓ 凭据已保存，下次可直接同步
            </p>
          )}

          {syncMessage && (
            <p className={`text-xs text-center ${syncMessage.includes('成功') ? 'text-emerald-600' : 'text-red-600'}`}>
              {syncMessage}
            </p>
          )}

          <p className="text-xs text-gray-500 text-center">
            连接后将同步您的训练数据、负荷指标和恢复数据
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-gray-800">用户信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">邮箱</span>
              <span className="text-gray-800 font-medium">{user?.email || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">姓名</span>
              <span className="text-gray-800 font-medium">{user?.name || '未设置'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">主项运动</span>
              <span className="text-gray-800 font-medium">跑步</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">数据等级</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                B 级 - 较稳定
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">注册时间</span>
              <span className="text-gray-800 font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-gray-800">关于</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">版本</span>
            <span className="text-gray-800 font-medium">MVP v1.1</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">引擎版本</span>
            <span className="text-gray-800 font-medium">Training Engine v1.0</span>
          </div>
        </CardContent>
      </Card>

      <Button
        variant="destructive"
        className="w-full bg-red-500 hover:bg-red-600 text-white"
        onClick={logout}
      >
        退出登录
      </Button>
    </div>
  )
}
