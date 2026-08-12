/**
 * README, LICENSE e CHANGELOG vivem na raiz do repositório — é lá que o GitHub
 * os procura. Mas o npm lê o README de dentro do pacote: sem esta cópia, a
 * página em npmjs.com sai em branco e o `license: MIT` do package.json fica
 * sem o arquivo correspondente.
 *
 * O `assets` do ng-package.json não resolve: ng-packagr recusa qualquer caminho
 * fora da raiz do projeto da biblioteca.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dest = join('dist', 'bandeira-ui');

if (!existsSync(dest)) {
  console.error(`[copy-lib-meta] ${dest} não existe — rode o build da lib antes.`);
  process.exit(1);
}

const arquivos = ['README.md', 'LICENSE', 'CHANGELOG.md'];
const faltando = arquivos.filter((f) => !existsSync(f));

if (faltando.length) {
  console.error(`[copy-lib-meta] não encontrei na raiz: ${faltando.join(', ')}`);
  process.exit(1);
}

for (const arquivo of arquivos) {
  copyFileSync(arquivo, join(dest, arquivo));
}

console.log(`[copy-lib-meta] copiados para o pacote: ${arquivos.join(', ')}`);
