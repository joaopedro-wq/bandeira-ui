import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdPageEvent, BdPaginationComponent } from './bd-pagination.component';

@Component({
  standalone: true,
  imports: [BdPaginationComponent],
  template: `
    <bd-pagination
      [total]="total()"
      [(page)]="page"
      [(pageSize)]="pageSize"
      [pageSizeOptions]="[10, 20, 50]"
      (paginate)="events.push($event)"
    />
  `,
})
class HostComponent {
  readonly total = signal(240);
  readonly page = signal(0);
  readonly pageSize = signal(20);
  readonly events: BdPageEvent[] = [];
}

describe('BdPaginationComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const pageButtons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-pagination__btn--page'));
  const labels = (): string[] => pageButtons().map((b) => b.textContent!.trim());
  const summary = (): string =>
    fixture.nativeElement.querySelector('.bd-pagination__summary').textContent.trim();
  const gaps = (): number => fixture.nativeElement.querySelectorAll('.bd-pagination__gap').length;
  const arrow = (index: 0 | 1): HTMLButtonElement => {
    const all: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.bd-pagination__btn'),
    );
    const plain = all.filter((b) => !b.classList.contains('bd-pagination__btn--page'));
    return plain[index];
  };

  const click = (element: HTMLElement) => {
    element.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('resume o intervalo exibido', () => {
    expect(summary()).toBe('1–20 de 240');

    host.page.set(2);
    fixture.detectChanges();
    expect(summary()).toBe('41–60 de 240');
  });

  it('condensa a sequência com reticências', () => {
    // 12 páginas: primeira, vizinhança e última, com um salto de cada lado.
    host.page.set(6);
    fixture.detectChanges();

    expect(labels()).toEqual(['1', '6', '7', '8', '12']);
    expect(gaps()).toBe(2);
  });

  it('não condensa quando todas as páginas cabem', () => {
    host.total.set(100);
    fixture.detectChanges();

    expect(labels()).toEqual(['1', '2', '3', '4', '5']);
    expect(gaps()).toBe(0);
  });

  it('marca a página corrente para leitores de tela', () => {
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');

    expect(current.textContent.trim()).toBe('1');
  });

  it('desabilita as setas nas extremidades', () => {
    expect(arrow(0).disabled).withContext('primeira página').toBeTrue();

    host.page.set(11);
    fixture.detectChanges();
    expect(arrow(1).disabled).withContext('última página').toBeTrue();
  });

  it('emite a mudança ao navegar', () => {
    click(arrow(1));

    expect(host.page()).toBe(1);
    expect(host.events).toEqual([{ page: 1, pageSize: 20 }]);
  });

  it('não emite ao clicar na página já corrente', () => {
    click(pageButtons()[0]);

    expect(host.events.length).toBe(0);
  });

  it('volta ao início ao trocar o tamanho da página', () => {
    host.page.set(8);
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = '50';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(host.pageSize()).toBe(50);
    expect(host.page()).withContext('a página 9 pode não existir com o novo tamanho').toBe(0);
    expect(summary()).toBe('1–50 de 240');
  });

  it('trata o conjunto vazio sem quebrar', () => {
    host.total.set(0);
    fixture.detectChanges();

    expect(summary()).toBe('0–0 de 0');
    expect(labels()).toEqual(['1']);
  });
});
