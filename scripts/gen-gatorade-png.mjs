/**
 * Fallback SVG→PNG se faltar foto em public/bebidas (garrafa genérica, sem marca).
 * Fotos oficiais: use os PNG em public/bebidas/*.png. Rodar: npm run gen:bebidas
 */
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'bebidas')

/** @type {{ slug: string; c1: string; c2: string; zero?: boolean }[]} */
const flavors = [
  { slug: 'gatorade-limao', c1: '#E8F086', c2: '#A8C400' },
  { slug: 'gatorade-laranja', c1: '#FF9F1C', c2: '#E65100' },
  { slug: 'gatorade-uva', c1: '#9C5BB5', c2: '#5E2F7A' },
  { slug: 'gatorade-maracuja', c1: '#FFE566', c2: '#F9A825' },
  { slug: 'gatorade-morango-maracuja', c1: '#FF6B9D', c2: '#F9A825' },
  { slug: 'gatorade-berry-blue', c1: '#42A5F5', c2: '#1565C0' },
  { slug: 'gatorade-tangerina', c1: '#FF8A65', c2: '#E64A19' },
]

function svgFor({ slug, c1, c2, zero }) {
  const cap = '#E8EAED'
  const capShadow = '#B0B4BC'
  const band = zero ? '#5C6BC0' : 'none'
  const id = `g${slug.replace(/[^a-z]/g, '')}`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="${id}" x1="0%" y1="0%" x2="95%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <linearGradient id="${id}-shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path fill="url(#${id})" d="M196 118 L316 118 L308 168 C302 188 300 210 300 232 L300 388 C300 428 284 452 256 452 C228 452 212 428 212 388 L212 232 C212 210 210 188 204 168 Z"/>
  <path fill="url(#${id}-shine)" d="M224 178 L248 178 L248 400 L224 400 Z" opacity="0.9"/>
  <path fill="${capShadow}" d="M218 88 L294 88 L292 118 L220 118 Z"/>
  <path fill="${cap}" d="M220 72 L292 72 L294 88 L218 88 Z"/>
  <ellipse cx="256" cy="72" rx="38" ry="10" fill="${cap}"/>
  ${
    zero
      ? `<rect x="212" y="248" width="88" height="22" rx="6" fill="${band}" opacity="0.92"/>
         <text x="256" y="264" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="14" font-weight="700">ZERO</text>`
      : ''
  }
</svg>`
}

await mkdir(outDir, { recursive: true })

for (const f of flavors) {
  const pngPath = join(outDir, `${f.slug}.png`)
  if (existsSync(pngPath) && process.env.GATORADE_FORCE !== '1') {
    console.log('skip (já existe; use GATORADE_FORCE=1 para sobrescrever)', f.slug)
    continue
  }
  const buf = Buffer.from(svgFor({ slug: f.slug, c1: f.c1, c2: f.c2, zero: f.zero }), 'utf8')
  await sharp(buf).resize(512, 512).png({ compressionLevel: 9 }).toFile(pngPath)
  console.log('ok', f.slug)
}

console.log('done ->', outDir)
