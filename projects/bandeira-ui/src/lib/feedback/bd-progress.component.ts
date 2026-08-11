import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type BdProgressTone = 'primary' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * Barra de progresso determinada.
 *
 * Expõe `role="progressbar"` com os valores ARIA corretos, então leitores de
 * tela anunciam a porcentagem. Para carregamento sem fim conhecido, use
 * `<bd-spinner>` — uma barra que não avança confunde mais do que informa.
 *
 * @example
 * ```html
 * <bd-progress [value]="65" />
 * <bd-progress [value]="3" [max]="5" tone="success" showValue label="Etapas" />
 * ```
 */
@Component({
  selector: 'bd-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() || showValue()) {
      <div class="bd-progress__head">
        <span class="bd-progress__label">{{ label() }}</span>
        @if (showValue()) {
          <span class="bd-progress__value">{{ percentual() }}%</span>
        }
      </div>
    }

    <div
      class="bd-progress__track"
      role="progressbar"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuemin]="0"
      [attr.aria-valuemax]="max()"
      [attr.aria-label]="label() || 'Progresso'"
    >
      <div class="bd-progress__bar" [style.width.%]="percentual()"></div>
    </div>
  `,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: block;
    }

    .bd-progress__head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.4rem;
    }

    .bd-progress__label {
      color: var(--bd-fg-muted, #545c70);
      font-size: var(--bd-text-sm, 0.875rem);
      font-weight: var(--bd-weight-medium, 500);
    }

    .bd-progress__value {
      color: var(--bd-fg-subtle, #7b8399);
      font-family: var(--bd-font-mono);
      font-size: var(--bd-text-xs, 0.75rem);
      font-variant-numeric: tabular-nums;
    }

    .bd-progress__track {
      height: 8px;
      background: var(--bd-surface-hover, #f1f3f9);
      border-radius: var(--bd-radius-full, 9999px);
      overflow: hidden;
    }

    .bd-progress__bar {
      height: 100%;
      border-radius: inherit;
      transition: width 0.4s var(--bd-ease, ease);
    }

    :host(.bd-progress--primary) .bd-progress__bar {
      background: var(--bd-primary, #3d5ce8);
    }
    :host(.bd-progress--accent) .bd-progress__bar {
      background: var(--bd-accent, #0d9488);
    }
    :host(.bd-progress--success) .bd-progress__bar {
      background: var(--bd-success, #16a34a);
    }
    :host(.bd-progress--warning) .bd-progress__bar {
      background: var(--bd-warning, #d97706);
    }
    :host(.bd-progress--danger) .bd-progress__bar {
      background: var(--bd-danger, #dc2626);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-progress__bar {
        transition: none;
      }
    }
  `,
})
export class BdProgressComponent {
  readonly value = input.required<number>();
  readonly max = input(100);
  readonly tone = input<BdProgressTone>('primary');
  readonly label = input('');
  /** Mostra a porcentagem ao lado do rótulo. */
  readonly showValue = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => `bd-progress--${this.tone()}`);

  protected readonly percentual = computed(() => {
    const max = this.max() || 1;
    return Math.min(100, Math.max(0, Math.round((this.value() / max) * 100)));
  });
}
