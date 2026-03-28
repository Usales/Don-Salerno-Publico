/**
 * Dados institucionais (rodapé, contato).
 * Preencha CNPJ e razão social quando formalizados; telefone deve bater com o WhatsApp.
 */
export const empresa = {
  nomeFantasia: 'Don Salerno',
  razaoSocial: 'Don Salerno',
  endereco: 'Av. Hilário Sebastião de Figueiredo - Santo Hilario, Goiânia - GO, 74780-250',
  telefoneLabel: '(00) 00000-0000',
  telefoneHref: 'tel:+5500000000000',
  whatsappDigits: '5500000000000',
  /** Vazio = linha de CNPJ oculta no rodapé */
  cnpj: '',
} as const
