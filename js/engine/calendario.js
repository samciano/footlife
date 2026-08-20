// engine/calendario.js
// Implementa uma versão inicial de calendario.txt: temporada de 01/07 a 30/06,
// com o calendário do clube gerado dinamicamente a partir da competição em que
// está inscrito.
//
// SIMPLIFICAÇÃO DESTA BUILD DE TESTE: apenas a liga nacional (pontos corridos,
// returno duplo) é simulada. A estrutura já prevê o campo "competicao" em cada
// partida para que copas nacionais e torneios continentais possam ser
// adicionados depois sem redesenhar o calendário — bastaria gerar novas
// partidas com competicao: "copa_nacional" / "continental" e mesclá-las aqui.

function addDias(dataISO, dias) {
  const d = new Date(dataISO);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

// Algoritmo do círculo: gera rodadas de turno único para uma lista de times.
function gerarRodadasTurnoUnico(times) {
  const lista = [...times];
  if (lista.length % 2 !== 0) lista.push(null); // "bye" se ímpar
  const n = lista.length;
  const rodadas = [];

  for (let r = 0; r < n - 1; r++) {
    const rodada = [];
    for (let i = 0; i < n / 2; i++) {
      const a = lista[i];
      const b = lista[n - 1 - i];
      if (a !== null && b !== null) rodada.push([a, b]);
    }
    rodadas.push(rodada);
    // rotaciona (mantém o primeiro fixo)
    lista.splice(1, 0, lista.pop());
  }
  return rodadas;
}

/**
 * Gera o calendário de temporada de um clube dentro de uma liga de pontos corridos
 * com returno duplo (ida e volta), a partir de 1º de julho de `anoInicio`.
 */
export function gerarCalendarioTemporada(clubeId, clubesIdsDaLiga, anoInicio) {
  const turno1 = gerarRodadasTurnoUnico(clubesIdsDaLiga);
  const turno2 = turno1.map(rodada => rodada.map(([a, b]) => [b, a])); // returno: inverte mando de campo
  const todasRodadas = [...turno1, ...turno2];

  let dataRodada = `${anoInicio}-08-10`; // pré-temporada em julho, liga começa em agosto
  const partidasDoClube = [];

  todasRodadas.forEach((rodada, indice) => {
    const jogoDoClube = rodada.find(([a, b]) => a === clubeId || b === clubeId);
    if (jogoDoClube) {
      const [mandante, visitante] = jogoDoClube;
      partidasDoClube.push({
        data: dataRodada,
        rodada: indice + 1,
        competicao: "liga",
        mandante,
        visitante,
        casa: mandante === clubeId,
        adversarioId: mandante === clubeId ? visitante : mandante,
        resultado: null // preenchido após a simulação: { golsClube, golsAdversario }
      });
    }
    dataRodada = addDias(dataRodada, 7);
  });

  const dataInicioTemporada = `${anoInicio}-07-01`;
  const dataFimTemporada = `${anoInicio + 1}-06-30`;

  return { dataInicioTemporada, dataFimTemporada, partidasDoClube };
}

export function partidaNoDia(calendarioClube, dataISO) {
  return calendarioClube.partidasDoClube.find(p => p.data === dataISO) || null;
}

export function proximaData(dataISO) {
  return addDias(dataISO, 1);
}

export function temporadaTerminou(dataISO, dataFimTemporada) {
  return dataISO > dataFimTemporada;
}
