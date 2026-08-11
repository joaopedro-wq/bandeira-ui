import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdButtonComponent, BdFieldComponent, BdInputComponent, BdModalComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-modal-page',
  standalone: true,
  imports: [
    BdModalComponent,
    BdButtonComponent,
    BdFieldComponent,
    BdInputComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Modal"
      selector="<bd-modal>"
      description="Diálogo sobreposto com foco preso dentro, fechamento por Esc e clique no fundo,
        trava de rolagem da página e devolução do foco ao elemento que o abriu. No celular vira
        bottom sheet, ao alcance do polegar."
    />

    <div class="callout">
      <strong>O detalhe que quase todo modal erra.</strong> Sem <em>focus trap</em>, o
      <kbd>Tab</kbd> escapa para os links atrás do diálogo — quem navega por teclado ou leitor de
      tela fica perdido, interagindo com uma página que visualmente está bloqueada. Aqui o foco
      circula dentro do diálogo e volta ao botão de origem no fechamento.
    </div>

    <docs-demo
      title="Básico"
      description="Abra e tente sair com Tab: o foco circula entre os elementos do diálogo."
      [code]="cod1"
    >
      <button bdButton (click)="basico.set(true)">Abrir modal</button>

      <bd-modal [(open)]="basico" title="Confirmar publicação">
        <p class="p">
          Isto vai publicar a versão atual para todos os usuários. A ação pode ser revertida em
          até 24 horas.
        </p>
        <div class="acoes">
          <button bdButton variant="ghost" (click)="basico.set(false)">Cancelar</button>
          <button bdButton (click)="basico.set(false)">Publicar</button>
        </div>
      </bd-modal>
    </docs-demo>

    <docs-demo
      title="Com formulário"
      description="O primeiro elemento focável recebe o foco automaticamente ao abrir."
      [code]="cod2"
    >
      <button bdButton variant="ghost" (click)="form.set(true)">Abrir formulário</button>

      <bd-modal [(open)]="form" title="Entre em contato">
        <div class="campos">
          <bd-field label="Seu nome" required>
            <input bdInput type="text" placeholder="João Pedro" />
          </bd-field>
          <bd-field label="Mensagem">
            <textarea bdInput rows="3" placeholder="Como posso ajudar?"></textarea>
          </bd-field>
        </div>
        <div class="acoes">
          <button bdButton variant="ghost" (click)="form.set(false)">Cancelar</button>
          <button bdButton (click)="form.set(false)">Enviar</button>
        </div>
      </bd-modal>
    </docs-demo>

    <docs-demo
      title="Não dispensável"
      description="Com dismissible=false o X some e Esc e clique no fundo param de fechar. Use só quando a decisão for realmente obrigatória — e sempre ofereça uma saída dentro do diálogo."
      [code]="cod3"
    >
      <button bdButton variant="danger" (click)="obrigatorio.set(true)">Abrir bloqueante</button>

      <bd-modal [(open)]="obrigatorio" title="Sessão expirada" [dismissible]="false">
        <p class="p">Sua sessão expirou. Entre novamente para continuar.</p>
        <div class="acoes">
          <button bdButton (click)="obrigatorio.set(false)">Entendi</button>
        </div>
      </bd-modal>
    </docs-demo>

    <docs-api [rows]="api" />
  `,
  styles: `
    .callout {
      margin-bottom: 2.5rem;
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
    kbd {
      padding: 0.1rem 0.4rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border-strong);
      border-bottom-width: 2px;
      border-radius: 0.3rem;
      font-family: var(--bd-font-mono);
      font-size: 0.8em;
      color: var(--bd-fg);
    }
    .p {
      color: var(--bd-fg-muted);
      line-height: 1.7;
    }
    .campos {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .acoes {
      display: flex;
      justify-content: flex-end;
      gap: 0.6rem;
      margin-top: 1.75rem;
    }
  `,
})
export class ModalPageComponent {
  readonly basico = signal(false);
  readonly form = signal(false);
  readonly obrigatorio = signal(false);

  readonly cod1 = `<button bdButton (click)="aberto.set(true)">Abrir modal</button>

<bd-modal [(open)]="aberto" title="Confirmar publicação">
  <p>Isto vai publicar a versão atual.</p>
  <button bdButton (click)="aberto.set(false)">Publicar</button>
</bd-modal>`;

  readonly cod2 = `<bd-modal [(open)]="form" title="Entre em contato">
  <bd-field label="Seu nome" required>
    <input bdInput type="text" />
  </bd-field>
</bd-modal>`;

  readonly cod3 = `<bd-modal [(open)]="aberto" title="Sessão expirada" [dismissible]="false">
  …
</bd-modal>`;

  readonly api: DocsApiRow[] = [
    {
      name: 'open',
      type: 'boolean',
      default: 'false',
      description: 'Controla a visibilidade. Two-way: [(open)]="mostrar".',
    },
    {
      name: 'title',
      type: 'string',
      default: "''",
      description: 'Título visível, usado como aria-labelledby do diálogo.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "''",
      description: 'Rótulo acessível quando o diálogo não tem título visível.',
    },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Quando false, esconde o X e ignora Esc e clique no fundo.',
    },
    {
      name: 'closeLabel',
      type: 'string',
      default: "'Fechar'",
      description: 'Rótulo acessível do botão de fechar.',
    },
  ];
}
