import { ChangeDetectionStrategy, Component, ElementRef, inject, input, model } from '@angular/core';

export interface BdTab {
  id: string;
  label: string;
  /** Classe de ícone opcional (ex.: 'fas fa-code'). */
  icon?: string;
  disabled?: boolean;
}

/**
 * Navegação por abas seguindo o padrão WAI-ARIA de `tablist`.
 *
 * Setas ←/→ movem entre as abas, `Home`/`End` vão para as pontas e o foco
 * acompanha a seleção. Abas desabilitadas são puladas na navegação.
 *
 * Use com `<bd-tab-panel>` para que o painel também receba os papéis corretos.
 *
 * @example
 * ```html
 * <bd-tabs [tabs]="abas" [(active)]="abaAtiva" label="Seções" />
 *
 * <bd-tab-panel tabId="design" [active]="abaAtiva()">
 *   Conteúdo da aba
 * </bd-tab-panel>
 * ```
 */
@Component({
  selector: 'bd-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bd-tabs" role="tablist" [attr.aria-label]="label()">
      @for (tab of tabs(); track tab.id; let i = $index) {
        <button
          type="button"
          role="tab"
          class="bd-tabs__tab"
          [id]="'bd-tab-' + tab.id"
          [class.is-active]="active() === tab.id"
          [attr.aria-selected]="active() === tab.id"
          [attr.aria-controls]="'bd-panel-' + tab.id"
          [attr.tabindex]="active() === tab.id ? 0 : -1"
          [disabled]="tab.disabled || null"
          (click)="select(tab)"
          (keydown)="onKeydown($event, i)"
        >
          @if (tab.icon) {
            <i [class]="tab.icon" aria-hidden="true"></i>
          }
          {{ tab.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .bd-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-tabs__tab {
      display: inline-flex;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
      min-height: 44px;
      padding: 0.55rem 1.15rem;
      background: var(--bd-surface, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-full, 9999px);
      color: var(--bd-fg-muted, #545c70);
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: var(--bd-weight-semibold, 600);
      cursor: pointer;
      transition: color var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease, background var(--bd-duration, 0.25s) ease,
        transform var(--bd-duration-fast, 0.15s) var(--bd-ease, ease);
    }

    .bd-tabs__tab:hover:not(:disabled) {
      color: var(--bd-fg, #10131c);
      border-color: var(--bd-border-strong, #cbd2e2);
      transform: translateY(-2px);
    }

    .bd-tabs__tab:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-tabs__tab:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bd-tabs__tab.is-active {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-tabs__tab,
      .bd-tabs__tab:hover:not(:disabled) {
        transition: none;
        transform: none;
      }
    }
  `,
})
export class BdTabsComponent {
  readonly tabs = input.required<BdTab[]>();
  /** Two-way: `[(active)]="minhaAba"`. */
  readonly active = model.required<string>();
  readonly label = input('Abas');

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  select(tab: BdTab) {
    if (!tab.disabled) {
      this.active.set(tab.id);
    }
  }

  onKeydown(event: KeyboardEvent, index: number) {
    const tabs = this.tabs();
    const total = tabs.length;
    let destino: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        destino = this.proximaHabilitada(index, 1);
        break;
      case 'ArrowLeft':
        destino = this.proximaHabilitada(index, -1);
        break;
      case 'Home':
        destino = this.proximaHabilitada(-1, 1);
        break;
      case 'End':
        destino = this.proximaHabilitada(total, -1);
        break;
    }

    if (destino === null) return;

    event.preventDefault();
    this.active.set(tabs[destino].id);

    // Move o foco junto com a seleção, como manda o padrão de tablist.
    this.host.nativeElement
      .querySelectorAll<HTMLButtonElement>('.bd-tabs__tab')
      [destino]?.focus();
  }

  /** Caminha na direção dada pulando abas desabilitadas, com volta circular. */
  private proximaHabilitada(inicio: number, passo: number): number | null {
    const tabs = this.tabs();
    const total = tabs.length;

    for (let i = 1; i <= total; i++) {
      const idx = (((inicio + passo * i) % total) + total) % total;
      if (!tabs[idx].disabled) return idx;
    }

    return null;
  }
}
