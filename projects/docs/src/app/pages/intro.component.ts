import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BdButtonComponent, BdCardComponent, BdChipComponent, BdMetricComponent } from 'bandeira-ui';
import { ThemeService } from '../shared/theme.service';

@Component({
  selector: 'docs-intro',
  standalone: true,
  imports: [RouterLink, BdButtonComponent, BdCardComponent, BdChipComponent, BdMetricComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <bd-chip tone="accent">v0.1.0 · Angular 20+</bd-chip>

      <h1>
        Design system que <span class="grad">muda de tema</span><br />
        sem mudar de código.
      </h1>

      <p class="lead">
        Componentes Angular standalone construídos sobre CSS custom properties. Redefina
        <code>--bd-primary</code> no seu <code>:root</code> e o sistema inteiro acompanha — sem
        recompilar, sem <code>!important</code>, sem sobrescrever seletor.
      </p>

      <div class="hero__actions">
        <a bdButton size="lg" routerLink="/instalacao">Começar</a>
        <a bdButton variant="ghost" size="lg" routerLink="/componentes/button">Ver componentes</a>
      </div>

      <button type="button" class="hint" (click)="theme.toggle()">
        <strong>Experimente:</strong> clique aqui para alternar o tema e observe a página inteira —
        nenhum componente abaixo tem cor fixa no código.
      </button>
    </section>

    <section class="pillars">
      <bd-card>
        <span class="pillar__icon" aria-hidden="true">◐</span>
        <h2>Tokens, não classes</h2>
        <p>
          Toda cor, raio, sombra e duração vem de uma custom property. Trocar a identidade visual
          é editar um bloco de CSS — não caçar sobrescrita componente por componente.
        </p>
      </bd-card>

      <bd-card>
        <span class="pillar__icon" aria-hidden="true">⌨</span>
        <h2>Acessível por padrão</h2>
        <p>
          Foco preso no modal, <code>tablist</code> completo por teclado, campos com rótulo e
          descrição ligados sozinhos. Você não precisa lembrar de nada disso — já vem pronto.
        </p>
      </bd-card>

      <bd-card>
        <span class="pillar__icon" aria-hidden="true">⚡</span>
        <h2>Leve de propósito</h2>
        <p>
          Standalone, <code>OnPush</code> e signals. As animações são CSS puro: a biblioteca não
          obriga ninguém a instalar <code>@angular/animations</code> nem a chamar
          <code>provideAnimations()</code>.
        </p>
      </bd-card>
    </section>

    <section class="numbers">
      <bd-metric [value]="23" label="componentes e diretivas" gradient />
      <bd-metric [value]="0" label="dependências além do CDK" gradient />
      <bd-metric [value]="2" label="temas prontos" gradient />
      <bd-metric [value]="100" suffix="%" label="tipado em TypeScript" gradient />
    </section>

    <section class="quick">
      <h2>Em 30 segundos</h2>

      <div class="quick__grid">
        <div>
          <span class="step">1</span>
          <h3>Instale</h3>
          <pre><code>npm install bandeira-ui &#64;angular/cdk</code></pre>
        </div>
        <div>
          <span class="step">2</span>
          <h3>Traga os tokens</h3>
          <pre><code>// styles.scss
&#64;use 'bandeira-ui/styles';</code></pre>
        </div>
        <div>
          <span class="step">3</span>
          <h3>Use</h3>
          <pre><code>&lt;button bdButton&gt;Salvar&lt;/button&gt;</code></pre>
        </div>
      </div>

      <div class="quick__demo">
        <span>Resultado:</span>
        <button bdButton (click)="contar()">
          Salvar{{ cliques() ? ' (' + cliques() + ')' : '' }}
        </button>
      </div>
    </section>

    <section class="cta">
      <h2>Pronto para começar?</h2>
      <p>A instalação completa leva menos de um minuto.</p>
      <a bdButton size="lg" routerLink="/instalacao">Ir para a instalação</a>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    /* ---------------------------------------------------------------- hero */

    .hero {
      padding: 2rem 0 4rem;
      border-bottom: 1px solid var(--bd-border);
    }

    .hero h1 {
      margin: 1.25rem 0 1rem;
      font-size: clamp(2.1rem, 5vw, 3.4rem);
      font-weight: 800;
      line-height: 1.12;
      letter-spacing: -0.035em;
      color: var(--bd-fg);
    }

    .grad {
      background: var(--bd-gradient);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .lead {
      max-width: 60ch;
      color: var(--bd-fg-muted);
      font-size: 1.08rem;
      line-height: 1.7;
    }

    .hero__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 2rem;
    }

    .hint {
      display: block;
      width: 100%;
      max-width: 62ch;
      margin-top: 2rem;
      padding: 0.9rem 1.15rem;
      background: var(--bd-accent-soft);
      border: 1px solid color-mix(in srgb, var(--bd-accent) 35%, transparent);
      border-radius: var(--bd-radius);
      color: var(--bd-accent);
      font-family: inherit;
      font-size: 0.9rem;
      line-height: 1.6;
      text-align: left;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .hint:hover {
      background: color-mix(in srgb, var(--bd-accent) 18%, transparent);
    }
    .hint:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }

    /* ------------------------------------------------------------- pilares */

    .pillars {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      padding: 3.5rem 0;
    }

    .pillar__icon {
      display: grid;
      place-items: center;
      width: 42px;
      height: 42px;
      margin-bottom: 1rem;
      background: var(--bd-primary-soft);
      border-radius: var(--bd-radius-sm);
      color: var(--bd-primary);
      font-size: 1.2rem;
    }

    .pillars h2 {
      margin-bottom: 0.5rem;
      font-size: 1.08rem;
      font-weight: 650;
      color: var(--bd-fg);
    }

    .pillars p {
      color: var(--bd-fg-muted);
      font-size: 0.92rem;
      line-height: 1.65;
    }

    /* ------------------------------------------------------------- números */

    .numbers {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1.5rem;
      padding: 2.5rem;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
    }

    /* --------------------------------------------------------------- quick */

    .quick {
      padding: 4rem 0 2rem;
    }

    .quick h2,
    .cta h2 {
      margin-bottom: 1.75rem;
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }

    .quick__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .step {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      margin-bottom: 0.75rem;
      background: var(--bd-primary);
      border-radius: 50%;
      color: var(--bd-primary-contrast);
      font-size: 0.78rem;
      font-weight: 700;
    }

    .quick h3 {
      margin-bottom: 0.6rem;
      font-size: 0.98rem;
      font-weight: 650;
      color: var(--bd-fg);
    }

    .quick__demo {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1.25rem 1.5rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .quick__demo span {
      color: var(--bd-fg-subtle);
      font-size: 0.85rem;
    }

    /* ----------------------------------------------------------------- cta */

    .cta {
      margin-top: 3rem;
      padding: 3.5rem 2rem;
      text-align: center;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
    }

    .cta p {
      margin: -1rem 0 1.75rem;
      color: var(--bd-fg-muted);
    }

    /* -------------------------------------------------------------- comuns */

    pre {
      padding: 0.85rem 1rem;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
      overflow-x: auto;
    }

    pre code {
      font-family: var(--bd-font-mono);
      font-size: 0.8rem;
      line-height: 1.6;
      color: var(--bd-fg-muted);
      white-space: pre;
    }

    code {
      font-family: var(--bd-font-mono);
      font-size: 0.86em;
      color: var(--bd-primary);
    }
  `,
})
export class IntroComponent {
  readonly theme = inject(ThemeService);
  readonly cliques = signal(0);

  contar() {
    this.cliques.update((c) => c + 1);
  }
}
