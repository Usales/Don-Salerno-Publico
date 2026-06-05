import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export type HeroSlide = { id: string; src: string; nome: string }

type HeroThrowState =
  | { phase: 'idle' }
  | { phase: 'running'; from: HeroSlide; to: HeroSlide; dir: 'next' | 'prev' }

interface UseHeroCarouselOptions {
  slides: HeroSlide[]
  /** ms entre cada slide no autoplay */
  intervalMs: number
  /** Duração da animação de "arremesso" (ms) */
  throwMs: number
  /** Mínimo de px para contar como swipe */
  swipeMinPx: number
}

export function useHeroCarousel({ slides, intervalMs, throwMs, swipeMinPx }: UseHeroCarouselOptions) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [pauseMotion, setPauseMotion] = useState(false)
  const [throwState, setThrowState] = useState<HeroThrowState>({ phase: 'idle' })
  const swipeDownRef = useRef<{ x: number; pointerId: number } | null>(null)
  const prevSlideRef = useRef<HeroSlide | null>(null)
  const skipThrowRef = useRef(true)
  const lastNavDirRef = useRef<'next' | 'prev'>('next')

  // Reseta ao mudar de categoria
  useEffect(() => {
    skipThrowRef.current = true
    setThrowState({ phase: 'idle' })
    setSlideIndex(0)
  }, [slides])

  // Preload de imagens
  useEffect(() => {
    slides.forEach((p) => {
      const img = new Image()
      img.src = p.src
    })
  }, [slides])

  // Autoplay
  useEffect(() => {
    if (pauseMotion || slides.length <= 1) return
    const n = slides.length
    const id = window.setInterval(() => {
      lastNavDirRef.current = 'next'
      skipThrowRef.current = false
      setSlideIndex((i) => (i + 1) % n)
    }, intervalMs)
    return () => clearInterval(id)
  }, [pauseMotion, slides, intervalMs])

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setPauseMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Throw animation logic
  useLayoutEffect(() => {
    const curr = slides[pauseMotion ? 0 : slideIndex] ?? slides[0]
    if (skipThrowRef.current) {
      skipThrowRef.current = false
      prevSlideRef.current = curr
      setThrowState({ phase: 'idle' })
      return
    }
    if (pauseMotion || slides.length <= 1) {
      prevSlideRef.current = curr
      setThrowState({ phase: 'idle' })
      return
    }
    const prev = prevSlideRef.current
    if (!prev) {
      prevSlideRef.current = curr
      return
    }
    if (prev.id === curr.id) return
    setThrowState({ phase: 'running', from: prev, to: curr, dir: lastNavDirRef.current })
    const t = window.setTimeout(() => {
      setThrowState({ phase: 'idle' })
      prevSlideRef.current = curr
    }, throwMs)
    return () => clearTimeout(t)
  }, [slideIndex, slides, pauseMotion, throwMs])

  const throwing = throwState.phase === 'running'
  const slideAtivo = pauseMotion ? 0 : slideIndex

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0 || slides.length <= 1 || throwing) return
      swipeDownRef.current = { x: e.clientX, pointerId: e.pointerId }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [slides.length, throwing],
  )

  const endSwipe = useCallback(
    (e: React.PointerEvent<HTMLElement>, apply: boolean) => {
      const d = swipeDownRef.current
      if (!d || d.pointerId !== e.pointerId) return
      swipeDownRef.current = null
      try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* ok */ }
      if (!apply) return
      const dx = e.clientX - d.x
      if (Math.abs(dx) < swipeMinPx) return
      const n = slides.length
      if (dx > 0) {
        lastNavDirRef.current = 'prev'
        skipThrowRef.current = false
        setSlideIndex((i) => (i - 1 + n) % n)
      } else {
        lastNavDirRef.current = 'next'
        skipThrowRef.current = false
        setSlideIndex((i) => (i + 1) % n)
      }
    },
    [slides.length, swipeMinPx],
  )

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLElement>) => endSwipe(e, true), [endSwipe])
  const onPointerCancel = useCallback((e: React.PointerEvent<HTMLElement>) => endSwipe(e, false), [endSwipe])

  return {
    slide: slides[pauseMotion ? 0 : slideIndex] ?? slides[0],
    slideAtivo,
    throwing,
    throwState,
    pauseMotion,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
  }
}
