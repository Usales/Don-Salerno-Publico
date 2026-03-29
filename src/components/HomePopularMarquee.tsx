import { Link } from 'react-router-dom'
import type { Produto } from '@/types'
import { brl } from '@/lib/format'
import { useInfiniteMarqueeDrag } from '@/hooks/useInfiniteMarqueeDrag'

export function HomePopularMarquee({ items }: { items: Produto[] }) {
  const {
    marqueeRef,
    trackRef,
    firstSetRef,
    reducedMotion,
    onPointerDown,
    onLinkClickCapture,
  } = useInfiniteMarqueeDrag({
    autoplaySecondsPerPeriod: 55,
    autoplayDirection: -1,
    measurementKey: items,
  })

  const trackClass = `home-popular__marquee-track${reducedMotion ? '' : ' home-popular__marquee-track--js'}`

  return (
    <div
      ref={marqueeRef}
      className="home-popular__marquee"
      aria-label="Faixa com pratos populares em movimento contínuo; arraste para impulsionar"
      onPointerDown={onPointerDown}
      role="presentation"
    >
      <div ref={trackRef} className={trackClass}>
        <div ref={firstSetRef} className="home-popular__marquee-set">
          {items.map((p) => {
            const resumo =
              p.descricao.length > 72 ? `${p.descricao.slice(0, 72)}…` : p.descricao
            return (
              <Link
                key={p.id}
                to={`/produto/${p.id}`}
                className="home-pop-card"
                onClickCapture={onLinkClickCapture}
              >
                <div className="home-pop-card__img-wrap">
                  <img
                    className="home-pop-card__img"
                    src={p.imagemDestaque ?? p.imagem}
                    alt={p.nome}
                    width={144}
                    height={144}
                    loading="lazy"
                  />
                </div>
                <h3 className="home-pop-card__nome">{p.nome}</h3>
                <p className="home-pop-card__desc">{resumo}</p>
                <p className="home-pop-card__preco">{brl(p.precos.P)}</p>
              </Link>
            )
          })}
        </div>
        <div className="home-popular__marquee-set" aria-hidden="true">
          {items.map((p) => {
            const resumo =
              p.descricao.length > 72 ? `${p.descricao.slice(0, 72)}…` : p.descricao
            return (
              <Link
                key={`${p.id}-dup`}
                to={`/produto/${p.id}`}
                className="home-pop-card"
                tabIndex={-1}
                onClickCapture={onLinkClickCapture}
              >
                <div className="home-pop-card__img-wrap">
                  <img
                    className="home-pop-card__img"
                    src={p.imagemDestaque ?? p.imagem}
                    alt=""
                    width={144}
                    height={144}
                    loading="lazy"
                  />
                </div>
                <h3 className="home-pop-card__nome">{p.nome}</h3>
                <p className="home-pop-card__desc">{resumo}</p>
                <p className="home-pop-card__preco">{brl(p.precos.P)}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
