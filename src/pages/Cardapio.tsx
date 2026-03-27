import { useCallback, useRef } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { Categoria } from '@/types'
import { categoriasOrdenadas, rotulosCategoria } from '@/data/categorias'
import { produtos } from '@/data/produtos'

const validas = categoriasOrdenadas

/** Mínimo horizontal (px) para contar como swipe; evita troca acidental. */
const SWIPE_MIN_DX = 56
/** Se o movimento vertical for maior que esta fração do horizontal, ignora (scroll). */
const SWIPE_VERTICAL_RATIO = 0.65

export function Cardapio() {
  const navigate = useNavigate()
  const { categoria } = useParams<{ categoria: string }>()
  const cat = (categoria?.toLowerCase() as Categoria) || 'pizzas'
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const navCooldown = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current || navCooldown.current) {
        touchStart.current = null
        return
      }
      const t = e.changedTouches[0]
      const dx = t.clientX - touchStart.current.x
      const dy = t.clientY - touchStart.current.y
      touchStart.current = null
      if (Math.abs(dx) < SWIPE_MIN_DX) return
      if (Math.abs(dy) > Math.abs(dx) * SWIPE_VERTICAL_RATIO) return

      const idx = validas.indexOf(cat)
      if (idx < 0) return

      if (dx > 0) {
        // Dedo desliza para a direita → próxima categoria (ex.: Pizzas → Esfihas)
        const next = validas[(idx + 1) % validas.length]
        navigate(`/cardapio/${next}`)
      } else {
        // Deslize para a esquerda → categoria anterior
        const prev = validas[(idx - 1 + validas.length) % validas.length]
        navigate(`/cardapio/${prev}`)
      }

      navCooldown.current = true
      window.setTimeout(() => {
        navCooldown.current = false
      }, 320)
    },
    [cat, navigate],
  )

  if (!categoria || !validas.includes(cat)) {
    return <Navigate to="/cardapio/pizzas" replace />
  }

  const lista = produtos.filter((p) => p.categoria === cat)

  return (
    <section className="page-section">
      <div className="container">
        <h1 className="page-title">Receitas</h1>

        <div
          className="cardapio-swipe"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="tabs-wrap">
            <div className="tabs" role="tablist" aria-label="Categorias de receitas">
              {validas.map((c) => (
                <NavLink key={c} to={`/cardapio/${c}`} role="tab" className={({ isActive }) => (isActive ? 'is-active' : '')}>
                  {rotulosCategoria[c]}
                </NavLink>
              ))}
            </div>
          </div>

          <h2 className="visually-hidden">{rotulosCategoria[cat]}</h2>
          <div className="menu-panel">
            {lista.length === 0 ? (
              <p className="cardapio-vazio" style={{ color: 'var(--text-muted)', margin: '1rem 0 0' }}>
                Itens desta categoria em breve.
              </p>
            ) : (
              <div className="pgrid">
                {lista.map((p) => (
                  <Link key={p.id} to={`/produto/${p.id}`} className="pcard">
                    <img className="pcard__img" src={p.imagem} alt="" width={72} height={72} loading="lazy" />
                    <div className="pcard__body">
                      <h3 className="pcard__nome">{p.nome}</h3>
                      <p className="pcard__meta">{p.descricao.slice(0, 90)}…</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
