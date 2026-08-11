import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let instanceCount = 0;

/**
 * Caixa de seleção.
 *
 * Suporta o estado indeterminado — o "traço" que representa seleção parcial
 * numa lista de filhos. Ele é visual e ARIA, não um terceiro value: ao clicar,
 * o controle vira marcado.
 *
 * @example
 * ```html
 * <bd-checkbox [(checked)]="aceito">Aceito os termos</bd-checkbox>
 * <bd-checkbox formControlName="ativo" indeterminate>Todos</bd-checkbox>
 * ```
 */
@Component({
  selector: 'bd-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: BdCheckboxComponent, multi: true }],
  template: `
    <button
      type="button"
      role="checkbox"
      class="bd-checkbox__box"
      [id]="id"
      [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
      [attr.aria-labelledby]="labelId"
      [disabled]="disabled()"
      (click)="toggle()"
      (blur)="onTouchedFn()"
    >
      <span class="bd-checkbox__mark" aria-hidden="true">
        {{ indeterminate() ? '–' : '✓' }}
      </span>
    </button>

    <!-- O atributo for só vincula elementos rotuláveis, e um button não é um
         deles: o vínculo semântico vem de aria-labelledby, e o clique no
         rótulo é encaminhado explicitamente. -->
    <span class="bd-checkbox__label" [id]="labelId" (click)="toggle()">
      <ng-content />
    </span>
  `,
  host: { '[class.bd-checkbox--disabled]': 'disabled()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--bd-space-3, 0.75rem);
    }

    .bd-checkbox__box {
      flex-shrink: 0;
      display: grid;
      place-items: center;
      width: 20px;
      height: 20px;
      margin-top: 0.1rem;
      padding: 0;
      background: var(--bd-bg, #fff);
      border: 1.5px solid var(--bd-border-strong, #cbd2e2);
      border-radius: 0.35rem;
      cursor: pointer;
      transition:
        background var(--bd-duration-fast, 0.15s) ease,
        border-color var(--bd-duration-fast, 0.15s) ease;
    }

    .bd-checkbox__box[aria-checked='true'],
    .bd-checkbox__box[aria-checked='mixed'] {
      background: var(--bd-primary, #3d5ce8);
      border-color: var(--bd-primary, #3d5ce8);
    }

    .bd-checkbox__box:hover:not(:disabled) {
      border-color: var(--bd-primary, #3d5ce8);
    }

    .bd-checkbox__box:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-checkbox__box:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bd-checkbox__mark {
      color: var(--bd-primary-contrast, #fff);
      font-size: 0.72rem;
      font-weight: 700;
      line-height: 1;
      opacity: 0;
      transform: scale(0.6);
      transition:
        opacity var(--bd-duration-fast, 0.15s) ease,
        transform var(--bd-duration-fast, 0.15s) var(--bd-ease, ease);
    }

    .bd-checkbox__box[aria-checked='true'] .bd-checkbox__mark,
    .bd-checkbox__box[aria-checked='mixed'] .bd-checkbox__mark {
      opacity: 1;
      transform: none;
    }

    .bd-checkbox__label {
      color: var(--bd-fg, #10131c);
      font-size: 0.93rem;
      line-height: 1.5;
      cursor: pointer;
      user-select: none;
    }

    :host(.bd-checkbox--disabled) .bd-checkbox__label {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-checkbox__box,
      .bd-checkbox__mark {
        transition: none;
      }
    }
  `,
})
export class BdCheckboxComponent implements ControlValueAccessor {
  /** Two-way: `[(checked)]="aceito"`. */
  readonly checked = model(false);
  /** Seleção parcial. Ao clicar, o controle passa a marcado. */
  readonly indeterminate = model(false);
  /** Desabilita via template: `<bd-checkbox disabled>`. */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** Escrito pelo Reactive Forms via setDisabledState. */
  private readonly disabledByForm = signal(false);

  /** Vale isDisabled se veio do template OU do formulário. */
  protected readonly disabled = computed(() => this.disabledInput() || this.disabledByForm());

  private readonly uid = instanceCount++;
  protected readonly id = `bd-checkbox-${this.uid}`;
  protected readonly labelId = `bd-checkbox-label-${this.uid}`;

  private onChangeFn: (value: boolean) => void = () => {};
  protected onTouchedFn: () => void = () => {};

  protected toggle() {
    if (this.disabled()) return;

    // Indeterminado sempre resolve para marcado — é o comportamento nativo.
    const novo = this.indeterminate() ? true : !this.checked();
    this.indeterminate.set(false);
    this.checked.set(novo);
    this.onChangeFn(novo);
  }

  /* ---------------------------------------------- ControlValueAccessor --- */

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledByForm.set(isDisabled);
  }
}
