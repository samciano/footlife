// engine/squadGen.js
// Gera elencos fictícios para os clubes (ESTRUTURA EDITÁVEL DE LIGAS E CLUBES:
// "cada clube será preenchido por atletas fictícios gerados pelo próprio jogo").

import { gerarAtributosIniciais } from "./atributos.js";
import { calcularOverall } from "./overall.js";

const NOMES = [
  "Mateus", "Lucas", "Gabriel", "Rafael", "Bruno", "Diego", "Thiago", "André", "Vitor", "Igor",
  "Marco", "Luca", "Nico", "Leon", "Hugo", "Adam", "Noah", "Liam", "Oscar", "Elias",
  "Kwame", "Yusuf", "Amara", "Kofi", "Sami", "Malik", "Tariq", "Omar", "Idris", "Zane",
  "Erik", "Sven", "Lars", "Piotr", "Milan", "Ivan", "Dario", "Aleksander", "Nikolai", "Stefan"
];
const SOBRENOMES = [
  "Silva", "Santos", "Costa", "Ferreira", "Pereira", "Rocha", "Almeida", "Barbosa", "Nunes", "Teixeira",
  "Müller", "Weber", "Schmidt", "Fischer", "Novak", "Kowalski", "Dubois", "Lefevre", "Moreau", "Bernard",
  "Johansson", "Andersen", "Larsen", "Hansen", "Berg", "Traoré", "Diallo", "N'Diaye", "Toure", "Camara"
];

function nomeAleatorio() {
  const n = NOMES[Math.floor(Math.random() * NOMES.length)];
  const s = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)];
  return `${n} ${s}`;
}

// Distribuição de posições de um elenco típico (~20 jogadores).
const DISTRIBUICAO_ELENCO = [
  "GOL", "GOL",
  "ZAG", "ZAG", "ZAG",
  "LE", "LD",
  "VOL", "VOL",
  "MC", "MC",
  "MEI",
  "MD", "ME",
  "CA", "CA",
  "SA",
  "PD", "PE"
];

let contadorId = 1;

function papelDaPosicao(codigo, mapaPosicoes) {
  const info = mapaPosicoes.find(p => p.codigo === codigo);
  return info ? info.papelOverall : "Meio-campista";
}

/**
 * Gera um elenco fictício para um clube.
 * @param {Object} clube - dados do clube (usa overallBase para calibrar o nível)
 * @param {Array} mapaPosicoes - conteúdo de posicoes.json (posicoes[])
 */
export function gerarElenco(clube, mapaPosicoes) {
  return DISTRIBUICAO_ELENCO.map(posicao => {
    const nivelBase = clube.overallBase + Math.floor(Math.random() * 10 - 5);
    const atributos = gerarAtributosIniciais(posicao, nivelBase);
    const papel = papelDaPosicao(posicao, mapaPosicoes);
    const overall = calcularOverall(atributos, papel);

    return {
      id: `npc_${contadorId++}`,
      nome: nomeAleatorio(),
      posicao,
      papelOverall: papel,
      atributos,
      overall,
      moral: 50 + Math.floor(Math.random() * 20 - 10),
      forma: 60,
      desgaste: Math.floor(Math.random() * 20),
      historicoNotas: [],
      lesao: null,
      ehJogadorPrincipal: false
    };
  });
}
