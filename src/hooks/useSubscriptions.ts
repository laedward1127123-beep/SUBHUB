// ===== 订阅数据 Hook（CRUD + 示例数据 + 导入导出） =====
import { useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { toISODate, addCycle } from '@/lib/billing'
import type { Subscription } from '@/types/subscription'

const SUBS_KEY = 'subhub.subscriptions'

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

function daysAhead(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return toISODate(d)
}

/** 首次启动内置的示例订阅数据 */
function seedSubscriptions(): Subscription[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'seed-netflix',
      name: 'Netflix 标准版',
      categoryId: 'video',
      amount: 68,
      currency: 'CNY',
      cycle: 'monthly',
      customDays: null,
      startDate: daysAgo(12),
      paymentMethod: '信用卡',
      notes: '与家人共享账号',
      tags: ['流媒体', '4K'],
      status: 'active',
      isTrial: false,
      trialEndDate: '',
      isAI: false,
      ai: null,
      color: '#E50914',
      iconType: 'svg',
      icon: 'tv',
      createdAt: now,
    },
    {
      id: 'seed-spotify',
      name: 'Spotify Premium',
      categoryId: 'music',
      amount: 6.99,
      currency: 'USD',
      cycle: 'monthly',
      customDays: null,
      startDate: daysAgo(5),
      paymentMethod: 'PayPal',
      notes: '',
      tags: ['音乐'],
      status: 'active',
      isTrial: false,
      trialEndDate: '',
      isAI: false,
      ai: null,
      color: '#1DB954',
      iconType: 'svg',
      icon: 'music',
      createdAt: now,
    },
    {
      id: 'seed-icloud',
      name: 'iCloud+ 200GB',
      categoryId: 'cloud',
      amount: 21,
      currency: 'CNY',
      cycle: 'monthly',
      customDays: null,
      startDate: daysAgo(20),
      paymentMethod: 'Apple Pay',
      notes: '照片备份',
      tags: ['苹果'],
      status: 'active',
      isTrial: false,
      trialEndDate: '',
      isAI: false,
      ai: null,
      color: '#14C0FF',
      iconType: 'svg',
      icon: 'cloud',
      createdAt: now,
    },
    {
      id: 'seed-chatgpt',
      name: 'ChatGPT Plus',
      categoryId: 'ai',
      amount: 20,
      currency: 'USD',
      cycle: 'monthly',
      customDays: null,
      startDate: daysAgo(8),
      paymentMethod: '信用卡',
      notes: '工作主力 AI',
      tags: ['AI', '办公'],
      status: 'active',
      isTrial: false,
      trialEndDate: '',
      isAI: true,
      ai: {
        endpoint: 'https://api.openai.com/v1',
        apiKey: 'sk-demo-8f3k2jd92ks01mcxz74hfd0a',
        tokenTotal: 1000000,
        tokenUsed: 386400,
        tokenResetPeriod: 'monthly',
        tokenResetDate: toISODate(addCycle(new Date(), 'monthly', null)),
      },
      color: '#10A37F',
      iconType: 'svg',
      icon: 'robot',
      createdAt: now,
    },
    {
      id: 'seed-copilot',
      name: 'GitHub Copilot',
      categoryId: 'ai',
      amount: 100,
      currency: 'CNY',
      cycle: 'yearly',
      customDays: null,
      startDate: daysAgo(120),
      paymentMethod: '支付宝',
      notes: '学生优惠',
      tags: ['AI', '编程'],
      status: 'active',
      isTrial: false,
      trialEndDate: '',
      isAI: true,
      ai: {
        endpoint: 'https://api.githubcopilot.com',
        apiKey: 'ghp_demo1a2b3c4d5e6f7g8h9i0j',
        tokenTotal: null,
        tokenUsed: null,
        tokenResetPeriod: 'never',
        tokenResetDate: '',
      },
      color: '#1F2329',
      iconType: 'svg',
      icon: 'code',
      createdAt: now,
    },
    {
      id: 'seed-lark',
      name: '飞书会员',
      categoryId: 'member',
      amount: 25,
      currency: 'CNY',
      cycle: 'monthly',
      customDays: null,
      startDate: daysAgo(3),
      paymentMethod: '微信支付',
      notes: '',
      tags: ['办公', '协作'],
      status: 'active',
      isTrial: true,
      trialEndDate: daysAhead(11),
      isAI: false,
      ai: null,
      color: '#3370FF',
      iconType: 'svg',
      icon: 'chat',
      createdAt: now,
    },
    {
      id: 'seed-notion',
      name: 'Notion Plus',
      categoryId: 'tool',
      amount: 96,
      currency: 'USD',
      cycle: 'yearly',
      customDays: null,
      startDate: daysAgo(200),
      paymentMethod: '信用卡',
      notes: '个人知识库',
      tags: ['笔记'],
      status: 'paused',
      isTrial: false,
      trialEndDate: '',
      isAI: false,
      ai: null,
      color: '#646A73',
      iconType: 'svg',
      icon: 'doc',
      createdAt: now,
    },
    {
      id: 'seed-bilibili',
      name: '哔哩哔哩大会员',
      categoryId: 'video',
      amount: 148,
      currency: 'CNY',
      cycle: 'yearly',
      customDays: null,
      startDate: daysAgo(45),
      paymentMethod: '支付宝',
      notes: '',
      tags: ['视频'],
      status: 'cancelled',
      isTrial: false,
      trialEndDate: '',
      isAI: false,
      ai: null,
      color: '#FB7299',
      iconType: 'svg',
      icon: 'play',
      createdAt: now,
    },
  ]
}

export function uid(): string {
  return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** 旧数据迁移：无 iconType 字段的订阅视为 emoji 图标 */
function migrateSubscription(s: Subscription): Subscription {
  if (s.iconType === 'emoji' || s.iconType === 'svg' || s.iconType === 'image') return s
  return { ...s, iconType: 'emoji' }
}

export function useSubscriptions() {
  const [raw, setSubscriptions, removeStorage] = useLocalStorage<Subscription[]>(
    SUBS_KEY,
    seedSubscriptions(),
  )

  // 读取时迁移旧数据（localStorage 中纯 emoji 字符串图标）
  const subscriptions = useMemo(() => raw.map(migrateSubscription), [raw])

  const addSubscription = (sub: Omit<Subscription, 'id' | 'createdAt'>) => {
    const full: Subscription = { ...sub, id: uid(), createdAt: new Date().toISOString() }
    setSubscriptions((prev) => [full, ...prev])
    return full
  }

  const updateSubscription = (id: string, patch: Partial<Subscription>) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }

  /** 分类被删除时，把该分类下的订阅归到「其他」 */
  const reassignCategory = (fromId: string, toId = 'other') => {
    setSubscriptions((prev) => prev.map((s) => (s.categoryId === fromId ? { ...s, categoryId: toId } : s)))
  }

  const clearAll = () => setSubscriptions([])

  const exportJSON = (): string =>
    JSON.stringify({ app: 'SubHub', version: 1, exportedAt: new Date().toISOString(), subscriptions }, null, 2)

  /** 导入 JSON，返回订阅条数；失败抛错 */
  const importJSON = (text: string): number => {
    const parsed = JSON.parse(text) as unknown
    const list = Array.isArray(parsed)
      ? parsed
      : (parsed as { subscriptions?: unknown[] })?.subscriptions
    if (!Array.isArray(list)) throw new Error('文件格式不正确：未找到订阅数组')
    const valid = list.filter(
      (s): s is Subscription =>
        !!s && typeof s === 'object' && typeof (s as Subscription).name === 'string' &&
        typeof (s as Subscription).amount === 'number',
    )
    if (valid.length === 0) throw new Error('文件中没有可用的订阅数据')
    setSubscriptions(valid.map(migrateSubscription))
    return valid.length
  }

  const resetToSamples = () => {
    removeStorage()
    setSubscriptions(seedSubscriptions())
  }

  return {
    subscriptions,
    setSubscriptions,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    reassignCategory,
    clearAll,
    exportJSON,
    importJSON,
    resetToSamples,
  }
}
