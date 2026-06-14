'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
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
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              未连接
            </Badge>
          </div>

          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
            连接 Intervals.icu
          </Button>

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
              <span className="text-gray-600">姓名</span>
              <span className="text-gray-800 font-medium">未设置</span>
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
              <span className="text-gray-600">历史数据</span>
              <span className="text-gray-800 font-medium">45 天</span>
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
    </div>
  )
}
