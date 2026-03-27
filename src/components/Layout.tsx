import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { CookieBanner } from './CookieBanner'

export function Layout() {
  return (
    <>
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
