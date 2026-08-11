import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';
import { BdStep, BdStepsComponent, BdStepsVariant } from '../steps/bd-steps.component';

/** As etapas do assistente são as mesmas do indicador {@link BdStepsComponent}. */
export type BdWizardStep = BdStep;

/**
 * Estrutura de assistente por etapas: indicador de progresso, área da etapa
 * atual e rodapé de navegação.
 *
 * O indicador é uma lista ordenada real, anotada com `aria-current="step"`, de
 * modo que a posição no processo é anunciada e não apenas colorida. Etapas já
 * concluídas voltam a ser navegáveis; as futuras permanecem bloqueadas,
 * porque avançar sem completar a etapa corrente produz dados inconsistentes.
 *
 * A validação é do formulário, não do template: enquanto `canAdvance` for
 * `false`, o botão de avanço fica desabilitado e `next` não é emitido.
 *
 * @example
 * ```html
 * <bd-wizard-template
 *   title="Novo projeto"
 *   [steps]="etapas"
 *   [(activeStep)]="etapa"
 *   [canAdvance]="formulario.valid"
 *   (finish)="concluir()"
 * >
 *   @switch (etapa()) {
 *     @case (0) { <section>Dados básicos</section> }
 *     @case (1) { <section>Equipe</section> }
 *   }
 * </bd-wizard-template>
 * ```
 */
@Component({
  selector: 'bd-wizard-template',
  standalone: true,
  imports: [BdStepsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bd-wizard__head">
      <h1 class="bd-wizard__title">{{ title() }}</h1>
      @if (description()) {
        <p class="bd-wizard__desc">{{ description() }}</p>
      }
    </header>

    <bd-steps
      class="bd-wizard__steps"
      [steps]="steps()"
      [active]="activeStep()"
      [variant]="stepsVariant()"
      [label]="stepsLabel()"
      clickable
      (stepChange)="setStep($event)"
    />

    <section class="bd-wizard__panel">
      <ng-content />
    </section>

    <footer class="bd-wizard__footer">
      <button type="button" class="bd-wizard__btn" [disabled]="isFirst()" (click)="previous()">
        {{ previousLabel() }}
      </button>

      <div class="bd-wizard__footer-right">
        <ng-content select="[bdWizardActions]" />

        <button
          type="button"
          class="bd-wizard__btn bd-wizard__btn--primary"
          [disabled]="!canAdvance()"
          (click)="advance()"
        >
          {{ isLast() ? finishLabel() : nextLabel() }}
        </button>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
    }

    .bd-wizard__head {
      margin-bottom: var(--bd-space-5, 1.5rem);
    }

    .bd-wizard__title {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
      color: var(--bd-fg, #10131c);
    }

    .bd-wizard__desc {
      max-width: 62ch;
      margin: 0.35rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-wizard__steps {
      display: block;
      margin-bottom: var(--bd-space-5, 1.5rem);
    }

    .bd-wizard__panel {
      padding: var(--bd-space-5, 1.5rem);
      background: var(--bd-surface, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-lg, 1.25rem);
    }

    .bd-wizard__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-3, 0.75rem);
      margin-top: var(--bd-space-5, 1.5rem);
    }

    .bd-wizard__footer-right {
      display: flex;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-wizard__btn {
      min-height: 44px;
      padding: 0.7rem 1.4rem;
      background: transparent;
      border: 1px solid var(--bd-border-strong, #cbd2e2);
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg, #10131c);
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: var(--bd-weight-semibold, 600);
      cursor: pointer;
      transition:
        background var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease,
        color var(--bd-duration, 0.25s) ease;
    }

    .bd-wizard__btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .bd-wizard__btn:not(:disabled):hover {
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-wizard__btn--primary {
      background: var(--bd-primary-strong, #2b46c9);
      border-color: transparent;
      color: var(--bd-primary-contrast, #fff);
    }

    .bd-wizard__btn--primary:not(:disabled):hover {
      background: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary-contrast, #fff);
    }

    .bd-wizard__btn:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    @media (max-width: 640px) {
      .bd-wizard__footer,
      .bd-wizard__footer-right {
        width: 100%;
      }

      .bd-wizard__btn {
        flex: 1 1 auto;
      }
    }
  `,
})
export class BdWizardTemplateComponent {
  readonly title = input.required<string>();
  readonly description = input('');

  readonly steps = input<readonly BdWizardStep[]>([]);
  /** Two-way: `[(activeStep)]="etapa"`. */
  readonly activeStep = model(0);

  /**
   * Libera o avanço. Ligue à validade do formulário da etapa corrente — com
   * `false`, o botão fica desabilitado e nenhum evento é emitido.
   */
  readonly canAdvance = input(true, { transform: booleanAttribute });

  /** Estilo do indicador de progresso. Ver {@link BdStepsVariant}. */
  readonly stepsVariant = input<BdStepsVariant>('panel');

  readonly previousLabel = input('Voltar');
  readonly nextLabel = input('Continuar');
  readonly finishLabel = input('Concluir');
  readonly stepsLabel = input('Etapas do processo');

  /** Emitido ao entrar em uma etapa, com o índice de destino. */
  readonly stepChange = output<number>();
  /** Emitido ao confirmar a última etapa. */
  readonly finish = output<void>();

  protected readonly isFirst = computed(() => this.activeStep() === 0);
  protected readonly isLast = computed(
    () => this.activeStep() >= Math.max(0, this.steps().length - 1),
  );

  protected advance(): void {
    if (!this.canAdvance()) return;

    if (this.isLast()) {
      this.finish.emit();
      return;
    }
    this.setStep(this.activeStep() + 1);
  }

  protected previous(): void {
    if (!this.isFirst()) {
      this.setStep(this.activeStep() - 1);
    }
  }

  /**
   * Aplica a etapa de destino. O indicador só emite índices anteriores ao
   * corrente — saltar adiante nunca é permitido, porque o template não tem como
   * saber se as etapas intermediárias foram preenchidas. O avanço passa por
   * `advance()`, que respeita `canAdvance`.
   */
  protected setStep(index: number): void {
    if (index < 0 || index >= this.steps().length || index === this.activeStep()) return;

    this.activeStep.set(index);
    this.stepChange.emit(index);
  }
}
