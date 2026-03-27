import { Link } from 'react-router-dom'
import './Layout.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <strong className="site-footer__brand">Don Salerno</strong>
          <p className="site-footer__txt">Massas, molhos e recheios artesanais. Tradição italiana no prato.</p>
        </div>
        <div>
          <h2 className="site-footer__h">Links</h2>
          <ul className="site-footer__ul">
            <li>
              <Link to="/privacidade">Privacidade e LGPD</Link>
            </li>
            <li>
              <Link to="/contato">Contato</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy container">© {new Date().getFullYear()} Don Salerno. Todos os direitos reservados.</p>
    </footer>
  )
}
