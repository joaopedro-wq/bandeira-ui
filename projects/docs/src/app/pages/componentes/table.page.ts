import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  BdBadgeComponent,
  BdPageEvent,
  BdPaginationComponent,
  BdSortState,
  BdTableColumn,
  BdTableComponent,
} from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

interface Contrato {
  id: number;
  cliente: string;
  responsavel: string;
  valor: number;
  status: string;
  assinatura: string | null;
}

const CLIENTES = [
  'Prefeitura de Sobral',
  'Grupo Andrade',
  'Cooperativa Vale',
  'Instituto Aurora',
  'Transportes Itabira',
];
const RESPONSAVEIS = ['Marina Alves', 'Rafael Lima', 'Juliana Reis', 'Caio Moura'];
const STATUS = ['Assinado', 'Em análise', 'Rascunho'];

/** Gera o conjunto de demonstração. Determinístico: a página não muda a cada render. */
function gerar(total: number): Contrato[] {
  return Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    cliente: CLIENTES[i % CLIENTES.length],
    responsavel: RESPONSAVEIS[i % RESPONSAVEIS.length],
    valor: ((i * 7919) % 480) * 250 + 1200,
    status: STATUS[i % STATUS.length],
    assinatura: i % 5 === 0 ? null : `2026-0${(i % 9) + 1}-1${i % 9}`,
  }));
}

@Component({
  selector: 'docs-table-page',
  standalone: true,
  imports: [
    BdTableComponent,
    BdPaginationComponent,
    BdBadgeComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Table"
      selector="<bd-table>"
      description="Ordenação, seleção, colunas fixas, linhas expansíveis e totais — com dez mil
        registros custando o mesmo que trinta. A tabela que o seu sistema administrativo precisa,
        sem a montagem que ela normalmente exige."
    />

    <docs-demo
      title="Ordenação, seleção e paginação"
      description="Clique nos cabeçalhos para percorrer crescente, decrescente e sem ordenação. A
        ordenação respeita o português: acentuação e maiúsculas não separam registros que o
        usuário lê como iguais, e campos em branco nunca aparecem primeiro."
      [code]="codigoBasico"
      column
    >
      <div class="palco">
        <bd-table
          [columns]="colunas"
          [rows]="paginaAtual()"
          [trackBy]="porId"
          [(sort)]="ordenacao"
          [(selection)]="selecionados"
          selectable
          [totalCount]="dados.length"
        />

        <div class="rodape">
          @if (selecionados().length) {
            <bd-badge tone="primary">{{ selecionados().length }} selecionados</bd-badge>
          }

          <bd-pagination
            [total]="dados.length"
            [(page)]="pagina"
            [(pageSize)]="tamanho"
            [pageSizeOptions]="[10, 25, 50]"
            (paginate)="onPaginate($event)"
          />
        </div>
      </div>
    </docs-demo>

    <docs-demo
      title="Dez mil linhas, sem travar"
      description="Role à vontade: por baixo, só as linhas visíveis existem de fato. É o que
        permite entregar um relatório inteiro na tela sem paginar, e sem punir quem abriu.
        Chegando perto do fim, a próxima página é pedida antes de o usuário perceber."
      [code]="codigoVirtual"
      column
    >
      <div class="palco">
        <bd-table
          [columns]="colunasCompactas"
          [rows]="massa"
          [trackBy]="porId"
          virtual
          [viewportHeight]="360"
          [rowHeight]="44"
          density="compact"
          (loadMore)="onLoadMore()"
        />
        <p class="nota">
          Linhas no DOM: <strong>~{{ linhasNoDom }}</strong> de
          <strong>{{ massa.length.toLocaleString('pt-BR') }}</strong
          >. Eventos de carregamento disparados: <strong>{{ carregamentos() }}</strong
          >.
        </p>
      </div>
    </docs-demo>

    <docs-demo
      title="Colunas fixas"
      description="Role para o lado: o cliente continua visível à esquerda e o valor à direita.
        Ninguém mais perde a referência de qual linha está lendo no meio de uma tabela larga. Fixe
        só o que identifica a linha — congelar metade da tabela recria o problema que a fixação
        deveria resolver. (Colunas fixas precisam de largura em pixels.)"
      [code]="codigoFixas"
      column
    >
      <div class="palco">
        <bd-table [columns]="colunasLargas" [rows]="amostra" [trackBy]="porId" striped />
      </div>
    </docs-demo>

    <docs-demo
      title="Detalhe na própria linha"
      description="O que não cabe nas colunas abre logo abaixo da linha, sem tirar o usuário da
        lista nem abrir um modal. E a linha de totais soma o que está na tela — o número que a
        gerência pede sem você calcular por fora."
      [code]="codigoExpansivel"
      column
    >
      <div class="palco">
        <bd-table
          [columns]="colunasComTotais"
          [rows]="amostra"
          [trackBy]="porId"
          [(expanded)]="expandidas"
          expandable
        >
          <ng-template #bdTableRowDetail let-row>
            <div class="detalhe">
              <div>
                <span class="detalhe__rotulo">Responsável</span>
                <strong>{{ row.responsavel }}</strong>
              </div>
              <div>
                <span class="detalhe__rotulo">Assinatura</span>
                <strong>{{ row.assinatura ?? 'pendente' }}</strong>
              </div>
              <div>
                <span class="detalhe__rotulo">Status</span>
                <strong>{{ row.status }}</strong>
              </div>
            </div>
          </ng-template>
        </bd-table>
      </div>
    </docs-demo>

    <docs-demo
      title="Carregando e vazio"
      description="Os dois estados que ninguém lembra de fazer, e que definem a impressão de
        qualidade do sistema. Vêm no componente: a espera é anunciada a leitores de tela, e o
        vazio aceita conteúdo próprio quando uma frase não basta."
      [code]="codigoEstados"
      column
    >
      <div class="palco palco--duplo">
        <bd-table [columns]="colunasCompactas" [rows]="[]" loading [placeholderCount]="4" />
        <bd-table [columns]="colunasCompactas" [rows]="[]" />
      </div>
    </docs-demo>

    <section class="perf">
      <h2>Por que ela não trava</h2>
      <p>
        Tabela lenta é a reclamação número um de sistema administrativo. As decisões abaixo são o
        que mantém a sua utilizável quando o cliente dobra o volume de dados.
      </p>

      <div class="perf__grid">
        @for (item of performance; track item.titulo) {
          <article class="perf__card">
            <h3>{{ item.titulo }}</h3>
            <p>{{ item.texto }}</p>
          </article>
        }
      </div>

      <h3 class="perf__subtitle">Qual configuração usar</h3>
      <div class="perf__table">
        <table>
          <thead>
            <tr>
              <th scope="col">Volume</th>
              <th scope="col">Configuração</th>
              <th scope="col">Por quê</th>
            </tr>
          </thead>
          <tbody>
            @for (linha of guia; track linha.volume) {
              <tr>
                <td>
                  <code>{{ linha.volume }}</code>
                </td>
                <td>{{ linha.config }}</td>
                <td>{{ linha.motivo }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Saídas" [rows]="saidas" />

    <docs-api title="BdTableColumn" [rows]="colunasApi" />

    <docs-api title="bd-pagination" [rows]="paginacaoApi" />
  `,
  styles: `
    :host {
      display: block;
    }

    .palco {
      width: 100%;
      padding: 1.5rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .palco--duplo {
      display: grid;
      gap: 1.25rem;
    }

    .rodape {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1.25rem;
    }

    .rodape bd-pagination {
      flex: 1;
      min-width: 260px;
    }

    .nota {
      margin-top: 1rem;
      color: var(--bd-fg-subtle);
      font-size: 0.85rem;
    }

    .nota strong {
      color: var(--bd-fg);
      font-variant-numeric: tabular-nums;
    }

    .detalhe {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 1rem;
    }

    .detalhe__rotulo {
      display: block;
      margin-bottom: 0.15rem;
      color: var(--bd-fg-subtle);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .detalhe strong {
      color: var(--bd-fg);
      font-size: 0.92rem;
    }

    /* ------------------------------------------------------- performance */

    .perf {
      margin: 3rem 0 2.5rem;
      padding: 1.75rem;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
    }

    .perf h2 {
      margin-bottom: 0.6rem;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }

    .perf > p {
      max-width: 70ch;
      color: var(--bd-fg-muted);
      font-size: 0.94rem;
      line-height: 1.7;
    }

    .perf__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .perf__card {
      padding: 1.1rem 1.2rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .perf__card h3 {
      margin-bottom: 0.45rem;
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--bd-fg);
    }

    .perf__card p {
      color: var(--bd-fg-muted);
      font-size: 0.85rem;
      line-height: 1.65;
    }

    .perf__subtitle {
      margin: 2rem 0 0.9rem;
      font-size: 1rem;
      font-weight: 700;
      color: var(--bd-fg);
    }

    .perf__table {
      overflow-x: auto;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .perf__table table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.87rem;
    }

    .perf__table th,
    .perf__table td {
      padding: 0.7rem 0.9rem;
      text-align: left;
      vertical-align: top;
    }

    .perf__table th {
      background: var(--bd-bg-elevated);
      color: var(--bd-fg-subtle);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .perf__table tbody tr + tr td {
      border-top: 1px solid var(--bd-border);
    }

    .perf__table td {
      color: var(--bd-fg-muted);
    }

    .perf__table code {
      color: var(--bd-primary);
      font-family: var(--bd-font-mono);
      font-size: 0.82rem;
      white-space: nowrap;
    }
  `,
})
export class TablePageComponent {
  readonly dados = gerar(240);
  readonly massa = gerar(10000);

  readonly amostra = this.dados.slice(0, 6);

  readonly ordenacao = signal<BdSortState | null>(null);
  readonly expandidas = signal<readonly Contrato[]>([]);
  readonly selecionados = signal<readonly Contrato[]>([]);
  readonly pagina = signal(0);
  readonly tamanho = signal(10);
  readonly carregamentos = signal(0);

  readonly linhasNoDom = Math.ceil(360 / 44) + 4;

  /**
   * Identidade estável das linhas. Sem isso, cada troca de página destruiria e
   * recriaria o corpo inteiro da tabela em vez de reaproveitar os nós.
   */
  readonly porId = (_: number, row: Contrato) => row.id;

  readonly paginaAtual = computed(() => {
    const inicio = this.pagina() * this.tamanho();
    return this.dados.slice(inicio, inicio + this.tamanho());
  });

  readonly colunas: BdTableColumn<Contrato>[] = [
    { key: 'id', header: '#', width: '64px', align: 'end', sortable: true },
    { key: 'cliente', header: 'Cliente', sortable: true, width: 'minmax(180px, 2fr)' },
    { key: 'responsavel', header: 'Responsável', secondary: true },
    {
      key: 'valor',
      header: 'Valor',
      sortable: true,
      align: 'end',
      width: '140px',
      value: (row) => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      sortValue: (row) => row.valor,
    },
    { key: 'status', header: 'Status', width: '130px', sortable: true },
    { key: 'assinatura', header: 'Assinatura', width: '130px', sortable: true, secondary: true },
  ];

  /** Larga o bastante para exigir rolagem horizontal e justificar a fixação. */
  readonly colunasLargas: BdTableColumn<Contrato>[] = [
    { key: 'id', header: '#', width: '70px', align: 'end', frozen: 'start' },
    { key: 'cliente', header: 'Cliente', width: '220px', frozen: 'start' },
    { key: 'responsavel', header: 'Responsável', width: '190px' },
    { key: 'status', header: 'Status', width: '160px' },
    {
      key: 'assinatura',
      header: 'Assinatura',
      width: '170px',
      value: (row) => row.assinatura ?? '—',
    },
    {
      key: 'valor',
      header: 'Valor',
      width: '150px',
      align: 'end',
      frozen: 'end',
      value: (row) => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  ];

  readonly colunasComTotais: BdTableColumn<Contrato>[] = [
    { key: 'id', header: '#', width: '64px', align: 'end' },
    {
      key: 'cliente',
      header: 'Cliente',
      width: 'minmax(180px, 2fr)',
      footer: (rows) => `${rows.length} contratos`,
    },
    { key: 'status', header: 'Status', width: '140px' },
    {
      key: 'valor',
      header: 'Valor',
      width: '150px',
      align: 'end',
      value: (row) => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      footer: (rows) =>
        rows
          .reduce((soma, row) => soma + row.valor, 0)
          .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  ];

  readonly colunasCompactas: BdTableColumn<Contrato>[] = [
    { key: 'id', header: '#', width: '72px', align: 'end' },
    { key: 'cliente', header: 'Cliente', width: 'minmax(180px, 2fr)' },
    { key: 'responsavel', header: 'Responsável', secondary: true },
    {
      key: 'valor',
      header: 'Valor',
      align: 'end',
      width: '140px',
      value: (row) => row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    },
  ];

  onPaginate(event: BdPageEvent): void {
    // Numa aplicação real, é aqui que a próxima página seria buscada.
    this.selecionados.set([]);
    void event;
  }

  onLoadMore(): void {
    this.carregamentos.update((n) => n + 1);
  }

  readonly performance = [
    {
      titulo: 'O resto da tela não paga a conta',
      texto:
        'Ordenar ou trocar de página não dispara verificação na aplicação inteira. Com OnPush e signals, só o que depende do dado alterado é reavaliado.',
    },
    {
      titulo: 'As linhas são reaproveitadas',
      texto:
        'A entrada trackBy diz ao Angular quem é cada linha. Sem ela, toda atualização joga fora o corpo da tabela e o reconstrói do zero — o que o usuário sente como travamento.',
    },
    {
      titulo: 'Ordenar não é refazer tudo',
      texto:
        'A reordenação só acontece quando os dados ou o critério mudam. Rolar, passar o mouse ou digitar em outro campo da tela não custam nada à tabela.',
    },
    {
      titulo: 'Dez mil linhas, custo de trinta',
      texto:
        'No modo virtual, a quantidade de linhas realmente desenhadas depende da altura da janela, não do tamanho do relatório.',
    },
    {
      titulo: 'A próxima página chega antes',
      texto:
        'O pedido de mais dados dispara com uma tela de antecedência. O usuário rola e o conteúdo já está lá — sem aquele solavanco no fim da lista.',
    },
    {
      titulo: 'Seus dados saem intactos',
      texto:
        'A ordenação trabalha sobre uma cópia. O array que você passou nunca é reordenado por baixo dos panos.',
    },
  ];

  readonly guia = [
    {
      volume: 'até ~200',
      config: 'Padrão, ordenação no navegador',
      motivo:
        'Tudo cabe sem custo perceptível, e ordenar no cliente é instantâneo — sem ida ao servidor.',
    },
    {
      volume: '~200 a ~2.000',
      config: 'virtual com viewportHeight',
      motivo:
        'Os dados ainda cabem na memória, mas desenhar tudo já pesa. É aqui que a virtualização vale mais.',
    },
    {
      volume: 'acima de ~2.000',
      config: 'sortMode="server" com paginação ou (loadMore)',
      motivo:
        'Ordenar e filtrar passam ao servidor, que faz isso melhor. A tabela só apresenta o resultado.',
    },
  ];

  readonly codigoBasico = `<bd-table
  [columns]="colunas"
  [rows]="paginaAtual()"
  [trackBy]="porId"
  [(sort)]="ordenacao"
  [(selection)]="selecionados"
  selectable
/>

<bd-pagination
  [total]="dados.length"
  [(page)]="pagina"
  [(pageSize)]="tamanho"
  [pageSizeOptions]="[10, 25, 50]"
  (paginate)="carregar($event)"
/>`;

  readonly codigoVirtual = `<bd-table
  [columns]="colunas"
  [rows]="linhas()"
  [trackBy]="porId"
  virtual
  [viewportHeight]="360"
  [rowHeight]="44"
  density="compact"
  (loadMore)="carregarMais()"
/>`;

  readonly codigoFixas = `readonly colunas: BdTableColumn<Contrato>[] = [
  // Colunas fixas exigem width em pixels.
  { key: 'id', header: '#', width: '70px', align: 'end', frozen: 'start' },
  { key: 'cliente', header: 'Cliente', width: '220px', frozen: 'start' },
  { key: 'responsavel', header: 'Responsável', width: '190px' },
  { key: 'valor', header: 'Valor', width: '150px', align: 'end', frozen: 'end' },
];`;

  readonly codigoExpansivel = `<bd-table
  [columns]="colunas"
  [rows]="contratos()"
  [trackBy]="porId"
  [(expanded)]="expandidas"
  expandable
>
  <ng-template #bdTableRowDetail let-row>
    <p>Responsável: {{ '{{' }} row.responsavel {{ '}}' }}</p>
  </ng-template>
</bd-table>

<!-- Totais: a coluna recebe as linhas visíveis -->
{ key: 'valor', header: 'Valor', align: 'end',
  footer: (rows) => rows.reduce((s, r) => s + r.valor, 0) }`;

  readonly codigoEstados = `<bd-table [columns]="colunas" [rows]="linhas()" [loading]="carregando()" />

<!-- Estado vazio com conteúdo próprio -->
<bd-table [columns]="colunas" [rows]="[]">
  <ng-template #bdTableEmpty>
    <bd-empty-state title="Nenhum contrato" description="Crie o primeiro." />
  </ng-template>
</bd-table>`;

  readonly rows: DocsApiRow[] = [
    {
      name: 'columns',
      type: 'BdTableColumn<T>[]',
      description: 'Definição das colunas. Obrigatório.',
    },
    { name: 'rows', type: 'T[]', default: '[]', description: 'Linhas a exibir.' },
    {
      name: 'trackBy',
      type: '(index, row) => unknown',
      default: 'índice',
      description:
        'Identidade das linhas. Forneça uma chave real sempre que os dados mudarem de ordem.',
    },
    {
      name: 'sort',
      type: 'model<BdSortState | null>',
      default: 'null',
      description: 'Two-way com o critério de ordenação. null significa ordem original.',
    },
    {
      name: 'sortMode',
      type: "'client' | 'server'",
      default: "'client'",
      description: 'client reordena as linhas; server apenas emite o critério.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Exibe placeholders e marca a região com aria-busy.',
    },
    {
      name: 'selectable',
      type: 'boolean',
      default: 'false',
      description: 'Acrescenta a coluna de seleção.',
    },
    {
      name: 'selection',
      type: 'model<T[]>',
      default: '[]',
      description: 'Two-way com as linhas selecionadas.',
    },
    {
      name: 'virtual',
      type: 'boolean',
      default: 'false',
      description: 'Renderiza apenas as linhas visíveis. Exige altura de linha uniforme.',
    },
    {
      name: 'rowHeight / viewportHeight',
      type: 'number',
      default: '48 / 420',
      description: 'Altura da linha e da janela de rolagem, em pixels. Usadas no modo virtual.',
    },
    {
      name: 'density',
      type: "'default' | 'compact'",
      default: "'default'",
      description: 'Reduz o espaçamento interno das células.',
    },
    {
      name: 'striped',
      type: 'boolean',
      default: 'false',
      description: 'Alterna o fundo das linhas, ajudando a percorrer tabelas largas.',
    },
    {
      name: 'wrap',
      type: 'boolean',
      default: 'false',
      description:
        'Permite quebra de linha nas células. A altura passa a depender do conteúdo — exclusivo com virtual.',
    },
    {
      name: 'expandable',
      type: 'boolean',
      default: 'false',
      description:
        'Habilita a linha de detalhe. Como a altura deixa de ser uniforme, não combina com virtual.',
    },
    {
      name: 'expanded',
      type: 'model<T[]>',
      default: '[]',
      description: 'Two-way com as linhas expandidas.',
    },
    {
      name: 'totalCount',
      type: 'number | null',
      default: 'null',
      description:
        'Total no servidor, quando maior que o conjunto exibido. Alimenta aria-rowcount.',
    },
  ];

  readonly saidas: DocsApiRow[] = [
    { name: '(rowClick)', type: 'output<T>', description: 'Linha clicada.' },
    {
      name: '(sortChange)',
      type: 'output<BdSortState | null>',
      description: 'Novo critério de ordenação.',
    },
    {
      name: '(loadMore)',
      type: 'output<void>',
      description: 'No modo virtual, quando a rolagem se aproxima do fim da lista.',
    },
    {
      name: '(expandedChangeRows)',
      type: 'output<T[]>',
      description: 'Conjunto expandido após abrir ou fechar uma linha.',
    },
    {
      name: '#bdTableEmpty',
      type: 'ng-template',
      description: 'Conteúdo do estado vazio, quando um texto não basta.',
    },
    {
      name: '#bdTableRowDetail',
      type: 'ng-template',
      description: 'Conteúdo da linha de detalhe. Recebe a linha como contexto implícito.',
    },
  ];

  readonly colunasApi: DocsApiRow[] = [
    { name: 'key', type: 'string', description: 'Identidade da coluna e acessor padrão.' },
    { name: 'header', type: 'string', description: 'Texto do cabeçalho.' },
    { name: 'sortable', type: 'boolean', description: 'Habilita a ordenação por esta coluna.' },
    { name: 'align', type: "'start' | 'center' | 'end'", description: 'Alinhamento do conteúdo.' },
    {
      name: 'width',
      type: 'string',
      description: "Trilha da grade — '160px', '2fr', 'minmax(120px, 1fr)'.",
    },
    {
      name: 'value',
      type: '(row) => string | number',
      description: 'Extrai e formata o valor exibido. A formatação não deve viver no template.',
    },
    {
      name: 'sortValue',
      type: '(row) => string | number | Date',
      description: 'Valor usado na ordenação — para ordenar por data exibindo texto, por exemplo.',
    },
    {
      name: 'secondary',
      type: 'boolean',
      description: 'Oculta a coluna abaixo de 720px. Reserve para o que é acessório.',
    },
    {
      name: 'frozen',
      type: "'start' | 'end'",
      description:
        'Fixa a coluna na borda durante a rolagem horizontal. Exige width em pixels; avisa em desenvolvimento se faltar.',
    },
    {
      name: 'footer',
      type: '(rows) => string | number',
      description:
        'Conteúdo desta coluna na linha de totais, calculado sobre as linhas visíveis. Basta uma coluna definir para a linha existir.',
    },
  ];

  readonly paginacaoApi: DocsApiRow[] = [
    { name: 'total', type: 'number', description: 'Total de registros. Obrigatório.' },
    { name: 'page', type: 'model<number>', default: '0', description: 'Página, começando em 0.' },
    {
      name: 'pageSize',
      type: 'model<number>',
      default: '20',
      description: 'Registros por página.',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      default: '[20]',
      description: 'Opções do seletor. Com uma única opção, o seletor não aparece.',
    },
    {
      name: 'siblings',
      type: 'number',
      default: '1',
      description: 'Páginas exibidas de cada lado da corrente antes das reticências.',
    },
    {
      name: '(paginate)',
      type: 'output<BdPageEvent>',
      description:
        'Navegação, com página e tamanho resolvidos. Não se chama pageChange para não colidir com o output do model.',
    },
  ];
}
