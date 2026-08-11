# Changelog

Todas as mudanças relevantes desta biblioteca são registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [0.2.0] — 2026-08-11

Primeira versão com suíte de testes, integração contínua e a seção de
**Templates**: estruturas de tela inteiras prontas para receber dados.

### Adicionado

- **`<bd-table>`.** Tabela de dados com ordenação (no cliente ou no servidor),
  seleção, estados de carregamento e vazio, colunas acessórias que recuam no
  celular, virtualização e carregamento sob demanda via `(loadMore)`. A
  ordenação usa `localeCompare` com sensibilidade de base — acentuação e caixa
  não separam registros que o usuário lê como iguais — e mantém os vazios no
  fim nas duas direções.

  Sobre essa base: **colunas fixas** (`frozen: 'start' | 'end'`) com
  deslocamento acumulado e borda de separação; **linhas expansíveis**
  (`expandable` + `#bdTableRowDetail`), renderizadas como linha irmã para não
  desalinhar as colunas das demais; **linha de totais** por coluna
  (`footer`), calculada sobre o conjunto visível; e os ajustes de leitura
  `striped`, `wrap` e `density`.
- **`<bd-pagination>`.** Paginação com sequência condensada por reticências,
  seletor de tamanho de página e `aria-current="page"`.
- **`<bd-steps>`.** Indicador de progresso em cinco apresentações (`panel`,
  `line`, `numbered`, `dots`, `progress`), horizontal ou vertical. O
  `<bd-wizard-template>` passa a delegar seu indicador a ele, e expõe a escolha
  em `stepsVariant`.
- **Templates de tela.** `<bd-dashboard-template>` (painel analítico),
  `<bd-list-template>` (listagem com os estados carregando/vazio/preenchido
  resolvidos), `<bd-settings-template>` (preferências com barra de gravação
  condicional) e `<bd-wizard-template>` (assistente por etapas com avanço
  governado por validação).
- **`BdScrollLockService`.** Trava de rolagem por contagem de referências, que
  preserva e restaura o `overflow` definido pela aplicação hospedeira e
  compensa a largura da barra de rolagem.
- **`BdOverlayStackService`.** Pilha de camadas sobrepostas, para que atalhos
  globais atinjam apenas a camada do topo.
- **`BdTourService.startOnce()`, `hasSeen()` e `reset()`.** Apresentação única
  por chave versionada, com registro em `localStorage` e degradação silenciosa
  quando o armazenamento não está disponível.
- **`<bd-metric>` com variação.** Entradas `trend`, `delta`, `align` e
  `trendLabels`. A direção é comunicada por seta, cor e texto anunciado — nunca
  apenas por cor.
- **Suíte de testes.** 90 casos cobrindo serviços, navegação por teclado,
  ordenação e seleção da tabela, sequência de paginação,
  `ControlValueAccessor`, estados dos templates e coordenação entre diálogos.
- **Integração contínua.** Verificação de formatação, testes, empacotamento e
  publicação automática da documentação no GitHub Pages.
- **Identidade visual.** Marca própria em SVG inline — uma flâmula em mastro,
  leitura direta do nome —, aplicada ao site e ao ícone da aba.

### Corrigido

- **Tour: o foco era devolvido ao balão a cada evento de rolagem.** Como o
  próprio passo executa rolagem suave, dezenas de eventos disparavam outras
  tantas chamadas de foco, tornando a página impossível de percorrer durante o
  tour. Medição e foco agora são operações distintas, e a remedição é limitada
  ao ritmo do compositor.
- **Tour: `Enter` em qualquer ponto do documento avançava o passo** e cancelava
  a ação original — um `Enter` destinado a um formulário submetia o tour, não o
  formulário. Setas e `Enter` passam a exigir foco dentro do balão.
- **Tour: a altura do balão era estimada em 220px fixos**, o que fazia passos
  com texto longo escolherem o lado errado e vazarem da área visível. A altura
  real passa a ser medida.
- **Tour: seletor CSS malformado derrubava a aplicação.** O passo agora degrada
  para a apresentação centralizada, com aviso em desenvolvimento.
- **Modal: a trava de rolagem não era contada.** Com dois diálogos empilhados, o
  primeiro a fechar liberava a rolagem dos dois; ao fechar, o `overflow` da
  aplicação hospedeira era descartado em vez de restaurado.
- **Modal: `Esc` fechava todos os diálogos abertos simultaneamente.** Passa a
  encerrar apenas o do topo da pilha.
- **Modal: o efeito de abertura executava com o diálogo fechado**, tocando no
  documento sem necessidade. Um diálogo destruído aberto agora libera a trava.
- **Tooltip: o balão não acompanhava o alvo** durante rolagem e
  redimensionamento.
- **Tooltip e reveal dependiam silenciosamente da folha global.** Sem o import
  de `bandeira-ui/styles`, o balão aparecia como texto solto no canto da página.
  As regras essenciais passam a ser garantidas em tempo de execução, inseridas
  no topo do `<head>` para permanecerem sobrescrevíveis.
- **Checkbox: o atributo `for` apontava para um `<button>`**, que não é um
  elemento rotulável. O clique no rótulo passa a ser encaminhado explicitamente.
- **O alvo de testes da biblioteca não declarava os polyfills do Zone.js** —
  nenhum teste conseguia ser executado.

### Alterado — mudanças incompatíveis

A API pública do tour foi alinhada ao restante da biblioteca, que já era toda em
inglês. A renomeação é mecânica:

| Antes                  | Agora                    |
| ---------------------- | ------------------------ |
| `tour.ativo()`         | `tour.active()`          |
| `tour.primeiro()`      | `tour.isFirst()`         |
| `tour.ultimo()`        | `tour.isLast()`          |
| `tour.fim()`           | `tour.outcome()`         |
| `{ concluido }`        | `{ completed, step }`    |

`outcome()` passa a informar também o índice do passo em que o tour foi
encerrado, o que permite medir onde os usuários abandonam a integração.

## [0.1.0] — 2026-08-10

Versão inicial: 27 componentes e diretivas, tokens de tema em CSS custom
properties, tema escuro sem configuração e site de documentação.
