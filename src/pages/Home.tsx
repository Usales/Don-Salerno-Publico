import { Link } from 'react-router-dom'
import { JsonLdRestaurant } from '@/lib/seo'
import { produtos } from '@/data/produtos'

export function Home() {
  const destaques = produtos.slice(0, 4)

  return (
    <div>
      <JsonLdRestaurant />
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow">Pizzaria &amp; esfiharia</p>
          <h1 className="hero__titulo">Tudo para matar a fome com sabor</h1>
          <p className="hero__sub">
            Massas, molhos e recheios artesanais. Veja as receitas e combine com uma visita — horários em Contato.
          </p>
          <div className="hero__acoes">
            <Link to="/cardapio/massas" className="btn btn--primario">
              Ver receitas
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="section-head">
            <p className="section-head__label">Populares</p>
            <h2 className="section-head__title">Destaques</h2>
          </div>
          <div className="menu-panel">
            <div className="pgrid">
              {destaques.map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="pcard">
                  <img className="pcard__img" src={p.imagem} alt="" width={72} height={72} loading="lazy" />
                  <div className="pcard__body">
                    <h3 className="pcard__nome">{p.nome}</h3>
                    <p className="pcard__meta">~{p.tempoPreparoMin} min · artesanal</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
