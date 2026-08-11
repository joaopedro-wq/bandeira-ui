import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdChipComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-chip-page',
  standalone: true,
  imports: [BdChipComponent, DocsDemoComponent, DocsApiComponent, DocsPageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Chip"
      selector="<bd-chip>"
      description="Etiqueta compacta para tecnologias, níveis, filtros ativos e status."
    />

    <docs-demo
      title="Tons"
      description="Escolha pelo significado, não pela cor: danger comunica problema, success comunica conclusão."
      [code]="cod1"
    >
      <bd-chip>primary</bd-chip>
      <bd-chip tone="accent">accent</bd-chip>
      <bd-chip tone="neutral">neutral</bd-chip>
      <bd-chip tone="success">success</bd-chip>
      <bd-chip tone="warning">warning</bd-chip>
      <bd-chip tone="danger">danger</bd-chip>
    </docs-demo>

    <docs-demo
      title="Contornado"
      description="Mesma cor, sem preenchimento. Útil quando há muitos chips juntos e o fundo cheio polui."
      [code]="cod2"
    >
      <bd-chip outlined>primary</bd-chip>
      <bd-chip tone="accent" outlined>accent</bd-chip>
      <bd-chip tone="neutral" outlined>neutral</bd-chip>
      <bd-chip tone="danger" outlined>danger</bd-chip>
    </docs-demo>

    <docs-demo
      title="Removível"
      description="Para filtros aplicados. O botão de remover tem rótulo acessível próprio, então o leitor de tela anuncia o que será removido."
      [code]="cod3"
    >
      @for (filtro of filtros(); track filtro) {
        <bd-chip
          tone="neutral"
          removable
          [removeLabel]="'Remover filtro ' + filtro"
          (removed)="remover(filtro)"
        >
          {{ filtro }}
        </bd-chip>
      }
      @if (!filtros().length) {
        <span class="vazio">Todos removidos — <button type="button" (click)="restaurar()">restaurar</button></span>
      }
    </docs-demo>

    <docs-api [rows]="api" />
  `,
  styles: `
    .vazio {
      color: var(--bd-fg-subtle);
      font-size: 0.88rem;
    }
    .vazio button {
      background: none;
      border: none;
      color: var(--bd-primary);
      font: inherit;
      text-decoration: underline;
      cursor: pointer;
    }
  `,
})
export class ChipPageComponent {
  readonly filtros = signal(['Angular', 'TypeScript', 'SCSS']);

  remover(filtro: string) {
    this.filtros.update((lista) => lista.filter((f) => f !== filtro));
  }

  restaurar() {
    this.filtros.set(['Angular', 'TypeScript', 'SCSS']);
  }

  readonly cod1 = `<bd-chip>primary</bd-chip>
<bd-chip tone="accent">accent</bd-chip>
<bd-chip tone="danger">danger</bd-chip>`;

  readonly cod2 = `<bd-chip outlined>primary</bd-chip>
<bd-chip tone="accent" outlined>accent</bd-chip>`;

  readonly cod3 = `<bd-chip
  tone="neutral"
  removable
  [removeLabel]="'Remover filtro ' + filtro"
  (removed)="remover(filtro)"
>
  {{ filtro }}
</bd-chip>`;

  readonly api: DocsApiRow[] = [
    {
      name: 'tone',
      type: "'primary' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Cor semântica da etiqueta.',
    },
    {
      name: 'outlined',
      type: 'boolean',
      default: 'false',
      description: 'Remove o preenchimento e mantém só o contorno.',
    },
    {
      name: 'removable',
      type: 'boolean',
      default: 'false',
      description: 'Mostra o botão de remover.',
    },
    {
      name: 'removeLabel',
      type: 'string',
      default: "'Remover'",
      description: 'Rótulo acessível do botão de remover.',
    },
    {
      name: '(removed)',
      type: 'EventEmitter<void>',
      description: 'Emitido ao clicar no botão de remover.',
    },
  ];
}
