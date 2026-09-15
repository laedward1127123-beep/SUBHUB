// ===== 仪表盘 =====
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Wallet, CalendarDays, Layers, BellRing } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { AppSettings, Category, Subscription } from '@/types/subscription'
import {
  CURRENCY_SYMBOLS, STATUS_LABELS,
} from '@/types/subscription'
import {
  daysUntil, formatAmount, formatMoney, formatMultiCurrency,
  nextRenewalDate, sumByCurrency, toMonthlyCost,
} from '@/lib/billing'
import { cn } from '@/lib/utils'
import SubIcon from '@/components/SubIcon'

interface DashboardProps {
  subscriptions: Subscription[]
  categories: Category[]
  settings: AppSettings
  onGoToSubscriptions: () => void
}

const DONUT_COLORS = ['#3370FF', '#7F3BF5', '#14C0FF', '#34A853', '#F8801A', '#F54A45', '#FFC60A', '#E84393', '#646A73']

const cardAnim = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export default function Dashboard({ subscriptions, categories, settings, onGoToSubscriptions }: DashboardProps) {
  const { yearDays, dashboardCards } = settings

  const activeSubs = useMemo(() => subscriptions.filter((s) => s.status !== 'cancelled'), [subscriptions])
  const monthlyMap = useMemo(() => sumByCurrency(activeSubs, yearDays, 'monthly'), [activeSubs, yearDays])
  const yearlyMap = useMemo(() => sumByCurrency(activeSubs, yearDays, 'yearly'), [activeSubs, yearDays])

  const upcoming = useMemo(() => {
    return activeSubs
      .filter((s) => s.status === 'active')
      .map((s) => ({ sub: s, renewal: nextRenewalDate(s) }))
      .map(({ sub, renewal }) => ({ sub, renewal, days: daysUntil(renewal) }))
      .filter((x) => x.days >= 0 && x.days <= 7)
      .sort((a, b) => a.days - b.days)
  }, [activeSubs])

  const categoryChart = useMemo(() => {
    const byCat = new Map<string, Record<string, number>>()
    for (const s of activeSubs) {
      const m = toMonthlyCost(s, yearDays)
      const bucket = byCat.get(s.categoryId) ?? {}
      bucket[s.currency] = (bucket[s.currency] ?? 0) + m
      byCat.set(s.categoryId, bucket)
    }
    return [...byCat.entries()]
      .map(([catId, map]) => ({
        name: categories.find((c) => c.id === catId)?.name ?? '其他',
        value: Object.values(map).reduce((a, b) => a + b, 0),
        detail: Object.entries(map)
          .map(([cur, v]) => `${CURRENCY_SYMBOLS[cur] ?? cur}${formatAmount(v)}`)
          .join(' + '),
      }))
      .sort((a, b) => b.value - a.value)
  }, [activeSubs, categories, yearDays])

  const statCards = [
    {
      key: 'monthly' as const,
      title: '月度总支出',
      icon: Wallet,
      value: formatMultiCurrency(monthlyMap),
      desc: `全部订阅折算为月均（按 ${yearDays} 天/年）`,
    },
    {
      key: 'yearly' as const,
      title: '年度总支出',
      icon: CalendarDays,
      value: formatMultiCurrency(yearlyMap),
      desc: `全部订阅折算为年均（按 ${yearDays} 天/年）`,
    },
    {
      key: 'count' as const,
      title: '订阅总数',
      icon: Layers,
      value: String(subscriptions.length),
      desc: `使用中 ${subscriptions.filter((s) => s.status === 'active').length} · 已暂停 ${subscriptions.filter((s) => s.status === 'paused').length} · 已取消 ${subscriptions.filter((s) => s.status === 'cancelled').length}`,
    },
  ].filter((c) => dashboardCards[c.key])

  return (
    <div className="space-y-5">
      {/* 统计卡片 */}
      {statCards.length > 0 && (
        <div className={cn('grid gap-4', statCards.length >= 3 ? 'md:grid-cols-3' : statCards.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1')}>
          {statCards.map((c, i) => (
            <motion.div
              key={c.key}
              {...cardAnim}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-[0_8px_20px_-8px_rgba(31,35,41,0.12)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{c.title}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-2 truncate text-2xl font-semibold tracking-tight" title={c.value}>{c.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className={cn('grid gap-4', dashboardCards.upcoming && dashboardCards.chart ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {/* 即将续费 */}
        {dashboardCards.upcoming && (
          <motion.div {...cardAnim} transition={{ duration: 0.3, delay: 0.15 }} className="rounded-xl border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <BellRing className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">7 天内即将续费</h3>
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{upcoming.length}</span>
            </div>
            {upcoming.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">未来 7 天没有续费，一切尽在掌握 🎉</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map(({ sub, renewal, days }) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={onGoToSubscriptions}
                    className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                  >
                    <SubIcon iconType={sub.iconType} icon={sub.icon} size={17} box={32} color={sub.color} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{renewal} · {formatMoney(sub.amount, sub.currency)}</p>
                    </div>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs', days <= 2 ? 'bg-red-500/10 font-medium text-red-500' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400')}>
                      {days === 0 ? '今天' : `${days} 天后`}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* 分类支出占比 */}
        {dashboardCards.chart && (
          <motion.div {...cardAnim} transition={{ duration: 0.3, delay: 0.2 }} className="rounded-xl border bg-card p-5">
            <h3 className="mb-3 text-sm font-medium">分类支出占比（月均）</h3>
            {categoryChart.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">暂无数据</p>
            ) : (
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-44 w-44 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChart}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={48}
                        outerRadius={80}
                        paddingAngle={2}
                        strokeWidth={0}
                        isAnimationActive={false}
                      >
                        {categoryChart.map((_, i) => (
                          <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, item) => [
                          (item?.payload as { detail?: string })?.detail ?? formatAmount(Number(value)),
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="min-w-0 flex-1 space-y-1.5 self-stretch">
                  {categoryChart.map((c, i) => {
                    const total = categoryChart.reduce((a, b) => a + b.value, 0)
                    const pct = total > 0 ? (c.value / total) * 100 : 0
                    return (
                      <div key={c.name} className="flex items-center gap-2 text-xs">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                        <span className="w-16 shrink-0 truncate">{c.name}</span>
                        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.25 + i * 0.05 }}
                          />
                        </div>
                        <span className="w-24 shrink-0 text-right text-muted-foreground">{c.detail}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {subscriptions.length === 0 && (
        <div className="rounded-xl border border-dashed bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">还没有任何订阅，点击右上角「新建订阅」开始记录吧。</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        提示：月度/年度支出按各订阅原币种分别合计，不同货币不做汇率换算。状态为「{STATUS_LABELS.cancelled}」的订阅不计入支出统计。
      </p>
    </div>
  )
}
