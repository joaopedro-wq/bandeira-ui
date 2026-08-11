import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';

export interface BdSettingsSection {
  /** Identificador usado na âncora e na seleção. */
  id: string;
  label: string;
  /** Texto auxiliar exibido abaixo do rótulo na navegação. */
  hint?: string;
}

/**
 * Estrutura de preferências: navegação por seções à esquerda, formulário à
 * direita e barra de gravação fixa ao pé da tela.
 *
 * A navegação é uma lista de âncoras reais, não um seletor decorativo: cada
 * seção permanece endereçável por URL, localizável pela busca do navegador e
 * acessível ao leitor de tela, que percorre o formulário inteiro em ordem.
 *
 * A barra de gravação só aparece quando há alterações pendentes — uma barra
 * permanentemente visível deixa de comunicar qualquer coisa.
 *
 * @example
 * ```html
 * <bd-settings-template
 *   title="Configurações"
 *   [sections]="secoes"
 *   [(activeSection)]="secaoAtual"
 *   [dirty]="formulario.dirty"
 * >
 *   <section id="perfil">…</section>
 *   <section id="notificacoes">…</section>
 *
 *   <button bdButton bdSettingsActions variant="ghost" (click)="restaurar()">Descartar</button>
 *   <button bdButton bdSettingsActions (click)="salvar()">Salvar alterações</button>
 * </bd-settings-template>
 * ```
 */
@Component({
  selector: 'bd-settings-template',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="bd-settings__head">
      <h1 class="bd-settings__title">{{ title() }}</h1>
      @if (description()) {
        <p class="bd-settings__desc">{{ description() }}</p>
      }
    </header>

    <div class="bd-settings__body">
      <nav class="bd-settings__nav" [attr.aria-label]="navLabel()">
        <ul>
          @for (section of sections(); track section.id) {
            <li>
              <a
                [href]="'#' + section.id"
                [class.is-active]="section.id === activeSection()"
                [attr.aria-current]="section.id === activeSection() ? 'true' : null"
                (click)="activeSection.set(section.id)"
              >
                <span class="bd-settings__nav-label">{{ section.label }}</span>
                @if (section.hint) {
                  <span class="bd-settings__nav-hint">{{ section.hint }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="bd-settings__content">
        <ng-content />
      </div>
    </div>

    @if (dirty()) {
      <!-- role="status": a barra é anunciada sem interromper a digitação. -->
      <div class="bd-settings__bar" role="status">
        <span class="bd-settings__bar-text">{{ dirtyLabel() }}</span>
        <div class="bd-settings__bar-actions">
          <ng-content select="[bdSettingsActions]" />
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      --bd-settings-nav-w: 232px;
      /* Espaço reservado para a barra fixa não cobrir o fim do formulário. */
      padding-bottom: var(--bd-space-7, 3rem);
    }

    .bd-settings__head {
      padding-bottom: var(--bd-space-5, 1.5rem);
      margin-bottom: var(--bd-space-6, 2rem);
      border-bottom: 1px solid var(--bd-border, #e3e7f0);
    }

    .bd-settings__title {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 1.9rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
      color: var(--bd-fg, #10131c);
    }

    .bd-settings__desc {
      max-width: 62ch;
      margin: 0.35rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-settings__body {
      display: grid;
      grid-template-columns: var(--bd-settings-nav-w) minmax(0, 1fr);
      align-items: start;
      gap: var(--bd-space-6, 2rem);
    }

    .bd-settings__nav {
      position: sticky;
      top: var(--bd-space-5, 1.5rem);
    }

    .bd-settings__nav ul {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .bd-settings__nav a {
      display: block;
      padding: 0.55rem 0.75rem;
      border-left: 2px solid transparent;
      border-radius: 0 var(--bd-radius-sm, 0.5rem) var(--bd-radius-sm, 0.5rem) 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.9rem;
      text-decoration: none;
      transition:
        color var(--bd-duration, 0.25s) ease,
        background var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease;
    }

    .bd-settings__nav a:hover {
      background: var(--bd-surface-hover, #f1f3f9);
      color: var(--bd-fg, #10131c);
    }

    .bd-settings__nav a.is-active {
      border-left-color: var(--bd-primary, #3d5ce8);
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      color: var(--bd-primary, #3d5ce8);
      font-weight: var(--bd-weight-semibold, 600);
    }

    .bd-settings__nav a:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-settings__nav-label {
      display: block;
    }

    .bd-settings__nav-hint {
      display: block;
      margin-top: 0.1rem;
      color: var(--bd-fg-subtle, #7b8399);
      font-size: var(--bd-text-xs, 0.75rem);
      font-weight: var(--bd-weight-normal, 400);
    }

    .bd-settings__content {
      display: flex;
      flex-direction: column;
      gap: var(--bd-space-6, 2rem);
      min-width: 0;
    }

    .bd-settings__bar {
      position: sticky;
      bottom: var(--bd-space-4, 1rem);
      z-index: var(--bd-z-sticky, 30);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--bd-space-3, 0.75rem);
      margin-top: var(--bd-space-6, 2rem);
      padding: var(--bd-space-3, 0.75rem) var(--bd-space-4, 1rem);
      background: var(--bd-bg, #fff);
      border: 1px solid var(--bd-border-strong, #cbd2e2);
      border-radius: var(--bd-radius, 0.875rem);
      box-shadow: var(--bd-shadow-lg, 0 24px 60px rgba(16, 19, 28, 0.12));
      animation: bd-settings-bar-in 0.22s var(--bd-ease, ease);
    }

    @keyframes bd-settings-bar-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .bd-settings__bar-text {
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.9rem;
      font-weight: var(--bd-weight-medium, 500);
    }

    .bd-settings__bar-actions {
      display: flex;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-settings__bar {
        animation: none;
      }
    }

    @media (max-width: 860px) {
      .bd-settings__body {
        grid-template-columns: minmax(0, 1fr);
        gap: var(--bd-space-5, 1.5rem);
      }

      /* A navegação vira uma faixa rolável horizontal acima do formulário. */
      .bd-settings__nav {
        position: static;
        overflow-x: auto;
      }

      .bd-settings__nav ul {
        flex-direction: row;
        gap: var(--bd-space-2, 0.5rem);
      }

      .bd-settings__nav a {
        white-space: nowrap;
        border-left: none;
        border-bottom: 2px solid transparent;
        border-radius: var(--bd-radius-sm, 0.5rem);
      }

      .bd-settings__nav a.is-active {
        border-left-color: transparent;
        border-bottom-color: var(--bd-primary, #3d5ce8);
      }

      .bd-settings__nav-hint {
        display: none;
      }
    }
  `,
})
export class BdSettingsTemplateComponent {
  readonly title = input.required<string>();
  readonly description = input('');

  readonly sections = input<readonly BdSettingsSection[]>([]);
  /** Two-way: `[(activeSection)]="secaoAtual"`. */
  readonly activeSection = model('');

  /** Revela a barra de gravação. Ligue ao estado do formulário. */
  readonly dirty = input(false, { transform: booleanAttribute });
  readonly dirtyLabel = input('Você tem alterações não salvas.');

  readonly navLabel = input('Seções de configuração');
}
