// engine/lesoes.js
// Implementa sistema_lesoes.txt: risco previsível, ocorrência imprevisível.

export function calcularProtecaoFisica(atributos) {
  return (
    atributos.resistencia * 0.40 +
    atributos.forca * 0.20 +
    atributos.agilidade * 0.15 +
    atributos.flexibilidade * 0.15 +
    atributos.velocidade * 0.05 +
    atributos.impulsao * 0.05
  );
}

/**
 * @param {number} desgaste 0-100 - fadiga atual do jogador
 * @param {number} cargaAcumulada 0-100 - volume de esforço recente
 * @param {number} intensidadeAtividade 0-100 - exigência física da atividade (treino leve/normal/intenso, amistoso, partida oficial)
 * @param {number} faltaRecuperacao 0-100 - inverso do tempo de descanso disponível
 * @param {Object} atributos
 */
export function calcularRiscoLesao(desgaste, cargaAcumulada, intensidadeAtividade, faltaRecuperacao, atributos) {
  const riscoBase =
    desgaste * 0.40 +
    cargaAcumulada * 0.25 +
    intensidadeAtividade * 0.20 +
    faltaRecuperacao * 0.15;

  const protecaoFisica = calcularProtecaoFisica(atributos);
  const riscoFinal = riscoBase * (1 - protecaoFisica / 200);

  return { riscoBase, protecaoFisica, riscoFinal: Math.max(0, Math.min(100, riscoFinal)) };
}

/**
 * Testa se a lesão ocorre (rolagem contra o risco final, 0-100) e, se ocorrer,
 * determina a gravidade com base na sobrecarga física do momento.
 */
export function testarLesao(riscoFinal, desgaste, intensidadeAtividade, faltaRecuperacao) {
  const rolagem = Math.random() * 100;
  if (rolagem >= riscoFinal) {
    return { lesionou: false, gravidade: null };
  }

  // Sobrecarga: combina desgaste, intensidade e falta de recuperação para pesar a gravidade.
  const sobrecarga = (desgaste * 0.5 + intensidadeAtividade * 0.3 + faltaRecuperacao * 0.2);

  let probLeve, probMedia, probGrave;
  if (sobrecarga < 40) {
    probLeve = 0.75; probMedia = 0.20; probGrave = 0.05;
  } else if (sobrecarga < 70) {
    probLeve = 0.50; probMedia = 0.35; probGrave = 0.15;
  } else {
    probLeve = 0.30; probMedia = 0.40; probGrave = 0.30;
  }

  const r = Math.random();
  let gravidade;
  if (r < probLeve) gravidade = "leve";
  else if (r < probLeve + probMedia) gravidade = "media";
  else gravidade = "grave";

  const diasAfastado = {
    leve: rand(3, 10),
    media: rand(14, 42),
    grave: rand(90, 240)
  }[gravidade];

  return { lesionou: true, gravidade, diasAfastado };
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Intensidades de referência para atividades (0-100), usadas como entrada do cálculo.
export const INTENSIDADE_ATIVIDADE = {
  treinoLeve: 20,
  treinoNormal: 45,
  treinoIntenso: 75,
  amistoso: 55,
  partidaOficial: 85
};
