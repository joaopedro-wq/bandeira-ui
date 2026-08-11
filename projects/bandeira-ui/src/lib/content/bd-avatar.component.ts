import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type BdAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Foto de perfil com fallback para iniciais.
 *
 * Se a imagem falhar, as iniciais entram no lugar — sem ícone quebrado. A cor
 * de fundo é derivada do nome, então a mesma pessoa tem sempre a mesma cor.
 *
 * @example
 * ```html
 * <bd-avatar name="João Pedro Bandeira" src="/user.jpg" />
 * <bd-avatar name="Maria Silva" size="lg" />
 * ```
 */
@Component({
  selector: 'bd-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src() && !falhou()) {
      <img [src]="src()" [alt]="name()" (error)="falhou.set(true)" />
    } @else {
      <span class="bd-avatar__initials" [style.background]="cor()" [attr.aria-hidden]="!!name()">
        {{ iniciais() }}
      </span>
      @if (name()) {
        <span class="bd-sr-only">{{ name() }}</span>
      }
    }
  `,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: inline-grid;
      place-items: center;
      overflow: hidden;
      border-radius: 50%;
      background: var(--bd-surface-hover, #f1f3f9);
      flex-shrink: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bd-avatar__initials {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
      color: #fff;
      font-weight: var(--bd-weight-semibold, 600);
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    :host(.bd-avatar--sm) {
      width: 28px;
      height: 28px;
      font-size: 0.68rem;
    }
    :host(.bd-avatar--md) {
      width: 40px;
      height: 40px;
      font-size: 0.85rem;
    }
    :host(.bd-avatar--lg) {
      width: 56px;
      height: 56px;
      font-size: 1.1rem;
    }
    :host(.bd-avatar--xl) {
      width: 88px;
      height: 88px;
      font-size: 1.7rem;
    }

    .bd-sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
})
export class BdAvatarComponent {
  readonly name = input('');
  readonly src = input('');
  readonly size = input<BdAvatarSize>('md');

  protected readonly falhou = signal(false);

  protected readonly classes = computed(() => `bd-avatar--${this.size()}`);

  /** Primeira letra do primeiro e do último nome. */
  protected readonly iniciais = computed(() => {
    const partes = this.name().trim().split(/\s+/).filter(Boolean);
    if (!partes.length) return '?';
    if (partes.length === 1) return partes[0].slice(0, 2);
    return partes[0][0] + partes[partes.length - 1][0];
  });

  /** Matiz derivado do nome: mesma pessoa, mesma cor, sempre. */
  protected readonly cor = computed(() => {
    const nome = this.name();
    if (!nome) return 'var(--bd-fg-subtle, #7b8399)';

    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360} 55% 45%)`;
  });
}
