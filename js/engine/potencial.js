// engine/potencial.js
// Implementa sistema_potencial.txt: janela móvel de 12 meses, 4 fatores ponderados.

const MINUTOS_REFERENCIA_12M = 3420; // ~38 partidas de 90min: teto para normalizar "minutos jogados"

/**
 * @param {Array} historicoPartidas12m - partidas dos últimos 12 meses: [{ minutos, nota (0-10), ritmo (0-100) }]
 * @param {number} overallInicioJanela - overall do jogador há ~12 meses
 * @param {number} overallAtual - overall atual do jogador
 */
export function calcularPotencial(historicoPartidas12m, overallInicioJanela, overallAtual) {
  // Evolução do Overall: normaliza uma variação de -10 a +20 pontos para a escala 0-100.
  const deltaOverall = overallAtual - overallInicioJanela;
  const evolucaoOverall = Math.max(0, Math.min(100, ((deltaOverall + 10) / 30) * 100));

  const totalMinutos = historicoPartidas12m.reduce((s, p) => s + p.minutos, 0);
  const minutosJogados = Math.max(0, Math.min(100, (totalMinutos / MINUTOS_REFERENCIA_12M) * 100));

  const desempenhoMedio = historicoPartidas12m.length
    ? (historicoPartidas12m.reduce((s, p) => s + p.nota, 0) / historicoPartidas12m.length) * 10
    : 60;

  const ritmoMedio = historicoPartidas12m.length
    ? historicoPartidas12m.reduce((s, p) => s + p.ritmo, 0) / historicoPartidas12m.length
    : 50;

  const potencial =
    evolucaoOverall * 0.40 +
    minutosJogados * 0.25 +
    desempenhoMedio * 0.25 +
    ritmoMedio * 0.10;

  return Math.max(0, Math.min(100, Math.round(potencial)));
}

export function classificarPotencial(potencial) {
  if (potencial <= 19) return "Estagnado";
  if (potencial <= 39) return "Evolução lenta";
  if (potencial <= 59) return "Evolução consistente";
  if (potencial <= 79) return "Grande evolução";
  return "Explosão de desenvolvimento";
}
