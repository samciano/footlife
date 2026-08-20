// engine/overall.js
// Implementa sistema_overral.txt: Overall = Σ (Atributo × Peso), pesos somam 100% por papel.

export const PESOS_POR_PAPEL = {
  Atacante: {
    finalizacao: 0.20, velocidade: 0.12, controleBola: 0.10, drible: 0.10, posicionamento: 0.10,
    frieza: 0.08, forca: 0.06, impulsao: 0.05, passe: 0.05, visaoJogo: 0.04, agilidade: 0.04,
    resistencia: 0.02, foco: 0.02, flexibilidade: 0.01, lideranca: 0.01,
    comportamento: 0, desarme: 0, reflexos: 0
  },
  "Meio-campista": {
    passe: 0.18, visaoJogo: 0.16, controleBola: 0.12, resistencia: 0.10, foco: 0.08, desarme: 0.08,
    drible: 0.06, posicionamento: 0.05, finalizacao: 0.05, velocidade: 0.04, frieza: 0.03,
    lideranca: 0.02, forca: 0.01, agilidade: 0.01, comportamento: 0.01,
    impulsao: 0, flexibilidade: 0, reflexos: 0
  },
  Defensor: {
    desarme: 0.22, posicionamento: 0.15, forca: 0.12, impulsao: 0.10, resistencia: 0.08, foco: 0.08,
    passe: 0.06, velocidade: 0.05, controleBola: 0.04, lideranca: 0.03, frieza: 0.03, agilidade: 0.02,
    visaoJogo: 0.02, comportamento: 0, flexibilidade: 0, finalizacao: 0, drible: 0, reflexos: 0
  },
  Goleiro: {
    reflexos: 0.30, posicionamento: 0.18, agilidade: 0.12, impulsao: 0.10, foco: 0.10, flexibilidade: 0.06,
    frieza: 0.04, lideranca: 0.03, passe: 0.03, forca: 0.02, comportamento: 0.02,
    visaoJogo: 0, resistencia: 0, velocidade: 0, finalizacao: 0, drible: 0, desarme: 0, controleBola: 0
  }
};

/**
 * Calcula o Overall (0-99) de um jogador para um papel específico.
 * @param {Object} atributos - objeto com os 18 atributos (0-99)
 * @param {string} papel - "Atacante" | "Meio-campista" | "Defensor" | "Goleiro"
 */
export function calcularOverall(atributos, papel) {
  const pesos = PESOS_POR_PAPEL[papel];
  if (!pesos) throw new Error(`Papel de Overall desconhecido: ${papel}`);

  let total = 0;
  for (const attr in pesos) {
    total += (atributos[attr] || 0) * pesos[attr];
  }
  return Math.max(0, Math.min(99, Math.round(total)));
}
