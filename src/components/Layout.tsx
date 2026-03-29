import { Outlet } from 'react-router-dom'
import { CookieBanner } from './CookieBanner'
import { Footer } from './Footer'
import { Header } from './Header'
import { ScrollToTop } from './ScrollToTop'

export function Layout() {
  return (
    <>
      <ScrollToTop />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="main-area" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
