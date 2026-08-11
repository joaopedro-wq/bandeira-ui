import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';

export type BdButtonVariant = 'primary' | 'ghost' | 'subtle' | 'danger';
export type BdButtonSize = 'sm' | 'md' | 'lg';

/**
 * Botão do design system.
 *
 * Usa seletor de atributo para aplicar em `<button>` ou `<a>` sem elemento
 * extra no DOM e sem perder a semântica nativa (foco, Enter, `href`).
 *
 * @example
 * ```html
 * <button bdButton>Salvar</button>
 * <button bdButton variant="ghost" size="sm">Cancelar</button>
 * <button bdButton [loading]="salvando()">Enviar</button>
 * <button bdButton iconOnly aria-label="Fechar"><i class="fas fa-times"></i></button>
 * <a bdButton variant="subtle" href="/docs">Documentação</a>
 * ```
 */
@Component({
  selector: 'button[bdButton], a[bdButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <span class="bd-button__spinner" aria-hidden="true"></span>
    }
    <span class="bd-button__content"><ng-content /></span>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.aria-busy]': 'loading() ? true : null',
    '[attr.disabled]': 'isDisabled() || null',
    '[attr.tabindex]': 'isDisabled() ? -1 : null',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--bd-space-2, 0.5rem);
      border: 1px solid transparent;
      border-radius: var(--bd-radius-sm, 0.5rem);
      font-family: inherit;
      font-weight: var(--bd-weight-semibold, 600);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      transition: background var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease, color var(--bd-duration, 0.25s) ease,
        transform var(--bd-duration-fast, 0.15s) var(--bd-ease, ease),
        box-shadow var(--bd-duration, 0.25s) ease;
    }

    :host(:hover:not([disabled])) {
      transform: translateY(-2px);
    }
    :host(:active:not([disabled])) {
      transform: translateY(0);
    }

    :host(:focus-visible) {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    :host([disabled]),
    :host([aria-busy='true']) {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      pointer-events: none;
    }

    /* As classes de variante ficam no elemento host, então precisam de
       :host(.classe) — um seletor solto só alcançaria filhos do template. */

    /* Tamanhos — 44px de altura mínima no md/lg garante alvo de toque. */
    :host(.bd-button--sm) {
      min-height: 38px;
      padding: 0.45rem 0.95rem;
      font-size: var(--bd-text-sm, 0.875rem);
    }
    :host(.bd-button--md) {
      min-height: 44px;
      padding: 0.7rem 1.4rem;
      font-size: 0.95rem;
    }
    :host(.bd-button--lg) {
      min-height: 52px;
      padding: 0.9rem 1.9rem;
      font-size: var(--bd-text-lg, 1.125rem);
    }

    /* Ícone sozinho: quadrado, sem padding lateral extra. */
    :host(.bd-button--icon.bd-button--sm) {
      width: 38px;
      padding: 0;
    }
    :host(.bd-button--icon.bd-button--md) {
      width: 44px;
      padding: 0;
    }
    :host(.bd-button--icon.bd-button--lg) {
      width: 52px;
      padding: 0;
    }

    :host(.bd-button--block) {
      display: flex;
      width: 100%;
    }

    /* Variantes */
    :host(.bd-button--primary) {
      background: var(--bd-primary-strong, #2b46c9);
      color: var(--bd-primary-contrast, #fff);
    }
    :host(.bd-button--primary:hover:not([disabled])) {
      background: var(--bd-primary, #3d5ce8);
    }

    :host(.bd-button--ghost) {
      background: transparent;
      border-color: var(--bd-border-strong, #cbd2e2);
      color: var(--bd-fg, #10131c);
    }
    :host(.bd-button--ghost:hover:not([disabled])) {
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
    }

    :host(.bd-button--subtle) {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      color: var(--bd-primary, #3d5ce8);
    }
    :host(.bd-button--subtle:hover:not([disabled])) {
      background: var(--bd-surface-hover, #f1f3f9);
    }

    :host(.bd-button--danger) {
      background: var(--bd-danger, #dc2626);
      color: var(--bd-danger-contrast, #fff);
    }
    :host(.bd-button--danger:hover:not([disabled])) {
      filter: brightness(1.1);
    }

    .bd-button__content {
      display: inline-flex;
      align-items: center;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-button__spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: bd-spin 0.7s linear infinite;
    }

    @keyframes bd-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      :host,
      :host(:hover:not([disabled])) {
        transition: none;
        transform: none;
      }
      .bd-button__spinner {
        animation-duration: 1.6s;
      }
    }
  `,
})
export class BdButtonComponent {
  readonly variant = input<BdButtonVariant>('primary');
  readonly size = input<BdButtonSize>('md');
  /** Ocupa toda a largura disponível. */
  readonly block = input(false, { transform: booleanAttribute });
  /** Mostra o spinner e bloqueia a interação. */
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Botão quadrado só com ícone — exige `aria-label`. */
  readonly iconOnly = input(false, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly isDisabled = computed(() => this.disabled() || this.loading());

  protected readonly classes = computed(() =>
    [
      `bd-button--${this.variant()}`,
      `bd-button--${this.size()}`,
      this.block() ? 'bd-button--block' : '',
      this.iconOnly() ? 'bd-button--icon' : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  constructor() {
    // Um botão só de ícone sem rótulo acessível é invisível para leitor de
    // tela. Avisa em desenvolvimento; em produção o aviso é removido do bundle.
    if (ngDevMode) {
      afterNextRender(() => {
        const el = this.host.nativeElement;
        if (this.iconOnly() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          console.warn(
            '[bandeira-ui] <button bdButton iconOnly> precisa de aria-label ou aria-labelledby ' +
              'para ser anunciado por leitores de tela.',
            el
          );
        }
      });
    }
  }
}

declare const ngDevMode: boolean | undefined;
