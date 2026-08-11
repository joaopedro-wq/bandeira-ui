import { Injectable } from '@angular/core';

/**
 * Pilha das camadas sobrepostas abertas (diálogos, tour, gavetas).
 *
 * Existe para que atalhos globais atinjam apenas a camada do topo: com dois
 * diálogos empilhados, `Esc` fecha o de cima e mantém o de baixo. Sem essa
 * arbitragem, cada instância reagiria ao mesmo evento de teclado.
 */
@Injectable({ providedIn: 'root' })
export class BdOverlayStackService {
  private readonly stack: unknown[] = [];

  push(reference: unknown): void {
    this.remove(reference);
    this.stack.push(reference);
  }

  remove(reference: unknown): void {
    const index = this.stack.indexOf(reference);
    if (index > -1) {
      this.stack.splice(index, 1);
    }
  }

  /** `true` quando a referência é a camada mais alta da pilha. */
  isTopmost(reference: unknown): boolean {
    return this.stack.length > 0 && this.stack[this.stack.length - 1] === reference;
  }

  get depth(): number {
    return this.stack.length;
  }
}
