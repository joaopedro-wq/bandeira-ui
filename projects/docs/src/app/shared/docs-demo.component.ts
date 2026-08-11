import { ChangeDetectionStrategy, Component, booleanAttribute, input, signal } from '@angular/core';

/**
 * Bloco de exemplo das páginas de documentação: preview vivo em cima,
 * código copiável embaixo.
 */
@Component({
  selector: 'docs-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (title()) {
      <h3 class="demo__title">{{ title() }}</h3>
    }
    @if (description()) {
      <p class="demo__desc">{{ description() }}</p>
    }

    <div class="demo">
      <div class="demo__preview" [class.demo__preview--column]="column()">
        <ng-content />
      </div>

      @if (code()) {
        <div class="demo__code">
          <button
            type="button"
            class="demo__copy"
            [attr.aria-label]="copiado() ? 'Código copiado' : 'Copiar código'"
            (click)="copiar()"
          >
            {{ copiado() ? '✓ copiado' : 'copiar' }}
          </button>
          <pre><code>{{ code() }}</code></pre>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-bottom: 2.5rem;
    }

    .demo__title {
      margin-bottom: 0.4rem;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--bd-fg);
    }

    .demo__desc {
      margin-bottom: 1rem;
      max-width: 68ch;
      color: var(--bd-fg-muted);
      font-size: 0.93rem;
      line-height: 1.65;
    }

    .demo {
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
      overflow: hidden;
      background: var(--bd-surface);
    }

    .demo__preview {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      padding: 2rem 1.5rem;
      background: var(--bd-bg-elevated);
      /* Xadrez sutil para separar o preview do resto da página. */
      background-image: radial-gradient(var(--bd-border) 1px, transparent 1px);
      background-size: 18px 18px;
    }

    .demo__preview--column {
      flex-direction: column;
      align-items: stretch;
    }

    .demo__code {
      position: relative;
      border-top: 1px solid var(--bd-border);
      background: var(--bd-surface);
    }

    .demo__code pre {
      margin: 0;
      padding: 1.15rem 1.35rem;
      overflow-x: auto;
    }

    .demo__code code {
      font-family: var(--bd-font-mono);
      font-size: 0.84rem;
      line-height: 1.7;
      color: var(--bd-fg-muted);
      white-space: pre;
    }

    .demo__copy {
      position: absolute;
      top: 0.6rem;
      right: 0.6rem;
      z-index: 1;
      padding: 0.3rem 0.7rem;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
      color: var(--bd-fg-subtle);
      font-family: var(--bd-font-mono);
      font-size: 0.72rem;
      cursor: pointer;
      transition: color 0.2s ease, border-color 0.2s ease;
    }

    .demo__copy:hover {
      color: var(--bd-primary);
      border-color: var(--bd-primary);
    }

    .demo__copy:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }
  `,
})
export class DocsDemoComponent {
  readonly title = input('');
  readonly description = input('');
  readonly code = input('');
  /** Empilha o preview em coluna — útil para formulários. */
  readonly column = input(false, { transform: booleanAttribute });

  readonly copiado = signal(false);

  async copiar() {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copiado.set(true);
      setTimeout(() => this.copiado.set(false), 1600);
    } catch {
      /* clipboard bloqueado: o código continua selecionável na tela */
    }
  }
}
