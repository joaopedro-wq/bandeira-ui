import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * Estrutura de painel analítico: cabeçalho, faixa de indicadores e uma grade
 * de conteúdo com coluna principal e coluna lateral.
 *
 * A hierarquia é deliberada — indicadores no topo respondem "como estamos?" em
 * um relance; a coluna principal desenvolve a resposta; a lateral concentra o
 * secundário. Abaixo de 1080px as colunas se empilham e a lateral desce, de
 * modo que a leitura no celular preserva a mesma ordem de importância.
 *
 * @example
 * ```html
 * <bd-dashboard-template
 *   title="Visão geral"
 *   description="Desempenho consolidado dos últimos 30 dias."
 * >
 *   <button bdButton bdDashboardActions>Exportar</button>
 *
 *   <bd-metric bdDashboardMetrics label="Receita" value="R$ 128k" />
 *   <bd-metric bdDashboardMetrics label="Assinantes" value="2.480" />
 *
 *   <bd-card>Gráfico principal</bd-card>
 *
 *   <bd-card bdDashboardAside>Atividade recente</bd-card>
 * </bd-dashboard-template>
 * ```
 */
@Component({
  selector: 'bd-dashboard-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bd-dashboard__head">
      <div class="bd-dashboard__headings">
        <h1 class="bd-dashboard__title">{{ title() }}</h1>
        @if (description()) {
          <p class="bd-dashboard__desc">{{ description() }}</p>
        }
      </div>

      <div class="bd-dashboard__actions">
        <ng-content select="[bdDashboardActions]" />
      </div>
    </header>

    <!-- Faixa de indicadores: a resposta imediata da tela. -->
    <div class="bd-dashboard__metrics">
      <ng-content select="[bdDashboardMetrics]" />
    </div>

    <div class="bd-dashboard__grid" [class.bd-dashboard__grid--single]="!hasAside()">
      <div class="bd-dashboard__main">
        <ng-content />
      </div>

      @if (hasAside()) {
        <aside class="bd-dashboard__aside" [attr.aria-label]="asideLabel()">
          <ng-content select="[bdDashboardAside]" />
        </aside>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      --bd-dashboard-aside-w: 340px;
    }

    .bd-dashboard__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-4, 1rem);
      margin-bottom: var(--bd-space-6, 2rem);
    }

    .bd-dashboard__headings {
      min-width: 0;
    }

    .bd-dashboard__title {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
      color: var(--bd-fg, #10131c);
    }

    .bd-dashboard__desc {
      max-width: 62ch;
      margin: 0.35rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-dashboard__actions:not(:empty) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
      flex-shrink: 0;
    }

    /* auto-fit com minmax: o número de colunas acompanha a largura sem
       media query e sem contar quantos indicadores existem. */
    .bd-dashboard__metrics:not(:empty) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--bd-space-4, 1rem);
      margin-bottom: var(--bd-space-6, 2rem);
    }

    .bd-dashboard__grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) var(--bd-dashboard-aside-w);
      align-items: start;
      gap: var(--bd-space-5, 1.5rem);
    }

    .bd-dashboard__grid--single {
      grid-template-columns: minmax(0, 1fr);
    }

    .bd-dashboard__main,
    .bd-dashboard__aside {
      display: flex;
      flex-direction: column;
      gap: var(--bd-space-4, 1rem);
      min-width: 0;
    }

    @media (max-width: 1080px) {
      .bd-dashboard__grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `,
})
export class BdDashboardTemplateComponent {
  readonly title = input.required<string>();
  readonly description = input('');

  /** Rótulo acessível da coluna lateral. */
  readonly asideLabel = input('Informações complementares');

  /**
   * Reserva a coluna lateral. Precisa ser declarado porque o conteúdo
   * projetado não é observável a partir do componente: a decisão de layout
   * pertence a quem monta a tela.
   */
  readonly hasAside = input(false, { transform: booleanAttribute });
}
