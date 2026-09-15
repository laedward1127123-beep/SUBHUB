// ===== 全局设置 Hook（主题 / 强调色 / 货币 / 视图等） =====
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { DEFAULT_SETTINGS, type AppSettings } from '@/types/subscription'

const SETTINGS_KEY = 'subhub.settings'

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS)

  const update = (patch: Partial<AppSettings>) => setSettings((prev) => ({ ...prev, ...patch }))

  // 应用主题（浅色/深色/跟随系统）
  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = settings.theme === 'dark' || (settings.theme === 'system' && prefersDark)
      root.classList.toggle('dark', dark)
    }
    apply()
    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [settings.theme])

  // 应用强调色（CSS 变量切换）
  useEffect(() => {
    document.documentElement.dataset.accent = settings.accent
  }, [settings.accent])

  return { settings, update }
}
