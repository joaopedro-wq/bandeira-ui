import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BdButtonComponent } from 'bandeira-ui';

@Component({
  selector: 'docs-instalacao',
  standalone: true,
  imports: [RouterLink, BdButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <h1>Instalação</h1>
      <p>Três passos e menos de um minuto.</p>
    </header>

    <section>
      <h2><span class="n">1</span> Instale o pacote</h2>
      <p>
        O <code>&#64;angular/cdk</code> é peer dependency — a biblioteca usa dele o
        <em>focus trap</em> do modal e o posicionamento de sobreposições.
      </p>
      <pre><code>npm install bandeira-ui &#64;angular/cdk</code></pre>
    </section>

    <section>
      <h2><span class="n">2</span> Traga os tokens</h2>
      <p>
        Sem isto os componentes renderizam com as cores de fallback embutidas — funcionam, mas
        você perde o tema e a customização.
      </p>
      <pre><code>// styles.scss
&#64;use 'bandeira-ui/styles';</code></pre>

      <p>Se preferir controlar o que entra, importe separadamente:</p>
      <pre><code>&#64;use 'bandeira-ui/styles/tokens';      // cores, tipografia, espaçamento
&#64;use 'bandeira-ui/styles/animations';  // classes das diretivas de scroll</code></pre>
    </section>

    <section>
      <h2><span class="n">3</span> Importe e use</h2>
      <p>Todo componente é standalone: importe só o que a tela precisa.</p>
      <!-- Crases escritas como &#38;#96; para não fechar o template literal deste arquivo. -->
      <pre><code>import &#123; BdButtonComponent, BdCardComponent &#125; from 'bandeira-ui';

&#64;Component(&#123;
  standalone: true,
  imports: [BdButtonComponent, BdCardComponent],
  template: &#96;
    &lt;bd-card interactive&gt;
      &lt;button bdButton&gt;Salvar&lt;/button&gt;
    &lt;/bd-card&gt;
  &#96;,
&#125;)
export class MinhaTela &#123;&#125;</code></pre>

      <div class="callout">
        <strong>Atalho para protótipo.</strong> <code>BANDEIRA_UI</code> importa tudo de uma vez.
        Em produção prefira importar só o que usar — assim o tree shaking consegue descartar o
        resto.
        <pre><code>import &#123; BANDEIRA_UI &#125; from 'bandeira-ui';

&#64;Component(&#123; imports: [BANDEIRA_UI] &#125;)</code></pre>
      </div>
    </section>

    <section>
      <h2>Tema escuro</h2>
      <p>
        Coloque <code>data-theme="dark"</code> no elemento raiz. Sem atributo nenhum, a biblioteca
        segue o <code>prefers-color-scheme</code> do sistema operacional.
      </p>
      <pre><code>&lt;html data-theme="dark"&gt;</code></pre>
      <p>
        Para evitar o flash de tema errado no primeiro carregamento, defina o atributo em um script
        síncrono no <code>&lt;head&gt;</code>, antes de o Angular iniciar.
      </p>
    </section>

    <section>
      <h2>Compatibilidade</h2>
      <ul class="compat">
        <li><strong>Angular 20+</strong> — usa signals, <code>input()</code> e a sintaxe <code>&#64;if</code>/<code>&#64;for</code></li>
        <li><strong>SSR</strong> — as diretivas de scroll rodam só no browser, via <code>afterNextRender</code></li>
        <li><strong>Navegadores</strong> — os que suportam CSS custom properties e <code>IntersectionObserver</code></li>
      </ul>
    </section>

    <nav class="next">
      <a bdButton variant="ghost" routerLink="/tokens">Tokens e temas →</a>
      <a bdButton routerLink="/componentes/button">Ver componentes →</a>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      max-width: 780px;
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
      margin-top: 0.5rem;
      color: var(--bd-fg-muted);
      font-size: 1.05rem;
    }

    section {
      margin-bottom: 3rem;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 0.85rem;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }

    .n {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      background: var(--bd-primary);
      border-radius: 50%;
      color: var(--bd-primary-contrast);
      font-size: 0.78rem;
      font-weight: 700;
    }

    p {
      margin-bottom: 1rem;
      color: var(--bd-fg-muted);
      line-height: 1.7;
    }

    pre {
      margin-bottom: 1.25rem;
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

    .callout {
      margin-top: 1.5rem;
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

    .callout pre {
      margin: 0.85rem 0 0;
      background: var(--bd-bg);
    }

    .compat {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .compat li {
      padding-left: 1.15rem;
      position: relative;
      color: var(--bd-fg-muted);
      line-height: 1.65;
    }

    .compat li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.62em;
      width: 5px;
      height: 5px;
      background: var(--bd-accent);
      border-radius: 50%;
    }

    .compat strong {
      color: var(--bd-fg);
    }

    .next {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      padding-top: 2rem;
      border-top: 1px solid var(--bd-border);
    }
  `,
})
export class InstalacaoComponent {}
