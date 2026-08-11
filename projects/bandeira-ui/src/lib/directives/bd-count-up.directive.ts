import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/**
 * Anima um número de 0 até o valor final quando o elemento entra na viewport.
 *
 * Escreve direto no DOM via `requestAnimationFrame`, sem disparar change
 * detection a cada quadro. Seguro em SSR e respeita `prefers-reduced-motion`
 * (nesse caso mostra o valor final imediatamente).
 *
 * @example
 * ```html
 * <span [bdCountUp]="3" suffix="+"></span>
 * <span [bdCountUp]="1250" prefix="R$ " [duration]="2000"></span>
 * ```
 */
@Directive({
  selector: '[bdCountUp]',
  standalone: true,
})
export class BdCountUpDirective {
  readonly bdCountUp = input.required<number>();
  readonly prefix = input('');
  readonly suffix = input('');
  /** Duração da contagem em milissegundos. */
  readonly duration = input(1400);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;
  private frame?: number;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.observer?.disconnect();
      if (this.frame) cancelAnimationFrame(this.frame);
    });

    afterNextRender(() => this.configurar());
  }

  private configurar() {
    const semMovimento = matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (semMovimento || typeof IntersectionObserver === 'undefined') {
      this.render(this.bdCountUp());
      return;
    }

    this.render(0);

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.observer?.disconnect();
          this.animar();
        }
      },
      { threshold: 0.4 }
    );

    this.observer.observe(this.host.nativeElement);
  }

  private animar() {
    const alvo = this.bdCountUp();
    const total = this.duration();
    const inicio = performance.now();

    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / total);
      // easeOutExpo: acelera no início e assenta suave no valor final.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      this.render(Math.round(alvo * eased));

      if (t < 1) {
        this.frame = requestAnimationFrame(passo);
      }
    };

    this.frame = requestAnimationFrame(passo);
  }

  private render(valor: number) {
    this.host.nativeElement.textContent = `${this.prefix()}${valor}${this.suffix()}`;
  }
}
