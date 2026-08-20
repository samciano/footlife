import { carregarDadosEstaticos } from "../core/gameState.js";

const dados = await carregarDadosEstaticos();

const gradePosicoes = document.getElementById("grade-posicoes");
dados.posicoes.forEach(p => {
  const chip = document.createElement("div");
  chip.className = "chip";
  chip.dataset.pos = p.codigo;
  chip.textContent = p.codigo;
  chip.title = p.nome;
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-pos]").forEach(c => c.classList.remove("selecionado"));
    chip.classList.add("selecionado");
    validar();
  });
  gradePosicoes.appendChild(chip);
});

document.querySelectorAll("[data-pe]").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll("[data-pe]").forEach(c => c.classList.remove("selecionado"));
    chip.classList.add("selecionado");
    validar();
  });
});

const campos = ["nome", "nacionalidade", "nascimento"].map(id => document.getElementById(id));
campos.forEach(el => el.addEventListener("input", validar));

function validar() {
  const posSelecionada = document.querySelector("[data-pos].selecionado");
  const peSelecionado = document.querySelector("[data-pe].selecionado");
  const ok = campos.every(el => el.value.trim() !== "") && posSelecionada && peSelecionado;
  document.getElementById("btnContinuar").disabled = !ok;
}

document.getElementById("btnContinuar").addEventListener("click", () => {
  const personagem = {
    nome: document.getElementById("nome").value.trim(),
    nacionalidade: document.getElementById("nacionalidade").value.trim(),
    dataNascimento: document.getElementById("nascimento").value,
    peDominante: document.querySelector("[data-pe].selecionado").dataset.pe,
    posicao: document.querySelector("[data-pos].selecionado").dataset.pos
  };
  sessionStorage.setItem("personagem_temp", JSON.stringify(personagem));
  window.location.href = "selecao.html";
});
