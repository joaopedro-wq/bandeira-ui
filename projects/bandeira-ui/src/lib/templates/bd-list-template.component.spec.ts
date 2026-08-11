import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdListTemplateComponent } from './bd-list-template.component';

@Component({
  standalone: true,
  imports: [BdListTemplateComponent],
  template: `
    <bd-list-template
      title="Projetos"
      [loading]="loading()"
      [empty]="empty()"
      [placeholderCount]="3"
    >
      <button bdListActions type="button">Novo</button>
      <p bdListEmpty class="vazio">Nenhum projeto ainda</p>
      <table class="resultados">
        <tbody>
          <tr>
            <td>Projeto A</td>
          </tr>
        </tbody>
      </table>
    </bd-list-template>
  `,
})
class HostComponent {
  readonly loading = signal(false);
  readonly empty = signal(false);
}

describe('BdListTemplateComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const query = (selector: string): HTMLElement | null =>
    fixture.nativeElement.querySelector(selector);

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('exibe os resultados no estado preenchido', () => {
    expect(query('.resultados')).not.toBeNull();
    expect(query('bd-skeleton')).toBeNull();
    expect(query('.bd-list__body')?.getAttribute('aria-busy')).toBe('false');
  });

  it('substitui os resultados por placeholders durante o carregamento', () => {
    host.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('bd-skeleton').length).toBe(3);
    expect(query('.resultados'))
      .withContext('resultados obsoletos não podem coexistir com o carregamento')
      .toBeNull();
  });

  it('anuncia o carregamento para leitores de tela', () => {
    host.loading.set(true);
    fixture.detectChanges();

    const status = query('[role="status"]');
    expect(status?.textContent).toContain('Carregando');
    expect(query('.bd-list__body')?.getAttribute('aria-busy')).toBe('true');
  });

  it('exibe o estado vazio quando não há resultados', () => {
    host.empty.set(true);
    fixture.detectChanges();

    expect(query('.vazio')).not.toBeNull();
    expect(query('.resultados')).toBeNull();
  });

  it('dá precedência ao carregamento sobre o estado vazio', () => {
    host.loading.set(true);
    host.empty.set(true);
    fixture.detectChanges();

    expect(query('bd-skeleton')).not.toBeNull();
    expect(query('.vazio')).withContext('uma lista ainda carregando não está vazia').toBeNull();
  });

  it('mantém as ações do cabeçalho visíveis em todos os estados', () => {
    host.loading.set(true);
    fixture.detectChanges();

    expect(query('.bd-list__actions button')).not.toBeNull();
  });
});
