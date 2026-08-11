import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BdButtonComponent } from 'bandeira-ui';
import { DocsDemoComponent } from '../../shared/docs-demo.component';
import { DocsApiComponent, DocsApiRow } from '../../shared/docs-api.component';
import { DocsPageHeadComponent } from '../../shared/docs-page-head.component';

@Component({
  selector: 'docs-button-page',
  standalone: true,
  imports: [BdButtonComponent, DocsDemoComponent, DocsApiComponent, DocsPageHeadComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page-head
      title="Button"
      selector="[bdButton]"
      description="Usa seletor de atributo em vez de wrapper: aplica direto em <button> e <a>, sem
        elemento extra no DOM e sem perder a semântica nativa — foco, Enter, href e o
        comportamento de formulário continuam sendo do elemento real."
    />

    <docs-demo
      title="Variantes"
      description="Primary para a ação principal da tela; ghost e subtle para ações secundárias; danger para o que destrói dado."
      [code]="codVariantes"
    >
      <button bdButton>Primary</button>
      <button bdButton variant="ghost">Ghost</button>
      <button bdButton variant="subtle">Subtle</button>
      <button bdButton variant="danger">Danger</button>
    </docs-demo>

    <docs-demo
      title="Tamanhos"
      description="O md e o lg têm 44px de altura mínima — o alvo de toque recomendado para dedos."
      [code]="codTamanhos"
    >
      <button bdButton size="sm">Small</button>
      <button bdButton size="md">Medium</button>
      <button bdButton size="lg">Large</button>
    </docs-demo>

    <docs-demo
      title="Carregando e desabilitado"
      description="Em loading o botão fica com aria-busy e deixa de responder ao clique — não é só visual."
      [code]="codEstados"
    >
      <button bdButton [loading]="salvando()" (click)="simular()">
        {{ salvando() ? 'Enviando' : 'Clique para ver o loading' }}
      </button>
      <button bdButton variant="ghost" disabled>Desabilitado</button>
    </docs-demo>

    <docs-demo
      title="Só com ícone"
      description="Botão quadrado. Exige aria-label — sem ele o componente avisa no console durante o desenvolvimento, porque um ícone sozinho não é anunciado por leitores de tela."
      [code]="codIcone"
    >
      <button bdButton iconOnly aria-label="Fechar">✕</button>
      <button bdButton iconOnly variant="ghost" aria-label="Buscar">⌕</button>
      <button bdButton iconOnly variant="subtle" size="sm" aria-label="Editar">✎</button>
    </docs-demo>

    <docs-demo
      title="Como link"
      description="Com <a> o botão continua sendo um link de verdade: abre em nova aba, permite copiar o endereço e aparece no histórico."
      [code]="codLink"
    >
      <a bdButton href="https://angular.dev" target="_blank" rel="noopener">Link primário</a>
      <a bdButton variant="ghost" href="https://angular.dev" target="_blank" rel="noopener">
        Link ghost
      </a>
    </docs-demo>

    <docs-demo title="Largura total" [code]="codBlock" column>
      <button bdButton block>Ocupa a linha inteira</button>
    </docs-demo>

    <docs-api [rows]="api" />
  `,
})
export class ButtonPageComponent {
  readonly salvando = signal(false);

  simular() {
    this.salvando.set(true);
    setTimeout(() => this.salvando.set(false), 1800);
  }

  readonly codVariantes = `<button bdButton>Primary</button>
<button bdButton variant="ghost">Ghost</button>
<button bdButton variant="subtle">Subtle</button>
<button bdButton variant="danger">Danger</button>`;

  readonly codTamanhos = `<button bdButton size="sm">Small</button>
<button bdButton size="md">Medium</button>
<button bdButton size="lg">Large</button>`;

  readonly codEstados = `<button bdButton [loading]="salvando()">Enviar</button>
<button bdButton variant="ghost" disabled>Desabilitado</button>`;

  readonly codIcone = `<button bdButton iconOnly aria-label="Fechar">✕</button>
<button bdButton iconOnly variant="ghost" aria-label="Buscar">⌕</button>`;

  readonly codLink = `<a bdButton href="/docs">Link primário</a>
<a bdButton variant="ghost" href="/docs">Link ghost</a>`;

  readonly codBlock = `<button bdButton block>Ocupa a linha inteira</button>`;

  readonly api: DocsApiRow[] = [
    {
      name: 'variant',
      type: "'primary' | 'ghost' | 'subtle' | 'danger'",
      default: "'primary'",
      description: 'Peso visual do botão na hierarquia da tela.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Altura e padding. O md e o lg respeitam o alvo de toque de 44px.',
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Mostra o spinner, aplica aria-busy e bloqueia a interação.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Desabilita o botão e o remove da ordem de tabulação.',
    },
    {
      name: 'block',
      type: 'boolean',
      default: 'false',
      description: 'Ocupa toda a largura disponível.',
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Botão quadrado só com ícone. Exige aria-label ou aria-labelledby.',
    },
  ];
}
