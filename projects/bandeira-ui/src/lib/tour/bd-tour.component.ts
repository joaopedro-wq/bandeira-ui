import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  HostListener,
  afterNextRender,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { BdTourPlacement, BdTourService } from './bd-tour.service';

interface Retangulo {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PosicaoBalao {
  top: number;
  left: number;
  lado: Exclude<BdTourPlacement, 'auto'> | 'center';
}

const PADDING_DESTAQUE = 8;
const ESPACO_BALAO = 14;
const LARGURA_BALAO = 320;

/**
 * Camada visual do tour guiado. Monte uma vez, normalmente no componente raiz:
 *
 * ```html
 * <router-outlet />
 * <bd-tour />
 * ```
 *
 * O controle fica no {@link BdTourService}. O destaque recorta o elemento alvo
 * com uma sombra gigante, o balão se posiciona no lado que couber e o foco vai
 * para dentro dele — Esc pula, setas navegam.
 */
@Component({
  selector: 'bd-tour',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tour.ativo() && tour.step(); as passo) {
      <div class="bd-tour" role="presentation">
        <!-- Recorte: a sombra gigante escurece tudo, menos este retângulo. -->
        <div
          class="bd-tour__spot"
          [class.bd-tour__spot--vazio]="!temAlvo()"
          [style.top.px]="destaque().top"
          [style.left.px]="destaque().left"
          [style.width.px]="destaque().width"
          [style.height.px]="destaque().height"
        ></div>

        <!-- Captura o clique fora sem cobrir o alvo destacado. -->
        <div class="bd-tour__catch" (click)="tour.skip()"></div>

        <div
          #balao
          class="bd-tour__popover"
          [class]="'bd-tour__popover--' + posicao().lado"
          [style.top.px]="posicao().top"
          [style.left.px]="posicao().left"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="tituloId"
          [attr.aria-describedby]="conteudoId"
          tabindex="-1"
        >
          <span class="bd-tour__arrow" aria-hidden="true"></span>

          <span class="bd-tour__counter">
            {{ tour.labels().counter(tour.index() + 1, tour.total()) }}
          </span>

          <h2 class="bd-tour__title" [id]="tituloId">{{ passo.title }}</h2>
          <p class="bd-tour__content" [id]="conteudoId">{{ passo.content }}</p>

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
              @if (!tour.primeiro()) {
                <button type="button" class="bd-tour__btn" (click)="tour.prev()">
                  {{ tour.labels().prev }}
                </button>
              }
              <button type="button" class="bd-tour__btn bd-tour__btn--primary" (click)="tour.next()">
                {{ passo.nextLabel ?? (tour.ultimo() ? tour.labels().finish : tour.labels().next) }}
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
      transition: top 0.3s var(--bd-ease, ease), left 0.3s var(--bd-ease, ease),
        width 0.3s var(--bd-ease, ease), height 0.3s var(--bd-ease, ease);
      pointer-events: none;
    }

    /* Passo sem alvo: só escurece, sem anel de destaque. */
    .bd-tour__spot--vazio {
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
      transition: top 0.3s var(--bd-ease, ease), left 0.3s var(--bd-ease, ease);
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
      transition: background 0.2s ease, width 0.2s ease;
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
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
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
  readonly spotPadding = input(PADDING_DESTAQUE);
  /** Rola o alvo para o centro da tela antes de destacar. */
  readonly scrollIntoView = input(true);

  private readonly document = inject(DOCUMENT);
  private readonly balao = viewChild<ElementRef<HTMLElement>>('balao');

  protected readonly tituloId = 'bd-tour-title';
  protected readonly conteudoId = 'bd-tour-content';

  protected readonly destaque = signal<Retangulo>({ top: 0, left: 0, width: 0, height: 0 });
  protected readonly posicao = signal<PosicaoBalao>({ top: 0, left: 0, lado: 'center' });
  protected readonly temAlvo = signal(false);

  constructor() {
    // Recalcula sempre que o passo muda.
    effect(() => {
      const passo = this.tour.step();
      if (!this.tour.ativo() || !passo) return;

      const alvo = passo.target
        ? this.document.querySelector<HTMLElement>(passo.target)
        : null;

      if (alvo && this.scrollIntoView()) {
        alvo.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      }

      // Espera o scroll assentar antes de medir.
      setTimeout(() => this.medir(), alvo && this.scrollIntoView() ? 320 : 0);
    });

    afterNextRender(() => this.medir());
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onViewportChange() {
    if (this.tour.ativo()) {
      this.medir();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.tour.ativo()) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.tour.skip();
        break;
      case 'ArrowRight':
      case 'Enter':
        event.preventDefault();
        this.tour.next();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.tour.prev();
        break;
    }
  }

  /** Mede o alvo e escolhe onde o balão cabe. */
  private medir() {
    const passo = this.tour.step();
    if (!passo) return;

    const alvo = passo.target ? this.document.querySelector<HTMLElement>(passo.target) : null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = this.spotPadding();

    if (!alvo) {
      // Sem alvo: escurece a tela toda e centraliza o balão.
      this.temAlvo.set(false);
      this.destaque.set({ top: vh / 2, left: vw / 2, width: 0, height: 0 });
      this.posicao.set({
        top: vh / 2 - 110,
        left: Math.max(16, vw / 2 - LARGURA_BALAO / 2),
        lado: 'center',
      });
      this.focarBalao();
      return;
    }

    const r = alvo.getBoundingClientRect();
    this.temAlvo.set(true);
    this.destaque.set({
      top: r.top - pad,
      left: r.left - pad,
      width: r.width + pad * 2,
      height: r.height + pad * 2,
    });

    this.posicao.set(this.calcularPosicao(r, passo.placement ?? 'auto', vw, vh));
    this.focarBalao();
  }

  /**
   * Escolhe o lado com espaço suficiente. Com `auto`, tenta embaixo, em cima,
   * à direita e à esquerda, nessa ordem; se nada couber, centraliza.
   */
  private calcularPosicao(
    r: DOMRect,
    preferido: BdTourPlacement,
    vw: number,
    vh: number
  ): PosicaoBalao {
    const alturaEstimada = 220;
    const pad = this.spotPadding();

    const cabe = {
      bottom: vh - r.bottom - pad > alturaEstimada + ESPACO_BALAO,
      top: r.top - pad > alturaEstimada + ESPACO_BALAO,
      right: vw - r.right - pad > LARGURA_BALAO + ESPACO_BALAO,
      left: r.left - pad > LARGURA_BALAO + ESPACO_BALAO,
    };

    const ordem: Exclude<BdTourPlacement, 'auto'>[] =
      preferido === 'auto'
        ? ['bottom', 'top', 'right', 'left']
        : [preferido, 'bottom', 'top', 'right', 'left'];

    const lado = ordem.find((l) => cabe[l]);

    if (!lado) {
      return {
        top: Math.max(16, vh / 2 - alturaEstimada / 2),
        left: Math.max(16, vw / 2 - LARGURA_BALAO / 2),
        lado: 'center',
      };
    }

    // Mantém o balão dentro da tela nos dois eixos.
    const limitarX = (x: number) => Math.min(Math.max(16, x), vw - LARGURA_BALAO - 16);
    const limitarY = (y: number) => Math.min(Math.max(16, y), vh - alturaEstimada - 16);

    switch (lado) {
      case 'bottom':
        return { top: r.bottom + pad + ESPACO_BALAO, left: limitarX(r.left - pad), lado };
      case 'top':
        return {
          top: r.top - pad - ESPACO_BALAO - alturaEstimada,
          left: limitarX(r.left - pad),
          lado,
        };
      case 'right':
        return { top: limitarY(r.top - pad), left: r.right + pad + ESPACO_BALAO, lado };
      case 'left':
        return {
          top: limitarY(r.top - pad),
          left: r.left - pad - ESPACO_BALAO - LARGURA_BALAO,
          lado,
        };
    }
  }

  /** Leva o foco ao balão para que leitores de tela anunciem o passo. */
  private focarBalao() {
    queueMicrotask(() => this.balao()?.nativeElement.focus());
  }
}
