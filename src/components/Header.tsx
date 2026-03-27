import { NavLink, Link, useLocation } from 'react-router-dom'

import './Layout.css'

export function Header() {
  const loc = useLocation()

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
            Receitas
          </NavLink>
          <NavLink to="/sobre" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Sobre
          </NavLink>
          <NavLink to="/contato" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Contato
          </NavLink>
        </nav>

        <div className="site-header__actions">
          <NavLink
            to="/conta"
            className={({ isActive }) =>
              `site-header__entrar${isActive ? ' site-header__entrar--on' : ''}`
            }
          >
            Entrar
          </NavLink>
        </div>
      </div>
    </header>
  )
}
