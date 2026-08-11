import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';

export interface BdPageEvent {
  /** Índice da página, começando em 0. */
  page: number;
  pageSize: number;
}

/** Reticências na sequência de páginas. */
const GAP = '…' as const;

/**
 * Paginação de listagens e tabelas.
 *
 * A sequência de páginas é condensada com reticências quando o total é grande:
 * exibir cem botões não ajuda ninguém a navegar. As extremidades e a vizinhança
 * da página corrente permanecem sempre acessíveis, que é o que se usa na
 * prática.
 *
 * O elemento é um `<nav>` com rótulo, e a página corrente é marcada com
 * `aria-current="page"` — a posição é anunciada, não apenas destacada.
 *
 * @example
 * ```html
 * <bd-pagination
 *   [total]="240"
 *   [(page)]="pagina"
 *   [(pageSize)]="tamanho"
 *   (paginate)="carregar($event)"
 * />
 * ```
 */
@Component({
  selector: 'bd-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="bd-pagination" [attr.aria-label]="label()">
      <p class="bd-pagination__summary">{{ summary() }}</p>

      <div class="bd-pagination__controls">
        @if (pageSizeOptions().length > 1) {
          <label class="bd-pagination__size">
            <span>{{ pageSizeLabel() }}</span>
            <select [value]="pageSize()" (change)="onPageSizeChange($event)">
              @for (option of pageSizeOptions(); track option) {
                <option [value]="option">{{ option }}</option>
              }
            </select>
          </label>
        }

        <button
          type="button"
          class="bd-pagination__btn"
          [disabled]="isFirst()"
          [attr.aria-label]="previousLabel()"
          (click)="goTo(page() - 1)"
        >
          ‹
        </button>

        @for (item of sequence(); track $index) {
          @if (item === gap) {
            <span class="bd-pagination__gap" aria-hidden="true">{{ gap }}</span>
          } @else {
            <button
              type="button"
              class="bd-pagination__btn bd-pagination__btn--page"
              [class.is-active]="item === page()"
              [attr.aria-current]="item === page() ? 'page' : null"
              [attr.aria-label]="pageLabel() + ' ' + (+item + 1)"
              (click)="goTo(+item)"
            >
              {{ +item + 1 }}
            </button>
          }
        }

        <button
          type="button"
          class="bd-pagination__btn"
          [disabled]="isLast()"
          [attr.aria-label]="nextLabel()"
          (click)="goTo(page() + 1)"
        >
          ›
        </button>
      </div>
    </nav>
  `,
  styles: `
    :host {
      display: block;
    }

    .bd-pagination {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-3, 0.75rem);
    }

    .bd-pagination__summary {
      margin: 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: var(--bd-text-sm, 0.875rem);
      font-variant-numeric: tabular-nums;
    }

    .bd-pagination__controls {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .bd-pagination__size {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-right: var(--bd-space-3, 0.75rem);
      color: var(--bd-fg-muted, #545c70);
      font-size: var(--bd-text-sm, 0.875rem);
    }

    .bd-pagination__size select {
      padding: 0.3rem 0.4rem;
      background: var(--bd-surface, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg, #10131c);
      font: inherit;
      cursor: pointer;
    }

    .bd-pagination__size select:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-pagination__btn {
      display: grid;
      place-items: center;
      /* 36px de lado: alvo de toque confortável sem dominar o rodapé. */
      min-width: 36px;
      height: 36px;
      padding-inline: 0.5rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg-muted, #545c70);
      font-family: inherit;
      font-size: 0.88rem;
      font-weight: var(--bd-weight-semibold, 600);
      font-variant-numeric: tabular-nums;
      cursor: pointer;
      transition:
        background var(--bd-duration, 0.25s) ease,
        color var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease;
    }

    .bd-pagination__btn:not(:disabled):hover {
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-pagination__btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .bd-pagination__btn.is-active {
      background: var(--bd-primary-strong, #2b46c9);
      border-color: transparent;
      color: var(--bd-primary-contrast, #fff);
    }

    .bd-pagination__btn:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-pagination__gap {
      padding-inline: 0.25rem;
      color: var(--bd-fg-subtle, #7b8399);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-pagination__btn {
        transition: none;
      }
    }

    @media (max-width: 640px) {
      .bd-pagination {
        justify-content: center;
      }

      /* No celular, só as pontas e a página corrente sobrevivem ao espaço. */
      .bd-pagination__btn--page:not(.is-active) {
        display: none;
      }

      .bd-pagination__gap {
        display: none;
      }
    }
  `,
})
export class BdPaginationComponent {
  /** Total de registros. */
  readonly total = input.required<number>();

  /** Two-way com o índice da página, começando em 0. */
  readonly page = model(0);
  readonly pageSize = model(20);

  readonly pageSizeOptions = input<readonly number[]>([20]);

  /** Quantidade de páginas exibidas de cada lado da corrente. */
  readonly siblings = input(1);

  readonly label = input('Paginação');
  readonly pageLabel = input('Página');
  readonly previousLabel = input('Página anterior');
  readonly nextLabel = input('Próxima página');
  readonly pageSizeLabel = input('Por página');

  /** Recebe (primeiro, último, total) — ex.: "21–40 de 240". */
  readonly summaryText = input<(from: number, to: number, total: number) => string>(
    (from, to, total) => `${from}–${to} de ${total}`,
  );

  /**
   * Emitido a cada navegação, com página e tamanho já resolvidos.
   *
   * Deliberadamente **não** se chama `pageChange`: esse nome pertence ao output
   * implícito do `model page`, e reutilizá-lo faria a sintaxe `[(page)]`
   * escrever este objeto na variável do consumidor.
   */
  readonly paginate = output<BdPageEvent>();

  protected readonly gap = GAP;

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.total() / Math.max(1, this.pageSize()))),
  );

  protected readonly isFirst = computed(() => this.page() <= 0);
  protected readonly isLast = computed(() => this.page() >= this.pageCount() - 1);

  protected readonly summary = computed(() => {
    const total = this.total();
    if (total === 0) return this.summaryText()(0, 0, 0);

    const from = this.page() * this.pageSize() + 1;
    const to = Math.min(total, from + this.pageSize() - 1);
    return this.summaryText()(from, to, total);
  });

  /**
   * Sequência condensada de páginas: primeira, vizinhança da corrente, última,
   * com reticências onde há salto.
   */
  protected readonly sequence = computed<(number | typeof GAP)[]>(() => {
    const count = this.pageCount();
    const current = this.page();
    const siblings = Math.max(0, this.siblings());

    // Até sete páginas cabem inteiras — condensar aqui só atrapalharia.
    if (count <= 7) return range(0, count - 1);

    const start = Math.max(1, current - siblings);
    const end = Math.min(count - 2, current + siblings);

    const items: (number | typeof GAP)[] = [0];
    if (start > 1) items.push(GAP);
    items.push(...range(start, end));
    if (end < count - 2) items.push(GAP);
    items.push(count - 1);

    return items;
  });

  protected goTo(page: number): void {
    const target = Math.min(Math.max(0, page), this.pageCount() - 1);
    if (target === this.page()) return;

    this.page.set(target);
    this.paginate.emit({ page: target, pageSize: this.pageSize() });
  }

  protected onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(size) || size <= 0) return;

    this.pageSize.set(size);

    // Ao mudar o tamanho, a página corrente pode deixar de existir; volta-se
    // ao início, que é o comportamento previsível.
    this.page.set(0);
    this.paginate.emit({ page: 0, pageSize: size });
  }
}

function range(from: number, to: number): number[] {
  return Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);
}
