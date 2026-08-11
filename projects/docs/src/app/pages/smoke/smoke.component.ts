import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { BANDEIRA_UI, BdTab } from 'bandeira-ui';

/**
 * Página temporária de verificação: renderiza um exemplo de cada componente
 * migrado para confirmar que a biblioteca é consumível de fora.
 * Será substituída pelo site de documentação na Fase 4.
 */
@Component({
  selector: 'docs-smoke',
  standalone: true,
  imports: [BANDEIRA_UI],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="wrap">
      <header class="head">
        <h1>bandeira-ui</h1>
        <button bdButton variant="ghost" size="sm" (click)="toggleTheme()">
          Tema: {{ isDark() ? 'escuro' : 'claro' }}
        </button>
      </header>

      <section>
        <h2>Button</h2>
        <div class="row">
          <button bdButton>Primary</button>
          <button bdButton variant="ghost">Ghost</button>
          <button bdButton variant="subtle">Subtle</button>
          <button bdButton variant="danger">Danger</button>
          <button bdButton [loading]="true">Loading</button>
          <button bdButton iconOnly aria-label="Fechar">&times;</button>
        </div>
      </section>

      <section>
        <h2>Card · Chip · Metric</h2>
        <div class="row">
          <bd-card interactive>
            <strong>Card interativo</strong>
            <div class="row" style="margin-top: 0.75rem">
              <bd-chip>Angular</bd-chip>
              <bd-chip tone="accent">avançado</bd-chip>
              <bd-chip tone="neutral" outlined>rascunho</bd-chip>
              <bd-chip tone="danger" removable (removed)="removido.set(true)">
                {{ removido() ? 'removido!' : 'remover' }}
              </bd-chip>
            </div>
          </bd-card>

          <bd-card>
            <bd-metric [value]="3" suffix="+" label="anos de experiência" gradient />
          </bd-card>
        </div>
      </section>

      <section>
        <h2>Field + Input</h2>
        <div class="grid">
          <bd-field label="Seu nome" hint="Como devo te chamar" required>
            <input bdInput type="text" placeholder="João Pedro" />
          </bd-field>

          <bd-field label="Seu e-mail" [error]="erroEmail()">
            <input
              bdInput
              type="email"
              placeholder="digite algo sem @"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
            />
          </bd-field>
        </div>
      </section>

      <section>
        <h2>Tabs + TabPanel</h2>
        <bd-tabs [tabs]="abas" [(active)]="aba" label="Demonstração" />
        <bd-tab-panel tabId="design" [active]="aba()">
          <bd-card>Protótipo no Figma validado antes do código.</bd-card>
        </bd-tab-panel>
        <bd-tab-panel tabId="code" [active]="aba()">
          <bd-card>Componentes standalone com OnPush e signals.</bd-card>
        </bd-tab-panel>
        <bd-tab-panel tabId="tests" [active]="aba()">
          <bd-card>Cypress cobrindo os fluxos críticos.</bd-card>
        </bd-tab-panel>
      </section>

      <section>
        <h2>Modal</h2>
        <button bdButton (click)="modal.set(true)">Abrir modal</button>
        <bd-modal [(open)]="modal" title="Foco preso aqui dentro">
          <p>Tente sair com Tab — o foco circula dentro do diálogo.</p>
          <div class="row" style="margin-top: 1.5rem; justify-content: flex-end">
            <button bdButton variant="ghost" (click)="modal.set(false)">Cancelar</button>
            <button bdButton (click)="modal.set(false)">Confirmar</button>
          </div>
        </bd-modal>
      </section>

      <section>
        <h2>Reveal</h2>
        <div class="grid">
          @for (dir of ['up', 'left', 'right', 'scale']; track dir; let i = $index) {
            <bd-card [bdReveal]="$any(dir)" [revealDelay]="i * 120" [revealOnce]="false">
              {{ dir }}
            </bd-card>
          }
        </div>
      </section>
    </main>
  `,
  styles: `
    .wrap {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1.25rem 6rem;
    }
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 2rem;
      letter-spacing: -0.03em;
    }
    h2 {
      margin-bottom: 1rem;
      font-size: 1.15rem;
      color: var(--bd-fg-muted);
    }
    section {
      padding-block: 2rem;
      border-top: 1px solid var(--bd-border);
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    bd-tab-panel {
      margin-top: 1.25rem;
    }
  `,
})
export class SmokeComponent {
  private readonly document = inject(DOCUMENT);

  readonly aba = signal('design');
  readonly abas: BdTab[] = [
    { id: 'design', label: 'Design' },
    { id: 'code', label: 'Código' },
    { id: 'tests', label: 'Testes' },
  ];

  readonly modal = signal(false);
  readonly email = signal('');
  readonly removido = signal(false);
  readonly isDark = signal(false);

  erroEmail(): string {
    const v = this.email();
    if (!v) return '';
    return v.includes('@') ? '' : 'Digite um e-mail válido.';
  }

  toggleTheme() {
    this.isDark.update((v) => !v);
    this.document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }
}
