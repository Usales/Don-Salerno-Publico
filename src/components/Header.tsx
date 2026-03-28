import { NavLink, Link, useLocation } from 'react-router-dom'
import { useCart } from '@/stores/useCart'

import './Layout.css'

/** URL HTTPS da loja no iFood (ex.: página do restaurante ou `.../lista/chain:uuid`). Defina em `.env`: VITE_IFOOD_STORE_URL */
const IFOOD_STORE_URL =
  import.meta.env.VITE_IFOOD_STORE_URL?.trim() || 'https://www.ifood.com.br/'

function isLikelyMobile(): boolean {
  const ua = navigator.userAgent
  if (/Android|iPhone|iPod/i.test(ua)) return true
  if (/iPad/i.test(ua)) return true
  if (/Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1) {
    return true
  }
  return false
}

export function Header() {
  const loc = useLocation()
  const itensNoCarrinho = useCart((s) => s.itens.reduce((acc, i) => acc + i.quantidade, 0))

  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link to="/" className="site-header__brand">
          <img
            src="/logo.png"
            alt="Don Salerno — mascote"
            className="site-header__logo"
            width={44}
            height={44}
          />
          <span className="site-header__nome">Don Salerno</span>
        </Link>

        <nav className="site-nav" aria-label="Principal">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Início
          </NavLink>
          <NavLink
            to="/cardapio/pizzas"
            className={() =>
              loc.pathname.startsWith('/cardapio') || loc.pathname.startsWith('/produto') ? 'is-active' : ''
            }
          >
            Cardápio
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Sobre
          </NavLink>
          <NavLink to="/contato" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Contato
          </NavLink>
        </nav>

        <div className="site-header__actions">
          <Link
            to="/carrinho"
            className={`site-header__carrinho${loc.pathname === '/carrinho' ? ' site-header__carrinho--active' : ''}`}
            aria-label={itensNoCarrinho > 0 ? `Carrinho, ${itensNoCarrinho} itens` : 'Carrinho'}
          >
            <svg
              className="site-header__carrinho-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.85"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4.5 8.5h2.2l1.35 8.2a1.35 1.35 0 0 0 1.33 1.13h7.62a1.35 1.35 0 0 0 1.33-1.1l1.55-6.23H7.85" />
              <path d="M4.5 8.5V6.25a1 1 0 0 1 1-1h1.1" />
              <path d="M9.25 6.25h3.5l1.2 2.25" />
              <circle cx="10" cy="19.25" r="1.35" />
              <circle cx="17.25" cy="19.25" r="1.35" />
            </svg>
            {itensNoCarrinho > 0 ? (
              <span className="site-header__carrinho-badge">{itensNoCarrinho > 99 ? '99+' : itensNoCarrinho}</span>
            ) : null}
          </Link>
          <a
            href={IFOOD_STORE_URL}
            className="site-header__entrar"
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!isLikelyMobile()) {
                e.preventDefault()
                window.open(IFOOD_STORE_URL, '_blank', 'noopener,noreferrer')
              }
            }}
          >
            iFood
          </a>
        </div>
      </div>
    </header>
  )
}
