// engine/ritmo.js
// Implementa sistema_ritmo.txt: nível de ritmo determina quantos eventos decisivos
// o jogador recebe durante a partida.
//
// O documento não define como o valor de ritmo (0-100) é calculado — apenas seus
// efeitos. Aqui assumimos que o ritmo do dia reflete o estado físico/mental do
// jogador (condição física, foco, forma) mais uma variação aleatória natural da
// partida. Essa fórmula fica isolada nesta função para poder ser recalibrada
// facilmente no futuro.
export function calcularRitmoPartida(jogador) {
  const condicaoFisica = 100 - jogador.desgaste; // desgaste alto -> pior ritmo
  const base =
    condicaoFisica * 0.45 +
    jogador.atributos.foco * 0.25 +
    jogador.forma * 0.20 +
    Math.random() * 10 * 0.10 * 10; // pequena variação aleatória (0-10 amplificada)

  return Math.max(0, Math.min(100, Math.round(base)));
}

export function classificarRitmo(ritmo) {
  if (ritmo >= 80) return { nivel: "Alto", eventos: 3 };
  if (ritmo >= 50) return { nivel: "Médio", eventos: rand(1, 2) };
  return { nivel: "Baixo", eventos: 0 };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
