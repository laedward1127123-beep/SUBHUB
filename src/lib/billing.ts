// ===== 计费周期折算 & 日期推算工具 =====
import type { BillingCycle, Subscription } from '@/types/subscription'
import { CURRENCY_SYMBOLS } from '@/types/subscription'

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** 一个计费周期包含的天数 */
export function cycleDays(cycle: BillingCycle, customDays: number | null, yearDays: 365 | 360): number {
  switch (cycle) {
    case 'weekly':
      return 7
    case 'monthly':
      return yearDays / 12
    case 'quarterly':
      return yearDays / 4
    case 'semiannual':
      return yearDays / 2
    case 'yearly':
      return yearDays
    case 'custom':
      return Math.max(1, customDays ?? 30)
  }
}

/** 折算为月均成本 */
export function toMonthlyCost(sub: Subscription, yearDays: 365 | 360): number {
  const days = cycleDays(sub.cycle, sub.customDays, yearDays)
  return (sub.amount / days) * (yearDays / 12)
}

/** 折算为年均成本 */
export function toYearlyCost(sub: Subscription, yearDays: 365 | 360): number {
  const days = cycleDays(sub.cycle, sub.customDays, yearDays)
  return (sub.amount / days) * yearDays
}

function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 给日期加一个周期 */
export function addCycle(date: Date, cycle: BillingCycle, customDays: number | null): Date {
  const d = new Date(date)
  switch (cycle) {
    case 'weekly':
      d.setDate(d.getDate() + 7)
      break
    case 'monthly':
      d.setMonth(d.getMonth() + 1)
      break
    case 'quarterly':
      d.setMonth(d.getMonth() + 3)
      break
    case 'semiannual':
      d.setMonth(d.getMonth() + 6)
      break
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1)
      break
    case 'custom':
      d.setDate(d.getDate() + Math.max(1, customDays ?? 30))
      break
  }
  return d
}

/** 根据起付日期与周期自动推算下次续费日期（>= 今天） */
export function nextRenewalDate(sub: Pick<Subscription, 'startDate' | 'cycle' | 'customDays'>, from: Date = new Date()): string {
  let d = parseDate(sub.startDate)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  let guard = 0
  while (d < today && guard < 1000) {
    d = addCycle(d, sub.cycle, sub.customDays)
    guard++
  }
  return toISODate(d)
}

/** 距离下次续费还有多少天（负数表示已过期） */
export function daysUntil(iso: string, from: Date = new Date()): number {
  const target = parseDate(iso)
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  return Math.round((target.getTime() - today.getTime()) / MS_PER_DAY)
}

/** 金额格式化：¥128.00 */
export function formatMoney(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `
  const fixed = Math.abs(amount) >= 1000 ? amount.toFixed(0) : amount.toFixed(2)
  return `${symbol}${Number(fixed).toLocaleString('zh-CN', { minimumFractionDigits: fixed.includes('.') ? 2 : 0, maximumFractionDigits: 2 })}`
}

/** 金额简短格式化（仪表盘用，不重复 ¥ 符号时手动加） */
export function formatAmount(amount: number): string {
  if (Math.abs(amount) >= 10000) return amount.toLocaleString('zh-CN', { maximumFractionDigits: 0 })
  return amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

/** 按货币分组的月均/年均合计：{ CNY: 123, USD: 45 } */
export function sumByCurrency(subs: Subscription[], yearDays: 365 | 360, mode: 'monthly' | 'yearly'): Record<string, number> {
  const map: Record<string, number> = {}
  for (const s of subs) {
    if (s.status === 'cancelled') continue
    const v = mode === 'monthly' ? toMonthlyCost(s, yearDays) : toYearlyCost(s, yearDays)
    map[s.currency] = (map[s.currency] ?? 0) + v
  }
  return map
}

/** 把多货币合计渲染为 "¥120 + $20" */
export function formatMultiCurrency(map: Record<string, number>): string {
  const entries = Object.entries(map)
  if (entries.length === 0) return '—'
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([cur, v]) => `${CURRENCY_SYMBOLS[cur] ?? cur + ' '}${formatAmount(v)}`)
    .join(' + ')
}
