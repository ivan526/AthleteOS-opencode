import { BottomNav } from '@/components/training/MobileMock'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-bg"><main className="mx-auto max-w-[430px]">{children}</main><BottomNav /></div>
}
