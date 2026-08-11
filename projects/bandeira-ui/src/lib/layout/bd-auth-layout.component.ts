import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BdAuthAsideSide = 'left' | 'right';

/**
 * Tela dividida para login, cadastro e recuperação de senha.
 *
 * O painel de marca some abaixo de 900px — no celular o formulário ocupa a
 * tela inteira, que é o que importa ali. Por ser decorativo, ele fica depois
 * do formulário na ordem do DOM: quem navega por teclado chega ao campo antes.
 *
 * @example
 * ```html
 * <bd-auth-layout title="Bem-vindo de volta" subtitle="Entre para continuar.">
 *   <div bdAuthAside>
 *     <h2>Sua marca aqui</h2>
 *   </div>
 *
 *   <form>…</form>
 * </bd-auth-layout>
 * ```
 */
@Component({
  selector: 'bd-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="bd-auth__main">
      <div class="bd-auth__box">
        <div class="bd-auth__brand">
          <ng-content select="[bdAuthBrand]" />
        </div>

        <h1 class="bd-auth__title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="bd-auth__subtitle">{{ subtitle() }}</p>
        }

        <div class="bd-auth__content"><ng-content /></div>

        <div class="bd-auth__footer">
          <ng-content select="[bdAuthFooter]" />
        </div>
      </div>
    </main>

    <!-- Decorativo e depois do formulário no DOM: o teclado chega ao campo antes. -->
    <aside class="bd-auth__aside" aria-hidden="true">
      <ng-content select="[bdAuthAside]" />
    </aside>
  `,
  host: { '[class]': 'classes()' },
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      min-height: 100vh;
      background: var(--bd-bg, #fff);
      color: var(--bd-fg, #10131c);
    }

    /* O painel decorativo troca de lado sem mudar a ordem do DOM. */
    :host(.bd-auth--left) .bd-auth__main {
      order: 2;
    }
    :host(.bd-auth--left) .bd-auth__aside {
      order: 1;
    }

    .bd-auth__main {
      display: grid;
      place-items: center;
      padding: var(--bd-space-6, 2rem) var(--bd-space-5, 1.5rem);
    }

    .bd-auth__box {
      width: 100%;
      max-width: 380px;
    }

    .bd-auth__brand:not(:empty) {
      margin-bottom: var(--bd-space-6, 2rem);
    }

    .bd-auth__title {
      margin: 0;
      font-size: var(--bd-text-2xl, 1.75rem);
      font-weight: var(--bd-weight-bold, 700);
      letter-spacing: -0.025em;
    }

    .bd-auth__subtitle {
      margin: 0.4rem 0 0;
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .bd-auth__content {
      margin-top: var(--bd-space-6, 2rem);
    }

    .bd-auth__footer:not(:empty) {
      margin-top: var(--bd-space-5, 1.5rem);
      padding-top: var(--bd-space-5, 1.5rem);
      border-top: 1px solid var(--bd-border, #e3e7f0);
      color: var(--bd-fg-muted, #545c70);
      font-size: 0.88rem;
      text-align: center;
    }

    .bd-auth__aside {
      display: grid;
      place-items: center;
      padding: var(--bd-space-7, 3rem);
      background: var(--bd-gradient, linear-gradient(120deg, #3d5ce8, #0d9488));
      color: #fff;
    }

    @media (max-width: 900px) {
      :host {
        grid-template-columns: minmax(0, 1fr);
      }

      /* No celular só o formulário importa. */
      .bd-auth__aside {
        display: none;
      }
    }
  `,
})
export class BdAuthLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input('');
  /** Lado do painel decorativo no desktop. */
  readonly asideSide = input<BdAuthAsideSide>('right');

  protected readonly classes = computed(() => `bd-auth--${this.asideSide()}`);
}
