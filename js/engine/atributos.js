// engine/atributos.js
// Baseado em atributos.txt — 18 atributos permanentes (Físicos, Técnicos, Mentais).

export const LISTA_ATRIBUTOS = [
  // Físicos
  "velocidade", "resistencia", "forca", "impulsao", "agilidade", "flexibilidade",
  // Técnicos
  "finalizacao", "passe", "drible", "desarme", "controleBola", "reflexos",
  // Mentais
  "visaoJogo", "comportamento", "foco", "lideranca", "posicionamento", "frieza"
];

// Tendência de geração por posição: quais atributos nascem mais altos ("alta"),
// medianos ("media") e o restante fica em faixa baixa ("baixa" implícita).
// Isso é um dado editável — para ajustar o "arquétipo padrão" de uma posição,
// basta editar as listas abaixo, sem tocar no restante do código.
export const TENDENCIAS_POSICAO = {
  GOL: { alta: ["reflexos", "posicionamento", "agilidade"], media: ["impulsao", "foco", "flexibilidade", "passe"] },
  LE:  { alta: ["velocidade", "resistencia", "passe"], media: ["desarme", "agilidade", "posicionamento", "controleBola"] },
  LD:  { alta: ["velocidade", "resistencia", "passe"], media: ["desarme", "agilidade", "posicionamento", "controleBola"] },
  ZAG: { alta: ["desarme", "posicionamento", "forca"], media: ["impulsao", "foco", "resistencia", "passe"] },
  VOL: { alta: ["desarme", "resistencia", "posicionamento"], media: ["passe", "foco", "forca", "visaoJogo"] },
  MC:  { alta: ["passe", "visaoJogo", "controleBola"], media: ["resistencia", "foco", "desarme", "posicionamento"] },
  MEI: { alta: ["visaoJogo", "passe", "drible"], media: ["finalizacao", "controleBola", "frieza", "agilidade"] },
  MD:  { alta: ["passe", "velocidade", "drible"], media: ["visaoJogo", "controleBola", "resistencia", "finalizacao"] },
  ME:  { alta: ["passe", "velocidade", "drible"], media: ["visaoJogo", "controleBola", "resistencia", "finalizacao"] },
  CA:  { alta: ["finalizacao", "posicionamento", "frieza"], media: ["forca", "impulsao", "controleBola", "velocidade"] },
  SA:  { alta: ["finalizacao", "drible", "visaoJogo"], media: ["velocidade", "agilidade", "frieza", "controleBola"] },
  PD:  { alta: ["velocidade", "drible", "finalizacao"], media: ["agilidade", "controleBola", "frieza", "passe"] },
  PE:  { alta: ["velocidade", "drible", "finalizacao"], media: ["agilidade", "controleBola", "frieza", "passe"] }
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gera os 18 atributos iniciais de um jovem jogador em início de carreira,
 * respeitando a tendência da posição escolhida (criacao_personagem.txt).
 * nivelBase (0-100, opcional) permite gerar elencos de clubes mais fortes/fracos
 * deslocando a faixa toda para cima ou para baixo (usado pelo squadGen).
 */
export function gerarAtributosIniciais(posicaoCodigo, nivelBase = 55) {
  const tendencia = TENDENCIAS_POSICAO[posicaoCodigo] || { alta: [], media: [] };
  const atributos = {};

  for (const attr of LISTA_ATRIBUTOS) {
    let faixaMin, faixaMax;
    if (tendencia.alta.includes(attr)) {
      faixaMin = nivelBase - 5;
      faixaMax = nivelBase + 25;
    } else if (tendencia.media.includes(attr)) {
      faixaMin = nivelBase - 15;
      faixaMax = nivelBase + 10;
    } else {
      faixaMin = nivelBase - 30;
      faixaMax = nivelBase - 5;
    }
    faixaMin = Math.max(20, Math.min(faixaMin, 90));
    faixaMax = Math.max(faixaMin + 5, Math.min(faixaMax, 99));
    atributos[attr] = randInt(faixaMin, faixaMax);
  }
  return atributos;
}
