import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Cabeçalho de página: título, descrição e ações à direita.
 *
 * O título sai como `<h1>` — em quase toda tela ele é o título principal, e
 * pular esse nível quebra a navegação por cabeçalhos no leitor de tela.
 *
 * @example
 * ```html
 * <bd-page-header title="Projetos" description="Tudo que está em andamento.">
 *   <nav bdPageHeaderBreadcrumb>Início / Projetos</nav>
 *   <button bdButton bdPageHeaderActions>Novo projeto</button>
 * </bd-page-header>
 * ```
 */
@Component({
  selector: 'bd-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bd-page-header__breadcrumb">
      <ng-content select="[bdPageHeaderBreadcrumb]" />
    </div>

    <div class="bd-page-header__row">
      <div class="bd-page-header__text">
        <h1 class="bd-page-header__title">{{ title() }}</h1>
        @if (description()) {
          <p class="bd-page-header__desc">{{ description() }}</p>
        }
      </div>

      <div class="bd-page-header__actions">
        <ng-content select="[bdPageHeaderActions]" />
      </div>
    </div>

    <!-- Conteúdo livre embaixo: abas, filtros, o que a tela precisar. -->
    <div class="bd-page-header__extra"><ng-content /></div>
  `,
  styles: `
    :host {
      display: block;
      padding-bottom: var(--bd-space-5, 1.5rem);
      border-bottom: 1px solid var(--bd-border, #e3e7f0);
    }

    .bd-page-header__breadcrumb:not(:empty) {
      margin-bottom: var(--bd-space-2, 0.5rem);
      color: var(--bd-fg-subtle, #7b8399);
      font-size: var(--bd-text-sm, 0.875rem);
    }

    .bd-page-header__row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-4, 1rem);
    }

    .bd-page-header__text {
      min-width: 0;
    }

    .bd-page-header__title {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
      color: var(--bd-fg, #10131c);
    }

    .bd-page-header__desc {
      max-width: 62ch;
      margin: 0.35rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-page-header__actions:not(:empty) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
      flex-shrink: 0;
    }

    .bd-page-header__extra:not(:empty) {
      margin-top: var(--bd-space-5, 1.5rem);
    }
  `,
})
export class BdPageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input('');
}
