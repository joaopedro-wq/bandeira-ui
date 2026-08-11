import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BdCardComponent, BdMetricComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-metric-page',
  standalone: true,
  imports: [
    BdMetricComponent,
    BdCardComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Metric"
      selector="<bd-metric>"
      description="Indicador numérico que conta de 0 até o valor quando entra na tela. A animação
        usa requestAnimationFrame escrevendo direto no DOM, sem disparar change detection a cada
        quadro — e o espaço do número é reservado antes, então o layout não salta."
    />

    <docs-demo title="Básico" [code]="cod1">
      <bd-metric [value]="3" suffix="+" label="anos de experiência" />
      <bd-metric [value]="42" label="projetos" />
    </docs-demo>

    <docs-demo
      title="Com gradiente"
      description="O gradiente vem do token --bd-gradient, então acompanha o tema."
      [code]="cod2"
    >
      <bd-metric [value]="98" suffix="%" label="cobertura" gradient />
      <bd-metric [value]="1250" prefix="R$ " label="ticket médio" gradient />
    </docs-demo>

    <docs-demo title="Em faixa de destaque" [code]="cod3" column>
      <bd-card>
        <div class="faixa">
          <bd-metric [value]="3" suffix="+" label="anos de experiência" gradient />
          <bd-metric [value]="4" label="APIs integradas" gradient />
          <bd-metric [value]="15" suffix="+" label="tecnologias" gradient />
          <bd-metric [value]="100" suffix="%" label="do protótipo ao deploy" gradient />
        </div>
      </bd-card>
    </docs-demo>

    <div class="callout">
      <strong>Movimento reduzido.</strong> Quem tem <code>prefers-reduced-motion</code> ativo vê o
      valor final imediatamente, sem contagem. Animação é enfeite; o número é a informação.
    </div>

    <docs-api [rows]="api" />
  `,
  styles: `
    .faixa {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 1.5rem;
    }
    .callout {
      margin: 2.5rem 0;
      padding: 1.25rem 1.4rem;
      background: var(--bd-primary-soft);
      border-left: 3px solid var(--bd-primary);
      border-radius: 0 var(--bd-radius) var(--bd-radius) 0;
      color: var(--bd-fg-muted);
      font-size: 0.93rem;
      line-height: 1.7;
    }
    .callout strong {
      color: var(--bd-fg);
    }
    .callout code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }
  `,
})
export class MetricPageComponent {
  readonly cod1 = `<bd-metric [value]="3" suffix="+" label="anos de experiência" />`;
  readonly cod2 = `<bd-metric [value]="98" suffix="%" label="cobertura" gradient />
<bd-metric [value]="1250" prefix="R$ " label="ticket médio" gradient />`;
  readonly cod3 = `<bd-card>
  <div class="faixa">
    <bd-metric [value]="3" suffix="+" label="anos" gradient />
    <bd-metric [value]="4" label="APIs integradas" gradient />
  </div>
</bd-card>`;

  readonly api: DocsApiRow[] = [
    { name: 'value', type: 'number', description: 'Valor final da contagem. Obrigatório.' },
    { name: 'label', type: 'string', default: "''", description: 'Legenda abaixo do número.' },
    { name: 'prefix', type: 'string', default: "''", description: 'Texto antes do número.' },
    { name: 'suffix', type: 'string', default: "''", description: 'Texto depois do número.' },
    {
      name: 'gradient',
      type: 'boolean',
      default: 'false',
      description: 'Preenche o número com o gradiente da marca.',
    },
  ];
}
