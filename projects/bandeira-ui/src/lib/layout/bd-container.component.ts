import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BdContainerSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * Centraliza o conteúdo com largura máxima e respiro lateral.
 *
 * O respiro é responsivo, então o conteúdo nunca encosta na borda no celular.
 *
 * @example
 * ```html
 * <bd-container size="md">…</bd-container>
 * ```
 */
@Component({
  selector: 'bd-container',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: block;
      width: 100%;
      margin-inline: auto;
      padding-inline: var(--bd-space-4, 1rem);
    }

    :host(.bd-container--sm) {
      max-width: 640px;
    }
    :host(.bd-container--md) {
      max-width: 960px;
    }
    :host(.bd-container--lg) {
      max-width: 1280px;
    }
    :host(.bd-container--full) {
      max-width: none;
    }

    @media (min-width: 768px) {
      :host {
        padding-inline: var(--bd-space-5, 1.5rem);
      }
    }
  `,
})
export class BdContainerComponent {
  readonly size = input<BdContainerSize>('lg');

  protected readonly classes = computed(() => `bd-container--${this.size()}`);
}
