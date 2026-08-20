// engine/valorBase.js
// Implementa valor_base.txt: escala de referência não-linear, com interpolação
// entre os pontos conhecidos.

const PONTOS_REFERENCIA = [
  { overall: 50, valor: 0.2e6 },
  { overall: 55, valor: 0.4e6 },
  { overall: 60, valor: 0.8e6 },
  { overall: 65, valor: 1.8e6 },
  { overall: 70, valor: 4e6 },
  { overall: 75, valor: 8e6 },
  { overall: 80, valor: 16e6 },
  { overall: 85, valor: 37e6 },
  { overall: 90, valor: 82e6 },
  { overall: 95, valor: 152e6 },
  { overall: 99, valor: 225e6 }
];

/**
 * Retorna o Valor-Base (€) de um jogador a partir do seu Overall,
 * interpolando linearmente entre os pontos de referência da escala.
 * Abaixo de 50 ou acima de 99, o valor é extrapolado a partir do trecho mais próximo.
 */
export function calcularValorBase(overall) {
  const pontos = PONTOS_REFERENCIA;

  if (overall <= pontos[0].overall) {
    return interpolar(overall, pontos[0], pontos[1]);
  }
  if (overall >= pontos[pontos.length - 1].overall) {
    return interpolar(overall, pontos[pontos.length - 2], pontos[pontos.length - 1]);
  }

  for (let i = 0; i < pontos.length - 1; i++) {
    const a = pontos[i], b = pontos[i + 1];
    if (overall >= a.overall && overall <= b.overall) {
      return interpolar(overall, a, b);
    }
  }
  return pontos[0].valor;
}

function interpolar(overall, a, b) {
  const fracao = (overall - a.overall) / (b.overall - a.overall);
  const valor = a.valor + fracao * (b.valor - a.valor);
  return Math.max(0, Math.round(valor));
}

export function formatarValor(valorEuros) {
  if (valorEuros >= 1e6) return `€${(valorEuros / 1e6).toFixed(1)}M`;
  if (valorEuros >= 1e3) return `€${(valorEuros / 1e3).toFixed(0)}K`;
  return `€${valorEuros.toFixed(0)}`;
}
