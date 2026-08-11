import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BdRevealDirective } from 'bandeira-ui';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

interface TemplateCard {
  path: string;
  name: string;
  selector: string;
  summary: string;
  bullets: string[];
  /** Miniatura esquemática, desenhada em CSS grid. */
  layout: 'dashboard' | 'list' | 'settings' | 'wizard';
}

/** Galeria de templates: a porta de entrada da seção. */
@Component({
  selector: 'docs-templates-page',
  standalone: true,
  imports: [RouterLink, DocsPageHeadComponent, BdRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Templates"
      description="Telas inteiras, prontas para receber seus dados. A montagem já está resolvida —
        grade responsiva, hierarquia de leitura, estados de carregamento e acessibilidade — e o que
        sobra para você é o que só você sabe: o conteúdo."
    />

    <section class="pitch">
      <p>
        Todo sistema tem as mesmas quatro telas. E, em todo projeto, elas são remontadas do zero:
        onde vai o título, o que aparece enquanto a lista carrega, como a barra lateral se comporta
        no celular, em que ordem o teclado percorre o formulário. São horas gastas em decisões que
        já foram tomadas dezenas de vezes — e que, tomadas de novo, saem diferentes a cada tela.
      </p>
      <ul class="pitch__list">
        <li>
          <strong>Entregue mais rápido</strong> — a estrutura sai pronta; você escreve apenas a
          lógica que é do seu negócio.
        </li>
        <li>
          <strong>Consistência sem esforço</strong> — todas as listagens da aplicação carregam,
          esvaziam e respondem do mesmo jeito.
        </li>
        <li>
          <strong>Acessível de origem</strong> — regiões, marcos e estados anunciados corretamente,
          sem depender de alguém lembrar.
        </li>
        <li>
          <strong>Sem amarras</strong> — cada área é um espaço aberto; nenhuma decisão sobre os seus
          dados é imposta.
        </li>
      </ul>
    </section>

    <div class="grid">
      @for (item of templates; track item.path; let i = $index) {
        <a class="card" [routerLink]="item.path" bdReveal="up" [revealDelay]="i * 70">
          <div class="thumb" [class]="'thumb--' + item.layout" aria-hidden="true">
            @switch (item.layout) {
              @case ('dashboard') {
                <span class="bar"></span>
                <span class="row"> <i></i><i></i><i></i> </span>
                <span class="split"><b></b><u></u></span>
              }
              @case ('list') {
                <span class="bar"></span>
                <span class="tools"><i></i><i class="sm"></i></span>
                <span class="lines"><b></b><b></b><b></b></span>
              }
              @case ('settings') {
                <span class="bar"></span>
                <span class="split split--nav"><u></u><b></b></span>
              }
              @case ('wizard') {
                <span class="steps"><i class="on"></i><i></i><i></i></span>
                <span class="panel"></span>
                <span class="foot"><i class="sm"></i><i class="sm on"></i></span>
              }
            }
          </div>

          <div class="card__body">
            <h2 class="card__name">{{ item.name }}</h2>
            <code class="card__selector">{{ item.selector }}</code>
            <p class="card__summary">{{ item.summary }}</p>
            <ul class="card__bullets">
              @for (bullet of item.bullets; track bullet) {
                <li>{{ bullet }}</li>
              }
            </ul>
            <span class="card__cta">Ver template →</span>
          </div>
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    /* ------------------------------------------------------------- pitch */

    .pitch {
      padding: 1.75rem;
      margin-bottom: 2.5rem;
      background: var(--bd-bg-elevated);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
    }

    .pitch p {
      max-width: 72ch;
      color: var(--bd-fg-muted);
      font-size: 0.96rem;
      line-height: 1.7;
    }

    .pitch__list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 0.75rem 1.75rem;
      margin: 1.35rem 0 0;
      padding: 0;
      list-style: none;
    }

    .pitch__list li {
      position: relative;
      padding-left: 1.15rem;
      color: var(--bd-fg-muted);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .pitch__list li::before {
      content: '';
      position: absolute;
      top: 0.55rem;
      left: 0;
      width: 6px;
      height: 6px;
      background: var(--bd-primary);
      border-radius: 50%;
    }

    .pitch__list strong {
      color: var(--bd-fg);
    }

    /* -------------------------------------------------------------- grid */

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    .card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--bd-surface);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-lg);
      color: inherit;
      text-decoration: none;
      transition:
        border-color 0.25s ease,
        transform 0.25s ease,
        box-shadow 0.25s ease;
    }

    .card:hover {
      transform: translateY(-3px);
      border-color: var(--bd-primary);
      box-shadow: var(--bd-shadow-lg);
    }

    .card:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }

    /* ---------------------------------------------------------- miniatura */

    /* Esquema do layout em CSS puro: comunica a estrutura sem o peso de uma
       captura de tela, e acompanha o tema claro e escuro sem retrabalho. */
    .thumb {
      display: flex;
      flex-direction: column;
      gap: 6px;
      height: 152px;
      padding: 14px;
      background: var(--bd-bg-elevated);
      border-bottom: 1px solid var(--bd-border);
    }

    .thumb .bar {
      height: 12px;
      width: 42%;
      background: var(--bd-border-strong);
      border-radius: 4px;
    }

    .thumb .row,
    .thumb .tools,
    .thumb .steps,
    .thumb .foot {
      display: flex;
      gap: 6px;
    }

    .thumb i {
      flex: 1;
      height: 26px;
      background: var(--bd-border);
      border-radius: 5px;
    }

    .thumb i.sm {
      flex: 0 0 44px;
      height: 16px;
    }

    .thumb i.on {
      background: var(--bd-primary);
    }

    .thumb .split {
      display: flex;
      flex: 1;
      gap: 6px;
    }

    .thumb .split b {
      flex: 2;
      background: var(--bd-border);
      border-radius: 5px;
    }

    .thumb .split u {
      flex: 1;
      background: var(--bd-primary-soft);
      border: 1px solid var(--bd-primary-soft);
      border-radius: 5px;
    }

    .thumb .split--nav u {
      flex: 0 0 58px;
    }

    .thumb .lines {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 6px;
    }

    .thumb .lines b {
      flex: 1;
      background: var(--bd-border);
      border-radius: 5px;
    }

    .thumb .panel {
      flex: 1;
      background: var(--bd-border);
      border-radius: 5px;
    }

    .thumb .foot {
      justify-content: flex-end;
    }

    /* -------------------------------------------------------------- body */

    .card__body {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 1.25rem 1.35rem 1.35rem;
    }

    .card__name {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      color: var(--bd-fg);
    }

    .card__selector {
      align-self: flex-start;
      margin-top: 0.4rem;
      padding: 0.15rem 0.5rem;
      background: var(--bd-primary-soft);
      border-radius: var(--bd-radius-full);
      color: var(--bd-primary);
      font-family: var(--bd-font-mono);
      font-size: 0.72rem;
      font-weight: 600;
    }

    .card__summary {
      margin-top: 0.7rem;
      color: var(--bd-fg-muted);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .card__bullets {
      flex: 1;
      margin: 0.85rem 0 1.1rem;
      padding: 0;
      list-style: none;
    }

    .card__bullets li {
      position: relative;
      padding-left: 1rem;
      color: var(--bd-fg-subtle);
      font-size: 0.83rem;
      line-height: 1.75;
    }

    .card__bullets li::before {
      content: '';
      position: absolute;
      top: 0.68rem;
      left: 0;
      width: 5px;
      height: 5px;
      background: var(--bd-border-strong);
      border-radius: 50%;
    }

    .card__cta {
      color: var(--bd-primary);
      font-size: 0.86rem;
      font-weight: 600;
    }

    @media (prefers-reduced-motion: reduce) {
      .card,
      .card:hover {
        transition: none;
        transform: none;
      }
    }
  `,
})
export class TemplatesPageComponent {
  readonly templates: TemplateCard[] = [
    {
      path: '/templates/dashboard',
      name: 'Painel analítico',
      selector: '<bd-dashboard-template>',
      layout: 'dashboard',
      summary:
        'Números no topo, análise no centro, contexto na lateral. Quem abre a tela entende a situação em um relance.',
      bullets: [
        'Indicadores se reorganizam sozinhos em qualquer largura',
        'Coluna lateral opcional, que desce no celular',
        'Ações do cabeçalho no lugar certo',
      ],
    },
    {
      path: '/templates/listagem',
      name: 'Listagem e cadastro',
      selector: '<bd-list-template>',
      layout: 'list',
      summary:
        'A tela mais repetida de qualquer sistema: busca, filtros, resultados e paginação — com carregando e vazio já resolvidos.',
      bullets: [
        'Os três estados da lista vêm no template',
        'Placeholders no formato do resultado: a página não salta',
        'O carregamento é anunciado a leitores de tela',
      ],
    },
    {
      path: '/templates/configuracoes',
      name: 'Configurações',
      selector: '<bd-settings-template>',
      layout: 'settings',
      summary:
        'Formulário longo dividido em seções, com a barra de salvar aparecendo só quando há o que salvar.',
      bullets: [
        'Cada seção tem seu próprio link, compartilhável',
        'Nada de barra fixa pedindo atenção o tempo todo',
        'A navegação vira faixa rolável no celular',
      ],
    },
    {
      path: '/templates/assistente',
      name: 'Assistente por etapas',
      selector: '<bd-wizard-template>',
      layout: 'wizard',
      summary:
        'Cadastros longos divididos em etapas curtas. Ninguém avança com o formulário inválido, e ninguém se perde no meio.',
      bullets: [
        'Volta livre ao que já foi preenchido, sem pular adiante',
        'O avanço só libera quando o formulário permite',
        'Cinco estilos de indicador, do cartão à barra compacta',
      ],
    },
  ];
}
