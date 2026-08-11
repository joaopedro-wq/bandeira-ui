<div align="center">

# bandeira-ui

**Design system em Angular construído sobre CSS custom properties.**

O mesmo componente acompanha tema claro e escuro sem uma linha de configuração.
Acessibilidade e `prefers-reduced-motion` vêm de fábrica, não como remendo.

[![npm](https://img.shields.io/npm/v/bandeira-ui.svg)](https://www.npmjs.com/package/bandeira-ui)
[![license](https://img.shields.io/npm/l/bandeira-ui.svg)](./LICENSE)
[![Angular](https://img.shields.io/badge/Angular-20%2B-dd0031.svg)](https://angular.dev)

[Documentação](https://joaopedro-wq.github.io/bandeira-ui/) ·
[npm](https://www.npmjs.com/package/bandeira-ui) ·
[Changelog](./CHANGELOG.md)

</div>

---

## Por que existe

Todo projeto novo recomeçava o botão, o card e o modal do zero — inconsistência visual e
retrabalho a cada tela. A `bandeira-ui` resolve isso com três decisões:

- **Tokens, não classes.** Redefina `--bd-primary` no seu `:root` e o sistema inteiro muda.
  Sem recompilar, sem `!important`, sem sobrescrever seletor.
- **Acessível por padrão.** Foco preso no modal, `tablist` completo por teclado, campos com
  rótulo e descrição ligados sozinhos. Você não precisa lembrar de nada disso.
- **Sem peso extra.** Componentes standalone, `OnPush` e signals. As animações são CSS puro —
  a biblioteca não obriga ninguém a instalar `@angular/animations`.

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

Para protótipos, `BANDEIRA_UI` importa tudo de uma vez. Em produção, prefira importar só o que
usar — o tree shaking agradece.

## Componentes

| Componente | Seletor | Destaque |
|---|---|---|
| Button | `[bdButton]` | Atributo: serve em `<button>` e `<a>` sem wrapper. Avisa se `iconOnly` não tiver `aria-label` |
| Card | `<bd-card>` | Variações `interactive` e `dashed` |
| Chip | `<bd-chip>` | 6 tons, contornado e removível |
| Field | `<bd-field>` | Liga `for`, `aria-describedby` e `aria-invalid` ao campo sozinho |
| Input | `[bdInput]` | Estilo encapsulado em `input`, `textarea` e `select` |
| Tabs | `<bd-tabs>` | `tablist` WAI-ARIA: setas, Home/End, pula desabilitadas |
| TabPanel | `<bd-tab-panel>` | Fecha o par `tab` ↔ `tabpanel` para leitores de tela |
| Modal | `<bd-modal>` | Foco preso, Esc, clique no fundo, bottom sheet no mobile |
| Metric | `<bd-metric>` | Contagem animada ao entrar na viewport |

### Diretivas

| Diretiva | Uso |
|---|---|
| `bdReveal` | Revela no scroll: `up`, `down`, `left`, `right`, `scale` |
| `bdCountUp` | Anima um número de 0 até o valor final |

Ambas usam `IntersectionObserver`, desconectam o observer após revelar e são seguras em SSR.

## Temas

```css
:root {
  --bd-primary: #7c3aed;
  --bd-radius: 0.5rem;
}
```

O tema escuro entra com `data-theme="dark"` no elemento raiz. Sem atributo nenhum, a biblioteca
segue o `prefers-color-scheme` do sistema.

## Desenvolvimento

```bash
npm install
npm start          # site de documentação em http://localhost:4200
npm run build:lib  # empacota em dist/bandeira-ui
npm test           # testes unitários
npm run pack:lib   # gera o tarball para inspecionar o que vai pro npm
```

## Licença

[MIT](./LICENSE) © João Pedro Bandeira
