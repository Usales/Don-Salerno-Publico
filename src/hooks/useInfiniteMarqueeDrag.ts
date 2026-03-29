import { useCallback, useEffect, useRef, useState } from 'react'

const DRAG_THRESHOLD_PX = 10
const THROW_STRENGTH = 2.4
const MAX_THROW_PX_PER_SEC = 5200
const FRICTION = 0.988
const MIN_MOMENTUM_PX_PER_SEC = 14

function wrapOffset(offset: number, period: number): number {
  if (period <= 0) return offset
  let o = offset
  while (o <= -period) o += period
  while (o > 0) o -= period
  return o
}

export type InfiniteMarqueeDragOptions = {
  /** Segundos para percorrer um período (largura de um conjunto duplicado) em autoplay */
  autoplaySecondsPerPeriod: number
  /** -1 = como pratos populares (rola para a esquerda); +1 = como banners promocionais */
  autoplayDirection: -1 | 1
  /** Recalcula período quando mudar (ex.: referência da lista de itens) */
  measurementKey: unknown
}

export function useInfiniteMarqueeDrag({
  autoplaySecondsPerPeriod,
  autoplayDirection,
  measurementKey,
}: InfiniteMarqueeDragOptions) {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const firstSetRef = useRef<HTMLDivElement>(null)
  const periodRef = useRef(1)
  const offsetRef = useRef(0)
  const momentumRef = useRef(0)
  const draggingRef = useRef(false)
  const downRef = useRef<{ x: number; pointerId: number } | null>(null)
  const dragStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const moveSamplesRef = useRef<{ t: number; x: number }[]>([])
  const suppressClickRef = useRef(false)
  const rafRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  const applyTransform = useCallback((px: number) => {
    const t = trackRef.current
    if (t) t.style.transform = `translate3d(${px}px, 0, 0)`
  }, [])

  const docMoveRef = useRef<(e: PointerEvent) => void>(() => {})
  const docUpRef = useRef<(e: PointerEvent) => void>(() => {})

  const boundDocMove = useCallback((e: PointerEvent) => docMoveRef.current(e), [])
  const boundDocUp = useCallback((e: PointerEvent) => docUpRef.current(e), [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const measurePeriod = useCallback(() => {
    const w = firstSetRef.current?.getBoundingClientRect().width ?? 1
    periodRef.current = Math.max(1, w)
  }, [])

  useEffect(() => {
    measurePeriod()
    const el = firstSetRef.current
    if (!el) return
    const ro = new ResizeObserver(() => measurePeriod())
    ro.observe(el)
    return () => ro.disconnect()
  }, [measurePeriod, measurementKey])

  useEffect(() => {
    docMoveRef.current = (e: PointerEvent) => {
      const down = downRef.current
      if (!down || e.pointerId !== down.pointerId) return

      moveSamplesRef.current.push({ t: performance.now(), x: e.clientX })
      if (moveSamplesRef.current.length > 10) moveSamplesRef.current.shift()

      const dx = e.clientX - down.x
      if (!draggingRef.current && Math.abs(dx) > DRAG_THRESHOLD_PX) {
        draggingRef.current = true
        suppressClickRef.current = true
        dragStartXRef.current = down.x
        dragStartOffsetRef.current = offsetRef.current
        marqueeRef.current?.setPointerCapture(e.pointerId)
      }

      if (draggingRef.current) {
        e.preventDefault()
        const next = dragStartOffsetRef.current + (e.clientX - dragStartXRef.current)
        offsetRef.current = next
        applyTransform(next)
      }
    }

    docUpRef.current = (e: PointerEvent) => {
      document.removeEventListener('pointermove', boundDocMove)
      document.removeEventListener('pointerup', boundDocUp)
      document.removeEventListener('pointercancel', boundDocUp)

      const hadDown = downRef.current != null
      downRef.current = null

      if (!hadDown) return

      if (draggingRef.current) {
        try {
          marqueeRef.current?.releasePointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
        draggingRef.current = false

        const samples = moveSamplesRef.current
        moveSamplesRef.current = []
        if (suppressClickRef.current && samples.length >= 2) {
          const tCut = performance.now() - 140
          const recent = samples.filter((s) => s.t >= tCut)
          const use = recent.length >= 2 ? recent : samples
          const a = use[0]
          const b = use[use.length - 1]
          const dt = (b.t - a.t) / 1000
          if (dt > 0.004) {
            const vx = (b.x - a.x) / dt
            let add = vx * THROW_STRENGTH
            add = Math.max(-MAX_THROW_PX_PER_SEC, Math.min(MAX_THROW_PX_PER_SEC, add))
            momentumRef.current += add
          }
        }
        offsetRef.current = wrapOffset(offsetRef.current, periodRef.current)
        applyTransform(offsetRef.current)
      }

      if (suppressClickRef.current) {
        window.setTimeout(() => {
          suppressClickRef.current = false
        }, 0)
      }
    }
  }, [applyTransform, boundDocMove, boundDocUp])

  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', boundDocMove)
      document.removeEventListener('pointerup', boundDocUp)
      document.removeEventListener('pointercancel', boundDocUp)
    }
  }, [boundDocMove, boundDocUp])

  useEffect(() => {
    if (reducedMotion) return

    const tick = (now: number) => {
      const prev = lastFrameRef.current
      lastFrameRef.current = now
      const dtSec = prev != null ? Math.min((now - prev) / 1000, 0.064) : 0
      const period = periodRef.current

      if (!draggingRef.current && dtSec > 0) {
        const autoplayMag = period / autoplaySecondsPerPeriod
        const autoplay = autoplayDirection * autoplayMag
        let off = offsetRef.current
        let mom = momentumRef.current
        off += (autoplay + mom) * dtSec
        mom *= Math.pow(FRICTION, dtSec * 60)
        if (Math.abs(mom) < MIN_MOMENTUM_PX_PER_SEC) mom = 0
        off = wrapOffset(off, period)
        offsetRef.current = off
        momentumRef.current = mom
        applyTransform(off)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [reducedMotion, applyTransform, autoplaySecondsPerPeriod, autoplayDirection])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reducedMotion) return
      if (e.button !== 0) return
      downRef.current = { x: e.clientX, pointerId: e.pointerId }
      moveSamplesRef.current = [{ t: performance.now(), x: e.clientX }]
      suppressClickRef.current = false
      document.addEventListener('pointermove', boundDocMove)
      document.addEventListener('pointerup', boundDocUp)
      document.addEventListener('pointercancel', boundDocUp)
    },
    [reducedMotion, boundDocMove, boundDocUp],
  )

  const onLinkClickCapture = useCallback((ev: React.MouseEvent) => {
    if (suppressClickRef.current) {
      ev.preventDefault()
      ev.stopPropagation()
    }
  }, [])

  return {
    marqueeRef,
    trackRef,
    firstSetRef,
    reducedMotion,
    onPointerDown,
    onLinkClickCapture,
  }
}
