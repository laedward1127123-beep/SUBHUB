// ===== 手绘图标集索引 =====
import type { ComponentType } from 'react'
import {
  IconPlay, IconTv, IconMusic, IconHeadphone, IconCloud, IconRobot, IconCode,
  IconPalette, IconDoc, IconBook, IconNews, IconGame, IconFitness, IconTea,
  IconShopping, IconPlane, IconStudy, IconWallet, IconChat, IconCamera, IconMail,
  IconCalendar, IconCrown, IconStar, IconShield, IconPet, IconGift, IconBulb,
  IconRocket, IconCoffee, IconHeart, IconQuestion,
  type HanddrawnIconProps,
} from './handdrawn'

export interface IconEntry {
  id: string
  name: string
  Component: ComponentType<HanddrawnIconProps>
}

export const ICON_SET: IconEntry[] = [
  { id: 'play', name: '视频播放', Component: IconPlay },
  { id: 'tv', name: '电视', Component: IconTv },
  { id: 'music', name: '音乐', Component: IconMusic },
  { id: 'headphone', name: '耳机', Component: IconHeadphone },
  { id: 'cloud', name: '云存储', Component: IconCloud },
  { id: 'robot', name: 'AI机器人', Component: IconRobot },
  { id: 'code', name: '代码开发', Component: IconCode },
  { id: 'palette', name: '设计工具', Component: IconPalette },
  { id: 'doc', name: '办公文档', Component: IconDoc },
  { id: 'book', name: '阅读书籍', Component: IconBook },
  { id: 'news', name: '新闻资讯', Component: IconNews },
  { id: 'game', name: '游戏', Component: IconGame },
  { id: 'fitness', name: '健身运动', Component: IconFitness },
  { id: 'tea', name: '奶茶美食', Component: IconTea },
  { id: 'shopping', name: '购物', Component: IconShopping },
  { id: 'plane', name: '出行旅行', Component: IconPlane },
  { id: 'study', name: '教育学习', Component: IconStudy },
  { id: 'wallet', name: '理财钱包', Component: IconWallet },
  { id: 'chat', name: '社交聊天', Component: IconChat },
  { id: 'camera', name: '相机相册', Component: IconCamera },
  { id: 'mail', name: '邮箱邮件', Component: IconMail },
  { id: 'calendar', name: '日历日程', Component: IconCalendar },
  { id: 'crown', name: '会员皇冠', Component: IconCrown },
  { id: 'star', name: '星星收藏', Component: IconStar },
  { id: 'shield', name: '安全盾牌', Component: IconShield },
  { id: 'pet', name: '宠物', Component: IconPet },
  { id: 'gift', name: '礼品', Component: IconGift },
  { id: 'bulb', name: '灯泡灵感', Component: IconBulb },
  { id: 'rocket', name: '火箭', Component: IconRocket },
  { id: 'coffee', name: '咖啡', Component: IconCoffee },
  { id: 'heart', name: '爱心', Component: IconHeart },
  { id: 'question', name: '默认问号', Component: IconQuestion },
]

export const ICON_MAP: Record<string, ComponentType<HanddrawnIconProps>> = Object.fromEntries(
  ICON_SET.map((e) => [e.id, e.Component]),
)

export function getIconComponent(id: string): ComponentType<HanddrawnIconProps> {
  return ICON_MAP[id] ?? IconQuestion
}
