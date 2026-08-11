import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  BdAlertComponent,
  BdButtonComponent,
  BdCardComponent,
  BdProgressComponent,
  BdSkeletonComponent,
  BdSpinnerComponent,
} from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-feedback-page',
  standalone: true,
  imports: [
    BdAlertComponent,
    BdSpinnerComponent,
    BdSkeletonComponent,
    BdProgressComponent,
    BdCardComponent,
    BdButtonComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Feedback"
      selector="Alert · Spinner · Skeleton · Progress"
      description="Os quatro jeitos de dizer ao usuário o que está acontecendo. A escolha entre
        eles não é estética: cada um comunica uma coisa diferente sobre tempo e certeza."
    />

    <div class="guia">
      <div><strong>Alert</strong><span>Mensagem que fica até alguém agir.</span></div>
      <div><strong>Spinner</strong><span>Espera sem fim previsto.</span></div>
      <div><strong>Skeleton</strong><span>Espera com formato já conhecido.</span></div>
      <div><strong>Progress</strong><span>Espera com fim mensurável.</span></div>
    </div>

    <!-- ---------------------------------------------------------- Alert -->
    <h2 class="sec">Alert</h2>

    <docs-demo
      title="Tons"
      description="Erro e aviso recebem role='alert' — o leitor de tela interrompe e anuncia. Info e sucesso usam role='status', que espera a vez."
      [code]="codAlert"
      column
    >
      <bd-alert tone="info" title="Nova versão disponível">
        A versão 2.1 traz melhorias de performance no relatório mensal.
      </bd-alert>
      <bd-alert tone="success" title="Salvo">Suas alterações foram publicadas.</bd-alert>
      <bd-alert tone="warning" title="Plano expirando">
        Sua assinatura vence em 3 dias. Renove para não perder acesso.
      </bd-alert>
      <bd-alert tone="danger" title="Falha ao salvar">
        Verifique sua conexão e tente novamente.
      </bd-alert>
    </docs-demo>

    <docs-demo title="Dispensável" [code]="codAlertClose" column>
      @if (alertaVisivel()) {
        <bd-alert tone="info" dismissible (dismissed)="alertaVisivel.set(false)">
          Clique no × para fechar este aviso.
        </bd-alert>
      } @else {
        <button bdButton variant="ghost" size="sm" (click)="alertaVisivel.set(true)">
          Mostrar de novo
        </button>
      }
    </docs-demo>

    <docs-api title="Propriedades de bd-alert" [rows]="apiAlert" />

    <!-- -------------------------------------------------------- Spinner -->
    <h2 class="sec">Spinner</h2>

    <docs-demo
      title="Tamanhos"
      description="Sempre traz um rótulo para leitores de tela — um spinner mudo deixa quem não enxerga sem saber que algo está acontecendo."
      [code]="codSpinner"
    >
      <bd-spinner size="sm" />
      <bd-spinner size="md" />
      <bd-spinner size="lg" label="Carregando projetos" />
    </docs-demo>

    <docs-api title="Propriedades de bd-spinner" [rows]="apiSpinner" />

    <!-- ------------------------------------------------------- Skeleton -->
    <h2 class="sec">Skeleton</h2>

    <docs-demo
      title="Variantes"
      description="Prefira skeleton a spinner quando você já sabe o formato do que vem: a página não salta na troca e a espera parece mais curta."
      [code]="codSkeleton"
      column
    >
      <bd-card>
        <div class="perfil">
          <bd-skeleton variant="circle" width="48px" height="48px" />
          <div class="perfil__texto">
            <bd-skeleton variant="title" />
            <bd-skeleton variant="text" width="70%" />
          </div>
        </div>
        <bd-skeleton variant="rect" />
      </bd-card>
    </docs-demo>

    <docs-api title="Propriedades de bd-skeleton" [rows]="apiSkeleton" />

    <!-- ------------------------------------------------------- Progress -->
    <h2 class="sec">Progress</h2>

    <docs-demo
      title="Barra determinada"
      description="Expõe role='progressbar' com os valores ARIA corretos. Para carregamento sem fim conhecido use o spinner — uma barra que não avança confunde mais do que informa."
      [code]="codProgress"
      column
    >
      <bd-progress [value]="progresso()" label="Enviando arquivos" showValue />
      <bd-progress [value]="45" tone="accent" />
      <bd-progress [value]="3" [max]="5" tone="success" label="Etapas concluídas" showValue />
      <bd-progress [value]="88" tone="warning" label="Uso do plano" showValue />

      <div class="acoes">
        <button bdButton size="sm" variant="ghost" (click)="mover(-15)">− 15%</button>
        <button bdButton size="sm" variant="ghost" (click)="mover(15)">+ 15%</button>
      </div>
    </docs-demo>

    <docs-api title="Propriedades de bd-progress" [rows]="apiProgress" />
  `,
  styles: `
    .guia {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 0.85rem;
      margin-bottom: 3rem;
    }
    .guia div {
      padding: 0.9rem 1.1rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }
    .guia strong {
      display: block;
      margin-bottom: 0.2rem;
      color: var(--bd-primary);
      font-size: 0.9rem;
    }
    .guia span {
      color: var(--bd-fg-muted);
      font-size: 0.82rem;
      line-height: 1.5;
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
    .perfil {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }
    .perfil__texto {
      flex: 1;
    }
    .acoes {
      display: flex;
      gap: 0.5rem;
    }
  `,
})
export class FeedbackPageComponent {
  readonly alertaVisivel = signal(true);
  readonly progresso = signal(35);

  mover(delta: number) {
    this.progresso.update((v) => Math.min(100, Math.max(0, v + delta)));
  }

  readonly codAlert = `<bd-alert tone="warning" title="Plano expirando">
  Sua assinatura vence em 3 dias.
</bd-alert>`;

  readonly codAlertClose = `<bd-alert tone="info" dismissible (dismissed)="esconder()">
  Clique no × para fechar.
</bd-alert>`;

  readonly codSpinner = `<bd-spinner />
<bd-spinner size="lg" label="Carregando projetos" />`;

  readonly codSkeleton = `<div class="perfil">
  <bd-skeleton variant="circle" width="48px" height="48px" />
  <div>
    <bd-skeleton variant="title" />
    <bd-skeleton variant="text" width="70%" />
  </div>
</div>
<bd-skeleton variant="rect" />`;

  readonly codProgress = `<bd-progress [value]="65" label="Enviando arquivos" showValue />
<bd-progress [value]="3" [max]="5" tone="success" />`;

  readonly apiAlert: DocsApiRow[] = [
    {
      name: 'tone',
      type: "'info' | 'success' | 'warning' | 'danger'",
      default: "'info'",
      description:
        'Define a cor e o papel ARIA (alert para warning/danger, status para os demais).',
    },
    { name: 'title', type: 'string', default: "''", description: 'Título em negrito.' },
    {
      name: 'dismissible',
      type: 'boolean',
      default: 'false',
      description: 'Mostra o botão de fechar.',
    },
    {
      name: '(dismissed)',
      type: 'EventEmitter<void>',
      description: 'Emitido ao fechar. O componente não se esconde sozinho — quem controla é você.',
    },
  ];

  readonly apiSpinner: DocsApiRow[] = [
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Diâmetro do anel.' },
    {
      name: 'label',
      type: 'string',
      default: "'Carregando'",
      description: 'Texto anunciado por leitores de tela.',
    },
  ];

  readonly apiSkeleton: DocsApiRow[] = [
    {
      name: 'variant',
      type: "'text' | 'title' | 'circle' | 'rect'",
      default: "'text'",
      description: 'Formato do placeholder.',
    },
    { name: 'width', type: 'string', default: '—', description: 'Sobrescreve a largura padrão.' },
    { name: 'height', type: 'string', default: '—', description: 'Sobrescreve a altura padrão.' },
  ];

  readonly apiProgress: DocsApiRow[] = [
    { name: 'value', type: 'number', description: 'Valor atual. Obrigatório.' },
    { name: 'max', type: 'number', default: '100', description: 'Valor que representa 100%.' },
    {
      name: 'tone',
      type: "'primary' | 'accent' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Cor da barra.',
    },
    { name: 'label', type: 'string', default: "''", description: 'Rótulo acima da barra.' },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Mostra a porcentagem ao lado do rótulo.',
    },
  ];
}
