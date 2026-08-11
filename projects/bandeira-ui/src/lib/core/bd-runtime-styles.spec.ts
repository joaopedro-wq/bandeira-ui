import { ensureBdRuntimeStyles } from './bd-runtime-styles';

const SELECTOR = 'style[data-bd-runtime-styles]';

describe('ensureBdRuntimeStyles', () => {
  afterEach(() => {
    document.head.querySelectorAll(SELECTOR).forEach((node) => node.remove());
  });

  it('injeta a folha de base uma única vez', () => {
    ensureBdRuntimeStyles(document);
    ensureBdRuntimeStyles(document);
    ensureBdRuntimeStyles(document);

    expect(document.head.querySelectorAll(SELECTOR).length).toBe(1);
  });

  it('cobre as classes das diretivas que escrevem fora do encapsulamento', () => {
    ensureBdRuntimeStyles(document);
    const css = document.head.querySelector(SELECTOR)!.textContent!;

    expect(css).toContain('.bd-tooltip');
    expect(css).toContain('.bd-reveal');
    expect(css).toContain('.bd-sr-only');
  });

  it('insere a folha no topo do head para não vencer o CSS da aplicação', () => {
    const marker = document.createElement('style');
    document.head.appendChild(marker);

    ensureBdRuntimeStyles(document);

    expect(document.head.firstChild)
      .withContext('a folha de base é um piso, não um teto')
      .toBe(document.head.querySelector(SELECTOR));

    marker.remove();
  });
});
