// ===== 订阅图标统一渲染：emoji / 内置手绘 SVG / 自定义圆形图片 =====
import { getIconComponent } from '@/components/icons'
import type { IconType } from '@/types/subscription'
import { cn } from '@/lib/utils'

interface SubIconProps {
  iconType?: IconType
  icon: string
  /** 图标内容大小（px） */
  size?: number
  /** 外层容器边长（px） */
  box?: number
  /** 卡片主题色（用于 emoji/svg 的浅色底） */
  color?: string
  className?: string
}

export default function SubIcon({ iconType = 'emoji', icon, size = 20, box = 40, color, className }: SubIconProps) {
  if (iconType === 'image' && icon) {
    return (
      <img
        src={icon}
        alt=""
        draggable={false}
        className={cn('shrink-0 rounded-full object-cover', className)}
        style={{ width: box, height: box }}
      />
    )
  }
  const inner =
    iconType === 'svg' ? (
      (() => {
        const C = getIconComponent(icon)
        return <C size={size} />
      })()
    ) : (
      <span style={{ fontSize: size, lineHeight: 1 }}>{icon}</span>
    )
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-lg', className)}
      style={{ width: box, height: box, backgroundColor: color ? `${color}1A` : 'hsl(var(--muted))' }}
    >
      {inner}
    </div>
  )
}
