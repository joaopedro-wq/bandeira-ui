import { Injectable, computed, signal } from '@angular/core';

export type BdTourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface BdTourStep {
  /** Seletor CSS do elemento a destacar. Se não encontrar, o passo é centralizado. */
  target?: string;
  title: string;
  content: string;
  /** Lado preferido do balão. `auto` escolhe o que couber melhor. */
  placement?: BdTourPlacement;
  /** Rótulo do botão de avanço deste passo. */
  nextLabel?: string;
}

export interface BdTourLabels {
  next: string;
  prev: string;
  finish: string;
  skip: string;
  /** Recebe (atual, total) — ex.: "2 de 5". */
  counter: (atual: number, total: number) => string;
}

const LABELS_PADRAO: BdTourLabels = {
  next: 'Próximo',
  prev: 'Voltar',
  finish: 'Concluir',
  skip: 'Pular',
  counter: (atual, total) => `${atual} de ${total}`,
};

/**
 * Controla o tour guiado. Injete em qualquer lugar e chame `start()`.
 *
 * O `<bd-tour />` precisa estar montado uma vez na aplicação (normalmente no
 * componente raiz) para desenhar o destaque e o balão.
 *
 * @example
 * ```ts
 * private readonly tour = inject(BdTourService);
 *
 * comecar() {
 *   this.tour.start([
 *     { target: '#busca', title: 'Busca', content: 'Encontre qualquer projeto aqui.' },
 *     { target: '#filtros', title: 'Filtros', content: 'Refine por status e data.' },
 *   ]);
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class BdTourService {
  private readonly _steps = signal<BdTourStep[]>([]);
  private readonly _index = signal(0);
  private readonly _ativo = signal(false);

  readonly labels = signal<BdTourLabels>(LABELS_PADRAO);

  readonly steps = this._steps.asReadonly();
  readonly index = this._index.asReadonly();
  readonly ativo = this._ativo.asReadonly();

  readonly total = computed(() => this._steps().length);
  readonly step = computed<BdTourStep | null>(() => this._steps()[this._index()] ?? null);
  readonly primeiro = computed(() => this._index() === 0);
  readonly ultimo = computed(() => this._index() === this.total() - 1);

  /** Chamado quando o tour termina — `concluido` diz se chegou ao fim. */
  private readonly _fim = signal<{ concluido: boolean } | null>(null);
  readonly fim = this._fim.asReadonly();

  start(steps: BdTourStep[], labels?: Partial<BdTourLabels>) {
    if (!steps.length) return;

    if (labels) {
      this.labels.set({ ...LABELS_PADRAO, ...labels });
    }

    this._steps.set(steps);
    this._index.set(0);
    this._fim.set(null);
    this._ativo.set(true);
  }

  next() {
    if (this.ultimo()) {
      this.finish();
      return;
    }
    this._index.update((i) => i + 1);
  }

  prev() {
    if (!this.primeiro()) {
      this._index.update((i) => i - 1);
    }
  }

  /** Vai direto a um passo pelo índice. */
  goTo(index: number) {
    if (index >= 0 && index < this.total()) {
      this._index.set(index);
    }
  }

  /** Encerra tendo percorrido todos os passos. */
  finish() {
    this._ativo.set(false);
    this._fim.set({ concluido: true });
  }

  /** Encerra antes do fim (Esc ou botão de pular). */
  skip() {
    this._ativo.set(false);
    this._fim.set({ concluido: false });
  }
}
