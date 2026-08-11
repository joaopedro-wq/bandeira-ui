import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { BdCountUpDirective } from '../directives/bd-count-up.directive';

export type BdMetricTrend = 'up' | 'down' | 'flat';
export type BdMetricAlign = 'center' | 'start';

/**
 * Indicador numérico com contagem animada na entrada em tela e variação
 * opcional em relação ao período anterior.
 *
 * A direção da variação é comunicada por seta, cor e texto anunciado — nunca
 * apenas por cor, que não é distinguível por parte dos usuários.
 *
 * @example
 * ```html
 * <bd-metric [value]="3" suffix="+" label="anos de experiência" />
 * <bd-metric [value]="98" suffix="%" label="cobertura" gradient />
 * <bd-metric [value]="128" prefix="R$ " suffix="k" label="Receita"
 *            align="start" trend="up" delta="12,5%" />
 * ```
 */
@Component({
  selector: 'bd-metric',
  standalone: true,
  imports: [BdCountUpDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="bd-metric__value"
      [class.bd-metric__value--gradient]="gradient()"
      [bdCountUp]="value()"
      [prefix]="prefix()"
      [suffix]="suffix()"
    ></span>
    @if (label()) {
      <span class="bd-metric__label">{{ label() }}</span>
    }

    @if (delta()) {
      <!-- A direção é comunicada por texto e por seta, não apenas por cor:
           verde e vermelho não se distinguem para parte dos usuários. -->
      <span class="bd-metric__delta" [class]="'bd-metric__delta--' + trend()">
        <span aria-hidden="true">{{ trendGlyph() }}</span>
        {{ delta() }}
        <span class="bd-metric__sr">{{ trendLabel() }}</span>
      </span>
    }
  `,
  styles: `
    :host {
      display: block;
      text-align: center;
    }

    .bd-metric__value {
      display: block;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--bd-primary, #3d5ce8);
      /* Reserva a altura antes de a contagem começar, evitando salto no layout. */
      min-height: 1.1em;
    }

    .bd-metric__value--gradient {
      background: var(--bd-gradient, linear-gradient(120deg, #3d5ce8, #0d9488));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .bd-metric__label {
      display: block;
      margin-top: var(--bd-space-1, 0.25rem);
      font-size: var(--bd-text-sm, 0.875rem);
      color: var(--bd-fg-muted, #545c70);
    }

    .bd-metric__delta {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      margin-top: var(--bd-space-2, 0.5rem);
      padding: 0.12rem 0.5rem;
      border-radius: var(--bd-radius-full, 9999px);
      font-size: var(--bd-text-xs, 0.75rem);
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-metric__delta--up {
      background: var(--bd-success-soft, rgba(22, 163, 74, 0.1));
      color: var(--bd-success, #16a34a);
    }

    .bd-metric__delta--down {
      background: var(--bd-danger-soft, rgba(220, 38, 38, 0.1));
      color: var(--bd-danger, #dc2626);
    }

    .bd-metric__delta--flat {
      background: var(--bd-surface-hover, #f1f3f9);
      color: var(--bd-fg-muted, #545c70);
    }

    .bd-metric__sr {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    /* Alinhamento à esquerda para painéis, onde o indicador divide espaço com
       outros blocos e o eixo de leitura é a margem esquerda. */
    :host(.bd-metric--start) {
      text-align: left;
    }
  `,
  host: { '[class.bd-metric--start]': "align() === 'start'" },
})
export class BdMetricComponent {
  readonly value = input.required<number>();
  readonly label = input('');
  readonly prefix = input('');
  readonly suffix = input('');
  /** Preenche o número com o gradiente da marca. */
  readonly gradient = input(false, { transform: booleanAttribute });

  /** Alinhamento do bloco. Use `start` em painéis. */
  readonly align = input<BdMetricAlign>('center');

  /** Variação em relação ao período anterior — ex.: `'12,5%'`. */
  readonly delta = input('');
  /** Direção da variação. Define cor, seta e texto anunciado. */
  readonly trend = input<BdMetricTrend>('flat');

  /** Rótulos anunciados por leitores de tela para cada direção. */
  readonly trendLabels = input<Record<BdMetricTrend, string>>({
    up: 'de aumento',
    down: 'de queda',
    flat: 'de variação',
  });

  protected readonly trendGlyph = computed(() => ({ up: '↑', down: '↓', flat: '→' })[this.trend()]);

  protected readonly trendLabel = computed(() => this.trendLabels()[this.trend()]);
}
