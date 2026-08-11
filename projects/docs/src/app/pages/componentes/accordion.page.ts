import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdAccordionComponent, BdAccordionItem } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-accordion-page',
  standalone: true,
  imports: [BdAccordionComponent, DocsDemoComponent, DocsApiComponent, DocsPageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Accordion"
      selector="<bd-accordion>"
      description="Lista de seções expansíveis. Use para conteúdo secundário que nem todo mundo
        precisa ler — perguntas frequentes, configurações avançadas, detalhes técnicos."
    />

    <div class="callout">
      <strong>Cuidado com o que você esconde.</strong> Conteúdo dentro de um accordion fechado não é
      lido por quem passa os olhos na página, e é ignorado pelo Ctrl+F do navegador. Se a informação
      é importante para a decisão do usuário, ela não deveria estar aqui.
    </div>

    <docs-demo
      title="Uma seção por vez"
      description="Comportamento padrão: abrir uma fecha a anterior. Navegue por Tab e abra com Enter ou Espaço."
      [code]="cod1"
      column
    >
      <bd-accordion [items]="perguntas" [(opened)]="abertas" />
    </docs-demo>

    <docs-demo
      title="Várias abertas"
      description="Com multiple, cada seção é independente."
      [code]="cod2"
      column
    >
      <bd-accordion [items]="perguntas" [(opened)]="abertasMultiplas" multiple />
    </docs-demo>

    <docs-demo
      title="Seção desabilitada"
      description="Não recebe clique nem foco."
      [code]="cod3"
      column
    >
      <bd-accordion [items]="comDesabilitada" [(opened)]="abertasDesab" />
    </docs-demo>

    <div class="callout callout--accent">
      <strong>Estrutura acessível.</strong> Cada cabeçalho é um <code>&lt;button&gt;</code> dentro
      de um <code>&lt;h3&gt;</code>, com <code>aria-expanded</code> e
      <code>aria-controls</code> ligados ao painel, que por sua vez é um
      <code>role="region"</code> rotulado pelo botão. É essa estrutura que permite navegar por
      seções num leitor de tela — um <code>&lt;div&gt;</code> clicável não faz isso.
    </div>

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
    .callout--accent {
      margin-top: 2.5rem;
      background: var(--bd-accent-soft);
      border-left-color: var(--bd-accent);
    }
    .callout strong {
      color: var(--bd-fg);
    }
    code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }
  `,
})
export class AccordionPageComponent {
  readonly abertas = signal<string[]>(['instalar']);
  readonly abertasMultiplas = signal<string[]>(['instalar', 'tema']);
  readonly abertasDesab = signal<string[]>([]);

  readonly perguntas: BdAccordionItem[] = [
    {
      id: 'instalar',
      title: 'Como instalo a biblioteca?',
      content:
        'Rode npm install bandeira-ui @angular/cdk e importe os tokens no seu styles.scss com @use "bandeira-ui/styles". Os componentes são standalone, então basta importar o que a tela usa.',
    },
    {
      id: 'tema',
      title: 'Como customizo as cores?',
      content:
        'Redefina qualquer token no seu :root — por exemplo --bd-primary. Não é preciso recompilar a biblioteca nem sobrescrever classe: todos os componentes leem a variável em tempo de execução.',
    },
    {
      id: 'ssr',
      title: 'Funciona com SSR?',
      content:
        'Sim. As diretivas que dependem do browser rodam dentro de afterNextRender, que só executa no cliente — nada quebra na renderização do servidor.',
    },
  ];

  readonly comDesabilitada: BdAccordionItem[] = [
    ...this.perguntas.slice(0, 2),
    {
      id: 'enterprise',
      title: 'Suporte comercial (em breve)',
      content: 'Ainda não disponível.',
      disabled: true,
    },
  ];

  readonly cod1 = `<bd-accordion [items]="perguntas" [(opened)]="abertas" />

// no componente
readonly abertas = signal<string[]>(['instalar']);
readonly perguntas: BdAccordionItem[] = [
  { id: 'instalar', title: 'Como instalo?', content: '…' },
];`;

  readonly cod2 = `<bd-accordion [items]="perguntas" [(opened)]="abertas" multiple />`;

  readonly cod3 = `{ id: 'enterprise', title: 'Em breve', content: '…', disabled: true }`;

  readonly api: DocsApiRow[] = [
    {
      name: 'items',
      type: 'BdAccordionItem[]',
      description: 'Seções: id, title, content e disabled.',
    },
    {
      name: 'opened',
      type: 'string[]',
      default: '[]',
      description: 'Ids das seções abertas. Two-way: [(opened)]="abertas".',
    },
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'Permite mais de uma seção aberta ao mesmo tempo.',
    },
    {
      name: '(toggled)',
      type: 'EventEmitter<{ id, open }>',
      description: 'Emitido ao abrir ou fechar uma seção.',
    },
  ];
}
