# Carreira — Build de Teste

Protótipo jogável de um jogo de carreira de futebol, implementado em HTML/CSS/JS puro
(sem frameworks, sem build step), seguindo os documentos de design do projeto.

## Como rodar

O jogo usa **ES Modules** e `fetch()` para carregar os dados de `data/*.json`.
Por restrição de segurança dos navegadores, isso **não funciona abrindo o
`index.html` direto com duplo-clique** (protocolo `file://`). É preciso servir
a pasta por um servidor local simples. Exemplos:

```bash
# Opção 1 — Python (já vem instalado na maioria dos sistemas)
cd game
python3 -m http.server 8000
# depois abra http://localhost:8000

# Opção 2 — Node (se tiver o pacote 'serve' instalado)
npx serve .
```

Nenhuma dependência externa é necessária além disso — é só HTML/CSS/JS.

## Fluxo do jogo

Segue exatamente `fluxo_da_build`:

1. **Criação de personagem** (`criacao.html`) → nome, nacionalidade, nascimento, pé
   dominante e posição (13 opções). Ao final, os 18 atributos e o Overall inicial
   são gerados automaticamente, respeitando a tendência da posição escolhida.
2. **Seleção de liga e clube** (`selecao.html`) → escolhe entre as 5 ligas iniciais
   e um clube dentro dela. Um elenco fictício de ~19 jogadores é gerado para o
   clube e o personagem é inserido nele.
3. **Gameplay** (`dashboard.html` / `partida.html`) → ciclo diário: verificação de
   eventos do dia, decisão de treino, e nos dias de partida a simulação
   interativa via Sistema de Eventos.

O save fica em `localStorage` do navegador (chave `carreira_save_v1`). Para
recomeçar do zero, apague o localStorage do site ou rode no console:
`localStorage.removeItem('carreira_save_v1')`.

## Arquitetura (modular e escalável)

```
data/            → conteúdo editável (JSON), sem tocar em código
  ligas.json        5 ligas iniciais, cada uma lista os ids dos seus clubes
  clubes.json       clubes com nome, país, overallBase, cor (placeholder de escudo)
  posicoes.json     13 posições + mapeamento para os 4 "papéis" de Overall

js/core/         → estado e persistência, sem regra de negócio dos sistemas
  storage.js        camada única de save/load (troque aqui se quiser outro storage)
  gameState.js      orquestra criação de carreira, avanço de dia, carregamento de dados

js/engine/       → um arquivo por sistema documentado, isolado e testável
  atributos.js      18 atributos + geração inicial por posição
  overall.js        pesos por papel (Atacante/Meio-campista/Defensor/Goleiro)
  valorBase.js       escala não-linear de valor de mercado por Overall
  forma.js           média das últimas 5 notas
  moral.js            faixas 0-100 e ajustes graduais
  lesoes.js           risco base/final, proteção física, gravidade
  ritmo.js            nível de ritmo → quantidade de eventos na partida
  escalacao.js        índice de escalação, titulares/reservas
  eventos.js           banco de eventos por posição (3 opções de risco cada)
  notaPartida.js       nota inicial 6.0 e aplicação de deltas
  potencial.js          janela de 12 meses, 4 fatores ponderados
  squadGen.js            gera elencos fictícios para os clubes
  calendario.js          calendário de temporada (liga em pontos corridos)
  simulacaoPartida.js    orquestra o placar e conecta os sistemas pós-jogo/pós-treino

js/pages/        → um arquivo por tela, só lida com DOM + chama engine/core
  criacao.js, selecao.js, dashboard.js, partida.js

*.html           → uma tela cada, todas usando css/style.css compartilhado
```

### Por que essa separação

Cada sistema documentado (`sistema_*.txt`) virou exatamente um módulo em
`js/engine/`, com as fórmulas do documento comentadas no código. Isso significa
que para ajustar uma fórmula (por exemplo, os pesos do Índice de Escalação),
você mexe em um único arquivo pequeno e isolado, sem tocar em UI ou em outros
sistemas.

### Simplificações desta build de teste (documentadas no código)

Essas decisões foram tomadas para ter algo jogável rapidamente, mas a
arquitetura já prevê como expandir cada uma sem redesenhar o projeto:

- **Calendário**: só a liga nacional é simulada (pontos corridos, returno
  duplo). `calendario.js` já guarda um campo `competicao` em cada partida —
  copas nacionais e torneios continentais podem ser adicionados gerando novas
  partidas com outro valor nesse campo e mesclando ao calendário do clube.
- **Elenco adversário**: só é gerado o elenco completo do clube do jogador. Os
  adversários entram na simulação de placar apenas pelo `overallBase` do
  clube (`clubes.json`). Para simular adversários "de verdade", basta chamar
  `gerarElenco()` para eles também e usar a média de Overall dos titulares.
- **Papel de Overall por posição**: o documento `sistema_overral.txt` define
  pesos para 4 papéis, mas o jogo tem 13 posições. O mapeamento
  posição→papel está isolado em `data/posicoes.json` (`papelOverall`),
  editável sem tocar em código.
- **Escudos dos clubes**: em vez de imagens reais, usamos um bloco colorido
  (`corPrimaria` em `clubes.json`) como placeholder. Para usar brasões de
  verdade, adicione um campo `escudoUrl` no JSON e troque o
  `.escudo-placeholder` pelas tags `<img>` correspondentes — nenhuma outra
  mudança é necessária.
- **Fórmula do Ritmo de Jogo**: `sistema_ritmo.txt` define os efeitos do
  ritmo, mas não como ele é calculado. A fórmula usada (condição física +
  foco + forma + variação aleatória) fica isolada em `ritmo.js` para ser
  recalibrada facilmente.
- **Um único jogador simulado em detalhe**: NPCs do elenco têm Overall,
  Moral e Forma, e disputam a escalação normalmente, mas não passam pelo
  Sistema de Eventos — isso é reservado ao personagem do jogador, como
  descrito em `sistema_eventos.txt`.

### Extensões sugeridas (próximos passos naturais)

- Copas nacionais e continentais no calendário (ver campo `competicao`).
- Convocação para seleção nacional (`calendario.txt` já prevê essa camada).
- Mercado de transferências (usar `valorBase.js` como ponto de partida do
  valor de mercado completo).
- Tela de elenco/escalação visível para o jogador, usando
  `montarEscalacao()` diretamente.
- Mais eventos por posição em `BANCO_EVENTOS` (é só adicionar objetos no
  array — o sistema já sorteia e resolve qualquer evento novo automaticamente).
