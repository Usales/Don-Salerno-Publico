export function Privacidade() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 720 }}>
      <h1>Política de privacidade (LGPD)</h1>
      <p>
        O Don Salerno coleta apenas dados necessários para cadastro e melhoria do serviço: nome,
        e-mail, telefone e endereço quando informados. O tratamento baseia-se em consentimento e execução de
        contrato.
      </p>
      <h2>Seus direitos</h2>
      <ul>
        <li>Acesso e correção dos dados</li>
        <li>Revogação do consentimento</li>
        <li>Solicitação de exclusão da conta (entre em contato)</li>
      </ul>
      <h2>Cookies</h2>
      <p>
        Utilizamos cookies essenciais para sessão e preferências; cookies analíticos apenas após aceite no banner.
      </p>
      <p>
        <strong>Segurança:</strong> em produção, utilize HTTPS, políticas de senha fortes e armazenamento
        seguro. Este MVP usa autenticação simulada apenas no navegador — não use para dados reais sensíveis.
      </p>
    </div>
  )
}
