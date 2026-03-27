import { useEffect } from 'react'

export function JsonLdRestaurant() {
  useEffect(() => {
    const el = document.getElementById('jsonld-restaurant')
    if (el) return
    const script = document.createElement('script')
    script.id = 'jsonld-restaurant'
    script.type = 'application/ld+json'
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: 'Don Salerno',
      servesCuisine: ['Massas', 'Molhos', 'Recheios'],
      priceRange: '$$',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    })
    document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [])
  return null
}
