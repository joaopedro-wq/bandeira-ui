import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdFieldComponent, BdInputComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-field-page',
  standalone: true,
  imports: [
    BdFieldComponent,
    BdInputComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Field & Input"
      selector="<bd-field> + [bdInput]"
      description="O par que monta um campo de formulário acessível. O field encontra o [bdInput]
        projetado e liga tudo sozinho: o for do rótulo aponta para o id real do campo, o
        aria-describedby aponta para a dica ou o erro, e o aria-invalid acompanha o estado."
    />

    <div class="callout">
      <strong>Por que isso importa.</strong> Um rótulo cujo <code>for</code> não aponta para o campo
      é decoração: clicar nele não foca o input, e o leitor de tela anuncia um campo sem nome. Aqui
      essa ligação não depende de quem consome lembrar — ela é feita pelo componente.
    </div>

    <docs-demo title="Básico" [code]="cod1" column>
      <bd-field label="Seu nome" hint="Como devo te chamar">
        <input bdInput type="text" placeholder="João Pedro" />
      </bd-field>
    </docs-demo>

    <docs-demo
      title="Obrigatório e com erro"
      description="Digite algo sem @ para ver o estado de erro. A mensagem entra com role='alert' e substitui a dica."
      [code]="cod2"
      column
    >
      <bd-field label="Seu e-mail" [error]="erroEmail()" required>
        <input
          bdInput
          type="email"
          placeholder="digite algo sem @"
          [value]="email()"
          (input)="email.set($any($event.target).value)"
        />
      </bd-field>
    </docs-demo>

    <docs-demo title="Textarea e select" [code]="cod3" column>
      <bd-field label="Mensagem" hint="Mínimo de 20 caracteres">
        <textarea bdInput rows="3" placeholder="Conte sobre o projeto…"></textarea>
      </bd-field>

      <bd-field label="Prioridade">
        <select bdInput>
          <option>Baixa</option>
          <option>Média</option>
          <option>Alta</option>
        </select>
      </bd-field>
    </docs-demo>

    <docs-demo
      title="Desabilitado"
      description="O estado vem do atributo nativo — o componente só reage a ele."
      [code]="cod4"
      column
    >
      <bd-field label="Campo bloqueado" hint="Não editável neste momento">
        <input bdInput type="text" value="Somente leitura" disabled />
      </bd-field>
    </docs-demo>

    <docs-demo
      title="Com Reactive Forms"
      description="O [bdInput] não intercepta o valor: o elemento nativo continua sendo o controle, então formControlName funciona sem adaptador."
      [code]="cod5"
      column
    >
      <span class="nota">Exemplo de código — veja o painel abaixo.</span>
    </docs-demo>

    <docs-api title="Propriedades de bd-field" [rows]="apiField" />
    <docs-api title="Propriedades de bdInput" [rows]="apiInput" />
  `,
  styles: `
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
    .callout strong {
      color: var(--bd-fg);
    }
    .callout code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }
    .nota {
      color: var(--bd-fg-subtle);
      font-size: 0.88rem;
    }
  `,
})
export class FieldPageComponent {
  readonly email = signal('');

  erroEmail(): string {
    const v = this.email();
    if (!v) return '';
    return v.includes('@') ? '' : 'Digite um e-mail válido para eu conseguir responder.';
  }

  readonly cod1 = `<bd-field label="Seu nome" hint="Como devo te chamar">
  <input bdInput type="text" placeholder="João Pedro" />
</bd-field>`;

  readonly cod2 = `<bd-field label="Seu e-mail" [error]="erroEmail()" required>
  <input bdInput type="email" formControlName="email" />
</bd-field>`;

  readonly cod3 = `<bd-field label="Mensagem">
  <textarea bdInput rows="3"></textarea>
</bd-field>

<bd-field label="Prioridade">
  <select bdInput>
    <option>Baixa</option>
  </select>
</bd-field>`;

  readonly cod4 = `<bd-field label="Campo bloqueado">
  <input bdInput type="text" disabled />
</bd-field>`;

  readonly cod5 = `<form [formGroup]="form">
  <bd-field
    label="Seu e-mail"
    [error]="form.controls.email.touched && form.controls.email.invalid
      ? 'Digite um e-mail válido.'
      : ''"
    required
  >
    <input bdInput type="email" formControlName="email" />
  </bd-field>
</form>`;

  readonly apiField: DocsApiRow[] = [
    { name: 'label', type: 'string', default: "''", description: 'Rótulo visível do campo.' },
    {
      name: 'hint',
      type: 'string',
      default: "''",
      description: 'Texto de apoio. É ocultado quando há erro.',
    },
    {
      name: 'error',
      type: 'string',
      default: "''",
      description: 'Mensagem de erro. Quando presente, pinta o campo e vira role="alert".',
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Mostra o asterisco e anuncia "obrigatório" para leitores de tela.',
    },
  ];

  readonly apiInput: DocsApiRow[] = [
    {
      name: 'id',
      type: 'string',
      default: 'gerado',
      description: 'Informe para fixar o id; do contrário um único é gerado automaticamente.',
    },
  ];
}
