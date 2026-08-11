import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface BdStep {
  label: string;
  /** Texto auxiliar exibido abaixo do rótulo. */
  hint?: string;
  /** Glifo exibido no marcador em vez do número. */
  icon?: string;
  /** Marca a etapa como dispensável na leitura. */
  optional?: boolean;
}

/**
 * Estilos disponíveis do indicador.
 *
 * - `panel` — cartões lado a lado, com rótulo e apoio. Denso em informação.
 * - `line` — círculos ligados por linha, o formato canônico de assistente.
 * - `numbered` — lista numerada com conector; legível na vertical.
 * - `dots` — apenas marcadores. Para fluxos curtos e áreas estreitas.
 * - `progress` — barra de progresso com contador. O mais compacto.
 */
export type BdStepsVariant = 'panel' | 'line' | 'numbered' | 'dots' | 'progress';

export type BdStepsOrientation = 'horizontal' | 'vertical';

/**
 * Indicador de progresso em etapas.
 *
 * A marcação é sempre a mesma — uma lista ordenada com `aria-current="step"` na
 * etapa corrente —, o que muda entre as variantes é apenas a apresentação. A
 * posição no processo é, portanto, anunciada por leitores de tela em todas
 * elas, e não apenas sinalizada por cor.
 *
 * Etapas já concluídas voltam a ser navegáveis quando `clickable` está ativo;
 * as futuras permanecem bloqueadas, porque o indicador não tem como saber se as
 * intermediárias foram preenchidas.
 *
 * @example
 * ```html
 * <bd-steps [steps]="etapas" [(active)]="etapa" variant="line" clickable />
 * <bd-steps [steps]="etapas" [active]="etapa()" variant="numbered" orientation="vertical" />
 * <bd-steps [steps]="etapas" [active]="etapa()" variant="progress" />
 * ```
 */
@Component({
  selector: 'bd-steps',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'classes()' },
  template: `
    @if (variant() === 'progress') {
      <!-- Compacto: uma barra e um contador, sem repetir os rótulos. -->
      <div class="bd-steps__progress">
        <div class="bd-steps__progress-head">
          <span class="bd-steps__progress-label">{{ currentLabel() }}</span>
          <span class="bd-steps__progress-count">{{ counterText() }}</span>
        </div>
        <div
          class="bd-steps__progress-track"
          role="progressbar"
          [attr.aria-valuenow]="active() + 1"
          [attr.aria-valuemin]="1"
          [attr.aria-valuemax]="steps().length"
          [attr.aria-label]="label()"
        >
          <span class="bd-steps__progress-fill" [style.width.%]="progress()"></span>
        </div>
      </div>
    } @else {
      <ol class="bd-steps__list" [attr.aria-label]="label()">
        @for (step of steps(); track $index; let index = $index, last = $last) {
          <li
            class="bd-steps__item"
            [class.is-active]="index === active()"
            [class.is-done]="index < active()"
            [class.is-last]="last"
            [attr.aria-current]="index === active() ? 'step' : null"
          >
            <button
              type="button"
              class="bd-steps__btn"
              [disabled]="!isReachable(index)"
              (click)="select(index)"
            >
              <span class="bd-steps__marker" aria-hidden="true">
                {{ markerFor(step, index) }}
              </span>

              @if (variant() !== 'dots') {
                <span class="bd-steps__text">
                  <span class="bd-steps__label">{{ step.label }}</span>
                  @if (step.hint) {
                    <span class="bd-steps__hint">{{ step.hint }}</span>
                  }
                </span>
              } @else {
                <span class="bd-steps__sr">{{ step.label }}</span>
              }
            </button>

            @if (!last && hasConnector()) {
              <span class="bd-steps__connector" aria-hidden="true"></span>
            }
          </li>
        }
      </ol>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .bd-steps__list {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .bd-steps__item {
      display: flex;
      align-items: center;
      min-width: 0;
    }

    .bd-steps__btn {
      display: flex;
      align-items: center;
      gap: var(--bd-space-3, 0.75rem);
      min-width: 0;
      background: transparent;
      border: 1px solid transparent;
      color: var(--bd-fg-muted, #545c70);
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      transition:
        border-color var(--bd-duration, 0.25s) ease,
        background var(--bd-duration, 0.25s) ease,
        color var(--bd-duration, 0.25s) ease;
    }

    /* Etapa futura: sem ação, mas ainda legível — atenuar demais esconderia
       para onde o processo caminha. */
    .bd-steps__btn:disabled {
      cursor: default;
      opacity: 0.62;
    }

    .bd-steps__btn:not(:disabled):hover {
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-steps__btn:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
      border-radius: var(--bd-radius-sm, 0.5rem);
    }

    .bd-steps__marker {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: 28px;
      height: 28px;
      background: var(--bd-surface-hover, #f1f3f9);
      border-radius: 50%;
      font-size: var(--bd-text-sm, 0.875rem);
      font-weight: var(--bd-weight-bold, 700);
      transition:
        background var(--bd-duration, 0.25s) ease,
        color var(--bd-duration, 0.25s) ease;
    }

    .is-active .bd-steps__marker,
    .is-done .bd-steps__marker {
      background: var(--bd-primary-strong, #2b46c9);
      color: var(--bd-primary-contrast, #fff);
    }

    .bd-steps__text {
      min-width: 0;
    }

    .bd-steps__label {
      display: block;
      font-size: 0.9rem;
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-steps__hint {
      display: block;
      color: var(--bd-fg-subtle, #7b8399);
      font-size: var(--bd-text-xs, 0.75rem);
      font-weight: var(--bd-weight-normal, 400);
    }

    .is-active .bd-steps__label {
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-steps__connector {
      flex: 1;
      min-width: 18px;
      height: 2px;
      margin: 0 var(--bd-space-2, 0.5rem);
      background: var(--bd-border, #e3e7f0);
      border-radius: 2px;
      transition: background var(--bd-duration, 0.25s) ease;
    }

    .is-done .bd-steps__connector {
      background: var(--bd-primary, #3d5ce8);
    }

    .bd-steps__sr {
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

    /* ------------------------------------------------------ variante panel */

    :host(.bd-steps--panel) .bd-steps__list {
      flex-wrap: wrap;
      gap: var(--bd-space-2, 0.5rem);
    }

    :host(.bd-steps--panel) .bd-steps__item {
      flex: 1 1 180px;
    }

    :host(.bd-steps--panel) .bd-steps__btn {
      width: 100%;
      padding: 0.7rem 0.85rem;
      border-color: var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius, 0.875rem);
    }

    :host(.bd-steps--panel) .bd-steps__btn:not(:disabled):hover {
      border-color: var(--bd-primary, #3d5ce8);
    }

    :host(.bd-steps--panel) .is-active .bd-steps__btn {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      border-color: var(--bd-primary, #3d5ce8);
    }

    /* ------------------------------------------------ variantes line e dots */

    :host(.bd-steps--line) .bd-steps__item,
    :host(.bd-steps--dots) .bd-steps__item {
      flex: 1 1 auto;
    }

    :host(.bd-steps--line) .bd-steps__item.is-last,
    :host(.bd-steps--dots) .bd-steps__item.is-last {
      flex: 0 0 auto;
    }

    :host(.bd-steps--line) .bd-steps__btn {
      flex-direction: column;
      gap: 0.4rem;
      text-align: center;
    }

    :host(.bd-steps--line) .bd-steps__text {
      max-width: 12ch;
    }

    :host(.bd-steps--line) .bd-steps__connector {
      align-self: flex-start;
      margin-top: 14px;
    }

    :host(.bd-steps--dots) .bd-steps__marker {
      width: 10px;
      height: 10px;
      font-size: 0;
    }

    :host(.bd-steps--dots) .is-active .bd-steps__marker {
      width: 26px;
      border-radius: var(--bd-radius-full, 9999px);
    }

    :host(.bd-steps--dots) .bd-steps__connector {
      min-width: 10px;
      margin: 0 4px;
    }

    /* -------------------------------------------------- variante numbered */

    :host(.bd-steps--numbered) .bd-steps__list {
      gap: var(--bd-space-4, 1rem);
    }

    :host(.bd-steps--numbered) .bd-steps__marker {
      border: 2px solid var(--bd-border-strong, #cbd2e2);
      background: transparent;
      color: var(--bd-fg-muted, #545c70);
    }

    :host(.bd-steps--numbered) .is-active .bd-steps__marker,
    :host(.bd-steps--numbered) .is-done .bd-steps__marker {
      border-color: var(--bd-primary, #3d5ce8);
      background: var(--bd-primary-strong, #2b46c9);
      color: var(--bd-primary-contrast, #fff);
    }

    /* ------------------------------------------------------- orientação --- */

    :host(.bd-steps--vertical) .bd-steps__list {
      flex-direction: column;
      align-items: stretch;
      gap: 0;
    }

    :host(.bd-steps--vertical) .bd-steps__item {
      flex-direction: column;
      align-items: stretch;
    }

    :host(.bd-steps--vertical) .bd-steps__btn {
      flex-direction: row;
      padding-block: 0.4rem;
      text-align: left;
    }

    :host(.bd-steps--vertical) .bd-steps__text {
      max-width: none;
    }

    /* Na vertical o conector é um segmento alinhado ao centro do marcador. */
    :host(.bd-steps--vertical) .bd-steps__connector {
      flex: 0 0 18px;
      width: 2px;
      height: 18px;
      min-width: 0;
      margin: 0 0 0 13px;
      align-self: flex-start;
    }

    /* ---------------------------------------------------- variante progress */

    .bd-steps__progress-head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--bd-space-3, 0.75rem);
      margin-bottom: 0.5rem;
    }

    .bd-steps__progress-label {
      color: var(--bd-fg, #10131c);
      font-size: 0.95rem;
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-steps__progress-count {
      color: var(--bd-fg-subtle, #7b8399);
      font-size: var(--bd-text-sm, 0.875rem);
      font-variant-numeric: tabular-nums;
    }

    .bd-steps__progress-track {
      height: 6px;
      background: var(--bd-surface-hover, #f1f3f9);
      border-radius: var(--bd-radius-full, 9999px);
      overflow: hidden;
    }

    .bd-steps__progress-fill {
      display: block;
      height: 100%;
      background: var(--bd-gradient, linear-gradient(120deg, #3d5ce8, #0d9488));
      border-radius: inherit;
      transition: width var(--bd-duration-slow, 0.5s) var(--bd-ease, ease);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-steps__btn,
      .bd-steps__marker,
      .bd-steps__connector,
      .bd-steps__progress-fill {
        transition: none;
      }
    }

    /* Abaixo de 640px, os rótulos de line e panel competem por espaço com o
       conteúdo. A leitura passa a depender apenas do marcador e do rótulo da
       etapa corrente, que permanece visível. */
    @media (max-width: 640px) {
      :host(.bd-steps--line) .bd-steps__item:not(.is-active) .bd-steps__text {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
      }

      :host(.bd-steps--panel) .bd-steps__hint {
        display: none;
      }
    }
  `,
})
export class BdStepsComponent {
  readonly steps = input<readonly BdStep[]>([]);

  /** Two-way com o índice da etapa corrente. */
  readonly active = model(0);

  readonly variant = input<BdStepsVariant>('panel');
  readonly orientation = input<BdStepsOrientation>('horizontal');

  /** Permite retornar a etapas já concluídas pelo próprio indicador. */
  readonly clickable = input(false, { transform: booleanAttribute });

  readonly label = input('Etapas do processo');
  /** Recebe (posição atual, total) — ex.: "Etapa 2 de 5". */
  readonly counter = input<(current: number, total: number) => string>(
    (current, total) => `Etapa ${current} de ${total}`,
  );

  readonly stepChange = output<number>();

  protected readonly classes = computed(
    () => `bd-steps--${this.variant()} bd-steps--${this.orientation()}`,
  );

  protected readonly hasConnector = computed(() =>
    ['line', 'dots', 'numbered'].includes(this.variant()),
  );

  protected readonly progress = computed(() => {
    const total = this.steps().length;
    if (total <= 1) return 100;
    return ((this.active() + 1) / total) * 100;
  });

  protected readonly currentLabel = computed(() => this.steps()[this.active()]?.label ?? '');

  protected readonly counterText = computed(() =>
    this.counter()(this.active() + 1, this.steps().length),
  );

  protected isReachable(index: number): boolean {
    return this.clickable() && index < this.active();
  }

  protected markerFor(step: BdStep, index: number): string {
    if (index < this.active()) return step.icon ?? '✓';
    return step.icon ?? String(index + 1);
  }

  protected select(index: number): void {
    if (!this.isReachable(index)) return;

    this.active.set(index);
    this.stepChange.emit(index);
  }
}
