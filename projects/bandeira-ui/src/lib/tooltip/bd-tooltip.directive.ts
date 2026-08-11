import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { ensureBdRuntimeStyles } from '../core/bd-runtime-styles';

export type BdTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

let instanceCount = 0;

/**
 * Dica contextual exibida no ponteiro e no foco por teclado.
 *
 * A exibição no foco não é opcional: uma dica que responde apenas ao ponteiro
 * é inacessível a quem navega por teclado. O elemento hospedeiro recebe
 * `aria-describedby`, de modo que o leitor de tela anuncia a dica junto com o
 * controle que ela descreve.
 *
 * O balão é renderizado no `<body>` para escapar de `overflow: hidden` e de
 * contextos de empilhamento, e acompanha o alvo durante rolagem e
 * redimensionamento.
 *
 * Dicas não devem carregar informação essencial: em dispositivos de toque não
 * existe estado de ponteiro sobre o elemento.
 *
 * @example
 * ```html
 * <button bdButton iconOnly bdTooltip="Excluir projeto" aria-label="Excluir">🗑</button>
 * <span bdTooltip="Atualizado há 2 minutos" placement="right">agora</span>
 * ```
 */
@Directive({
  selector: '[bdTooltip]',
  standalone: true,
})
export class BdTooltipDirective {
  readonly bdTooltip = input.required<string>();
  readonly placement = input<BdTooltipPlacement>('top');
  /** Atraso de exibição em milissegundos — evita cintilação ao cruzar o alvo. */
  readonly showDelay = input(120);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  private bubble?: HTMLElement;
  private timer?: ReturnType<typeof setTimeout>;
  private frame?: number;
  private readonly id = `bd-tooltip-${instanceCount++}`;

  /** Reposiciona o balão junto com o alvo, no ritmo do compositor. */
  private readonly onViewportChange = () => {
    if (!this.bubble) return;
    const view = this.document.defaultView;
    if (!view) return;

    if (this.frame !== undefined) view.cancelAnimationFrame(this.frame);
    this.frame = view.requestAnimationFrame(() => {
      this.frame = undefined;
      if (this.bubble) this.position(this.bubble);
    });
  };

  constructor() {
    inject(DestroyRef).onDestroy(() => this.hide());
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  protected schedule(): void {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.show(), this.showDelay());
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('document:keydown.escape')
  protected hide(): void {
    clearTimeout(this.timer);

    const view = this.document.defaultView;
    if (this.frame !== undefined && view) {
      view.cancelAnimationFrame(this.frame);
      this.frame = undefined;
    }

    if (this.bubble) {
      view?.removeEventListener('scroll', this.onViewportChange, true);
      view?.removeEventListener('resize', this.onViewportChange);
      this.bubble.remove();
      this.bubble = undefined;
    }

    this.host.nativeElement.removeAttribute('aria-describedby');
  }

  private show(): void {
    if (this.bubble || !this.bdTooltip()) return;

    ensureBdRuntimeStyles(this.document);

    const bubble = this.document.createElement('div');
    bubble.id = this.id;
    bubble.className = `bd-tooltip bd-tooltip--${this.placement()}`;
    bubble.setAttribute('role', 'tooltip');
    bubble.textContent = this.bdTooltip();
    this.document.body.appendChild(bubble);
    this.bubble = bubble;

    this.host.nativeElement.setAttribute('aria-describedby', this.id);
    this.position(bubble);

    const view = this.document.defaultView;
    // Captura na fase de descida: alcança a rolagem de qualquer ancestral,
    // não apenas a da janela.
    view?.addEventListener('scroll', this.onViewportChange, { passive: true, capture: true });
    view?.addEventListener('resize', this.onViewportChange, { passive: true });
  }

  private position(bubble: HTMLElement): void {
    const view = this.document.defaultView;
    if (!view) return;

    const target = this.host.nativeElement.getBoundingClientRect();
    const box = bubble.getBoundingClientRect();
    const gap = 8;
    let top = 0;
    let left = 0;

    switch (this.placement()) {
      case 'top':
        top = target.top - box.height - gap;
        left = target.left + target.width / 2 - box.width / 2;
        break;
      case 'bottom':
        top = target.bottom + gap;
        left = target.left + target.width / 2 - box.width / 2;
        break;
      case 'left':
        top = target.top + target.height / 2 - box.height / 2;
        left = target.left - box.width - gap;
        break;
      case 'right':
        top = target.top + target.height / 2 - box.height / 2;
        left = target.right + gap;
        break;
    }

    // Mantém o balão dentro da área visível nos dois eixos.
    const margin = 8;
    left = Math.min(Math.max(margin, left), view.innerWidth - box.width - margin);
    top = Math.min(Math.max(margin, top), view.innerHeight - box.height - margin);

    bubble.style.top = `${top}px`;
    bubble.style.left = `${left}px`;
  }
}
