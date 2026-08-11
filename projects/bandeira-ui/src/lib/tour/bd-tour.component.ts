import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { BdTourPlacement, BdTourService } from './bd-tour.service';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PopoverPosition {
  top: number;
  left: number;
  side: Exclude<BdTourPlacement, 'auto'> | 'center';
}

const SPOT_PADDING = 8;
const POPOVER_GAP = 14;
const POPOVER_WIDTH = 320;
const POPOVER_FALLBACK_HEIGHT = 220;
const VIEWPORT_MARGIN = 16;

/** Tempo estimado para a rolagem suave assentar antes da medição. */
const SCROLL_SETTLE_MS = 320;

/**
 * Camada de apresentação do tour guiado. Monte uma única vez, normalmente no
 * componente raiz:
 *
 * ```html
 * <router-outlet />
 * <bd-tour />
 * ```
 *
 * O controle pertence ao {@link BdTourService}. O destaque recorta o elemento
 * alvo por meio de uma sombra projetada maior que a área visível, o balão é
 * posicionado no primeiro lado com espaço disponível e recebe o foco a cada
 * passo — `Esc` encerra, setas navegam.
 */
@Component({
  selector: 'bd-tour',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tour.active() && tour.step(); as step) {
      <div class="bd-tour" role="presentation">
        <!-- A sombra projetada maior que a tela escurece tudo, exceto este
             retângulo — o recorte não exige SVG nem máscara. -->
        <div
          class="bd-tour__spot"
          [class.bd-tour__spot--empty]="!hasTarget()"
          [style.top.px]="spot().top"
          [style.left.px]="spot().left"
          [style.width.px]="spot().width"
          [style.height.px]="spot().height"
        ></div>

        <!-- Captura o clique fora sem cobrir o alvo destacado. -->
        <div class="bd-tour__catch" (click)="tour.skip()"></div>

        <div
          #popover
          class="bd-tour__popover"
          [class]="'bd-tour__popover--' + position().side"
          [style.top.px]="position().top"
          [style.left.px]="position().left"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          [attr.aria-describedby]="contentId"
          tabindex="-1"
        >
          <span class="bd-tour__arrow" aria-hidden="true"></span>

          <span class="bd-tour__counter">
            {{ tour.labels().counter(tour.index() + 1, tour.total()) }}
          </span>

          <h2 class="bd-tour__title" [id]="titleId">{{ step.title }}</h2>
          <p class="bd-tour__content" [id]="contentId">{{ step.content }}</p>

          <div class="bd-tour__dots" aria-hidden="true">
            @for (s of tour.steps(); track $index) {
              <span class="bd-tour__dot" [class.is-active]="$index === tour.index()"></span>
            }
          </div>

          <div class="bd-tour__actions">
            <button type="button" class="bd-tour__skip" (click)="tour.skip()">
              {{ tour.labels().skip }}
            </button>

            <div class="bd-tour__nav">
              @if (!tour.isFirst()) {
                <button type="button" class="bd-tour__btn" (click)="tour.prev()">
                  {{ tour.labels().prev }}
                </button>
              }
              <button
                type="button"
                class="bd-tour__btn bd-tour__btn--primary"
                (click)="tour.next()"
              >
                {{ step.nextLabel ?? (tour.isLast() ? tour.labels().finish : tour.labels().next) }}
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .bd-tour {
      position: fixed;
      inset: 0;
      z-index: var(--bd-z-tooltip, 400);
      pointer-events: none;
    }

    /* O recorte é feito por uma sombra maior que a tela: tudo escurece,
       menos a área do próprio elemento. Sem SVG, sem máscara. */
    .bd-tour__spot {
      position: fixed;
      border-radius: var(--bd-radius, 0.875rem);
      box-shadow: 0 0 0 9999px rgba(3, 5, 10, 0.68);
      outline: 2px solid var(--bd-primary, #3d5ce8);
      outline-offset: 2px;
      transition:
        top 0.3s var(--bd-ease, ease),
        left 0.3s var(--bd-ease, ease),
        width 0.3s var(--bd-ease, ease),
        height 0.3s var(--bd-ease, ease);
      pointer-events: none;
    }

    /* Passo sem alvo: apenas o escurecimento, sem anel de destaque. */
    .bd-tour__spot--empty {
      outline: none;
    }

    .bd-tour__catch {
      position: fixed;
      inset: 0;
      pointer-events: auto;
    }

    .bd-tour__popover {
      position: fixed;
      width: 320px;
      max-width: calc(100vw - 2rem);
      padding: 1.25rem 1.35rem 1.1rem;
      background: var(--bd-bg, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-lg, 1.25rem);
      box-shadow: var(--bd-shadow-lg, 0 24px 60px rgba(16, 19, 28, 0.35));
      color: var(--bd-fg, #10131c);
      pointer-events: auto;
      animation: bd-tour-in 0.24s var(--bd-ease, ease);
      transition:
        top 0.3s var(--bd-ease, ease),
        left 0.3s var(--bd-ease, ease);
    }

    .bd-tour__popover:focus {
      outline: none;
    }

    @keyframes bd-tour-in {
      from {
        opacity: 0;
        transform: scale(0.96);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }

    .bd-tour__arrow {
      position: absolute;
      width: 10px;
      height: 10px;
      background: var(--bd-bg, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      transform: rotate(45deg);
    }

    .bd-tour__popover--bottom .bd-tour__arrow {
      top: -6px;
      left: 28px;
      border-right: none;
      border-bottom: none;
    }
    .bd-tour__popover--top .bd-tour__arrow {
      bottom: -6px;
      left: 28px;
      border-left: none;
      border-top: none;
    }
    .bd-tour__popover--right .bd-tour__arrow {
      left: -6px;
      top: 24px;
      border-right: none;
      border-top: none;
    }
    .bd-tour__popover--left .bd-tour__arrow {
      right: -6px;
      top: 24px;
      border-left: none;
      border-bottom: none;
    }
    .bd-tour__popover--center .bd-tour__arrow {
      display: none;
    }

    .bd-tour__counter {
      display: block;
      margin-bottom: 0.35rem;
      color: var(--bd-primary, #3d5ce8);
      font-size: var(--bd-text-xs, 0.75rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .bd-tour__title {
      margin: 0 0 0.4rem;
      font-size: var(--bd-text-lg, 1.125rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.015em;
    }

    .bd-tour__content {
      margin: 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .bd-tour__dots {
      display: flex;
      gap: 5px;
      margin: 1rem 0 0.9rem;
    }

    .bd-tour__dot {
      width: 6px;
      height: 6px;
      background: var(--bd-border-strong, #cbd2e2);
      border-radius: 50%;
      transition:
        background 0.2s ease,
        width 0.2s ease;
    }

    .bd-tour__dot.is-active {
      width: 18px;
      background: var(--bd-primary, #3d5ce8);
      border-radius: var(--bd-radius-full, 9999px);
    }

    .bd-tour__actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    .bd-tour__nav {
      display: flex;
      gap: 0.4rem;
    }

    .bd-tour__btn,
    .bd-tour__skip {
      min-height: 36px;
      padding: 0.4rem 0.9rem;
      border-radius: var(--bd-radius-sm, 0.5rem);
      font-family: inherit;
      font-size: 0.85rem;
      font-weight: var(--bd-weight-semibold, 600);
      cursor: pointer;
      transition:
        background 0.2s ease,
        color 0.2s ease,
        border-color 0.2s ease;
    }

    .bd-tour__skip {
      padding-left: 0;
      background: none;
      border: none;
      color: var(--bd-fg-subtle, #7b8399);
    }
    .bd-tour__skip:hover {
      color: var(--bd-fg, #10131c);
    }

    .bd-tour__btn {
      background: transparent;
      border: 1px solid var(--bd-border-strong, #cbd2e2);
      color: var(--bd-fg, #10131c);
    }
    .bd-tour__btn:hover {
      border-color: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary, #3d5ce8);
    }

    .bd-tour__btn--primary {
      background: var(--bd-primary-strong, #2b46c9);
      border-color: transparent;
      color: var(--bd-primary-contrast, #fff);
    }
    .bd-tour__btn--primary:hover {
      background: var(--bd-primary, #3d5ce8);
      color: var(--bd-primary-contrast, #fff);
    }

    .bd-tour__btn:focus-visible,
    .bd-tour__skip:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.4));
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-tour__spot,
      .bd-tour__popover,
      .bd-tour__dot {
        transition: none;
        animation: none;
      }
    }
  `,
})
export class BdTourComponent {
  readonly tour = inject(BdTourService);

  /** Espaço extra em volta do elemento destacado. */
  readonly spotPadding = input(SPOT_PADDING);
  /** Rola o alvo até o centro da área visível antes de destacá-lo. */
  readonly scrollIntoView = input(true);

  private readonly document = inject(DOCUMENT);
  private readonly popover = viewChild<ElementRef<HTMLElement>>('popover');

  protected readonly titleId = 'bd-tour-title';
  protected readonly contentId = 'bd-tour-content';

  protected readonly spot = signal<Rect>({ top: 0, left: 0, width: 0, height: 0 });
  protected readonly position = signal<PopoverPosition>({ top: 0, left: 0, side: 'center' });
  protected readonly hasTarget = signal(false);

  private settleTimer?: ReturnType<typeof setTimeout>;
  private frame?: number;

  /**
   * Reagenda a medição no ritmo do compositor.
   *
   * Rolagem e redimensionamento apenas remedem: **não** movem o foco. Medir e
   * focar são operações distintas justamente porque a rolagem suave do próprio
   * passo emite dezenas de eventos — devolver o foco em cada um deles tornaria
   * a página impossível de percorrer durante o tour.
   */
  private readonly onViewportChange = () => {
    if (!this.tour.active()) return;

    const view = this.document.defaultView;
    if (!view) return;

    if (this.frame !== undefined) view.cancelAnimationFrame(this.frame);
    this.frame = view.requestAnimationFrame(() => {
      this.frame = undefined;
      this.measure();
    });
  };

  constructor() {
    // Cada mudança de passo remede e devolve o foco ao balão — uma única vez.
    effect(() => {
      const step = this.tour.step();
      const active = this.tour.active();
      const scroll = this.scrollIntoView();

      clearTimeout(this.settleTimer);
      if (!active || !step) return;

      const target = this.resolveTarget(step.target);
      const shouldScroll = !!target && scroll;

      if (shouldScroll) {
        target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      }

      // A medição espera a rolagem assentar; sem rolagem, apenas o próximo
      // ciclo de tarefas, para que o balão do passo atual já esteja no DOM.
      this.settleTimer = setTimeout(
        () => {
          this.measure();
          this.focusPopover();
        },
        shouldScroll ? SCROLL_SETTLE_MS : 0,
      );
    });

    const view = this.document.defaultView;
    // Captura na fase de descida: alcança a rolagem de qualquer ancestral, não
    // apenas a da janela. Passivo, para não competir com o compositor.
    view?.addEventListener('scroll', this.onViewportChange, { passive: true, capture: true });
    view?.addEventListener('resize', this.onViewportChange, { passive: true });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.settleTimer);
      if (this.frame !== undefined) view?.cancelAnimationFrame(this.frame);
      view?.removeEventListener('scroll', this.onViewportChange, true);
      view?.removeEventListener('resize', this.onViewportChange);
    });
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!this.tour.active()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.tour.skip();
      return;
    }

    // Setas e Enter só navegam com o foco dentro do balão. Sem essa restrição,
    // um Enter destinado a um formulário da página avançaria o tour e teria a
    // ação original cancelada.
    if (!this.isFocusWithinPopover()) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'Enter':
        // O Enter sobre um dos botões do balão já é tratado pelo próprio botão.
        if (this.isFocusOnControl(event)) return;
        event.preventDefault();
        this.tour.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.tour.prev();
        break;
    }
  }

  /**
   * Resolve o alvo do passo. Um seletor malformado não deve derrubar a
   * aplicação: o passo degrada para a apresentação centralizada.
   */
  private resolveTarget(selector: string | undefined): HTMLElement | null {
    if (!selector) return null;

    try {
      return this.document.querySelector<HTMLElement>(selector);
    } catch {
      if (typeof ngDevMode !== 'undefined' && ngDevMode) {
        console.warn(`[bandeira-ui] Seletor de passo inválido no tour: "${selector}".`);
      }
      return null;
    }
  }

  /** Mede o alvo e reposiciona destaque e balão. Não altera o foco. */
  private measure(): void {
    const step = this.tour.step();
    const view = this.document.defaultView;
    if (!step || !view) return;

    const target = this.resolveTarget(step.target);
    const vw = view.innerWidth;
    const vh = view.innerHeight;
    const pad = this.spotPadding();

    if (!target) {
      // Sem alvo: a tela inteira escurece e o balão é centralizado.
      const height = this.popoverHeight();
      this.hasTarget.set(false);
      this.spot.set({ top: vh / 2, left: vw / 2, width: 0, height: 0 });
      this.position.set({
        top: Math.max(VIEWPORT_MARGIN, vh / 2 - height / 2),
        left: Math.max(VIEWPORT_MARGIN, vw / 2 - POPOVER_WIDTH / 2),
        side: 'center',
      });
      return;
    }

    const rect = target.getBoundingClientRect();
    this.hasTarget.set(true);
    this.spot.set({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });

    this.position.set(this.resolvePosition(rect, step.placement ?? 'auto', vw, vh));
  }

  /**
   * Escolhe o primeiro lado com espaço suficiente. Em `auto`, a ordem é
   * abaixo, acima, direita e esquerda; sem espaço em nenhum, centraliza.
   */
  private resolvePosition(
    rect: DOMRect,
    preferred: BdTourPlacement,
    vw: number,
    vh: number,
  ): PopoverPosition {
    // A altura real do balão, e não uma estimativa: passos com texto longo
    // ocupam bem mais que o valor nominal e escolheriam o lado errado.
    const height = this.popoverHeight();
    const pad = this.spotPadding();

    const fits = {
      bottom: vh - rect.bottom - pad > height + POPOVER_GAP,
      top: rect.top - pad > height + POPOVER_GAP,
      right: vw - rect.right - pad > POPOVER_WIDTH + POPOVER_GAP,
      left: rect.left - pad > POPOVER_WIDTH + POPOVER_GAP,
    };

    const order: Exclude<BdTourPlacement, 'auto'>[] =
      preferred === 'auto'
        ? ['bottom', 'top', 'right', 'left']
        : [preferred, 'bottom', 'top', 'right', 'left'];

    const side = order.find((candidate) => fits[candidate]);

    if (!side) {
      return {
        top: Math.max(VIEWPORT_MARGIN, vh / 2 - height / 2),
        left: Math.max(VIEWPORT_MARGIN, vw / 2 - POPOVER_WIDTH / 2),
        side: 'center',
      };
    }

    // Mantém o balão dentro da área visível nos dois eixos.
    const clampX = (x: number) =>
      Math.min(Math.max(VIEWPORT_MARGIN, x), vw - POPOVER_WIDTH - VIEWPORT_MARGIN);
    const clampY = (y: number) =>
      Math.min(Math.max(VIEWPORT_MARGIN, y), vh - height - VIEWPORT_MARGIN);

    switch (side) {
      case 'bottom':
        return { top: rect.bottom + pad + POPOVER_GAP, left: clampX(rect.left - pad), side };
      case 'top':
        return {
          top: rect.top - pad - POPOVER_GAP - height,
          left: clampX(rect.left - pad),
          side,
        };
      case 'right':
        return { top: clampY(rect.top - pad), left: rect.right + pad + POPOVER_GAP, side };
      case 'left':
        return {
          top: clampY(rect.top - pad),
          left: rect.left - pad - POPOVER_GAP - POPOVER_WIDTH,
          side,
        };
    }
  }

  private popoverHeight(): number {
    return this.popover()?.nativeElement.offsetHeight || POPOVER_FALLBACK_HEIGHT;
  }

  /** Leva o foco ao balão para que o leitor de tela anuncie o passo. */
  private focusPopover(): void {
    this.popover()?.nativeElement.focus({ preventScroll: true });
  }

  private isFocusWithinPopover(): boolean {
    const element = this.popover()?.nativeElement;
    const active = this.document.activeElement;
    return !!element && !!active && element.contains(active);
  }

  private isFocusOnControl(event: KeyboardEvent): boolean {
    return event.key === 'Enter' && (event.target as HTMLElement | null)?.tagName === 'BUTTON';
  }
}

declare const ngDevMode: boolean | undefined;
