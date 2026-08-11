/**
 * Estilos mínimos das diretivas que escrevem fora do encapsulamento do Angular.
 *
 * `bdTooltip` cria o balão no `<body>` e `bdReveal` aplica classes no elemento
 * hospedeiro: nenhum dos dois é alcançado pelo CSS encapsulado de um componente.
 * A folha `bandeira-ui/styles/animations` cobre esses casos, mas depende de o
 * consumidor tê-la importado — quando isso não acontece, o balão aparece como
 * texto solto no canto da página.
 *
 * Para eliminar a dependência silenciosa, o mesmo conjunto essencial de regras
 * é injetado em tempo de execução, uma única vez por documento. A folha é
 * inserida como **primeiro** nó do `<head>`, de modo que qualquer estilo
 * declarado pela aplicação — inclusive a folha oficial da biblioteca — tenha
 * precedência sobre ela. O resultado é um piso funcional, nunca um teto.
 */

const MARKER = 'data-bd-runtime-styles';

const RULES = `
.bd-reveal{opacity:0;transition:opacity var(--bd-duration-slow,.5s) var(--bd-ease,cubic-bezier(.16,1,.3,1)),transform var(--bd-duration-slow,.5s) var(--bd-ease,cubic-bezier(.16,1,.3,1));will-change:opacity,transform}
.bd-reveal--up{transform:translateY(32px)}
.bd-reveal--down{transform:translateY(-32px)}
.bd-reveal--left{transform:translateX(-36px)}
.bd-reveal--right{transform:translateX(36px)}
.bd-reveal--scale{transform:scale(.94)}
.bd-reveal.is-visible{opacity:1;transform:none;will-change:auto}
.bd-tooltip{position:fixed;top:0;left:0;z-index:var(--bd-z-tooltip,400);max-width:260px;padding:.4rem .65rem;background:var(--bd-fg,#10131c);border-radius:var(--bd-radius-sm,.5rem);color:var(--bd-bg,#fff);font-family:var(--bd-font-sans,system-ui,sans-serif);font-size:.78rem;font-weight:500;line-height:1.45;pointer-events:none;animation:bd-tooltip-in .14s ease}
@keyframes bd-tooltip-in{from{opacity:0}to{opacity:1}}
.bd-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media (prefers-reduced-motion:reduce){.bd-reveal{opacity:1;transform:none;transition:none}}
`;

/** Garante os estilos de base no documento. Chamadas repetidas não têm efeito. */
export function ensureBdRuntimeStyles(document: Document): void {
  const head = document.head;
  if (!head || head.querySelector(`style[${MARKER}]`)) return;

  const style = document.createElement('style');
  style.setAttribute(MARKER, '');
  style.textContent = RULES;
  head.insertBefore(style, head.firstChild);
}
