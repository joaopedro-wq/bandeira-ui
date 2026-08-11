import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Trava a rolagem do documento enquanto houver camadas sobrepostas abertas.
 *
 * O controle é por contagem de referências: dois diálogos empilhados produzem
 * duas travas, e a rolagem só volta quando a última é liberada. O valor
 * original de `overflow` é preservado e restaurado — a biblioteca não descarta
 * estilos definidos pela aplicação hospedeira.
 *
 * A largura da barra de rolagem é compensada com `padding-right` para que o
 * conteúdo não salte lateralmente ao abrir a camada.
 */
@Injectable({ providedIn: 'root' })
export class BdScrollLockService {
  private readonly document = inject(DOCUMENT);

  private references = 0;
  private previousOverflow = '';
  private previousPaddingRight = '';

  /** Número de travas ativas. Exposto para diagnóstico e testes. */
  get active(): number {
    return this.references;
  }

  lock(): void {
    if (this.references++ > 0) return;

    const body = this.document.body;
    const view = this.document.defaultView;
    if (!body || !view) return;

    this.previousOverflow = body.style.overflow;
    this.previousPaddingRight = body.style.paddingRight;

    const scrollbar = view.innerWidth - this.document.documentElement.clientWidth;
    if (scrollbar > 0) {
      const current = parseFloat(view.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${current + scrollbar}px`;
    }

    body.style.overflow = 'hidden';
  }

  release(): void {
    if (this.references === 0) return;
    if (--this.references > 0) return;

    const body = this.document.body;
    if (!body) return;

    body.style.overflow = this.previousOverflow;
    body.style.paddingRight = this.previousPaddingRight;
  }
}
