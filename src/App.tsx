// ===== SubHub · 订阅管理 =====
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, ListChecks, Plus, Search, Settings2, Tags, Wallet } from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Dashboard from '@/sections/Dashboard'
import SubscriptionList from '@/sections/SubscriptionList'
import CategoryManager from '@/sections/CategoryManager'
import SettingsSection from '@/sections/SettingsSection'
import SubscriptionForm from '@/sections/SubscriptionForm'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { useCategories } from '@/hooks/useCategories'
import { useSettings } from '@/hooks/useSettings'
import type { Subscription } from '@/types/subscription'
import { cn } from '@/lib/utils'

type PageKey = 'dashboard' | 'subscriptions' | 'categories' | 'settings'

const NAV: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
  { key: 'subscriptions', label: '订阅管理', icon: ListChecks },
  { key: 'categories', label: '分类管理', icon: Tags },
  { key: 'settings', label: '设置', icon: Settings2 },
]

const PAGE_TITLES: Record<PageKey, { title: string; desc: string }> = {
  dashboard: { title: '仪表盘', desc: '一览所有订阅支出与续费动态' },
  subscriptions: { title: '订阅管理', desc: '管理你的全部订阅服务' },
  categories: { title: '分类管理', desc: '内置分类与自定义分类' },
  settings: { title: '设置', desc: '外观、偏好与数据管理' },
}

const VALID_PAGES: PageKey[] = ['dashboard', 'subscriptions', 'categories', 'settings']

function pageFromHash(): PageKey {
  const h = window.location.hash.replace('#/', '').replace('#', '') as PageKey
  return VALID_PAGES.includes(h) ? h : 'dashboard'
}

export default function App() {
  const [page, setPageState] = useState<PageKey>(() => pageFromHash())
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)

  const { settings, update } = useSettings()
  const {
    subscriptions, addSubscription, updateSubscription, deleteSubscription,
    reassignCategory, clearAll, exportJSON, importJSON, resetToSamples,
  } = useSubscriptions()
  const { categories, addCategory, removeCategory } = useCategories()

  const setPage = (p: PageKey) => {
    setPageState(p)
    window.location.hash = `/${p}`
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (sub: Subscription) => {
    setEditing(sub)
    setFormOpen(true)
  }

  const handleSubmit = (data: Omit<Subscription, 'id' | 'createdAt'>) => {
    if (editing) {
      updateSubscription(editing.id, data)
    } else {
      addSubscription(data)
    }
  }

  const handleRemoveCategory = (id: string) => {
    removeCategory(id)
    reassignCategory(id, 'other')
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F7] text-foreground dark:bg-background">
      {/* 侧边栏 */}
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r bg-card px-3 py-5">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-base font-semibold leading-tight">SubHub</p>
            <p className="text-[11px] text-muted-foreground">订阅管理</p>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all active:scale-[0.98]',
                page === item.key
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-lg bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
          数据保存在本机浏览器，完全离线可用。
        </div>
      </aside>

      {/* 主区域 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card/80 px-6 py-3 backdrop-blur">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                if (e.target.value && page !== 'subscriptions') setPage('subscriptions')
              }}
              placeholder="搜索订阅名称、标签、备注…"
              className="pl-9"
            />
          </div>
          <div className="ml-auto">
            <Button onClick={openCreate} className="gap-1.5 transition-transform hover:scale-[1.03] active:scale-95">
              <Plus className="h-4 w-4" /> 新建订阅
            </Button>
          </div>
        </header>

        {/* 内容 */}
        <main className="flex-1 px-6 py-6">
          <div className="mb-5">
            <h1 className="text-xl font-semibold tracking-tight">{PAGE_TITLES[page].title}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">{PAGE_TITLES[page].desc}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {page === 'dashboard' && (
                <Dashboard
                  subscriptions={subscriptions}
                  categories={categories}
                  settings={settings}
                  onGoToSubscriptions={() => setPage('subscriptions')}
                />
              )}
              {page === 'subscriptions' && (
                <SubscriptionList
                  subscriptions={subscriptions}
                  categories={categories}
                  settings={settings}
                  search={search}
                  onViewModeChange={(mode) => update({ viewMode: mode })}
                  onEdit={openEdit}
                  onDelete={deleteSubscription}
                />
              )}
              {page === 'categories' && (
                <CategoryManager
                  categories={categories}
                  subscriptions={subscriptions}
                  onAdd={addCategory}
                  onRemove={handleRemoveCategory}
                />
              )}
              {page === 'settings' && (
                <SettingsSection
                  settings={settings}
                  onUpdate={update}
                  onExport={exportJSON}
                  onImport={importJSON}
                  onClearAll={clearAll}
                  onResetSamples={resetToSamples}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 新建 / 编辑表单 */}
      <SubscriptionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editing={editing}
        categories={categories}
        defaultCurrency={settings.defaultCurrency}
        onSubmit={handleSubmit}
      />

      <Toaster richColors position="top-center" />
    </div>
  )
}
