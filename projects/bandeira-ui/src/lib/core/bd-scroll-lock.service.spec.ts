import { TestBed } from '@angular/core/testing';
import { BdScrollLockService } from './bd-scroll-lock.service';

describe('BdScrollLockService', () => {
  let service: BdScrollLockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdScrollLockService);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    while (service.active > 0) service.release();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('trava a rolagem do documento', () => {
    service.lock();

    expect(document.body.style.overflow).toBe('hidden');
    expect(service.active).toBe(1);
  });

  it('só libera a rolagem quando a última trava é devolvida', () => {
    service.lock();
    service.lock();

    service.release();
    expect(document.body.style.overflow).withContext('ainda há uma camada aberta').toBe('hidden');

    service.release();
    expect(document.body.style.overflow).toBe('');
    expect(service.active).toBe(0);
  });

  it('restaura o valor original de overflow definido pela aplicação', () => {
    document.body.style.overflow = 'scroll';

    service.lock();
    expect(document.body.style.overflow).toBe('hidden');

    service.release();
    expect(document.body.style.overflow)
      .withContext('o estilo da aplicação hospedeira não pode ser descartado')
      .toBe('scroll');
  });

  it('ignora liberações sem trava correspondente', () => {
    service.release();
    service.release();

    expect(service.active).toBe(0);

    service.lock();
    expect(document.body.style.overflow)
      .withContext('o contador não pode ficar negativo')
      .toBe('hidden');
  });
});
