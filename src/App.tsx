import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Layout } from '@/components/Layout'
import { Home } from '@/pages/Home'
import { Cardapio } from '@/pages/Cardapio'
import { Produto } from '@/pages/Produto'
import { Conta } from '@/pages/Conta'
import { Sobre } from '@/pages/Sobre'
import { Contato } from '@/pages/Contato'
import { Privacidade } from '@/pages/Privacidade'
import { NotFound } from '@/pages/NotFound'
import { Carrinho } from '@/pages/Carrinho'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cardapio" element={<Navigate to="/cardapio/pizzas" replace />} />
            <Route path="cardapio/:categoria" element={<Cardapio />} />
            <Route path="produto/:id" element={<Produto />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="conta" element={<Conta />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="contato" element={<Contato />} />
            <Route path="privacidade" element={<Privacidade />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
