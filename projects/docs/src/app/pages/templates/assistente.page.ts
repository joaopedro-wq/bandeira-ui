import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  BdAlertComponent,
  BdCheckboxComponent,
  BdFieldComponent,
  BdInputComponent,
  BdWizardStep,
  BdWizardTemplateComponent,
} from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-template-assistente-page',
  standalone: true,
  imports: [
    BdWizardTemplateComponent,
    BdFieldComponent,
    BdInputComponent,
    BdCheckboxComponent,
    BdAlertComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Assistente por etapas"
      selector="<bd-wizard-template>"
      description="Cadastro longo vira quatro telas curtas, e a taxa de abandono cai junto. O
        usuário sempre sabe onde está, quanto falta e o que ainda precisa preencher para seguir."
    />

    <bd-alert tone="info" title="Suas regras continuam suas">
      O template não valida nada por conta própria. Enquanto <code>canAdvance</code> for
      <code>false</code>, o botão de avanço fica bloqueado e nenhum evento é emitido — a regra de
      negócio permanece no seu formulário, onde ela pertence.
    </bd-alert>

    <docs-demo
      description="Preencha o nome do projeto para liberar o avanço. O usuário volta livremente ao
        que já preencheu, mas não pula etapas que ainda não completou."
      [code]="code"
      column
    >
      <div class="frame">
        <bd-wizard-template
          title="Novo projeto"
          description="Três etapas, cerca de dois minutos."
          [steps]="etapas"
          [(activeStep)]="etapa"
          [canAdvance]="podeAvancar()"
          (finish)="concluir()"
        >
          @switch (etapa()) {
            @case (0) {
              <div class="campos">
                <bd-field label="Nome do projeto" hint="Obrigatório para continuar.">
                  <input bdInput [value]="nome()" (input)="onNome($event)" />
                </bd-field>
                <bd-field label="Descrição">
                  <input bdInput placeholder="Opcional" />
                </bd-field>
              </div>
            }
            @case (1) {
              <div class="campos">
                <bd-field label="Convidar por e-mail">
                  <input bdInput type="email" placeholder="pessoa@empresa.com" />
                </bd-field>
                <bd-checkbox [(checked)]="notificar">Notificar a equipe por e-mail</bd-checkbox>
              </div>
            }
            @case (2) {
              <div class="revisao">
                <h3>Revisão</h3>
                <dl>
                  <dt>Projeto</dt>
                  <dd>{{ nome() || '—' }}</dd>
                  <dt>Notificar equipe</dt>
                  <dd>{{ notificar() ? 'Sim' : 'Não' }}</dd>
                </dl>
                @if (concluido()) {
                  <p class="ok">Projeto criado com sucesso.</p>
                }
              </div>
            }
          }
        </bd-wizard-template>
      </div>
    </docs-demo>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Saídas e slots" [rows]="saidas" />
  `,
  styles: `
    :host {
      display: block;
    }

    .frame {
      width: 100%;
      padding: 1.5rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .campos {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .revisao h3 {
      margin-bottom: 0.9rem;
      font-size: 1rem;
      font-weight: 700;
      color: var(--bd-fg);
    }

    dl {
      display: grid;
      grid-template-columns: max-content 1fr;
      gap: 0.45rem 1.25rem;
      font-size: 0.9rem;
    }

    dt {
      color: var(--bd-fg-subtle);
    }

    dd {
      margin: 0;
      color: var(--bd-fg);
      font-weight: 600;
    }

    .ok {
      margin-top: 1rem;
      color: var(--bd-success);
      font-size: 0.9rem;
      font-weight: 600;
    }
  `,
})
export class TemplateAssistentePageComponent {
  readonly etapas: BdWizardStep[] = [
    { label: 'Dados básicos', hint: 'Nome e descrição' },
    { label: 'Equipe', hint: 'Quem participa' },
    { label: 'Revisão', hint: 'Confirme e crie' },
  ];

  readonly etapa = signal(0);
  readonly nome = signal('');
  readonly notificar = signal(true);
  readonly concluido = signal(false);

  // Só a primeira etapa tem campo obrigatório nesta demonstração.
  readonly podeAvancar = computed(() => this.etapa() !== 0 || this.nome().trim().length > 0);

  onNome(event: Event): void {
    this.nome.set((event.target as HTMLInputElement).value);
  }

  concluir(): void {
    this.concluido.set(true);
  }

  readonly rows: DocsApiRow[] = [
    { name: 'title', type: 'string', description: 'Título do assistente, renderizado como <h1>.' },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Linha de apoio abaixo do título.',
    },
    {
      name: 'steps',
      type: 'BdWizardStep[]',
      default: '[]',
      description: 'Etapas do processo: label e hint opcional.',
    },
    {
      name: 'activeStep',
      type: 'model<number>',
      default: '0',
      description: 'Two-way com o índice da etapa corrente.',
    },
    {
      name: 'canAdvance',
      type: 'boolean',
      default: 'true',
      description:
        'Libera o avanço. Ligue à validade do formulário da etapa; com false, nenhum evento é emitido.',
    },
    {
      name: 'previousLabel / nextLabel / finishLabel',
      type: 'string',
      default: "'Voltar' / 'Continuar' / 'Concluir'",
      description: 'Rótulos dos botões de navegação.',
    },
    {
      name: 'stepsLabel',
      type: 'string',
      default: "'Etapas do processo'",
      description: 'Rótulo acessível da lista de etapas.',
    },
  ];

  readonly saidas: DocsApiRow[] = [
    {
      name: '(stepChange)',
      type: 'output<number>',
      description: 'Emitido ao entrar em uma etapa, com o índice de destino.',
    },
    {
      name: '(finish)',
      type: 'output<void>',
      description: 'Emitido ao confirmar a última etapa.',
    },
    {
      name: '[bdWizardActions]',
      type: 'slot',
      description: 'Ações extras à esquerda do botão de avanço — por exemplo, "Salvar rascunho".',
    },
    { name: '(padrão)', type: 'slot', description: 'Conteúdo da etapa corrente.' },
  ];

  readonly code = `<bd-wizard-template
  title="Novo projeto"
  [steps]="etapas"
  [(activeStep)]="etapa"
  [canAdvance]="formulario.valid"
  (finish)="concluir()"
>
  &#64;switch (etapa()) {
    &#64;case (0) { <section>Dados básicos</section> }
    &#64;case (1) { <section>Equipe</section> }
    &#64;case (2) { <section>Revisão</section> }
  }
</bd-wizard-template>`;
}
