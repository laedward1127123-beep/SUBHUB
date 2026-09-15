// ===== 新建 / 编辑订阅表单（Dialog） =====
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Copy, Sparkles, Upload, RefreshCw, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ICON_SET } from '@/components/icons'
import SubIcon from '@/components/SubIcon'
import ImageCropDialog from '@/components/ImageCropDialog'
import {
  CURRENCIES, CYCLE_LABELS, EMOJI_CHOICES, EMPTY_AI, PAYMENT_METHODS,
  RESET_LABELS, STATUS_LABELS, SUB_COLORS,
  type BillingCycle, type Category, type IconType, type SubStatus, type Subscription, type TokenResetPeriod,
} from '@/types/subscription'
import { nextRenewalDate } from '@/lib/billing'
import { cn } from '@/lib/utils'

interface SubscriptionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: Subscription | null
  categories: Category[]
  defaultCurrency: string
  onSubmit: (data: Omit<Subscription, 'id' | 'createdAt'>) => void
}

interface FormState {
  name: string
  categoryId: string
  amount: string
  currency: string
  cycle: BillingCycle
  customDays: string
  startDate: string
  paymentMethod: string
  notes: string
  tags: string
  status: SubStatus
  isTrial: boolean
  trialEndDate: string
  isAI: boolean
  aiEndpoint: string
  aiApiKey: string
  aiTokenTotal: string
  aiTokenUsed: string
  aiResetPeriod: TokenResetPeriod
  aiResetDate: string
  color: string
  iconType: IconType
  icon: string
}

function blankState(defaultCurrency: string): FormState {
  return {
    name: '',
    categoryId: 'video',
    amount: '',
    currency: defaultCurrency,
    cycle: 'monthly',
    customDays: '30',
    startDate: new Date().toISOString().slice(0, 10),
    paymentMethod: '支付宝',
    notes: '',
    tags: '',
    status: 'active',
    isTrial: false,
    trialEndDate: '',
    isAI: false,
    aiEndpoint: '',
    aiApiKey: '',
    aiTokenTotal: '',
    aiTokenUsed: '',
    aiResetPeriod: 'monthly',
    aiResetDate: '',
    color: SUB_COLORS[0],
    iconType: 'svg',
    icon: 'question',
  }
}

function fromSubscription(s: Subscription): FormState {
  return {
    name: s.name,
    categoryId: s.categoryId,
    amount: String(s.amount),
    currency: s.currency,
    cycle: s.cycle,
    customDays: String(s.customDays ?? 30),
    startDate: s.startDate,
    paymentMethod: s.paymentMethod,
    notes: s.notes,
    tags: s.tags.join(', '),
    status: s.status,
    isTrial: s.isTrial,
    trialEndDate: s.trialEndDate,
    isAI: s.isAI,
    aiEndpoint: s.ai?.endpoint ?? '',
    aiApiKey: s.ai?.apiKey ?? '',
    aiTokenTotal: s.ai?.tokenTotal != null ? String(s.ai.tokenTotal) : '',
    aiTokenUsed: s.ai?.tokenUsed != null ? String(s.ai.tokenUsed) : '',
    aiResetPeriod: s.ai?.tokenResetPeriod ?? 'monthly',
    aiResetDate: s.ai?.tokenResetDate ?? '',
    color: s.color,
    iconType: s.iconType ?? 'emoji',
    icon: s.icon,
  }
}

export default function SubscriptionForm({ open, onOpenChange, editing, categories, defaultCurrency, onSubmit }: SubscriptionFormProps) {
  const [form, setForm] = useState<FormState>(() => blankState(defaultCurrency))
  const [showKey, setShowKey] = useState(false)
  const [iconTab, setIconTab] = useState<IconType>('svg')
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setForm(editing ? fromSubscription(editing) : blankState(defaultCurrency))
      setShowKey(false)
      setIconTab(editing?.iconType ?? 'svg')
      setCropSrc(null)
    }
  }, [open, editing, defaultCurrency])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const previewRenewal = useMemo(() => {
    if (!form.startDate) return ''
    try {
      return nextRenewalDate({
        startDate: form.startDate,
        cycle: form.cycle,
        customDays: form.cycle === 'custom' ? Number(form.customDays) || 30 : null,
      })
    } catch {
      return ''
    }
  }, [form.startDate, form.cycle, form.customDays])

  const handleCategoryChange = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categoryId: id,
      isAI: id === 'ai' ? true : prev.categoryId === 'ai' ? false : prev.isAI,
    }))
  }

  const handleSubmit = () => {
    const amount = Number(form.amount)
    if (!form.name.trim()) {
      toast.error('请填写订阅名称')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('请填写正确的金额')
      return
    }
    if (!form.startDate) {
      toast.error('请选择起付日期')
      return
    }
    if (form.cycle === 'custom' && (!Number(form.customDays) || Number(form.customDays) < 1)) {
      toast.error('自定义周期的天数至少为 1')
      return
    }
    const isAI = form.isAI || form.categoryId === 'ai'
    onSubmit({
      name: form.name.trim(),
      categoryId: form.categoryId,
      amount,
      currency: form.currency,
      cycle: form.cycle,
      customDays: form.cycle === 'custom' ? Number(form.customDays) : null,
      startDate: form.startDate,
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
      tags: form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      status: form.status,
      isTrial: form.isTrial,
      trialEndDate: form.isTrial ? form.trialEndDate : '',
      isAI,
      ai: isAI
        ? {
            ...EMPTY_AI,
            endpoint: form.aiEndpoint.trim(),
            apiKey: form.aiApiKey.trim(),
            tokenTotal: form.aiTokenTotal ? Number(form.aiTokenTotal) : null,
            tokenUsed: form.aiTokenUsed ? Number(form.aiTokenUsed) : null,
            tokenResetPeriod: form.aiResetPeriod,
            tokenResetDate: form.aiResetDate,
          }
        : null,
      color: form.color,
      iconType: form.iconType,
      icon: form.icon,
    })
    onOpenChange(false)
    toast.success(editing ? '订阅已更新' : '订阅已创建')
  }

  const fieldCls = 'grid gap-1.5'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{editing ? '编辑订阅' : '新建订阅'}</DialogTitle>
          <DialogDescription>填写订阅的详细信息，带 * 为必填项。</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* 名称 + 图标 */}
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <div className={fieldCls}>
              <Label>名称 *</Label>
              <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="如 Netflix、ChatGPT Plus" />
            </div>
            <SubIcon iconType={form.iconType} icon={form.icon} size={20} box={36} color={form.color} />
          </div>

          {/* 分类 + 状态 */}
          <div className="grid grid-cols-2 gap-3">
            <div className={fieldCls}>
              <Label>分类</Label>
              <Select value={form.categoryId} onValueChange={handleCategoryChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldCls}>
              <Label>状态</Label>
              <Select value={form.status} onValueChange={(v) => set('status', v as SubStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_LABELS) as SubStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 金额 + 货币 + 周期 */}
          <div className="grid grid-cols-3 gap-3">
            <div className={fieldCls}>
              <Label>金额 *</Label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={(e) => set('amount', e.target.value)} placeholder="0.00" />
            </div>
            <div className={fieldCls}>
              <Label>货币</Label>
              <Select value={form.currency} onValueChange={(v) => set('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={fieldCls}>
              <Label>计费周期</Label>
              <Select value={form.cycle} onValueChange={(v) => set('cycle', v as BillingCycle)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CYCLE_LABELS) as BillingCycle[]).map((c) => (
                    <SelectItem key={c} value={c}>{CYCLE_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.cycle === 'custom' && (
            <div className={fieldCls}>
              <Label>自定义周期（天数）</Label>
              <Input type="number" min="1" value={form.customDays} onChange={(e) => set('customDays', e.target.value)} />
            </div>
          )}

          {/* 起付日期 + 下次续费推算 + 支付方式 */}
          <div className="grid grid-cols-2 gap-3">
            <div className={fieldCls}>
              <Label>起付日期 *</Label>
              <Input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
              {previewRenewal && (
                <p className="text-xs text-muted-foreground">下次续费（自动推算）：{previewRenewal}</p>
              )}
            </div>
            <div className={fieldCls}>
              <Label>支付方式</Label>
              <Select value={form.paymentMethod} onValueChange={(v) => set('paymentMethod', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 试用 */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label>试用期</Label>
              <p className="text-xs text-muted-foreground">开启后可设置试用结束日期</p>
            </div>
            <Switch checked={form.isTrial} onCheckedChange={(v) => set('isTrial', v)} />
          </div>
          {form.isTrial && (
            <div className={fieldCls}>
              <Label>试用结束日期</Label>
              <Input type="date" value={form.trialEndDate} onChange={(e) => set('trialEndDate', e.target.value)} />
            </div>
          )}

          {/* AI 订阅开关 */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <div>
                <Label>这是 AI 订阅</Label>
                <p className="text-xs text-muted-foreground">可填写 API 地址、Key 与 Token 额度信息</p>
              </div>
            </div>
            <Switch checked={form.isAI || form.categoryId === 'ai'} onCheckedChange={(v) => set('isAI', v)} disabled={form.categoryId === 'ai'} />
          </div>

          {/* AI 扩展信息 */}
          {(form.isAI || form.categoryId === 'ai') && (
            <div className="grid gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" /> AI 服务扩展信息
              </p>
              <div className={fieldCls}>
                <Label>API 接口地址</Label>
                <Input value={form.aiEndpoint} onChange={(e) => set('aiEndpoint', e.target.value)} placeholder="https://api.example.com/v1" />
              </div>
              <div className={fieldCls}>
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    value={form.aiApiKey}
                    onChange={(e) => set('aiApiKey', e.target.value)}
                    placeholder="sk-..."
                    className="font-mono"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={() => setShowKey((v) => !v)} title={showKey ? '隐藏' : '显示'}>
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="复制"
                    onClick={() => {
                      if (form.aiApiKey) {
                        navigator.clipboard.writeText(form.aiApiKey).then(() => toast.success('API Key 已复制'))
                      }
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={fieldCls}>
                  <Label>Token 总额度</Label>
                  <Input type="number" min="0" value={form.aiTokenTotal} onChange={(e) => set('aiTokenTotal', e.target.value)} placeholder="如 1000000" />
                </div>
                <div className={fieldCls}>
                  <Label>已用额度</Label>
                  <Input type="number" min="0" value={form.aiTokenUsed} onChange={(e) => set('aiTokenUsed', e.target.value)} placeholder="如 386400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className={fieldCls}>
                  <Label>额度重置周期</Label>
                  <Select value={form.aiResetPeriod} onValueChange={(v) => set('aiResetPeriod', v as TokenResetPeriod)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(RESET_LABELS) as TokenResetPeriod[]).map((r) => (
                        <SelectItem key={r} value={r}>{RESET_LABELS[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.aiResetPeriod !== 'never' && (
                  <div className={fieldCls}>
                    <Label>下次额度重置日期</Label>
                    <Input type="date" value={form.aiResetDate} onChange={(e) => set('aiResetDate', e.target.value)} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 标签 + 备注 */}
          <div className={fieldCls}>
            <Label>标签（逗号分隔）</Label>
            <Input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="如：流媒体, 4K" />
          </div>
          <div className={fieldCls}>
            <Label>备注</Label>
            <Textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="其他需要记录的信息" rows={2} />
          </div>

          {/* 颜色 */}
          <div className={fieldCls}>
            <Label>卡片颜色</Label>
            <div className="flex flex-wrap gap-2">
              {SUB_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('color', c)}
                  className={cn(
                    'h-7 w-7 rounded-full transition-transform hover:scale-110 active:scale-95',
                    form.color === c && 'ring-2 ring-foreground/60 ring-offset-2 ring-offset-background',
                  )}
                  style={{ backgroundColor: c }}
                  aria-label={`颜色 ${c}`}
                />
              ))}
            </div>
          </div>

          {/* 图标：手绘 SVG / Emoji / 上传图片 */}
          <div className={fieldCls}>
            <Label>图标</Label>
            <Tabs value={iconTab} onValueChange={(v) => setIconTab(v as IconType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="svg">手绘图标</TabsTrigger>
                <TabsTrigger value="emoji">Emoji</TabsTrigger>
                <TabsTrigger value="image">上传图片</TabsTrigger>
              </TabsList>

              {/* 手绘 SVG 图标网格 */}
              <TabsContent value="svg">
                <div className="grid grid-cols-8 gap-1.5 pt-1">
                  {ICON_SET.map((entry, i) => (
                    <motion.button
                      key={entry.id}
                      type="button"
                      title={entry.name}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.18, delay: Math.min(i * 0.015, 0.45) }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        set('iconType', 'svg')
                        set('icon', entry.id)
                      }}
                      className={cn(
                        'flex aspect-square items-center justify-center rounded-lg border',
                        form.iconType === 'svg' && form.icon === entry.id
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent bg-muted hover:bg-muted/70',
                      )}
                    >
                      <entry.Component size={22} />
                    </motion.button>
                  ))}
                </div>
              </TabsContent>

              {/* Emoji 网格 */}
              <TabsContent value="emoji">
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {EMOJI_CHOICES.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        set('iconType', 'emoji')
                        set('icon', e)
                      }}
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-md border text-lg transition-transform hover:scale-110 active:scale-95',
                        form.iconType === 'emoji' && form.icon === e ? 'border-primary bg-primary/10' : 'border-transparent bg-muted',
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* 上传图片 + 圆形裁剪 */}
              <TabsContent value="image">
                <div className="flex items-center gap-4 pt-1">
                  {form.iconType === 'image' && form.icon.startsWith('data:') ? (
                    <>
                      <img
                        src={form.icon}
                        alt="自定义图标"
                        className="h-16 w-16 shrink-0 rounded-full border object-cover"
                      />
                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()}>
                          <RefreshCw className="h-3.5 w-3.5" /> 重新上传
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          onClick={() => {
                            set('iconType', 'svg')
                            set('icon', 'question')
                            toast.success('已移除自定义图标')
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> 移除
                        </Button>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex h-24 w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Upload className="h-5 w-5" />
                      <span className="text-xs">选择本地图片（≤ 5MB），选择后可圆形裁剪</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    e.target.value = ''
                    if (!f) return
                    if (f.size > 5 * 1024 * 1024) {
                      toast.error('图片大小不能超过 5MB')
                      return
                    }
                    const reader = new FileReader()
                    reader.onload = () => setCropSrc(String(reader.result))
                    reader.readAsDataURL(f)
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleSubmit}>{editing ? '保存修改' : '创建订阅'}</Button>
        </div>
      </DialogContent>

      {/* 圆形裁剪对话框 */}
      <ImageCropDialog
        open={!!cropSrc}
        imageSrc={cropSrc ?? ''}
        onConfirm={(dataUrl) => {
          set('iconType', 'image')
          set('icon', dataUrl)
          setCropSrc(null)
          toast.success('图标已裁剪并应用')
        }}
        onCancel={() => setCropSrc(null)}
      />
    </Dialog>
  )
}
