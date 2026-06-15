'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { useAuthStore } from '@/lib/auth-store'
import { apiClient } from '@/lib/api'
import { successToast, errorToast } from '@/lib/toast'
import { 
  Link2, 
  LogOut, 
  User, 
  Calendar, 
  Database, 
  RefreshCw, 
  ChevronRight,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle,
  Settings
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuthStore()
  const [apiKey, setApiKey] = useState('')
  const [athleteId, setAthleteId] = useState('')
  const [syncStatus, setSyncStatus] = useState<any>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
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
      // 静默失败
    }
  }

  const loadSyncStatus = async () => {
    try {
      const status = await apiClient.getSyncStatus() as any
      setSyncStatus(status)
    } catch {
      // 静默失败
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
  const totalActivities = syncStatus?.activity_count || 0
  const dataQuality = totalActivities >= 20 ? 'good' : totalActivities >= 10 ? 'medium' : 'limited'

  return (
    <div className="space-y-4 pb-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-semibold text-gray-800">设置</h1>
      </div>

      {/* 用户信息卡片 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <User className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 text-lg">{user?.name || '运动爱好者'}</h2>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                  Pro
                </Badge>
                <span className="text-xs text-gray-400">
                  加入于 {user?.created_at ? new Date(user.created_at).toLocaleDateString('zh-CN') : '-'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据源连接卡片 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-emerald-600" />
            数据源连接
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-4">
          {/* 连接状态卡片 */}
          <div className={`p-4 rounded-xl ${isConnected ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isConnected ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                  {isConnected ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Intervals.icu</p>
                  <p className="text-sm text-gray-500">
                    {isConnected ? '已连接，数据同步正常' : '未连接'}
                  </p>
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={isConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}
              >
                {isConnected ? '已连接' : '未连接'}
              </Badge>
            </div>

            {isConnected && (
              <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-700">{syncStatus?.activity_count || 0}</p>
                  <p className="text-xs text-emerald-600/70">训练记录</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-700">{syncStatus?.daily_state_count || 0}</p>
                  <p className="text-xs text-emerald-600/70">健康数据天</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-emerald-700">
                    {dataQuality === 'good' ? '好' : dataQuality === 'medium' ? '中' : '少'}
                  </p>
                  <p className="text-xs text-emerald-600/70">数据质量</p>
                </div>
              </div>
            )}
          </div>

          {/* 配置表单 */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all"
                placeholder="输入从 Intervals.icu 获取的 API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Athlete ID
              </label>
              <input
                type="text"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all"
                placeholder="例如: i212288"
              />
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              保存设置
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSync}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              同步数据
            </Button>
          </div>

          {/* 配置说明 */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">如何获取凭据？</p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>登录 <a href="https://intervals.icu" target="_blank" className="underline inline-flex items-center gap-0.5">intervals.icu <ExternalLink className="w-3 h-3" /></a> 账号</li>
                  <li>进入 Settings → API Keys 创建新密钥</li>
                  <li>点击你的名字，在 URL 中查看 Athlete ID</li>
                </ol>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 关于 AthleteOS */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Info className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-800">关于</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">版本</span>
              <span className="text-sm font-medium text-gray-800">MVP v1.1</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">训练引擎</span>
              <span className="text-sm font-medium text-gray-800">v1.0</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">数据来源</span>
              <span className="text-sm font-medium text-gray-800 flex items-center gap-1">
                Intervals.icu API
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 退出登录按钮 */}
      <Button
        variant="destructive"
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-0 shadow-none"
        onClick={() => setShowLogoutConfirm(true)}
      >
        <LogOut className="w-4 h-4 mr-2" />
        退出登录
      </Button>

      {/* 退出确认弹窗 */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false)
          logout()
        }}
        title="确认退出登录"
        message="确定要退出当前账号吗？下次登录需要重新输入密码。"
        confirmText="确认退出"
        cancelText="取消"
      />
    </div>
  )
}
