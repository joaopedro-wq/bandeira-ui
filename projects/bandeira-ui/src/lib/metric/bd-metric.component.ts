import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { BdCountUpDirective } from '../directives/bd-count-up.directive';

/**
 * Indicador numérico com contagem animada na entrada em tela.
 *
 * @example
 * ```html
 * <bd-metric [value]="3" suffix="+" label="anos de experiência" />
 * <bd-metric [value]="98" suffix="%" label="cobertura" gradient />
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
  `,
})
export class BdMetricComponent {
  readonly value = input.required<number>();
  readonly label = input('');
  readonly prefix = input('');
  readonly suffix = input('');
  /** Preenche o número com o gradiente da marca. */
  readonly gradient = input(false, { transform: booleanAttribute });
}
