// ===== 订阅管理 SubHub · 类型与常量 =====

export type BillingCycle =
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'yearly'
  | 'custom'

export type SubStatus = 'active' | 'paused' | 'cancelled'

export type TokenResetPeriod = 'monthly' | 'daily' | 'never'

/** 图标类型：emoji 字符 / 内置手绘 SVG id / 自定义图片 dataURL */
export type IconType = 'emoji' | 'svg' | 'image'

export interface AIInfo {
  endpoint: string
  apiKey: string
  tokenTotal: number | null
  tokenUsed: number | null
  tokenResetPeriod: TokenResetPeriod
  tokenResetDate: string // ISO date，可为空字符串
}

export interface Subscription {
  id: string
  name: string
  categoryId: string
  amount: number
  currency: string
  cycle: BillingCycle
  customDays: number | null
  startDate: string // ISO date (yyyy-MM-dd)
  paymentMethod: string
  notes: string
  tags: string[]
  status: SubStatus
  isTrial: boolean
  trialEndDate: string
  isAI: boolean
  ai: AIInfo | null
  color: string
  iconType: IconType
  icon: string // emoji 字符 / svg id / dataURL
  createdAt: string
}

export interface Category {
  id: string
  name: string
  builtin: boolean
}

export type ThemeMode = 'light' | 'dark' | 'system'
export type ViewMode = 'grid' | 'list'
export type AccentKey = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal'

export interface DashboardCards {
  monthly: boolean
  yearly: boolean
  count: boolean
  upcoming: boolean
  chart: boolean
}

export interface AppSettings {
  theme: ThemeMode
  accent: AccentKey
  defaultCurrency: string
  viewMode: ViewMode
  yearDays: 365 | 360
  dashboardCards: DashboardCards
}

// ===== 常量 =====

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: '周付',
  monthly: '月付',
  quarterly: '季付',
  semiannual: '半年付',
  yearly: '年付',
  custom: '自定义天数',
}

export const STATUS_LABELS: Record<SubStatus, string> = {
  active: '使用中',
  paused: '已暂停',
  cancelled: '已取消',
}

export const RESET_LABELS: Record<TokenResetPeriod, string> = {
  monthly: '每月',
  daily: '每日',
  never: '永不',
}

export const CURRENCIES = ['CNY', 'USD', 'EUR', 'JPY', 'HKD', 'GBP'] as const

export const CURRENCY_SYMBOLS: Record<string, string> = {
  CNY: '¥',
  USD: '$',
  EUR: '€',
  JPY: 'JP¥',
  HKD: 'HK$',
  GBP: '£',
}

export const PAYMENT_METHODS = [
  '支付宝',
  '微信支付',
  '信用卡',
  '借记卡',
  'PayPal',
  'Apple Pay',
  '其他',
] as const

export const BUILTIN_CATEGORIES: Category[] = [
  { id: 'video', name: '视频', builtin: true },
  { id: 'music', name: '音乐', builtin: true },
  { id: 'tool', name: '工具', builtin: true },
  { id: 'ai', name: 'AI服务', builtin: true },
  { id: 'cloud', name: '云存储', builtin: true },
  { id: 'member', name: '会员', builtin: true },
  { id: 'other', name: '其他', builtin: true },
]

export const ACCENT_PRESETS: { key: AccentKey; name: string; color: string }[] = [
  { key: 'blue', name: '飞书蓝', color: '#3370FF' },
  { key: 'green', name: '生机绿', color: '#34A853' },
  { key: 'purple', name: '梦幻紫', color: '#7F3BF5' },
  { key: 'orange', name: '活力橙', color: '#F8801A' },
  { key: 'red', name: '热情红', color: '#F54A45' },
  { key: 'teal', name: '清涟青', color: '#14C0FF' },
]

export const SUB_COLORS = [
  '#3370FF', '#7F3BF5', '#F54A45', '#F8801A', '#FFC60A',
  '#34A853', '#14C0FF', '#E84393', '#1F2329', '#646A73',
  '#E50914', '#1DB954',
] as const

export const EMOJI_CHOICES = [
  '📺', '🎬', '🎵', '🎧', '🎮', '🛠️', '🤖', '✨',
  '☁️', '💾', '👑', '💎', '📚', '📝', '💼', '🚀',
  '🔒', '📷', '🎨', '🧠', '💬', '📦', '🌐', '⭐',
] as const

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accent: 'blue',
  defaultCurrency: 'CNY',
  viewMode: 'grid',
  yearDays: 365,
  dashboardCards: {
    monthly: true,
    yearly: true,
    count: true,
    upcoming: true,
    chart: true,
  },
}

export const EMPTY_AI: AIInfo = {
  endpoint: '',
  apiKey: '',
  tokenTotal: null,
  tokenUsed: null,
  tokenResetPeriod: 'monthly',
  tokenResetDate: '',
}
