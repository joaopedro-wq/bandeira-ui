/*
 * bandeira-ui — design system em Angular
 * API pública da biblioteca.
 */

/* --------------------------------------------------------------- Ações --- */
export * from './lib/button/bd-button.component';

/* -------------------------------------------------------- Formulários --- */
export * from './lib/field/bd-field.component';
export * from './lib/field/bd-input.component';
export * from './lib/form/bd-checkbox.component';
export * from './lib/form/bd-switch.component';

/* ---------------------------------------------------------- Feedback ----- */
export * from './lib/alert/bd-alert.component';
export * from './lib/feedback/bd-progress.component';
export * from './lib/feedback/bd-skeleton.component';
export * from './lib/feedback/bd-spinner.component';
export * from './lib/modal/bd-modal.component';

/* -------------------------------------------------------- Navegação ----- */
export * from './lib/accordion/bd-accordion.component';
export * from './lib/tabs/bd-tab-panel.component';
export * from './lib/tabs/bd-tabs.component';

/* ------------------------------------------------ Conteúdo e dados ------- */
export * from './lib/card/bd-card.component';
export * from './lib/chip/bd-chip.component';
export * from './lib/content/bd-avatar.component';
export * from './lib/content/bd-badge.component';
export * from './lib/content/bd-empty-state.component';
export * from './lib/metric/bd-metric.component';

/* ------------------------------------------------------- Sobreposição ---- */
export * from './lib/tooltip/bd-tooltip.directive';
export * from './lib/tour/bd-tour.component';
export * from './lib/tour/bd-tour.service';

/* --------------------------------------------------------- Diretivas ---- */
export * from './lib/directives/bd-count-up.directive';
export * from './lib/directives/bd-reveal.directive';

/* ------------------------------------------------------------ Conjunto --- */

import { BdAccordionComponent } from './lib/accordion/bd-accordion.component';
import { BdAlertComponent } from './lib/alert/bd-alert.component';
import { BdButtonComponent } from './lib/button/bd-button.component';
import { BdCardComponent } from './lib/card/bd-card.component';
import { BdChipComponent } from './lib/chip/bd-chip.component';
import { BdAvatarComponent } from './lib/content/bd-avatar.component';
import { BdBadgeComponent } from './lib/content/bd-badge.component';
import { BdEmptyStateComponent } from './lib/content/bd-empty-state.component';
import { BdCountUpDirective } from './lib/directives/bd-count-up.directive';
import { BdRevealDirective } from './lib/directives/bd-reveal.directive';
import { BdFieldComponent } from './lib/field/bd-field.component';
import { BdInputComponent } from './lib/field/bd-input.component';
import { BdProgressComponent } from './lib/feedback/bd-progress.component';
import { BdSkeletonComponent } from './lib/feedback/bd-skeleton.component';
import { BdSpinnerComponent } from './lib/feedback/bd-spinner.component';
import { BdCheckboxComponent } from './lib/form/bd-checkbox.component';
import { BdSwitchComponent } from './lib/form/bd-switch.component';
import { BdMetricComponent } from './lib/metric/bd-metric.component';
import { BdModalComponent } from './lib/modal/bd-modal.component';
import { BdTabPanelComponent } from './lib/tabs/bd-tab-panel.component';
import { BdTabsComponent } from './lib/tabs/bd-tabs.component';
import { BdTooltipDirective } from './lib/tooltip/bd-tooltip.directive';
import { BdTourComponent } from './lib/tour/bd-tour.component';

/**
 * Importa a biblioteca inteira de uma vez:
 *
 * ```ts
 * @Component({ imports: [BANDEIRA_UI] })
 * ```
 *
 * Em produção, prefira importar só o que usar — o tree shaking agradece.
 */
export const BANDEIRA_UI = [
  BdAccordionComponent,
  BdAlertComponent,
  BdAvatarComponent,
  BdBadgeComponent,
  BdButtonComponent,
  BdCardComponent,
  BdCheckboxComponent,
  BdChipComponent,
  BdEmptyStateComponent,
  BdFieldComponent,
  BdInputComponent,
  BdMetricComponent,
  BdModalComponent,
  BdProgressComponent,
  BdSkeletonComponent,
  BdSpinnerComponent,
  BdSwitchComponent,
  BdTabPanelComponent,
  BdTabsComponent,
  BdTooltipDirective,
  BdTourComponent,
  BdCountUpDirective,
  BdRevealDirective,
] as const;
