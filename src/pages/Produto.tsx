import { Fragment, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { rotulosCategoria } from '@/data/categorias'
import { getProdutoPorId } from '@/data/produtos'
import { brl } from '@/lib/format'
import { useAuth } from '@/stores/useAuth'
import { useCart } from '@/stores/useCart'
import { useReviews } from '@/stores/useReviews'
import type { TamanhoCodigo } from '@/types'
function PassoTextoReceita({ texto }: { texto: string }) {
  const linhas = texto.split('\n')
  return (
    <p className="receita-como__passo-txt">
      {linhas.map((linha, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {linha}
        </Fragment>
      ))}
    </p>
  )
}

export function Produto() {
  const { id: idParam } = useParams<{ id: string }>()
  const p = idParam ? getProdutoPorId(idParam) : undefined
  const reviewProdutoId = p?.id ?? idParam ?? ''
  const usuario = useAuth((s) => s.usuario)
  const adicionarReview = useReviews((s) => s.adicionar)
  const listaReviews = useReviews(
    useShallow((s) => s.porProduto(reviewProdutoId)),
  )

  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [tamanho, setTamanho] = useState<TamanhoCodigo>('M')
  const [feedbackCarrinho, setFeedbackCarrinho] = useState(false)
  const adicionarAoCarrinho = useCart((s) => s.adicionar)

  if (!p) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <p>Produto não encontrado.</p>
        <Link to="/cardapio/pizzas">Voltar ao cardápio</Link>
      </div>
    )
  }

  const produto = p

  function enviarReview(e: FormEvent) {
    e.preventDefault()
    if (!usuario) return
    adicionarReview({
      produtoId: produto.id,
      usuarioId: usuario.id,
      nome: usuario.nome,
      nota,
      comentario: comentario.trim() || 'Sem comentário',
    })
    setComentario('')
  }

  return (
    <article className="container" style={{ padding: '2rem 1rem', maxWidth: 720 }}>
      <nav aria-label="Navegação estrutural">
        <Link to={`/cardapio/${produto.categoria}`}>← {rotulosCategoria[produto.categoria]}</Link>
      </nav>
      <header style={{ marginTop: '1rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>{produto.nome}</h1>
        <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
          {produto.receita?.resumo ?? produto.descricao}
        </p>
        {produto.receita && (
          <ul className="receita-topicos" aria-label="Tópicos da receita">
            {produto.receita.topicos.map((t) => (
              <li key={t} className="receita-topicos__item">
                {t}
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: '1rem' }}>
          Sai do forno em cerca de {produto.tempoPreparoMin} minutos.
        </p>
      </header>

      {produto.receita?.fichaTecnica && (
        <dl className="receita-ficha-tecnica">
          <dt>Origem</dt>
          <dd>{produto.receita.fichaTecnica.origem}</dd>
          {produto.receita.fichaTecnica.farinhaTipo != null && (
            <>
              <dt>Farinha</dt>
              <dd>{produto.receita.fichaTecnica.farinhaTipo}</dd>
            </>
          )}
          {produto.receita.fichaTecnica.proteina != null && (
            <>
              <dt>Proteína (referência)</dt>
              <dd>{produto.receita.fichaTecnica.proteina}</dd>
            </>
          )}
          {produto.receita.fichaTecnica.hidratacao != null && (
            <>
              <dt>Hidratação</dt>
              <dd>{produto.receita.fichaTecnica.hidratacao}</dd>
            </>
          )}
          {produto.receita.fichaTecnica.tomate != null && (
            <>
              <dt>Tomate</dt>
              <dd>{produto.receita.fichaTecnica.tomate}</dd>
            </>
          )}
          {produto.receita.fichaTecnica.acidez != null && (
            <>
              <dt>Acidez (referência)</dt>
              <dd>{produto.receita.fichaTecnica.acidez}</dd>
            </>
          )}
          {produto.receita.fichaTecnica.textura != null && (
            <>
              <dt>Textura</dt>
              <dd>{produto.receita.fichaTecnica.textura}</dd>
            </>
          )}
        </dl>
      )}

      {produto.receita?.ingredientesPorSecao && produto.receita.ingredientesPorSecao.length > 0 ? (
        <section className="receita-ingredientes" aria-labelledby="ing-medidas-titulo">
          <h2 id="ing-medidas-titulo" className="receita-como__titulo">
            Ingredientes com medidas
          </h2>
          {produto.receita.ingredientesPorSecao.map((secao) => (
            <div key={secao.titulo} className="receita-ingredientes__bloco">
              <h3 className="receita-ingredientes__sub">{secao.titulo}</h3>
              <table className="receita-medidas">
                <thead>
                  <tr>
                    <th scope="col">Ingrediente</th>
                    <th scope="col">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {secao.itens.map((row) => (
                    <tr key={row.nome}>
                      <td>{row.nome}</td>
                      <td>{row.quantidade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      ) : (
        <section className="produto-ingredientes" aria-labelledby="ing-produto-titulo">
          <h2 id="ing-produto-titulo" className="receita-como__titulo">
            Ingredientes selecionados
          </h2>
          <ul className="produto-ingredientes__lista">
            {produto.ingredientes.map((ing, i) => (
              <li key={`${ing}-${i}`}>{ing}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="produto-foto-wrap">
        <img
          className="produto-foto"
          src={produto.imagem}
          alt={produto.nome}
          decoding="async"
          loading="lazy"
        />
      </div>

      <section className="produto-comprar" aria-labelledby="produto-comprar-titulo" style={{ marginTop: '1.75rem' }}>
        <h2 id="produto-comprar-titulo" className="receita-como__titulo">
          Montar pedido
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label htmlFor="produto-tamanho" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
              Tamanho
            </label>
            <select
              id="produto-tamanho"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value as TamanhoCodigo)}
              style={{ minWidth: 200, padding: '0.5rem 0.65rem', fontSize: '1rem' }}
            >
              <option value="P">P — {brl(produto.precos.P)}</option>
              <option value="M">M — {brl(produto.precos.M)}</option>
              <option value="G">G — {brl(produto.precos.G)}</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn--primario"
            onClick={() => {
              adicionarAoCarrinho(produto, tamanho)
              setFeedbackCarrinho(true)
              window.setTimeout(() => setFeedbackCarrinho(false), 2200)
            }}
          >
            Adicionar ao carrinho
          </button>
          <Link to="/carrinho" className="btn btn--secundario" style={{ textDecoration: 'none' }}>
            Ver carrinho
          </Link>
        </div>
        {feedbackCarrinho ? (
          <p style={{ margin: '0.75rem 0 0', color: 'var(--brand)', fontWeight: 600 }} role="status">
            Adicionado ao carrinho.
          </p>
        ) : null}
      </section>

      {produto.receita ? (
        <section className="receita-como" aria-labelledby="como-receita-titulo">
          <h2 id="como-receita-titulo" className="receita-como__titulo">
            {produto.receita.tituloSecaoComo ?? 'Como criar a receita'}
          </h2>
          <ol className="receita-como__lista">
            {produto.receita.etapas.map((e, i) => (
              <li key={`${e.titulo}-${i}`}>
                <h3 className="receita-como__passo-titulo">{e.titulo}</h3>
                <PassoTextoReceita texto={e.texto} />
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section style={{ marginTop: '2rem' }} aria-labelledby="reviews-titulo">
        <h2 id="reviews-titulo" className="processo__titulo">
          Avaliações
        </h2>
        {listaReviews.length === 0 && <p>Nenhuma avaliação ainda. Seja o primeiro!</p>}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {listaReviews.map((r) => (
            <li key={r.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <strong>{r.nome}</strong> — {r.nota}/5
              <p style={{ margin: '0.35rem 0 0' }}>{r.comentario}</p>
            </li>
          ))}
        </ul>
        {usuario ? (
          <form onSubmit={enviarReview} style={{ marginTop: '1rem' }}>
            <label htmlFor="nota" style={{ display: 'block', fontWeight: 600 }}>
              Nota
            </label>
            <select id="nota" value={nota} onChange={(e) => setNota(Number(e.target.value))}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <label htmlFor="com" style={{ display: 'block', fontWeight: 600, marginTop: 8 }}>
              Comentário
            </label>
            <textarea id="com" value={comentario} onChange={(e) => setComentario(e.target.value)} rows={3} style={{ width: '100%', maxWidth: '100%' }} />
            <button type="submit" className="btn btn--secundario" style={{ marginTop: 8 }}>
              Publicar
            </button>
          </form>
        ) : (
          <p>
            <Link to="/conta">Entre na conta</Link> para avaliar esta receita.
          </p>
        )}
      </section>
    </article>
  )
}
