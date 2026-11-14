const FUSO = 'America/Sao_Paulo'
const ABRE_MIN = 18 * 60 // 18:00
const FECHA_MIN = 23 * 60 // 23:00
const DIA_FECHADO = 2 // terça (0 = domingo)

const DIAS: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
}

function agoraEmSaoPaulo(data: Date) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: FUSO,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(data)
  const get = (t: string) => partes.find((p) => p.type === t)?.value ?? ''
  return {
    dia: DIAS[get('weekday')],
    minutos: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

export type StatusLoja = { aberta: boolean; mensagem: string }

export function statusDaLoja(data: Date = new Date()): StatusLoja {
  const { dia, minutos } = agoraEmSaoPaulo(data)

  if (dia === DIA_FECHADO) {
    return { aberta: false, mensagem: 'Fechado hoje (terça). Abrimos amanhã às 18h.' }
  }
  if (minutos < ABRE_MIN) {
    return { aberta: false, mensagem: 'Fechado agora. Abrimos hoje às 18h.' }
  }
  if (minutos >= FECHA_MIN) {
    const amanhaEhTerca = (dia + 1) % 7 === DIA_FECHADO
    return {
      aberta: false,
      mensagem: amanhaEhTerca
        ? 'Fechado agora. Voltamos na quarta às 18h.'
        : 'Fechado agora. Abrimos amanhã às 18h.',
    }
  }
  return { aberta: true, mensagem: 'Aberto agora até as 23h.' }
}