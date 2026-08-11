import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdScrollLockService } from '../core/bd-scroll-lock.service';
import { BdModalComponent } from './bd-modal.component';

@Component({
  standalone: true,
  imports: [BdModalComponent],
  template: `
    <bd-modal [(open)]="primeiro" title="Primeiro" />
    <bd-modal [(open)]="segundo" title="Segundo" />
  `,
})
class HostComponent {
  readonly primeiro = signal(false);
  readonly segundo = signal(false);
}

function pressEscape(): void {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

describe('BdModalComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let scrollLock: BdScrollLockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    scrollLock = TestBed.inject(BdScrollLockService);
    fixture.detectChanges();
  });

  afterEach(() => {
    host.primeiro.set(false);
    host.segundo.set(false);
    fixture.detectChanges();
  });

  it('não interfere no documento enquanto está fechado', () => {
    expect(scrollLock.active).withContext('um diálogo fechado não pode travar a rolagem').toBe(0);
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renderiza o diálogo com os papéis de acessibilidade ao abrir', () => {
    host.primeiro.set(true);
    fixture.detectChanges();

    const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('conta uma trava de rolagem por diálogo aberto', () => {
    host.primeiro.set(true);
    fixture.detectChanges();
    expect(scrollLock.active).toBe(1);

    host.segundo.set(true);
    fixture.detectChanges();
    expect(scrollLock.active).toBe(2);

    host.segundo.set(false);
    fixture.detectChanges();
    expect(scrollLock.active).toBe(1);
    expect(document.body.style.overflow)
      .withContext('o diálogo restante ainda exige a trava')
      .toBe('hidden');
  });

  it('fecha apenas o diálogo do topo ao pressionar Esc', () => {
    host.primeiro.set(true);
    fixture.detectChanges();
    host.segundo.set(true);
    fixture.detectChanges();

    pressEscape();
    fixture.detectChanges();

    expect(host.segundo()).withContext('o diálogo do topo fecha').toBeFalse();
    expect(host.primeiro()).withContext('o diálogo de baixo permanece').toBeTrue();

    pressEscape();
    fixture.detectChanges();
    expect(host.primeiro()).toBeFalse();
  });

  it('libera a rolagem quando o componente é destruído aberto', () => {
    host.primeiro.set(true);
    fixture.detectChanges();
    expect(scrollLock.active).toBe(1);

    fixture.destroy();

    expect(scrollLock.active).toBe(0);
    expect(document.body.style.overflow).toBe('');
  });
});
