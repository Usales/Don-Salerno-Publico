import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EMPTY_STATE_MASCOTE_SRC } from '@/components/EmptyStateMascote'
import { HomeBannersMarquee } from '@/components/HomeBannersMarquee'
import { HomeMarqueeStrip } from '@/components/HomeMarqueeStrip'
import { HomePopularMarquee } from '@/components/HomePopularMarquee'
import { useHeroCarousel, type HeroSlide } from '@/hooks/useHeroCarousel'
import { usePageTitle } from '@/hooks/usePageTitle'
import { JsonLdRestaurant } from '@/lib/seo'
import { rotulosCategoria } from '@/data/categorias'
import { produtos } from '@/data/produtos'
import type { Categoria } from '@/types'
import './Home.css'

const populares = produtos.filter((p) => p.categoria === 'pizzas').slice(0, 4)

const HERO_PIZZA_INTERVAL_MS = 4000
/** Máximo de fotos no carrossel do hero (Pizza); uma imagem por arquivo, sem repetir arte. */
const HERO_PIZZAS_MAX_SLIDES = 10

const HERO_BEBIDAS_GATORADE_SLIDE_ID = 'hero-bebidas-gatorade'
const HERO_BEBIDAS_GATORADE_SRC = '/hero-bebidas-gatorade.png'

/** Categorias sem rotação "forno"; calzones usa flutuar próprio; bebidas/combos usam drift suave (ver CSS). */
const HERO_CATEGORIAS_VISUAL_ESTATICO: Categoria[] = ['calzones']

function heroPizzaImgClass(slide: HeroSlide, categoria: Categoria): string {
  let c = 'hero__pizza'
  if (slide.src.endsWith('.svg')) c += ' hero__pizza--logo'
  if (slide.id.startsWith('placeholder-')) c += ' hero__pizza--empty-mascote'
  if (HERO_CATEGORIAS_VISUAL_ESTATICO.includes(categoria)) c += ' hero__pizza--static'
  if (categoria === 'calzones') c += ' hero__pizza--calzone-float'
  if (categoria === 'bebidas' || categoria === 'combos' || slide.src.includes('/combos/')) {
    c += ' hero__pizza--bebidas-drift'
  }
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
        id: 'hero-bebidas-crystal',
        src: '/bebidas/hero-crystal-agua.png',
        nome: 'Água Crystal',
      },
      {
        id: 'hero-bebidas-coca-familia',
        src: '/bebidas/hero-coca-familia.png',
        nome: 'Coca-Cola & Coca-Cola Zero',
      },
      {
        id: HERO_BEBIDAS_GATORADE_SLIDE_ID,
        src: HERO_BEBIDAS_GATORADE_SRC,
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
  { categoria: 'combos', label: 'Combos' },
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
    to: '/cardapio/calzones/calzone-presunto',
    img: '/home-banner-calzone.png',
    imgAlt: 'Calzone cortado ao meio com pepperoni, mussarela e molho',
  },
]

export function Home() {
  usePageTitle('Home — Pizza Artesanal')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [heroCategoria, setHeroCategoria] = useState<Categoria>('pizzas')

  const heroSlides = useMemo(() => heroSlidesParaCategoria(heroCategoria), [heroCategoria])

  const carousel = useHeroCarousel({
    slides: heroSlides,
    intervalMs: HERO_PIZZA_INTERVAL_MS,
    throwMs: 540,
    swipeMinPx: 56,
  })

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 380)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heroSlide = carousel.slide
  const heroSlideAtivo = carousel.slideAtivo
  const heroThrowing = carousel.throwing
  const captionSlide =
    carousel.throwState.phase === 'running' ? carousel.throwState.to : heroSlide

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const onHeroVisualPointerDown = carousel.onPointerDown
  const onHeroVisualPointerUp = carousel.onPointerUp
  const onHeroVisualPointerCancel = carousel.onPointerCancel

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
            <div className={`hero__pizza-stage${heroThrowing ? ' hero__pizza-stage--throwing' : ''}`}>
              {carousel.throwState.phase === 'running' ? (
                <>
                  <div
                    className={`hero__pizza-layer hero__pizza-layer--absolute hero__pizza-layer--out hero__pizza-layer--out-${carousel.throwState.dir}`}
                  >
                    <img
                      className={heroPizzaImgClass(carousel.throwState.from, heroCategoria)}
                      src={carousel.throwState.from.src}
                      alt=""
                      width={480}
                      height={480}
                      decoding="async"
                    />
                  </div>
                  <div
                    className={`hero__pizza-layer hero__pizza-layer--absolute hero__pizza-layer--in hero__pizza-layer--in-${carousel.throwState.dir}`}
                  >
                    <img
                      className={heroPizzaImgClass(carousel.throwState.to, heroCategoria)}
                      src={carousel.throwState.to.src}
                      alt={`${carousel.throwState.to.nome} — Don Salerno`}
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
            <figcaption
              className={`hero__pizza-nome${heroCategoria === 'bebidas' || heroCategoria === 'combos' ? ' hero__pizza-nome--bebidas' : ''}`}
            >
              {captionSlide.nome}
            </figcaption>
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
