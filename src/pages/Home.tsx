import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { JsonLdRestaurant } from '@/lib/seo'
import { brl } from '@/lib/format'
import { produtos } from '@/data/produtos'
import './Home.css'

const populares = produtos.filter((p) => p.categoria === 'pizzas').slice(0, 4)

const banners = [
  {
    tag: 'Na semana',
    title: 'Pizza forno alto',
    sub: 'Oferta por tempo limitado',
    ctaClass: 'home-banner__cta--red' as const,
    to: '/cardapio/pizzas',
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80&auto=format&fit=crop',
    imgAlt: 'Hambúrguer e combo',
  },
  {
    tag: 'Don Salerno',
    title: 'Esfihas & abertas',
    sub: 'Receita do dia',
    ctaClass: 'home-banner__cta--orange' as const,
    to: '/cardapio/esfihas',
    img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&auto=format&fit=crop',
    imgAlt: 'Esfihas e salgados',
  },
  {
    tag: 'Especial',
    title: 'Calzone crocante',
    sub: 'Sabor intenso',
    ctaClass: 'home-banner__cta--red' as const,
    to: '/produto/c1',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749fdcb608?w=400&q=80&auto=format&fit=crop',
    imgAlt: 'Calzone',
  },
]

export function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 380)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div>
      <JsonLdRestaurant />
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow">Pizzaria &amp; esfiharia</p>
          <h1 className="hero__titulo">Tudo para matar a fome com sabor</h1>
          <p className="hero__sub">
            Pizzas, esfihas e muito mais. Veja o cardápio e combine com uma visita — horários em Contato.
          </p>
          <div className="hero__acoes">
            <Link to="/cardapio/pizzas" className="btn btn--primario">
              Ver cardápio
            </Link>
          </div>
        </div>
      </section>

      <section className="home-popular" aria-labelledby="home-popular-titulo">
        <div className="container">
          <h2 id="home-popular-titulo" className="home-popular__title">
            Popular Food Items
          </h2>
          <div className="home-popular__grid">
            {populares.map((p) => (
              <Link key={p.id} to={`/produto/${p.id}`} className="home-pop-card">
                <div className="home-pop-card__img-wrap">
                  <img className="home-pop-card__img" src={p.imagem} alt="" width={96} height={96} loading="lazy" />
                </div>
                <h3 className="home-pop-card__nome">{p.nome}</h3>
                <p className="home-pop-card__desc">Receita artesanal · forno alto</p>
                <p className="home-pop-card__preco">{brl(p.precos.P)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-banners" aria-label="Promoções">
        <div className="container">
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
