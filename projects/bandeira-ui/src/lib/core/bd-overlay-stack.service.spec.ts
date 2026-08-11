import { TestBed } from '@angular/core/testing';
import { BdOverlayStackService } from './bd-overlay-stack.service';

describe('BdOverlayStackService', () => {
  let service: BdOverlayStackService;
  const first = { name: 'first' };
  const second = { name: 'second' };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BdOverlayStackService);
  });

  it('considera do topo apenas a última camada empilhada', () => {
    service.push(first);
    service.push(second);

    expect(service.isTopmost(second)).toBeTrue();
    expect(service.isTopmost(first)).toBeFalse();
  });

  it('devolve o topo à camada anterior ao remover', () => {
    service.push(first);
    service.push(second);
    service.remove(second);

    expect(service.isTopmost(first)).toBeTrue();
    expect(service.depth).toBe(1);
  });

  it('não duplica uma camada empilhada duas vezes', () => {
    service.push(first);
    service.push(first);

    expect(service.depth).toBe(1);
  });

  it('não reporta topo com a pilha vazia', () => {
    expect(service.isTopmost(first)).toBeFalse();
    expect(service.isTopmost(undefined)).toBeFalse();
  });
});
