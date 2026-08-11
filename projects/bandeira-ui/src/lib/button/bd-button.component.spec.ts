import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdButtonComponent } from './bd-button.component';

@Component({
  standalone: true,
  imports: [BdButtonComponent],
  template: `
    <button
      bdButton
      class="minha-classe"
      [variant]="variant()"
      [size]="size()"
      [loading]="loading()"
      [disabled]="disabled()"
    >
      Salvar
    </button>
  `,
})
class HostComponent {
  readonly variant = signal<'primary' | 'ghost' | 'subtle' | 'danger'>('primary');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
  readonly loading = signal(false);
  readonly disabled = signal(false);
}

describe('BdButtonComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    button = fixture.nativeElement.querySelector('button');
  });

  it('aplica as classes de variante e tamanho', () => {
    expect(button.classList).toContain('bd-button--primary');
    expect(button.classList).toContain('bd-button--md');

    host.variant.set('danger');
    host.size.set('lg');
    fixture.detectChanges();

    expect(button.classList).toContain('bd-button--danger');
    expect(button.classList).toContain('bd-button--lg');
    expect(button.classList).not.toContain('bd-button--primary');
  });

  it('preserva as classes declaradas pelo consumidor', () => {
    // As classes de variante são aplicadas por binding no host; se elas
    // substituíssem o atributo, a estilização do consumidor seria descartada.
    expect(button.classList)
      .withContext('a classe do consumidor não pode ser sobrescrita')
      .toContain('minha-classe');

    host.variant.set('ghost');
    fixture.detectChanges();

    expect(button.classList).toContain('minha-classe');
    expect(button.classList).toContain('bd-button--ghost');
  });

  it('bloqueia a interação durante o carregamento', () => {
    host.loading.set(true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.hasAttribute('disabled')).toBeTrue();
    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.querySelector('.bd-button__spinner')).not.toBeNull();
  });

  it('remove o estado desabilitado ao voltar ao normal', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(button.hasAttribute('disabled')).toBeTrue();

    host.disabled.set(false);
    fixture.detectChanges();

    expect(button.hasAttribute('disabled')).toBeFalse();
    expect(button.hasAttribute('tabindex')).toBeFalse();
    expect(button.hasAttribute('aria-busy')).toBeFalse();
  });
});
