import { useEffect, useState } from 'react'

const KEY = 'don-salerno-cookies'

export function CookieBanner() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisivel(true)
    } catch {
      setVisivel(true)
    }
  }, [])

  function aceitar() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ essencial: true, analitica: true, aceitoEm: new Date().toISOString() }))
    } catch {
      /* ignore */
    }
    setVisivel(false)
    window.dispatchEvent(new Event('don-salerno-cookies-aceito'))
  }

  function apenasEssenciais() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ essencial: true, analitica: false, aceitoEm: new Date().toISOString() }))
    } catch {
      /* ignore */
    }
    setVisivel(false)
  }

  if (!visivel) return null

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-titulo" aria-modal="false">
      <div className="cookie-banner__inner container">
        <h2 id="cookie-titulo" className="cookie-banner__titulo">
          Privacidade e cookies
        </h2>
        <p className="cookie-banner__txt">
          Usamos cookies essenciais para o login e preferências, e — com seu consentimento — dados para melhorar a
          experiência (LGPD). Leia a{' '}
          <a href="/privacidade">política de privacidade</a>.
        </p>
        <div className="cookie-banner__acoes">
          <button type="button" className="btn btn--primario" onClick={aceitar}>
            Aceitar todos
          </button>
          <button type="button" className="btn btn--secundario" onClick={apenasEssenciais}>
            Apenas essenciais
          </button>
        </div>
      </div>
    </div>
  )
}
