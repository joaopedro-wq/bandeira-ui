/*
 * bandeira-ui — design system em Angular
 * API pública da biblioteca.
 */

/* --------------------------------------------------------------- Ações --- */
export * from './lib/button/bd-button.component';

/* -------------------------------------------------------- Formulários --- */
export * from './lib/field/bd-field.component';
export * from './lib/field/bd-input.component';

/* ---------------------------------------------------------- Feedback ----- */
export * from './lib/modal/bd-modal.component';

/* -------------------------------------------------------- Navegação ----- */
export * from './lib/tabs/bd-tab-panel.component';
export * from './lib/tabs/bd-tabs.component';

/* ------------------------------------------------ Conteúdo e dados ------- */
export * from './lib/card/bd-card.component';
export * from './lib/chip/bd-chip.component';
export * from './lib/metric/bd-metric.component';

/* --------------------------------------------------------- Diretivas ---- */
export * from './lib/directives/bd-count-up.directive';
export * from './lib/directives/bd-reveal.directive';

/* ------------------------------------------------------------ Conjunto --- */

import { BdButtonComponent } from './lib/button/bd-button.component';
import { BdCardComponent } from './lib/card/bd-card.component';
import { BdChipComponent } from './lib/chip/bd-chip.component';
import { BdFieldComponent } from './lib/field/bd-field.component';
import { BdInputComponent } from './lib/field/bd-input.component';
import { BdMetricComponent } from './lib/metric/bd-metric.component';
import { BdModalComponent } from './lib/modal/bd-modal.component';
import { BdTabPanelComponent } from './lib/tabs/bd-tab-panel.component';
import { BdTabsComponent } from './lib/tabs/bd-tabs.component';
import { BdCountUpDirective } from './lib/directives/bd-count-up.directive';
import { BdRevealDirective } from './lib/directives/bd-reveal.directive';

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
  BdButtonComponent,
  BdCardComponent,
  BdChipComponent,
  BdFieldComponent,
  BdInputComponent,
  BdMetricComponent,
  BdModalComponent,
  BdTabPanelComponent,
  BdTabsComponent,
  BdCountUpDirective,
  BdRevealDirective,
] as const;
