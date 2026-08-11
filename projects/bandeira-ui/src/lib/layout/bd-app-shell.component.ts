import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';

/**
 * Estrutura de aplicação: cabeçalho fixo, barra lateral e área de conteúdo.
 *
 * No desktop a lateral fica fixa; abaixo de 900px ela vira gaveta sobreposta,
 * com fundo escuro clicável para fechar. O `<main>` é marcado como
 * `id="conteudo"`, alvo do link "pular para o conteúdo".
 *
 * @example
 * ```html
 * <bd-app-shell [(sidebarOpen)]="menuAberto">
 *   <a bdAppShellBrand href="/">Minha Empresa</a>
 *   <nav bdAppShellNav>…</nav>
 *   <button bdAppShellActions bdButton size="sm">Novo</button>
 *
 *   <router-outlet />
 * </bd-app-shell>
 * ```
 */
@Component({
  selector: 'bd-app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="bd-shell__skip" href="#conteudo">{{ skipLabel() }}</a>

    <header class="bd-shell__header">
      <div class="bd-shell__header-left">
        <button
          type="button"
          class="bd-shell__toggle"
          [attr.aria-expanded]="sidebarOpen()"
          aria-controls="bd-shell-sidebar"
          [attr.aria-label]="sidebarOpen() ? closeMenuLabel() : openMenuLabel()"
          (click)="toggle()"
        >
          {{ sidebarOpen() ? '✕' : '☰' }}
        </button>

        <div class="bd-shell__brand">
          <ng-content select="[bdAppShellBrand]" />
        </div>
      </div>

      <div class="bd-shell__actions">
        <ng-content select="[bdAppShellActions]" />
      </div>
    </header>

    <div class="bd-shell__body">
      <aside
        id="bd-shell-sidebar"
        class="bd-shell__sidebar"
        [class.is-open]="sidebarOpen()"
        [attr.aria-label]="navLabel()"
      >
        <ng-content select="[bdAppShellNav]" />
      </aside>

      <!-- Fundo clicável só existe quando a gaveta está aberta no mobile. -->
      @if (sidebarOpen()) {
        <div class="bd-shell__scrim" (click)="sidebarOpen.set(false)"></div>
      }

      <main id="conteudo" class="bd-shell__main">
        <ng-content />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bd-bg, #fff);
      color: var(--bd-fg, #10131c);
      --bd-shell-header-h: 60px;
      --bd-shell-sidebar-w: 248px;
    }

    .bd-shell__skip {
      position: absolute;
      left: -9999px;
      z-index: 100;
      padding: 0.75rem 1.25rem;
      background: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary-contrast, #fff);
      text-decoration: none;
    }
    .bd-shell__skip:focus {
      left: 0;
    }

    /* ---------------------------------------------------------- header --- */

    .bd-shell__header {
      position: sticky;
      top: 0;
      z-index: 40;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--bd-space-4, 1rem);
      height: var(--bd-shell-header-h);
      padding-inline: var(--bd-space-4, 1rem);
      background: var(--bd-bg, #fff);
      border-bottom: 1px solid var(--bd-border, #e3e7f0);
    }

    .bd-shell__header-left {
      display: flex;
      align-items: center;
      gap: var(--bd-space-3, 0.75rem);
      min-width: 0;
    }

    .bd-shell__brand {
      font-weight: var(--bd-weight-bold, 700);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bd-shell__actions {
      display: flex;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
      flex-shrink: 0;
    }

    .bd-shell__toggle {
      display: none;
      place-items: center;
      width: 38px;
      height: 38px;
      background: transparent;
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg-muted, #545c70);
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
    }
    .bd-shell__toggle:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    /* ------------------------------------------------------------ body --- */

    .bd-shell__body {
      display: grid;
      grid-template-columns: var(--bd-shell-sidebar-w) minmax(0, 1fr);
      align-items: start;
    }

    .bd-shell__sidebar {
      position: sticky;
      top: var(--bd-shell-header-h);
      height: calc(100vh - var(--bd-shell-header-h));
      overflow-y: auto;
      padding: var(--bd-space-5, 1.5rem) var(--bd-space-3, 0.75rem);
      background: var(--bd-bg-elevated, #f8fafc);
      border-right: 1px solid var(--bd-border, #e3e7f0);
    }

    .bd-shell__main {
      min-width: 0;
      padding: var(--bd-space-6, 2rem) var(--bd-space-5, 1.5rem) var(--bd-space-7, 3rem);
    }

    .bd-shell__scrim {
      display: none;
    }

    /* ------------------------------------------------------ responsivo --- */

    @media (max-width: 900px) {
      .bd-shell__toggle {
        display: grid;
      }

      .bd-shell__body {
        grid-template-columns: minmax(0, 1fr);
      }

      /* A lateral vira gaveta sobreposta. */
      .bd-shell__sidebar {
        position: fixed;
        top: var(--bd-shell-header-h);
        left: 0;
        bottom: 0;
        z-index: 45;
        width: var(--bd-shell-sidebar-w);
        height: auto;
        transform: translateX(-100%);
        transition: transform var(--bd-duration, 0.25s) var(--bd-ease, ease);
        box-shadow: var(--bd-shadow-lg, 0 24px 60px rgba(0, 0, 0, 0.2));
      }

      .bd-shell__sidebar.is-open {
        transform: none;
      }

      .bd-shell__scrim {
        display: block;
        position: fixed;
        inset: var(--bd-shell-header-h) 0 0 0;
        z-index: 44;
        background: rgba(3, 5, 10, 0.5);
      }

      .bd-shell__main {
        padding-inline: var(--bd-space-4, 1rem);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-shell__sidebar {
        transition: none;
      }
    }
  `,
})
export class BdAppShellComponent {
  /** Two-way: `[(sidebarOpen)]="menuAberto"`. Só afeta o mobile. */
  readonly sidebarOpen = model(false);
  /** Esconde o botão de menu — útil quando não há navegação lateral. */
  readonly hideToggle = input(false, { transform: booleanAttribute });

  readonly skipLabel = input('Pular para o conteúdo');
  readonly openMenuLabel = input('Abrir menu');
  readonly closeMenuLabel = input('Fechar menu');
  readonly navLabel = input('Navegação principal');

  protected toggle() {
    this.sidebarOpen.update((v) => !v);
  }
}
