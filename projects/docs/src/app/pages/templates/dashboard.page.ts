import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BdButtonComponent,
  BdCardComponent,
  BdChipComponent,
  BdDashboardTemplateComponent,
  BdMetricComponent,
} from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-template-dashboard-page',
  standalone: true,
  imports: [
    BdDashboardTemplateComponent,
    BdMetricComponent,
    BdCardComponent,
    BdChipComponent,
    BdButtonComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Painel analítico"
      selector="<bd-dashboard-template>"
      description="Três zonas de leitura: os números do topo respondem “como estamos?” em um
        relance, o centro desenvolve a resposta e a lateral guarda o contexto. No celular tudo se
        empilha nessa mesma ordem — o que importa continua vindo primeiro."
    />

    <docs-demo
      title="Estrutura completa"
      description="Estreite a janela: os indicadores se reorganizam sozinhos. Você acrescenta ou
        remove um número sem tocar em nenhuma regra de layout."
      [code]="code"
      column
    >
      <div class="frame">
        <bd-dashboard-template
          title="Visão geral"
          description="Desempenho consolidado dos últimos 30 dias."
          hasAside
        >
          <button bdButton bdDashboardActions size="sm" variant="ghost">Exportar</button>
          <button bdButton bdDashboardActions size="sm">Novo relatório</button>

          <bd-metric
            bdDashboardMetrics
            [value]="128"
            prefix="R$ "
            suffix="k"
            label="Receita"
            align="start"
            trend="up"
            delta="12,5%"
          />
          <bd-metric
            bdDashboardMetrics
            [value]="2480"
            label="Assinantes"
            align="start"
            trend="up"
            delta="4,1%"
          />
          <bd-metric
            bdDashboardMetrics
            [value]="38"
            label="Cancelamentos"
            align="start"
            trend="down"
            delta="2,3%"
          />

          <bd-card>
            <strong class="block-title">Receita por semana</strong>
            <div class="chart" aria-hidden="true">
              @for (bar of bars; track $index) {
                <span [style.height.%]="bar"></span>
              }
            </div>
          </bd-card>

          <bd-card>
            <strong class="block-title">Contratos recentes</strong>
            <ul class="rows">
              @for (row of contracts; track row.name) {
                <li>
                  <span>{{ row.name }}</span>
                  <bd-chip [tone]="row.tone">{{ row.status }}</bd-chip>
                </li>
              }
            </ul>
          </bd-card>

          <bd-card bdDashboardAside>
            <strong class="block-title">Atividade</strong>
            <ul class="feed">
              @for (item of activity; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </bd-card>
        </bd-dashboard-template>
      </div>
    </docs-demo>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Slots de projeção" [rows]="slots" />
  `,
  styles: `
    :host {
      display: block;
    }

    /* Emoldura a demonstração para que ela leia como uma tela, e não como um
       trecho solto no meio da documentação. */
    .frame {
      width: 100%;
      padding: 1.5rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .block-title {
      display: block;
      margin-bottom: 0.85rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--bd-fg);
    }

    .chart {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 120px;
    }

    .chart span {
      flex: 1;
      background: var(--bd-gradient);
      border-radius: 4px 4px 0 0;
      opacity: 0.85;
    }

    .rows,
    .feed {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .rows li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.9rem;
      color: var(--bd-fg-muted);
    }

    .feed li {
      position: relative;
      padding-left: 1.1rem;
      color: var(--bd-fg-muted);
      font-size: 0.86rem;
      line-height: 1.5;
    }

    .feed li::before {
      content: '';
      position: absolute;
      top: 0.5rem;
      left: 0;
      width: 6px;
      height: 6px;
      background: var(--bd-primary);
      border-radius: 50%;
    }
  `,
})
export class TemplateDashboardPageComponent {
  readonly bars = [42, 58, 35, 72, 64, 88, 76];

  readonly contracts = [
    { name: 'Prefeitura de Sobral', status: 'Assinado', tone: 'success' as const },
    { name: 'Grupo Andrade', status: 'Em análise', tone: 'warning' as const },
    { name: 'Cooperativa Vale', status: 'Assinado', tone: 'success' as const },
  ];

  readonly activity = [
    'Marina publicou a versão 2.4',
    'Contrato #4821 aprovado',
    'Três novos usuários convidados',
    'Backup concluído às 03:00',
  ];

  readonly rows: DocsApiRow[] = [
    {
      name: 'title',
      type: 'string',
      description: 'Título da tela. Renderizado como <h1> — é o título principal da página.',
    },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Linha de apoio abaixo do título.',
    },
    {
      name: 'hasAside',
      type: 'boolean',
      default: 'false',
      description:
        'Reserva a coluna lateral. Precisa ser declarado porque a decisão de layout pertence a quem monta a tela.',
    },
    {
      name: 'asideLabel',
      type: 'string',
      default: "'Informações complementares'",
      description: 'Rótulo acessível da coluna lateral.',
    },
  ];

  readonly slots: DocsApiRow[] = [
    {
      name: '[bdDashboardActions]',
      type: 'slot',
      description: 'Ações alinhadas à direita do cabeçalho.',
    },
    {
      name: '[bdDashboardMetrics]',
      type: 'slot',
      description: 'Faixa de indicadores, em grade fluida.',
    },
    {
      name: '[bdDashboardAside]',
      type: 'slot',
      description: 'Coluna lateral. Requer hasAside.',
    },
    {
      name: '(padrão)',
      type: 'slot',
      description: 'Coluna principal de conteúdo.',
    },
  ];

  readonly code = `<bd-dashboard-template
  title="Visão geral"
  description="Desempenho consolidado dos últimos 30 dias."
  hasAside
>
  <button bdButton bdDashboardActions>Exportar</button>

  <bd-metric bdDashboardMetrics [value]="128" prefix="R$ " suffix="k" label="Receita"
             align="start" trend="up" delta="12,5%" />
  <bd-metric bdDashboardMetrics [value]="2480" label="Assinantes"
             align="start" trend="up" delta="4,1%" />

  <bd-card>Gráfico principal</bd-card>
  <bd-card>Contratos recentes</bd-card>

  <bd-card bdDashboardAside>Atividade</bd-card>
</bd-dashboard-template>`;
}
