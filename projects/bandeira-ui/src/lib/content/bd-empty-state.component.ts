import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Estado vazio: explica a ausência e oferece o próximo passo.
 *
 * Um empty state sem ação é um beco sem saída — projete-o como convite, não
 * como aviso.
 *
 * @example
 * ```html
 * <bd-empty-state
 *   icon="📭"
 *   title="Nenhum projeto ainda"
 *   description="Crie o primeiro para começar a acompanhar suas entregas."
 * >
 *   <button bdButton>Criar projeto</button>
 * </bd-empty-state>
 * ```
 */
@Component({
  selector: 'bd-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (icon()) {
      <span class="bd-empty__icon" aria-hidden="true">{{ icon() }}</span>
    }
    <h3 class="bd-empty__title">{{ title() }}</h3>
    @if (description()) {
      <p class="bd-empty__desc">{{ description() }}</p>
    }
    <div class="bd-empty__actions"><ng-content /></div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--bd-space-7, 3rem) var(--bd-space-5, 1.5rem);
      border: 1px dashed var(--bd-border-strong, #cbd2e2);
      border-radius: var(--bd-radius-lg, 1.25rem);
    }

    .bd-empty__icon {
      display: grid;
      place-items: center;
      width: 56px;
      height: 56px;
      margin-bottom: var(--bd-space-4, 1rem);
      background: var(--bd-surface-hover, #f1f3f9);
      border-radius: 50%;
      font-size: 1.5rem;
    }

    .bd-empty__title {
      margin: 0 0 0.4rem;
      font-size: var(--bd-text-lg, 1.125rem);
      font-weight: var(--bd-weight-semibold, 600);
      color: var(--bd-fg, #10131c);
    }

    .bd-empty__desc {
      max-width: 42ch;
      margin: 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    .bd-empty__actions:not(:empty) {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--bd-space-2, 0.5rem);
      margin-top: var(--bd-space-5, 1.5rem);
    }
  `,
})
export class BdEmptyStateComponent {
  readonly icon = input('');
  readonly title = input.required<string>();
  readonly description = input('');
}
