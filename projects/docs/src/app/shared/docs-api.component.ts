import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface DocsApiRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

/** Tabela de API das páginas de componente. */
@Component({
  selector: 'docs-api',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="api__title">{{ title() }}</h3>
    <div class="api__scroll">
      <table class="api">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Padrão</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name) {
            <tr>
              <td><code class="api__name">{{ row.name }}</code></td>
              <td><code class="api__type">{{ row.type }}</code></td>
              <td>
                @if (row.default) {
                  <code>{{ row.default }}</code>
                } @else {
                  <span class="api__dash">—</span>
                }
              </td>
              <td>{{ row.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin: 2.5rem 0;
    }

    .api__title {
      margin-bottom: 0.9rem;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--bd-fg);
    }

    /* Tabela larga rola dentro do próprio container, nunca a página. */
    .api__scroll {
      overflow-x: auto;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .api {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.87rem;
    }

    th {
      padding: 0.7rem 1rem;
      background: var(--bd-bg-elevated);
      border-bottom: 1px solid var(--bd-border);
      color: var(--bd-fg-subtle);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: left;
      white-space: nowrap;
    }

    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--bd-border);
      color: var(--bd-fg-muted);
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: none;
    }

    code {
      font-family: var(--bd-font-mono);
      font-size: 0.82em;
      white-space: nowrap;
    }

    .api__name {
      color: var(--bd-primary);
      font-weight: 600;
    }

    .api__type {
      color: var(--bd-accent);
    }

    .api__dash {
      color: var(--bd-fg-subtle);
    }
  `,
})
export class DocsApiComponent {
  readonly title = input('Propriedades');
  readonly rows = input.required<DocsApiRow[]>();
}
