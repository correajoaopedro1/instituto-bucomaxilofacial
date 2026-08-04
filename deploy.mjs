/* ===================================================================
   INSTITUTO BUCOMAXILOFACIAL — publicação no branch de produção
   -------------------------------------------------------------------
     node deploy.mjs                     -> produção,    branch `producao`
     node deploy.mjs --homologacao       -> homologação, branch `homologacao`
     node deploy.mjs --push              -> o mesmo, já enviando

   DOIS DESTINOS, DOIS BRANCHES
     O modo e o branch andam grudados: o pacote de homologação só pode
     ir para `homologacao`, e o de produção só para `producao`. Não há
     combinação que publique um no lugar do outro.

     `homologacao` é para ver o site rodando de verdade sem tocar no
     domínio real — noindex nas 4 páginas e Disallow: / no robots, então
     nem que caia no ar por engano ele é indexado. Não exige nenhuma
     pendência preenchida.

     `producao` exige as pendências bloqueantes e é o que vai ao domínio.

   COMO FUNCIONA
     1. Roda o build no modo correspondente. Em produção, se houver
        pendência bloqueante em tokens.json, o build aborta e nada
        acontece aqui.
     2. Copia 2-PARA-SUBIR/site/ para a RAIZ do branch de destino,
        usando um worktree em .deploy/.
     3. Comita. Enviar é passo separado, por opção.

   POR QUE UM BRANCH SÓ PARA ISSO
     A Hostinger publica a raiz do branch que ela observa. Se ela
     observasse `main`, iria para o servidor o projeto inteiro —
     3-PROJETO/, PENDENCIAS.md, build.mjs — e o PENDENCIAS.md tem
     observações que não podem ser públicas.

     E tem a razão principal: `producao` só é escrito por este script,
     que só roda depois de um build `--producao` bem-sucedido. Um push
     em `main` não publica nada. Sem isso, um push distraído colocaria o
     pacote de homologação — noindex e Disallow: / — no domínio que já
     tem histórico, e o site sairia do índice do Google.

   O envio não é automático de propósito: é a única etapa irreversível
   da cadeia, e num site de saúde ela merece um comando explícito.
=================================================================== */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ    = path.dirname(fileURLToPath(import.meta.url));
const PACOTE  = path.join(RAIZ, '2-PARA-SUBIR', 'site');
const TRABALHO= path.join(RAIZ, '.deploy');

const ENVIAR      = process.argv.includes('--push');
const HOMOLOGACAO = process.argv.includes('--homologacao');

/* Modo e branch são decididos juntos, num lugar só. É isso que impede
   um pacote de homologação de chegar ao branch de produção. */
const BRANCH    = HOMOLOGACAO ? 'homologacao' : 'producao';
const ARGS_BUILD= HOMOLOGACAO ? ['build.mjs'] : ['build.mjs', '--producao'];
const ROTULO    = HOMOLOGACAO ? 'homologação' : 'produção';

const git = (args, opts = {}) =>
  execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', stdio: 'pipe', ...opts }).trim();
const gitDeploy = (args) => git(args, { cwd: TRABALHO });

function existe(cmd) { try { cmd(); return true; } catch { return false; } }

/* ---------- 0. sanidade ---------- */
try { git(['rev-parse', '--is-inside-work-tree']); }
catch { console.error('\n  Não é um repositório git. Rode `git init` primeiro.\n'); process.exit(1); }

const sujo = git(['status', '--porcelain']);
if (sujo) {
  console.error('\n  Há alterações não comitadas na fonte:\n');
  console.error(sujo.split('\n').map((l) => '      ' + l).join('\n'));
  console.error('\n  Comite antes de publicar — senão o que vai ao ar não');
  console.error('  corresponde a nenhum commit e fica impossível voltar atrás.\n');
  process.exit(1);
}

/* ---------- 1. build ---------- */
console.log(`\n  [1/3] build de ${ROTULO}`);
try {
  execFileSync(process.execPath, ARGS_BUILD, { cwd: RAIZ, stdio: 'inherit' });
} catch {
  console.error('\n  Build abortado. Nada foi publicado.\n');
  process.exit(1);
}

/* ---------- 2. worktree do branch de produção ---------- */
console.log('  [2/3] montando o branch `' + BRANCH + '`');

if (fs.existsSync(TRABALHO)) {
  try { git(['worktree', 'remove', '--force', '.deploy']); } catch {}
  fs.rmSync(TRABALHO, { recursive: true, force: true });
}

const branchExiste = existe(() => git(['rev-parse', '--verify', BRANCH]));

if (branchExiste) {
  git(['worktree', 'add', TRABALHO, BRANCH]);
  // limpa o conteúdo antigo (menos .git) — arquivo removido da fonte
  // precisa sumir do servidor também
  for (const e of fs.readdirSync(TRABALHO)) {
    if (e === '.git') continue;
    fs.rmSync(path.join(TRABALHO, e), { recursive: true, force: true });
  }
} else {
  git(['worktree', 'add', '--detach', TRABALHO]);
  gitDeploy(['checkout', '--orphan', BRANCH]);
  gitDeploy(['rm', '-rf', '--cached', '.']);
  for (const e of fs.readdirSync(TRABALHO)) {
    if (e === '.git') continue;
    fs.rmSync(path.join(TRABALHO, e), { recursive: true, force: true });
  }
}

fs.cpSync(PACOTE, TRABALHO, { recursive: true });

/* O .gitignore da raiz ignora 2-PARA-SUBIR/. Aqui os mesmos arquivos
   estão na raiz do branch e PRECISAM ser versionados. */
fs.writeFileSync(path.join(TRABALHO, '.gitignore'),
  '# Branch de produção: aqui tudo é versionado de propósito.\n' +
  '# Gerado por `npm run deploy` — não edite à mão.\n', 'utf8');

/* ---------- 3. commit ---------- */
gitDeploy(['add', '-A']);

const mudou = existe(() => gitDeploy(['diff', '--cached', '--quiet'])) === false;
if (!mudou) {
  console.log('\n  Nada mudou desde a última publicação. Branch já está em dia.\n');
  git(['worktree', 'remove', '--force', '.deploy']);
  process.exit(0);
}

const commitFonte = git(['rev-parse', '--short', 'HEAD']);
gitDeploy(['commit', '-m', `${BRANCH}: build de ${commitFonte}`]);
const nArquivos = gitDeploy(['ls-files']).split('\n').filter(Boolean).length;

console.log(`  [3/3] commit feito — ${nArquivos} arquivos no branch \`${BRANCH}\``);

/* ---------- 4. envio ---------- */
if (ENVIAR) {
  try {
    git(['push', 'origin', BRANCH], { stdio: 'inherit' });
    console.log(`\n  Enviado. A Hostinger publica em seguida, pelo webhook.\n`);
  } catch {
    console.error(`\n  Falha no push. Confira se o remoto 'origin' existe e se você`);
    console.error(`  tem acesso. O commit está feito — basta rodar:\n`);
    console.error(`      git push origin ${BRANCH}\n`);
    process.exit(1);
  }
} else {
  console.log(`\n  Commit pronto, nada foi enviado ainda.`);
  console.log(`  Para publicar de fato:\n`);
  console.log(`      git push origin ${BRANCH}\n`);
  console.log(`  (ou rode \`npm run deploy:push\` da próxima vez)\n`);
}

git(['worktree', 'remove', '--force', '.deploy']);
