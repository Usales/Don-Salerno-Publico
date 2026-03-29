import { Outlet, useLocation } from 'react-router-dom'
import { CookieBanner } from './CookieBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  const { pathname } = useLocation()
  const mainClass =
    pathname === '/carrinho' ? 'main-area main-area--cart' : 'main-area'

  return (
    <>
      <ScrollToTop />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className={mainClass} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
