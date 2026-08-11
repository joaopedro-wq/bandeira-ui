import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface BdAccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
}

/**
 * Lista de seções expansíveis.
 *
 * O cabeçalho de cada seção é um `<button>` dentro de um heading, com
 * `aria-expanded` e `aria-controls` ligados ao painel — a estrutura que
 * leitores de tela usam para navegar por seções.
 *
 * @example
 * ```html
 * <bd-accordion [items]="perguntas" [(opened)]="abertas" />
 * <bd-accordion [items]="perguntas" multiple />
 * ```
 */
@Component({
  selector: 'bd-accordion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.id) {
      <div class="bd-accordion__item" [class.is-open]="estaAberto(item.id)">
        <h3 class="bd-accordion__heading">
          <button
            type="button"
            class="bd-accordion__trigger"
            [id]="'bd-acc-trigger-' + item.id"
            [attr.aria-expanded]="estaAberto(item.id)"
            [attr.aria-controls]="'bd-acc-panel-' + item.id"
            [disabled]="item.disabled || null"
            (click)="alternar(item)"
          >
            <span class="bd-accordion__title">{{ item.title }}</span>
            <span class="bd-accordion__chevron" aria-hidden="true">⌄</span>
          </button>
        </h3>

        <div
          class="bd-accordion__panel"
          role="region"
          [id]="'bd-acc-panel-' + item.id"
          [attr.aria-labelledby]="'bd-acc-trigger-' + item.id"
          [hidden]="!estaAberto(item.id)"
        >
          <div class="bd-accordion__content">{{ item.content }}</div>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius, 0.875rem);
      overflow: hidden;
    }

    .bd-accordion__item + .bd-accordion__item {
      border-top: 1px solid var(--bd-border, #e3e7f0);
    }

    .bd-accordion__heading {
      margin: 0;
      font-size: inherit;
      font-weight: inherit;
    }

    .bd-accordion__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      padding: var(--bd-space-4, 1rem) var(--bd-space-5, 1.5rem);
      background: transparent;
      border: none;
      color: var(--bd-fg, #10131c);
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: var(--bd-weight-semibold, 600);
      text-align: left;
      cursor: pointer;
      transition: background var(--bd-duration-fast, 0.15s) ease;
    }

    .bd-accordion__trigger:hover:not(:disabled) {
      background: var(--bd-surface-hover, #f1f3f9);
    }

    .bd-accordion__trigger:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
      /* Recolhe para dentro: o anel some se vazar do container com overflow. */
      outline-offset: -3px;
    }

    .bd-accordion__trigger:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bd-accordion__chevron {
      flex-shrink: 0;
      color: var(--bd-fg-subtle, #7b8399);
      font-size: 1.1rem;
      line-height: 1;
      transition: transform var(--bd-duration, 0.25s) var(--bd-ease, ease);
    }

    .is-open .bd-accordion__chevron {
      transform: rotate(180deg);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-accordion__panel[hidden] {
      display: none;
    }

    .bd-accordion__content {
      padding: 0 var(--bd-space-5, 1.5rem) var(--bd-space-5, 1.5rem);
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.92rem;
      line-height: 1.7;
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-accordion__chevron,
      .bd-accordion__trigger {
        transition: none;
      }
    }
  `,
})
export class BdAccordionComponent {
  readonly items = input.required<BdAccordionItem[]>();
  /** Ids das seções abertas. Two-way: `[(opened)]="abertas"`. */
  readonly opened = model<string[]>([]);
  /** Permite mais de uma seção aberta ao mesmo tempo. */
  readonly multiple = input(false, { transform: booleanAttribute });

  /** Emitido com o id e o novo estado da seção. */
  readonly toggled = output<{ id: string; open: boolean }>();

  protected estaAberto(id: string): boolean {
    return this.opened().includes(id);
  }

  protected alternar(item: BdAccordionItem) {
    if (item.disabled) return;

    const abertas = this.opened();
    const jaAberto = abertas.includes(item.id);

    const novas = jaAberto
      ? abertas.filter((i) => i !== item.id)
      : this.multiple()
        ? [...abertas, item.id]
        : [item.id];

    this.opened.set(novas);
    this.toggled.emit({ id: item.id, open: !jaAberto });
  }
}
