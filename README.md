# Don Salerno — versão pública

Variante do site Don Salerno (cardápio, produtos, carrinho). Mesma stack que `don-salerno`: **Vite 6**, **React 19**, **TypeScript**, **React Router 7**, **Zustand**.

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Deploy Netlify

Na raiz desta pasta já existe `netlify.toml` (`publish = "dist"`, `npm run build`). No Netlify, defina a **base directory** como `don-salerno-publico` se o repositório for a pasta pai **Desenvolvimento**.

Redirects SPA: `public/_redirects` (copiado para `dist` no build).

Documentação mais completa (variáveis de ambiente, troubleshooting): veja [../don-salerno/README.md](../don-salerno/README.md).
