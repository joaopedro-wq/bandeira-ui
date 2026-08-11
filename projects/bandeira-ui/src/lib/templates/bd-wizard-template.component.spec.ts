import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdWizardStep, BdWizardTemplateComponent } from './bd-wizard-template.component';

const STEPS: BdWizardStep[] = [
  { label: 'Dados básicos' },
  { label: 'Equipe' },
  { label: 'Revisão' },
];

@Component({
  standalone: true,
  imports: [BdWizardTemplateComponent],
  template: `
    <bd-wizard-template
      title="Novo projeto"
      [steps]="steps"
      [(activeStep)]="step"
      [canAdvance]="canAdvance()"
      (finish)="finished.set(true)"
      (stepChange)="visited.push($event)"
    >
      <p>Conteúdo da etapa</p>
    </bd-wizard-template>
  `,
})
class HostComponent {
  readonly steps = STEPS;
  readonly step = signal(0);
  readonly canAdvance = signal(true);
  readonly finished = signal(false);
  readonly visited: number[] = [];
}

describe('BdWizardTemplateComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  // O indicador é delegado ao <bd-steps>, que também é exercitado por sua
  // própria suíte; aqui verificamos apenas a integração com o assistente.
  const stepButtons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-steps__btn'));
  const advanceButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.bd-wizard__btn--primary');
  const backButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('.bd-wizard__footer > .bd-wizard__btn');

  const click = (element: HTMLButtonElement) => {
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

    expect(current.textContent).toContain('Dados básicos');
  });

  it('avança uma etapa por vez e emite a mudança', () => {
    click(advanceButton());

    expect(host.step()).toBe(1);
    expect(host.visited).toEqual([1]);
  });

  it('bloqueia o avanço enquanto a etapa não é válida', () => {
    host.canAdvance.set(false);
    fixture.detectChanges();

    expect(advanceButton().disabled).toBeTrue();

    click(advanceButton());
    expect(host.step()).withContext('um formulário inválido não pode avançar o assistente').toBe(0);
  });

  it('não permite saltar para etapas futuras pelo indicador', () => {
    expect(stepButtons()[2].disabled).toBeTrue();

    click(stepButtons()[2]);
    expect(host.step()).toBe(0);
  });

  it('permite voltar a uma etapa já concluída pelo indicador', () => {
    click(advanceButton());
    click(advanceButton());
    expect(host.step()).toBe(2);

    click(stepButtons()[0]);
    expect(host.step()).toBe(0);
  });

  it('desabilita o botão de voltar na primeira etapa', () => {
    expect(backButton().disabled).toBeTrue();

    click(advanceButton());
    expect(backButton().disabled).toBeFalse();
  });

  it('emite finish em vez de avançar na última etapa', () => {
    host.step.set(2);
    fixture.detectChanges();

    expect(advanceButton().textContent?.trim()).toBe('Concluir');

    click(advanceButton());

    expect(host.finished()).toBeTrue();
    expect(host.step()).toBe(2);
  });
});
