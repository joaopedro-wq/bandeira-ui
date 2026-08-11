import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Painel de conteúdo ligado a uma aba do `<bd-tabs>`.
 *
 * Recebe `role="tabpanel"` e o `aria-labelledby` apontando para a aba
 * correspondente, fechando o par que os leitores de tela esperam.
 *
 * @example
 * ```html
 * <bd-tabs [tabs]="abas" [(active)]="abaAtiva" />
 *
 * <bd-tab-panel tabId="design" [active]="abaAtiva()">
 *   Conteúdo da aba de design
 * </bd-tab-panel>
 * ```
 */
@Component({
  selector: 'bd-tab-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visivel()) {
      <ng-content />
    }
  `,
  host: {
    role: 'tabpanel',
    '[id]': '"bd-panel-" + tabId()',
    '[attr.aria-labelledby]': '"bd-tab-" + tabId()',
    '[hidden]': '!visivel()',
    // Painel focável pelo teclado quando não há elemento interativo dentro.
    '[attr.tabindex]': 'visivel() ? 0 : null',
  },
  styles: `
    :host {
      display: block;
      outline: none;
    }

    /* Sem isto o display:block acima venceria o [hidden] do UA stylesheet
       e todos os painéis apareceriam ao mesmo tempo. */
    :host([hidden]) {
      display: none;
    }

    :host(:focus-visible) {
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
      border-radius: var(--bd-radius-sm, 0.5rem);
    }
  `,
})
export class BdTabPanelComponent {
  /** Deve casar com o `id` da aba correspondente em `<bd-tabs>`. */
  readonly tabId = input.required<string>();
  /** O `id` da aba ativa no momento. */
  readonly active = input.required<string>();

  protected readonly visivel = computed(() => this.active() === this.tabId());
}
