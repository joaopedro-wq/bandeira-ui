import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BdAvatarComponent,
  BdBadgeComponent,
  BdButtonComponent,
  BdCardComponent,
  BdEmptyStateComponent,
} from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-conteudo-page',
  standalone: true,
  imports: [
    BdAvatarComponent,
    BdBadgeComponent,
    BdEmptyStateComponent,
    BdButtonComponent,
    BdCardComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Avatar, Badge & Empty State"
      selector="<bd-avatar> · <bd-badge> · <bd-empty-state>"
      description="Peças de conteúdo: identificar pessoas, quantificar ou sinalizar, e explicar a
        ausência de dados."
    />

    <!-- ---------------------------------------------------------- Avatar -->
    <h2 class="sec">Avatar</h2>

    <docs-demo
      title="Com imagem e com iniciais"
      description="Se a imagem falhar, as iniciais entram no lugar — sem ícone quebrado. A cor de fundo é derivada do nome, então a mesma pessoa tem sempre a mesma cor, em qualquer tela do sistema."
      [code]="codAvatar"
    >
      <bd-avatar name="João Pedro Bandeira" size="sm" />
      <bd-avatar name="João Pedro Bandeira" />
      <bd-avatar name="Maria Silva" size="lg" />
      <bd-avatar name="Ana Costa Lima" size="xl" />
      <bd-avatar name="Imagem quebrada" src="/nao-existe.jpg" size="lg" />
    </docs-demo>

    <docs-demo title="Em lista" [code]="codAvatarLista" column>
      <bd-card>
        <div class="pessoa">
          <bd-avatar name="João Pedro Bandeira" />
          <div>
            <strong class="t">João Pedro Bandeira</strong>
            <span class="d">Desenvolvedor Full-stack</span>
          </div>
          <bd-badge tone="success" dot>online</bd-badge>
        </div>
      </bd-card>
    </docs-demo>

    <docs-api title="Propriedades de bd-avatar" [rows]="apiAvatar" />

    <!-- ----------------------------------------------------------- Badge -->
    <h2 class="sec">Badge</h2>

    <docs-demo
      title="Contadores"
      description="Com [value] e [max], números acima do limite viram '99+' — assim o badge não estica e quebra o layout."
      [code]="codBadge"
    >
      <bd-badge>3</bd-badge>
      <bd-badge tone="danger" [value]="12" />
      <bd-badge tone="danger" [value]="128" />
      <bd-badge tone="neutral" [value]="1500" [max]="999" />
    </docs-demo>

    <docs-demo
      title="Status"
      description="Com dot, o badge vira etiqueta de estado: contorno, ponto colorido e texto."
      [code]="codBadgeDot"
    >
      <bd-badge tone="success" dot>online</bd-badge>
      <bd-badge tone="warning" dot>ausente</bd-badge>
      <bd-badge tone="danger" dot>offline</bd-badge>
      <bd-badge tone="neutral" dot>rascunho</bd-badge>
    </docs-demo>

    <docs-api title="Propriedades de bd-badge" [rows]="apiBadge" />

    <!-- ------------------------------------------------------ EmptyState -->
    <h2 class="sec">Empty State</h2>

    <docs-demo
      title="Estado vazio com ação"
      description="Um empty state sem ação é um beco sem saída. Projete-o como convite: explique a ausência e ofereça o próximo passo."
      [code]="codEmpty"
      column
    >
      <bd-empty-state
        icon="📭"
        title="Nenhum projeto ainda"
        description="Crie o primeiro para começar a acompanhar suas entregas e prazos."
      >
        <button bdButton>Criar projeto</button>
        <button bdButton variant="ghost">Importar do GitHub</button>
      </bd-empty-state>
    </docs-demo>

    <docs-demo
      title="Resultado de busca vazio"
      description="Aqui o texto muda de tom: o problema não é falta de dado, é a busca. Ofereça limpar os filtros."
      [code]="codEmptyBusca"
      column
    >
      <bd-empty-state
        icon="🔍"
        title="Nada encontrado para “relatório fiscal”"
        description="Tente outro termo ou remova alguns filtros."
      >
        <button bdButton variant="ghost">Limpar filtros</button>
      </bd-empty-state>
    </docs-demo>

    <docs-api title="Propriedades de bd-empty-state" [rows]="apiEmpty" />
  `,
  styles: `
    .sec {
      margin: 3.5rem 0 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--bd-border);
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--bd-fg);
    }
    .sec:first-of-type {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }
    .pessoa {
      display: flex;
      align-items: center;
      gap: 0.9rem;
    }
    .pessoa > div {
      flex: 1;
    }
    .t {
      display: block;
      color: var(--bd-fg);
      font-size: 0.93rem;
    }
    .d {
      color: var(--bd-fg-muted);
      font-size: 0.83rem;
    }
  `,
})
export class ConteudoPageComponent {
  readonly codAvatar = `<bd-avatar name="João Pedro Bandeira" src="/user.jpg" />
<bd-avatar name="Maria Silva" size="lg" />`;

  readonly codAvatarLista = `<div class="pessoa">
  <bd-avatar name="João Pedro Bandeira" />
  <div>
    <strong>João Pedro Bandeira</strong>
    <span>Desenvolvedor Full-stack</span>
  </div>
  <bd-badge tone="success" dot>online</bd-badge>
</div>`;

  readonly codBadge = `<bd-badge>3</bd-badge>
<bd-badge tone="danger" [value]="128" />
<bd-badge tone="neutral" [value]="1500" [max]="999" />`;

  readonly codBadgeDot = `<bd-badge tone="success" dot>online</bd-badge>
<bd-badge tone="danger" dot>offline</bd-badge>`;

  readonly codEmpty = `<bd-empty-state
  icon="📭"
  title="Nenhum projeto ainda"
  description="Crie o primeiro para começar."
>
  <button bdButton>Criar projeto</button>
</bd-empty-state>`;

  readonly codEmptyBusca = `<bd-empty-state
  icon="🔍"
  title="Nada encontrado"
  description="Tente outro termo ou remova alguns filtros."
>
  <button bdButton variant="ghost">Limpar filtros</button>
</bd-empty-state>`;

  readonly apiAvatar: DocsApiRow[] = [
    {
      name: 'name',
      type: 'string',
      default: "''",
      description: 'Nome completo. Gera as iniciais, a cor e o texto para leitores de tela.',
    },
    {
      name: 'src',
      type: 'string',
      default: "''",
      description: 'URL da imagem. Se falhar, cai para as iniciais.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Diâmetro do avatar.',
    },
  ];

  readonly apiBadge: DocsApiRow[] = [
    {
      name: 'tone',
      type: "'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Cor semântica.',
    },
    {
      name: 'value',
      type: 'number | null',
      default: 'null',
      description: 'Valor numérico. Sem ele, o conteúdo projetado é exibido.',
    },
    {
      name: 'max',
      type: 'number',
      default: '99',
      description: 'Acima deste valor, exibe "max+".',
    },
    {
      name: 'dot',
      type: 'boolean',
      default: 'false',
      description: 'Vira etiqueta de status: contorno com ponto colorido.',
    },
  ];

  readonly apiEmpty: DocsApiRow[] = [
    { name: 'icon', type: 'string', default: "''", description: 'Emoji ou caractere ilustrativo.' },
    { name: 'title', type: 'string', description: 'Título do estado vazio. Obrigatório.' },
    {
      name: 'description',
      type: 'string',
      default: "''",
      description: 'Texto explicativo abaixo do título.',
    },
  ];
}
