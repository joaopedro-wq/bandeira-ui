import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type BdChipTone = 'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

/**
 * Etiqueta compacta para tecnologias, níveis, filtros e status.
 *
 * @example
 * ```html
 * <bd-chip>Angular</bd-chip>
 * <bd-chip tone="accent">avançado</bd-chip>
 * <bd-chip tone="neutral" outlined>rascunho</bd-chip>
 * <bd-chip removable (removed)="tirarFiltro()">TypeScript</bd-chip>
 * ```
 */
@Component({
  selector: 'bd-chip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (removable()) {
      <button
        type="button"
        class="bd-chip__remove"
        [attr.aria-label]="removeLabel()"
        (click)="removed.emit()"
      >
        &times;
      </button>
    }
  `,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--bd-space-1, 0.25rem);
      padding: 0.28rem 0.7rem;
      border: 1px solid transparent;
      border-radius: var(--bd-radius-full, 9999px);
      font-size: var(--bd-text-xs, 0.75rem);
      font-weight: var(--bd-weight-semibold, 600);
      letter-spacing: 0.01em;
      line-height: 1.4;
      white-space: nowrap;
    }

    /* As classes de tom ficam no host, então precisam de :host(.classe). */
    :host(.bd-chip--primary) {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      color: var(--bd-primary, #3d5ce8);
    }
    :host(.bd-chip--accent) {
      background: var(--bd-accent-soft, rgba(13, 148, 136, 0.1));
      color: var(--bd-accent, #0d9488);
    }
    :host(.bd-chip--neutral) {
      background: var(--bd-surface-hover, #f1f3f9);
      color: var(--bd-fg-muted, #545c70);
    }
    :host(.bd-chip--success) {
      background: var(--bd-success-soft, rgba(22, 163, 74, 0.1));
      color: var(--bd-success, #16a34a);
    }
    :host(.bd-chip--warning) {
      background: var(--bd-warning-soft, rgba(217, 119, 6, 0.1));
      color: var(--bd-warning, #d97706);
    }
    :host(.bd-chip--danger) {
      background: var(--bd-danger-soft, rgba(220, 38, 38, 0.1));
      color: var(--bd-danger, #dc2626);
    }

    /* Variante contornada: mesma cor, sem preenchimento. */
    :host(.bd-chip--outlined) {
      background: transparent;
      border-color: currentColor;
    }

    .bd-chip__remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.1rem;
      height: 1.1rem;
      margin-right: -0.25rem;
      padding: 0;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: inherit;
      font-size: 1rem;
      line-height: 1;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity var(--bd-duration-fast, 0.15s) ease,
        background var(--bd-duration-fast, 0.15s) ease;
    }

    .bd-chip__remove:hover {
      opacity: 1;
      background: rgb(0 0 0 / 0.08);
    }

    .bd-chip__remove:focus-visible {
      outline: none;
      opacity: 1;
      box-shadow: 0 0 0 2px currentColor;
    }
  `,
})
export class BdChipComponent {
  readonly tone = input<BdChipTone>('primary');
  readonly outlined = input(false, { transform: booleanAttribute });
  /** Mostra o botão de remover. */
  readonly removable = input(false, { transform: booleanAttribute });
  /** Rótulo acessível do botão de remover. */
  readonly removeLabel = input('Remover');

  /** Emitido ao clicar no botão de remover. */
  readonly removed = output<void>();

  protected readonly classes = computed(() =>
    [`bd-chip--${this.tone()}`, this.outlined() ? 'bd-chip--outlined' : '']
      .filter(Boolean)
      .join(' ')
  );
}
