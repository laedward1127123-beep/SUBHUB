// ===== 分类管理 =====
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category, Subscription } from '@/types/subscription'

interface CategoryManagerProps {
  categories: Category[]
  subscriptions: Subscription[]
  onAdd: (name: string) => Category | null
  onRemove: (id: string) => void
}

export default function CategoryManager({ categories, subscriptions, onAdd, onRemove }: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [pendingRemove, setPendingRemove] = useState<Category | null>(null)

  const countOf = (id: string) => subscriptions.filter((s) => s.categoryId === id).length

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const created = onAdd(trimmed)
    if (created) {
      toast.success(`分类「${trimmed}」已添加`)
      setName('')
    } else {
      toast.error('分类已存在或名称为空')
    }
  }

  return (
    <div className="space-y-5">
      {/* 新增分类 */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-medium">新增自定义分类</h3>
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入分类名称，如：游戏、阅读"
            className="max-w-xs"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd} className="gap-1.5">
            <Plus className="h-4 w-4" /> 添加
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          删除自定义分类时，该分类下的订阅会自动归入「其他」。内置分类不可删除。
        </p>
      </div>

      {/* 分类列表 */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-[0_6px_16px_-6px_rgba(31,35,41,0.12)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-sm font-medium">
                <span className="truncate">{c.name}</span>
                {c.builtin && <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">内置</Badge>}
              </p>
              <p className="text-xs text-muted-foreground">{countOf(c.id)} 个订阅</p>
            </div>
            {!c.builtin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                onClick={() => setPendingRemove(c)}
                title="删除分类"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>

      {/* 删除确认 */}
      <AlertDialog open={!!pendingRemove} onOpenChange={(open) => !open && setPendingRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除分类「{pendingRemove?.name}」？</AlertDialogTitle>
            <AlertDialogDescription>
              该分类下的 {pendingRemove ? countOf(pendingRemove.id) : 0} 个订阅将自动归入「其他」分类。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingRemove) {
                  onRemove(pendingRemove.id)
                  toast.success(`分类「${pendingRemove.name}」已删除`)
                  setPendingRemove(null)
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
