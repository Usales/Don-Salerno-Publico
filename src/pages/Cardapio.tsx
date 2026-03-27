import { NavLink, Navigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import type { Categoria } from '@/types'
import { categoriasOrdenadas, rotulosCategoria } from '@/data/categorias'
import { produtos } from '@/data/produtos'

const validas = categoriasOrdenadas

export function Cardapio() {
  const { categoria } = useParams<{ categoria: string }>()
  const cat = (categoria?.toLowerCase() as Categoria) || 'massas'

  if (!categoria || !validas.includes(cat)) {
    return <Navigate to="/cardapio/massas" replace />
  }

  const lista = produtos.filter((p) => p.categoria === cat)

  return (
    <section className="page-section">
      <div className="container">
        <h1 className="page-title">Receitas</h1>

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
        </div>
      </div>
    </section>
  )
}
