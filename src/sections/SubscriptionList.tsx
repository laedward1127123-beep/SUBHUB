// ===== 订阅管理列表（筛选 + 网格/列表视图 + 删除确认） =====
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, List, SearchX } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import SubscriptionCard from './SubscriptionCard'
import type { AppSettings, Category, SubStatus, Subscription } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface SubscriptionListProps {
  subscriptions: Subscription[]
  categories: Category[]
  settings: AppSettings
  search: string
  onViewModeChange: (mode: 'grid' | 'list') => void
  onEdit: (sub: Subscription) => void
  onDelete: (id: string) => void
}

const STATUS_TABS: { value: 'all' | SubStatus; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '使用中' },
  { value: 'paused', label: '已暂停' },
  { value: 'cancelled', label: '已取消' },
]

export default function SubscriptionList({
  subscriptions, categories, settings, search, onViewModeChange, onEdit, onDelete,
}: SubscriptionListProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | SubStatus>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [pendingDelete, setPendingDelete] = useState<Subscription | null>(null)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return subscriptions.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (categoryFilter !== 'all' && s.categoryId !== categoryFilter) return false
      if (q) {
        const haystack = [s.name, s.notes, s.paymentMethod, ...s.tags].join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [subscriptions, statusFilter, categoryFilter, search])

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '其他'

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | SubStatus)}>
          <TabsList>
            {STATUS_TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              categoryFilter === 'all' ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            全部分类
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryFilter(c.id)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-colors',
                categoryFilter === c.id ? 'border-primary bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1 rounded-lg border bg-card p-0.5">
          <Button
            variant={settings.viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => onViewModeChange('grid')}
            title="网格视图"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={settings.viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => onViewModeChange('list')}
            title="列表视图"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* 列表 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${settings.viewMode}-${statusFilter}-${categoryFilter}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card py-16 text-muted-foreground">
              <SearchX className="h-8 w-8" />
              <p className="text-sm">没有符合条件的订阅</p>
            </div>
          ) : (
            <div className={cn(settings.viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-2.5')}>
              {filtered.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <SubscriptionCard
                    sub={sub}
                    categoryName={categoryName(sub.categoryId)}
                    yearDays={settings.yearDays}
                    view={settings.viewMode}
                    onEdit={onEdit}
                    onDelete={setPendingDelete}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 删除确认 */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除订阅「{pendingDelete?.name}」？</AlertDialogTitle>
            <AlertDialogDescription>此操作不可撤销，该订阅的所有信息（含 AI 扩展信息）将被永久删除。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingDelete) {
                  onDelete(pendingDelete.id)
                  toast.success(`已删除「${pendingDelete.name}」`)
                  setPendingDelete(null)
                }
              }}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
