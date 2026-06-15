'use client'

import Link from 'next/link'
import { useState } from 'react'
import { GlassCard, HillArt, Icons, IconBubble, PageShell, Ring } from '@/components/training/MobileMock'

export default function TodayPage() {
  const [sheet, setSheet] = useState(false)
  const feedback = [ ['太累了', Icons.SmilePlus], ['只有30分钟', Icons.Clock3], ['腿部不适', Icons.Activity], ['换成骑行', Icons.Bike], ['今天休息', Icons.Coffee], ['已完成', Icons.Check] ] as const
  return <PageShell>
    <h1 className="page-title">今日训练</h1><div className="page-subtitle">6月14日 周日</div>
    <div className="top-sync">数据来源： Intervals.icu<br/><Icons.RefreshCw className="inline w-4 h-4"/> 已同步 08:20</div>
    <GlassCard><h2 className="card-title">今日训练能力</h2><div className="flex items-center gap-6"><Ring value={76}/><div><div className="pill mb-4">适合正常训练</div><div className="text-xl text-gray-500 mb-4">较昨日 <b className="text-green-700">+4</b></div><p className="text-gray-600 text-lg leading-7">今天状态稳定，适合完成计划训练。</p></div></div></GlassCard>
    <GlassCard><h2 className="card-title">今日建议</h2><div className="flex gap-4 items-center"><IconBubble><Icons.Activity /></IconBubble><div className="flex-1"><h3 className="text-3xl font-black text-green-950 mb-2">节奏跑</h3><div className="flex items-center gap-4 text-lg"><span><Icons.Clock3 className="inline w-5 h-5"/> 50 分钟</span><span className="text-gray-300">|</span><span>预计负荷 TSS 65</span><span className="orange-pill ml-auto">中等强度</span></div></div></div><p className="text-lg mt-5"><b className="text-green-800">训练目的：</b> 提升半马目标配速维持能力</p><Link href="/today/workout" className="mt-5 h-12 rounded-xl border border-green-200 flex items-center justify-between px-5 text-green-800 font-bold text-lg"><span><Icons.ListChecks className="inline mr-3"/>查看训练详情</span><Icons.ChevronRight/></Link></GlassCard>
    <GlassCard><h2 className="card-title">为什么这样安排？</h2>{['睡眠恢复较好','近期训练负荷稳定','当前疲劳处于可接受范围'].map(x=><div className="flex items-center gap-4 text-lg py-2" key={x}><span className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center"><Icons.Check size={16}/></span>{x}</div>)}<HillArt small/></GlassCard>
    <GlassCard><h2 className="card-title">今天情况有变化？</h2><div className="grid grid-cols-3 gap-3">{feedback.map(([t,I])=><button onClick={()=>t==='太累了'&&setSheet(true)} className="h-16 rounded-xl border border-green-200 bg-white/60 text-green-900 font-bold text-base flex items-center justify-center gap-2" key={t}><I className="w-7 h-7"/>{t}</button>)}</div></GlassCard>
    {sheet && <div className="fixed inset-0 z-40 bg-black/65 flex items-end justify-center"><div className="w-full max-w-[430px] rounded-t-[30px] bg-white p-8 pb-16"><div className="mx-auto mb-8 h-1.5 w-14 rounded bg-gray-300"/><h2 className="text-3xl font-black text-green-950">今天感觉很累？</h2><p className="text-gray-600 my-4 text-lg">告诉我们你的状态，系统将为你调整训练计划。</p><div className="border border-green-200 rounded-xl p-3 mb-5 text-center">当前建议： <b className="text-green-800">节奏跑</b> 50 分钟</div><div className="border border-green-200 rounded-xl p-4"><h3 className="font-black text-xl mb-3">你的疲劳程度？</h3>{['轻微疲劳　身体状态尚可，可以完成计划','比较疲劳　感觉比较累，适合降低强度','非常疲劳　非常疲惫，建议恢复优先'].map((x,i)=><div key={x} className={`p-3 rounded-xl flex gap-3 ${i===1?'bg-green-50':''}`}><span className="w-6 h-6 rounded-full border-2 border-green-700 mt-1">{i===1?'●':''}</span><span>{x}</span></div>)}</div><button className="primary-btn mt-5" onClick={()=>setSheet(false)}>调整今日训练</button><div className="border border-green-200 rounded-xl p-4 mt-5"><h3 className="font-black text-xl text-green-950">已为你降低强度</h3><p className="mt-3">原计划： <b>节奏跑</b> 50 分钟 · TSS 65</p><p className="text-green-700 mt-4">调整后： <b>轻松跑</b> 40 分钟 · TSS 35</p></div></div></div>}
  </PageShell>
}
