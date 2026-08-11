import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BdSkeletonVariant = 'text' | 'title' | 'circle' | 'rect';

/**
 * Placeholder do conteúdo enquanto ele carrega.
 *
 * Prefira skeleton a spinner quando você já sabe o formato do que vai chegar:
 * a página não "salta" na troca e a espera parece mais curta.
 *
 * É invisível para leitores de tela (`aria-hidden`) — anuncie o carregamento
 * no container, com `aria-busy`.
 *
 * @example
 * ```html
 * <bd-skeleton variant="title" />
 * <bd-skeleton variant="text" width="80%" />
 * <bd-skeleton variant="circle" width="48px" height="48px" />
 * ```
 */
@Component({
  selector: 'bd-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    '[class]': 'classes()',
    '[style.width]': 'width() || null',
    '[style.height]': 'height() || null',
    'aria-hidden': 'true',
  },
  styles: `
    :host {
      display: block;
      background: linear-gradient(
        90deg,
        var(--bd-surface-hover, #f1f3f9) 25%,
        var(--bd-border, #e3e7f0) 37%,
        var(--bd-surface-hover, #f1f3f9) 63%
      );
      background-size: 400% 100%;
      border-radius: var(--bd-radius-sm, 0.5rem);
      animation: bd-shimmer 1.4s ease infinite;
    }

    :host(.bd-skeleton--text) {
      height: 0.85rem;
      margin-block: 0.25rem;
    }

    :host(.bd-skeleton--title) {
      height: 1.5rem;
      width: 55%;
      margin-block: 0.4rem;
    }

    :host(.bd-skeleton--circle) {
      width: 42px;
      height: 42px;
      border-radius: 50%;
    }

    :host(.bd-skeleton--rect) {
      height: 120px;
      border-radius: var(--bd-radius, 0.875rem);
    }

    @keyframes bd-shimmer {
      0% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0 50%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
        background: var(--bd-surface-hover, #f1f3f9);
      }
    }
  `,
})
export class BdSkeletonComponent {
  readonly variant = input<BdSkeletonVariant>('text');
  /** Sobrescreve a largura padrão da variante. */
  readonly width = input('');
  /** Sobrescreve a altura padrão da variante. */
  readonly height = input('');

  protected readonly classes = computed(() => `bd-skeleton--${this.variant()}`);
}
