import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BdSpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Indicador de carregamento indeterminado.
 *
 * Traz o rótulo para leitores de tela por padrão — um spinner mudo deixa quem
 * não enxerga sem saber que algo está acontecendo.
 *
 * @example
 * ```html
 * <bd-spinner />
 * <bd-spinner size="lg" label="Carregando projetos" />
 * ```
 */
@Component({
  selector: 'bd-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="bd-spinner__ring" aria-hidden="true"></span>
    <span class="bd-sr-only">{{ label() }}</span>
  `,
  host: {
    '[class]': 'classes()',
    role: 'status',
    '[attr.aria-live]': '"polite"',
  },
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
    }

    .bd-spinner__ring {
      display: block;
      border-style: solid;
      border-color: currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      color: var(--bd-primary, #3d5ce8);
      animation: bd-spin 0.7s linear infinite;
    }

    :host(.bd-spinner--sm) .bd-spinner__ring {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }
    :host(.bd-spinner--md) .bd-spinner__ring {
      width: 26px;
      height: 26px;
      border-width: 3px;
    }
    :host(.bd-spinner--lg) .bd-spinner__ring {
      width: 42px;
      height: 42px;
      border-width: 4px;
    }

    .bd-sr-only {
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

    @keyframes bd-spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Não desliga a animação: ela é a única indicação de progresso.
       Só desacelera, para reduzir o incômodo. */
    @media (prefers-reduced-motion: reduce) {
      .bd-spinner__ring {
        animation-duration: 1.8s;
      }
    }
  `,
})
export class BdSpinnerComponent {
  readonly size = input<BdSpinnerSize>('md');
  /** Texto anunciado por leitores de tela. */
  readonly label = input('Carregando');

  protected readonly classes = computed(() => `bd-spinner--${this.size()}`);
}
