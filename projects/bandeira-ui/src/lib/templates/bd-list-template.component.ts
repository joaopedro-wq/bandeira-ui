import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { BdSkeletonComponent } from '../feedback/bd-skeleton.component';

/**
 * Estrutura de listagem para telas de cadastro e consulta: cabeçalho, barra de
 * busca e filtros, área de resultados e rodapé de paginação.
 *
 * Os três estados de uma listagem — carregando, vazia e preenchida — são
 * mutuamente exclusivos e ficam sob responsabilidade do template. Isso elimina
 * a repetição de `@if` em cada tela e, mais importante, elimina a divergência:
 * o estado de carregamento é anunciado por `aria-busy` em toda a aplicação, e
 * não apenas onde alguém lembrou de fazê-lo.
 *
 * @example
 * ```html
 * <bd-list-template
 *   title="Projetos"
 *   description="Tudo que está em andamento na sua equipe."
 *   [loading]="carregando()"
 *   [empty]="projetos().length === 0"
 * >
 *   <button bdButton bdListActions>Novo projeto</button>
 *
 *   <input bdInput bdListSearch type="search" placeholder="Buscar projetos" />
 *   <bd-chip bdListFilters selectable>Ativos</bd-chip>
 *
 *   <bd-empty-state bdListEmpty title="Nenhum projeto ainda" />
 *
 *   <table>…</table>
 *
 *   <span bdListFooter>24 resultados</span>
 * </bd-list-template>
 * ```
 */
@Component({
  selector: 'bd-list-template',
  standalone: true,
  imports: [BdSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bd-list__head">
      <div class="bd-list__headings">
        <h1 class="bd-list__title">{{ title() }}</h1>
        @if (description()) {
          <p class="bd-list__desc">{{ description() }}</p>
        }
      </div>

      <div class="bd-list__actions">
        <ng-content select="[bdListActions]" />
      </div>
    </header>

    <div class="bd-list__toolbar">
      <div class="bd-list__search">
        <ng-content select="[bdListSearch]" />
      </div>
      <div class="bd-list__filters">
        <ng-content select="[bdListFilters]" />
      </div>
    </div>

    <section class="bd-list__body" [attr.aria-busy]="loading()">
      @if (loading()) {
        <!-- Skeleton com a forma do resultado: a troca não desloca a página. -->
        <div class="bd-list__skeleton">
          @for (row of placeholderRows(); track row) {
            <bd-skeleton variant="rect" height="52px" />
          }
        </div>
        <span class="bd-sr-only" role="status">{{ loadingLabel() }}</span>
      } @else if (empty()) {
        <ng-content select="[bdListEmpty]" />
      } @else {
        <ng-content />
      }
    </section>

    <footer class="bd-list__footer">
      <ng-content select="[bdListFooter]" />
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .bd-list__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-4, 1rem);
    }

    .bd-list__headings {
      min-width: 0;
    }

    .bd-list__title {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
      color: var(--bd-fg, #10131c);
    }

    .bd-list__desc {
      max-width: 62ch;
      margin: 0.35rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-list__actions:not(:empty) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
      flex-shrink: 0;
    }

    .bd-list__toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-3, 0.75rem);
      margin-top: var(--bd-space-5, 1.5rem);
    }

    .bd-list__search {
      flex: 1 1 260px;
      min-width: 0;
      max-width: 380px;
    }

    .bd-list__filters:not(:empty) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-list__body {
      margin-top: var(--bd-space-5, 1.5rem);
      min-height: 120px;
    }

    .bd-list__skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-list__footer:not(:empty) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-3, 0.75rem);
      margin-top: var(--bd-space-5, 1.5rem);
      padding-top: var(--bd-space-4, 1rem);
      border-top: 1px solid var(--bd-border, #e3e7f0);
      color: var(--bd-fg-muted, #545c70);
      font-size: var(--bd-text-sm, 0.875rem);
    }

    /* Conteúdo anunciado por leitor de tela, invisível na página. Declarado
       aqui porque o template não pode depender da folha global. */
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

    @media (max-width: 640px) {
      .bd-list__search {
        max-width: none;
      }
    }
  `,
})
export class BdListTemplateComponent {
  readonly title = input.required<string>();
  readonly description = input('');

  /** Exibe os placeholders no lugar dos resultados. */
  readonly loading = input(false, { transform: booleanAttribute });
  /** Exibe o conteúdo de `[bdListEmpty]` no lugar dos resultados. */
  readonly empty = input(false, { transform: booleanAttribute });

  /** Quantidade de linhas de placeholder durante o carregamento. */
  readonly placeholderCount = input(5);
  /** Texto anunciado por leitores de tela durante o carregamento. */
  readonly loadingLabel = input('Carregando resultados…');

  // Derivado como signal, não como método: a lista de placeholders é
  // recalculada quando a contagem muda, não a cada ciclo de detecção.
  protected readonly placeholderRows = computed(() =>
    Array.from({ length: Math.max(1, this.placeholderCount()) }, (_, index) => index),
  );
}
