import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Cabeçalho padrão das páginas de componente. */
@Component({
  selector: 'docs-page-head',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <div class="head__top">
        <h1>{{ title() }}</h1>
        @if (selector()) {
          <code class="head__selector">{{ selector() }}</code>
        }
      </div>
      @if (description()) {
        <p>{{ description() }}</p>
      }
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .head {
      padding-bottom: 1.75rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--bd-border);
    }

    .head__top {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.85rem;
    }

    h1 {
      font-size: clamp(1.9rem, 4vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--bd-fg);
    }

    .head__selector {
      padding: 0.25rem 0.65rem;
      background: var(--bd-primary-soft);
      border-radius: var(--bd-radius-full);
      color: var(--bd-primary);
      font-family: var(--bd-font-mono);
      font-size: 0.78rem;
      font-weight: 600;
    }

    p {
      max-width: 68ch;
      margin-top: 0.85rem;
      color: var(--bd-fg-muted);
      font-size: 1.02rem;
      line-height: 1.7;
    }
  `,
})
export class DocsPageHeadComponent {
  readonly title = input.required<string>();
  readonly selector = input('');
  readonly description = input('');
}
