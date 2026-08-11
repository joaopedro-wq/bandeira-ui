import {
  DOCUMENT,
  DestroyRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';

export type BdTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

let contador = 0;

/**
 * Dica de texto que aparece no hover e no foco.
 *
 * Aparece também no foco por teclado — tooltip que só responde ao mouse é
 * inacessível. O elemento recebe `aria-describedby`, então o leitor de tela
 * anuncia a dica junto com o controle.
 *
 * Não use tooltip para informação essencial: em touch ela não aparece.
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
  /** Atraso em ms antes de aparecer — evita piscar ao passar o mouse de raspão. */
  readonly showDelay = input(120);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);

  private balao?: HTMLElement;
  private timer?: ReturnType<typeof setTimeout>;
  private readonly id = `bd-tooltip-${contador++}`;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.esconder());
  }

  @HostListener('mouseenter')
  @HostListener('focus')
  agendar() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.mostrar(), this.showDelay());
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  @HostListener('document:keydown.escape')
  esconder() {
    clearTimeout(this.timer);
    this.balao?.remove();
    this.balao = undefined;
    this.host.nativeElement.removeAttribute('aria-describedby');
  }

  private mostrar() {
    if (this.balao || !this.bdTooltip()) return;

    const balao = this.document.createElement('div');
    balao.id = this.id;
    balao.className = `bd-tooltip bd-tooltip--${this.placement()}`;
    balao.setAttribute('role', 'tooltip');
    balao.textContent = this.bdTooltip();
    this.document.body.appendChild(balao);
    this.balao = balao;

    this.host.nativeElement.setAttribute('aria-describedby', this.id);
    this.posicionar(balao);
  }

  private posicionar(balao: HTMLElement) {
    const alvo = this.host.nativeElement.getBoundingClientRect();
    const b = balao.getBoundingClientRect();
    const espaco = 8;
    let top = 0;
    let left = 0;

    switch (this.placement()) {
      case 'top':
        top = alvo.top - b.height - espaco;
        left = alvo.left + alvo.width / 2 - b.width / 2;
        break;
      case 'bottom':
        top = alvo.bottom + espaco;
        left = alvo.left + alvo.width / 2 - b.width / 2;
        break;
      case 'left':
        top = alvo.top + alvo.height / 2 - b.height / 2;
        left = alvo.left - b.width - espaco;
        break;
      case 'right':
        top = alvo.top + alvo.height / 2 - b.height / 2;
        left = alvo.right + espaco;
        break;
    }

    // Nunca deixa o balão sair da viewport.
    const margem = 8;
    left = Math.min(Math.max(margem, left), window.innerWidth - b.width - margem);
    top = Math.min(Math.max(margem, top), window.innerHeight - b.height - margem);

    balao.style.top = `${top}px`;
    balao.style.left = `${left}px`;
  }
}
