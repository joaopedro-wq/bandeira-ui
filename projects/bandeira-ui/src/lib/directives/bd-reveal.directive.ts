import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  booleanAttribute,
} from '@angular/core';

export type BdRevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

/**
 * Revela o elemento quando ele entra na viewport.
 *
 * A transição vive no CSS (`bandeira-ui/styles/animations`) e move apenas
 * `opacity` e `transform`, então roda na thread de composição e não trava a
 * rolagem. O observer é desconectado assim que o elemento aparece.
 *
 * Seguro em SSR: a configuração roda dentro de `afterNextRender`, que só
 * executa no browser.
 *
 * @example
 * ```html
 * <div bdReveal></div>
 * <div bdReveal="left" [revealDelay]="120"></div>
 * <div bdReveal="scale" [revealOnce]="false"></div>
 * ```
 */
@Directive({
  selector: '[bdReveal]',
  standalone: true,
})
export class BdRevealDirective {
  /** Direção de entrada do elemento. */
  readonly bdReveal = input<BdRevealDirection | ''>('up');

  /** Atraso em milissegundos — use `i * 80` em listas para criar cascata. */
  readonly revealDelay = input(0);

  /** Quando `false`, o elemento volta a esconder ao sair da viewport. */
  readonly revealOnce = input(true, { transform: booleanAttribute });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());

    afterNextRender(() => this.configurar());
  }

  private configurar() {
    const el = this.host.nativeElement;
    const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Sem IntersectionObserver ou com movimento reduzido: mostra tudo direto.
    if (semMovimento || typeof IntersectionObserver === 'undefined') {
      el.classList.add('bd-reveal', 'is-visible');
      return;
    }

    el.classList.add('bd-reveal', `bd-reveal--${this.bdReveal() || 'up'}`);

    if (this.revealDelay() > 0) {
      el.style.transitionDelay = `${this.revealDelay()}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            if (this.revealOnce()) {
              this.observer?.disconnect();
            }
          } else if (!this.revealOnce()) {
            el.classList.remove('is-visible');
          }
        }
      },
      // Dispara um pouco antes da borda inferior: o movimento fica natural.
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    this.observer.observe(el);
  }
}
