import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

export type BdTourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface BdTourStep {
  /** Seletor CSS do elemento a destacar. Sem alvo, o passo é centralizado. */
  target?: string;
  title: string;
  content: string;
  /** Lado preferido do balão. `auto` escolhe o primeiro lado com espaço. */
  placement?: BdTourPlacement;
  /** Rótulo do botão de avanço deste passo. */
  nextLabel?: string;
}

export interface BdTourLabels {
  next: string;
  prev: string;
  finish: string;
  skip: string;
  /** Recebe (posição atual, total) — ex.: "2 de 5". */
  counter: (current: number, total: number) => string;
}

/** Desfecho de um tour encerrado. */
export interface BdTourOutcome {
  /** `true` quando o usuário percorreu todos os passos até o fim. */
  completed: boolean;
  /** Índice do passo em que o tour foi encerrado. */
  step: number;
}

export const BD_TOUR_DEFAULT_LABELS: BdTourLabels = {
  next: 'Próximo',
  prev: 'Voltar',
  finish: 'Concluir',
  skip: 'Pular',
  counter: (current, total) => `${current} de ${total}`,
};

const STORAGE_PREFIX = 'bd-tour:';

/**
 * Orquestra o tour guiado de integração. Injete onde for necessário e invoque
 * `start()`; o componente `<bd-tour />` deve estar montado uma única vez na
 * aplicação — tipicamente no componente raiz — para desenhar destaque e balão.
 *
 * O estado é exposto como signals somente-leitura, o que permite reagir ao
 * progresso do tour em qualquer ponto da aplicação.
 *
 * @example
 * ```ts
 * private readonly tour = inject(BdTourService);
 *
 * apresentar(): void {
 *   // `startOnce` registra a exibição e não repete o tour para este usuário.
 *   this.tour.startOnce('onboarding-v1', [
 *     { target: '#busca', title: 'Busca', content: 'Localize qualquer projeto.' },
 *     { target: '#filtros', title: 'Filtros', content: 'Refine por status e período.' },
 *   ]);
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BdTourService {
  private readonly document = inject(DOCUMENT);

  private readonly _steps = signal<BdTourStep[]>([]);
  private readonly _index = signal(0);
  private readonly _active = signal(false);
  private readonly _outcome = signal<BdTourOutcome | null>(null);
  private storageKey: string | null = null;

  readonly labels = signal<BdTourLabels>(BD_TOUR_DEFAULT_LABELS);

  readonly steps = this._steps.asReadonly();
  readonly index = this._index.asReadonly();
  readonly active = this._active.asReadonly();

  /** Desfecho do último tour encerrado; `null` enquanto nenhum terminou. */
  readonly outcome = this._outcome.asReadonly();

  readonly total = computed(() => this._steps().length);
  readonly step = computed<BdTourStep | null>(() => this._steps()[this._index()] ?? null);
  readonly isFirst = computed(() => this._index() === 0);
  readonly isLast = computed(() => this._index() === this.total() - 1);

  /** Inicia o tour a partir do primeiro passo. */
  start(steps: BdTourStep[], labels?: Partial<BdTourLabels>): void {
    if (!steps.length) return;

    this.labels.set(labels ? { ...BD_TOUR_DEFAULT_LABELS, ...labels } : BD_TOUR_DEFAULT_LABELS);

    this._steps.set(steps);
    this._index.set(0);
    this._outcome.set(null);
    this._active.set(true);
  }

  /**
   * Inicia o tour apenas na primeira vez para esta chave, registrando a
   * exibição no `localStorage`. Versione a chave (`onboarding-v2`) para
   * reapresentar o tour após uma mudança relevante de interface.
   *
   * @returns `true` se o tour foi iniciado.
   */
  startOnce(key: string, steps: BdTourStep[], labels?: Partial<BdTourLabels>): boolean {
    if (this.hasSeen(key)) return false;

    this.start(steps, labels);
    if (this._active()) {
      this.storageKey = key;
      return true;
    }
    return false;
  }

  /** Indica se o tour desta chave já foi encerrado alguma vez neste dispositivo. */
  hasSeen(key: string): boolean {
    return this.storage()?.getItem(STORAGE_PREFIX + key) !== null;
  }

  /** Descarta o registro de exibição, permitindo reapresentar o tour. */
  reset(key: string): void {
    this.storage()?.removeItem(STORAGE_PREFIX + key);
  }

  next(): void {
    if (this.isLast()) {
      this.finish();
      return;
    }
    this._index.update((i) => i + 1);
  }

  prev(): void {
    if (!this.isFirst()) {
      this._index.update((i) => i - 1);
    }
  }

  /** Salta diretamente para um passo pelo índice. */
  goTo(index: number): void {
    if (index >= 0 && index < this.total()) {
      this._index.set(index);
    }
  }

  /** Encerra após percorrer todos os passos. */
  finish(): void {
    this.end(true);
  }

  /** Encerra antecipadamente (`Esc`, clique fora ou botão de pular). */
  skip(): void {
    this.end(false);
  }

  private end(completed: boolean): void {
    if (!this._active()) return;

    this._active.set(false);
    this._outcome.set({ completed, step: this._index() });

    if (this.storageKey) {
      this.storage()?.setItem(STORAGE_PREFIX + this.storageKey, new Date().toISOString());
      this.storageKey = null;
    }
  }

  /**
   * O armazenamento é opcional por natureza: não existe em renderização no
   * servidor e lança exceção em navegação privada com cookies bloqueados.
   * Em ambos os casos o tour segue funcionando, apenas sem memória.
   */
  private storage(): Storage | null {
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
