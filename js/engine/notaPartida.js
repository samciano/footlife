// engine/notaPartida.js
// Implementa sistema_nota_partida.txt: nota inicial 6.0, ajustada por eventos,
// limitada entre 0.0 e 10.0.

export function notaInicial() {
  return 6.0;
}

export function aplicarDelta(notaAtual, delta) {
  return Math.max(0, Math.min(10, +(notaAtual + delta).toFixed(1)));
}

export function classificarNota(nota) {
  if (nota < 4.0) return "Muito ruim";
  if (nota < 6.0) return "Abaixo do esperado";
  if (nota < 7.0) return "Regular";
  if (nota < 8.0) return "Boa atuação";
  if (nota < 9.0) return "Grande atuação";
  return "Excepcional";
}
