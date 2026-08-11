/**
 * GitHub Pages serve arquivos estáticos: ao abrir /componentes/button direto,
 * ele procura um arquivo nesse caminho, não encontra e devolve 404 — o roteador
 * do Angular nem chega a rodar.
 *
 * Copiar o index.html para 404.html resolve: o Pages entrega o app na página de
 * erro, o Angular assume e mostra a rota certa.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dir = join('dist', 'docs', 'browser');
const index = join(dir, 'index.html');
const fallback = join(dir, '404.html');

if (!existsSync(index)) {
  console.warn(`[spa-fallback] ${index} não encontrado — nada a fazer.`);
  process.exit(0);
}

copyFileSync(index, fallback);
console.log('[spa-fallback] 404.html criado para as rotas do SPA.');
