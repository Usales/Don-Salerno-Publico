import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { ComboDualImage } from '@/components/ComboDualImage'
import { EmptyStateMascote } from '@/components/EmptyStateMascote'
import { ProdutoReviews } from '@/components/ProdutoReviews'
import { rotulosCategoria } from '@/data/categorias'
import { getProdutoPorId, getProdutosPorCategoria, PEDIDO_MINIMO_ESFIHAS } from '@/data/produtos'
import { usePageTitle } from '@/hooks/usePageTitle'
import { brl } from '@/lib/format'
import { produtoPath } from '@/lib/produtoPath'
import { useCart } from '@/stores/useCart'
import { useReviews } from '@/stores/useReviews'
import type { CarrinhoAdicional, ComboSelecao, PartesPizza, TamanhoCodigo } from '@/types'
import './Produto.css'

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
  const { slug: slugParam } = useParams<{ slug: string; categoria?: string }>()
  const navigate = useNavigate()
  const param = slugParam ?? ''
  const p = param ? getProdutoPorId(param) : undefined

  usePageTitle(p ? `${p.nome} — Cardápio` : 'Produto não encontrado')

  useEffect(() => {
    if (!p) return
    const canonical = produtoPath(p)
    if (window.location.pathname !== canonical) {
      navigate(canonical, { replace: true })
    }
  }, [p, navigate])

  const reviewProdutoId = p?.id ?? param
  const listaReviews = useReviews(useShallow((s) => s.porProduto(reviewProdutoId)))

  const [feedbackCarrinho, setFeedbackCarrinho] = useState(false)
  const adicionarAoCarrinho = useCart((s) => s.adicionar)
  const [tamanho, setTamanho] = useState<TamanhoCodigo>('P')
  const [qtdCompra, setQtdCompra] = useState(1)
  const [partes, setPartes] = useState<PartesPizza>('inteira')
  const [segundoSaborId, setSegundoSaborId] = useState('')
  const [adicionalIds, setAdicionalIds] = useState<string[]>([])
  const [comboSelecoes, setComboSelecoes] = useState<Record<string, string>>({})
  const categoriaProduto = p?.categoria
  const tamanhosDisponiveis = useMemo<TamanhoCodigo[]>(
    () =>
      categoriaProduto === 'esfihas' ||
      categoriaProduto === 'bebidas' ||
      categoriaProduto === 'combos'
        ? ['P']
        : categoriaProduto === 'pizzas'
          ? ['P', 'G']
          : ['P', 'M', 'G'],
    [categoriaProduto],
  )
  const rotuloTamanho = useMemo<Record<TamanhoCodigo, string>>(
    () =>
      categoriaProduto === 'bebidas'
          ? { P: '500 ml', M: '500 ml', G: '500 ml' }
          : categoriaProduto === 'combos'
            ? { P: 'Combo', M: 'Combo', G: 'Combo' }
            : categoriaProduto === 'pizzas'
              ? {
                  P: 'Brotinho - 25CM (6 fatias)',
                  M: 'M',
                  G: 'Grande 35CM (8 fatias)',
                }
              : { P: 'P', M: 'M', G: 'G' },
    [categoriaProduto],
  )

  useEffect(() => {
    if (!tamanhosDisponiveis.includes(tamanho)) {
      setTamanho(tamanhosDisponiveis[0])
    }
  }, [tamanho, tamanhosDisponiveis])

  useEffect(() => {
    if (!p) return
    setQtdCompra(1)
    setPartes('inteira')
    setSegundoSaborId('')
    setAdicionalIds([])
    setComboSelecoes({})
  }, [p?.id])

  const outrasPizzas = useMemo(() => {
    if (!p || p.categoria !== 'pizzas') return []
    return getProdutosPorCategoria('pizzas')
      .filter((x) => x.id !== p.id)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }, [p])

  const adicionaisSelecionados = useMemo((): CarrinhoAdicional[] => {
    if (!p) return []
    const set = new Set(adicionalIds)
    return p.adicionais.filter((a) => set.has(a.id)).map((a) => ({ id: a.id, nome: a.nome, preco: a.preco }))
  }, [p, adicionalIds])

  const precoBaseTamanho = useMemo(() => {
    if (!p) return 0
    const p1 = p.precos[tamanho]
    if (partes !== 'meio-meio' || !segundoSaborId) return p1
    const p2 = getProdutoPorId(segundoSaborId)
    if (!p2) return p1
    return Math.max(p1, p2.precos[tamanho])
  }, [p, tamanho, partes, segundoSaborId])

  const comboIncompleto = useMemo(() => {
    if (!p?.comboItens?.length) return false
    return p.comboItens.some((slot) => !comboSelecoes[slot.id])
  }, [p, comboSelecoes])

  const imagemComboAtiva = useMemo(() => {
    if (!p || p.categoria !== 'combos' || !p.comboItens?.length) return null
    const slotPizza = p.comboItens.find((s) => s.opcoesIds.some((oid) => getProdutoPorId(oid)?.categoria === 'pizzas'))
    if (!slotPizza) return null
    const selecionadoId = comboSelecoes[slotPizza.id]
    if (!selecionadoId) return null
    const pizzaSelecionada = getProdutoPorId(selecionadoId)
    return pizzaSelecionada?.imagemDestaque ?? pizzaSelecionada?.imagem ?? null
  }, [p, comboSelecoes])

  if (!p) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div className="empty-state-page">
          <EmptyStateMascote alt="Produto não encontrado" />
          <h1>Página não encontrada</h1>
          <p>Produto não encontrado.</p>
          <Link to="/">Voltar ao início</Link>
        </div>
      </div>
    )
  }

  const produto = p

  const extrasSoma = adicionaisSelecionados.reduce((s, a) => s + a.preco, 0)
  const precoUnitario = Math.round((precoBaseTamanho + extrasSoma) * 100) / 100
  const valorExibido = Math.round(precoUnitario * qtdCompra * 100) / 100

  const bloqueadoMeioMeio =
    produto.categoria === 'pizzas' && partes === 'meio-meio' && segundoSaborId.length === 0

  const bloqueadoCombo = produto.categoria === 'combos' && comboIncompleto

  const bloqueado = bloqueadoMeioMeio || bloqueadoCombo

  function toggleAdicional(id: string) {
    setAdicionalIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
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
          {produto.categoria === 'esfihas' ? (
            <p className="cardapio-aviso" role="note">
              {brl(produto.precos.P)} por unidade. Pedido mínimo de esfihas: {brl(PEDIDO_MINIMO_ESFIHAS)}.
            </p>
          ) : null}
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
            {produto.categoria === 'bebidas'
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
                pizzaSrc={imagemComboAtiva ?? produto.comboVisual.pizza}
                bebidaSrc={produto.comboVisual.bebida}
                alt={produto.nome}
              />
            ) : imagemComboAtiva ? (
              <img
                className="produto-foto"
                src={imagemComboAtiva}
                alt={`Pizza selecionada no combo`}
                width={320}
                height={320}
                decoding="async"
                loading="eager"
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

          {/* Seleções de combo (sabores de pizza, bebidas) */}
          {produto.comboItens?.length ? (
            <div className="produto-montar__combo-selecoes">
              {produto.comboItens.map((slot) => {
                const opcoes = slot.opcoesIds.map((oid) => getProdutoPorId(oid)).filter(Boolean)
                const selecionado = comboSelecoes[slot.id] ?? ''
                return (
                  <div key={slot.id} className="produto-montar__combo-slot">
                    <label className="produto-montar__field-label" htmlFor={`combo-${slot.id}`}>
                      {slot.titulo}
                    </label>
                    <select
                      id={`combo-${slot.id}`}
                      className="produto-montar__select"
                      value={selecionado}
                      onChange={(e) =>
                        setComboSelecoes((prev) => ({ ...prev, [slot.id]: e.target.value }))
                      }
                      required
                    >
                      <option value="">Escolha o sabor</option>
                      {opcoes.map((op) => (
                        <option key={op!.id} value={op!.id}>
                          {op!.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          ) : null}

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
                      (regra usual de pizzaria).
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
              disabled={bloqueado}
              title={
                bloqueadoMeioMeio
                  ? 'Selecione o segundo sabor para meio a meio'
                  : bloqueadoCombo
                    ? 'Selecione todos os itens do combo'
                    : undefined
              }
              onClick={() => {
                if (bloqueado) return
                const segundo =
                  partes === 'meio-meio' && segundoSaborId
                    ? (() => {
                        const pz = getProdutoPorId(segundoSaborId)
                        return pz ? { produtoId: pz.id, nome: pz.nome } : undefined
                      })()
                    : undefined
                const selecoes: ComboSelecao[] | undefined = produto.comboItens?.length
                  ? produto.comboItens.map((slot) => {
                      const prod = getProdutoPorId(comboSelecoes[slot.id] ?? '')
                      return {
                        slotId: slot.id,
                        titulo: slot.titulo,
                        produtoId: comboSelecoes[slot.id] ?? '',
                        nome: prod?.nome ?? '',
                        quantidade: slot.quantidade,
                      }
                    })
                  : undefined
                adicionarAoCarrinho(produto, tamanho, {
                  quantidade: qtdCompra,
                  partes: produto.categoria === 'pizzas' ? partes : undefined,
                  segundoSabor: segundo,
                  adicionais: adicionaisSelecionados.length ? adicionaisSelecionados : undefined,
                  comboSelecoes: selecoes,
                })
                setFeedbackCarrinho(true)
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

      <ProdutoReviews produtoId={produto.id} avaliacoes={listaReviews} />
    </article>
  )
}
