import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdStep, BdStepsComponent, BdStepsVariant } from './bd-steps.component';

const STEPS: BdStep[] = [
  { label: 'Dados', hint: 'Nome e contato' },
  { label: 'Equipe' },
  { label: 'Revisão' },
];

@Component({
  standalone: true,
  imports: [BdStepsComponent],
  template: `
    <bd-steps
      [steps]="steps"
      [(active)]="active"
      [variant]="variant()"
      [clickable]="clickable()"
      (stepChange)="visited.push($event)"
    />
  `,
})
class HostComponent {
  readonly steps = STEPS;
  readonly active = signal(1);
  readonly variant = signal<BdStepsVariant>('panel');
  readonly clickable = signal(true);
  readonly visited: number[] = [];
}

describe('BdStepsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const items = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-steps__item'));
  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-steps__btn'));
  const markers = (): string[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-steps__marker')).map((m) =>
      (m as HTMLElement).textContent!.trim(),
    );

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

  it('marca a etapa corrente para leitores de tela', () => {
    const current = fixture.nativeElement.querySelector('[aria-current="step"]');

    expect(current.textContent).toContain('Equipe');
  });

  it('distingue etapas concluídas das futuras', () => {
    expect(items()[0].classList).toContain('is-done');
    expect(items()[1].classList).toContain('is-active');
    expect(items()[2].classList).not.toContain('is-done');
  });

  it('substitui o número por um sinal nas etapas concluídas', () => {
    expect(markers()).toEqual(['✓', '2', '3']);
  });

  it('permite retornar a etapas concluídas', () => {
    click(buttons()[0]);

    expect(host.active()).toBe(0);
    expect(host.visited).toEqual([0]);
  });

  it('bloqueia o salto para etapas futuras', () => {
    expect(buttons()[2].disabled).toBeTrue();

    click(buttons()[2]);
    expect(host.active()).toBe(1);
    expect(host.visited).toEqual([]);
  });

  it('bloqueia toda navegação quando clickable é falso', () => {
    host.clickable.set(false);
    fixture.detectChanges();

    expect(buttons()[0].disabled).toBeTrue();

    click(buttons()[0]);
    expect(host.active()).toBe(1);
  });

  it('aplica a classe da variante e da orientação no host', () => {
    const element: HTMLElement = fixture.nativeElement.querySelector('bd-steps');
    expect(element.classList).toContain('bd-steps--panel');
    expect(element.classList).toContain('bd-steps--horizontal');

    host.variant.set('line');
    fixture.detectChanges();
    expect(element.classList).toContain('bd-steps--line');
  });

  it('mantém os rótulos acessíveis na variante de marcadores', () => {
    host.variant.set('dots');
    fixture.detectChanges();

    const sr: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.bd-steps__sr'));
    expect(sr.map((node) => node.textContent!.trim())).toEqual(['Dados', 'Equipe', 'Revisão']);
  });

  describe('variante progress', () => {
    beforeEach(() => {
      host.variant.set('progress');
      fixture.detectChanges();
    });

    it('expõe a posição como barra de progresso', () => {
      const bar = fixture.nativeElement.querySelector('[role="progressbar"]');

      expect(bar.getAttribute('aria-valuenow')).toBe('2');
      expect(bar.getAttribute('aria-valuemax')).toBe('3');
    });

    it('exibe o rótulo da etapa corrente e o contador', () => {
      const text = fixture.nativeElement.textContent;

      expect(text).toContain('Equipe');
      expect(text).toContain('Etapa 2 de 3');
    });
  });
});
