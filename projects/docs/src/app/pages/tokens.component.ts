import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  inject,
  signal,
} from '@angular/core';
import { BdButtonComponent, BdCardComponent, BdChipComponent } from 'bandeira-ui';

interface TokenInfo {
  token: string;
  descricao: string;
}

@Component({
  selector: 'docs-tokens',
  standalone: true,
  imports: [BdButtonComponent, BdCardComponent, BdChipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Tokens e temas</h1>
      <p>
        Nenhum componente tem cor fixa. Tudo lê CSS custom properties — mudar a identidade visual é
        editar um bloco de CSS, não caçar sobrescrita componente por componente.
      </p>
    </header>

    <!-- ------------------------------------------------------- playground -->
    <section class="playground">
      <div class="playground__controls">
        <h2>Playground</h2>
        <p>Mexa nos controles e veja os componentes reagirem em tempo real.</p>

        <label>
          Cor primária
          <span class="ctrl">
            <input
              type="color"
              [value]="primaria()"
              (input)="primaria.set($any($event.target).value)"
            />
            <code>{{ primaria() }}</code>
          </span>
        </label>

        <label>
          Cor de destaque
          <span class="ctrl">
            <input
              type="color"
              [value]="destaque()"
              (input)="destaque.set($any($event.target).value)"
            />
            <code>{{ destaque() }}</code>
          </span>
        </label>

        <label>
          Raio da borda
          <span class="ctrl">
            <input
              type="range"
              min="0"
              max="24"
              [value]="raio()"
              (input)="raio.set(+$any($event.target).value)"
            />
            <code>{{ raio() }}px</code>
          </span>
        </label>

        <button type="button" class="reset" (click)="resetar()">Restaurar padrão</button>
      </div>

      <div class="playground__preview">
        <bd-card>
          <h3>Cartão de exemplo</h3>
          <p class="muted">Tudo aqui reage aos tokens ao lado.</p>
          <div class="row">
            <bd-chip>Angular</bd-chip>
            <bd-chip tone="accent">avançado</bd-chip>
          </div>
          <div class="row">
            <button bdButton>Primary</button>
            <button bdButton variant="ghost">Ghost</button>
            <button bdButton variant="subtle">Subtle</button>
          </div>
        </bd-card>

        <p class="playground__code">O que o playground faz é só isto:</p>
        <pre><code>:root &#123;
  --bd-primary: {{ primaria() }};
  --bd-accent: {{ destaque() }};
  --bd-radius-sm: {{ raio() }}px;
&#125;</code></pre>
      </div>
    </section>

    <!-- ------------------------------------------------------------ grupos -->
    @for (grupo of grupos; track grupo.titulo) {
      <section>
        <h2>{{ grupo.titulo }}</h2>
        <p class="section-desc">{{ grupo.descricao }}</p>

        @if (grupo.tipo === 'cor') {
          <div class="swatches">
            @for (t of grupo.tokens; track t.token) {
              <div class="swatch">
                <span class="swatch__chip" [style.background]="'var(' + t.token + ')'"></span>
                <code>{{ t.token }}</code>
                <span class="swatch__desc">{{ t.descricao }}</span>
              </div>
            }
          </div>
        } @else {
          <div class="tokens">
            @for (t of grupo.tokens; track t.token) {
              <div class="token">
                <code>{{ t.token }}</code>
                <span>{{ t.descricao }}</span>
              </div>
            }
          </div>
        }
      </section>
    }

    <section>
      <h2>Tema escuro</h2>
      <p class="section-desc">
        O tema escuro redefine os mesmos tokens sob <code>[data-theme="dark"]</code>. Sem atributo
        nenhum, a biblioteca segue o <code>prefers-color-scheme</code> do sistema.
      </p>
      <pre><code>&lt;html data-theme="dark"&gt;   &lt;!-- força escuro --&gt;
&lt;html data-theme="light"&gt;  &lt;!-- força claro  --&gt;
&lt;html&gt;                     &lt;!-- segue o sistema --&gt;</code></pre>
    </section>
  `,
  styles: `
    :host {
      display: block;
      max-width: 860px;
    }

    .page-head {
      padding-bottom: 2rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--bd-border);
    }

    .page-head h1 {
      font-size: clamp(2rem, 4vw, 2.6rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--bd-fg);
    }

    .page-head p {
      max-width: 62ch;
      margin-top: 0.6rem;
      color: var(--bd-fg-muted);
      line-height: 1.7;
    }

    section {
      margin-bottom: 3rem;
    }

    h2 {
      margin-bottom: 0.6rem;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }

    .section-desc {
      max-width: 62ch;
      margin-bottom: 1.5rem;
      color: var(--bd-fg-muted);
      line-height: 1.7;
    }

    /* --------------------------------------------------------- playground */

    .playground {
      display: grid;
      grid-template-columns: 260px minmax(0, 1fr);
      gap: 2rem;
      margin-bottom: 3.5rem;
      padding: 1.75rem;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
    }

    .playground h2 {
      margin-bottom: 0.35rem;
    }

    .playground__controls p {
      margin-bottom: 1.5rem;
      color: var(--bd-fg-muted);
      font-size: 0.88rem;
      line-height: 1.6;
    }

    .playground__controls label {
      display: block;
      margin-bottom: 1.15rem;
      color: var(--bd-fg-muted);
      font-size: 0.82rem;
      font-weight: 600;
    }

    .ctrl {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-top: 0.4rem;
    }

    .ctrl input[type='color'] {
      width: 44px;
      height: 32px;
      padding: 0;
      background: none;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
      cursor: pointer;
    }

    .ctrl input[type='range'] {
      flex: 1;
      min-width: 0;
      accent-color: var(--bd-primary);
    }

    .ctrl code {
      color: var(--bd-fg-subtle);
      font-size: 0.74rem;
    }

    .reset {
      padding: 0.4rem 0.8rem;
      background: transparent;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
      color: var(--bd-fg-muted);
      font-family: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .reset:hover {
      color: var(--bd-primary);
      border-color: var(--bd-primary);
    }

    .playground__preview h3 {
      margin-bottom: 0.3rem;
      font-size: 1rem;
      font-weight: 650;
      color: var(--bd-fg);
    }

    .muted {
      color: var(--bd-fg-muted);
      font-size: 0.88rem;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: 1rem;
    }

    .playground__code {
      margin: 1.25rem 0 0.5rem;
      color: var(--bd-fg-subtle);
      font-size: 0.82rem;
    }

    /* ------------------------------------------------------------ tokens */

    .swatches {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 0.85rem;
    }

    .swatch {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      padding: 0.85rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .swatch__chip {
      height: 42px;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
    }

    .swatch code {
      color: var(--bd-primary);
      font-size: 0.74rem;
    }

    .swatch__desc {
      color: var(--bd-fg-subtle);
      font-size: 0.74rem;
    }

    .tokens {
      display: grid;
      gap: 0.35rem;
    }

    .token {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.6rem 0.9rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
    }

    .token span {
      color: var(--bd-fg-subtle);
      font-size: 0.82rem;
      text-align: right;
    }

    pre {
      padding: 1.1rem 1.3rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
      overflow-x: auto;
    }

    pre code {
      font-family: var(--bd-font-mono);
      font-size: 0.83rem;
      line-height: 1.7;
      color: var(--bd-fg-muted);
      white-space: pre;
    }

    code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }

    @media (max-width: 800px) {
      .playground {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class TokensComponent {
  private readonly document = inject(DOCUMENT);

  readonly primaria = signal('#6d8cff');
  readonly destaque = signal('#4fd8c4');
  readonly raio = signal(8);

  constructor() {
    // Escreve direto no <html>: é exatamente o que um consumidor faria no :root.
    effect(() => {
      const root = this.document.documentElement;
      root.style.setProperty('--bd-primary', this.primaria());
      root.style.setProperty('--bd-primary-strong', this.primaria());
      root.style.setProperty('--bd-accent', this.destaque());
      root.style.setProperty('--bd-radius-sm', `${this.raio()}px`);
      root.style.setProperty('--bd-radius', `${this.raio() * 1.5}px`);
    });
  }

  resetar() {
    const root = this.document.documentElement;
    for (const p of [
      '--bd-primary',
      '--bd-primary-strong',
      '--bd-accent',
      '--bd-radius-sm',
      '--bd-radius',
    ]) {
      root.style.removeProperty(p);
    }
    this.primaria.set('#6d8cff');
    this.destaque.set('#4fd8c4');
    this.raio.set(8);
  }

  readonly grupos: {
    titulo: string;
    descricao: string;
    tipo: 'cor' | 'valor';
    tokens: TokenInfo[];
  }[] = [
    {
      titulo: 'Cores de superfície',
      descricao: 'Os planos de fundo e as bordas que estruturam a interface.',
      tipo: 'cor',
      tokens: [
        { token: '--bd-bg', descricao: 'Fundo da página' },
        { token: '--bd-bg-elevated', descricao: 'Fundo elevado' },
        { token: '--bd-surface', descricao: 'Cartões e painéis' },
        { token: '--bd-surface-hover', descricao: 'Superfície em hover' },
        { token: '--bd-border', descricao: 'Borda padrão' },
        { token: '--bd-border-strong', descricao: 'Borda de destaque' },
      ],
    },
    {
      titulo: 'Cores de texto',
      descricao: 'Três níveis de hierarquia — use o mais fraco para informação secundária.',
      tipo: 'cor',
      tokens: [
        { token: '--bd-fg', descricao: 'Texto principal' },
        { token: '--bd-fg-muted', descricao: 'Texto de apoio' },
        { token: '--bd-fg-subtle', descricao: 'Texto discreto' },
      ],
    },
    {
      titulo: 'Cores semânticas',
      descricao: 'Cada uma tem a variante "soft" para fundos suaves do mesmo tom.',
      tipo: 'cor',
      tokens: [
        { token: '--bd-primary', descricao: 'Ação principal' },
        { token: '--bd-accent', descricao: 'Destaque' },
        { token: '--bd-success', descricao: 'Sucesso' },
        { token: '--bd-warning', descricao: 'Atenção' },
        { token: '--bd-danger', descricao: 'Erro e ação destrutiva' },
        { token: '--bd-info', descricao: 'Informação' },
      ],
    },
    {
      titulo: 'Tipografia',
      descricao: 'Escala de tamanhos e pesos usada por todos os componentes.',
      tipo: 'valor',
      tokens: [
        { token: '--bd-font-sans', descricao: 'Inter, system-ui' },
        { token: '--bd-font-mono', descricao: 'ui-monospace' },
        { token: '--bd-text-xs → --bd-text-3xl', descricao: '0.75rem → 2.25rem' },
        { token: '--bd-weight-normal → bold', descricao: '400 → 700' },
      ],
    },
    {
      titulo: 'Espaçamento, forma e elevação',
      descricao: 'Escala de espaço, raios e sombras.',
      tipo: 'valor',
      tokens: [
        { token: '--bd-space-1 → --bd-space-7', descricao: '0.25rem → 3rem' },
        {
          token: '--bd-radius-sm / --bd-radius / --bd-radius-lg',
          descricao: '0.5 / 0.875 / 1.25rem',
        },
        { token: '--bd-radius-full', descricao: '9999px (pílulas e avatares)' },
        { token: '--bd-shadow-sm / md / lg', descricao: 'Repouso, hover e sobreposição' },
      ],
    },
    {
      titulo: 'Movimento e camadas',
      descricao: 'Durações, curva de easing e ordem de empilhamento.',
      tipo: 'valor',
      tokens: [
        { token: '--bd-ease', descricao: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        {
          token: '--bd-duration-fast / --bd-duration / --bd-duration-slow',
          descricao: '0.15s / 0.25s / 0.5s',
        },
        { token: '--bd-z-dropdown → --bd-z-tooltip', descricao: '100 → 400' },
        { token: '--bd-focus-ring', descricao: 'Anel de foco compartilhado' },
      ],
    },
  ];
}
