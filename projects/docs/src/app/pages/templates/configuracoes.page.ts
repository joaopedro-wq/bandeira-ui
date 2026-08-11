import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BdButtonComponent,
  BdFieldComponent,
  BdInputComponent,
  BdSettingsSection,
  BdSettingsTemplateComponent,
  BdSwitchComponent,
} from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-template-configuracoes-page',
  standalone: true,
  imports: [
    BdSettingsTemplateComponent,
    BdButtonComponent,
    BdFieldComponent,
    BdInputComponent,
    BdSwitchComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Configurações"
      selector="<bd-settings-template>"
      description="Formulários longos divididos em seções, com a barra de salvar aparecendo só
        quando existe algo a salvar. Uma barra sempre visível vira paisagem; esta avisa de
        verdade que há trabalho pendente."
    />

    <docs-demo
      description="Altere qualquer campo para revelar a barra de salvar. Cada seção da lateral é um
        link de verdade — dá para mandar “configure aqui” para um colega e cair no lugar certo."
      [code]="code"
      column
    >
      <div class="frame">
        <bd-settings-template
          title="Configurações"
          description="Preferências da sua conta e da organização."
          [sections]="secoes"
          [(activeSection)]="secaoAtual"
          [dirty]="alterado()"
        >
          <section id="perfil" class="bloco">
            <h2>Perfil</h2>
            <bd-field label="Nome de exibição" hint="Aparece nos comentários e no histórico.">
              <input bdInput value="Marina Alves" (input)="alterado.set(true)" />
            </bd-field>
            <bd-field label="E-mail">
              <input bdInput type="email" value="marina@empresa.com" (input)="alterado.set(true)" />
            </bd-field>
          </section>

          <section id="notificacoes" class="bloco">
            <h2>Notificações</h2>
            <bd-switch [(checked)]="resumo" (checkedChange)="alterado.set(true)">
              Resumo semanal por e-mail
            </bd-switch>
            <bd-switch [(checked)]="mencoes" (checkedChange)="alterado.set(true)">
              Avisar quando eu for mencionado
            </bd-switch>
          </section>

          <section id="seguranca" class="bloco">
            <h2>Segurança</h2>
            <bd-switch [(checked)]="doisFatores" (checkedChange)="alterado.set(true)">
              Verificação em duas etapas
            </bd-switch>
          </section>

          <button bdButton bdSettingsActions variant="ghost" size="sm" (click)="descartar()">
            Descartar
          </button>
          <button bdButton bdSettingsActions size="sm" (click)="salvar()">Salvar alterações</button>
        </bd-settings-template>
      </div>
    </docs-demo>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Slots de projeção" [rows]="slots" />
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

    .bloco {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--bd-border);
    }

    .bloco:last-of-type {
      border-bottom: none;
    }

    .bloco h2 {
      font-size: 1.02rem;
      font-weight: 700;
      color: var(--bd-fg);
    }
  `,
})
export class TemplateConfiguracoesPageComponent {
  readonly secoes: BdSettingsSection[] = [
    { id: 'perfil', label: 'Perfil', hint: 'Nome e contato' },
    { id: 'notificacoes', label: 'Notificações', hint: 'E-mail e menções' },
    { id: 'seguranca', label: 'Segurança', hint: 'Acesso e sessões' },
  ];

  readonly secaoAtual = signal('perfil');
  readonly alterado = signal(false);

  readonly resumo = signal(true);
  readonly mencoes = signal(true);
  readonly doisFatores = signal(false);

  salvar(): void {
    this.alterado.set(false);
  }

  descartar(): void {
    this.alterado.set(false);
  }

  readonly rows: DocsApiRow[] = [
    { name: 'title', type: 'string', description: 'Título da tela, renderizado como <h1>.' },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Linha de apoio abaixo do título.',
    },
    {
      name: 'sections',
      type: 'BdSettingsSection[]',
      default: '[]',
      description: 'Seções da navegação lateral: id, label e hint opcional.',
    },
    {
      name: 'activeSection',
      type: 'model<string>',
      default: "''",
      description: 'Two-way com o id da seção destacada na navegação.',
    },
    {
      name: 'dirty',
      type: 'boolean',
      default: 'false',
      description: 'Revela a barra de gravação. Ligue ao estado do formulário.',
    },
    {
      name: 'dirtyLabel',
      type: 'string',
      default: "'Você tem alterações não salvas.'",
      description: 'Mensagem exibida na barra de gravação.',
    },
    {
      name: 'navLabel',
      type: 'string',
      default: "'Seções de configuração'",
      description: 'Rótulo acessível da navegação lateral.',
    },
  ];

  readonly slots: DocsApiRow[] = [
    {
      name: '[bdSettingsActions]',
      type: 'slot',
      description: 'Botões da barra de gravação.',
    },
    { name: '(padrão)', type: 'slot', description: 'As seções do formulário.' },
  ];

  readonly code = `<bd-settings-template
  title="Configurações"
  description="Preferências da sua conta e da organização."
  [sections]="secoes"
  [(activeSection)]="secaoAtual"
  [dirty]="formulario.dirty"
>
  <section id="perfil">…</section>
  <section id="notificacoes">…</section>

  <button bdButton bdSettingsActions variant="ghost" (click)="descartar()">Descartar</button>
  <button bdButton bdSettingsActions (click)="salvar()">Salvar alterações</button>
</bd-settings-template>`;
}
