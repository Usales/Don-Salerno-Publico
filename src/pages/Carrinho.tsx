import { useCallback, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { brl } from '@/lib/format'
import { useCart } from '@/stores/useCart'
import './Carrinho.css'

export function Carrinho() {
  const [cupomInput, setCupomInput] = useState('')
  const [cupomMsg, setCupomMsg] = useState<string | null>(null)

  const {
    itens,
    cupomAplicado,
    definirQuantidade,
    remover,
    aplicarCupom,
    limparCupom,
    sincronizarPrecos,
    subtotal,
    descontoValor,
    total,
  } = useCart(
    useShallow((s) => ({
      itens: s.itens,
      cupomAplicado: s.cupomAplicado,
      definirQuantidade: s.definirQuantidade,
      remover: s.remover,
      aplicarCupom: s.aplicarCupom,
      limparCupom: s.limparCupom,
      sincronizarPrecos: s.sincronizarPrecos,
      subtotal: s.subtotal,
      descontoValor: s.descontoValor,
      total: s.total,
    })),
  )

  const onAplicarCupom = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      setCupomMsg(null)
      const r = aplicarCupom(cupomInput)
      if (!r.ok) setCupomMsg(r.mensagem ?? 'Cupom inválido.')
      else if (!cupomInput.trim()) {
        limparCupom()
        setCupomMsg(null)
      } else {
        setCupomMsg('Cupom aplicado.')
      }
    },
    [aplicarCupom, cupomInput, limparCupom],
  )

  const onAtualizar = useCallback(() => {
    sincronizarPrecos()
    setCupomMsg('Carrinho atualizado com os preços do cardápio.')
  }, [sincronizarPrecos])

  return (
    <div className="cart-page container">
      <nav className="cart-page__nav" aria-label="Navegação">
        <Link to="/cardapio/pizzas">← Continuar comprando</Link>
      </nav>

      <h1 className="cart-page__titulo">Carrinho</h1>

      {itens.length === 0 ? (
        <p className="cart-page__vazio">
          Seu carrinho está vazio.{' '}
          <Link to="/cardapio/pizzas">Ver cardápio</Link>
        </p>
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
                      <span className="cart-table__tam">Tamanho {linha.tamanho}</span>
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

          <div className="cart-footer">
            <form className="cart-cupom" onSubmit={onAplicarCupom}>
              <label htmlFor="cart-cupom-input" className="visually-hidden">
                Cupom
              </label>
              <input
                id="cart-cupom-input"
                type="text"
                className="cart-cupom__input"
                placeholder="Código do cupom"
                value={cupomInput}
                onChange={(e) => setCupomInput(e.target.value)}
                autoComplete="off"
              />
              <button type="submit" className="btn btn--primario cart-cupom__btn">
                Aplicar cupom
              </button>
            </form>
            {cupomMsg ? <p className="cart-page__msg">{cupomMsg}</p> : null}
            {cupomAplicado ? (
              <p className="cart-page__cupom-ativo">
                Cupom <strong>{cupomAplicado.codigo}</strong> — {cupomAplicado.percentual}% de desconto
              </p>
            ) : null}

            <div className="cart-footer__actions">
              <button type="button" className="btn btn--primario" onClick={onAtualizar}>
                Atualizar carrinho
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
          </div>
        </>
      )}
    </div>
  )
}
