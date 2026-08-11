import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
} from '@angular/core';

export type BdAlertTone = 'info' | 'success' | 'warning' | 'danger';

const ICONES: Record<BdAlertTone, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '!',
  danger: '✕',
};

/**
 * Mensagem persistente na página — diferente do toast, que some sozinho.
 *
 * Erros e avisos recebem `role="alert"` (o leitor de tela interrompe e anuncia);
 * info e sucesso recebem `role="status"` (anuncia sem interromper).
 *
 * @example
 * ```html
 * <bd-alert tone="warning" title="Plano expirando">
 *   Sua assinatura vence em 3 dias.
 * </bd-alert>
 *
 * <bd-alert tone="danger" dismissible (dismissed)="esconder()">
 *   Não foi possível salvar.
 * </bd-alert>
 * ```
 */
@Component({
  selector: 'bd-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="bd-alert__icon" aria-hidden="true">{{ icone() }}</span>

    <div class="bd-alert__body">
      @if (title()) {
        <strong class="bd-alert__title">{{ title() }}</strong>
      }
      <div class="bd-alert__content"><ng-content /></div>
    </div>

    @if (dismissible()) {
      <button
        type="button"
        class="bd-alert__close"
        [attr.aria-label]="closeLabel()"
        (click)="dismissed.emit()"
      >
        &times;
      </button>
    }
  `,
  host: {
    '[class]': 'classes()',
    '[attr.role]': 'papel()',
  },
  styles: `
    :host {
      display: flex;
      align-items: flex-start;
      gap: var(--bd-space-3, 0.75rem);
      padding: var(--bd-space-4, 1rem);
      border: 1px solid transparent;
      border-radius: var(--bd-radius, 0.875rem);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .bd-alert__icon {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: currentColor;
      font-size: 0.72rem;
      font-weight: 700;
    }

    /* O glifo herda a cor do tom; o círculo usa a cor de fundo do alerta. */
    .bd-alert__icon::first-letter {
      color: var(--bd-bg, #fff);
    }

    .bd-alert__body {
      flex: 1;
      min-width: 0;
    }

    .bd-alert__title {
      display: block;
      margin-bottom: 0.15rem;
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-alert__content {
      color: var(--bd-fg-muted, #545c70);
    }

    .bd-alert__close {
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      margin: -0.15rem -0.15rem 0 0;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: inherit;
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      opacity: 0.65;
      transition:
        opacity 0.2s ease,
        background 0.2s ease;
    }
    .bd-alert__close:hover {
      opacity: 1;
      background: rgb(0 0 0 / 0.08);
    }
    .bd-alert__close:focus-visible {
      outline: none;
      opacity: 1;
      box-shadow: 0 0 0 2px currentColor;
    }

    /* Tons — as classes ficam no host, daí o :host(.classe). */
    :host(.bd-alert--info) {
      background: var(--bd-info-soft, rgba(2, 132, 199, 0.1));
      border-color: color-mix(in srgb, var(--bd-info, #0284c7) 30%, transparent);
      color: var(--bd-info, #0284c7);
    }
    :host(.bd-alert--success) {
      background: var(--bd-success-soft, rgba(22, 163, 74, 0.1));
      border-color: color-mix(in srgb, var(--bd-success, #16a34a) 30%, transparent);
      color: var(--bd-success, #16a34a);
    }
    :host(.bd-alert--warning) {
      background: var(--bd-warning-soft, rgba(217, 119, 6, 0.1));
      border-color: color-mix(in srgb, var(--bd-warning, #d97706) 30%, transparent);
      color: var(--bd-warning, #d97706);
    }
    :host(.bd-alert--danger) {
      background: var(--bd-danger-soft, rgba(220, 38, 38, 0.1));
      border-color: color-mix(in srgb, var(--bd-danger, #dc2626) 30%, transparent);
      color: var(--bd-danger, #dc2626);
    }
  `,
})
export class BdAlertComponent {
  readonly tone = input<BdAlertTone>('info');
  readonly title = input('');
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly closeLabel = input('Fechar aviso');

  readonly dismissed = output<void>();

  protected readonly icone = computed(() => ICONES[this.tone()]);
  protected readonly classes = computed(() => `bd-alert--${this.tone()}`);

  /** Erro e aviso interrompem o leitor de tela; os demais só anunciam. */
  protected readonly papel = computed(() =>
    this.tone() === 'danger' || this.tone() === 'warning' ? 'alert' : 'status',
  );
}
