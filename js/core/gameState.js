// core/gameState.js
// Estado central da carreira. Reúne os módulos de engine/ e os dados editáveis
// de data/ em um único fluxo de jogo (gameplay_fluxo.txt).

import { Storage } from "./storage.js";
import { gerarAtributosIniciais } from "../engine/atributos.js";
import { calcularOverall } from "../engine/overall.js";
import { calcularValorBase } from "../engine/valorBase.js";
import { gerarElenco } from "../engine/squadGen.js";
import { gerarCalendarioTemporada, partidaNoDia, proximaData, temporadaTerminou } from "../engine/calendario.js";
import { processarTreino } from "../engine/simulacaoPartida.js";

let DADOS = null; // cache de ligas/clubes/posições carregados dos JSON

export async function carregarDadosEstaticos() {
  if (DADOS) return DADOS;
  const [ligasResp, clubesResp, posicoesResp] = await Promise.all([
    fetch("data/ligas.json"),
    fetch("data/clubes.json"),
    fetch("data/posicoes.json")
  ]);
  const [ligas, clubes, posicoes] = await Promise.all([ligasResp.json(), clubesResp.json(), posicoesResp.json()]);
  DADOS = { ligas: ligas.ligas, clubes: clubes.clubes, posicoes: posicoes.posicoes };
  return DADOS;
}

function papelDaPosicao(codigo, posicoes) {
  const info = posicoes.find(p => p.codigo === codigo);
  return info ? info.papelOverall : "Meio-campista";
}

/**
 * Cria uma nova carreira a partir das escolhas da criação de personagem
 * (sistema_criacao_personagem) e da seleção de liga/clube.
 */
export function criarNovaCarreira({ nome, nacionalidade, dataNascimento, peDominante, posicao }, clubeId, ligaId, dados) {
  const papel = papelDaPosicao(posicao, dados.posicoes);
  const atributos = gerarAtributosIniciais(posicao, 52); // jovem em início de carreira
  const overall = calcularOverall(atributos, papel);
  const clube = dados.clubes[clubeId];

  const jogador = {
    nome, nacionalidade, dataNascimento, peDominante, posicao, papelOverall: papel,
    atributos, overall,
    forma: 60,                 // estado inicial: Irregular
    moral: 50,                 // estado inicial: Rotação
    desgaste: 10,
    valorMercado: calcularValorBase(overall),
    historicoNotas: [],
    historicoPartidas12m: [],
    estatisticasTemporada: { partidas: 0, minutos: 0, somaNotas: 0 },
    lesao: null,
    diasDesdeUltimaPartida: 99,
    focoDesenvolvimento: primeiroAtributoForte(atributos),
    overallHaUmAno: overall, // aproximação inicial para o cálculo de Potencial (janela de 12 meses)
    clubeId,
    ligaId,
    ehJogadorPrincipal: true,
    id: "jogador_principal"
  };

  const liga = dados.ligas.find(l => l.id === ligaId);
  const anoInicio = new Date().getFullYear();

  let elenco = gerarElenco(clube, dados.posicoes);
  // Substitui um NPC da mesma posição pelo jogador principal (ou apenas adiciona).
  const idxSubstituir = elenco.findIndex(j => j.posicao === posicao);
  if (idxSubstituir >= 0) elenco.splice(idxSubstituir, 1);
  elenco.push(jogador);

  const calendarioClube = gerarCalendarioTemporada(clubeId, liga.clubesIds, anoInicio);

  const estado = {
    jogador,
    elenco,
    clubeId,
    ligaId,
    dataAtual: calendarioClube.dataInicioTemporada,
    calendarioClube,
    inbox: [{
      data: calendarioClube.dataInicioTemporada,
      titulo: "Bem-vindo ao elenco",
      corpo: `O treinador te apresentou ao grupo do ${clube.nome}. Boa sorte na temporada!`
    }]
  };

  Storage.salvar(estado);
  return estado;
}

function primeiroAtributoForte(atributos) {
  return Object.entries(atributos).sort((a, b) => b[1] - a[1])[0][0];
}

export function carregarEstado() {
  return Storage.carregar();
}

export function salvarEstado(estado) {
  Storage.salvar(estado);
}

/**
 * Verifica o que acontece no dia atual (gameplay_fluxo.txt, passo 1).
 * Retorna { tipoDia: 'partida' | 'normal', partida? }
 */
export function verificarDia(estado) {
  const partida = partidaNoDia(estado.calendarioClube, estado.dataAtual);
  if (partida) return { tipoDia: "partida", partida };
  return { tipoDia: "normal" };
}

/**
 * Executa a decisão de treinamento de um dia sem partida e avança o calendário.
 */
export function executarDiaDeTreino(estado, intensidade) {
  const { lesaoOcorrida } = processarTreino(estado.jogador, intensidade, estado.jogador.focoDesenvolvimento);
  recalcularOverall(estado.jogador);
  avancarCalendario(estado);
  salvarEstado(estado);
  return { estado, lesaoOcorrida };
}

function recalcularOverall(jogador) {
  jogador.overall = calcularOverall(jogador.atributos, jogador.papelOverall);
  jogador.valorMercado = calcularValorBase(jogador.overall);
}

/**
 * Avança apenas o calendário (usado após concluir uma partida) e trata lesões/temporada.
 */
export function avancarCalendario(estado) {
  if (estado.jogador.lesao) {
    estado.jogador.lesao.diasRestantes -= 1;
    if (estado.jogador.lesao.diasRestantes <= 0) estado.jogador.lesao = null;
  }
  estado.jogador.diasDesdeUltimaPartida = (estado.jogador.diasDesdeUltimaPartida || 0) + 1;
  estado.jogador.desgaste = Math.max(0, estado.jogador.desgaste - 3); // recuperação natural diária

  estado.dataAtual = proximaData(estado.dataAtual);

  if (temporadaTerminou(estado.dataAtual, estado.calendarioClube.dataFimTemporada)) {
    reiniciarNovaTemporada(estado);
  }
}

function reiniciarNovaTemporada(estado) {
  const dados = DADOS;
  const liga = dados.ligas.find(l => l.id === estado.ligaId);
  const anoInicio = new Date(estado.dataAtual).getFullYear();
  estado.calendarioClube = gerarCalendarioTemporada(estado.clubeId, liga.clubesIds, anoInicio);
  estado.jogador.estatisticasTemporada = { partidas: 0, minutos: 0, somaNotas: 0 };
  estado.jogador.overallHaUmAno = estado.jogador.overall; // referência aproximada para a próxima janela de Potencial
  estado.inbox.push({
    data: estado.dataAtual,
    titulo: "Nova temporada",
    corpo: "Uma nova temporada começou. Boa sorte!"
  });
}

export function getDadosCarregados() {
  return DADOS;
}
