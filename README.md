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

**Ações** · Button `[bdButton]` — seletor de atributo, serve em `<button>` e `<a>` sem wrapper; avisa em dev se `iconOnly` não tiver `aria-label`.

**Formulários** · Field `<bd-field>` liga `for`, `aria-describedby` e `aria-invalid` ao campo sozinho · Input `[bdInput]` · Switch `<bd-switch>` e Checkbox `<bd-checkbox>`, ambos com `ControlValueAccessor` e estado indeterminado.

**Navegação** · Tabs `<bd-tabs>` + `<bd-tab-panel>` com `tablist` WAI-ARIA completo (setas, Home/End, pula desabilitadas) · Accordion `<bd-accordion>`.

**Feedback** · Alert `<bd-alert>` (papel ARIA conforme o tom) · Spinner · Skeleton · Progress · Modal `<bd-modal>` com foco preso e bottom sheet no mobile.

**Sobreposição** · Tooltip `[bdTooltip]` no hover **e** no foco · **Tour guiado** `<bd-tour>` + `BdTourService` — onboarding passo a passo que destaca elementos reais da página.

**Conteúdo** · Card · Chip · Avatar (fallback para iniciais, cor derivada do nome) · Badge · Empty State · Metric.

### Diretivas

| Diretiva | Uso |
|---|---|
| `bdReveal` | Revela no scroll: `up`, `down`, `left`, `right`, `scale` |
| `bdCountUp` | Anima um número de 0 até o valor final |

Ambas usam `IntersectionObserver`, desconectam o observer após revelar e são seguras em SSR.

### Tour guiado

```ts
private readonly tour = inject(BdTourService);

this.tour.start([
  { target: '#busca', title: 'Comece aqui', content: 'Encontre qualquer projeto.' },
  { target: '#filtros', title: 'Refine', content: 'Combine filtros para ver só o que interessa.' },
]);
```

Monte `<bd-tour />` uma vez na raiz. O balão é um `role="dialog"` que recebe o foco a cada passo; setas navegam, `Esc` pula, e o alvo é rolado para o centro antes de ser destacado.

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
