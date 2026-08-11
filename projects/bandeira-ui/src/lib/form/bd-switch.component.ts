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

let contador = 0;

/**
 * Interruptor liga/desliga.
 *
 * Use quando o efeito é imediato ("ativar notificações"). Para algo que só vale
 * ao enviar o formulário, prefira `<bd-checkbox>`.
 *
 * Implementa `ControlValueAccessor`, então funciona com `formControlName` e
 * `[(ngModel)]` — e também de forma avulsa com `[(checked)]`.
 *
 * @example
 * ```html
 * <bd-switch [(checked)]="notificacoes">Notificações por e-mail</bd-switch>
 * <bd-switch formControlName="ativo">Ativo</bd-switch>
 * ```
 */
@Component({
  selector: 'bd-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: BdSwitchComponent, multi: true },
  ],
  template: `
    <button
      type="button"
      role="switch"
      class="bd-switch__control"
      [id]="id"
      [attr.aria-checked]="checked()"
      [attr.aria-labelledby]="labelId"
      [disabled]="disabled()"
      (click)="alternar()"
      (blur)="aoTocar()"
    >
      <span class="bd-switch__thumb"></span>
    </button>

    <label class="bd-switch__label" [id]="labelId" [attr.for]="id">
      <ng-content />
    </label>
  `,
  host: { '[class.bd-switch--disabled]': 'disabled()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--bd-space-3, 0.75rem);
    }

    .bd-switch__control {
      position: relative;
      flex-shrink: 0;
      width: 42px;
      height: 24px;
      padding: 0;
      background: var(--bd-border-strong, #cbd2e2);
      border: none;
      border-radius: var(--bd-radius-full, 9999px);
      cursor: pointer;
      transition: background var(--bd-duration, 0.25s) ease;
    }

    .bd-switch__control[aria-checked='true'] {
      background: var(--bd-primary, #3d5ce8);
    }

    .bd-switch__control:focus-visible {
      outline: none;
      box-shadow: var(--bd-focus-ring, 0 0 0 3px rgba(61, 92, 232, 0.3));
    }

    .bd-switch__control:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bd-switch__thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
      transition: transform var(--bd-duration, 0.25s) var(--bd-ease, ease);
    }

    .bd-switch__control[aria-checked='true'] .bd-switch__thumb {
      transform: translateX(18px);
    }

    .bd-switch__label {
      color: var(--bd-fg, #10131c);
      font-size: 0.93rem;
      cursor: pointer;
      user-select: none;
    }

    :host(.bd-switch--disabled) .bd-switch__label {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      .bd-switch__control,
      .bd-switch__thumb {
        transition: none;
      }
    }
  `,
})
export class BdSwitchComponent implements ControlValueAccessor {
  /** Two-way: `[(checked)]="ativo"`. */
  readonly checked = model(false);
  /** Desabilita via template: `<bd-switch disabled>`. */
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });

  /** Escrito pelo Reactive Forms via setDisabledState. */
  private readonly disabledPorForm = signal(false);

  /** Vale desabilitado se veio do template OU do formulário. */
  protected readonly disabled = computed(() => this.disabledInput() || this.disabledPorForm());

  private readonly uid = contador++;
  protected readonly id = `bd-switch-${this.uid}`;
  protected readonly labelId = `bd-switch-label-${this.uid}`;

  private aoMudar: (valor: boolean) => void = () => {};
  protected aoTocar: () => void = () => {};

  protected alternar() {
    if (this.disabled()) return;
    const novo = !this.checked();
    this.checked.set(novo);
    this.aoMudar(novo);
  }

  /* ---------------------------------------------- ControlValueAccessor --- */

  writeValue(valor: boolean): void {
    this.checked.set(!!valor);
  }

  registerOnChange(fn: (valor: boolean) => void): void {
    this.aoMudar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.aoTocar = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.disabledPorForm.set(desabilitado);
  }
}
