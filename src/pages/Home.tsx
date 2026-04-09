import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_STATE_MASCOTE_SRC } from '@/components/EmptyStateMascote'
import { HomeBannersMarquee } from '@/components/HomeBannersMarquee'
import { HomeMarqueeStrip } from '@/components/HomeMarqueeStrip'
import { HomePopularMarquee } from '@/components/HomePopularMarquee'
import { JsonLdRestaurant } from '@/lib/seo'
import { rotulosCategoria } from '@/data/categorias'
import { produtos } from '@/data/produtos'
import type { Categoria } from '@/types'
import './Home.css'

const populares = produtos.filter((p) => p.categoria === 'pizzas').slice(0, 4)

const HERO_PIZZA_INTERVAL_MS = 4000
/** Máximo de fotos no carrossel do hero (Pizza); uma imagem por arquivo, sem repetir arte. */
const HERO_PIZZAS_MAX_SLIDES = 10
const HERO_SWIPE_MIN_PX = 56
/** Duração da animação de “arremesso” entre fotos do hero (ms) */
const HERO_THROW_MS = 540

/** Hero em “Bebidas”: uma única arte (linha de garrafas), sem carrossel por SKU */
const HERO_BEBIDAS_SLIDE_ID = 'hero-bebidas-gatorade'
const HERO_BEBIDAS_SRC = '/hero-bebidas-gatorade.png'

/** Categorias sem rotação “forno”; calzones usa flutuar próprio; bebidas usa drift suave (ver CSS). */
const HERO_CATEGORIAS_VISUAL_ESTATICO: Categoria[] = ['calzones', 'sobremesas']

type HeroSlide = { id: string; src: string; nome: string }

type HeroThrowState =
  | { phase: 'idle' }
  | { phase: 'running'; from: HeroSlide; to: HeroSlide; dir: 'next' | 'prev' }

function heroPizzaImgClass(slide: HeroSlide, categoria: Categoria): string {
  let c = 'hero__pizza'
  if (slide.src.endsWith('.svg')) c += ' hero__pizza--logo'
  if (slide.id.startsWith('placeholder-')) c += ' hero__pizza--empty-mascote'
  if (HERO_CATEGORIAS_VISUAL_ESTATICO.includes(categoria)) c += ' hero__pizza--static'
  if (categoria === 'calzones') c += ' hero__pizza--calzone-float'
  if (slide.id === HERO_BEBIDAS_SLIDE_ID) c += ' hero__pizza--bebidas-linha'
  if (categoria === 'bebidas') c += ' hero__pizza--bebidas-drift'
  return c
}

function srcHeroProduto(p: { imagem: string; imagemDestaque?: string; comboVisual?: { pizza: string } }): string {
  if (p.comboVisual) return p.comboVisual.pizza
  return p.imagemDestaque ?? p.imagem
}

function heroSlidesParaCategoria(cat: Categoria): HeroSlide[] {
  if (cat === 'pizzas') {
    const seenSrc = new Set<string>()
    const slides: HeroSlide[] = []
    for (const p of produtos.filter((x) => x.categoria === 'pizzas')) {
      const src = srcHeroProduto(p)
      if (seenSrc.has(src)) continue
      seenSrc.add(src)
      slides.push({ id: p.id, src, nome: p.nome })
      if (slides.length >= HERO_PIZZAS_MAX_SLIDES) break
    }
    return slides
  }
  if (cat === 'calzones') {
    return produtos
      .filter((p) => p.categoria === 'calzones')
      .map((p) => ({ id: p.id, src: srcHeroProduto(p), nome: p.nome }))
  }
  if (cat === 'bebidas') {
    return [
      {
        id: HERO_BEBIDAS_SLIDE_ID,
        src: HERO_BEBIDAS_SRC,
        nome: 'Gatorade — isotônicos 500 ml',
      },
    ]
  }
  const doCardapio = produtos
    .filter((p) => p.categoria === cat)
    .map((p) => ({ id: p.id, src: srcHeroProduto(p), nome: p.nome }))
  if (doCardapio.length > 0) return doCardapio
  return [
    {
      id: `placeholder-${cat}`,
      src: EMPTY_STATE_MASCOTE_SRC,
      nome: `${rotulosCategoria[cat]} — veja no cardápio`,
    },
  ]
}

const HERO_CARD_TABS: { categoria: Categoria; label: string }[] = [
  { categoria: 'pizzas', label: 'Pizza' },
  { categoria: 'esfihas', label: 'Esfihas' },
  { categoria: 'calzones', label: 'Calzones' },
  { categoria: 'combos', label: 'Combos' },
  { categoria: 'sobremesas', label: 'Sobremesas' },
  { categoria: 'bebidas', label: 'Bebidas' },
]

const HERO_CARD_TABS_PRIMEIRA_LINHA = HERO_CARD_TABS.slice(0, 3)
const HERO_CARD_TABS_INFERIOR = HERO_CARD_TABS.slice(3)

const banners = [
  {
    tag: 'Na semana',
    title: 'Pizza forno alto',
    sub: 'Oferta por tempo limitado',
    ctaClass: 'home-banner__cta--red' as const,
    to: '/cardapio/pizzas',
    img: '/home-banner-pizza.png',
    imgAlt: 'Pizza Margherita com mussarela, molho de tomate, manjericão e borda levemente caramelizada',
  },
  {
    tag: 'Don Salerno',
    title: 'Esfihas abertas',
    sub: 'Receita do dia',
    ctaClass: 'home-banner__cta--orange' as const,
    to: '/cardapio/esfihas',
    img: '/home-banner-pizza-doce.png',
    imgAlt: 'Pizza doce com chocolate e confeitos coloridos',
  },
  {
    tag: 'Especial',
    title: 'Calzone crocante',
    sub: 'Sabor intenso',
    ctaClass: 'home-banner__cta--red' as const,
    to: '/produto/c1',
    img: '/home-banner-calzone.png',
    imgAlt: 'Calzone cortado ao meio com pepperoni, mussarela e molho',
  },
]

export function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [heroCategoria, setHeroCategoria] = useState<Categoria>('pizzas')
  const [heroSlideIndex, setHeroSlideIndex] = useState(0)
  const [heroVisualPauseMotion, setHeroVisualPauseMotion] = useState(false)
  const [heroThrowState, setHeroThrowState] = useState<HeroThrowState>({ phase: 'idle' })
  const heroSwipeDownRef = useRef<{ x: number; pointerId: number } | null>(null)
  const prevHeroSlideRef = useRef<HeroSlide | null>(null)
  const skipHeroThrowRef = useRef(true)
  const lastHeroNavDirRef = useRef<'next' | 'prev'>('next')

  const heroSlides = useMemo(() => heroSlidesParaCategoria(heroCategoria), [heroCategoria])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 380)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setHeroVisualPauseMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    skipHeroThrowRef.current = true
    setHeroThrowState({ phase: 'idle' })
    setHeroSlideIndex(0)
  }, [heroCategoria])

  useEffect(() => {
    heroSlides.forEach((p) => {
      const img = new Image()
      img.src = p.src
    })
  }, [heroSlides])

  useEffect(() => {
    if (heroVisualPauseMotion || heroSlides.length <= 1) return
    const n = heroSlides.length
    const id = window.setInterval(() => {
      lastHeroNavDirRef.current = 'next'
      skipHeroThrowRef.current = false
      setHeroSlideIndex((i) => (i + 1) % n)
    }, HERO_PIZZA_INTERVAL_MS)
    return () => clearInterval(id)
  }, [heroVisualPauseMotion, heroSlides])

  const heroSlide = heroSlides[heroVisualPauseMotion ? 0 : heroSlideIndex] ?? heroSlides[0]
  const heroSlideAtivo = heroVisualPauseMotion ? 0 : heroSlideIndex

  useLayoutEffect(() => {
    const curr = heroSlides[heroVisualPauseMotion ? 0 : heroSlideIndex] ?? heroSlides[0]
    if (skipHeroThrowRef.current) {
      skipHeroThrowRef.current = false
      prevHeroSlideRef.current = curr
      setHeroThrowState({ phase: 'idle' })
      return
    }
    if (heroVisualPauseMotion || heroSlides.length <= 1) {
      prevHeroSlideRef.current = curr
      setHeroThrowState({ phase: 'idle' })
      return
    }
    const prev = prevHeroSlideRef.current
    if (!prev) {
      prevHeroSlideRef.current = curr
      return
    }
    if (prev.id === curr.id) {
      return
    }
    setHeroThrowState({
      phase: 'running',
      from: prev,
      to: curr,
      dir: lastHeroNavDirRef.current,
    })
    const t = window.setTimeout(() => {
      setHeroThrowState({ phase: 'idle' })
      prevHeroSlideRef.current = curr
    }, HERO_THROW_MS)
    return () => clearTimeout(t)
  }, [heroSlideIndex, heroSlides, heroVisualPauseMotion])

  const heroThrowing = heroThrowState.phase === 'running'
  const captionSlide =
    heroThrowState.phase === 'running' ? heroThrowState.to : heroSlide

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const onHeroVisualPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0 || heroSlides.length <= 1 || heroThrowing) return
      heroSwipeDownRef.current = { x: e.clientX, pointerId: e.pointerId }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [heroSlides.length, heroThrowing],
  )

  const endHeroSwipe = useCallback(
    (e: React.PointerEvent<HTMLElement>, applySlide: boolean) => {
      const d = heroSwipeDownRef.current
      if (!d || d.pointerId !== e.pointerId) return
      heroSwipeDownRef.current = null
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* já liberado */
      }
      if (!applySlide) return
      const dx = e.clientX - d.x
      if (Math.abs(dx) < HERO_SWIPE_MIN_PX) return
      const n = heroSlides.length
      if (dx > 0) {
        lastHeroNavDirRef.current = 'prev'
        skipHeroThrowRef.current = false
        setHeroSlideIndex((i) => (i - 1 + n) % n)
      } else {
        lastHeroNavDirRef.current = 'next'
        skipHeroThrowRef.current = false
        setHeroSlideIndex((i) => (i + 1) % n)
      }
    },
    [heroSlides.length],
  )

  const onHeroVisualPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      endHeroSwipe(e, true)
    },
    [endHeroSwipe],
  )

  const onHeroVisualPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      endHeroSwipe(e, false)
    },
    [endHeroSwipe],
  )

  return (
    <div>
      <JsonLdRestaurant />
      <section className="hero hero--fill" aria-label="Destaque principal">
        <div className="container hero__inner">
          <div className="hero__col hero__col--texto">
            <p className="hero__eyebrow">Pizzaria &amp; esfiharia · Goiânia</p>
            <h1 className="hero__titulo">Pizza artesanal de verdade, direto do forno alto</h1>
            <p className="hero__sub">
              Sabores clássicos e da casa, fermentação longa e ingredientes selecionados. Monte o pedido pelo cardápio.
            </p>
            <nav className="hero__cattabs" aria-label="Filtrar destaque do cardápio por categoria">
              <div className="hero__cattabs__row" role="tablist">
                {HERO_CARD_TABS_PRIMEIRA_LINHA.map(({ categoria, label }) => (
                  <button
                    key={categoria}
                    type="button"
                    role="tab"
                    aria-selected={heroCategoria === categoria}
                    className={`hero__cattab${heroCategoria === categoria ? ' hero__cattab--on' : ''}`}
                    onClick={() => setHeroCategoria(categoria)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="hero__cattabs__row hero__cattabs__row--inferior" role="tablist">
                {HERO_CARD_TABS_INFERIOR.map(({ categoria, label }) => (
                  <button
                    key={categoria}
                    type="button"
                    role="tab"
                    aria-selected={heroCategoria === categoria}
                    className={`hero__cattab${heroCategoria === categoria ? ' hero__cattab--on' : ''}`}
                    onClick={() => setHeroCategoria(categoria)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </nav>
            <div className="hero__acoes hero__acoes--after-tabs">
              <Link to={`/cardapio/${heroCategoria}`} className="btn btn--primario hero__cta-primario">
                Ver cardápio agora
              </Link>
            </div>
          </div>
          <figure
            className={`hero__col hero__col--visual${heroSlides.length > 1 ? ' hero__col--visual--swipe' : ''}`}
            aria-live="polite"
            aria-label={
              heroSlides.length > 1
                ? `Destaque: ${rotulosCategoria[heroCategoria]}. Deslize para os lados para ver outras fotos.`
                : `Destaque: ${rotulosCategoria[heroCategoria]}`
            }
            onPointerDown={onHeroVisualPointerDown}
            onPointerUp={onHeroVisualPointerUp}
            onPointerCancel={onHeroVisualPointerCancel}
          >
            <div
              className={`hero__pizza-stage${heroThrowing ? ' hero__pizza-stage--throwing' : ''}${heroCategoria === 'bebidas' ? ' hero__pizza-stage--bebidas' : ''}`}
            >
              {heroThrowState.phase === 'running' ? (
                <>
                  <div
                    className={`hero__pizza-layer hero__pizza-layer--absolute hero__pizza-layer--out hero__pizza-layer--out-${heroThrowState.dir}`}
                  >
                    <img
                      className={heroPizzaImgClass(heroThrowState.from, heroCategoria)}
                      src={heroThrowState.from.src}
                      alt=""
                      width={480}
                      height={480}
                      decoding="async"
                    />
                  </div>
                  <div
                    className={`hero__pizza-layer hero__pizza-layer--absolute hero__pizza-layer--in hero__pizza-layer--in-${heroThrowState.dir}`}
                  >
                    <img
                      className={heroPizzaImgClass(heroThrowState.to, heroCategoria)}
                      src={heroThrowState.to.src}
                      alt={`${heroThrowState.to.nome} — Don Salerno`}
                      width={480}
                      height={480}
                      decoding="async"
                    />
                  </div>
                </>
              ) : (
                <div className="hero__pizza-layer">
                  <img
                    key={heroSlide.id}
                    className={heroPizzaImgClass(heroSlide, heroCategoria)}
                    src={heroSlide.src}
                    alt={`${heroSlide.nome} — Don Salerno`}
                    width={480}
                    height={480}
                    decoding="async"
                  />
                </div>
              )}
            </div>
            <figcaption className="hero__pizza-nome">{captionSlide.nome}</figcaption>
            {heroSlides.length > 1 && (
              <div className="hero__pizza-dots" aria-hidden="true">
                {heroSlides.map((p, i) => (
                  <span
                    key={p.id}
                    className={`hero__pizza-dot${i === heroSlideAtivo ? ' hero__pizza-dot--on' : ''}`}
                  />
                ))}
              </div>
            )}
          </figure>
        </div>
      </section>

      <HomeMarqueeStrip />

      <section className="home-fold2" aria-label="Destaques e promoções">
        <div className="container home-fold2__inner">
          <section className="home-popular" aria-labelledby="home-popular-titulo">
            <h2 id="home-popular-titulo" className="home-popular__title">
              Pratos Populares
            </h2>
            <HomePopularMarquee items={populares} />
          </section>

          <section className="home-banners" aria-label="Promoções">
            <HomeBannersMarquee banners={banners} />
          </section>
        </div>
      </section>

      {showScrollTop && (
        <button type="button" className="home-scroll-top" onClick={scrollToTop} aria-label="Voltar ao topo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
