import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

let instanceCount = 0;

/**
 * Aplica o estilo do design system em `<input>`, `<textarea>` e `<select>`.
 *
 * É um componente de seletor por atributo com template vazio: o estilo fica
 * encapsulado (sem `::ng-deep`) e o elemento nativo continua sendo o elemento
 * real do formulário, então `formControlName`, `type` e validação nativa
 * funcionam sem intermediário.
 *
 * Dentro de um `<bd-field>`, recebe automaticamente o `id` usado pelo `for` do
 * rótulo e as ligações de `aria-describedby` / `aria-invalid`.
 *
 * @example
 * ```html
 * <bd-field label="Seu e-mail" [error]="erro()">
 *   <input bdInput type="email" formControlName="email" />
 * </bd-field>
 *
 * <input bdInput type="text" placeholder="Busca" />
 * ```
 */
@Component({
  selector: 'input[bdInput], textarea[bdInput], select[bdInput]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  host: {
    class: 'bd-input',
    '[id]': 'id()',
    '[attr.aria-describedby]': 'describedBy() || null',
    '[attr.aria-invalid]': 'invalid() || null',
    '[class.bd-input--invalid]': 'invalid()',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      padding: var(--bd-space-3, 0.75rem) var(--bd-space-4, 1rem);
      background: var(--bd-bg, #fff);
      border: 1px solid var(--bd-border, #e3e7f0);
      border-radius: var(--bd-radius-sm, 0.5rem);
      color: var(--bd-fg, #10131c);
      font-family: inherit;
      /* 16px evita o zoom automático do Safari no iOS. */
      font-size: var(--bd-text-base, 1rem);
      line-height: var(--bd-leading-normal, 1.6);
      transition:
        border-color var(--bd-duration, 0.25s) ease,
        box-shadow var(--bd-duration, 0.25s) ease;
    }

    :host::placeholder {
      color: var(--bd-fg-subtle, #7b8399);
    }

    :host(:hover:not(:disabled)) {
      border-color: var(--bd-border-strong, #cbd2e2);
    }

    :host(:focus) {
      outline: none;
      border-color: var(--bd-primary, #3d5ce8);
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.1));
    }

    :host(:disabled) {
      opacity: 0.6;
      cursor: not-allowed;
      background: var(--bd-surface-hover, #f1f3f9);
    }

    :host(.bd-input--invalid) {
      border-color: var(--bd-danger, #dc2626);
    }

    :host(.bd-input--invalid:focus) {
      box-shadow: 0 0 0 3px var(--bd-danger-soft, rgba(220, 38, 38, 0.1));
    }

    /* textarea */
    :host(textarea) {
      resize: vertical;
      min-height: 120px;
    }

    /* select: espaço para a seta nativa */
    :host(select) {
      cursor: pointer;
      appearance: none;
      padding-right: var(--bd-space-6, 2rem);
    }

    @media (prefers-reduced-motion: reduce) {
      :host {
        transition: none;
      }
    }
  `,
})
export class BdInputComponent {
  /** Informe para fixar o `id`; do contrário um é gerado. */
  readonly inputId = input('', { alias: 'id' });

  private readonly gerado = `bd-input-${instanceCount++}`;

  /** Preenchidos pelo `<bd-field>` que envolve este campo. */
  private readonly fieldDescribedBy = signal('');
  private readonly fieldInvalid = signal(false);

  readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly id = computed(() => this.inputId() || this.gerado);
  readonly describedBy = computed(() => this.fieldDescribedBy());
  readonly invalid = computed(() => this.fieldInvalid());

  /** @internal chamado pelo `<bd-field>` que envolve este campo. */
  _conectarAoField(describedBy: string, invalido: boolean) {
    this.fieldDescribedBy.set(describedBy);
    this.fieldInvalid.set(invalido);
  }

  focus() {
    this.element.nativeElement.focus();
  }
}
