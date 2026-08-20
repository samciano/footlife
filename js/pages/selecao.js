import { carregarDadosEstaticos, criarNovaCarreira } from "../core/gameState.js";

const dados = await carregarDadosEstaticos();
const personagem = JSON.parse(sessionStorage.getItem("personagem_temp") || "null");

if (!personagem) {
  window.location.href = "criacao.html";
}

let ligaSelecionada = null;
let clubeSelecionado = null;

const gradeLigas = document.getElementById("grade-ligas");
dados.ligas.forEach(liga => {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.style.gridColumn = "span 2";
  chip.textContent = `${liga.nome} (${liga.pais})`;
  chip.dataset.liga = liga.id;
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-liga]").forEach(c => c.classList.remove("selecionado"));
    chip.classList.add("selecionado");
    ligaSelecionada = liga.id;
    clubeSelecionado = null;
    renderClubes(liga);
    validar();
  });
  gradeLigas.appendChild(chip);
});

function renderClubes(liga) {
  const lista = document.getElementById("lista-clubes");
  lista.innerHTML = "";
  liga.clubesIds.forEach(clubeId => {
    const clube = dados.clubes[clubeId];
    const card = document.createElement("div");
    card.className = "clube-card";
    card.dataset.clube = clubeId;
    card.innerHTML = `
      <div class="escudo-placeholder" style="background:${clube.corPrimaria}"></div>
      <div>
        <div class="nome-clube">${clube.nome}</div>
        <div class="overall-clube">Overall médio: ${clube.overallBase}</div>
      </div>`;
    card.addEventListener("click", () => {
      document.querySelectorAll(".clube-card").forEach(c => c.classList.remove("selecionado"));
      card.classList.add("selecionado");
      clubeSelecionado = clubeId;
      validar();
    });
    lista.appendChild(card);
  });
}

function validar() {
  document.getElementById("btnComecar").disabled = !(ligaSelecionada && clubeSelecionado);
}

document.getElementById("btnVoltar").addEventListener("click", () => {
  window.location.href = "criacao.html";
});

document.getElementById("btnComecar").addEventListener("click", () => {
  criarNovaCarreira(personagem, clubeSelecionado, ligaSelecionada, dados);
  sessionStorage.removeItem("personagem_temp");
  window.location.href = "dashboard.html";
});
