// engine/forma.js
// Implementa sistema_forma.txt: média das últimas 5 notas × 10, com classificação qualitativa.

export function calcularForma(historicoNotas) {
  const ultimas5 = historicoNotas.slice(-5);
  if (ultimas5.length === 0) return 60; // estado neutro inicial ("Irregular" ~ 6.0 de nota base)

  const media = ultimas5.reduce((soma, n) => soma + n, 0) / ultimas5.length;
  return Math.max(0, Math.min(100, Math.round(media * 10)));
}

export function classificarForma(forma) {
  if (forma <= 19) return "Em crise";
  if (forma <= 39) return "Abaixo da média";
  if (forma <= 59) return "Irregular";
  if (forma <= 74) return "Em boa fase";
  if (forma <= 89) return "Em grande fase";
  return "Inspirado";
}
