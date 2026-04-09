import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { ComboDualImage } from '@/components/ComboDualImage'
import { EmptyStateMascote } from '@/components/EmptyStateMascote'
import { rotulosCategoria } from '@/data/categorias'
import { getProdutoPorId, getProdutosPorCategoria } from '@/data/produtos'
import { brl } from '@/lib/format'
import { useAuth } from '@/stores/useAuth'
import { useCart } from '@/stores/useCart'
import { useReviews } from '@/stores/useReviews'
import type { CarrinhoAdicional, Categoria, PartesPizza, TamanhoCodigo } from '@/types'
import './Produto.css'

/** Tempo para o toast de confirmação aparecer antes do redirect do fluxo de montagem do pedido. */
const CARRINHO_TOAST_NAV_DELAY_MS = 1600

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
  const navigate = useNavigate()
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
  const [tamanho, setTamanho] = useState<TamanhoCodigo>('P')
  const [qtdCompra, setQtdCompra] = useState(1)
  const [partes, setPartes] = useState<PartesPizza>('inteira')
  const [segundoSaborId, setSegundoSaborId] = useState('')
  const [adicionalIds, setAdicionalIds] = useState<string[]>([])
  const [feedbackCarrinho, setFeedbackCarrinho] = useState(false)
  const adicionarAoCarrinho = useCart((s) => s.adicionar)
  const categoriaProduto = p?.categoria
  const fluxoProximaCategoria: Record<Categoria, Categoria | 'carrinho'> = {
    pizzas: 'esfihas',
    esfihas: 'calzones',
    calzones: 'combos',
    combos: 'sobremesas',
    sobremesas: 'bebidas',
    bebidas: 'carrinho',
  }
  const tamanhosDisponiveis = useMemo<TamanhoCodigo[]>(
    () =>
      categoriaProduto === 'esfihas' ||
      categoriaProduto === 'bebidas' ||
      categoriaProduto === 'combos'
        ? ['P']
        : ['P', 'M', 'G'],
    [categoriaProduto],
  )
  const rotuloTamanho = useMemo<Record<TamanhoCodigo, string>>(
    () =>
      categoriaProduto === 'sobremesas'
        ? { P: '1', M: '5', G: '10' }
        : categoriaProduto === 'bebidas'
          ? { P: '500 ml', M: '500 ml', G: '500 ml' }
          : categoriaProduto === 'combos'
            ? { P: 'Combo', M: 'Combo', G: 'Combo' }
            : { P: 'P', M: 'M', G: 'G' },
    [categoriaProduto],
  )

  useEffect(() => {
    if (!tamanhosDisponiveis.includes(tamanho)) {
      setTamanho(tamanhosDisponiveis[0])
    }
  }, [tamanho, tamanhosDisponiveis])

  if (!p) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="empty-state-page">
          <EmptyStateMascote alt="Produto não encontrado" />
          <p>Produto não encontrado.</p>
          <Link to="/cardapio/pizzas">Voltar ao cardápio</Link>
        </div>
      </div>
    )
  }

  const produto = p

  useEffect(() => {
    setQtdCompra(1)
    setPartes('inteira')
    setSegundoSaborId('')
    setAdicionalIds([])
  }, [produto.id])

  const outrasPizzas = useMemo(() => {
    if (produto.categoria !== 'pizzas') return []
    return getProdutosPorCategoria('pizzas')
      .filter((x) => x.id !== produto.id)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [produto.categoria, produto.id])

  const adicionaisSelecionados = useMemo((): CarrinhoAdicional[] => {
    const set = new Set(adicionalIds)
    return produto.adicionais.filter((a) => set.has(a.id)).map((a) => ({ id: a.id, nome: a.nome, preco: a.preco }))
  }, [produto.adicionais, adicionalIds])

  const precoBaseTamanho = useMemo(() => {
    const p1 = produto.precos[tamanho]
    if (partes !== 'meio-meio' || !segundoSaborId) return p1
    const p2 = getProdutoPorId(segundoSaborId)
    if (!p2) return p1
    return Math.max(p1, p2.precos[tamanho])
  }, [produto, tamanho, partes, segundoSaborId])

  const extrasSoma = adicionaisSelecionados.reduce((s, a) => s + a.preco, 0)
  const precoUnitario = Math.round((precoBaseTamanho + extrasSoma) * 100) / 100
  const valorExibido = Math.round(precoUnitario * qtdCompra * 100) / 100

  const bloqueadoMeioMeio =
    produto.categoria === 'pizzas' && partes === 'meio-meio' && segundoSaborId.length === 0

  function toggleAdicional(id: string) {
    setAdicionalIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

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
    <article className="container produto-page">
      <nav className="produto-page__nav" aria-label="Navegação estrutural">
        <Link to={`/cardapio/${produto.categoria}`}>← {rotulosCategoria[produto.categoria]}</Link>
      </nav>

      <div className="produto-hero">
        <header className="produto-hero__texto">
          <h1 className="produto-hero__titulo">{produto.nome}</h1>
          <p className="produto-hero__descricao">
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
          <p className="produto-hero__tempo">
            {produto.categoria === 'sobremesas'
              ? 'Sai da geladeira em 10 minutos.'
              : produto.categoria === 'bebidas'
                ? 'Bebida gelada — retirada rápida no balcão.'
                : produto.categoria === 'combos'
                  ? `Preparo combinado dos itens do pacote — cerca de ${produto.tempoPreparoMin} minutos. Combine sabores no pedido.`
                  : `Sai do forno em cerca de ${produto.tempoPreparoMin} minutos.`}
          </p>
        </header>
        <div className="produto-hero__media">
          <div className={`produto-foto-wrap${produto.comboVisual ? ' produto-foto-wrap--combo' : ''}`}>
            {produto.comboVisual ? (
              <ComboDualImage
                layout="hero"
                pizzaSrc={produto.comboVisual.pizza}
                bebidaSrc={produto.comboVisual.bebida}
                alt={produto.nome}
              />
            ) : (
              <img
                className="produto-foto"
                src={produto.imagemDestaque ?? produto.imagem}
                alt={produto.nome}
                width={320}
                height={320}
                decoding="async"
                loading="eager"
              />
            )}
          </div>
        </div>
      </div>

      {produto.receita?.fichaTecnica && (
        <dl className="receita-ficha-tecnica produto-bloco-apos-hero">
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
        <section className="receita-ingredientes produto-bloco-apos-hero" aria-labelledby="ing-medidas-titulo">
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
        <section className="produto-ingredientes produto-bloco-apos-hero" aria-labelledby="ing-produto-titulo">
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

      {produto.adicionais.length > 0 ? (
        <section className="produto-adicionais produto-bloco-apos-hero" aria-labelledby="adic-produto-titulo">
          <h2 id="adic-produto-titulo" className="receita-como__titulo">
            Adicionais
          </h2>
          <ul className="produto-adicionais__lista">
            {produto.adicionais.map((a) => {
              const marcado = adicionalIds.includes(a.id)
              return (
                <li key={a.id} className="produto-adicionais__item">
                  <label className="produto-adicionais__label">
                    <input
                      type="checkbox"
                      className="produto-adicionais__check"
                      checked={marcado}
                      onChange={() => toggleAdicional(a.id)}
                    />
                    <span className="produto-adicionais__nome">{a.nome}</span>
                    <span className="produto-adicionais__preco">+ {brl(a.preco)}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <section className="produto-comprar produto-bloco-comprar" aria-labelledby="produto-comprar-titulo">
        <h2 id="produto-comprar-titulo" className="receita-como__titulo">
          Montar pedido
        </h2>
        <div className="produto-montar">
          <div className="produto-montar__tamanho">
            <label className="produto-montar__field-label" htmlFor="produto-tamanho">
              {produto.categoria === 'combos' ? 'Pacote' : 'Tamanho'}
            </label>
            <select
              id="produto-tamanho"
              className="produto-montar__select"
              value={tamanho}
              onChange={(e) => setTamanho(e.target.value as TamanhoCodigo)}
              disabled={tamanhosDisponiveis.length === 1}
            >
              {tamanhosDisponiveis.map((t) => (
                <option key={t} value={t}>
                  {rotuloTamanho[t]} — {brl(produto.precos[t])}
                </option>
              ))}
            </select>
          </div>

          <div className="produto-montar__card">
            <div className="produto-montar__col produto-montar__col--esq">
              <div className="produto-montar__bloco-qtd">
                <span className="produto-montar__label" id="label-qtd-produto">
                  Qtd:
                </span>
                <div
                  className="produto-montar__qtd"
                  role="group"
                  aria-labelledby="label-qtd-produto"
                >
                  <button
                    type="button"
                    className="produto-montar__qtd-btn"
                    aria-label="Diminuir quantidade"
                    disabled={qtdCompra <= 1}
                    onClick={() => setQtdCompra((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className="produto-montar__qtd-val" aria-live="polite">
                    {qtdCompra}
                  </span>
                  <button
                    type="button"
                    className="produto-montar__qtd-btn"
                    aria-label="Aumentar quantidade"
                    disabled={qtdCompra >= 99}
                    onClick={() => setQtdCompra((q) => Math.min(99, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="produto-montar__valor">
                <span className="produto-montar__label">Valor:</span>
                <p className="produto-montar__valor-num">{brl(valorExibido)}</p>
              </div>
            </div>

            {produto.categoria === 'pizzas' ? (
              <div className="produto-montar__col produto-montar__col--dir">
                <span className="produto-montar__label produto-montar__label--partes">Partes</span>
                <fieldset className="produto-montar__partes">
                  <legend className="visually-hidden">Inteira ou meio a meio</legend>
                  <label
                    className={`produto-montar__radio ${partes === 'inteira' ? 'produto-montar__radio--ativo' : ''}`}
                  >
                    <input
                      type="radio"
                      className="visually-hidden"
                      name="partes-pizza"
                      value="inteira"
                      checked={partes === 'inteira'}
                      onChange={() => {
                        setPartes('inteira')
                        setSegundoSaborId('')
                      }}
                    />
                    <span className="produto-montar__radio-indic" aria-hidden />
                    Inteira
                  </label>
                  <label
                    className={`produto-montar__radio ${partes === 'meio-meio' ? 'produto-montar__radio--ativo' : ''}`}
                  >
                    <input
                      type="radio"
                      className="visually-hidden"
                      name="partes-pizza"
                      value="meio-meio"
                      checked={partes === 'meio-meio'}
                      onChange={() => setPartes('meio-meio')}
                    />
                    <span className="produto-montar__radio-indic" aria-hidden />
                    Meio a meio
                  </label>
                </fieldset>
                {partes === 'meio-meio' ? (
                  <div className="produto-montar__segundo-sabor">
                    <label className="produto-montar__field-label" htmlFor="produto-segundo-sabor">
                      Segundo sabor
                    </label>
                    <select
                      id="produto-segundo-sabor"
                      className="produto-montar__select produto-montar__select--bloco"
                      value={segundoSaborId}
                      onChange={(e) => setSegundoSaborId(e.target.value)}
                      required={partes === 'meio-meio'}
                    >
                      <option value="">Escolha o outro sabor</option>
                      {outrasPizzas.map((pz) => (
                        <option key={pz.id} value={pz.id}>
                          {pz.nome} — {brl(pz.precos[tamanho])}
                        </option>
                      ))}
                    </select>
                    <p className="produto-montar__partes-dica">
                      O valor segue o tamanho escolhido e o <strong>maior preço</strong> entre as duas metades
                      (regra usual de pizzaria), mais adicionais.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="produto-montar__acoes">
            <button
              type="button"
              className="btn btn--primario"
              disabled={bloqueadoMeioMeio}
              title={bloqueadoMeioMeio ? 'Selecione o segundo sabor para meio a meio' : undefined}
              onClick={() => {
                if (bloqueadoMeioMeio) return
                const segundo =
                  partes === 'meio-meio' && segundoSaborId
                    ? (() => {
                        const pz = getProdutoPorId(segundoSaborId)
                        return pz ? { produtoId: pz.id, nome: pz.nome } : undefined
                      })()
                    : undefined
                adicionarAoCarrinho(produto, tamanho, {
                  quantidade: qtdCompra,
                  partes: produto.categoria === 'pizzas' ? partes : undefined,
                  segundoSabor: segundo,
                  adicionais: adicionaisSelecionados.length ? adicionaisSelecionados : undefined,
                })
                setFeedbackCarrinho(true)
                const next = fluxoProximaCategoria[produto.categoria]
                window.setTimeout(() => {
                  if (next === 'carrinho') {
                    navigate('/carrinho')
                    return
                  }
                  navigate(`/cardapio/${next}`)
                }, CARRINHO_TOAST_NAV_DELAY_MS)
              }}
            >
              Adicionar ao carrinho
            </button>
            <Link to="/carrinho" className="btn btn--secundario produto-montar__link-carrinho">
              Ver carrinho
            </Link>
          </div>
        </div>
        {feedbackCarrinho ? (
          <div className="produto-carrinho-toast" role="status" aria-live="polite">
            <span className="produto-carrinho-toast__check" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="produto-carrinho-toast__msg">Item adicionado ao carrinho.</span>
          </div>
        ) : null}
      </section>

      {produto.receita ? (
        <section className="receita-como produto-bloco-receita" aria-labelledby="como-receita-titulo">
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

      <section className="produto-reviews" aria-labelledby="reviews-titulo">
        <h2 id="reviews-titulo" className="processo__titulo">
          Avaliações
        </h2>
        {listaReviews.length === 0 && <p>Nenhuma avaliação ainda. Seja o primeiro a nos avaliar no Ifood!</p>}
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
        ) : null}
      </section>
    </article>
  )
}
