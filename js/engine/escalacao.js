// engine/escalacao.js
// Implementa sistema_escalcao_treinador.txt: índice de escalação e seleção de titulares/reservas.

/**
 * @param {number} overall 0-99 -> normalizado para 0-100 antes de aplicar o peso
 * @param {number} moral 0-100
 * @param {number} forma 0-100
 * @param {number} condicaoFisica 0-100 (100 = totalmente descansado)
 */
export function calcularIndiceEscalacao(overall, moral, forma, condicaoFisica) {
  const overall0a100 = (overall / 99) * 100;
  const indice =
    overall0a100 * 0.50 +
    moral * 0.25 +
    forma * 0.15 +
    condicaoFisica * 0.10;
  return Math.max(0, Math.min(100, indice));
}

// Posições que o treinador considera aptas a disputar a mesma vaga na formação
// padrão, quando não há um titular natural disponível. Isso reflete a frase de
// sistema_escalcao_treinador.txt: "ou atletas aptos a desempenhar essa função".
// É um dado editável: para uma formação diferente, ajuste este mapa junto com FORMACAO_PADRAO.
export const POSICOES_EQUIVALENTES = {
  PD: ["MD"], MD: ["PD"],
  PE: ["ME"], ME: ["PE"],
  VOL: ["MC"], MC: ["VOL"],
  CA: ["SA"], SA: ["CA"]
};

/**
 * Monta a escalação (titulares + reservas) de um elenco para uma formação simples.
 * @param {Array} elenco - lista de jogadores { id, nome, posicao, overall, moral, forma, desgaste }
 * @param {Object} formacao - mapa posicao -> quantidade de titulares nessa posição (ex.: {GOL:1, ZAG:2, ...})
 */
export function montarEscalacao(elenco, formacao) {
  const comIndice = elenco.map(j => ({
    ...j,
    indiceEscalacao: calcularIndiceEscalacao(j.overall, j.moral, j.forma, 100 - j.desgaste)
  }));

  const titulares = [];
  const usados = new Set();

  for (const posicao in formacao) {
    const posicoesAceitas = [posicao, ...(POSICOES_EQUIVALENTES[posicao] || [])];
    const candidatos = comIndice
      .filter(j => posicoesAceitas.includes(j.posicao) && !usados.has(j.id))
      .sort((a, b) => b.indiceEscalacao - a.indiceEscalacao);

    const qtd = formacao[posicao];
    for (let i = 0; i < qtd && i < candidatos.length; i++) {
      titulares.push(candidatos[i]);
      usados.add(candidatos[i].id);
    }
  }

  const reservas = comIndice
    .filter(j => !usados.has(j.id))
    .sort((a, b) => b.indiceEscalacao - a.indiceEscalacao)
    .slice(0, 7);

  return { titulares, reservas };
}

// Formação padrão 4-3-3 usada nesta build de teste (editável).
export const FORMACAO_PADRAO = {
  GOL: 1, LD: 1, ZAG: 2, LE: 1, VOL: 1, MC: 1, MEI: 1, PD: 1, CA: 1, PE: 1
};
