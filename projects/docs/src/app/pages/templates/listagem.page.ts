import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  BdButtonComponent,
  BdChipComponent,
  BdEmptyStateComponent,
  BdInputComponent,
  BdListTemplateComponent,
} from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

type Estado = 'preenchido' | 'carregando' | 'vazio';

interface Projeto {
  nome: string;
  responsavel: string;
  status: string;
}

@Component({
  selector: 'docs-template-listagem-page',
  standalone: true,
  imports: [
    BdListTemplateComponent,
    BdButtonComponent,
    BdChipComponent,
    BdInputComponent,
    BdEmptyStateComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Listagem e cadastro"
      selector="<bd-list-template>"
      description="A tela mais repetida de qualquer sistema administrativo — e a que mais diverge
        entre si. Carregando, vazia e preenchida vêm resolvidas aqui, de uma vez: toda listagem da
        sua aplicação passa a se comportar igual, sem ninguém combinar nada."
    />

    <div class="switcher" role="group" aria-label="Estado da demonstração">
      <span class="switcher__label">Estado:</span>
      @for (option of estados; track option) {
        <button
          type="button"
          class="switcher__btn"
          [class.is-active]="estado() === option"
          [attr.aria-pressed]="estado() === option"
          (click)="estado.set(option)"
        >
          {{ option }}
        </button>
      }
    </div>

    <docs-demo
      description="Alterne o estado acima. Repare que o cabeçalho, a busca e o botão de ação nunca
        somem: o usuário continua podendo agir enquanto os resultados carregam."
      [code]="code"
      column
    >
      <div class="frame">
        <bd-list-template
          title="Projetos"
          description="Tudo que está em andamento na sua equipe."
          [loading]="estado() === 'carregando'"
          [empty]="estado() === 'vazio'"
          [placeholderCount]="4"
        >
          <button bdButton bdListActions size="sm">Novo projeto</button>

          <input bdInput bdListSearch type="search" placeholder="Buscar projetos" />

          <bd-chip bdListFilters>Ativos</bd-chip>
          <bd-chip bdListFilters tone="neutral">Arquivados</bd-chip>

          <bd-empty-state
            bdListEmpty
            icon="📁"
            title="Nenhum projeto por aqui"
            description="Crie o primeiro para começar a acompanhar as entregas da equipe."
          >
            <button bdButton size="sm">Criar projeto</button>
          </bd-empty-state>

          <div class="table">
            <table>
              <thead>
                <tr>
                  <th scope="col">Projeto</th>
                  <th scope="col">Responsável</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                @for (projeto of projetos; track projeto.nome) {
                  <tr>
                    <td>{{ projeto.nome }}</td>
                    <td>{{ projeto.responsavel }}</td>
                    <td>{{ projeto.status }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <span bdListFooter>{{ rodape() }}</span>
        </bd-list-template>
      </div>
    </docs-demo>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Slots de projeção" [rows]="slots" />
  `,
  styles: `
    :host {
      display: block;
    }

    .switcher {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .switcher__label {
      margin-right: 0.35rem;
      color: var(--bd-fg-subtle);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .switcher__btn {
      padding: 0.35rem 0.85rem;
      background: transparent;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-full);
      color: var(--bd-fg-muted);
      font-family: inherit;
      font-size: 0.83rem;
      font-weight: 600;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;
    }

    .switcher__btn:hover {
      border-color: var(--bd-primary);
      color: var(--bd-primary);
    }

    .switcher__btn.is-active {
      background: var(--bd-primary-soft);
      border-color: var(--bd-primary);
      color: var(--bd-primary);
    }

    .switcher__btn:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }

    .frame {
      width: 100%;
      padding: 1.5rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .table {
      overflow-x: auto;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }

    th,
    td {
      padding: 0.7rem 0.9rem;
      text-align: left;
    }

    th {
      background: var(--bd-bg-elevated);
      color: var(--bd-fg-subtle);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    tbody tr + tr td {
      border-top: 1px solid var(--bd-border);
    }

    td {
      color: var(--bd-fg-muted);
    }
  `,
})
export class TemplateListagemPageComponent {
  readonly estados: Estado[] = ['preenchido', 'carregando', 'vazio'];
  readonly estado = signal<Estado>('preenchido');

  readonly projetos: Projeto[] = [
    { nome: 'Portal do cidadão', responsavel: 'Marina Alves', status: 'Em andamento' },
    { nome: 'Integração fiscal', responsavel: 'Rafael Lima', status: 'Homologação' },
    { nome: 'App de vistorias', responsavel: 'Juliana Reis', status: 'Em andamento' },
  ];

  readonly rodape = computed(() =>
    this.estado() === 'preenchido' ? `${this.projetos.length} resultados` : '',
  );

  readonly rows: DocsApiRow[] = [
    { name: 'title', type: 'string', description: 'Título da tela, renderizado como <h1>.' },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Linha de apoio abaixo do título.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description:
        'Substitui os resultados por placeholders e marca a região com aria-busy. Tem precedência sobre empty.',
    },
    {
      name: 'empty',
      type: 'boolean',
      default: 'false',
      description: 'Exibe o conteúdo de [bdListEmpty] no lugar dos resultados.',
    },
    {
      name: 'placeholderCount',
      type: 'number',
      default: '5',
      description: 'Quantidade de linhas de placeholder durante o carregamento.',
    },
    {
      name: 'loadingLabel',
      type: 'string',
      default: "'Carregando resultados…'",
      description: 'Texto anunciado por leitores de tela durante o carregamento.',
    },
  ];

  readonly slots: DocsApiRow[] = [
    { name: '[bdListActions]', type: 'slot', description: 'Ações principais do cabeçalho.' },
    {
      name: '[bdListSearch]',
      type: 'slot',
      description: 'Campo de busca da barra de ferramentas.',
    },
    { name: '[bdListFilters]', type: 'slot', description: 'Filtros alinhados à direita da barra.' },
    { name: '[bdListEmpty]', type: 'slot', description: 'Conteúdo exibido quando empty é true.' },
    { name: '[bdListFooter]', type: 'slot', description: 'Rodapé: contagem, paginação.' },
    { name: '(padrão)', type: 'slot', description: 'Os resultados propriamente ditos.' },
  ];

  readonly code = `<bd-list-template
  title="Projetos"
  description="Tudo que está em andamento na sua equipe."
  [loading]="carregando()"
  [empty]="projetos().length === 0"
>
  <button bdButton bdListActions>Novo projeto</button>

  <input bdInput bdListSearch type="search" placeholder="Buscar projetos" />
  <bd-chip bdListFilters>Ativos</bd-chip>

  <bd-empty-state
    bdListEmpty
    icon="📁"
    title="Nenhum projeto por aqui"
    description="Crie o primeiro para começar a acompanhar as entregas."
  >
    <button bdButton>Criar projeto</button>
  </bd-empty-state>

  <table>…</table>

  <span bdListFooter>24 resultados</span>
</bd-list-template>`;
}
