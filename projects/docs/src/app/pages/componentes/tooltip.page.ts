import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BdButtonComponent, BdTooltipDirective } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-tooltip-page',
  standalone: true,
  imports: [
    BdTooltipDirective,
    BdButtonComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Tooltip"
      selector="[bdTooltip]"
      description="Dica de texto que aparece no hover e também no foco por teclado. O elemento
        recebe aria-describedby, então leitores de tela anunciam a dica junto com o controle."
    />

    <div class="callout">
      <strong>Nunca coloque informação essencial num tooltip.</strong> Ele não aparece em telas de
      toque, some ao mover o mouse e não é impresso. Use para complementar — nunca para explicar o
      que um botão faz quando essa é a única pista disponível.
    </div>

    <docs-demo
      title="Posições"
      description="Passe o mouse ou navegue por Tab. O balão nunca sai da viewport: se não couber, é reposicionado."
      [code]="cod1"
    >
      <button bdButton variant="ghost" bdTooltip="Aparece em cima" placement="top">top</button>
      <button bdButton variant="ghost" bdTooltip="Aparece embaixo" placement="bottom">
        bottom
      </button>
      <button bdButton variant="ghost" bdTooltip="Aparece à esquerda" placement="left">left</button>
      <button bdButton variant="ghost" bdTooltip="Aparece à direita" placement="right">
        right
      </button>
    </docs-demo>

    <docs-demo
      title="Em botão de ícone"
      description="O caso mais comum — mas note que o aria-label continua obrigatório: o tooltip descreve, não nomeia."
      [code]="cod2"
    >
      <button bdButton iconOnly aria-label="Excluir projeto" bdTooltip="Excluir projeto">🗑</button>
      <button bdButton iconOnly variant="ghost" aria-label="Duplicar" bdTooltip="Duplicar">
        ⧉
      </button>
      <button bdButton iconOnly variant="ghost" aria-label="Compartilhar" bdTooltip="Compartilhar">
        ↗
      </button>
    </docs-demo>

    <docs-demo
      title="Atraso"
      description="O atraso padrão de 120ms evita o balão piscar quando o mouse só passa de raspão."
      [code]="cod3"
    >
      <span class="alvo" bdTooltip="Sem atraso" [showDelay]="0">imediato</span>
      <span class="alvo" bdTooltip="Padrão de 120ms">padrão</span>
      <span class="alvo" bdTooltip="Meio segundo" [showDelay]="500">lento</span>
    </docs-demo>

    <docs-api [rows]="api" />
  `,
  styles: `
    .callout {
      margin-bottom: 2.5rem;
      padding: 1.25rem 1.4rem;
      background: var(--bd-warning-soft);
      border-left: 3px solid var(--bd-warning);
      border-radius: 0 var(--bd-radius) var(--bd-radius) 0;
      color: var(--bd-fg-muted);
      font-size: 0.93rem;
      line-height: 1.7;
    }
    .callout strong {
      color: var(--bd-fg);
    }
    .alvo {
      padding: 0.35rem 0.7rem;
      border-bottom: 1px dashed var(--bd-border-strong);
      color: var(--bd-fg-muted);
      font-size: 0.9rem;
      cursor: help;
    }
  `,
})
export class TooltipPageComponent {
  readonly cod1 = `<button bdButton bdTooltip="Aparece em cima" placement="top">top</button>
<button bdButton bdTooltip="Aparece à direita" placement="right">right</button>`;

  readonly cod2 = `<button bdButton iconOnly aria-label="Excluir projeto" bdTooltip="Excluir projeto">
  🗑
</button>`;

  readonly cod3 = `<span bdTooltip="Sem atraso" [showDelay]="0">imediato</span>
<span bdTooltip="Meio segundo" [showDelay]="500">lento</span>`;

  readonly api: DocsApiRow[] = [
    { name: 'bdTooltip', type: 'string', description: 'Texto da dica. Obrigatório.' },
    {
      name: 'placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Lado onde o balão aparece.',
    },
    {
      name: 'showDelay',
      type: 'number',
      default: '120',
      description: 'Atraso em milissegundos antes de aparecer.',
    },
  ];
}
