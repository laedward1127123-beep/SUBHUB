// ===== 圆形裁剪对话框：拖拽移动 + 滑块缩放 + 实时预览 + 导出 256×256 PNG =====
import { useCallback, useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ZoomIn } from 'lucide-react'

const VIEW = 320 // 取景框边长
const RADIUS = 140 // 圆形取景半径（view 坐标系）
const EXPORT_SIZE = 256

interface ImageCropDialogProps {
  open: boolean
  imageSrc: string
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
}

export default function ImageCropDialog({ open, imageSrc, onConfirm, onCancel }: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // 打开时加载图片尺寸并重置状态
  useEffect(() => {
    if (!open || !imageSrc) return
    setZoom(1)
    setOffset({ x: 0, y: 0 })
    setNat(null)
    const img = new Image()
    img.onload = () => setNat({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = imageSrc
  }, [open, imageSrc])

  const base = nat ? Math.max(VIEW / nat.w, VIEW / nat.h) : 1
  const dispW = (nat?.w ?? VIEW) * base * zoom
  const dispH = (nat?.h ?? VIEW) * base * zoom

  const clamp = useCallback(
    (o: { x: number; y: number }, w = dispW, h = dispH) => ({
      x: Math.min(0, Math.max(VIEW - w, o.x)),
      y: Math.min(0, Math.max(VIEW - h, o.y)),
    }),
    [dispW, dispH],
  )

  const handleZoom = (v: number[]) => {
    const z = v[0] ?? 1
    setZoom(z)
    if (nat) {
      const w = nat.w * base * z
      const h = nat.h * base * z
      setOffset((o) => clamp(o, w, h))
    }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y }
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d) return
    setOffset(clamp({ x: d.baseX + e.clientX - d.startX, y: d.baseY + e.clientY - d.startY }))
  }
  const onPointerUp = () => {
    dragRef.current = null
  }

  const handleConfirm = () => {
    const img = imgRef.current
    if (!img || !nat) return
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_SIZE
    canvas.height = EXPORT_SIZE
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // view 坐标 → canvas：圆心 (VIEW/2, VIEW/2) → (128,128)，半径 RADIUS → 128
    const k = EXPORT_SIZE / (RADIUS * 2)
    ctx.beginPath()
    ctx.arc(EXPORT_SIZE / 2, EXPORT_SIZE / 2, EXPORT_SIZE / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(
      img,
      (offset.x - VIEW / 2) * k + EXPORT_SIZE / 2,
      (offset.y - VIEW / 2) * k + EXPORT_SIZE / 2,
      dispW * k,
      dispH * k,
    )
    onConfirm(canvas.toDataURL('image/png'))
  }

  // 小预览的缩放系数
  const PREVIEW = 72
  const pf = PREVIEW / VIEW

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>裁剪图标</DialogTitle>
          <DialogDescription>拖拽图片调整位置，用滑块缩放，圆形区域将作为订阅图标。</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4">
          {/* 取景区域 */}
          <div
            className="relative shrink-0 touch-none overflow-hidden rounded-lg bg-muted select-none"
            style={{ width: VIEW, height: VIEW, cursor: dragRef.current ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {imageSrc && (
              <img
                ref={imgRef}
                src={imageSrc}
                alt=""
                draggable={false}
                className="absolute left-0 top-0"
                style={{
                  width: dispW,
                  height: dispH,
                  maxWidth: 'none',
                  transform: `translate(${offset.x}px, ${offset.y}px)`,
                }}
              />
            )}
            {/* 暗色遮罩 + 圆形高亮边框 */}
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/90"
                style={{
                  width: RADIUS * 2,
                  height: RADIUS * 2,
                  boxShadow: '0 0 0 999px rgba(15, 15, 20, 0.5)',
                }}
              />
            </div>
          </div>

          {/* 实时圆形预览 */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative overflow-hidden rounded-full border bg-muted"
              style={{ width: PREVIEW, height: PREVIEW }}
            >
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt=""
                  draggable={false}
                  className="absolute left-0 top-0"
                  style={{
                    width: dispW * pf,
                    height: dispH * pf,
                    maxWidth: 'none',
                    transform: `translate(${offset.x * pf}px, ${offset.y * pf}px)`,
                  }}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">预览</p>
          </div>
        </div>

        {/* 缩放滑块 */}
        <div className="flex items-center gap-3">
          <ZoomIn className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Slider value={[zoom]} min={1} max={3} step={0.01} onValueChange={handleZoom} className="flex-1" />
          <span className="w-12 shrink-0 text-right text-xs text-muted-foreground">{zoom.toFixed(2)}x</span>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>取消</Button>
          <Button onClick={handleConfirm} disabled={!nat}>确认裁剪</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
