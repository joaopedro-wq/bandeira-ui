import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type BdBadgeTone = 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

/**
 * Contador ou marcador de status.
 *
 * Diferente do `<bd-chip>`, que rotula conteúdo: o badge quantifica ou sinaliza,
 * normalmente grudado noutro elemento.
 *
 * @example
 * ```html
 * <bd-badge>3</bd-badge>
 * <bd-badge tone="danger" [max]="99">128</bd-badge>
 * <bd-badge tone="success" dot>online</bd-badge>
 * ```
 */
@Component({
  selector: 'bd-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (dot()) {
      <span class="bd-badge__dot" aria-hidden="true"></span>
    }
    @if (limitado()) {
      {{ limitado() }}
    } @else {
      <ng-content />
    }
  `,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      min-width: 1.35rem;
      height: 1.35rem;
      padding: 0 0.45rem;
      border: 1px solid transparent;
      border-radius: var(--bd-radius-full, 9999px);
      font-size: 0.72rem;
      font-weight: var(--bd-weight-bold, 700);
      font-variant-numeric: tabular-nums;
      line-height: 1;
      justify-content: center;
    }

    .bd-badge__dot {
      width: 6px;
      height: 6px;
      background: currentColor;
      border-radius: 50%;
    }

    :host(.bd-badge--primary) {
      background: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary-contrast, #fff);
    }
    :host(.bd-badge--accent) {
      background: var(--bd-accent, #0d9488);
      color: var(--bd-accent-contrast, #fff);
    }
    :host(.bd-badge--neutral) {
      background: var(--bd-surface-hover, #f1f3f9);
      color: var(--bd-fg-muted, #545c70);
    }
    :host(.bd-badge--success) {
      background: var(--bd-success, #16a34a);
      color: #fff;
    }
    :host(.bd-badge--warning) {
      background: var(--bd-warning, #d97706);
      color: #fff;
    }
    :host(.bd-badge--danger) {
      background: var(--bd-danger, #dc2626);
      color: var(--bd-danger-contrast, #fff);
    }

    /* Com ponto o badge vira etiqueta de status: fundo suave, texto colorido. */
    :host(.bd-badge--dot) {
      background: transparent;
      border-color: currentColor;
      padding: 0 0.55rem;
    }
    :host(.bd-badge--dot.bd-badge--primary) {
      color: var(--bd-primary, #3d5ce8);
    }
    :host(.bd-badge--dot.bd-badge--accent) {
      color: var(--bd-accent, #0d9488);
    }
    :host(.bd-badge--dot.bd-badge--neutral) {
      color: var(--bd-fg-muted, #545c70);
    }
    :host(.bd-badge--dot.bd-badge--success) {
      color: var(--bd-success, #16a34a);
    }
    :host(.bd-badge--dot.bd-badge--warning) {
      color: var(--bd-warning, #d97706);
    }
    :host(.bd-badge--dot.bd-badge--danger) {
      color: var(--bd-danger, #dc2626);
    }
  `,
})
export class BdBadgeComponent {
  readonly tone = input<BdBadgeTone>('primary');
  /** Mostra um ponto antes do texto — bom para status. */
  readonly dot = input(false, { transform: booleanAttribute });
  /** Valor numérico. Acima de `max`, exibe "max+". */
  readonly value = input<number | null>(null);
  readonly max = input(99);

  protected readonly limitado = computed(() => {
    const v = this.value();
    if (v === null) return '';
    return v > this.max() ? `${this.max()}+` : `${v}`;
  });

  protected readonly classes = computed(() =>
    [`bd-badge--${this.tone()}`, this.dot() ? 'bd-badge--dot' : ''].filter(Boolean).join(' ')
  );
}
