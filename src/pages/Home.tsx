import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HomeMarqueeStrip } from '@/components/HomeMarqueeStrip'
import { HomePopularMarquee } from '@/components/HomePopularMarquee'
import { JsonLdRestaurant } from '@/lib/seo'
import { rotulosCategoria } from '@/data/categorias'
import { produtos } from '@/data/produtos'
import type { Categoria } from '@/types'
import './Home.css'

const populares = produtos.filter((p) => p.categoria === 'pizzas').slice(0, 4)

const HERO_CALZONES = [
  {
    id: 'calz-pepperoni',
    src: '/hero-calzone-pepperoni.png',
    nome: 'Calzone pepperoni & cebola',
  },
  {
    id: 'calz-presunto',
    src: '/hero-calzone-presunto-queijo.png',
    nome: 'Calzone presunto & queijo',
  },
] as const

const HERO_PIZZA_INTERVAL_MS = 8000

/** Categorias cujo destaque visual no hero não usa rotação contínua (foto fixa). Pizza gira no forno visual. */
const HERO_CATEGORIAS_VISUAL_ESTATICO: Categoria[] = ['calzones', 'sobremesas', 'bebidas']

type HeroSlide = { id: string; src: string; nome: string }

function srcHeroProduto(p: { imagem: string; imagemDestaque?: string }): string {
  return p.imagemDestaque ?? p.imagem
}

function heroSlidesParaCategoria(cat: Categoria): HeroSlide[] {
  if (cat === 'pizzas') {
    return produtos.filter((p) => p.categoria === 'pizzas').map((p) => ({
      id: p.id,
      src: srcHeroProduto(p),
      nome: p.nome,
    }))
  }
  if (cat === 'calzones') {
    return HERO_CALZONES.map((p) => ({ id: p.id, src: p.src, nome: p.nome }))
  }
  const doCardapio = produtos
    .filter((p) => p.categoria === cat)
    .map((p) => ({ id: p.id, src: srcHeroProduto(p), nome: p.nome }))
  if (doCardapio.length > 0) return doCardapio
  return [
    {
      id: `placeholder-${cat}`,
      src: '/logo.svg',
      nome: `${rotulosCategoria[cat]} — veja no cardápio`,
    },
  ]
}

const HERO_CARD_TABS: { categoria: Categoria; label: string }[] = [
  { categoria: 'pizzas', label: 'Pizza' },
  { categoria: 'esfihas', label: 'Esfihas' },
  { categoria: 'calzones', label: 'Calzones' },
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
    title: 'Esfihas & abertas',
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
      setHeroSlideIndex((i) => (i + 1) % n)
    }, HERO_PIZZA_INTERVAL_MS)
    return () => clearInterval(id)
  }, [heroVisualPauseMotion, heroSlides])

  const heroSlide = heroSlides[heroVisualPauseMotion ? 0 : heroSlideIndex] ?? heroSlides[0]
  const heroSlideAtivo = heroVisualPauseMotion ? 0 : heroSlideIndex

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

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
              <Link to={`/cardapio/${heroCategoria}`} className="btn btn--primario">
                Ver cardápio agora
              </Link>
            </div>
          </div>
          <figure
            className="hero__col hero__col--visual"
            aria-live="polite"
            aria-label={`Destaque: ${rotulosCategoria[heroCategoria]}`}
          >
            <img
              key={heroSlide.id}
              className={`hero__pizza${heroSlide.src.endsWith('.svg') ? ' hero__pizza--logo' : ''}${HERO_CATEGORIAS_VISUAL_ESTATICO.includes(heroCategoria) ? ' hero__pizza--static' : ''}`}
              src={heroSlide.src}
              alt={`${heroSlide.nome} — Don Salerno`}
              width={480}
              height={480}
              decoding="async"
            />
            <figcaption className="hero__pizza-nome">{heroSlide.nome}</figcaption>
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
            <div className="home-banners__grid">
              {banners.map((b) => (
                <Link key={b.title} to={b.to} className="home-banner">
                  <span className="home-banner__badge" aria-hidden>
                    50%
                    <br />
                    OFF
                  </span>
                  <div className="home-banner__inner">
                    <span className="home-banner__tag">{b.tag}</span>
                    <p className="home-banner__title">{b.title}</p>
                    <p className="home-banner__sub">{b.sub}</p>
                    <span className={`home-banner__cta ${b.ctaClass}`}>
                      Pedir agora
                      <span aria-hidden> →</span>
                    </span>
                  </div>
                  <img className="home-banner__photo" src={b.img} alt={b.imgAlt} width={200} height={140} loading="lazy" />
                  <div className="home-banner__floor" aria-hidden />
                </Link>
              ))}
            </div>
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
