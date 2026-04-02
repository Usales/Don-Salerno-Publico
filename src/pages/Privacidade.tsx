import { empresa } from '@/data/empresa'

const waUrl = `https://wa.me/${empresa.whatsappDigits}`

export function Privacidade() {
  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 720 }}>
      <h1>Política de privacidade (LGPD)</h1>
      <p style={{ color: 'var(--color-texto-muted, #666)', fontSize: '0.95rem' }}>
        Última atualização: 27 de março de 2026.
      </p>

      <p>
        Esta política descreve como o <strong>{empresa.nomeFantasia}</strong>, em conformidade com a Lei Geral de
        Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD), trata dados pessoais no contexto deste site e dos
        canais de contato relacionados.
      </p>

      <h2>1. Controlador</h2>
      <p>
        O controlador dos dados pessoais tratados em razão deste site é <strong>{empresa.razaoSocial}</strong>,
        com endereço em {empresa.endereco}.
        {empresa.cnpj.trim().length > 0 ? (
          <>
            {' '}
            CNPJ: {empresa.cnpj}.
          </>
        ) : null}
      </p>

      <h2>2. Quais dados coletamos</h2>
      <p>
        <strong>Este site não oferece criação de conta nem cadastro de usuários.</strong> Não coletamos nome, e-mail,
        telefone ou endereço por meio de formulário de cadastro neste endereço. Os dados pessoais que podemos tratar
        decorrem sobretudo do uso dos canais abaixo:
      </p>
      <ul>
        <li>
          <strong>Cookies e tecnologias similares:</strong> cookies essenciais (funcionamento básico, preferências e
          registro da sua escolha no banner de cookies) e, somente após o seu aceite no banner, cookies ou dados para
          fins analíticos ou de melhoria da experiência, conforme a seção “Cookies”.
        </li>
        <li>
          <strong>Armazenamento local no navegador:</strong> informações não identificativas ou de conveniência (por
          exemplo, itens do carrinho ou preferências de exibição) podem ficar salvas apenas no seu dispositivo, sem
          envio automático ao {empresa.nomeFantasia} por esse meio.
        </li>
        <li>
          <strong>Contato por WhatsApp, telefone ou presencial:</strong> dados que você voluntariamente compartilhar
          nesses canais (por exemplo, nome, telefone, endereço de entrega ou detalhes do pedido) para atendimento,
          pedidos e suporte.
        </li>
      </ul>

      <h2>3. Finalidades e bases legais</h2>
      <p>Tratamos dados pessoais para:</p>
      <ul>
        <li>
          <strong>Execução de contrato ou de procedimentos preliminares</strong> (art. 7º, V da LGPD): pedidos,
          entregas e atendimento realizados pelos canais oficiais (presencial, telefone, WhatsApp etc.).
        </li>
        <li>
          <strong>Consentimento</strong> (art. 7º, I): quando aplicável, por exemplo para cookies não essenciais,
          conforme indicado no banner de cookies.
        </li>
        <li>
          <strong>Legítimo interesse</strong> (art. 7º, IX), quando cabível: segurança do site, prevenção a fraudes e
          melhoria técnica, sempre respeitando seus direitos e expectativas.
        </li>
        <li>
          <strong>Cumprimento de obrigação legal ou regulatória</strong> (art. 7º, II), quando exigido por lei.
        </li>
      </ul>

      <h2>4. Compartilhamento</h2>
      <p>
        Não vendemos seus dados pessoais. Podemos compartilhar informações apenas quando necessário para: prestação
        de serviços por empresas parceiras (ex.: entrega, meios de pagamento ou hospedagem técnica), mediante
        contratos ou cláusulas compatíveis com a LGPD; cumprimento de ordem judicial ou requisição de autoridade
        competente; ou proteção de direitos do {empresa.nomeFantasia} e de terceiros.
      </p>
      <p>
        O uso do <strong>WhatsApp</strong> ou de outras plataformas de terceiros está sujeito às políticas desses
        provedores, além desta política.
      </p>

      <h2>5. Armazenamento, segurança e retenção</h2>
      <p>
        Adotamos medidas razoáveis de segurança para proteger os dados sob nosso controle. Preferências e dados
        mantidos apenas no seu navegador permanecem até você limpar o armazenamento do site ou os dados do
        navegador. Dados tratados em atendimento ou em sistemas internos seguem prazos definidos por necessidade do
        serviço, obrigação legal ou política interna de retenção.
      </p>
      <p>
        Recomendamos acessar o site por <strong>HTTPS</strong> (conexão segura), especialmente em redes públicas.
      </p>

      <h2>6. Seus direitos (art. 18 da LGPD)</h2>
      <p>Você pode, a qualquer tempo e conforme a lei:</p>
      <ul>
        <li>Confirmar a existência de tratamento e acessar os dados;</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
        <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
        <li>Solicitar portabilidade dos dados a outro fornecedor, quando aplicável;</li>
        <li>Obter informações sobre entidades públicas ou privadas com as quais compartilhamos dados;</li>
        <li>Ser informado sobre a possibilidade de não fornecer consentimento e sobre as consequências;</li>
        <li>Revogar o consentimento, quando o tratamento se basear nele.</li>
      </ul>
      <p>
        Para exercer esses direitos ou esclarecer dúvidas sobre privacidade, utilize os canais abaixo. Você também
        pode registrar reclamação à Autoridade Nacional de Proteção de Dados (ANPD), conforme a legislação.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Utilizamos cookies <strong>essenciais</strong> para funcionamento básico do site, preferências e registro da
        sua escolha no banner. Cookies <strong>analíticos ou não essenciais</strong> só são utilizados após o seu
        aceite explícito no banner de cookies, em linha com a LGPD. Você pode alterar a decisão limpando os dados do
        site no navegador ou, quando disponível, pelas configurações do próprio site.
      </p>

      <h2>8. Crianças e adolescentes</h2>
      <p>
        O site não é direcionado a menores de 16 anos de forma autônoma. O tratamento de dados de menores, quando
        necessário, observará as regras da LGPD e o consentimento dos responsáveis legais, quando exigido.
      </p>

      <h2>9. Alterações</h2>
      <p>
        Podemos atualizar esta política para refletir mudanças legais, no site ou nos serviços. A data no topo desta
        página será ajustada quando houver revisão relevante. Recomendamos consulta periódica.
      </p>

      <h2 id="termos">10. Termos de uso do site</h2>
      <p>
        O uso deste site implica ciência desta política e das condições do cardápio e do atendimento vigentes. O{' '}
        {empresa.nomeFantasia} pode alterar funcionalidades, preços e disponibilidade de produtos; em caso de
        divergência entre o site e o estabelecimento, prevalece a informação no local físico ou no canal oficial de
        atendimento.
      </p>

      <h2>11. Contato — privacidade e dados pessoais</h2>
      <p>
        Para solicitações relacionadas a dados pessoais e a esta política, fale conosco pelo{' '}
        <a href={waUrl} rel="noopener noreferrer">
          WhatsApp
        </a>
        , pelo telefone{' '}
        <a href={empresa.telefoneHref}>{empresa.telefoneLabel}</a> ou presencialmente no endereço indicado acima.
      </p>
    </div>
  )
}
