import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BdAlertComponent,
  BdButtonComponent,
  BdCardComponent,
  BdChipComponent,
  BdTourService,
  BdTourStep,
} from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-tour-page',
  standalone: true,
  imports: [
    BdButtonComponent,
    BdCardComponent,
    BdChipComponent,
    BdAlertComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Tour guiado"
      selector="<bd-tour> + BdTourService"
      description="Onboarding passo a passo: destaca um elemento por vez, explica o que ele faz e
        conduz o usuário pela interface. O destaque recorta o elemento real da página — não é uma
        imagem nem um overlay estático."
    />

    <bd-alert tone="info" title="Como funciona">
      O <code>&lt;bd-tour /&gt;</code> é montado uma vez, normalmente no componente raiz. Quem
      controla é o <code>BdTourService</code>: você chama <code>start()</code> passando os passos,
      cada um com o seletor CSS do elemento a destacar.
    </bd-alert>

    <docs-demo
      title="Experimente"
      description="Este tour percorre os elementos abaixo. Navegue com os botões, com as setas ← → ou Enter; Esc pula."
      [code]="cod1"
      column
    >
      <div class="alvos">
        <bd-card id="tour-busca">
          <strong class="t">Busca</strong>
          <p class="d">Primeiro passo do tour.</p>
        </bd-card>

        <bd-card id="tour-filtros">
          <strong class="t">Filtros</strong>
          <div class="row">
            <bd-chip>Ativos</bd-chip>
            <bd-chip tone="neutral">Arquivados</bd-chip>
          </div>
        </bd-card>

        <bd-card id="tour-acoes">
          <strong class="t">Ações</strong>
          <button bdButton size="sm" style="margin-top: 0.6rem">Criar projeto</button>
        </bd-card>
      </div>

      <button bdButton size="lg" (click)="iniciar()">▶ Iniciar o tour</button>
    </docs-demo>

    <docs-demo
      title="Passo sem alvo"
      description="Omita o target para um passo centralizado — útil para abrir e fechar o tour com uma mensagem de boas-vindas."
      [code]="cod2"
    >
      <button bdButton variant="ghost" (click)="iniciarBoasVindas()">Tour com boas-vindas</button>
    </docs-demo>

    <docs-demo
      title="Traduzindo os rótulos"
      description="Passe um segundo argumento para start() com os textos dos botões e o formato do contador."
      [code]="cod3"
    >
      <button bdButton variant="ghost" (click)="iniciarIngles()">Tour em inglês</button>
    </docs-demo>

    <div class="callout">
      <strong>Decisões de acessibilidade.</strong> O balão é um <code>role="dialog"</code> que
      recebe o foco a cada passo, então leitores de tela anunciam o título e o conteúdo. As setas do
      teclado navegam, <kbd>Esc</kbd> pula, e o alvo é rolado para o centro da tela antes de ser
      destacado. Quem tem <code>prefers-reduced-motion</code> ativo não vê as transições de posição.
    </div>

    <h2 class="sec">Posicionamento</h2>
    <p class="p">
      Com <code>placement: 'auto'</code> (o padrão) o balão tenta embaixo, em cima, à direita e à
      esquerda, nessa ordem, e fica no primeiro lado onde couber. Se nenhum couber — alvo muito
      grande ou tela muito pequena — ele centraliza. Você pode forçar um lado, mas o componente
      ainda cai para outro se não houver espaço: a alternativa seria um balão cortado fora da tela.
    </p>

    <docs-api title="Passos (BdTourStep)" [rows]="apiStep" />
    <docs-api title="BdTourService" [rows]="apiService" />
    <docs-api title="Propriedades de bd-tour" [rows]="apiComponent" />
  `,
  styles: `
    .alvos {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      width: 100%;
      margin-bottom: 1.5rem;
    }
    .t {
      display: block;
      margin-bottom: 0.3rem;
      color: var(--bd-fg);
      font-size: 0.95rem;
    }
    .d {
      color: var(--bd-fg-muted);
      font-size: 0.85rem;
    }
    .row {
      display: flex;
      gap: 0.4rem;
      margin-top: 0.6rem;
    }
    bd-alert {
      margin-bottom: 2.5rem;
    }
    .sec {
      margin: 3rem 0 0.75rem;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }
    .p {
      max-width: 68ch;
      color: var(--bd-fg-muted);
      line-height: 1.7;
    }
    .callout {
      margin: 2.5rem 0;
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
    code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }
  `,
})
export class TourPageComponent {
  private readonly tour = inject(BdTourService);

  private readonly passos: BdTourStep[] = [
    {
      target: '#tour-busca',
      title: 'Comece pela busca',
      content: 'Encontre qualquer projeto pelo nome, pelo cliente ou pela tecnologia usada.',
      placement: 'bottom',
    },
    {
      target: '#tour-filtros',
      title: 'Refine o resultado',
      content: 'Combine filtros para ver só o que interessa agora. Eles ficam salvos na sessão.',
    },
    {
      target: '#tour-acoes',
      title: 'E crie o que faltar',
      content: 'Tudo pronto. Este é o último passo — clique em Concluir para começar.',
      nextLabel: 'Entendi!',
    },
  ];

  iniciar() {
    this.tour.start(this.passos);
  }

  iniciarBoasVindas() {
    this.tour.start([
      {
        title: 'Bem-vindo ao painel',
        content: 'Vou te mostrar as três áreas principais em menos de um minuto.',
        nextLabel: 'Vamos lá',
      },
      ...this.passos,
    ]);
  }

  iniciarIngles() {
    this.tour.start(
      [
        {
          target: '#tour-busca',
          title: 'Start with search',
          content: 'Find any project by name, client or technology.',
        },
        {
          target: '#tour-acoes',
          title: 'Then create',
          content: 'That is all you need to get going.',
        },
      ],
      {
        next: 'Next',
        prev: 'Back',
        finish: 'Done',
        skip: 'Skip',
        counter: (atual, total) => `${atual} of ${total}`,
      },
    );
  }

  readonly cod1 = `// app.component.html — monte uma vez
<router-outlet />
<bd-tour />

// em qualquer componente
private readonly tour = inject(BdTourService);

iniciar() {
  this.tour.start([
    {
      target: '#busca',
      title: 'Comece pela busca',
      content: 'Encontre qualquer projeto pelo nome.',
      placement: 'bottom',
    },
    {
      target: '#filtros',
      title: 'Refine o resultado',
      content: 'Combine filtros para ver só o que interessa.',
    },
  ]);
}`;

  readonly cod2 = `this.tour.start([
  {
    // sem target: passo centralizado
    title: 'Bem-vindo ao painel',
    content: 'Vou te mostrar as três áreas principais.',
    nextLabel: 'Vamos lá',
  },
  ...outrosPassos,
]);`;

  readonly cod3 = `this.tour.start(passos, {
  next: 'Next',
  prev: 'Back',
  finish: 'Done',
  skip: 'Skip',
  counter: (atual, total) => \`\${atual} of \${total}\`,
});`;

  readonly apiStep: DocsApiRow[] = [
    {
      name: 'target',
      type: 'string',
      default: '—',
      description: 'Seletor CSS do elemento a destacar. Sem ele, o passo é centralizado.',
    },
    { name: 'title', type: 'string', description: 'Título do passo.' },
    { name: 'content', type: 'string', description: 'Texto explicativo do passo.' },
    {
      name: 'placement',
      type: "'top' | 'bottom' | 'left' | 'right' | 'auto'",
      default: "'auto'",
      description: 'Lado preferido do balão. Cai para outro se não houver espaço.',
    },
    {
      name: 'nextLabel',
      type: 'string',
      default: '—',
      description: 'Sobrescreve o rótulo do botão de avanço neste passo.',
    },
  ];

  readonly apiService: DocsApiRow[] = [
    {
      name: 'start(steps, labels?)',
      type: 'void',
      description: 'Inicia o tour. O segundo argumento traduz os rótulos.',
    },
    { name: 'next()', type: 'void', description: 'Avança; no último passo, conclui.' },
    { name: 'prev()', type: 'void', description: 'Volta um passo.' },
    { name: 'goTo(index)', type: 'void', description: 'Salta direto para um passo.' },
    { name: 'finish()', type: 'void', description: 'Encerra marcando como concluído.' },
    { name: 'skip()', type: 'void', description: 'Encerra sem concluir.' },
    { name: 'ativo', type: 'Signal<boolean>', description: 'Se o tour está em andamento.' },
    { name: 'index', type: 'Signal<number>', description: 'Índice do passo atual.' },
    { name: 'step', type: 'Signal<BdTourStep | null>', description: 'O passo atual.' },
    {
      name: 'fim',
      type: 'Signal<{ concluido: boolean } | null>',
      description: 'Preenchido ao encerrar — diz se o usuário chegou ao fim ou pulou.',
    },
  ];

  readonly apiComponent: DocsApiRow[] = [
    {
      name: 'spotPadding',
      type: 'number',
      default: '8',
      description: 'Espaço extra em volta do elemento destacado, em pixels.',
    },
    {
      name: 'scrollIntoView',
      type: 'boolean',
      default: 'true',
      description: 'Rola o alvo para o centro da tela antes de destacar.',
    },
  ];
}
