import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BdCountUpDirective } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-count-up-page',
  standalone: true,
  imports: [BdCountUpDirective, DocsDemoComponent, DocsApiComponent, DocsPageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="CountUp"
      selector="[bdCountUp]"
      description="Anima um número de 0 até o valor final quando o elemento entra na viewport.
        Escreve direto no DOM via requestAnimationFrame, sem disparar change detection a cada
        quadro."
    />

    <docs-demo title="Básico" [code]="cod1">
      <span class="num" [bdCountUp]="1250"></span>
    </docs-demo>

    <docs-demo
      title="Prefixo e sufixo"
      description="Úteis para moeda, porcentagem e contagens abertas."
      [code]="cod2"
    >
      <span class="num" [bdCountUp]="98" suffix="%"></span>
      <span class="num" [bdCountUp]="1250" prefix="R$ "></span>
      <span class="num" [bdCountUp]="3" suffix="+"></span>
    </docs-demo>

    <docs-demo
      title="Duração"
      description="O padrão é 1400ms com easing de saída — rápido no começo, assentando suave no valor final. Passar de ~2s costuma cansar."
      [code]="cod3"
    >
      <span class="num" [bdCountUp]="500" [duration]="600"></span>
      <span class="num" [bdCountUp]="500" [duration]="2500"></span>
    </docs-demo>

    <div class="callout">
      <strong>Por que não usar interpolação.</strong> Animar um número com
      <code>{{ exemploInterpolacao }}</code> dispara change detection a cada quadro — 60 ciclos por
      segundo para atualizar um texto. Esta diretiva escreve no <code>textContent</code> direto e
      deixa o Angular fora do laço.
    </div>

    <docs-api [rows]="api" />
  `,
  styles: `
    .num {
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--bd-primary);
      min-width: 4ch;
    }
    .callout {
      margin: 2.5rem 0;
      padding: 1.25rem 1.4rem;
      background: var(--bd-accent-soft);
      border-left: 3px solid var(--bd-accent);
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
export class CountUpPageComponent {
  /** Literal exibido no texto — escrito aqui para não virar interpolação real. */
  readonly exemploInterpolacao = '{{ valor() }}';

  readonly cod1 = `<span [bdCountUp]="1250"></span>`;
  readonly cod2 = `<span [bdCountUp]="98" suffix="%"></span>
<span [bdCountUp]="1250" prefix="R$ "></span>`;
  readonly cod3 = `<span [bdCountUp]="500" [duration]="600"></span>
<span [bdCountUp]="500" [duration]="2500"></span>`;

  readonly api: DocsApiRow[] = [
    { name: 'bdCountUp', type: 'number', description: 'Valor final da contagem. Obrigatório.' },
    { name: 'prefix', type: 'string', default: "''", description: 'Texto antes do número.' },
    { name: 'suffix', type: 'string', default: "''", description: 'Texto depois do número.' },
    {
      name: 'duration',
      type: 'number',
      default: '1400',
      description: 'Duração da contagem em milissegundos.',
    },
  ];
}
