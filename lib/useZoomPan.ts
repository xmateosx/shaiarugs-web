'use client'
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'

interface View { s: number; x: number; y: number }

interface Options {
  clickScale?: number
  maxScale?: number
}

const IDENTITY: View = { s: 1, x: 0, y: 0 }

/**
 * Gesture zoom/pan for a fullscreen image viewer: click/tap toggles zoom,
 * wheel zooms toward the cursor, one-finger/mouse drag pans while zoomed,
 * two-finger pinch zooms around the touch midpoint.
 *
 * Attach `containerRef` + `handlers` to a static wrapper and `contentStyle`
 * to the element being transformed — the wrapper must stay untransformed so
 * pointer coordinates map to a stable rect.
 */
export default function useZoomPan({ clickScale = 1.75, maxScale = 4 }: Options = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [view, setViewState] = useState<View>(IDENTITY)
  const [gesturing, setGesturing] = useState(false)
  const [animate, setAnimate] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Ref mirror so native listeners and pointer handlers never read stale state
  const viewRef = useRef(view)
  const setView = useCallback((v: View, withAnimation: boolean) => {
    viewRef.current = v
    setViewState(v)
    setAnimate(withAnimation)
  }, [])

  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const drag = useRef({ x: 0, y: 0, ox: 0, oy: 0, moved: 0 })
  const pinch = useRef({ dist: 1, s: 1, mx: 0, my: 0, ox: 0, oy: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const clampView = useCallback((s: number, x: number, y: number): View => {
    const rect = containerRef.current?.getBoundingClientRect()
    s = Math.min(maxScale, Math.max(1, s))
    if (s <= 1.01 || !rect) return IDENTITY
    const mx = (rect.width * (s - 1)) / 2
    const my = (rect.height * (s - 1)) / 2
    return { s, x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) }
  }, [maxScale])

  /** Zoom to scale `s2`, keeping the image point at client coords (cx, cy) stationary. */
  const zoomToward = useCallback((cx: number, cy: number, s2: number, withAnimation: boolean) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const v = viewRef.current
    const px = cx - rect.left - rect.width / 2
    const py = cy - rect.top - rect.height / 2
    const k = Math.min(maxScale, Math.max(1, s2)) / v.s
    setView(clampView(v.s * k, px - (px - v.x) * k, py - (py - v.y) * k), withAnimation)
  }, [clampView, maxScale, setView])

  // Wheel must be a native non-passive listener: React registers synthetic
  // onWheel passively, so preventDefault() there can't block page zoom/scroll.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomToward(e.clientX, e.clientY, viewRef.current.s * Math.exp(-e.deltaY * 0.0015), false)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomToward])

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const el = containerRef.current
    if (!el) return
    try { el.setPointerCapture(e.pointerId) } catch { /* pointer already released */ }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const v = viewRef.current
    if (pointers.current.size === 1) {
      drag.current = { x: e.clientX, y: e.clientY, ox: v.x, oy: v.y, moved: 0 }
      if (v.s > 1) setGesturing(true)
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()]
      pinch.current = {
        dist: Math.hypot(b.x - a.x, b.y - a.y) || 1,
        s: v.s,
        mx: (a.x + b.x) / 2,
        my: (a.y + b.y) / 2,
        ox: v.x,
        oy: v.y,
      }
      setGesturing(true)
    }
  }, [])

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    const p = pointers.current.get(e.pointerId)
    if (!p) return
    drag.current.moved += Math.hypot(e.clientX - p.x, e.clientY - p.y)
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

    if (pointers.current.size === 2) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const [a, b] = [...pointers.current.values()]
      const start = pinch.current
      const s2 = Math.min(maxScale, Math.max(1, start.s * (Math.hypot(b.x - a.x, b.y - a.y) / start.dist)))
      // Keep the image point under the starting midpoint stationary, then follow the midpoint
      const k = s2 / start.s
      const m1x = (a.x + b.x) / 2 - rect.left - rect.width / 2
      const m1y = (a.y + b.y) / 2 - rect.top - rect.height / 2
      const m0x = start.mx - rect.left - rect.width / 2
      const m0y = start.my - rect.top - rect.height / 2
      setView(clampView(s2, m1x - (m0x - start.ox) * k, m1y - (m0y - start.oy) * k), false)
    } else if (pointers.current.size === 1 && viewRef.current.s > 1) {
      const d = drag.current
      setView(clampView(viewRef.current.s, d.ox + (e.clientX - d.x), d.oy + (e.clientY - d.y)), false)
    }
  }, [clampView, maxScale, setView])

  const endPointer = useCallback((e: ReactPointerEvent, canceled: boolean) => {
    if (!pointers.current.delete(e.pointerId)) return
    if (pointers.current.size === 1) {
      // Pinch ended with one finger still down: re-anchor the drag so there's no jump
      const [rp] = [...pointers.current.values()]
      const v = viewRef.current
      drag.current = { x: rp.x, y: rp.y, ox: v.x, oy: v.y, moved: Infinity }
    } else if (pointers.current.size === 0) {
      setGesturing(false)
      if (!canceled && drag.current.moved < 6) {
        // Clean click/tap: toggle between fit and clickScale toward the point
        if (viewRef.current.s > 1.01) setView(IDENTITY, true)
        else zoomToward(e.clientX, e.clientY, clickScale, true)
      }
    }
  }, [clickScale, setView, zoomToward])

  const onPointerUp = useCallback((e: ReactPointerEvent) => endPointer(e, false), [endPointer])
  const onPointerCancel = useCallback((e: ReactPointerEvent) => endPointer(e, true), [endPointer])

  const reset = useCallback(() => setView(IDENTITY, false), [setView])

  const contentStyle: CSSProperties = {
    transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})`,
    transformOrigin: '50% 50%',
    transition: animate && !gesturing && !reducedMotion ? 'transform 200ms ease' : 'none',
    willChange: 'transform',
  }

  return {
    containerRef,
    scale: view.s,
    gesturing,
    contentStyle,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    reset,
  }
}
