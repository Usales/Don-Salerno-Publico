/**
 * Dados institucionais (rodapé, contato).
 * Preencha CNPJ e razão social quando formalizados; telefone deve bater com o WhatsApp.
 */
export const empresa = {
  nomeFantasia: 'Don Salerno',
  razaoSocial: 'Don Salerno',
  endereco: 'Av. Hilário Sebastião de Figueiredo - Santo Hilario, Goiânia - GO, 74780-250',
  telefoneLabel: '(62) 99522-7774',
  telefoneHref: 'tel:+5562995227774',
  whatsappDigits: '5562995227774',
  /** Vazio = linha de CNPJ oculta no rodapé */
  cnpj: '',
} as const
