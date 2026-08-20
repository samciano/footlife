// engine/simulacaoPartida.js
// Camada que conecta os demais sistemas no dia de partida. A simulação do placar
// em si é simplificada nesta build de teste (baseada na diferença de Overall dos
// clubes) — o foco do projeto é a camada interativa (Sistema de Eventos) que
// decide o desempenho INDIVIDUAL do jogador controlado.

import { calcularForma, classificarForma } from "./forma.js";
import { ajustarMoral, AJUSTES_MORAL } from "./moral.js";
import { calcularRiscoLesao, testarLesao, INTENSIDADE_ATIVIDADE } from "./lesoes.js";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simula um placar simples a partir da força relativa dos dois clubes.
 * Retorna { golsCasa, golsFora }.
 */
export function simularPlacar(overallMandante, overallVisitante, mandanteEhClube) {
  const forcaMandante = overallMandante + 3; // pequeno fator casa
  const diferenca = forcaMandante - overallVisitante;

  const mediaMandante = Math.max(0.3, 1.4 + diferenca * 0.04);
  const mediaVisitante = Math.max(0.3, 1.1 - diferenca * 0.04);

  return {
    golsCasa: poisson(mediaMandante),
    golsFora: poisson(mediaVisitante)
  };
}

function poisson(media) {
  // Aproximação simples de distribuição de gols (0 a 5) sem depender de libs externas.
  const l = Math.exp(-media);
  let k = 0, p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > l && k < 6);
  return k - 1;
}

/**
 * Atualiza todos os sistemas dependentes do jogador após uma partida oficial.
 * @param {Object} jogador - estado atual do jogador (mutado e retornado)
 * @param {number} notaFinal - nota da partida (0-10)
 * @param {number} minutosJogados
 * @param {number} ritmo - ritmo calculado para a partida (0-100)
 * @param {string} dataAtualISO - data da partida (para a janela de 12 meses do Potencial)
 */
export function processarPosJogo(jogador, notaFinal, minutosJogados, ritmo, dataAtualISO) {
  // Histórico de notas -> Forma
  jogador.historicoNotas = [...(jogador.historicoNotas || []), notaFinal].slice(-5);
  jogador.forma = calcularForma(jogador.historicoNotas);

  // Moral
  let deltaMoral = 0;
  if (notaFinal >= 8.0) deltaMoral += AJUSTES_MORAL.grandeAtuacao;
  else if (notaFinal >= 7.0) deltaMoral += AJUSTES_MORAL.boaAtuacao;
  else if (notaFinal < 5.0) deltaMoral += AJUSTES_MORAL.atuacaoRuim;
  jogador.moral = ajustarMoral(jogador.moral, deltaMoral);

  // Desgaste físico (carga da partida)
  jogador.desgaste = Math.max(0, Math.min(100, jogador.desgaste + Math.round(minutosJogados / 90 * 30)));

  // Histórico de potencial (janela de 12 meses)
  jogador.historicoPartidas12m = [...(jogador.historicoPartidas12m || []), {
    data: dataAtualISO,
    minutos: minutosJogados,
    nota: notaFinal,
    ritmo
  }].filter(p => dentroDeUmAno(p.data, dataAtualISO));

  // Estatísticas da temporada
  jogador.estatisticasTemporada = jogador.estatisticasTemporada || { partidas: 0, golsEventos: 0, minutos: 0, somaNotas: 0 };
  jogador.estatisticasTemporada.partidas += 1;
  jogador.estatisticasTemporada.minutos += minutosJogados;
  jogador.estatisticasTemporada.somaNotas += notaFinal;

  // Teste de lesão pós-partida
  const cargaAcumulada = Math.min(100, (jogador.estatisticasTemporada.partidas || 0) * 4);
  const faltaRecuperacao = 100 - Math.min(100, jogador.diasDesdeUltimaPartida * 25 || 0);
  const { riscoFinal } = calcularRiscoLesao(
    jogador.desgaste, cargaAcumulada, INTENSIDADE_ATIVIDADE.partidaOficial, faltaRecuperacao, jogador.atributos
  );
  const teste = testarLesao(riscoFinal, jogador.desgaste, INTENSIDADE_ATIVIDADE.partidaOficial, faltaRecuperacao);
  jogador.diasDesdeUltimaPartida = 0;

  if (teste.lesionou) {
    jogador.lesao = { gravidade: teste.gravidade, diasRestantes: teste.diasAfastado };
  }

  return { jogador, classificacaoForma: classificarForma(jogador.forma), lesaoOcorrida: teste.lesionou ? teste : null };
}

function dentroDeUmAno(dataISO, referenciaISO) {
  const d = new Date(dataISO);
  const ref = new Date(referenciaISO);
  const umAnoAtras = new Date(ref);
  umAnoAtras.setFullYear(umAnoAtras.getFullYear() - 1);
  return d >= umAnoAtras;
}

/**
 * Processa um dia de treino (sem partida): pequeno ganho de atributo no foco
 * de desenvolvimento, desgaste e chance de lesão conforme intensidade.
 */
export function processarTreino(jogador, intensidade, focoDesenvolvimento) {
  const INTENSIDADES = {
    leve: { desgaste: 5, ganho: 0.2, chaveIntensidade: INTENSIDADE_ATIVIDADE.treinoLeve },
    normal: { desgaste: 12, ganho: 0.5, chaveIntensidade: INTENSIDADE_ATIVIDADE.treinoNormal },
    intenso: { desgaste: 20, ganho: 0.9, chaveIntensidade: INTENSIDADE_ATIVIDADE.treinoIntenso },
    descanso: { desgaste: -15, ganho: 0, chaveIntensidade: 0 }
  };
  const cfg = INTENSIDADES[intensidade] || INTENSIDADES.normal;

  jogador.desgaste = Math.max(0, Math.min(100, jogador.desgaste + cfg.desgaste));

  if (intensidade !== "descanso" && focoDesenvolvimento && jogador.atributos[focoDesenvolvimento] !== undefined) {
    jogador.atributos[focoDesenvolvimento] = Math.min(99, +(jogador.atributos[focoDesenvolvimento] + cfg.ganho).toFixed(2));
    jogador.moral = ajustarMoral(jogador.moral, AJUSTES_MORAL.treinouHoje);
  } else if (intensidade === "descanso") {
    // descanso não treina o atributo, mas recupera fisicamente
  }

  let lesaoOcorrida = null;
  if (intensidade !== "descanso") {
    const { riscoFinal } = calcularRiscoLesao(jogador.desgaste, 30, cfg.chaveIntensidade, 20, jogador.atributos);
    const teste = testarLesao(riscoFinal, jogador.desgaste, cfg.chaveIntensidade, 20);
    if (teste.lesionou) {
      jogador.lesao = { gravidade: teste.gravidade, diasRestantes: teste.diasAfastado };
      lesaoOcorrida = teste;
    }
  }

  return { jogador, lesaoOcorrida };
}
