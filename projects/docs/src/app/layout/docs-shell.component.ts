import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../shared/theme.service';

interface NavGroup {
  label: string;
  items: { path: string; label: string }[];
}

@Component({
  selector: 'docs-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#conteudo">Pular para o conteúdo</a>

    <header class="header">
      <div class="header__inner">
        <a routerLink="/" class="brand" (click)="fecharMenu()">
          <span class="brand__mark" aria-hidden="true">bd</span>
          <span class="brand__name">bandeira-ui</span>
          <span class="brand__version">v{{ versao }}</span>
        </a>

        <div class="header__actions">
          <button
            type="button"
            class="icon-btn"
            [attr.aria-label]="theme.isDark() ? 'Ativar tema claro' : 'Ativar tema escuro'"
            (click)="theme.toggle()"
          >
            {{ theme.isDark() ? '☀' : '☾' }}
          </button>

          <a class="ghost-link" [href]="github" target="_blank" rel="noopener">GitHub</a>

          <button
            type="button"
            class="icon-btn menu-toggle"
            [attr.aria-expanded]="menuAberto()"
            aria-controls="docs-nav"
            [attr.aria-label]="menuAberto() ? 'Fechar menu' : 'Abrir menu'"
            (click)="alternarMenu()"
          >
            {{ menuAberto() ? '✕' : '☰' }}
          </button>
        </div>
      </div>
    </header>

    <div class="layout">
      <nav id="docs-nav" class="nav" [class.is-open]="menuAberto()" aria-label="Documentação">
        @for (group of grupos; track group.label) {
          <div class="nav__group">
            <span class="nav__label">{{ group.label }}</span>
            <ul>
              @for (item of group.items; track item.path) {
                <li>
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="is-active"
                    [routerLinkActiveOptions]="{ exact: true }"
                    (click)="fecharMenu()"
                    >{{ item.label }}</a
                  >
                </li>
              }
            </ul>
          </div>
        }
      </nav>

      <main id="conteudo" class="content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: `
    :host {
      display: block;
      --header-h: 64px;
    }

    .skip {
      position: absolute;
      left: -9999px;
      z-index: 1000;
      padding: 0.75rem 1.25rem;
      background: var(--bd-primary);
      color: var(--bd-primary-contrast);
    }
    .skip:focus {
      left: 0;
    }

    /* ------------------------------------------------------------ header */

    .header {
      position: sticky;
      top: 0;
      z-index: 60;
      height: var(--header-h);
      background: color-mix(in srgb, var(--bd-bg) 88%, transparent);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--bd-border);
    }

    .header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      height: var(--header-h);
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--bd-fg);
      font-weight: 700;
    }

    .brand__mark {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      background: var(--bd-gradient);
      border-radius: 8px;
      color: #fff;
      font-size: 0.78rem;
      letter-spacing: -0.02em;
    }

    .brand__version {
      padding: 0.1rem 0.45rem;
      background: var(--bd-primary-soft);
      border-radius: var(--bd-radius-full);
      color: var(--bd-primary);
      font-family: var(--bd-font-mono);
      font-size: 0.68rem;
      font-weight: 600;
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .icon-btn {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      background: transparent;
      border: 1px solid var(--bd-border);
      border-radius: var(--bd-radius-sm);
      color: var(--bd-fg-muted);
      font-size: 1rem;
      cursor: pointer;
      transition: color 0.2s ease, border-color 0.2s ease;
    }
    .icon-btn:hover {
      color: var(--bd-primary);
      border-color: var(--bd-primary);
    }
    .icon-btn:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring);
    }

    .ghost-link {
      color: var(--bd-fg-muted);
      font-size: 0.88rem;
      font-weight: 600;
    }
    .ghost-link:hover {
      color: var(--bd-primary);
    }

    .menu-toggle {
      display: none;
    }

    /* ------------------------------------------------------------ layout */

    .layout {
      display: grid;
      grid-template-columns: 236px minmax(0, 1fr);
      gap: 3rem;
      max-width: 1320px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .nav {
      position: sticky;
      top: calc(var(--header-h) + 1.5rem);
      align-self: start;
      max-height: calc(100vh - var(--header-h) - 3rem);
      overflow-y: auto;
      padding: 2rem 0;
    }

    .nav__group + .nav__group {
      margin-top: 1.5rem;
    }

    .nav__label {
      display: block;
      margin-bottom: 0.5rem;
      padding-left: 0.75rem;
      color: var(--bd-fg-subtle);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .nav ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }

    .nav a {
      display: block;
      padding: 0.42rem 0.75rem;
      border-left: 2px solid transparent;
      border-radius: 0 var(--bd-radius-sm) var(--bd-radius-sm) 0;
      color: var(--bd-fg-muted);
      font-size: 0.89rem;
      transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
    }

    .nav a:hover {
      color: var(--bd-fg);
      background: var(--bd-surface-hover);
    }

    .nav a.is-active {
      border-left-color: var(--bd-primary);
      background: var(--bd-primary-soft);
      color: var(--bd-primary);
      font-weight: 600;
    }

    .content {
      min-width: 0;
      padding: 2.5rem 0 6rem;
    }

    /* -------------------------------------------------------- responsivo */

    @media (max-width: 900px) {
      .menu-toggle {
        display: grid;
      }

      .layout {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .nav {
        position: fixed;
        inset: var(--header-h) 0 auto 0;
        z-index: 50;
        max-height: 0;
        padding: 0 1.5rem;
        overflow: hidden;
        background: var(--bd-bg-elevated);
        border-bottom: 1px solid var(--bd-border);
        visibility: hidden;
        transition: max-height 0.3s ease, padding 0.3s ease, visibility 0.3s;
      }

      .nav.is-open {
        max-height: calc(100vh - var(--header-h));
        padding: 1.25rem 1.5rem 2rem;
        overflow-y: auto;
        visibility: visible;
      }
    }
  `,
})
export class DocsShellComponent {
  readonly theme = inject(ThemeService);
  readonly versao = '0.1.0';
  readonly github = 'https://github.com/joaopedro-wq/bandeira-ui';

  readonly menuAberto = signal(false);

  readonly grupos: NavGroup[] = [
    {
      label: 'Começando',
      items: [
        { path: '/', label: 'Introdução' },
        { path: '/instalacao', label: 'Instalação' },
        { path: '/tokens', label: 'Tokens e temas' },
      ],
    },
    {
      label: 'Ações',
      items: [{ path: '/componentes/button', label: 'Button' }],
    },
    {
      label: 'Formulários',
      items: [
        { path: '/componentes/field', label: 'Field & Input' },
        { path: '/componentes/controles', label: 'Switch & Checkbox' },
      ],
    },
    {
      label: 'Navegação',
      items: [
        { path: '/componentes/tabs', label: 'Tabs' },
        { path: '/componentes/accordion', label: 'Accordion' },
      ],
    },
    {
      label: 'Feedback',
      items: [
        { path: '/componentes/modal', label: 'Modal' },
        { path: '/componentes/feedback', label: 'Alert, Spinner…' },
      ],
    },
    {
      label: 'Sobreposição',
      items: [
        { path: '/componentes/tooltip', label: 'Tooltip' },
        { path: '/componentes/tour', label: 'Tour guiado ★' },
      ],
    },
    {
      label: 'Conteúdo',
      items: [
        { path: '/componentes/card', label: 'Card' },
        { path: '/componentes/chip', label: 'Chip' },
        { path: '/componentes/conteudo', label: 'Avatar & Badge' },
        { path: '/componentes/metric', label: 'Metric' },
      ],
    },
    {
      label: 'Diretivas',
      items: [
        { path: '/diretivas/reveal', label: 'Reveal' },
        { path: '/diretivas/count-up', label: 'CountUp' },
      ],
    },
  ];

  alternarMenu() {
    this.menuAberto.update((v) => !v);
  }

  fecharMenu() {
    this.menuAberto.set(false);
  }
}
