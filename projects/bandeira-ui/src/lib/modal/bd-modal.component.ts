import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  HostListener,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { BdOverlayStackService } from '../core/bd-overlay-stack.service';
import { BdScrollLockService } from '../core/bd-scroll-lock.service';

let instanceCount = 0;

/**
 * Diálogo modal acessível.
 *
 * Confina o foco (`cdkTrapFocus`), encerra com `Esc` ou clique no fundo, trava
 * a rolagem da página e devolve o foco ao elemento que o abriu. Abaixo de
 * 600px assume o formato de bottom sheet, ao alcance do polegar.
 *
 * Diálogos empilhados são coordenados: a trava de rolagem é contada por
 * referência e `Esc` encerra apenas o diálogo do topo da pilha.
 *
 * @example
 * ```html
 * <bd-modal [(open)]="confirmacaoAberta" title="Excluir projeto">
 *   <p>Esta ação não pode ser desfeita.</p>
 * </bd-modal>
 * ```
 */
@Component({
  selector: 'bd-modal',
  standalone: true,
  imports: [A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <div class="bd-modal__overlay" (click)="close()">
        <div
          class="bd-modal__panel"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? titleId : null"
          [attr.aria-label]="title() ? null : ariaLabel()"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
        >
          @if (dismissible()) {
            <button
              type="button"
              class="bd-modal__close"
              [attr.aria-label]="closeLabel()"
              (click)="close()"
            >
              &times;
            </button>
          }

          @if (title()) {
            <h2 class="bd-modal__title" [id]="titleId">{{ title() }}</h2>
          }

          <ng-content />
        </div>
      </div>
    }
  `,
  styles: `
    .bd-modal__overlay {
      position: fixed;
      inset: 0;
      z-index: var(--bd-z-modal, 200);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--bd-space-4, 1rem);
      background: rgba(3, 5, 10, 0.72);
      backdrop-filter: blur(6px);
      animation: bd-overlay-in 0.22s ease;
    }

    @keyframes bd-overlay-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .bd-modal__panel {
      position: relative;
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      padding: var(--bd-space-6, 2rem) var(--bd-space-5, 1.5rem) var(--bd-space-5, 1.5rem);
      background: var(--bd-bg, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-lg, 1.25rem);
      box-shadow: var(--bd-shadow-lg, 0 24px 60px rgba(16, 19, 28, 0.12));
      color: var(--bd-fg, #10131c);
      /* Animação em CSS puro: a biblioteca não obriga o consumidor a instalar
         @angular/animations nem a chamar provideAnimations(). */
      animation: bd-panel-in 0.28s var(--bd-ease, cubic-bezier(0.16, 1, 0.3, 1));
    }

    @keyframes bd-panel-in {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .bd-modal__panel:focus {
      outline: none;
    }

    .bd-modal__title {
      margin: 0 0 var(--bd-space-4, 1rem);
      font-size: var(--bd-text-2xl, 1.75rem);
      font-weight: var(--bd-weight-bold, 700);
    }

    .bd-modal__close {
      position: absolute;
      top: var(--bd-space-3, 0.75rem);
      right: var(--bd-space-3, 0.75rem);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      background: var(--bd-surface-hover, #f1f3f9);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: 50%;
      color: var(--bd-fg-muted, #545c70);
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      transition:
        color var(--bd-duration, 0.25s) ease,
        border-color var(--bd-duration, 0.25s) ease,
        background var(--bd-duration, 0.25s) ease;
    }

    .bd-modal__close:hover {
      background: var(--bd-primary-soft, rgba(61, 92, 232, 0.1));
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-modal__close:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-modal__overlay,
      .bd-modal__panel {
        animation: none;
      }
    }

    /* Em telas pequenas o diálogo vira bottom sheet. */
    @media (max-width: 600px) {
      .bd-modal__overlay {
        align-items: flex-end;
        padding: 0;
      }

      .bd-modal__panel {
        max-width: 100%;
        max-height: 88vh;
        border-radius: var(--bd-radius-lg, 1.25rem) var(--bd-radius-lg, 1.25rem) 0 0;
      }
    }
  `,
})
export class BdModalComponent {
  /** Two-way: `[(open)]="mostrar"`. */
  readonly open = model(false);
  readonly title = input('');
  /** Rótulo acessível quando o diálogo não tem título visível. */
  readonly ariaLabel = input('');
  /** Quando `false`, esconde o X e ignora `Esc` e clique no fundo. */
  readonly dismissible = input(true, { transform: booleanAttribute });
  readonly closeLabel = input('Fechar');

  protected readonly titleId = `bd-modal-title-${instanceCount++}`;

  private readonly document = inject(DOCUMENT);
  private readonly scrollLock = inject(BdScrollLockService);
  private readonly overlayStack = inject(BdOverlayStackService);

  private focusOrigin: HTMLElement | null = null;
  private locked = false;

  constructor() {
    // O efeito reage apenas às transições reais de estado: um diálogo fechado
    // nunca toca no documento, e cada `lock()` tem exatamente um `release()`.
    effect(() => (this.open() ? this.onOpen() : this.onClose()));

    inject(DestroyRef).onDestroy(() => this.onClose());
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    // Com diálogos empilhados, apenas o do topo responde ao atalho.
    if (this.open() && this.dismissible() && this.overlayStack.isTopmost(this)) {
      this.open.set(false);
    }
  }

  protected close(): void {
    if (this.dismissible()) {
      this.open.set(false);
    }
  }

  private onOpen(): void {
    if (this.locked) return;
    this.locked = true;

    this.focusOrigin = this.document.activeElement as HTMLElement | null;
    this.overlayStack.push(this);
    this.scrollLock.lock();
  }

  private onClose(): void {
    if (!this.locked) return;
    this.locked = false;

    this.overlayStack.remove(this);
    this.scrollLock.release();

    // `cdkTrapFocus` restaura o foco na interação; a devolução explícita cobre
    // o fechamento por código, quando não houve interação a restaurar.
    this.focusOrigin?.focus();
    this.focusOrigin = null;
  }
}
