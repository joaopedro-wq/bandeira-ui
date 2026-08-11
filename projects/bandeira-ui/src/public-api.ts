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

/* ----------------------------------------------------------- Layout ----- */
export * from './lib/layout/bd-app-shell.component';
export * from './lib/layout/bd-auth-layout.component';
export * from './lib/layout/bd-container.component';
export * from './lib/layout/bd-page-header.component';

/* -------------------------------------------------------- Navegação ----- */
export * from './lib/accordion/bd-accordion.component';
export * from './lib/steps/bd-steps.component';
export * from './lib/tabs/bd-tab-panel.component';
export * from './lib/tabs/bd-tabs.component';

/* ------------------------------------------------------------- Dados ---- */
export * from './lib/table/bd-pagination.component';
export * from './lib/table/bd-table.component';

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

/* --------------------------------------------------------- Templates ---- */
export * from './lib/templates/bd-dashboard-template.component';
export * from './lib/templates/bd-list-template.component';
export * from './lib/templates/bd-settings-template.component';
export * from './lib/templates/bd-wizard-template.component';

/* ------------------------------------------------------------- Núcleo --- */
export * from './lib/core/bd-overlay-stack.service';
export * from './lib/core/bd-scroll-lock.service';

/* ------------------------------------------------------------ Conjunto --- */

import { BdAccordionComponent } from './lib/accordion/bd-accordion.component';
import { BdAlertComponent } from './lib/alert/bd-alert.component';
import { BdButtonComponent } from './lib/button/bd-button.component';
import { BdCardComponent } from './lib/card/bd-card.component';
import { BdChipComponent } from './lib/chip/bd-chip.component';
import { BdAvatarComponent } from './lib/content/bd-avatar.component';
import { BdBadgeComponent } from './lib/content/bd-badge.component';
import { BdEmptyStateComponent } from './lib/content/bd-empty-state.component';
import { BdAppShellComponent } from './lib/layout/bd-app-shell.component';
import { BdAuthLayoutComponent } from './lib/layout/bd-auth-layout.component';
import { BdContainerComponent } from './lib/layout/bd-container.component';
import { BdPageHeaderComponent } from './lib/layout/bd-page-header.component';
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
import { BdStepsComponent } from './lib/steps/bd-steps.component';
import { BdTabPanelComponent } from './lib/tabs/bd-tab-panel.component';
import { BdTabsComponent } from './lib/tabs/bd-tabs.component';
import { BdPaginationComponent } from './lib/table/bd-pagination.component';
import { BdTableComponent } from './lib/table/bd-table.component';
import { BdDashboardTemplateComponent } from './lib/templates/bd-dashboard-template.component';
import { BdListTemplateComponent } from './lib/templates/bd-list-template.component';
import { BdSettingsTemplateComponent } from './lib/templates/bd-settings-template.component';
import { BdWizardTemplateComponent } from './lib/templates/bd-wizard-template.component';
import { BdTooltipDirective } from './lib/tooltip/bd-tooltip.directive';
import { BdTourComponent } from './lib/tour/bd-tour.component';

/**
 * Conjunto completo da biblioteca, para importação única:
 *
 * ```ts
 * @Component({ imports: [BANDEIRA_UI] })
 * ```
 *
 * Conveniente em protótipos. Em produção, importe apenas o que a tela utiliza:
 * a eliminação de código não utilizado depende disso.
 */
export const BANDEIRA_UI = [
  BdAccordionComponent,
  BdAlertComponent,
  BdAppShellComponent,
  BdAuthLayoutComponent,
  BdAvatarComponent,
  BdBadgeComponent,
  BdButtonComponent,
  BdCardComponent,
  BdCheckboxComponent,
  BdChipComponent,
  BdContainerComponent,
  BdDashboardTemplateComponent,
  BdEmptyStateComponent,
  BdFieldComponent,
  BdInputComponent,
  BdListTemplateComponent,
  BdMetricComponent,
  BdModalComponent,
  BdPageHeaderComponent,
  BdPaginationComponent,
  BdProgressComponent,
  BdSettingsTemplateComponent,
  BdSkeletonComponent,
  BdSpinnerComponent,
  BdStepsComponent,
  BdSwitchComponent,
  BdTabPanelComponent,
  BdTableComponent,
  BdTabsComponent,
  BdTooltipDirective,
  BdTourComponent,
  BdWizardTemplateComponent,
  BdCountUpDirective,
  BdRevealDirective,
] as const;
