import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Produto } from '@/types'
import { brl } from '@/lib/format'

const produtoPath = (id: string) => `/produto/${id}`

function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden fill="none">
      <circle cx="9" cy="20" r="1" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="20" r="1" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 3h2l1.5 9h11.2a1 1 0 0 0 1-.8l1.8-6.2H7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconEye() {
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden fill="none">
      <path
        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function CardapioProductCard({ produto: p }: { produto: Produto }) {
  const [favorito, setFavorito] = useState(false)
  const to = produtoPath(p.id)

  const toggleFav = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorito((v) => !v)
  }, [])

  return (
    <article className="pcard">
      <div className="pcard__pattern" aria-hidden />
      <Link to={to} className="pcard__link">
        <div className="pcard__img-wrap">
          <img
            className="pcard__img"
            src={p.imagemDestaque ?? p.imagem}
            alt={p.nome}
            width={128}
            height={128}
            loading="lazy"
            decoding="async"
          />
        </div>
        <h3 className="pcard__nome">{p.nome}</h3>
        <p className="pcard__meta">{p.descricao}</p>
        <div className="pcard__preco-block">
          <span className="pcard__preco-label">A partir de</span>
          <span className="pcard__preco">{brl(p.precos.P)}</span>
        </div>
      </Link>
      <button
        type="button"
        className={`pcard__fav${favorito ? ' pcard__fav--on' : ''}`}
        onClick={toggleFav}
        aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={favorito}
      >
        <IconHeart filled={favorito} />
      </button>
      <div className="pcard__rail" role="group" aria-label="Ações rápidas do item">
        <button
          type="button"
          className={`pcard__rail-btn pcard__rail-btn--heart${favorito ? ' pcard__rail-btn--heart-on' : ''}`}
          onClick={toggleFav}
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={favorito}
        >
          <IconHeart filled={favorito} />
        </button>
        <Link to={to} className="pcard__rail-btn pcard__rail-btn--ghost" aria-label={`${p.nome} — ver detalhes e pedir`}>
          <IconCart />
        </Link>
        <Link to={to} className="pcard__rail-btn pcard__rail-btn--ghost" aria-label={`${p.nome} — visualização rápida`}>
          <IconEye />
        </Link>
      </div>
    </article>
  )
}
