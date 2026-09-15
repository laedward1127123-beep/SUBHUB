// ===== 订阅卡片（网格 / 列表两种形态） =====
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Copy, Pencil, Trash2, CalendarClock, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CYCLE_LABELS, RESET_LABELS, STATUS_LABELS,
  type Subscription,
} from '@/types/subscription'
import { daysUntil, formatMoney, nextRenewalDate, toMonthlyCost } from '@/lib/billing'
import SubIcon from '@/components/SubIcon'
import { cn } from '@/lib/utils'

interface SubscriptionCardProps {
  sub: Subscription
  categoryName: string
  yearDays: 365 | 360
  view: 'grid' | 'list'
  onEdit: (sub: Subscription) => void
  onDelete: (sub: Subscription) => void
}

const STATUS_STYLES: Record<Subscription['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  paused: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  cancelled: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400 border-zinc-500/20',
}

function TokenBar({ sub }: { sub: Subscription }) {
  const total = sub.ai?.tokenTotal
  const used = sub.ai?.tokenUsed
  if (total == null || used == null || total <= 0) return null
  const pct = Math.min(100, (used / total) * 100)
  const danger = pct >= 85
  return (
    <div className="mt-2.5">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          Token 用量
        </span>
        <span className={cn(danger && 'font-medium text-red-500')}>
          {used.toLocaleString()} / {total.toLocaleString()}（{pct.toFixed(1)}%）
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn('h-full rounded-full', danger ? 'bg-red-500' : 'bg-primary')}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {sub.ai?.tokenResetPeriod !== 'never' && sub.ai?.tokenResetDate && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          {RESET_LABELS[sub.ai.tokenResetPeriod]}重置 · 下次 {sub.ai.tokenResetDate}
        </p>
      )}
    </div>
  )
}

function ApiKeyRow({ sub }: { sub: Subscription }) {
  const [show, setShow] = useState(false)
  const key = sub.ai?.apiKey
  if (!key) return null
  const masked = key.length > 8 ? `${key.slice(0, 4)}${'•'.repeat(8)}${key.slice(-4)}` : '•'.repeat(key.length)
  return (
    <div className="mt-2 flex items-center gap-1.5 rounded-md bg-muted/70 px-2 py-1 font-mono text-[11px] text-muted-foreground">
      <span className="min-w-0 flex-1 truncate">{show ? key : masked}</span>
      <button
        type="button"
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-background"
        onClick={() => setShow((v) => !v)}
        title={show ? '隐藏 Key' : '显示 Key'}
      >
        {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
      </button>
      <button
        type="button"
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-background"
        title="复制 Key"
        onClick={() => navigator.clipboard.writeText(key).then(() => toast.success('API Key 已复制'))}
      >
        <Copy className="h-3 w-3" />
      </button>
    </div>
  )
}

export default function SubscriptionCard({ sub, categoryName, yearDays, view, onEdit, onDelete }: SubscriptionCardProps) {
  const renewal = nextRenewalDate(sub)
  const dleft = daysUntil(renewal)
  const monthly = toMonthlyCost(sub, yearDays)
  const urgent = sub.status === 'active' && dleft <= 7
  const trialDays = sub.isTrial && sub.trialEndDate ? daysUntil(sub.trialEndDate) : null

  const actions = (
    <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(sub)} title="编辑">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(sub)} title="删除">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )

  const iconBlock = (
    <SubIcon iconType={sub.iconType} icon={sub.icon} size={22} box={40} color={sub.color} />
  )

  const statusBadge = (
    <Badge variant="outline" className={cn('text-[11px] font-normal', STATUS_STYLES[sub.status])}>
      {STATUS_LABELS[sub.status]}
    </Badge>
  )

  if (view === 'list') {
    return (
      <div className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(31,35,41,0.12)]">
        {iconBlock}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">{sub.name}</span>
            {statusBadge}
            {sub.isTrial && trialDays !== null && trialDays >= 0 && (
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[11px] font-normal text-primary">
                试用剩 {trialDays} 天
              </Badge>
            )}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {categoryName} · {CYCLE_LABELS[sub.cycle]}
            {sub.cycle === 'custom' && sub.customDays ? `（${sub.customDays} 天）` : ''} · {sub.paymentMethod}
          </p>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-sm font-semibold">{formatMoney(sub.amount, sub.currency)}</p>
          <p className="text-xs text-muted-foreground">月均 {formatMoney(monthly, sub.currency)}</p>
        </div>
        <div className={cn('hidden w-32 shrink-0 text-right text-xs md:block', urgent ? 'font-medium text-red-500' : 'text-muted-foreground')}>
          <p className="flex items-center justify-end gap-1">
            <CalendarClock className="h-3 w-3" />
            {renewal}
          </p>
          <p>{dleft < 0 ? '已过期' : dleft === 0 ? '今天续费' : `${dleft} 天后续费`}</p>
        </div>
        {actions}
      </div>
    )
  }

  return (
    <div className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_24px_-8px_rgba(31,35,41,0.15)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {iconBlock}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{sub.name}</p>
            <p className="text-xs text-muted-foreground">{categoryName}</p>
          </div>
        </div>
        {actions}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-lg font-semibold tracking-tight">
          {formatMoney(sub.amount, sub.currency)}
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            / {CYCLE_LABELS[sub.cycle]}{sub.cycle === 'custom' && sub.customDays ? ` ${sub.customDays}天` : ''}
          </span>
        </p>
        {statusBadge}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">月均约 {formatMoney(monthly, sub.currency)}</p>

      <div className={cn('mt-2.5 flex items-center gap-1 text-xs', urgent ? 'font-medium text-red-500' : 'text-muted-foreground')}>
        <CalendarClock className="h-3 w-3" />
        {sub.status === 'cancelled' ? '已取消，不再续费' : (
          <>
            {renewal} 续费{dleft >= 0 && `（${dleft === 0 ? '今天' : `${dleft} 天后`}）`}
          </>
        )}
      </div>

      {sub.isTrial && trialDays !== null && trialDays >= 0 && (
        <p className="mt-1 text-xs text-primary">试用中 · {sub.trialEndDate} 结束（剩 {trialDays} 天）</p>
      )}

      {sub.isAI && sub.ai && (
        <>
          <ApiKeyRow sub={sub} />
          <TokenBar sub={sub} />
        </>
      )}

      {sub.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {sub.tags.map((t) => (
            <Badge key={t} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">{t}</Badge>
          ))}
        </div>
      )}
      {sub.notes && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{sub.notes}</p>}
    </div>
  )
}
