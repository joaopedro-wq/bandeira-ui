import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BdSortState, BdTableColumn, BdTableComponent } from './bd-table.component';

interface Projeto {
  nome: string;
  responsavel: string;
  orcamento: number;
  entrega: string | null;
}

const PROJETOS: Projeto[] = [
  { nome: 'Órbita', responsavel: 'Marina', orcamento: 32000, entrega: '2026-03-01' },
  { nome: 'apollo', responsavel: 'Rafael', orcamento: 128000, entrega: null },
  { nome: 'Zênite', responsavel: 'Juliana', orcamento: 7400, entrega: '2026-01-15' },
];

const COLUNAS: BdTableColumn<Projeto>[] = [
  { key: 'nome', header: 'Projeto', sortable: true },
  { key: 'responsavel', header: 'Responsável', secondary: true },
  {
    key: 'orcamento',
    header: 'Orçamento',
    sortable: true,
    align: 'end',
    value: (row) => `R$ ${row.orcamento.toLocaleString('pt-BR')}`,
    sortValue: (row) => row.orcamento,
  },
  { key: 'entrega', header: 'Entrega', sortable: true },
];

@Component({
  standalone: true,
  imports: [BdTableComponent],
  template: `
    <bd-table
      [columns]="colunasFixas() ?? colunas"
      [rows]="rows()"
      [(sort)]="sort"
      [(selection)]="selection"
      [(expanded)]="expandidas"
      [loading]="loading()"
      [selectable]="selectable()"
      [expandable]="expandable()"
      [sortMode]="sortMode()"
      (rowClick)="clicked.set($event)"
    >
      <ng-template #bdTableRowDetail let-row>
        <p>Responsável: {{ row.responsavel }}</p>
      </ng-template>
    </bd-table>
  `,
})
class HostComponent {
  readonly colunas = COLUNAS;
  /** Sobrescreve as colunas em cenários específicos, como fixação e totais. */
  readonly colunasFixas = signal<BdTableColumn<Projeto>[] | null>(null);
  readonly rows = signal<Projeto[]>(PROJETOS);
  readonly sort = signal<BdSortState | null>(null);
  readonly selection = signal<readonly Projeto[]>([]);
  readonly expandidas = signal<readonly Projeto[]>([]);
  readonly loading = signal(false);
  readonly selectable = signal(false);
  readonly expandable = signal(false);
  readonly sortMode = signal<'client' | 'server'>('client');
  readonly clicked = signal<Projeto | null>(null);
}

describe('BdTableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const headers = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="columnheader"]'));
  const bodyRows = (): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('.bd-table__body [role="row"]'));
  const columnText = (column: number): string[] =>
    bodyRows().map(
      (row) => row.querySelectorAll('[role="cell"]')[column].textContent?.trim() ?? '',
    );
  const sortButton = (label: string): HTMLButtonElement =>
    headers()
      .find((header) => header.textContent?.includes(label))!
      .querySelector('button')!;

  const click = (element: HTMLElement) => {
    element.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza os papéis de tabela esperados', () => {
    expect(fixture.nativeElement.querySelector('[role="table"]')).not.toBeNull();
    expect(headers().length).toBe(4);
    expect(bodyRows().length).toBe(3);
  });

  it('usa o acessor da coluna para formatar a célula', () => {
    expect(columnText(2)[0]).toContain('32.000');
  });

  it('preserva a ordem original enquanto não há critério', () => {
    expect(columnText(0)).toEqual(['Órbita', 'apollo', 'Zênite']);
  });

  it('ordena ignorando acentuação e caixa', () => {
    click(sortButton('Projeto'));

    expect(columnText(0))
      .withContext('"apollo" precede "Órbita" para quem lê, apesar da caixa')
      .toEqual(['apollo', 'Órbita', 'Zênite']);
  });

  it('percorre ascendente, descendente e sem ordenação', () => {
    const button = sortButton('Projeto');

    click(button);
    expect(host.sort()).toEqual({ key: 'nome', direction: 'asc' });

    click(button);
    expect(host.sort()).toEqual({ key: 'nome', direction: 'desc' });
    expect(columnText(0)).toEqual(['Zênite', 'Órbita', 'apollo']);

    click(button);
    expect(host.sort()).withContext('o terceiro clique volta à ordem original').toBeNull();
    expect(columnText(0)).toEqual(['Órbita', 'apollo', 'Zênite']);
  });

  it('ordena pelo sortValue quando ele existe', () => {
    click(sortButton('Orçamento'));

    expect(columnText(0))
      .withContext('a ordenação numérica não pode usar o texto formatado')
      .toEqual(['Zênite', 'Órbita', 'apollo']);
  });

  it('mantém vazios no fim nas duas direções', () => {
    const button = sortButton('Entrega');

    click(button);
    expect(columnText(0)[2]).toBe('apollo');

    click(button);
    expect(columnText(0)[2])
      .withContext('uma coluna com lacunas não deve começar por elas')
      .toBe('apollo');
  });

  it('anota a direção da ordenação para leitores de tela', () => {
    const header = headers().find((h) => h.textContent?.includes('Projeto'))!;
    expect(header.getAttribute('aria-sort')).toBe('none');

    click(sortButton('Projeto'));
    expect(header.getAttribute('aria-sort')).toBe('ascending');
  });

  it('não reordena no modo servidor, mas emite o critério', () => {
    host.sortMode.set('server');
    fixture.detectChanges();

    click(sortButton('Projeto'));

    expect(host.sort()).toEqual({ key: 'nome', direction: 'asc' });
    expect(columnText(0))
      .withContext('no modo servidor a ordem vem dos dados recebidos')
      .toEqual(['Órbita', 'apollo', 'Zênite']);
  });

  it('não altera o array de entrada ao ordenar', () => {
    const original = [...host.rows()];
    click(sortButton('Projeto'));

    expect(host.rows()).toEqual(original);
  });

  it('emite a linha clicada', () => {
    click(bodyRows()[1]);

    expect(host.clicked()?.nome).toBe('apollo');
  });

  it('exibe placeholders e oculta as linhas durante o carregamento', () => {
    host.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('bd-skeleton').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('[role="table"]').getAttribute('aria-busy')).toBe(
      'true',
    );
  });

  it('exibe o estado vazio sem linhas', () => {
    host.rows.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum registro encontrado');
  });

  describe('colunas fixas', () => {
    it('acumula o deslocamento das colunas fixadas ao início', () => {
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto', frozen: 'start', width: '160px' },
        { key: 'responsavel', header: 'Responsável', frozen: 'start', width: '140px' },
        { key: 'orcamento', header: 'Orçamento' },
      ]);
      fixture.detectChanges();

      const fixas = headers().filter((header) => header.classList.contains('is-frozen'));
      expect(fixas.length).toBe(2);
      expect(fixas[0].style.left).toBe('0px');
      expect(fixas[1].style.left)
        .withContext('a segunda coluna fixa começa onde a primeira termina')
        .toBe('160px');
    });

    it('desloca as colunas fixas pela largura das colunas de controle', () => {
      host.selectable.set(true);
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto', frozen: 'start', width: '160px' },
        { key: 'orcamento', header: 'Orçamento' },
      ]);
      fixture.detectChanges();

      const fixa = headers().find((header) => header.textContent?.includes('Projeto'))!;
      expect(fixa.style.left)
        .withContext('a coluna de seleção ocupa os primeiros 44px')
        .toBe('44px');
    });

    it('acumula da direita as colunas fixadas ao fim', () => {
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto' },
        { key: 'responsavel', header: 'Responsável', frozen: 'end', width: '120px' },
        { key: 'orcamento', header: 'Orçamento', frozen: 'end', width: '100px' },
      ]);
      fixture.detectChanges();

      const fixas = headers().filter((header) => header.classList.contains('is-frozen'));
      expect(fixas[0].style.right).withContext('Responsável').toBe('100px');
      expect(fixas[1].style.right).withContext('Orçamento, a última').toBe('0px');
    });

    it('marca apenas a última coluna fixa de cada lado como borda', () => {
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto', frozen: 'start', width: '160px' },
        { key: 'responsavel', header: 'Responsável', frozen: 'start', width: '140px' },
        { key: 'orcamento', header: 'Orçamento' },
      ]);
      fixture.detectChanges();

      const bordas = headers().filter((header) => header.classList.contains('is-frozen-edge'));
      expect(bordas.length).toBe(1);
      expect(bordas[0].textContent).toContain('Responsável');
    });
  });

  describe('linhas expansíveis', () => {
    beforeEach(() => {
      host.expandable.set(true);
      fixture.detectChanges();
    });

    it('começa com todas as linhas fechadas', () => {
      expect(fixture.nativeElement.querySelectorAll('.bd-table__detail').length).toBe(0);
      expect(
        fixture.nativeElement.querySelector('.bd-table__expand').getAttribute('aria-expanded'),
      ).toBe('false');
    });

    it('revela o detalhe da linha com o conteúdo projetado', () => {
      click(fixture.nativeElement.querySelector('.bd-table__expand'));

      const detalhe = fixture.nativeElement.querySelector('.bd-table__detail');
      expect(detalhe).not.toBeNull();
      expect(detalhe.textContent).toContain('Responsável: Marina');
      expect(host.expandidas().length).toBe(1);
    });

    it('não dispara o clique da linha ao expandir', () => {
      click(fixture.nativeElement.querySelector('.bd-table__expand'));

      expect(host.clicked())
        .withContext('expandir não é abrir: o clique não pode propagar')
        .toBeNull();
    });

    it('fecha ao clicar novamente', () => {
      const botao = () => fixture.nativeElement.querySelector('.bd-table__expand');

      click(botao());
      click(botao());

      expect(fixture.nativeElement.querySelectorAll('.bd-table__detail').length).toBe(0);
      expect(host.expandidas().length).toBe(0);
    });

    it('mantém várias linhas abertas ao mesmo tempo', () => {
      const botoes: HTMLElement[] = Array.from(
        fixture.nativeElement.querySelectorAll('.bd-table__expand'),
      );
      click(botoes[0]);
      click(botoes[1]);

      expect(fixture.nativeElement.querySelectorAll('.bd-table__detail').length).toBe(2);
    });
  });

  describe('linha de totais', () => {
    it('não é renderizada sem coluna que a defina', () => {
      expect(fixture.nativeElement.querySelector('.bd-table__row--foot')).toBeNull();
    });

    it('calcula a partir das linhas visíveis', () => {
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto', footer: (rows) => `${rows.length} projetos` },
        {
          key: 'orcamento',
          header: 'Orçamento',
          align: 'end',
          footer: (rows) => rows.reduce((soma, row) => soma + row.orcamento, 0),
        },
      ]);
      fixture.detectChanges();

      const rodape = fixture.nativeElement.querySelector('.bd-table__row--foot');
      expect(rodape.textContent).toContain('3 projetos');
      expect(rodape.textContent).toContain('167400');
    });

    it('some durante o carregamento', () => {
      host.colunasFixas.set([
        { key: 'nome', header: 'Projeto', footer: (rows) => `${rows.length} projetos` },
      ]);
      host.loading.set(true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.bd-table__row--foot')).toBeNull();
    });
  });

  describe('seleção', () => {
    beforeEach(() => {
      host.selectable.set(true);
      fixture.detectChanges();
    });

    it('acrescenta a coluna de seleção', () => {
      expect(headers().length).toBe(5);
    });

    it('alterna uma linha sem disparar o clique da linha', () => {
      const checkbox: HTMLInputElement = bodyRows()[0].querySelector('input')!;
      checkbox.click();
      fixture.detectChanges();

      expect(host.selection().length).toBe(1);
      expect(host.clicked())
        .withContext('marcar não é abrir: o clique não pode propagar')
        .toBeNull();
    });

    it('seleciona e limpa todas pelo cabeçalho', () => {
      const master: HTMLInputElement = headers()[0].querySelector('input')!;

      master.click();
      fixture.detectChanges();
      expect(host.selection().length).toBe(3);

      master.click();
      fixture.detectChanges();
      expect(host.selection().length).toBe(0);
    });
  });
});
