import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdButtonComponent, BdStep, BdStepsComponent, BdStepsVariant } from 'bandeira-ui';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-steps-page',
  standalone: true,
  imports: [
    BdStepsComponent,
    BdButtonComponent,
    DocsDemoComponent,
    DocsApiComponent,
    DocsPageHeadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Steps"
      selector="<bd-steps>"
      description="Cinco jeitos de mostrar “você está aqui” em um processo longo. Do cartão
        detalhado à barra compacta do celular, todos anunciam a posição a leitores de tela — não
        apenas colorem a etapa da vez."
    />

    <div class="controls">
      <div class="controls__group" role="group" aria-label="Variante">
        <span class="controls__label">Variante</span>
        @for (option of variantes; track option) {
          <button
            type="button"
            class="chip"
            [class.is-active]="variante() === option"
            [attr.aria-pressed]="variante() === option"
            (click)="variante.set(option)"
          >
            {{ option }}
          </button>
        }
      </div>

      <div class="controls__group" role="group" aria-label="Orientação">
        <span class="controls__label">Orientação</span>
        <button
          type="button"
          class="chip"
          [class.is-active]="!vertical()"
          [attr.aria-pressed]="!vertical()"
          (click)="vertical.set(false)"
        >
          horizontal
        </button>
        <button
          type="button"
          class="chip"
          [class.is-active]="vertical()"
          [attr.aria-pressed]="vertical()"
          (click)="vertical.set(true)"
        >
          vertical
        </button>
      </div>
    </div>

    <docs-demo
      title="Experimente as cinco"
      description="Alterne acima e navegue pelas etapas. O usuário pode voltar a qualquer etapa já
        preenchida, mas nunca pular adiante — o indicador não tem como saber se o que ficou pelo
        caminho foi preenchido."
      [code]="codigoVariante()"
      column
    >
      <div class="palco">
        <bd-steps
          [steps]="etapas"
          [(active)]="etapa"
          [variant]="variante()"
          [orientation]="vertical() ? 'vertical' : 'horizontal'"
          clickable
        />

        <div class="acoes">
          <button bdButton variant="ghost" size="sm" [disabled]="etapa() === 0" (click)="voltar()">
            Voltar
          </button>
          <button bdButton size="sm" [disabled]="etapa() === etapas.length - 1" (click)="avancar()">
            Avançar
          </button>
        </div>
      </div>
    </docs-demo>

    <docs-demo
      title="Qual usar em cada caso"
      description="A escolha é de espaço e densidade, não de gosto: quantas etapas o processo tem e
        quanta largura sobra para elas."
      column
    >
      <div class="galeria">
        @for (item of guia; track item.variant) {
          <div class="galeria__item">
            <div class="galeria__head">
              <code>{{ item.variant }}</code>
              <span>{{ item.quando }}</span>
            </div>
            <bd-steps [steps]="etapas" [active]="1" [variant]="item.variant" />
          </div>
        }
      </div>
    </docs-demo>

    <docs-api title="Entradas" [rows]="rows" />

    <docs-api title="Saídas" [rows]="saidas" />
  `,
  styles: `
    :host {
      display: block;
    }

    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .controls__group {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .controls__label {
      margin-right: 0.2rem;
      color: var(--bd-fg-subtle);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .chip {
      padding: 0.3rem 0.75rem;
      background: transparent;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-full);
      color: var(--bd-fg-muted);
      font-family: var(--bd-font-mono);
      font-size: 0.78rem;
      cursor: pointer;
      transition:
        color 0.2s ease,
        border-color 0.2s ease,
        background 0.2s ease;
    }

    .chip:hover {
      border-color: var(--bd-primary);
      color: var(--bd-primary);
    }

    .chip.is-active {
      background: var(--bd-primary-soft);
      border-color: var(--bd-primary);
      color: var(--bd-primary);
      font-weight: 600;
    }

    .chip:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }

    .palco {
      width: 100%;
      padding: 1.75rem 1.5rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .acoes {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--bd-border);
    }

    .galeria {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
    }

    .galeria__item {
      padding: 1.25rem;
      background: var(--bd-bg);
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius);
    }

    .galeria__head {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }

    .galeria__head code {
      padding: 0.12rem 0.5rem;
      background: var(--bd-primary-soft);
      border-radius: var(--bd-radius-full);
      color: var(--bd-primary);
      font-family: var(--bd-font-mono);
      font-size: 0.74rem;
      font-weight: 600;
    }

    .galeria__head span {
      color: var(--bd-fg-subtle);
      font-size: 0.83rem;
    }
  `,
})
export class StepsPageComponent {
  readonly etapas: BdStep[] = [
    { label: 'Dados básicos', hint: 'Nome e contato' },
    { label: 'Endereço', hint: 'Onde você está' },
    { label: 'Pagamento', hint: 'Forma e prazo' },
    { label: 'Revisão', hint: 'Confirme e envie' },
  ];

  readonly variantes: BdStepsVariant[] = ['panel', 'line', 'numbered', 'dots', 'progress'];

  readonly variante = signal<BdStepsVariant>('line');
  readonly vertical = signal(false);
  readonly etapa = signal(1);

  readonly guia: { variant: BdStepsVariant; quando: string }[] = [
    { variant: 'panel', quando: 'Cartões densos, quando cada etapa precisa de rótulo e apoio.' },
    { variant: 'line', quando: 'O formato canônico de assistente. Bom até seis etapas.' },
    { variant: 'numbered', quando: 'Lista numerada; a melhor escolha na vertical.' },
    { variant: 'dots', quando: 'Fluxos curtos e áreas estreitas, sem espaço para rótulos.' },
    { variant: 'progress', quando: 'O mais compacto: barra e contador, ideal no celular.' },
  ];

  avancar(): void {
    this.etapa.update((i) => Math.min(this.etapas.length - 1, i + 1));
  }

  voltar(): void {
    this.etapa.update((i) => Math.max(0, i - 1));
  }

  codigoVariante(): string {
    const orientacao = this.vertical() ? '\n  orientation="vertical"' : '';
    return `<bd-steps
  [steps]="etapas"
  [(active)]="etapa"
  variant="${this.variante()}"${orientacao}
  clickable
/>`;
  }

  readonly rows: DocsApiRow[] = [
    {
      name: 'steps',
      type: 'BdStep[]',
      default: '[]',
      description: 'Etapas: label, hint, icon e optional.',
    },
    {
      name: 'active',
      type: 'model<number>',
      default: '0',
      description: 'Two-way com o índice da etapa corrente.',
    },
    {
      name: 'variant',
      type: "'panel' | 'line' | 'numbered' | 'dots' | 'progress'",
      default: "'panel'",
      description: 'Apresentação do indicador.',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Eixo do indicador. Não se aplica à variante progress.',
    },
    {
      name: 'clickable',
      type: 'boolean',
      default: 'false',
      description: 'Permite retornar a etapas já concluídas pelo próprio indicador.',
    },
    {
      name: 'label',
      type: 'string',
      default: "'Etapas do processo'",
      description: 'Rótulo acessível da lista.',
    },
    {
      name: 'counter',
      type: '(current, total) => string',
      default: "'Etapa 2 de 5'",
      description: 'Formata o contador da variante progress.',
    },
  ];

  readonly saidas: DocsApiRow[] = [
    {
      name: '(stepChange)',
      type: 'output<number>',
      description: 'Emitido quando o usuário retorna a uma etapa pelo indicador.',
    },
  ];
}
