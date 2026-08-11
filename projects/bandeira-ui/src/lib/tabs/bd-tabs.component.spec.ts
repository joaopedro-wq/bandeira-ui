import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdTab, BdTabsComponent } from './bd-tabs.component';

const TABS: BdTab[] = [
  { id: 'design', label: 'Design' },
  { id: 'codigo', label: 'Código', disabled: true },
  { id: 'testes', label: 'Testes' },
];

@Component({
  standalone: true,
  imports: [BdTabsComponent],
  template: `<bd-tabs [tabs]="tabs" [(active)]="active" label="Seções" />`,
})
class HostComponent {
  readonly tabs = TABS;
  readonly active = signal('design');
}

describe('BdTabsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]'));

  const keydown = (index: number, key: string) => {
    buttons()[index].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('monta o tablist com os papéis e vínculos esperados', () => {
    const list = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(list.getAttribute('aria-label')).toBe('Seções');

    const [first] = buttons();
    expect(first.getAttribute('aria-selected')).toBe('true');
    expect(first.getAttribute('aria-controls')).toBe('bd-panel-design');
  });

  it('mantém apenas a aba ativa na ordem de tabulação', () => {
    const [first, , third] = buttons();

    expect(first.getAttribute('tabindex')).toBe('0');
    expect(third.getAttribute('tabindex')).toBe('-1');
  });

  it('pula abas desabilitadas ao navegar com as setas', () => {
    keydown(0, 'ArrowRight');

    expect(host.active())
      .withContext('a aba desabilitada do meio deve ser ignorada')
      .toBe('testes');
  });

  it('circula ao chegar ao fim da lista', () => {
    host.active.set('testes');
    fixture.detectChanges();

    keydown(2, 'ArrowRight');

    expect(host.active()).toBe('design');
  });

  it('leva às pontas com Home e End', () => {
    keydown(0, 'End');
    expect(host.active()).toBe('testes');

    keydown(2, 'Home');
    expect(host.active()).toBe('design');
  });

  it('não seleciona aba desabilitada por clique', () => {
    buttons()[1].click();
    fixture.detectChanges();

    expect(host.active()).toBe('design');
  });

  it('move o foco junto com a seleção', () => {
    keydown(0, 'ArrowRight');

    expect(document.activeElement)
      .withContext('o padrão de tablist exige que o foco acompanhe a seleção')
      .toBe(buttons()[2]);
  });
});
