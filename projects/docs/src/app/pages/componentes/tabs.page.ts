import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdCardComponent, BdTab, BdTabPanelComponent, BdTabsComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-tabs-page',
  standalone: true,
  imports: [
    BdTabsComponent,
    BdTabPanelComponent,
    BdCardComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Tabs"
      selector="<bd-tabs> + <bd-tab-panel>"
      description="Navegação por abas seguindo o padrão WAI-ARIA de tablist. Use os dois
        componentes juntos: o bd-tabs cuida da lista e do teclado, o bd-tab-panel cuida do
        conteúdo e fecha o par que os leitores de tela esperam."
    />

    <div class="callout">
      <strong>Teste pelo teclado.</strong> Dê Tab até uma aba e use ← → para navegar,
      <kbd>Home</kbd> e <kbd>End</kbd> para ir às pontas. O foco acompanha a seleção e abas
      desabilitadas são puladas — é o comportamento que o padrão exige e que quase nenhuma
      implementação caseira entrega.
    </div>

    <docs-demo title="Básico" [code]="cod1" column>
      <bd-tabs [tabs]="abas" [(active)]="aba" label="Etapas do processo" />

      <bd-tab-panel tabId="design" [active]="aba()">
        <bd-card>Protótipo no Figma validado antes de escrever código.</bd-card>
      </bd-tab-panel>
      <bd-tab-panel tabId="code" [active]="aba()">
        <bd-card>Componentes standalone com OnPush e signals.</bd-card>
      </bd-tab-panel>
      <bd-tab-panel tabId="tests" [active]="aba()">
        <bd-card>Cypress cobrindo os fluxos críticos.</bd-card>
      </bd-tab-panel>
    </docs-demo>

    <docs-demo
      title="Com ícones e aba desabilitada"
      description="A aba desabilitada não recebe clique nem foco, e as setas do teclado pulam por cima dela."
      [code]="cod2"
      column
    >
      <bd-tabs [tabs]="abasIcone" [(active)]="abaIcone" label="Recursos" />

      <bd-tab-panel tabId="visao" [active]="abaIcone()">
        <bd-card>Visão geral do projeto.</bd-card>
      </bd-tab-panel>
      <bd-tab-panel tabId="metricas" [active]="abaIcone()">
        <bd-card>Métricas de uso.</bd-card>
      </bd-tab-panel>
    </docs-demo>

    <docs-api title="Propriedades de bd-tabs" [rows]="apiTabs" />
    <docs-api title="Propriedades de bd-tab-panel" [rows]="apiPanel" />
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
    bd-tab-panel {
      margin-top: 1.25rem;
    }
  `,
})
export class TabsPageComponent {
  readonly aba = signal('design');
  readonly abas: BdTab[] = [
    { id: 'design', label: 'Design' },
    { id: 'code', label: 'Código' },
    { id: 'tests', label: 'Testes' },
  ];

  readonly abaIcone = signal('visao');
  readonly abasIcone: BdTab[] = [
    { id: 'visao', label: 'Visão geral', icon: '' },
    { id: 'metricas', label: 'Métricas' },
    { id: 'billing', label: 'Faturamento', disabled: true },
  ];

  readonly cod1 = `<bd-tabs [tabs]="abas" [(active)]="aba" label="Etapas" />

<bd-tab-panel tabId="design" [active]="aba()">
  Conteúdo da aba de design
</bd-tab-panel>`;

  readonly cod2 = `readonly abas: BdTab[] = [
  { id: 'visao', label: 'Visão geral' },
  { id: 'metricas', label: 'Métricas' },
  { id: 'billing', label: 'Faturamento', disabled: true },
];`;

  readonly apiTabs: DocsApiRow[] = [
    { name: 'tabs', type: 'BdTab[]', description: 'Lista de abas: id, label, icon e disabled.' },
    {
      name: 'active',
      type: 'string',
      description: 'Id da aba ativa. Two-way: [(active)]="minhaAba".',
    },
    {
      name: 'label',
      type: 'string',
      default: "'Abas'",
      description: 'Rótulo acessível do tablist.',
    },
  ];

  readonly apiPanel: DocsApiRow[] = [
    {
      name: 'tabId',
      type: 'string',
      description: 'Deve casar com o id da aba correspondente.',
    },
    { name: 'active', type: 'string', description: 'O id da aba ativa no momento.' },
  ];
}
