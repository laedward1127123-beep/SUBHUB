// ===== 手绘风 SVG 图标集（参考 iconfont cid=54553「可爱类图标终篇」风格） =====
// 风格：暖棕粗描边 #4A3B36、round linecap/join、马卡龙平涂填充、圆润造型、极简五官与红晕
import type { ReactNode } from 'react'

export interface HanddrawnIconProps {
  size?: number
  className?: string
}

const S = '#4A3B36' // 统一描边色（深暖棕）

function Base({ size = 24, className, children }: HanddrawnIconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke={S}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

// 常用小元素
const eye = (cx: number, cy: number, r = 1.7) => (
  <circle cx={cx} cy={cy} r={r} fill={S} stroke="none" />
)
const blush = (cx: number, cy: number) => (
  <ellipse cx={cx} cy={cy} rx={2.1} ry={1.4} fill="#FF9DAF" opacity={0.55} stroke="none" />
)
const smile = (x: number, y: number, w = 4) => (
  <path d={`M${x - w / 2} ${y} Q${x} ${y + 2.2} ${x + w / 2} ${y}`} />
)

// 1. 视频播放
export function IconPlay(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={7} y={10} width={34} height={28} rx={9} fill="#BEE0F2" />
      <path d="M20 18.5 L31 24 L20 29.5 Z" fill="#FF8FA3" />
      <circle cx={13} cy={16} r={1.4} fill="#fff" opacity={0.8} stroke="none" />
    </Base>
  )
}

// 2. 电视
export function IconTv(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M18 11 L13.5 4.5" />
      <path d="M30 11 L34.5 4.5" />
      <circle cx={13} cy={4.5} r={1.6} fill="#FF8FA3" stroke="none" />
      <circle cx={35} cy={4.5} r={1.6} fill="#BEE0F2" stroke="none" />
      <rect x={6} y={11} width={36} height={27} rx={8} fill="#FFE3B3" />
      <rect x={11} y={16} width={26} height={17} rx={5} fill="#FFFDF8" />
      {eye(20, 24.5, 1.6)}{eye(28, 24.5, 1.6)}
      {smile(24, 27.8)}
      {blush(15.8, 27.5)}{blush(32.2, 27.5)}
      <path d="M16 38.5 v3" />
      <path d="M32 38.5 v3" />
    </Base>
  )
}

// 3. 音乐
export function IconMusic(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <circle cx={15.5} cy={33} r={5.5} fill="#FFD1DC" />
      <circle cx={33.5} cy={29} r={5.5} fill="#E3D7FA" />
      <path d="M21 33 V13.5" />
      <path d="M39 29 V9.5" />
      <path d="M21 13.5 C27 11.3 33 10.7 39 9.5" />
    </Base>
  )
}

// 4. 耳机
export function IconHeadphone(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M10 31 C10 17 15 11 24 11 C33 11 38 17 38 31" />
      <rect x={6.5} y={28} width={9} height={13} rx={4.5} fill="#FFD1DC" />
      <rect x={32.5} y={28} width={9} height={13} rx={4.5} fill="#E3D7FA" />
    </Base>
  )
}

// 5. 云存储
export function IconCloud(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M13.5 36 C8.5 36 5 32.6 5 28.4 C5 24.4 8.4 21.2 12.8 21 C13.9 15.2 18.9 11 24.8 11 C31.3 11 36.2 15.7 36.6 21.6 C40.4 22.2 43 25.4 43 29.1 C43 33 39.9 36 35.8 36 Z"
        fill="#BEE0F2"
      />
      {eye(19, 27, 1.6)}{eye(29, 27, 1.6)}
      {smile(24, 30.3)}
      {blush(14.2, 29.8)}{blush(33.8, 29.8)}
    </Base>
  )
}

// 6. AI 机器人
export function IconRobot(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M24 13 V7.5" />
      <circle cx={24} cy={5.5} r={2.2} fill="#FFCBA8" />
      <rect x={5.5} y={21} width={4.5} height={9} rx={2.2} fill="#FFD1DC" />
      <rect x={38} y={21} width={4.5} height={9} rx={2.2} fill="#FFD1DC" />
      <rect x={10} y={13} width={28} height={23} rx={9} fill="#E3D7FA" />
      <circle cx={19} cy={24} r={3.2} fill="#FFFDF8" />
      <circle cx={29} cy={24} r={3.2} fill="#FFFDF8" />
      {eye(19, 24, 1.4)}{eye(29, 24, 1.4)}
      {smile(24, 30)}
    </Base>
  )
}

// 7. 代码开发
export function IconCode(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={6} y={9} width={36} height={30} rx={7} fill="#C9E7C0" />
      <path d="M10.5 15.5 H37.5" />
      <circle cx={11.5} cy={12.5} r={1.3} fill={S} stroke="none" />
      <circle cx={15.8} cy={12.5} r={1.3} fill={S} stroke="none" />
      <path d="M17.5 22 L13 26 L17.5 30" />
      <path d="M30.5 22 L35 26 L30.5 30" />
      <path d="M25.5 21.5 L22.5 30.5" />
    </Base>
  )
}

// 8. 设计工具
export function IconPalette(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 7.5 C14.6 7.5 7 14.7 7 23.8 C7 33 14.4 40.5 23.2 40.5 C25.8 40.5 27.3 38.6 26.3 36.4 C25.3 34.2 27 31.8 29.6 31.8 L33.8 31.8 C38.6 31.8 41 27.8 41 23.3 C41 14.2 33.4 7.5 24 7.5 Z"
        fill="#FFCBA8"
      />
      <circle cx={16} cy={17.5} r={2.6} fill="#FFD1DC" />
      <circle cx={24.5} cy={15} r={2.6} fill="#BEE0F2" />
      <circle cx={32.5} cy={20.5} r={2.6} fill="#C9E7C0" />
      <circle cx={14.5} cy={26} r={2.6} fill="#E3D7FA" />
    </Base>
  )
}

// 9. 办公文档
export function IconDoc(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={12} y={6} width={24} height={36} rx={3.5} fill="#FFFDF8" />
      <path d="M28 6.5 L35.5 14 H28 Z" fill="#BEE0F2" />
      <path d="M17.5 21.5 H30.5" />
      <path d="M17.5 27 H30.5" />
      <path d="M17.5 32.5 H26" />
    </Base>
  )
}

// 10. 阅读书籍
export function IconBook(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M8 12.5 C13.5 9.5 19.5 9.5 24 12.5 C28.5 9.5 34.5 9.5 40 12.5 V34 C34.5 31 28.5 31 24 34 C19.5 31 13.5 31 8 34 Z"
        fill="#FFE3B3"
      />
      <path d="M24 12.5 V34" />
      <path d="M12 17.5 C14.5 16.5 17 16.5 19.5 17.5" />
      <path d="M28.5 17.5 C31 16.5 33.5 16.5 36 17.5" />
    </Base>
  )
}

// 11. 新闻资讯
export function IconNews(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={6} y={12} width={30} height={26} rx={4} fill="#FFFDF8" />
      <path d="M36 17 H40.5 A2.5 2.5 0 0 1 43 19.5 V38 H36" fill="#E3D7FA" />
      <rect x={10.5} y={16.5} width={10} height={7} rx={2} fill="#FFD1DC" />
      <path d="M24.5 18.5 H31.5" />
      <path d="M24.5 22.5 H31.5" />
      <path d="M10.5 28.5 H31.5" />
      <path d="M10.5 33 H31.5" />
    </Base>
  )
}

// 12. 游戏
export function IconGame(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M15 17.5 H33 C38.5 17.5 42 21.5 42 26.5 C42 31.8 39.2 35 36 35 C33.4 35 32.1 33.3 30.5 31.5 H17.5 C15.9 33.3 14.6 35 12 35 C8.8 35 6 31.8 6 26.5 C6 21.5 9.5 17.5 15 17.5 Z"
        fill="#E3D7FA"
      />
      <path d="M12.5 24.5 H19.5" />
      <path d="M16 21 V28" />
      <circle cx={31.5} cy={23} r={2.2} fill="#FFD1DC" />
      <circle cx={35.5} cy={27.5} r={2.2} fill="#FFE3B3" />
    </Base>
  )
}

// 13. 健身运动
export function IconFitness(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={3.5} y={20} width={3.5} height={8} rx={1.7} fill="#FFD1DC" />
      <rect x={41} y={20} width={3.5} height={8} rx={1.7} fill="#FFD1DC" />
      <rect x={7} y={16.5} width={7} height={15} rx={3.5} fill="#BEE0F2" />
      <rect x={34} y={16.5} width={7} height={15} rx={3.5} fill="#BEE0F2" />
      <path d="M14 24 H34" />
    </Base>
  )
}

// 14. 奶茶美食
export function IconTea(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M12.5 15 C12.5 12 17.5 10.5 24 10.5 C30.5 10.5 35.5 12 35.5 15" />
      <path d="M26.5 10.2 L29.5 4" />
      <path
        d="M13.5 15 H34.5 L32.3 38.5 A4.5 4.5 0 0 1 27.8 42.5 H20.2 A4.5 4.5 0 0 1 15.7 38.5 Z"
        fill="#FFCBA8"
      />
      {eye(20, 24, 1.5)}{eye(28, 24, 1.5)}
      {smile(24, 27.2)}
      <circle cx={19.5} cy={35} r={2} fill={S} stroke="none" />
      <circle cx={24.2} cy={37.5} r={2} fill={S} stroke="none" />
      <circle cx={28.7} cy={34.8} r={2} fill={S} stroke="none" />
    </Base>
  )
}

// 15. 购物
export function IconShopping(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M12.5 16 H35.5 L37.2 38 A3.5 3.5 0 0 1 33.7 41.8 H14.3 A3.5 3.5 0 0 1 10.8 38 Z"
        fill="#FFD1DC"
      />
      <path d="M18 16 V12.5 A6 6 0 0 1 30 12.5 V16" />
      {eye(20, 26, 1.5)}{eye(28, 26, 1.5)}
      {smile(24, 29.2)}
      {blush(16, 29.5)}{blush(32, 29.5)}
    </Base>
  )
}

// 16. 出行旅行
export function IconPlane(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 5.5 C25.8 5.5 27 6.8 27 8.8 V17.5 L41.5 24.5 V28.5 L27 25.3 V33.5 L31.5 36.8 V39.5 L24 37.5 L16.5 39.5 V36.8 L21 33.5 V25.3 L6.5 28.5 V24.5 L21 17.5 V8.8 C21 6.8 22.2 5.5 24 5.5 Z"
        fill="#BEE0F2"
      />
      <circle cx={24} cy={12.5} r={1.4} fill={S} stroke="none" />
    </Base>
  )
}

// 17. 教育学习
export function IconStudy(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M24 11 L43.5 19.5 L24 28 L4.5 19.5 Z" fill="#E3D7FA" />
      <path d="M14.5 23.5 V31 C14.5 34 19 35.8 24 35.8 C29 35.8 33.5 34 33.5 31 V23.5" fill="#FFFDF8" />
      <path d="M43.5 19.5 V29" />
      <circle cx={43.5} cy={31.5} r={2} fill="#FFCBA8" />
    </Base>
  )
}

// 18. 理财钱包
export function IconWallet(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={6} y={12} width={36} height={27} rx={7} fill="#FFE3B3" />
      <path d="M42 20.5 H34 A5 5 0 0 0 34 30.5 H42 Z" fill="#FFD1DC" />
      <circle cx={35.8} cy={25.5} r={1.6} fill={S} stroke="none" />
      <path d="M11 17 H24" />
    </Base>
  )
}

// 19. 社交聊天
export function IconChat(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M15.5 32.5 L13 41 L22.5 33" fill="#C9E7C0" />
      <rect x={7} y={9} width={34} height={24} rx={10} fill="#C9E7C0" />
      <circle cx={16.5} cy={21} r={2} fill={S} stroke="none" />
      <circle cx={24} cy={21} r={2} fill={S} stroke="none" />
      <circle cx={31.5} cy={21} r={2} fill={S} stroke="none" />
    </Base>
  )
}

// 20. 相机相册
export function IconCamera(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M17 14.5 L19.3 10 Q19.8 9 21 9 H27 Q28.2 9 28.7 10 L31 14.5 Z" fill="#FFD1DC" />
      <rect x={6} y={14.5} width={36} height={25} rx={8} fill="#BEE0F2" />
      <circle cx={24} cy={27} r={7.5} fill="#FFFDF8" />
      <circle cx={24} cy={27} r={3.6} fill="#FFCBA8" />
      <circle cx={36.5} cy={19.5} r={1.5} fill={S} stroke="none" />
    </Base>
  )
}

// 21. 邮箱邮件
export function IconMail(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={6} y={11.5} width={36} height={26} rx={7} fill="#FFE3B3" />
      <path d="M9.5 15.5 L24 27 L38.5 15.5" />
      <circle cx={24} cy={27} r={2.6} fill="#FF8FA3" />
    </Base>
  )
}

// 22. 日历日程
export function IconCalendar(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <rect x={7} y={10.5} width={34} height={30} rx={7} fill="#FFFDF8" />
      <path d="M7 17.5 A7 7 0 0 1 14 10.5 H34 A7 7 0 0 1 41 17.5 V20.5 H7 Z" fill="#FFD1DC" />
      <path d="M16 6.5 V12.5" />
      <path d="M32 6.5 V12.5" />
      <circle cx={16} cy={27} r={2} fill="#C9E7C0" />
      <circle cx={24} cy={27} r={2} fill="#BEE0F2" />
      <circle cx={32} cy={27} r={2} fill="#FFE3B3" />
      <circle cx={16} cy={33.5} r={2} fill="#E3D7FA" />
      <circle cx={24} cy={33.5} r={2} fill="#FFD1DC" />
    </Base>
  )
}

// 23. 会员皇冠
export function IconCrown(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M9.5 33.5 L6.5 14.5 L16.5 22.5 L24 9.5 L31.5 22.5 L41.5 14.5 L38.5 33.5 Z" fill="#FFCF5C" />
      <rect x={9.5} y={36} width={29} height={5} rx={2.5} fill="#FFE3B3" />
      <circle cx={16} cy={28} r={2} fill="#FF8FA3" stroke="none" />
      <circle cx={24} cy={25.5} r={2.2} fill="#E3D7FA" stroke="none" />
      <circle cx={32} cy={28} r={2} fill="#BEE0F2" stroke="none" />
    </Base>
  )
}

// 24. 星星收藏
export function IconStar(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 6.5 L29.2 17 L40.7 18.7 L32.4 26.7 L34.3 38.2 L24 32.8 L13.7 38.2 L15.6 26.7 L7.3 18.7 L18.8 17 Z"
        fill="#FFE3B3"
      />
      {eye(20, 23, 1.5)}{eye(28, 23, 1.5)}
      {smile(24, 26.2)}
      {blush(16.2, 25.8)}{blush(31.8, 25.8)}
    </Base>
  )
}

// 25. 安全盾牌
export function IconShield(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 5.5 C30 9.5 35.8 10.7 40.5 10.7 C40.5 27.5 34.5 37.2 24 42.5 C13.5 37.2 7.5 27.5 7.5 10.7 C12.2 10.7 18 9.5 24 5.5 Z"
        fill="#C9E7C0"
      />
      <path d="M17.5 23.5 L22 28 L30.5 18.5" />
    </Base>
  )
}

// 26. 宠物
export function IconPet(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <circle cx={13.5} cy={18.5} r={4.2} fill="#FFD1DC" />
      <circle cx={20.5} cy={12.5} r={4.2} fill="#FFD1DC" />
      <circle cx={27.5} cy={12.5} r={4.2} fill="#FFD1DC" />
      <circle cx={34.5} cy={18.5} r={4.2} fill="#FFD1DC" />
      <ellipse cx={24} cy={30.5} rx={9} ry={7.2} fill="#FFCBA8" />
    </Base>
  )
}

// 27. 礼品
export function IconGift(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path d="M24 12.5 C20 6 12 5.5 12.5 10 C13 13.5 20 14 24 12.5" fill="#FF8FA3" />
      <path d="M24 12.5 C28 6 36 5.5 35.5 10 C35 13.5 28 14 24 12.5" fill="#FF8FA3" />
      <rect x={9} y={21} width={30} height={19} rx={4} fill="#FFD1DC" />
      <rect x={6.5} y={12.5} width={35} height={9} rx={4} fill="#E3D7FA" />
      <path d="M24 12.5 V40" />
    </Base>
  )
}

// 28. 灯泡灵感
export function IconBulb(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 6.5 C16.3 6.5 10.5 12.2 10.5 19.3 C10.5 24 13.3 27.2 16.2 29.9 C17.8 31.4 18.5 32.8 18.5 34.8 H29.5 C29.5 32.8 30.2 31.4 31.8 29.9 C34.7 27.2 37.5 24 37.5 19.3 C37.5 12.2 31.7 6.5 24 6.5 Z"
        fill="#FFECB3"
      />
      <path d="M19 38.8 H29" />
      <path d="M20.5 42.8 H27.5" />
      <path d="M7.5 11 L5.2 8.7" />
      <path d="M40.5 11 L42.8 8.7" />
      <path d="M24 3.2 V1" />
    </Base>
  )
}

// 29. 火箭
export function IconRocket(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 4.5 C29.5 8.5 31.5 14.5 31.5 21.5 L35.8 27.5 L31 28.3 C30 32.5 27.5 35.5 24 37.5 C20.5 35.5 18 32.5 17 28.3 L12.2 27.5 L16.5 21.5 C16.5 14.5 18.5 8.5 24 4.5 Z"
        fill="#BEE0F2"
      />
      <circle cx={24} cy={17} r={4} fill="#FFFDF8" />
      <path d="M24 38.8 C21.8 41.2 21.8 44.2 24 46.8 C26.2 44.2 26.2 41.2 24 38.8 Z" fill="#FF9F68" />
    </Base>
  )
}

// 30. 咖啡
export function IconCoffee(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M11.5 17.5 H33.5 V29 C33.5 34.5 29.5 37.5 22.5 37.5 C15.5 37.5 11.5 34.5 11.5 29 Z"
        fill="#FFE3B3"
      />
      <path d="M33.5 20 H36.8 A5 5 0 0 1 36.8 30 H34" />
      <path d="M8 41.5 H37" />
      <path d="M19 13.5 C17.8 11.8 20.2 10.8 19 9" />
      <path d="M26 13.5 C24.8 11.8 27.2 10.8 26 9" />
    </Base>
  )
}

// 31. 爱心
export function IconHeart(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <path
        d="M24 40.5 C12.5 31.5 6 24.5 6 17 C6 11 10.3 6.5 15.8 6.5 C19.8 6.5 22.7 9 24 12 C25.3 9 28.2 6.5 32.2 6.5 C37.7 6.5 42 11 42 17 C42 24.5 35.5 31.5 24 40.5 Z"
        fill="#FFB3C2"
      />
      <ellipse cx={16} cy={15} rx={3} ry={2} fill="#fff" opacity={0.75} stroke="none" transform="rotate(-25 16 15)" />
    </Base>
  )
}

// 32. 默认问号
export function IconQuestion(p: HanddrawnIconProps) {
  return (
    <Base {...p}>
      <circle cx={24} cy={24} r={17.5} fill="#E3D7FA" />
      <path d="M20 19.5 A4.5 4.5 0 0 1 29 21 C29 24.5 24.5 24.8 24.5 28.5" />
      <circle cx={24.5} cy={32.8} r={1.8} fill={S} stroke="none" />
    </Base>
  )
}
