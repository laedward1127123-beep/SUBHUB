// ===== 设置 =====
import { useRef } from 'react'
import { Download, Upload, Trash2, RotateCcw, Monitor, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import {
  ACCENT_PRESETS, CURRENCIES,
  type AccentKey, type AppSettings, type ThemeMode,
} from '@/types/subscription'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  settings: AppSettings
  onUpdate: (patch: Partial<AppSettings>) => void
  onExport: () => string
  onImport: (text: string) => number
  onClearAll: () => void
  onResetSamples: () => void
}

const THEMES: { key: ThemeMode; name: string; icon: typeof Sun }[] = [
  { key: 'light', name: '浅色', icon: Sun },
  { key: 'dark', name: '深色', icon: Moon },
  { key: 'system', name: '跟随系统', icon: Monitor },
]

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default function SettingsSection({ settings, onUpdate, onExport, onImport, onClearAll, onResetSamples }: SettingsSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const handleExport = () => {
    const json = onExport()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subhub-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('已导出 JSON 备份文件')
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const n = onImport(String(reader.result))
        toast.success(`成功导入 ${n} 条订阅`)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : '导入失败，请检查文件格式')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-2xl space-y-4">
      {/* 外观 */}
      <Section title="外观" desc="主题模式与强调色，即时生效并记住选择。">
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">主题</Label>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => onUpdate({ theme: t.key })}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm transition-all hover:-translate-y-0.5 active:scale-95',
                    settings.theme === t.key
                      ? 'border-primary bg-primary/10 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-muted',
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block">强调色</Label>
            <div className="flex flex-wrap gap-2.5">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => onUpdate({ accent: p.key as AccentKey })}
                  className="group flex flex-col items-center gap-1"
                  title={p.name}
                >
                  <span
                    className={cn(
                      'h-9 w-9 rounded-full transition-transform group-hover:scale-110 group-active:scale-95',
                      settings.accent === p.key && 'ring-2 ring-foreground/60 ring-offset-2 ring-offset-background',
                    )}
                    style={{ backgroundColor: p.color }}
                  />
                  <span className={cn('text-[11px]', settings.accent === p.key ? 'font-medium' : 'text-muted-foreground')}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 偏好 */}
      <Section title="偏好" desc="默认货币、视图与年度折算方式。">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>默认货币</Label>
            <Select value={settings.defaultCurrency} onValueChange={(v) => onUpdate({ defaultCurrency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>年度折算方式</Label>
            <Select value={String(settings.yearDays)} onValueChange={(v) => onUpdate({ yearDays: Number(v) as 365 | 360 })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="365">按 365 天/年</SelectItem>
                <SelectItem value="360">按 360 天/年</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* 仪表盘卡片开关 */}
      <Section title="仪表盘统计卡片" desc="选择在仪表盘展示哪些统计模块。">
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ['monthly', '月度总支出'],
              ['yearly', '年度总支出'],
              ['count', '订阅总数'],
              ['upcoming', '即将续费提醒'],
              ['chart', '分类支出占比图'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border px-3 py-2.5">
              <Label className="font-normal">{label}</Label>
              <Switch
                checked={settings.dashboardCards[key]}
                onCheckedChange={(v) => onUpdate({ dashboardCards: { ...settings.dashboardCards, [key]: v } })}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* 数据管理 */}
      <Section title="数据管理" desc="所有数据仅保存在本机浏览器 localStorage 中，完全离线可用。">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1.5" onClick={handleExport}>
            <Download className="h-4 w-4" /> 导出 JSON
          </Button>
          <Button variant="outline" className="gap-1.5" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> 导入 JSON
          </Button>
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              onResetSamples()
              toast.success('已恢复为示例数据')
            }}
          >
            <RotateCcw className="h-4 w-4" /> 恢复示例数据
          </Button>
          <Button variant="destructive" className="gap-1.5" onClick={() => setConfirmClear(true)}>
            <Trash2 className="h-4 w-4" /> 清空全部数据
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleImportFile(f)
            e.target.value = ''
          }}
        />
      </Section>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>清空全部数据？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除所有订阅记录（分类与设置保留）。此操作不可撤销，建议先导出 JSON 备份。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onClearAll()
                toast.success('已清空全部订阅数据')
                setConfirmClear(false)
              }}
            >
              确认清空
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
