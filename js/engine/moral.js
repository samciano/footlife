// engine/moral.js
// Implementa sistema_moral_treinador.txt: valor 0-100, ajustado gradualmente
// por eventos de treino, partida e disciplina.

export function classificarMoral(moral) {
  if (moral <= 19) return "Relação Ruim";
  if (moral <= 39) return "Reserva";
  if (moral <= 59) return "Rotação";
  if (moral <= 79) return "Titular";
  return "Homem de Confiança";
}

// Ajustes graduais (pontos de moral). Valores pequenos de propósito — o documento
// pede evolução gradual, nunca uma única partida decidindo tudo.
export const AJUSTES_MORAL = {
  boaAtuacao: 3,          // nota >= 7.0
  grandeAtuacao: 5,        // nota >= 8.0
  atuacaoRuim: -3,         // nota < 5.0
  treinouHoje: 1,
  faltouTreino: -2,
  cartaoVermelho: -4,
  boaSubstituicao: 2
};

export function ajustarMoral(moralAtual, delta) {
  return Math.max(0, Math.min(100, Math.round(moralAtual + delta)));
}
