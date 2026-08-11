import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BdCheckboxComponent } from './bd-checkbox.component';

@Component({
  standalone: true,
  imports: [BdCheckboxComponent, ReactiveFormsModule],
  template: `
    <bd-checkbox [formControl]="control" [(indeterminate)]="indeterminate">Aceito</bd-checkbox>
  `,
})
class HostComponent {
  readonly control = new FormControl(false);
  readonly indeterminate = signal(false);
}

describe('BdCheckboxComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const box = (): HTMLButtonElement => fixture.nativeElement.querySelector('[role="checkbox"]');
  const click = () => {
    box().click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('propaga a marcação para o formulário', () => {
    click();

    expect(host.control.value).toBeTrue();
    expect(box().getAttribute('aria-checked')).toBe('true');
  });

  it('reflete o valor escrito pelo formulário', () => {
    host.control.setValue(true);
    fixture.detectChanges();

    expect(box().getAttribute('aria-checked')).toBe('true');
  });

  it('resolve o estado indeterminado para marcado, como o controle nativo', () => {
    host.indeterminate.set(true);
    fixture.detectChanges();
    expect(box().getAttribute('aria-checked')).toBe('mixed');

    click();

    expect(host.control.value).toBeTrue();
    expect(host.indeterminate()).toBeFalse();
  });

  it('honra o estado desabilitado vindo do formulário', () => {
    host.control.disable();
    fixture.detectChanges();

    expect(box().disabled).toBeTrue();

    click();
    expect(host.control.value)
      .withContext('um controle desabilitado não pode ser alterado por clique')
      .toBeFalse();
  });
});
