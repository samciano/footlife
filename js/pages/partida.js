import { carregarDadosEstaticos, carregarEstado, salvarEstado, avancarCalendario } from "../core/gameState.js";
import { montarEscalacao, FORMACAO_PADRAO } from "../engine/escalacao.js";
import { calcularRitmoPartida, classificarRitmo } from "../engine/ritmo.js";
import { gerarEventos, resolverOpcao } from "../engine/eventos.js";
import { notaInicial, aplicarDelta, classificarNota } from "../engine/notaPartida.js";
import { simularPlacar, processarPosJogo } from "../engine/simulacaoPartida.js";

const dados = await carregarDadosEstaticos();
const estado = carregarEstado();
if (!estado) window.location.href = "criacao.html";

const partida = estado.calendarioClube.partidasDoClube.find(p => p.data === estado.dataAtual);
if (!partida) window.location.href = "dashboard.html";

const clube = dados.clubes[estado.clubeId];
const adversario = dados.clubes[partida.adversarioId];

document.getElementById("txtCabecalhoPartida").textContent =
  partida.casa ? `${clube.nome} vs ${adversario.nome}` : `${adversario.nome} vs ${clube.nome}`;
document.getElementById("txtSubCabecalho").textContent = `Rodada ${partida.rodada} · ${formatarData(partida.data)}`;

const area = document.getElementById("areaPrincipal");

// 1) Escalação -----------------------------------------------------------
const { titulares, reservas } = montarEscalacao(estado.elenco, FORMACAO_PADRAO);
const ehTitular = titulares.some(j => j.ehJogadorPrincipal);
const estaNoBanco = reservas.some(j => j.ehJogadorPrincipal);

let minutosJogados = 0;
let entrouComoSubstituto = false;

if (ehTitular) {
  minutosJogados = 90;
} else if (estaNoBanco && Math.random() < 0.4) {
  entrouComoSubstituto = true;
  minutosJogados = 20 + Math.floor(Math.random() * 25);
}

const overallMediaMandante = partida.casa
  ? mediaOverall(titulares.length ? titulares : [estado.jogador])
  : adversario.overallBase;
const overallMediaVisitante = partida.casa
  ? adversario.overallBase
  : mediaOverall(titulares.length ? titulares : [estado.jogador]);

function mediaOverall(lista) {
  return lista.reduce((s, j) => s + j.overall, 0) / lista.length;
}

if (minutosJogados === 0) {
  renderForaDoJogo();
} else {
  const ritmo = calcularRitmoPartida(estado.jogador);
  const classificacaoRitmo = classificarRitmo(ritmo);
  iniciarEventos(ritmo, classificacaoRitmo.eventos);
}

// 2) Fluxo de eventos ------------------------------------------------------
function iniciarEventos(ritmo, quantidadeEventos) {
  const eventos = gerarEventos(estado.jogador.posicao, quantidadeEventos);
  let notaAtual = notaInicial();
  let indice = 0;

  function renderEvento() {
    if (indice >= eventos.length) {
      finalizarPartida(ritmo, notaAtual);
      return;
    }
    const evento = eventos[indice];
    area.innerHTML = `
      <div class="card">
        <div class="card-title">Situação ${indice + 1} de ${eventos.length}</div>
        <p class="situacao-evento">${evento.situacao}</p>
        <div class="opcoes-evento">
          ${evento.opcoes.map((op, i) => `
            <div class="opcao-evento ${classeRisco(op.risco)}" data-op="${i}">
              <span class="rotulo-risco">${rotuloRisco(op.risco)}</span>
              ${op.texto}
            </div>`).join("")}
        </div>
        <div id="resultadoEvento"></div>
      </div>
    `;
    area.querySelectorAll("[data-op]").forEach(el => {
      el.addEventListener("click", () => {
        area.querySelectorAll("[data-op]").forEach(o => o.style.pointerEvents = "none");
        const opcao = evento.opcoes[Number(el.dataset.op)];
        const resultado = resolverOpcao(estado.jogador.atributos, opcao);
        notaAtual = aplicarDelta(notaAtual, resultado.notaDelta);

        document.getElementById("resultadoEvento").innerHTML = `
          <div class="resultado-evento ${resultado.sucesso ? "sucesso" : "falha"}">
            <strong>${resultado.sucesso ? "Deu certo!" : "Não deu certo."}</strong>
            <p style="margin-top:6px;">${resultado.texto}</p>
            <p style="margin-top:6px; color:var(--text-muted); font-size:0.8rem;">Nota atual: ${notaAtual.toFixed(1)}</p>
            <button class="btn" style="margin-top:12px;" id="btnProximo">Continuar</button>
          </div>
        `;
        document.getElementById("btnProximo").addEventListener("click", () => {
          indice++;
          renderEvento();
        });
      });
    });
  }

  if (eventos.length === 0) {
    area.innerHTML = `<div class="card"><p>O ritmo de jogo esteve baixo hoje — nenhuma situação decisiva chegou até você.</p>
      <button class="btn" style="margin-top:16px;" id="btnSeguir">Seguir</button></div>`;
    document.getElementById("btnSeguir").addEventListener("click", () => finalizarPartida(ritmo, notaAtual));
  } else {
    renderEvento();
  }
}

function renderForaDoJogo() {
  area.innerHTML = `
    <div class="card">
      <p>Você não entrou em campo nesta partida.</p>
      <button class="btn" style="margin-top:16px;" id="btnSeguir">Ver resultado</button>
    </div>
  `;
  document.getElementById("btnSeguir").addEventListener("click", () => finalizarPartida(50, null));
}

// 3) Resultado final ---------------------------------------------------
function finalizarPartida(ritmo, notaFinal) {
  const placar = simularPlacar(overallMediaMandante, overallMediaVisitante, partida.casa);
  const golsClube = partida.casa ? placar.golsCasa : placar.golsFora;
  const golsAdversario = partida.casa ? placar.golsFora : placar.golsCasa;
  partida.resultado = { golsClube, golsAdversario };

  let lesaoInfo = null;
  if (notaFinal !== null) {
    const resultado = processarPosJogo(estado.jogador, notaFinal, minutosJogados, ritmo, estado.dataAtual);
    lesaoInfo = resultado.lesaoOcorrida;
  }

  avancarCalendario(estado);

  estado.inbox.push({
    data: estado.dataAtual,
    titulo: notaFinal !== null ? `Partida encerrada — nota ${notaFinal.toFixed(1)}` : "Partida encerrada",
    corpo: `${clube.nome} ${golsClube} x ${golsAdversario} ${adversario.nome}.` +
      (notaFinal !== null ? ` Sua nota: ${notaFinal.toFixed(1)} (${classificarNota(notaFinal)}).` : " Você não entrou em campo.")
  });

  salvarEstado(estado);

  area.innerHTML = `
    <div class="card placar-final">
      <div class="card-title">Resultado final</div>
      <div class="numeros">${clube.abrev} ${golsClube} x ${golsAdversario} ${adversario.abrev}</div>
      ${notaFinal !== null ? `<div class="nota-final">Sua nota: ${notaFinal.toFixed(1)}</div><div style="color:var(--text-muted);margin-top:6px;">${classificarNota(notaFinal)}</div>` : `<div style="color:var(--text-muted);">Você não entrou em campo</div>`}
      ${lesaoInfo ? `<p style="color:var(--risco-alto); margin-top:12px;">Lesão ${lesaoInfo.gravidade} — ${lesaoInfo.diasAfastado} dia(s) de recuperação.</p>` : ""}
      <button class="btn" style="margin-top:20px;" id="btnVoltar">Voltar ao dashboard</button>
    </div>
  `;
  document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });
}

function classeRisco(risco) {
  return risco === "alto" ? "alta" : risco === "medio" ? "media" : "baixa";
}
function rotuloRisco(risco) {
  return risco === "alto" ? "Alto risco" : risco === "medio" ? "Médio risco" : "Baixo risco";
}
function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}
