import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

export type BdCardPadding = 'none' | 'sm' | 'md' | 'lg';

/**
 * Container base do design system.
 *
 * @example
 * ```html
 * <bd-card>Conteúdo</bd-card>
 * <bd-card interactive padding="lg">Sobe no hover</bd-card>
 * <bd-card dashed>Placeholder / empty state</bd-card>
 * ```
 */
@Component({
  selector: 'bd-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: block;
      background: var(--bd-surface, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-lg, 1.25rem);
      box-shadow: var(--bd-shadow-sm, 0 1px 2px rgba(16, 19, 28, 0.06));
      color: var(--bd-fg, #10131c);
      transition:
        transform var(--bd-duration, 0.25s) var(--bd-ease, ease),
        box-shadow var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease;
    }

    /* As classes ficam no host, então precisam de :host(.classe). */
    :host(.bd-card--none) {
      padding: 0;
    }
    :host(.bd-card--sm) {
      padding: var(--bd-space-4, 1rem);
    }
    :host(.bd-card--md) {
      padding: var(--bd-space-5, 1.5rem);
    }
    :host(.bd-card--lg) {
      padding: var(--bd-space-6, 2rem);
    }

    :host(.bd-card--dashed) {
      border-style: dashed;
      background: transparent;
      box-shadow: none;
    }

    :host(.bd-card--interactive) {
      cursor: pointer;
    }
    :host(.bd-card--interactive:hover) {
      transform: translateY(-4px);
      border-color: var(--bd-border-strong, #cbd2e2);
      box-shadow: var(--bd-shadow-md, 0 8px 24px rgba(16, 19, 28, 0.08));
    }

    @media (prefers-reduced-motion: reduce) {
      :host,
      :host(.bd-card--interactive:hover) {
        transition: none;
        transform: none;
      }
    }
  `,
})
export class BdCardComponent {
  readonly padding = input<BdCardPadding>('md');
  /** Aplica elevação e deslocamento no hover. */
  readonly interactive = input(false, { transform: booleanAttribute });
  /** Borda tracejada — bom para empty states e placeholders. */
  readonly dashed = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    [
      `bd-card--${this.padding()}`,
      this.interactive() ? 'bd-card--interactive' : '',
      this.dashed() ? 'bd-card--dashed' : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
}
