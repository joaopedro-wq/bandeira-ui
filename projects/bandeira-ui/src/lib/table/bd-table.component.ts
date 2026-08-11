import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  contentChild,
  input,
  model,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { BdSkeletonComponent } from '../feedback/bd-skeleton.component';

export type BdTableAlign = 'start' | 'center' | 'end';
export type BdSortDirection = 'asc' | 'desc';
export type BdTableFrozen = 'start' | 'end';

export interface BdTableColumn<T = Record<string, unknown>> {
  /** Chave da coluna. Serve de identidade e, por padrão, de acessor. */
  key: string;
  header: string;
  /** Habilita a ordenação por esta coluna. */
  sortable?: boolean;
  align?: BdTableAlign;
  /** Largura da trilha na grade — ex.: `'160px'`, `'2fr'`, `'minmax(120px, 1fr)'`. */
  width?: string;
  /**
   * Extrai o valor exibido. Sem acessor, a célula usa `row[key]`.
   * Use também para formatar — a formatação não deve viver no template.
   */
  value?: (row: T) => string | number | null | undefined;
  /**
   * Valor usado na ordenação no cliente. Sem ele, `value` é usado; sem ambos,
   * `row[key]`. Útil para ordenar por data enquanto se exibe texto.
   */
  sortValue?: (row: T) => string | number | Date | null | undefined;
  /** Oculta a coluna abaixo de 720px. Reserve para o que é acessório. */
  secondary?: boolean;
  /**
   * Fixa a coluna na borda durante a rolagem horizontal.
   *
   * Exige `width` em pixels: o deslocamento de cada coluna fixa é a soma das
   * larguras das anteriores, e uma trilha flexível não tem largura conhecida
   * antes do layout. Fixe apenas o que identifica a linha — congelar metade da
   * tabela devolve ao usuário o problema que a fixação deveria resolver.
   */
  frozen?: BdTableFrozen;
  /**
   * Conteúdo desta coluna na linha de totais. Receber as linhas permite somar,
   * contar ou calcular médias sem duplicar o conjunto de dados fora da tabela.
   * A linha de totais só é renderizada se ao menos uma coluna a definir.
   */
  footer?: (rows: readonly T[]) => string | number | null | undefined;
}

export interface BdSortState {
  key: string;
  direction: BdSortDirection;
}

/** Largura das colunas de controle (seleção e expansão). */
const CONTROL_WIDTH = 44;

/**
 * Tabela de dados.
 *
 * ## Semântica
 *
 * A estrutura usa papéis ARIA (`table`, `rowgroup`, `row`, `columnheader`,
 * `cell`) sobre uma grade CSS, e não os elementos `<table>` nativos. A escolha
 * é deliberada: uma tabela nativa não pode ter suas linhas virtualizadas sem
 * quebrar o modelo de layout, e a virtualização é o que torna viável exibir
 * dezenas de milhares de linhas. Os papéis entregam ao leitor de tela a mesma
 * informação que a tabela nativa entregaria.
 *
 * ## Custo de renderização
 *
 * - Detecção de mudanças `OnPush` e estado em signals: uma alteração de página
 *   ou de ordenação não propaga verificação para o resto da aplicação.
 * - `track` obrigatório via {@link trackBy} — sem identidade estável, cada
 *   atualização destrói e recria todas as linhas do DOM.
 * - Ordenação no cliente derivada em `computed`: reordena apenas quando as
 *   linhas ou o critério mudam, nunca a cada ciclo de detecção.
 * - Com `virtual`, apenas as linhas visíveis existem no DOM. O custo de
 *   renderização passa a ser função da altura da janela, não do tamanho do
 *   conjunto de dados.
 *
 * ## Volume de dados
 *
 * | Linhas          | Configuração recomendada                          |
 * | --------------- | ------------------------------------------------- |
 * | até ~200        | padrão, ordenação no cliente                      |
 * | ~200 a ~2.000   | `virtual` com `viewportHeight`                    |
 * | acima disso     | `sortMode="server"` com paginação ou `(loadMore)`  |
 *
 * ## Combinações incompatíveis
 *
 * `virtual` pressupõe altura de linha uniforme, e por isso não se combina com
 * `expandable` nem com `wrap` — ambos tornam a altura dependente do conteúdo.
 * Para conjuntos grandes que também precisam de detalhe, pagine em vez de
 * virtualizar.
 *
 * @example
 * ```html
 * <bd-table
 *   [columns]="colunas"
 *   [rows]="projetos()"
 *   [trackBy]="rastrear"
 *   [(sort)]="ordenacao"
 *   [loading]="carregando()"
 *   (rowClick)="abrir($event)"
 * />
 * ```
 */
@Component({
  selector: 'bd-table',
  standalone: true,
  imports: [ScrollingModule, NgTemplateOutlet, BdSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bd-table"
      role="table"
      [attr.aria-label]="label()"
      [attr.aria-rowcount]="totalCount() ?? visibleRows().length"
      [attr.aria-busy]="loading()"
      [class.bd-table--compact]="density() === 'compact'"
      [class.bd-table--striped]="striped()"
      [class.bd-table--wrap]="wrap()"
      [style.--bd-table-columns]="gridTemplate()"
    >
      <div class="bd-table__head" role="rowgroup">
        <div class="bd-table__row bd-table__row--head" role="row">
          @if (expandable()) {
            <span
              class="bd-table__cell bd-table__cell--control"
              role="columnheader"
              [class.is-frozen]="hasFrozenStart()"
              [style.left.px]="expandOffset()"
            >
              <span class="bd-table__sr">{{ expandColumnLabel() }}</span>
            </span>
          }

          @if (selectable()) {
            <span
              class="bd-table__cell bd-table__cell--control"
              role="columnheader"
              [class.is-frozen]="hasFrozenStart()"
              [style.left.px]="selectOffset()"
            >
              <input
                type="checkbox"
                [attr.aria-label]="selectAllLabel()"
                [checked]="allSelected()"
                [indeterminate]="someSelected()"
                (change)="toggleAll()"
              />
            </span>
          }

          @for (column of columns(); track column.key) {
            <span
              class="bd-table__cell bd-table__cell--head"
              role="columnheader"
              [class]="'bd-table__cell--' + (column.align ?? 'start')"
              [class.bd-table__cell--secondary]="column.secondary"
              [class.is-frozen]="!!column.frozen"
              [class.is-frozen-edge]="isFrozenEdge(column)"
              [style.left.px]="frozenStartOffset(column)"
              [style.right.px]="frozenEndOffset(column)"
              [attr.aria-sort]="ariaSortFor(column)"
            >
              @if (column.sortable) {
                <button type="button" class="bd-table__sort" (click)="toggleSort(column)">
                  {{ column.header }}
                  <span class="bd-table__sort-glyph" aria-hidden="true">
                    {{ sortGlyphFor(column) }}
                  </span>
                </button>
              } @else {
                {{ column.header }}
              }
            </span>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="bd-table__body" role="rowgroup">
          @for (placeholder of placeholderRows(); track placeholder) {
            <div class="bd-table__row" role="row">
              <span class="bd-table__cell" [style.grid-column]="'1 / -1'" role="cell">
                <bd-skeleton variant="text" width="100%" />
              </span>
            </div>
          }
        </div>
        <span class="bd-table__sr" role="status">{{ loadingLabel() }}</span>
      } @else if (!visibleRows().length) {
        <div class="bd-table__empty" role="row">
          <span role="cell">
            @if (emptyTemplate()) {
              <ng-container [ngTemplateOutlet]="emptyTemplate()!" />
            } @else {
              {{ emptyLabel() }}
            }
          </span>
        </div>
      } @else if (virtual()) {
        <!-- Somente as linhas visíveis existem no DOM. -->
        <cdk-virtual-scroll-viewport
          class="bd-table__viewport"
          role="rowgroup"
          [itemSize]="rowHeight()"
          [style.height.px]="viewportHeight()"
          (scrolledIndexChange)="onScrolledIndexChange($event)"
        >
          <div
            *cdkVirtualFor="let row of visibleRows(); trackBy: trackBy(); let index = index"
            class="bd-table__row"
            role="row"
            [class.is-selected]="isSelected(row)"
            [style.height.px]="rowHeight()"
            (click)="onRowClick(row)"
          >
            <ng-container
              [ngTemplateOutlet]="cells"
              [ngTemplateOutletContext]="{ $implicit: row }"
            />
          </div>
        </cdk-virtual-scroll-viewport>
      } @else {
        <div class="bd-table__body" role="rowgroup">
          @for (row of visibleRows(); track trackBy()($index, row)) {
            <div
              class="bd-table__row"
              role="row"
              [class.is-selected]="isSelected(row)"
              [class.is-expanded]="isExpanded(row)"
              (click)="onRowClick(row)"
            >
              <ng-container
                [ngTemplateOutlet]="cells"
                [ngTemplateOutletContext]="{ $implicit: row }"
              />
            </div>

            @if (expandable() && isExpanded(row)) {
              <!-- O detalhe é uma linha própria que ocupa toda a largura da
                   grade: ampliar a linha original quebraria o alinhamento das
                   colunas em todas as demais. -->
              <div class="bd-table__detail" role="row">
                <span class="bd-table__detail-cell" role="cell">
                  @if (detailTemplate()) {
                    <ng-container
                      [ngTemplateOutlet]="detailTemplate()!"
                      [ngTemplateOutletContext]="{ $implicit: row }"
                    />
                  }
                </span>
              </div>
            }
          }
        </div>
      }

      @if (hasFooter() && !loading() && visibleRows().length) {
        <div class="bd-table__foot" role="rowgroup">
          <div class="bd-table__row bd-table__row--foot" role="row">
            @if (expandable()) {
              <span class="bd-table__cell bd-table__cell--control" role="cell"></span>
            }
            @if (selectable()) {
              <span class="bd-table__cell bd-table__cell--control" role="cell"></span>
            }

            @for (column of columns(); track column.key) {
              <span
                class="bd-table__cell"
                role="cell"
                [class]="'bd-table__cell--' + (column.align ?? 'start')"
                [class.bd-table__cell--secondary]="column.secondary"
                [class.is-frozen]="!!column.frozen"
                [class.is-frozen-edge]="isFrozenEdge(column)"
                [style.left.px]="frozenStartOffset(column)"
                [style.right.px]="frozenEndOffset(column)"
              >
                {{ footerValue(column) }}
              </span>
            }
          </div>
        </div>
      }
    </div>

    <!-- Corpo da linha, compartilhado entre o modo virtual e o comum. -->
    <ng-template #cells let-row>
      @if (expandable()) {
        <span
          class="bd-table__cell bd-table__cell--control"
          role="cell"
          [class.is-frozen]="hasFrozenStart()"
          [style.left.px]="expandOffset()"
        >
          <button
            type="button"
            class="bd-table__expand"
            [class.is-open]="isExpanded(row)"
            [attr.aria-expanded]="isExpanded(row)"
            [attr.aria-label]="isExpanded(row) ? collapseLabel() : expandLabel()"
            (click)="$event.stopPropagation(); toggleExpanded(row)"
          >
            <span aria-hidden="true">›</span>
          </button>
        </span>
      }

      @if (selectable()) {
        <span
          class="bd-table__cell bd-table__cell--control"
          role="cell"
          [class.is-frozen]="hasFrozenStart()"
          [style.left.px]="selectOffset()"
        >
          <input
            type="checkbox"
            [attr.aria-label]="selectRowLabel()"
            [checked]="isSelected(row)"
            (click)="$event.stopPropagation()"
            (change)="toggleRow(row)"
          />
        </span>
      }

      @for (column of columns(); track column.key) {
        <span
          class="bd-table__cell"
          role="cell"
          [class]="'bd-table__cell--' + (column.align ?? 'start')"
          [class.bd-table__cell--secondary]="column.secondary"
          [class.is-frozen]="!!column.frozen"
          [class.is-frozen-edge]="isFrozenEdge(column)"
          [style.left.px]="frozenStartOffset(column)"
          [style.right.px]="frozenEndOffset(column)"
        >
          {{ display(column, row) }}
        </span>
      }
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
      --bd-table-row-h: 48px;
    }

    .bd-table {
      overflow-x: auto;
      background: var(--bd-surface, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius, 0.875rem);
      color: var(--bd-fg, #10131c);
      font-size: 0.9rem;
    }

    .bd-table__row {
      display: grid;
      grid-template-columns: var(--bd-table-columns);
      align-items: center;
      min-width: 100%;
    }

    .bd-table__row:not(.bd-table__row--head) {
      border-top: 1px solid var(--bd-border, #e3e7f0);
      transition: background var(--bd-duration-fast, 0.15s) ease;
    }

    .bd-table__row--head {
      position: sticky;
      top: 0;
      /* Acima das células fixas do corpo: no cruzamento entre coluna fixa e
         cabeçalho fixo, quem vence é o cabeçalho. */
      z-index: 3;
      background: var(--bd-bg-elevated, #f8fafc);
    }

    .bd-table__row--foot {
      position: sticky;
      bottom: 0;
      z-index: 3;
      background: var(--bd-bg-elevated, #f8fafc);
      border-top: 1px solid var(--bd-border-strong, #cbd2e2);
      color: var(--bd-fg, #10131c);
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-table__row:not(.bd-table__row--head):hover {
      background: var(--bd-surface-hover, #f1f3f9);
    }

    .bd-table__row.is-selected {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
    }

    .bd-table__row.is-expanded {
      background: var(--bd-bg-elevated, #f8fafc);
    }

    /* Zebra pelo índice da linha na grade: nth-child continua correto porque
       as linhas de detalhe entram como irmãs, e não dentro da linha. */
    .bd-table--striped .bd-table__body > .bd-table__row:nth-child(odd) {
      background: color-mix(in srgb, var(--bd-bg-elevated, #f8fafc) 55%, transparent);
    }

    .bd-table__cell {
      display: flex;
      align-items: center;
      min-width: 0;
      padding: 0.75rem 0.9rem;
      color: var(--bd-fg-muted, #545c70);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Texto em várias linhas: a altura passa a ser definida pelo conteúdo, o
       que é incompatível com a virtualização — daí as duas serem exclusivas. */
    .bd-table--wrap .bd-table__cell {
      align-items: flex-start;
      overflow: visible;
      white-space: normal;
      line-height: 1.5;
    }

    .bd-table--compact .bd-table__cell {
      padding: 0.45rem 0.75rem;
    }

    .bd-table__cell--head {
      color: var(--bd-fg-subtle, #7b8399);
      font-size: 0.76rem;
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .bd-table__cell--center {
      justify-content: center;
      text-align: center;
    }

    .bd-table__cell--end {
      justify-content: flex-end;
      /* Números alinhados à direita com dígitos de largura fixa: as ordens de
         grandeza ficam comparáveis coluna abaixo. */
      font-variant-numeric: tabular-nums;
      text-align: right;
    }

    .bd-table__cell--control {
      justify-content: center;
      padding-inline: 0.6rem;
    }

    /* --------------------------------------------------- colunas fixas --- */

    /* A célula fixa precisa de fundo próprio: o fundo da linha rola junto com
       ela e deixaria o conteúdo passar por baixo. */
    .bd-table__cell.is-frozen {
      position: sticky;
      z-index: 2;
      background: inherit;
    }

    .bd-table__row:not(.bd-table__row--head):not(.bd-table__row--foot) .bd-table__cell.is-frozen {
      background: var(--bd-surface, #fff);
    }

    .bd-table__row:hover .bd-table__cell.is-frozen {
      background: var(--bd-surface-hover, #f1f3f9);
    }

    .bd-table__row.is-selected .bd-table__cell.is-frozen {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
    }

    .bd-table__row--head .bd-table__cell.is-frozen,
    .bd-table__row--foot .bd-table__cell.is-frozen {
      background: var(--bd-bg-elevated, #f8fafc);
    }

    /* A borda marca onde termina a área fixa e começa a que rola. */
    .bd-table__cell.is-frozen-edge {
      box-shadow: inset -1px 0 0 var(--bd-border, #e3e7f0);
    }

    .bd-table__cell.is-frozen-edge.bd-table__cell--end {
      box-shadow: inset 1px 0 0 var(--bd-border, #e3e7f0);
    }

    /* ------------------------------------------------ linha expansível --- */

    .bd-table__expand {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      background: transparent;
      border: none;
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg-subtle, #7b8399);
      font-size: 1.15rem;
      line-height: 1;
      cursor: pointer;
      transition:
        transform var(--bd-duration-fast, 0.15s) ease,
        color var(--bd-duration-fast, 0.15s) ease;
    }

    .bd-table__expand:hover {
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-table__expand.is-open {
      transform: rotate(90deg);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-table__expand:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-table__detail {
      border-top: 1px solid var(--bd-border, #e3e7f0);
      background: var(--bd-bg-elevated, #f8fafc);
    }

    .bd-table__detail-cell {
      display: block;
      padding: var(--bd-space-4, 1rem) var(--bd-space-5, 1.5rem);
      color: var(--bd-fg-muted, #545c70);
    }

    .bd-table__sort {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0;
      background: none;
      border: none;
      color: inherit;
      font: inherit;
      letter-spacing: inherit;
      text-transform: inherit;
      cursor: pointer;
    }

    .bd-table__sort:hover {
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-table__sort:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
      border-radius: var(--bd-radius-sm, 0.5rem);
    }

    .bd-table__sort-glyph {
      font-size: 0.9em;
      opacity: 0.75;
    }

    .bd-table__empty {
      padding: var(--bd-space-7, 3rem) var(--bd-space-5, 1.5rem);
      border-top: 1px solid var(--bd-border, #e3e7f0);
      color: var(--bd-fg-subtle, #7b8399);
      text-align: center;
    }

    .bd-table__viewport {
      width: 100%;
    }

    .bd-table__sr {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Colunas acessórias saem primeiro quando o espaço aperta — rolar a tabela
       na horizontal no celular é pior que ver menos colunas. */
    @media (max-width: 720px) {
      .bd-table__cell--secondary {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-table__row {
        transition: none;
      }
    }
  `,
})
export class BdTableComponent<T extends object = Record<string, unknown>> {
  readonly columns = input.required<readonly BdTableColumn<T>[]>();
  readonly rows = input<readonly T[]>([]);

  /**
   * Identidade estável das linhas. O padrão usa o índice, o que é correto
   * apenas para listas imutáveis: com dados que mudam de ordem, forneça uma
   * chave real para evitar a recriação de todo o corpo da tabela.
   */
  readonly trackBy = input<(index: number, row: T) => unknown>((index) => index);

  /** Two-way com o critério de ordenação. `null` significa ordem original. */
  readonly sort = model<BdSortState | null>(null);

  /**
   * `client` reordena as linhas recebidas; `server` apenas emite
   * `(sortChange)` e mantém a ordem em que os dados chegaram.
   */
  readonly sortMode = input<'client' | 'server'>('client');

  readonly loading = input(false, { transform: booleanAttribute });
  readonly placeholderCount = input(6);

  /** Habilita a coluna de seleção. */
  readonly selectable = input(false, { transform: booleanAttribute });
  /** Two-way com o conjunto de linhas selecionadas. */
  readonly selection = model<readonly T[]>([]);

  /** Renderiza apenas as linhas visíveis. Exige altura de linha uniforme. */
  readonly virtual = input(false, { transform: booleanAttribute });
  readonly rowHeight = input(48);
  readonly viewportHeight = input(420);

  readonly density = input<'default' | 'compact'>('default');

  /** Alterna o fundo das linhas, ajudando a percorrer tabelas largas. */
  readonly striped = input(false, { transform: booleanAttribute });

  /**
   * Permite que as células quebrem em várias linhas. A altura passa a depender
   * do conteúdo, o que é incompatível com `virtual` — as duas são exclusivas.
   */
  readonly wrap = input(false, { transform: booleanAttribute });

  /**
   * Habilita a linha de detalhe, revelada pelo botão no início da linha.
   *
   * O detalhe é renderizado como uma linha irmã que ocupa toda a largura, e não
   * ampliando a linha original: alterar a altura de uma linha desalinharia as
   * colunas de todas as demais. Como a altura deixa de ser uniforme, a expansão
   * não é combinável com `virtual`.
   */
  readonly expandable = input(false, { transform: booleanAttribute });

  /** Two-way com as linhas expandidas. */
  readonly expanded = model<readonly T[]>([]);

  /** Total de registros no servidor, quando maior que o conjunto exibido. */
  readonly totalCount = input<number | null>(null);

  readonly label = input('Tabela de dados');
  readonly emptyLabel = input('Nenhum registro encontrado.');
  readonly loadingLabel = input('Carregando registros…');
  readonly selectAllLabel = input('Selecionar todas as linhas');
  readonly selectRowLabel = input('Selecionar linha');
  readonly expandColumnLabel = input('Detalhes');
  readonly expandLabel = input('Mostrar detalhes da linha');
  readonly collapseLabel = input('Ocultar detalhes da linha');

  /** Conteúdo do estado vazio, quando um texto não basta. */
  readonly emptyTemplate = contentChild<TemplateRef<unknown>>('bdTableEmpty');

  /** Conteúdo da linha de detalhe. Recebe a linha como contexto implícito. */
  readonly detailTemplate = contentChild<TemplateRef<{ $implicit: T }>>('bdTableRowDetail');

  readonly rowClick = output<T>();
  readonly sortChange = output<BdSortState | null>();
  /** Emitido ao abrir ou fechar uma linha, com o conjunto expandido resultante. */
  readonly expandedChangeRows = output<readonly T[]>();
  /**
   * Emitido no modo virtual quando a rolagem se aproxima do fim da lista.
   * Use para carregar a página seguinte sob demanda.
   */
  readonly loadMore = output<void>();

  /** Linhas efetivamente renderizadas, já ordenadas quando `sortMode` é `client`. */
  protected readonly visibleRows = computed<readonly T[]>(() => {
    const rows = this.rows();
    const sort = this.sort();

    if (this.sortMode() === 'server' || !sort) return rows;

    const column = this.columns().find((candidate) => candidate.key === sort.key);
    if (!column) return rows;

    const factor = sort.direction === 'asc' ? 1 : -1;

    // Cópia antes de ordenar: `sort` altera o array no lugar, e a entrada
    // pertence a quem a forneceu.
    return [...rows].sort((a, b) => {
      const left = this.sortKey(column, a);
      const right = this.sortKey(column, b);

      // Vazios ficam no fim nas duas direções: uma coluna com lacunas ordenada
      // de forma decrescente não deve começar por elas. Por isso a decisão é
      // tomada antes de aplicar o fator de direção.
      const emptiness = compareEmptiness(left, right);
      if (emptiness !== null) return emptiness;

      return factor * compare(left, right);
    });
  });

  protected readonly placeholderRows = computed(() =>
    Array.from({ length: Math.max(1, this.placeholderCount()) }, (_, index) => index),
  );

  protected readonly gridTemplate = computed(() => {
    const tracks = this.columns().map((column) => column.width ?? 'minmax(120px, 1fr)');

    if (this.selectable()) tracks.unshift(`${CONTROL_WIDTH}px`);
    if (this.expandable()) tracks.unshift(`${CONTROL_WIDTH}px`);

    return tracks.join(' ');
  });

  /* -------------------------------------------------------- colunas fixas */

  protected readonly hasFrozenStart = computed(() =>
    this.columns().some((column) => column.frozen === 'start'),
  );

  protected readonly expandOffset = computed(() => 0);

  protected readonly selectOffset = computed(() => (this.expandable() ? CONTROL_WIDTH : 0));

  /** Largura ocupada pelas colunas de controle, que precedem as demais. */
  private readonly controlsWidth = computed(
    () => (this.expandable() ? CONTROL_WIDTH : 0) + (this.selectable() ? CONTROL_WIDTH : 0),
  );

  /**
   * Deslocamento acumulado de cada coluna fixa, por chave.
   *
   * Colunas fixas ao início acumulam da esquerda; ao fim, da direita. O cálculo
   * exige largura em pixels — uma trilha flexível não tem largura conhecida
   * antes do layout, e um deslocamento errado empilharia as colunas umas sobre
   * as outras.
   */
  private readonly frozenOffsets = computed(() => {
    const offsets = new Map<string, number>();
    const columns = this.columns();

    let left = this.controlsWidth();
    for (const column of columns) {
      if (column.frozen !== 'start') continue;
      offsets.set(column.key, left);
      left += pixelWidth(column);
    }

    let right = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const column = columns[i];
      if (column.frozen !== 'end') continue;
      offsets.set(column.key, right);
      right += pixelWidth(column);
    }

    return offsets;
  });

  /** Última coluna fixa de cada lado: é nela que a borda de separação vai. */
  private readonly frozenEdges = computed(() => {
    const columns = this.columns();
    const start = columns.filter((column) => column.frozen === 'start').at(-1);
    const end = columns.filter((column) => column.frozen === 'end').at(0);

    return { start: start?.key, end: end?.key };
  });

  protected readonly allSelected = computed(() => {
    const rows = this.visibleRows();
    return rows.length > 0 && this.selection().length === rows.length;
  });

  protected readonly someSelected = computed(() => {
    const count = this.selection().length;
    return count > 0 && count < this.visibleRows().length;
  });

  protected readonly hasFooter = computed(() => this.columns().some((column) => !!column.footer));

  protected frozenStartOffset(column: BdTableColumn<T>): number | null {
    return column.frozen === 'start' ? (this.frozenOffsets().get(column.key) ?? 0) : null;
  }

  protected frozenEndOffset(column: BdTableColumn<T>): number | null {
    return column.frozen === 'end' ? (this.frozenOffsets().get(column.key) ?? 0) : null;
  }

  protected isFrozenEdge(column: BdTableColumn<T>): boolean {
    const edges = this.frozenEdges();
    return column.key === edges.start || column.key === edges.end;
  }

  protected footerValue(column: BdTableColumn<T>): string {
    const raw = column.footer?.(this.visibleRows());
    return raw === null || raw === undefined ? '' : String(raw);
  }

  protected isExpanded(row: T): boolean {
    return this.expanded().includes(row);
  }

  protected toggleExpanded(row: T): void {
    const expanded = this.expanded();
    const next = expanded.includes(row)
      ? expanded.filter((candidate) => candidate !== row)
      : [...expanded, row];

    this.expanded.set(next);
    this.expandedChangeRows.emit(next);
  }

  protected display(column: BdTableColumn<T>, row: T): string {
    const raw = column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];

    return raw === null || raw === undefined ? '' : String(raw);
  }

  protected ariaSortFor(column: BdTableColumn<T>): string | null {
    if (!column.sortable) return null;

    const sort = this.sort();
    if (sort?.key !== column.key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected sortGlyphFor(column: BdTableColumn<T>): string {
    const sort = this.sort();
    if (sort?.key !== column.key) return '↕';
    return sort.direction === 'asc' ? '↑' : '↓';
  }

  /** Alterna entre ascendente, descendente e sem ordenação. */
  protected toggleSort(column: BdTableColumn<T>): void {
    if (!column.sortable) return;

    const current = this.sort();
    let next: BdSortState | null;

    if (current?.key !== column.key) {
      next = { key: column.key, direction: 'asc' };
    } else if (current.direction === 'asc') {
      next = { key: column.key, direction: 'desc' };
    } else {
      next = null;
    }

    this.sort.set(next);
    this.sortChange.emit(next);
  }

  protected isSelected(row: T): boolean {
    return this.selection().includes(row);
  }

  protected toggleRow(row: T): void {
    const selection = this.selection();
    this.selection.set(
      selection.includes(row)
        ? selection.filter((candidate) => candidate !== row)
        : [...selection, row],
    );
  }

  protected toggleAll(): void {
    this.selection.set(this.allSelected() ? [] : [...this.visibleRows()]);
  }

  protected onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  protected onScrolledIndexChange(index: number): void {
    const total = this.visibleRows().length;
    const perScreen = Math.ceil(this.viewportHeight() / this.rowHeight());

    // Antecipa em uma tela: os dados chegam antes de o usuário ver o fim.
    if (total > 0 && index + perScreen * 2 >= total) {
      this.loadMore.emit();
    }
  }

  private sortKey(column: BdTableColumn<T>, row: T): unknown {
    if (column.sortValue) return column.sortValue(row);
    if (column.value) return column.value(row);
    return (row as Record<string, unknown>)[column.key];
  }
}

/**
 * Largura em pixels de uma coluna fixa.
 *
 * Sem largura declarada não há como calcular o deslocamento da coluna seguinte;
 * o aviso em desenvolvimento evita o sintoma confuso — colunas empilhadas umas
 * sobre as outras — e aponta a causa.
 */
function pixelWidth(column: BdTableColumn<never>): number {
  const parsed = column.width ? parseFloat(column.width) : NaN;

  if (!Number.isFinite(parsed) || !column.width?.trim().endsWith('px')) {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      console.warn(
        `[bandeira-ui] A coluna "${column.key}" está fixada com frozen mas não declara ` +
          'width em pixels. Sem largura conhecida, o deslocamento das colunas fixas ' +
          'seguintes não pode ser calculado.',
      );
    }
    return 0;
  }

  return parsed;
}

declare const ngDevMode: boolean | undefined;

/**
 * Resolve a ordem quando ao menos um dos valores é vazio.
 *
 * Devolve `null` quando ambos têm conteúdo e a comparação normal deve seguir.
 */
function compareEmptiness(a: unknown, b: unknown): number | null {
  const aEmpty = a === null || a === undefined || a === '';
  const bEmpty = b === null || b === undefined || b === '';

  if (!aEmpty && !bEmpty) return null;
  if (aEmpty && bEmpty) return 0;
  return aEmpty ? 1 : -1;
}

/** Comparação estável entre valores heterogêneos, ambos não vazios. */
function compare(a: unknown, b: unknown): number {
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;

  // `localeCompare` com sensibilidade de base: acentuação e caixa não separam
  // registros que o usuário lê como iguais.
  return String(a).localeCompare(String(b), 'pt-BR', { sensitivity: 'base', numeric: true });
}
