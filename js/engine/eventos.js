// engine/eventos.js
// Implementa sistema_eventos.txt: eventos específicos por posição, sempre com
// 3 opções (Alto risco/Vermelha, Médio risco/Amarela, Baixo risco/Verde).
//
// Este é um BANCO DE DADOS editável: para adicionar novos eventos a uma posição,
// basta acrescentar um novo objeto no array correspondente — nenhum código
// precisa mudar. Cada opção define os atributos usados para calcular a chance
// de sucesso e o impacto na nota em caso de sucesso/fracasso.

export const BANCO_EVENTOS = {
  GOL: [
    {
      situacao: "Um cruzamento perigoso chega na área e você precisa decidir a saída do gol.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Sair e socar a bola no meio de todo mundo", atributos: ["agilidade", "impulsao"], sucesso: { notaDelta: 0.8, texto: "Você afasta o perigo com autoridade." }, falha: { notaDelta: -1.2, texto: "Você erra o soco e a bola sobra livre na área." } },
        { risco: "medio", cor: "amarela", texto: "Sair e tentar agarrar a bola", atributos: ["reflexos", "posicionamento"], sucesso: { notaDelta: 0.5, texto: "Você agarra o cruzamento com segurança." }, falha: { notaDelta: -0.6, texto: "A bola escapa das suas mãos, mas um zagueiro afasta." } },
        { risco: "baixo", cor: "verde", texto: "Ficar na linha e orientar a zaga", atributos: ["posicionamento", "foco"], sucesso: { notaDelta: 0.2, texto: "Bem posicionado, você orienta a defesa e o lance é resolvido." }, falha: { notaDelta: -0.3, texto: "Ficar parado custa caro: o atacante cabeceia livre." } }
      ]
    },
    {
      situacao: "Um chute forte de fora da área vem em direção ao seu gol.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Tentar espalmar para escanteio com estilo", atributos: ["reflexos", "agilidade"], sucesso: { notaDelta: 0.9, texto: "Defesa espetacular, a torcida vibra!" }, falha: { notaDelta: -1.5, texto: "A bola passa por baixo do seu braço. Gol." } },
        { risco: "medio", cor: "amarela", texto: "Defender e segurar a bola", atributos: ["reflexos", "controleBola"], sucesso: { notaDelta: 0.5, texto: "Você segura a bola com firmeza." }, falha: { notaDelta: -0.7, texto: "A bola bate no seu peito e sobra perigosamente." } },
        { risco: "baixo", cor: "verde", texto: "Espalmar de qualquer jeito para longe", atributos: ["reflexos"], sucesso: { notaDelta: 0.2, texto: "Você tira o perigo sem estilo, mas resolve." }, falha: { notaDelta: -0.4, texto: "Mesmo espalmando, a bola sobra para o rebote." } }
      ]
    }
  ],

  ZAG: [
    {
      situacao: "O atacante adversário recebe em profundidade e parte para o um contra um com você.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Ir para o carrinho e tentar tirar a bola", atributos: ["desarme", "agilidade"], sucesso: { notaDelta: 0.9, texto: "Desarme perfeito, você tira a bola sem falta." }, falha: { notaDelta: -1.3, texto: "Você erra o carrinho e derruba o atacante na área." } },
        { risco: "medio", cor: "amarela", texto: "Marcar de perto e forçar o erro", atributos: ["desarme", "posicionamento"], sucesso: { notaDelta: 0.5, texto: "Sua marcação sufoca o atacante, que erra o domínio." }, falha: { notaDelta: -0.6, texto: "O atacante se livra da marcação e finaliza." } },
        { risco: "baixo", cor: "verde", texto: "Recuar e aguardar apoio de um companheiro", atributos: ["posicionamento", "foco"], sucesso: { notaDelta: 0.2, texto: "Você segura a jogada até a chegada do apoio." }, falha: { notaDelta: -0.3, texto: "Ao recuar demais, você dá espaço para o chute." } }
      ]
    },
    {
      situacao: "Escanteio para o adversário: a bola vem cruzada na área.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Disputar o cabeceio no ponto mais alto", atributos: ["impulsao", "forca"], sucesso: { notaDelta: 0.8, texto: "Você vence o duelo aéreo e afasta o perigo." }, falha: { notaDelta: -1.1, texto: "Você perde a disputa e o adversário cabeceia livre." } },
        { risco: "medio", cor: "amarela", texto: "Marcar o homem e disputar a posição", atributos: ["posicionamento", "forca"], sucesso: { notaDelta: 0.4, texto: "Bem postado, você neutraliza o adversário." }, falha: { notaDelta: -0.5, texto: "O adversário ganha a posição e finca a cabeçada." } },
        { risco: "baixo", cor: "verde", texto: "Ficar na segunda trave, prevenindo o rebote", atributos: ["posicionamento", "foco"], sucesso: { notaDelta: 0.2, texto: "Você antecipa o rebote e afasta o perigo." }, falha: { notaDelta: -0.3, texto: "Longe do lance principal, você não consegue evitar o gol." } }
      ]
    }
  ],

  LE: [
    {
      situacao: "Você recebe na lateral do campo com espaço para avançar.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Encarar o lateral adversário no drible", atributos: ["drible", "agilidade"], sucesso: { notaDelta: 0.7, texto: "Você passa pelo marcador e chega para cruzar." }, falha: { notaDelta: -0.9, texto: "Você perde a bola no drible e o time fica exposto no contra-ataque." } },
        { risco: "medio", cor: "amarela", texto: "Cruzar na primeira oportunidade", atributos: ["passe", "visaoJogo"], sucesso: { notaDelta: 0.5, texto: "Cruzamento preciso, quase vira gol." }, falha: { notaDelta: -0.4, texto: "O cruzamento sai errado e a defesa afasta." } },
        { risco: "baixo", cor: "verde", texto: "Tocar para trás e manter a posse", atributos: ["passe", "controleBola"], sucesso: { notaDelta: 0.2, texto: "Jogada segura, a equipe mantém a posse." }, falha: { notaDelta: -0.2, texto: "Mesmo jogando seguro, o passe sai impreciso." } }
      ]
    }
  ],
  LD: [
    {
      situacao: "Você recebe na lateral do campo com espaço para avançar.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Encarar o lateral adversário no drible", atributos: ["drible", "agilidade"], sucesso: { notaDelta: 0.7, texto: "Você passa pelo marcador e chega para cruzar." }, falha: { notaDelta: -0.9, texto: "Você perde a bola no drible e o time fica exposto no contra-ataque." } },
        { risco: "medio", cor: "amarela", texto: "Cruzar na primeira oportunidade", atributos: ["passe", "visaoJogo"], sucesso: { notaDelta: 0.5, texto: "Cruzamento preciso, quase vira gol." }, falha: { notaDelta: -0.4, texto: "O cruzamento sai errado e a defesa afasta." } },
        { risco: "baixo", cor: "verde", texto: "Tocar para trás e manter a posse", atributos: ["passe", "controleBola"], sucesso: { notaDelta: 0.2, texto: "Jogada segura, a equipe mantém a posse." }, falha: { notaDelta: -0.2, texto: "Mesmo jogando seguro, o passe sai impreciso." } }
      ]
    }
  ],

  VOL: [
    {
      situacao: "O adversário tenta progredir pelo meio e a bola passa perto de você.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Interceptar a linha de passe", atributos: ["desarme", "visaoJogo"], sucesso: { notaDelta: 0.8, texto: "Interceptação perfeita, você já sai jogando." }, falha: { notaDelta: -1.0, texto: "Você erra o corte e o adversário avança livre." } },
        { risco: "medio", cor: "amarela", texto: "Fechar o espaço e pressionar o portador", atributos: ["desarme", "resistencia"], sucesso: { notaDelta: 0.4, texto: "Sob pressão, o adversário erra o passe seguinte." }, falha: { notaDelta: -0.5, texto: "O adversário escapa da pressão e progride." } },
        { risco: "baixo", cor: "verde", texto: "Recuar e proteger a linha defensiva", atributos: ["posicionamento", "foco"], sucesso: { notaDelta: 0.2, texto: "Bem posicionado, você neutraliza a jogada." }, falha: { notaDelta: -0.3, texto: "Recuar demais permite o passe entre linhas." } }
      ]
    }
  ],
  MC: [
    {
      situacao: "Você recebe a bola no meio-campo com dois adversários se aproximando.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Virar de primeira e lançar em profundidade", atributos: ["visaoJogo", "passe"], sucesso: { notaDelta: 0.9, texto: "Lançamento perfeito, o ataque fica na cara do gol!" }, falha: { notaDelta: -1.0, texto: "O passe sai errado e a posse é perdida em área perigosa." } },
        { risco: "medio", cor: "amarela", texto: "Girar protegendo a bola e tocar curto", atributos: ["controleBola", "forca"], sucesso: { notaDelta: 0.5, texto: "Você escapa da pressão e mantém a posse." }, falha: { notaDelta: -0.4, texto: "A pressão adversária rouba a bola." } },
        { risco: "baixo", cor: "verde", texto: "Devolver a bola para o zagueiro", atributos: ["passe"], sucesso: { notaDelta: 0.2, texto: "Jogada simples e segura." }, falha: { notaDelta: -0.2, texto: "Até um passe simples sai impreciso." } }
      ]
    }
  ],
  MEI: [
    {
      situacao: "Você recebe entre as linhas, de costas para o gol adversário.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Virar no drible e ir para cima da marcação", atributos: ["drible", "agilidade"], sucesso: { notaDelta: 0.9, texto: "Você vira e fica cara a cara com o goleiro!" }, falha: { notaDelta: -1.0, texto: "A marcação rouba a bola no seu domínio." } },
        { risco: "medio", cor: "amarela", texto: "Tocar de primeira para o companheiro infiltrando", atributos: ["visaoJogo", "passe"], sucesso: { notaDelta: 0.6, texto: "Passe milimétrico, seu companheiro fica na cara do gol!" }, falha: { notaDelta: -0.4, texto: "O passe é interceptado pela defesa." } },
        { risco: "baixo", cor: "verde", texto: "Devolver a bola e recomeçar a jogada", atributos: ["controleBola"], sucesso: { notaDelta: 0.2, texto: "Você mantém a posse com simplicidade." }, falha: { notaDelta: -0.2, texto: "Sob pressão, até o toque simples falha." } }
      ]
    }
  ],
  MD: [
    {
      situacao: "Você recebe pelo lado direito, com o lateral adversário adiantado.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Partir em velocidade para o fundo", atributos: ["velocidade", "drible"], sucesso: { notaDelta: 0.7, texto: "Você deixa o marcador para trás e chega na linha de fundo." }, falha: { notaDelta: -0.8, texto: "Você perde o equilíbrio e a bola sai pela linha." } },
        { risco: "medio", cor: "amarela", texto: "Cortar para dentro e tentar o passe", atributos: ["visaoJogo", "passe"], sucesso: { notaDelta: 0.5, texto: "Passe preciso encontra o companheiro na área." }, falha: { notaDelta: -0.4, texto: "A defesa intercepta o passe." } },
        { risco: "baixo", cor: "verde", texto: "Tocar para o lateral e reposicionar", atributos: ["passe"], sucesso: { notaDelta: 0.2, texto: "Jogada segura, o time reorganiza o ataque." }, falha: { notaDelta: -0.2, texto: "O toque sai impreciso e a posse muda." } }
      ]
    }
  ],
  ME: [
    {
      situacao: "Você recebe pelo lado esquerdo, com o lateral adversário adiantado.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Partir em velocidade para o fundo", atributos: ["velocidade", "drible"], sucesso: { notaDelta: 0.7, texto: "Você deixa o marcador para trás e chega na linha de fundo." }, falha: { notaDelta: -0.8, texto: "Você perde o equilíbrio e a bola sai pela linha." } },
        { risco: "medio", cor: "amarela", texto: "Cortar para dentro e tentar o passe", atributos: ["visaoJogo", "passe"], sucesso: { notaDelta: 0.5, texto: "Passe preciso encontra o companheiro na área." }, falha: { notaDelta: -0.4, texto: "A defesa intercepta o passe." } },
        { risco: "baixo", cor: "verde", texto: "Tocar para o lateral e reposicionar", atributos: ["passe"], sucesso: { notaDelta: 0.2, texto: "Jogada segura, o time reorganiza o ataque." }, falha: { notaDelta: -0.2, texto: "O toque sai impreciso e a posse muda." } }
      ]
    }
  ],

  CA: [
    {
      situacao: "Bola em profundidade: você fica cara a cara com o goleiro, um zagueiro se aproxima por trás.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Tentar driblar o goleiro", atributos: ["drible", "frieza"], sucesso: { notaDelta: 1.2, texto: "Você tabela com o próprio corpo e marca um golaço!" }, falha: { notaDelta: -1.3, texto: "O goleiro antecipa o drible e afasta o perigo." } },
        { risco: "medio", cor: "amarela", texto: "Finalizar cruzado, no canto", atributos: ["finalizacao", "frieza"], sucesso: { notaDelta: 0.8, texto: "Bola no ângulo, sem chances para o goleiro. Gol!" }, falha: { notaDelta: -0.6, texto: "A bola sai à esquerda do gol, perto." } },
        { risco: "baixo", cor: "verde", texto: "Proteger a bola e tocar para um companheiro", atributos: ["controleBola", "visaoJogo"], sucesso: { notaDelta: 0.4, texto: "Assistência! Seu companheiro só empurra para o gol." }, falha: { notaDelta: -0.3, texto: "O passe é cortado pelo zagueiro que retornava." } }
      ]
    },
    {
      situacao: "Cruzamento na área: a bola vem alta, você disputa com o zagueiro.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Antecipar e cabecear forte para o gol", atributos: ["impulsao", "finalizacao"], sucesso: { notaDelta: 1.0, texto: "Cabeceio no ângulo. Golaço de cabeça!" }, falha: { notaDelta: -1.0, texto: "Você chega atrasado e a bola passa direto." } },
        { risco: "medio", cor: "amarela", texto: "Ajeitar de cabeça para trás", atributos: ["impulsao", "visaoJogo"], sucesso: { notaDelta: 0.6, texto: "Você ajeita e um companheiro completa para o gol." }, falha: { notaDelta: -0.4, texto: "A ajeitada fica fraca e o zagueiro afasta." } },
        { risco: "baixo", cor: "verde", texto: "Brigar pela sobra dentro da área", atributos: ["forca", "posicionamento"], sucesso: { notaDelta: 0.3, texto: "Você fica com a sobra e cria nova chance." }, falha: { notaDelta: -0.2, texto: "O zagueiro leva a melhor na disputa." } }
      ]
    }
  ],
  SA: [
    {
      situacao: "Você recebe de costas para o gol, na entrada da área, com um zagueiro colado.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Girar rápido e finalizar de primeira", atributos: ["agilidade", "finalizacao"], sucesso: { notaDelta: 1.1, texto: "Giro e finalização no ângulo. Gol espetacular!" }, falha: { notaDelta: -1.1, texto: "Você perde o equilíbrio no giro e a bola sobra fácil." } },
        { risco: "medio", cor: "amarela", texto: "Tabelar com o companheiro mais próximo", atributos: ["passe", "visaoJogo"], sucesso: { notaDelta: 0.6, texto: "A tabela funciona e você recebe na área livre." }, falha: { notaDelta: -0.4, texto: "A tabela é lida pela defesa adversária." } },
        { risco: "baixo", cor: "verde", texto: "Recuar a bola para reorganizar o ataque", atributos: ["controleBola"], sucesso: { notaDelta: 0.2, texto: "Jogada segura, o time recomeça a jogada." }, falha: { notaDelta: -0.2, texto: "Mesmo recuando, você perde a bola sob pressão." } }
      ]
    }
  ],
  PD: [
    {
      situacao: "Você recebe aberto, com espaço para o um contra um contra o lateral.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Encarar no drible e ir para a linha de fundo", atributos: ["drible", "velocidade"], sucesso: { notaDelta: 0.9, texto: "Você passa pelo marcador com facilidade e cruza na medida!" }, falha: { notaDelta: -0.9, texto: "O lateral rouba a bola no seu domínio." } },
        { risco: "medio", cor: "amarela", texto: "Cortar para dentro e finalizar de canhota/direita", atributos: ["finalizacao", "frieza"], sucesso: { notaDelta: 0.7, texto: "Finalização no ângulo. Gol!" }, falha: { notaDelta: -0.5, texto: "A finalização sai fraca, fácil para o goleiro." } },
        { risco: "baixo", cor: "verde", texto: "Cruzar na primeira", atributos: ["passe"], sucesso: { notaDelta: 0.3, texto: "Cruzamento na área cria perigo." }, falha: { notaDelta: -0.2, texto: "O cruzamento sai direto para o goleiro." } }
      ]
    }
  ],
  PE: [
    {
      situacao: "Você recebe aberto, com espaço para o um contra um contra o lateral.",
      opcoes: [
        { risco: "alto", cor: "vermelha", texto: "Encarar no drible e ir para a linha de fundo", atributos: ["drible", "velocidade"], sucesso: { notaDelta: 0.9, texto: "Você passa pelo marcador com facilidade e cruza na medida!" }, falha: { notaDelta: -0.9, texto: "O lateral rouba a bola no seu domínio." } },
        { risco: "medio", cor: "amarela", texto: "Cortar para dentro e finalizar de canhota/direita", atributos: ["finalizacao", "frieza"], sucesso: { notaDelta: 0.7, texto: "Finalização no ângulo. Gol!" }, falha: { notaDelta: -0.5, texto: "A finalização sai fraca, fácil para o goleiro." } },
        { risco: "baixo", cor: "verde", texto: "Cruzar na primeira", atributos: ["passe"], sucesso: { notaDelta: 0.3, texto: "Cruzamento na área cria perigo." }, falha: { notaDelta: -0.2, texto: "O cruzamento sai direto para o goleiro." } }
      ]
    }
  ]
};

const MODIFICADOR_RISCO = {
  alto: -0.20,
  medio: 0.0,
  baixo: 0.20
};

/**
 * Sorteia `quantidade` eventos para a posição do jogador (sem repetir template quando possível).
 */
export function gerarEventos(posicaoCodigo, quantidade) {
  const banco = BANCO_EVENTOS[posicaoCodigo] || [];
  if (banco.length === 0 || quantidade <= 0) return [];

  const disponiveis = [...banco];
  const selecionados = [];
  for (let i = 0; i < quantidade; i++) {
    if (disponiveis.length === 0) disponiveis.push(...banco); // recicla se pedir mais do que existe
    const idx = Math.floor(Math.random() * disponiveis.length);
    selecionados.push(disponiveis.splice(idx, 1)[0]);
  }
  return selecionados;
}

/**
 * Resolve a opção escolhida pelo jogador: calcula probabilidade de sucesso a
 * partir da média dos atributos envolvidos, aplica o modificador de risco e
 * sorteia o resultado.
 */
export function resolverOpcao(atributosJogador, opcao) {
  const media = opcao.atributos.reduce((s, a) => s + (atributosJogador[a] || 50), 0) / opcao.atributos.length;
  let probabilidade = (media / 100) + MODIFICADOR_RISCO[opcao.risco];
  probabilidade = Math.max(0.10, Math.min(0.95, probabilidade));

  const sucesso = Math.random() < probabilidade;
  const resultado = sucesso ? opcao.sucesso : opcao.falha;

  return { sucesso, probabilidade, notaDelta: resultado.notaDelta, texto: resultado.texto };
}
