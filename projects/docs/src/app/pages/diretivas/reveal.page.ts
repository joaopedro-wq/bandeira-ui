import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BdCardComponent, BdRevealDirective } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-reveal-page',
  standalone: true,
  imports: [
    BdRevealDirective,
    BdCardComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Reveal"
      selector="[bdReveal]"
      description="Revela o elemento quando ele entra na viewport. A transição vive no CSS e move
        apenas opacity e transform — propriedades que o browser compõe na GPU — então a animação
        não trava a rolagem."
    />

    <div class="callout">
      <strong>Requer o CSS global.</strong> Importe
      <code>&#64;use 'bandeira-ui/styles/animations'</code> uma vez na aplicação. Diretivas não têm
      estilo encapsulado, então essas classes precisam ser globais.
    </div>

    <docs-demo
      title="Direções"
      description="Role a página para cima e para baixo — aqui revealOnce está desligado para você poder repetir."
      [code]="cod1"
      column
    >
      <div class="grade">
        @for (dir of direcoes; track dir; let i = $index) {
          <bd-card [bdReveal]="dir" [revealDelay]="i * 120" [revealOnce]="false">
            <strong>{{ dir }}</strong>
          </bd-card>
        }
      </div>
    </docs-demo>

    <docs-demo
      title="Cascata"
      description="Multiplique o índice pelo atraso para criar entrada em sequência. Mantenha o passo curto — acima de ~120ms a lista parece lenta."
      [code]="cod2"
      column
    >
      <div class="grade">
        @for (n of [1, 2, 3, 4, 5, 6]; track n) {
          <bd-card bdReveal [revealDelay]="n * 90" [revealOnce]="false">
            <strong>Item {{ n }}</strong>
          </bd-card>
        }
      </div>
    </docs-demo>

    <div class="callout callout--accent">
      <strong>Decisões embutidas.</strong> O observer é desconectado assim que o elemento aparece
      (com <code>revealOnce</code>), a configuração roda dentro de <code>afterNextRender</code> —
      então é seguro em SSR — e quem tem <code>prefers-reduced-motion</code> ativo vê tudo já
      visível, sem animação nenhuma.
    </div>

    <docs-api [rows]="api" />
  `,
  styles: `
    .grade {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      width: 100%;
    }
    .grade strong {
      color: var(--bd-fg);
      font-size: 0.92rem;
    }
    .callout {
      margin-bottom: 2.5rem;
      padding: 1.25rem 1.4rem;
      background: var(--bd-primary-soft);
      border-left: 3px solid var(--bd-primary);
      border-radius: 0 var(--bd-radius) var(--bd-radius) 0;
      color: var(--bd-fg-muted);
      font-size: 0.93rem;
      line-height: 1.7;
    }
    .callout--accent {
      margin-top: 2.5rem;
      background: var(--bd-accent-soft);
      border-left-color: var(--bd-accent);
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
export class RevealPageComponent {
  readonly direcoes = ['up', 'down', 'left', 'right', 'scale'] as const;

  readonly cod1 = `<div bdReveal></div>
<div bdReveal="left" [revealDelay]="120"></div>
<div bdReveal="scale" [revealOnce]="false"></div>`;

  readonly cod2 = `@for (item of itens; track item.id; let i = $index) {
  <bd-card bdReveal [revealDelay]="i * 90">{{ item.nome }}</bd-card>
}`;

  readonly api: DocsApiRow[] = [
    {
      name: 'bdReveal',
      type: "'up' | 'down' | 'left' | 'right' | 'scale'",
      default: "'up'",
      description: 'Direção de onde o elemento entra.',
    },
    {
      name: 'revealDelay',
      type: 'number',
      default: '0',
      description: 'Atraso em milissegundos. Use i * 80 em listas para criar cascata.',
    },
    {
      name: 'revealOnce',
      type: 'boolean',
      default: 'true',
      description: 'Quando false, o elemento volta a esconder ao sair da viewport.',
    },
  ];
}
