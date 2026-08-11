import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BdCardComponent, BdCheckboxComponent, BdSwitchComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-controles-page',
  standalone: true,
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    BdSwitchComponent,
    BdCheckboxComponent,
    BdCardComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Switch & Checkbox"
      selector="<bd-switch> · <bd-checkbox>"
      description="Os dois controles booleanos. A escolha entre eles é sobre quando o efeito
        acontece: o switch age na hora, o checkbox só vale quando o formulário é enviado."
    />

    <div class="guia">
      <div>
        <strong>Switch</strong>
        <span>Efeito imediato. "Ativar notificações" liga agora, sem botão de salvar.</span>
      </div>
      <div>
        <strong>Checkbox</strong>
        <span>Efeito no envio. "Aceito os termos" só conta quando o formulário for enviado.</span>
      </div>
    </div>

    <!-- ---------------------------------------------------------- Switch -->
    <h2 class="sec">Switch</h2>

    <docs-demo title="Básico" [code]="codSwitch" column>
      <bd-switch [(checked)]="notificacoes">Notificações por e-mail</bd-switch>
      <bd-switch [(checked)]="modoFoco">Modo foco</bd-switch>
      <bd-switch disabled>Indisponível no seu plano</bd-switch>

      <p class="estado">
        notificações: <code>{{ notificacoes() }}</code> · foco: <code>{{ modoFoco() }}</code>
      </p>
    </docs-demo>

    <!-- -------------------------------------------------------- Checkbox -->
    <h2 class="sec">Checkbox</h2>

    <docs-demo title="Básico" [code]="codCheckbox" column>
      <bd-checkbox [(checked)]="termos">
        Aceito os termos de uso e a política de privacidade
      </bd-checkbox>
      <bd-checkbox [(checked)]="novidades">Quero receber novidades do produto</bd-checkbox>
      <bd-checkbox disabled>Opção indisponível</bd-checkbox>
    </docs-demo>

    <docs-demo
      title="Indeterminado"
      description="O traço representa seleção parcial de uma lista. Não é um terceiro valor: ao clicar, o controle vira marcado — o mesmo comportamento do checkbox nativo."
      [code]="codIndeterminado"
      column
    >
      <bd-card>
        <bd-checkbox
          [checked]="todosMarcados()"
          [indeterminate]="parcial()"
          (checkedChange)="marcarTodos($event)"
        >
          <strong>Todas as permissões</strong>
        </bd-checkbox>

        <div class="filhos">
          @for (p of permissoes(); track p.id) {
            <bd-checkbox [checked]="p.ativo" (checkedChange)="alternar(p.id, $event)">
              {{ p.nome }}
            </bd-checkbox>
          }
        </div>
      </bd-card>
    </docs-demo>

    <!-- -------------------------------------------------- Reactive Forms -->
    <h2 class="sec">Com Reactive Forms</h2>

    <docs-demo
      title="ControlValueAccessor"
      description="Os dois implementam ControlValueAccessor, então funcionam com formControlName sem adaptador. O setDisabledState também é respeitado — desabilitar o controle no formulário desabilita o componente."
      [code]="codForms"
      column
    >
      <form [formGroup]="form" class="form">
        <bd-switch formControlName="ativo">Perfil público</bd-switch>
        <bd-checkbox formControlName="termos">Aceito os termos</bd-checkbox>

        <p class="estado">
          valor do formulário: <code>{{ form.value | json }}</code>
        </p>
      </form>
    </docs-demo>

    <docs-api title="Propriedades de bd-switch" [rows]="apiSwitch" />
    <docs-api title="Propriedades de bd-checkbox" [rows]="apiCheckbox" />
  `,
  styles: `
    .guia {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.85rem;
      margin-bottom: 3rem;
    }
    .guia div {
      padding: 1rem 1.15rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }
    .guia strong {
      display: block;
      margin-bottom: 0.25rem;
      color: var(--bd-primary);
      font-size: 0.9rem;
    }
    .guia span {
      color: var(--bd-fg-muted);
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .sec {
      margin: 3.5rem 0 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--bd-border);
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }
    .estado {
      margin-top: 0.5rem;
      color: var(--bd-fg-subtle);
      font-size: 0.82rem;
    }
    .estado code {
      font-family: var(--bd-font-mono);
      color: var(--bd-accent);
    }
    .filhos {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin: 0.85rem 0 0 1.9rem;
      padding-left: 1rem;
      border-left: 1px solid var(--bd-border);
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
})
export class ControlesPageComponent {
  readonly notificacoes = signal(true);
  readonly modoFoco = signal(false);
  readonly termos = signal(false);
  readonly novidades = signal(true);

  readonly permissoes = signal([
    { id: 'ler', nome: 'Ler projetos', ativo: true },
    { id: 'escrever', nome: 'Editar projetos', ativo: false },
    { id: 'apagar', nome: 'Excluir projetos', ativo: false },
  ]);

  readonly form = new FormGroup({
    ativo: new FormControl(true),
    termos: new FormControl(false),
  });

  todosMarcados(): boolean {
    return this.permissoes().every((p) => p.ativo);
  }

  parcial(): boolean {
    const ativos = this.permissoes().filter((p) => p.ativo).length;
    return ativos > 0 && ativos < this.permissoes().length;
  }

  marcarTodos(valor: boolean) {
    this.permissoes.update((lista) => lista.map((p) => ({ ...p, ativo: valor })));
  }

  alternar(id: string, valor: boolean) {
    this.permissoes.update((lista) =>
      lista.map((p) => (p.id === id ? { ...p, ativo: valor } : p))
    );
  }

  readonly codSwitch = `<bd-switch [(checked)]="notificacoes">
  Notificações por e-mail
</bd-switch>`;

  readonly codCheckbox = `<bd-checkbox [(checked)]="termos">
  Aceito os termos de uso
</bd-checkbox>`;

  readonly codIndeterminado = `<bd-checkbox
  [checked]="todosMarcados()"
  [indeterminate]="parcial()"
  (checkedChange)="marcarTodos($event)"
>
  Todas as permissões
</bd-checkbox>`;

  readonly codForms = `<form [formGroup]="form">
  <bd-switch formControlName="ativo">Perfil público</bd-switch>
  <bd-checkbox formControlName="termos">Aceito os termos</bd-checkbox>
</form>`;

  readonly apiSwitch: DocsApiRow[] = [
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description: 'Estado do interruptor. Two-way: [(checked)]="ativo".',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Desabilita. O Reactive Forms também controla isto via setDisabledState.',
    },
  ];

  readonly apiCheckbox: DocsApiRow[] = [
    {
      name: 'checked',
      type: 'boolean',
      default: 'false',
      description: 'Estado da caixa. Two-way: [(checked)]="aceito".',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Seleção parcial. Ao clicar, resolve para marcado.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Desabilita. O Reactive Forms também controla isto via setDisabledState.',
    },
  ];
}
