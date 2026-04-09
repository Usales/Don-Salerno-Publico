import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { EmptyStateMascote } from '@/components/EmptyStateMascote'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { empresa } from '@/data/empresa'
import { brl } from '@/lib/format'
import { useCart } from '@/stores/useCart'
import './Carrinho.css'

const AVISO_PEDIDO = `Bom dia, cliente!

Não fazemos entregas. Este canal é destinado apenas ao envio de pedidos para o WhatsApp corporativo, onde finalizaremos seu pedido para retirada em nosso endereço. Caso prefira entrega, recomendamos que faça o pedido pelo iFood.

Atenciosamente.

Don Salerno`

export function Carrinho() {
  const [mostrarAvisoPedido, setMostrarAvisoPedido] = useState(false)
  const [avisoPedidoLido, setAvisoPedidoLido] = useState(false)
  const {
    itens,
    observacaoPedido,
    definirQuantidade,
    remover,
    limparCarrinho,
    definirObservacaoPedido,
    subtotal,
    descontoValor,
    total,
  } = useCart(
    useShallow((s) => ({
      itens: s.itens,
      observacaoPedido: s.observacaoPedido ?? '',
      definirQuantidade: s.definirQuantidade,
      remover: s.remover,
      limparCarrinho: s.limparCarrinho,
      definirObservacaoPedido: s.definirObservacaoPedido,
      subtotal: s.subtotal,
      descontoValor: s.descontoValor,
      total: s.total,
    })),
  )

  const onLimparCarrinho = useCallback(() => {
    if (!window.confirm('Deseja remover todos os itens do carrinho?')) return
    limparCarrinho()
  }, [limparCarrinho])

  const enviarPedidoWhatsapp = useCallback(() => {
    const linhas = itens
      .map((linha) => {
        const meioTxt =
          linha.partes === 'meio-meio' && linha.segundoSabor
            ? ` | Meio a meio com ${linha.segundoSabor.nome}`
            : linha.partes === 'meio-meio'
              ? ' | Meio a meio'
              : linha.partes === 'inteira'
                ? ' | Inteira'
                : ''
        const extrasTxt = linha.adicionais?.length
          ? ` | Adicionais: ${linha.adicionais.map((a) => `${a.nome} (${brl(a.preco)})`).join(', ')}`
          : ''
        return (
          `- ${linha.nome}${meioTxt} | Tam. ${linha.tamanho}${extrasTxt} | Qtd: ${linha.quantidade} | Total: ${brl(
            linha.precoUnit * linha.quantidade,
          )}`
        )
      })
      .join('\n')
    const obs = observacaoPedido.trim()
    let mensagemPedido =
      `Olá, Don Salerno! Segue meu pedido:\n\n${linhas}\n\n` +
      `Subtotal: ${brl(subtotal())}\n` +
      `Total: ${brl(total())}`
    if (obs) {
      mensagemPedido += `\n\nObservações / detalhes do pedido:\n${obs}`
    }
    mensagemPedido += '\n\nObrigado!'
    const waUrl = `https://wa.me/${empresa.whatsappDigits}?text=${encodeURIComponent(mensagemPedido)}`

    const win = window.open(waUrl, '_blank', 'noopener,noreferrer')
    if (win != null) {
      limparCarrinho()
      setAvisoPedidoLido(false)
    }
  }, [itens, limparCarrinho, observacaoPedido, subtotal, total])

  const onEnviarPedido = useCallback(() => {
    if (!avisoPedidoLido) {
      setMostrarAvisoPedido(true)
      return
    }
    enviarPedidoWhatsapp()
  }, [avisoPedidoLido, enviarPedidoWhatsapp])

  return (
    <div className="cart-page container">
      <nav className="cart-page__nav" aria-label="Navegação">
        <Link to="/cardapio/pizzas">← Continuar comprando</Link>
      </nav>

      <h1 className="cart-page__titulo">Carrinho</h1>

      {itens.length === 0 ? (
        <div className="empty-state-page cart-page__vazio-bloco">
          <EmptyStateMascote alt="Carrinho vazio" />
          <p className="cart-page__vazio">
            Seu carrinho está vazio.{' '}
            <Link to="/cardapio/pizzas">Ver cardápio</Link>
          </p>
        </div>
      ) : (
        <>
          <div className="cart-table-wrap" role="region" aria-label="Itens do pedido">
            <table className="cart-table">
              <thead>
                <tr>
                  <th scope="col" className="cart-table__th cart-table__th--img">
                    Imagem
                  </th>
                  <th scope="col" className="cart-table__th">
                    Item
                  </th>
                  <th scope="col" className="cart-table__th cart-table__th--num">
                    Preço
                  </th>
                  <th scope="col" className="cart-table__th cart-table__th--qty">
                    Quantidade
                  </th>
                  <th scope="col" className="cart-table__th cart-table__th--num">
                    Total
                  </th>
                  <th scope="col" className="cart-table__th cart-table__th--del">
                    <span className="visually-hidden">Remover</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {itens.map((linha) => (
                  <tr key={linha.id} className="cart-table__row">
                    <td className="cart-table__td cart-table__td--img">
                      <Link to={`/produto/${linha.produtoId}`} className="cart-table__img-link">
                        <img
                          className="cart-table__img"
                          src={linha.imagem}
                          alt=""
                          width={72}
                          height={72}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                    </td>
                    <td className="cart-table__td">
                      <Link to={`/produto/${linha.produtoId}`} className="cart-table__nome">
                        {linha.nome}
                      </Link>
                      <span className="cart-table__tam">
                        Tamanho {linha.tamanho}
                        {linha.partes === 'meio-meio' && linha.segundoSabor
                          ? ` · Meio a meio · ½ ${linha.segundoSabor.nome}`
                          : linha.partes === 'meio-meio'
                            ? ' · Meio a meio'
                            : linha.partes === 'inteira'
                              ? ' · Inteira'
                              : ''}
                      </span>
                      {linha.adicionais?.length ? (
                        <span className="cart-table__extras">
                          + {linha.adicionais.map((a) => a.nome).join(', ')}
                        </span>
                      ) : null}
                    </td>
                    <td className="cart-table__td cart-table__td--num">
                      <strong>{brl(linha.precoUnit)}</strong>
                    </td>
                    <td className="cart-table__td cart-table__td--qty">
                      <div className="cart-qty">
                        <button
                          type="button"
                          className="cart-qty__btn"
                          aria-label="Diminuir quantidade"
                          onClick={() => definirQuantidade(linha.id, linha.quantidade - 1)}
                        >
                          −
                        </button>
                        <span className="cart-qty__val" aria-live="polite">
                          {linha.quantidade}
                        </span>
                        <button
                          type="button"
                          className="cart-qty__btn"
                          aria-label="Aumentar quantidade"
                          onClick={() => definirQuantidade(linha.id, linha.quantidade + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-table__td cart-table__td--num">
                      <strong>{brl(linha.precoUnit * linha.quantidade)}</strong>
                    </td>
                    <td className="cart-table__td cart-table__td--del">
                      <button
                        type="button"
                        className="cart-table__remove"
                        aria-label={`Remover ${linha.nome}`}
                        onClick={() => remover(linha.id)}
                      >
                        <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
                          <path
                            fill="currentColor"
                            d="M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9m0 5h2v9H9V8m4 0h2v9h-2V8z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section
            className="cart-observacao-box"
            aria-labelledby="cart-observacao-titulo"
          >
            <h2 id="cart-observacao-titulo" className="cart-observacao-box__titulo">
              Observações
            </h2>
            <p className="cart-observacao__help" id="cart-observacao-desc">
              Comentários ou detalhes de como prefere o pedido (ex.: ponto da massa, ingredientes a retirar, bem
              passada, horário de retirada). Será enviado junto no WhatsApp.
            </p>
            <textarea
              id="cart-observacao-textarea"
              className="cart-observacao__textarea"
              rows={6}
              maxLength={2000}
              value={observacaoPedido}
              onChange={(e) => definirObservacaoPedido(e.target.value)}
              placeholder="Descreva como prefere seu pedido."
              aria-labelledby="cart-observacao-titulo"
              aria-describedby="cart-observacao-desc"
            />
            <p className="cart-observacao__count" aria-live="polite">
              {observacaoPedido.length}/2000
            </p>
          </section>

          <div className="cart-footer">
            <div className="cart-footer__actions">
              <button
                type="button"
                className="btn btn--primario"
                onClick={onLimparCarrinho}
                aria-label="Limpar carrinho"
              >
                Limpar carrinho
              </button>
              <Link to="/cardapio/pizzas" className="btn btn--primario cart-footer__link-btn">
                Continuar comprando
              </Link>
            </div>

            <dl className="cart-totais">
              <div className="cart-totais__row">
                <dt>Subtotal</dt>
                <dd>{brl(subtotal())}</dd>
              </div>
              {descontoValor() > 0 ? (
                <div className="cart-totais__row cart-totais__row--desconto">
                  <dt>Desconto</dt>
                  <dd>− {brl(descontoValor())}</dd>
                </div>
              ) : null}
              <div className="cart-totais__row cart-totais__row--total">
                <dt>Total</dt>
                <dd>{brl(total())}</dd>
              </div>
            </dl>

            <div className="cart-enviar-wrap">
              <button type="button" className="cart-enviar-btn" onClick={onEnviarPedido}>
                <svg className="cart-enviar-btn__icon" viewBox="0 0 24 24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                Enviar Pedido
              </button>
            </div>
          </div>
        </>
      )}

      {mostrarAvisoPedido
        ? createPortal(
            <div
              className="cart-aviso-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-aviso-titulo"
            >
              <div className="cart-aviso-modal__box">
                <h2 id="cart-aviso-titulo" className="cart-aviso-modal__titulo">
                  Aviso importante
                </h2>
                <p className="cart-aviso-modal__texto">{AVISO_PEDIDO}</p>
                <div className="cart-aviso-modal__acoes">
                  <button
                    type="button"
                    className="btn btn--secundario"
                    onClick={() => setMostrarAvisoPedido(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn--primario cart-aviso-modal__enviar"
                    onClick={() => {
                      setAvisoPedidoLido(true)
                      setMostrarAvisoPedido(false)
                      enviarPedidoWhatsapp()
                    }}
                  >
                    Entendi, enviar pedido
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
