<div align="center">

<img src="projects/docs/public/logo.svg" width="72" height="72" alt="" />

# bandeira-ui

**Pare de recomeçar cada tela do zero.**

Painel, listagem, configurações e cadastro em etapas já vêm montados — com tabela, paginação,
estados de carregamento e vazio resolvidos. Você conecta seus dados e entrega. A identidade visual
é sua: uma linha de CSS muda o sistema inteiro.

[![npm](https://img.shields.io/npm/v/bandeira-ui.svg)](https://www.npmjs.com/package/bandeira-ui)
[![license](https://img.shields.io/npm/l/bandeira-ui.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-20%2B-dd0031.svg)](https://angular.dev)

[Documentação](https://joaopedro-wq.github.io/bandeira-ui/) ·
[npm](https://www.npmjs.com/package/bandeira-ui) ·
[Changelog](./CHANGELOG.md)

</div>

---

## O problema

Todo projeto novo recomeça pelo botão, pelo card e pelo modal. Depois refaz, tela a tela, as mesmas
decisões: onde vai o título, o que aparece enquanto a lista carrega, como a barra lateral se
comporta no celular, em que ordem o teclado percorre o formulário. São horas gastas em escolhas já
feitas dezenas de vezes — e que, refeitas, saem diferentes a cada tela.

A `bandeira-ui` responde a isso em três níveis.

| Nível           | O que entrega                                                                        |
| --------------- | ------------------------------------------------------------------------------------ |
| **Tokens**      | Uma custom property por decisão visual. Redefina no seu `:root` e tudo acompanha.     |
| **Componentes** | 31 peças acessíveis desde o primeiro uso, do botão à tabela de dez mil linhas.        |
| **Templates**   | Quatro telas completas, com carregando, vazio e comportamento no celular já decididos. |

## Instalação

```bash
npm install bandeira-ui @angular/cdk
```

```scss
// styles.scss
@use 'bandeira-ui/styles';           // tokens + animações
// ou separadamente:
// @use 'bandeira-ui/styles/tokens';
// @use 'bandeira-ui/styles/animations';
```

```ts
import { BdButtonComponent, BdCardComponent } from 'bandeira-ui';

@Component({
  standalone: true,
  imports: [BdButtonComponent, BdCardComponent],
  template: `
    <bd-card interactive>
      <button bdButton>Salvar</button>
    </bd-card>
  `,
})
export class MinhaTela {}
```

`BANDEIRA_UI` importa o conjunto completo de uma vez — conveniente em protótipos. Em produção,
importe apenas o que a tela utiliza: a eliminação de código não utilizado depende disso.

## Templates de tela

Todo sistema tem as mesmas quatro telas, e em todo projeto elas são remontadas do zero. Os
templates fixam essas respostas uma única vez — e cada área continua um espaço aberto: nenhuma
decisão sobre os seus dados é imposta.

| Template                  | Resolve                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `<bd-dashboard-template>` | Painel: números no topo, análise no centro, contexto na lateral.   |
| `<bd-list-template>`      | Listagem: busca, filtros, resultados e os três estados da lista.    |
| `<bd-settings-template>`  | Preferências: seções com link próprio e barra de salvar condicional. |
| `<bd-wizard-template>`    | Cadastro em etapas, sem deixar ninguém avançar com erro pendente.  |

```html
<bd-list-template
  title="Projetos"
  [loading]="carregando()"
  [empty]="projetos().length === 0"
>
  <button bdButton bdListActions>Novo projeto</button>
  <input bdInput bdListSearch type="search" placeholder="Buscar" />
  <bd-empty-state bdListEmpty title="Nenhum projeto ainda" />

  <bd-table [columns]="colunas" [rows]="projetos()" [trackBy]="porId" />

  <bd-pagination bdListFooter [total]="total()" [(page)]="pagina" />
</bd-list-template>
```

## Componentes

**Ações** · Button `[bdButton]` — seletor de atributo, serve em `<button>` e `<a>` sem elemento
extra; avisa em desenvolvimento quando `iconOnly` não tem `aria-label`.

**Dados** · **Table** `<bd-table>` com ordenação, seleção, virtualização e carregamento sob
demanda · **Pagination** `<bd-pagination>` com sequência condensada.

**Formulários** · Field `<bd-field>` vincula `for`, `aria-describedby` e `aria-invalid`
automaticamente · Input `[bdInput]` · Switch e Checkbox com `ControlValueAccessor` e estado
indeterminado.

**Navegação** · Tabs `<bd-tabs>` + `<bd-tab-panel>` com `tablist` WAI-ARIA completo · **Steps**
`<bd-steps>` em cinco apresentações · Accordion `<bd-accordion>`.

**Feedback** · Alert (papel ARIA conforme o tom) · Spinner · Skeleton · Progress · Modal
`<bd-modal>` com foco confinado, pilha coordenada e formato de bottom sheet no celular.

**Sobreposição** · Tooltip `[bdTooltip]` no ponteiro **e** no foco · **Tour guiado** `<bd-tour>` +
`BdTourService` — integração passo a passo destacando elementos reais da página.

**Estrutura** · App Shell · Auth Layout · Container · Page Header.

**Conteúdo** · Card · Chip · Avatar (cor derivada do nome) · Badge · Empty State · Metric com
variação.

### Diretivas

| Diretiva    | Uso                                                        |
| ----------- | ---------------------------------------------------------- |
| `bdReveal`  | Revela no scroll: `up`, `down`, `left`, `right`, `scale`    |
| `bdCountUp` | Anima um número de zero até o valor final                   |

Ambas usam `IntersectionObserver`, desconectam o observador após revelar e são compatíveis com
renderização no servidor.

## Desempenho

Tabela lenta é a reclamação número um de sistema administrativo. O que mantém a sua utilizável
quando o cliente dobra o volume de dados:

- **Dez mil linhas custam o mesmo que trinta.** Com `virtual`, o que é desenhado depende da altura
  da janela, não do tamanho do relatório.
- **O resto da tela não paga a conta.** `OnPush` e signals em toda a biblioteca: ordenar uma tabela
  não dispara verificação na aplicação inteira.
- **As linhas são reaproveitadas.** `trackBy` existe porque, sem ele, cada atualização joga fora o
  corpo da tabela e o reconstrói — o que o usuário sente como travamento.
- **A próxima página chega antes.** O carregamento sob demanda dispara com uma tela de
  antecedência: o conteúdo já está lá quando o usuário chega.
- **Sem `@angular/animations`.** As transições são CSS puro, compostas na GPU, e respeitam
  `prefers-reduced-motion`.
- **`sideEffects: false`** no pacote: o empacotador remove o que a sua aplicação não importar.

Orientação por volume de dados na [documentação da tabela](https://joaopedro-wq.github.io/bandeira-ui/componentes/table).

## Tour guiado

```ts
private readonly tour = inject(BdTourService);

// `startOnce` registra a exibição e não repete o tour para este usuário.
this.tour.startOnce('onboarding-v1', [
  { target: '#busca', title: 'Comece aqui', content: 'Encontre qualquer projeto.' },
  { target: '#filtros', title: 'Refine', content: 'Combine filtros para ver só o que interessa.' },
]);
```

Monte `<bd-tour />` uma vez na raiz. O destaque recorta o elemento real da página — não é imagem
nem vídeo, então nunca desatualiza. O balão recebe o foco a cada passo, setas navegam e `Esc`
encerra. E `outcome()` diz se o usuário concluiu e em que passo parou: o suficiente para descobrir
onde a integração perde gente.

## Temas

```css
:root {
  --bd-primary: #7c3aed;
  --bd-radius: 0.5rem;
}
```

O tema escuro é ativado por `data-theme="dark"` no elemento raiz. Sem atributo, a biblioteca segue
o `prefers-color-scheme` do sistema.

## Desenvolvimento

```bash
npm install
npm start          # site de documentação em http://localhost:4200
npm run build:lib  # empacota em dist/bandeira-ui
npm test           # 90 testes unitários
npm run pack:lib   # gera o tarball para inspecionar o que vai ao npm
npm run format     # aplica o Prettier
```

A integração contínua verifica formatação, testes e empacotamento a cada push, e publica a
documentação automaticamente.

## Licença

[MIT](./LICENSE) © João Pedro Bandeira
