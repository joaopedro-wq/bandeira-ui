import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  effect,
  input,
} from '@angular/core';
import { BdInputComponent } from './bd-input.component';

let instanceCount = 0;

/**
 * Envelope de campo de formulário: rótulo, controle, dica e mensagem de erro.
 *
 * Encontra o `[bdInput]` projetado e liga tudo sozinho — o `for` do rótulo
 * aponta para o `id` real do campo, o `aria-describedby` aponta para a dica ou
 * o erro, e o `aria-invalid` acompanha o estado. Quem consome não precisa
 * lembrar de nada disso.
 *
 * @example
 * ```html
 * <bd-field label="Seu e-mail" hint="Não compartilho com ninguém" required>
 *   <input bdInput type="email" formControlName="email" />
 * </bd-field>
 *
 * <bd-field label="Mensagem" [error]="erro()">
 *   <textarea bdInput rows="4"></textarea>
 * </bd-field>
 * ```
 */
@Component({
  selector: 'bd-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label()) {
      <label class="bd-field__label" [attr.for]="controlId()">
        {{ label() }}
        @if (required()) {
          <span class="bd-field__required" aria-hidden="true">*</span>
          <span class="bd-sr-only">(obrigatório)</span>
        }
      </label>
    }

    <ng-content />

    @if (error()) {
      <span class="bd-field__error" [id]="errorId" role="alert">{{ error() }}</span>
    } @else if (hint()) {
      <span class="bd-field__hint" [id]="hintId">{{ hint() }}</span>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--bd-space-2, 0.5rem);
    }

    .bd-field__label {
      font-size: var(--bd-text-sm, 0.875rem);
      font-weight: var(--bd-weight-semibold, 600);
      color: var(--bd-fg-muted, #545c70);
    }

    .bd-field__required {
      margin-left: 0.15rem;
      color: var(--bd-danger, #dc2626);
    }

    .bd-field__error {
      color: var(--bd-danger, #dc2626);
      font-size: var(--bd-text-xs, 0.75rem);
    }

    .bd-field__hint {
      color: var(--bd-fg-subtle, #7b8399);
      font-size: var(--bd-text-xs, 0.75rem);
    }

    .bd-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
})
export class BdFieldComponent {
  readonly label = input('');
  readonly hint = input('');
  /** Quando presente, substitui a dica, pinta o campo e vira `role="alert"`. */
  readonly error = input('');
  readonly required = input(false, { transform: booleanAttribute });

  private readonly uid = instanceCount++;
  protected readonly errorId = `bd-field-error-${this.uid}`;
  protected readonly hintId = `bd-field-hint-${this.uid}`;

  /** O campo projetado — é dele que sai o `id` usado no `for` do rótulo. */
  private readonly control = contentChild(BdInputComponent);

  protected readonly controlId = computed(() => this.control()?.id() ?? '');

  constructor() {
    // Empurra a descrição e o estado de erro para o campo projetado.
    effect(() => {
      const control = this.control();
      if (!control) return;

      const describedBy = this.error() ? this.errorId : this.hint() ? this.hintId : '';
      control._conectarAoField(describedBy, !!this.error());
    });
  }
}
