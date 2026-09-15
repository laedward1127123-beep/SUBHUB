// ===== 分类管理 Hook（内置 + 自定义） =====
import { useLocalStorage } from './useLocalStorage'
import { BUILTIN_CATEGORIES, type Category } from '@/types/subscription'

const CATEGORY_KEY = 'subhub.categories'

export function useCategories() {
  const [customCategories, setCustom] = useLocalStorage<Category[]>(CATEGORY_KEY, [])

  const categories: Category[] = [...BUILTIN_CATEGORIES, ...customCategories]

  const addCategory = (name: string): Category | null => {
    const trimmed = name.trim()
    if (!trimmed) return null
    if (categories.some((c) => c.name === trimmed)) return null
    const cat: Category = { id: `cat_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: trimmed, builtin: false }
    setCustom((prev) => [...prev, cat])
    return cat
  }

  /** 删除自定义分类；返回被删除的 id（调用方负责把订阅归到「其他」） */
  const removeCategory = (id: string): string | null => {
    const target = customCategories.find((c) => c.id === id)
    if (!target) return null
    setCustom((prev) => prev.filter((c) => c.id !== id))
    return id
  }

  const categoryName = (id: string): string => categories.find((c) => c.id === id)?.name ?? '其他'

  return { categories, customCategories, addCategory, removeCategory, categoryName }
}
