import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/**
 * Marca da bandeira-ui.
 *
 * O símbolo é uma flâmula em um mastro — leitura direta do nome. É desenhado em
 * SVG inline, e não como imagem: acompanha a cor do texto quando preciso,
 * escala sem perda em qualquer densidade de tela e não custa uma requisição.
 *
 * O gradiente recebe um identificador próprio por instância porque `url(#id)`
 * é resolvido no escopo do documento — dois logos na mesma página com o mesmo
 * identificador fariam o segundo referenciar o gradiente do primeiro.
 */
@Component({
  selector: 'docs-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="mark"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 32 32"
      fill="none"
      [attr.role]="wordmark() ? 'presentation' : 'img'"
      [attr.aria-label]="wordmark() ? null : 'bandeira-ui'"
    >
      <defs>
        <linearGradient
          [attr.id]="gradientId"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#3d5ce8" />
          <stop offset="0.48" stop-color="#7c4ddb" />
          <stop offset="1" stop-color="#0d9488" />
        </linearGradient>
      </defs>

      <rect width="32" height="32" rx="8" [attr.fill]="'url(#' + gradientId + ')'" />

      <!-- Mastro e flâmula, em branco sobre o gradiente. -->
      <path
        d="M10.5 6.5v19"
        stroke="#fff"
        stroke-width="2.4"
        stroke-linecap="round"
        opacity="0.95"
      />
      <path d="M13.5 8h11l-3.2 4.6L24.5 17h-11z" fill="#fff" />
    </svg>

    @if (wordmark()) {
      <span class="word"> bandeira<span class="word__accent">-ui</span> </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
    }

    .mark {
      display: block;
      flex-shrink: 0;
    }

    .word {
      color: var(--bd-fg);
      font-size: 1.02rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      white-space: nowrap;
    }

    .word__accent {
      color: var(--bd-primary);
    }
  `,
})
export class DocsLogoComponent {
  readonly size = input(30);
  /** Acrescenta o nome ao lado do símbolo. */
  readonly wordmark = input(false, { transform: booleanAttribute });

  protected readonly gradientId = `bd-logo-${counter++}`;
}

let counter = 0;
