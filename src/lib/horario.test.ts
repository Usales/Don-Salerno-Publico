import { statusDaLoja } from './horario'

// Datas em UTC-3 (Brasília não tem horário de verão)
const em = (iso: string) => new Date(iso)

test('terça fica fechada o dia todo', () => {
  expect(statusDaLoja(em('2026-11-17T20:00:00-03:00')).aberta).toBe(false)
})
test('quarta 18:00 abre', () => {
  expect(statusDaLoja(em('2026-11-18T18:00:00-03:00')).aberta).toBe(true)
})
test('sábado 17:59 ainda fechado', () => {
  expect(statusDaLoja(em('2026-11-14T17:59:00-03:00')).aberta).toBe(false)
})
test('sábado 23:00 já fechou', () => {
  expect(statusDaLoja(em('2026-11-14T23:00:00-03:00')).aberta).toBe(false)
})
test('segunda 22:59 aberto; depois fecha e avisa que volta na quarta', () => {
  expect(statusDaLoja(em('2026-11-16T22:59:00-03:00')).aberta).toBe(true)
  expect(statusDaLoja(em('2026-11-16T23:30:00-03:00')).mensagem).toContain('quarta')
})