import {
  carregarDadosEstaticos, carregarEstado, salvarEstado,
  verificarDia, executarDiaDeTreino
} from "../core/gameState.js";
import { classificarForma } from "../engine/forma.js";
import { classificarMoral } from "../engine/moral.js";
import { formatarValor } from "../engine/valorBase.js";
import { LISTA_ATRIBUTOS } from "../engine/atributos.js";
import { calcularPotencial, classificarPotencial } from "../engine/potencial.js";

const dados = await carregarDadosEstaticos();
let estado = carregarEstado();

if (!estado) {
  window.location.href = "criacao.html";
}

renderTudo();

function renderTudo() {
  const j = estado.jogador;
  const clube = dados.clubes[estado.clubeId];

  document.getElementById("txtNomeJogador").textContent = j.nome;
  document.getElementById("txtClubePos").textContent = `${clube.nome} · ${j.posicao}`;
  document.getElementById("txtOverall").textContent = j.overall;
  document.getElementById("txtValor").textContent = formatarValor(j.valorMercado);

  document.getElementById("txtForma").textContent = `${j.forma} · ${classificarForma(j.forma)}`;
  document.getElementById("barraForma").style.width = `${j.forma}%`;

  document.getElementById("txtMoral").textContent = `${j.moral} · ${classificarMoral(j.moral)}`;
  document.getElementById("barraMoral").style.width = `${j.moral}%`;

  const condicao = 100 - j.desgaste;
  document.getElementById("txtCondicao").textContent = `${condicao}%`;
  document.getElementById("barraCondicao").style.width = `${condicao}%`;

  const potencial = calcularPotencial(j.historicoPartidas12m || [], j.overallHaUmAno, j.overall);
  document.getElementById("txtPotencial").textContent = `${potencial} · ${classificarPotencial(potencial)}`;

  const blocoLesao = document.getElementById("blocoLesao");
  if (j.lesao) {
    blocoLesao.style.display = "block";
    blocoLesao.textContent = `Lesionado (${j.lesao.gravidade}) — ${j.lesao.diasRestantes} dia(s) restante(s)`;
  } else {
    blocoLesao.style.display = "none";
  }

  document.getElementById("listaStatus").innerHTML = `
    <li><strong>${j.nacionalidade}</strong>Nacionalidade</li>
    <li><strong>${idade(j.dataNascimento)} anos</strong>Idade</li>
    <li><strong>${j.peDominante === "destro" ? "Destro" : "Canhoto"}</strong>Pé dominante</li>
    <li><strong>${liga(estado.ligaId).nome}</strong>Liga</li>
  `;

  document.getElementById("txtDataAtual").textContent = formatarData(estado.dataAtual);

  const stats = j.estatisticasTemporada || { partidas: 0, minutos: 0, somaNotas: 0 };
  const mediaNotas = stats.partidas ? (stats.somaNotas / stats.partidas).toFixed(1) : "-";
  document.getElementById("listaStats").innerHTML = `
    <li>Partidas: ${stats.partidas}</li>
    <li>Minutos: ${stats.minutos}</li>
    <li>Nota média: ${mediaNotas}</li>
  `;

  const proxima = estado.calendarioClube.partidasDoClube.find(p => p.data >= estado.dataAtual);
  const listaProx = document.getElementById("listaProximaPartida");
  if (proxima) {
    const adversario = dados.clubes[proxima.adversarioId];
    listaProx.innerHTML = `
      <li>${formatarData(proxima.data)}</li>
      <li>${proxima.casa ? "vs" : "@"} ${adversario.nome}</li>
      <li>Rodada ${proxima.rodada}</li>
    `;
  } else {
    listaProx.innerHTML = `<li>Fim de temporada</li>`;
  }

  document.getElementById("listaNoticias").innerHTML = `<li>Sem notícias no momento.</li>`;

  const inboxOrdenado = [...(estado.inbox || [])].reverse().slice(0, 4);
  document.getElementById("listaInbox").innerHTML = inboxOrdenado.length
    ? inboxOrdenado.map(m => `<li>${m.titulo}</li>`).join("")
    : `<li>Sem mensagens.</li>`;

  const ultima = estado.inbox && estado.inbox.length ? estado.inbox[estado.inbox.length - 1] : null;
  document.getElementById("txtBanner").textContent = ultima ? `${ultima.titulo} — ${ultima.corpo}` : "Nenhum evento recente.";

  renderFoco();
  renderControlesDia();
}

function renderFoco() {
  const select = document.getElementById("selectFoco");
  select.innerHTML = LISTA_ATRIBUTOS.map(a => `<option value="${a}">${rotuloAtributo(a)} (${estado.jogador.atributos[a]})</option>`).join("");
  select.value = estado.jogador.focoDesenvolvimento;
  select.onchange = () => {
    estado.jogador.focoDesenvolvimento = select.value;
    salvarEstado(estado);
  };
}

function renderControlesDia() {
  const container = document.getElementById("controlesDia");
  const verificacao = verificarDia(estado);
  const statusEl = document.getElementById("txtStatusDia");

  if (verificacao.tipoDia === "partida") {
    const adversario = dados.clubes[verificacao.partida.adversarioId];
    statusEl.textContent = `Dia de partida: ${verificacao.partida.casa ? "vs" : "@"} ${adversario.nome}`;
    container.innerHTML = `<button class="control-btn" id="btnIrPartida">Ir para a partida ▶</button>`;
    document.getElementById("btnIrPartida").addEventListener("click", () => {
      window.location.href = "partida.html";
    });
    document.getElementById("blocoFoco").style.opacity = 0.5;
    return;
  }

  document.getElementById("blocoFoco").style.opacity = 1;

  if (estado.jogador.lesao) {
    statusEl.textContent = "Você está lesionado. Apenas recuperação hoje.";
    container.innerHTML = `<button class="control-btn" id="btnAvancar">Avançar dia ⏩</button>`;
    document.getElementById("btnAvancar").addEventListener("click", () => {
      const { lesaoOcorrida } = executarDiaDeTreino(estado, "descanso");
      pos(lesaoOcorrida);
    });
    return;
  }

  statusEl.textContent = "Dia livre. Escolha a intensidade do treino.";
  container.innerHTML = `
    <button class="control-btn" data-int="leve">Leve</button>
    <button class="control-btn" data-int="normal">Normal</button>
    <button class="control-btn" data-int="intenso">Intenso</button>
    <button class="control-btn secundario" data-int="descanso">Descanso</button>
  `;
  container.querySelectorAll("[data-int]").forEach(btn => {
    btn.addEventListener("click", () => {
      const { lesaoOcorrida } = executarDiaDeTreino(estado, btn.dataset.int);
      pos(lesaoOcorrida);
    });
  });
}

function pos(lesaoOcorrida) {
  if (lesaoOcorrida) {
    estado.inbox.push({
      data: estado.dataAtual,
      titulo: "Lesão no treino",
      corpo: `Você sofreu uma lesão ${lesaoOcorrida.gravidade} e ficará afastado por aproximadamente ${lesaoOcorrida.diasAfastado} dia(s).`
    });
    salvarEstado(estado);
  }
  renderTudo();
}

function idade(dataNascimentoISO) {
  const nasc = new Date(dataNascimentoISO);
  const hoje = new Date();
  let anos = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) anos--;
  return anos;
}

function liga(ligaId) {
  return dados.ligas.find(l => l.id === ligaId);
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function rotuloAtributo(chave) {
  const mapa = {
    velocidade: "Velocidade", resistencia: "Resistência", forca: "Força", impulsao: "Impulsão",
    agilidade: "Agilidade", flexibilidade: "Flexibilidade", finalizacao: "Finalização", passe: "Passe",
    drible: "Drible", desarme: "Desarme", controleBola: "Controle de Bola", reflexos: "Reflexos",
    visaoJogo: "Visão de Jogo", comportamento: "Comportamento", foco: "Foco", lideranca: "Liderança",
    posicionamento: "Posicionamento", frieza: "Frieza"
  };
  return mapa[chave] || chave;
}
