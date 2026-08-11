import { TestBed } from '@angular/core/testing';
import { BdTourService, BdTourStep } from './bd-tour.service';

const STEPS: BdTourStep[] = [
  { target: '#a', title: 'Passo 1', content: 'Conteúdo 1' },
  { target: '#b', title: 'Passo 2', content: 'Conteúdo 2' },
  { target: '#c', title: 'Passo 3', content: 'Conteúdo 3' },
];

describe('BdTourService', () => {
  let service: BdTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdTourService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('inicia no primeiro passo', () => {
    service.start(STEPS);

    expect(service.active()).toBeTrue();
    expect(service.index()).toBe(0);
    expect(service.total()).toBe(3);
    expect(service.step()?.title).toBe('Passo 1');
    expect(service.isFirst()).toBeTrue();
    expect(service.isLast()).toBeFalse();
  });

  it('ignora um roteiro vazio', () => {
    service.start([]);

    expect(service.active()).toBeFalse();
  });

  it('avança e retrocede sem sair dos limites', () => {
    service.start(STEPS);

    service.prev();
    expect(service.index()).withContext('não retrocede antes do primeiro').toBe(0);

    service.next();
    service.next();
    expect(service.index()).toBe(2);
    expect(service.isLast()).toBeTrue();
  });

  it('conclui ao avançar a partir do último passo', () => {
    service.start(STEPS);
    service.goTo(2);
    service.next();

    expect(service.active()).toBeFalse();
    expect(service.outcome()).toEqual({ completed: true, step: 2 });
  });

  it('registra o abandono com o passo em que ocorreu', () => {
    service.start(STEPS);
    service.next();
    service.skip();

    expect(service.active()).toBeFalse();
    expect(service.outcome()).toEqual({ completed: false, step: 1 });
  });

  it('recusa saltos para fora do roteiro', () => {
    service.start(STEPS);

    service.goTo(9);
    service.goTo(-1);

    expect(service.index()).toBe(0);
  });

  it('restaura os rótulos padrão entre tours', () => {
    service.start(STEPS, { skip: 'Agora não' });
    expect(service.labels().skip).toBe('Agora não');

    service.finish();
    service.start(STEPS);

    expect(service.labels().skip)
      .withContext('rótulos de um tour não podem vazar para o seguinte')
      .toBe('Pular');
  });

  describe('startOnce', () => {
    it('apresenta o tour na primeira chamada', () => {
      expect(service.startOnce('onboarding', STEPS)).toBeTrue();
      expect(service.active()).toBeTrue();
    });

    it('não repete após o tour ser encerrado', () => {
      service.startOnce('onboarding', STEPS);
      service.skip();

      expect(service.startOnce('onboarding', STEPS)).toBeFalse();
      expect(service.active()).toBeFalse();
    });

    it('reapresenta após reset da chave', () => {
      service.startOnce('onboarding', STEPS);
      service.finish();
      service.reset('onboarding');

      expect(service.hasSeen('onboarding')).toBeFalse();
      expect(service.startOnce('onboarding', STEPS)).toBeTrue();
    });

    it('trata chaves distintas de forma independente', () => {
      service.startOnce('v1', STEPS);
      service.finish();

      expect(service.hasSeen('v1')).toBeTrue();
      expect(service.hasSeen('v2')).toBeFalse();
    });
  });
});
