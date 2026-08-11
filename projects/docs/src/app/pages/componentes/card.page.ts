import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BdButtonComponent, BdCardComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-card-page',
  standalone: true,
  imports: [
    BdCardComponent,
    BdButtonComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Card"
      selector="<bd-card>"
      description="Container base do sistema. Sozinho não impõe layout interno — só superfície,
        borda, raio e sombra, todos vindos dos tokens."
    />

    <docs-demo title="Padrão" [code]="cod1">
      <bd-card>
        <h3 class="t">Cartão padrão</h3>
        <p class="d">Superfície, borda e sombra vindas dos tokens.</p>
      </bd-card>
    </docs-demo>

    <docs-demo
      title="Interativo"
      description="Sobe e ganha elevação no hover. Use quando o cartão inteiro é clicável — e nesse caso envolva o conteúdo num link ou botão real, para funcionar por teclado."
      [code]="cod2"
    >
      <bd-card interactive>
        <h3 class="t">Passe o mouse</h3>
        <p class="d">Deslocamento e sombra no hover.</p>
      </bd-card>
    </docs-demo>

    <docs-demo
      title="Tracejado"
      description="Comunica ausência: empty states, área de upload, slot ainda não preenchido."
      [code]="cod3"
    >
      <bd-card dashed>
        <h3 class="t">Nenhum projeto ainda</h3>
        <p class="d">Crie o primeiro para começar.</p>
        <button bdButton size="sm" style="margin-top: 0.85rem">Criar projeto</button>
      </bd-card>
    </docs-demo>

    <docs-demo title="Espaçamento interno" [code]="cod4">
      <bd-card padding="sm"><span class="d">padding="sm"</span></bd-card>
      <bd-card padding="md"><span class="d">padding="md"</span></bd-card>
      <bd-card padding="lg"><span class="d">padding="lg"</span></bd-card>
    </docs-demo>

    <docs-api [rows]="api" />
  `,
  styles: `
    .t {
      margin-bottom: 0.3rem;
      font-size: 1rem;
      font-weight: 650;
      color: var(--bd-fg);
    }
    .d {
      color: var(--bd-fg-muted);
      font-size: 0.9rem;
    }
  `,
})
export class CardPageComponent {
  readonly cod1 = `<bd-card>
  <h3>Cartão padrão</h3>
  <p>Superfície, borda e sombra vindas dos tokens.</p>
</bd-card>`;

  readonly cod2 = `<bd-card interactive>…</bd-card>`;
  readonly cod3 = `<bd-card dashed>…</bd-card>`;
  readonly cod4 = `<bd-card padding="sm">…</bd-card>
<bd-card padding="lg">…</bd-card>`;

  readonly api: DocsApiRow[] = [
    {
      name: 'padding',
      type: "'none' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Espaçamento interno. Use none quando o conteúdo controla o próprio padding.',
    },
    {
      name: 'interactive',
      type: 'boolean',
      default: 'false',
      description: 'Aplica cursor, deslocamento e elevação no hover.',
    },
    {
      name: 'dashed',
      type: 'boolean',
      default: 'false',
      description: 'Borda tracejada e fundo transparente — para empty states.',
    },
  ];
}
