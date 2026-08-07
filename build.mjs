/* ===================================================================
   INSTITUTO BUCOMAXILOFACIAL — gerador do pacote publicável
   -------------------------------------------------------------------
   Reconstrói o gerador que o projeto tinha e que não estava mais em
   nenhuma pasta (o robots.txt do pacote ainda pedia "gere de novo com
   --producao", mas o script não existia).

     node build.mjs              -> homologação  (padrão)
     node build.mjs --producao   -> produção

   O QUE ELE FAZ
     3-PROJETO/  (fonte, com tokens)
        -> 2-PARA-SUBIR/site/     pacote que vai ao ar
        -> 2-PARA-SUBIR/site-hospedagem.zip
        -> 1-PREVIEW/*.html       páginas autocontidas, para aprovação

   REGRA CENTRAL
     Nenhum token não resolvido chega ao HTML publicado — exceto os que
     existem justamente para marcar espaço (data-token / data-slot) e o
     GTM_ID, cujo snippet tem guarda própria. Todo o resto tem uma regra
     explícita: ou a linha sai, ou o bloco sai, ou entra um texto de
     recuo. Nunca "{{ALGUMA_COISA}}" visível na tela.

   HOMOLOGAÇÃO x PRODUÇÃO
     Homologação força noindex nas 4 páginas e Disallow: / no robots.
     Produção mantém o que está na fonte e SE RECUSA A RODAR enquanto
     houver pendência bloqueante em tokens.json. Isso existe para que um
     deploy automático nunca publique um pacote de homologação no
     domínio real — o que tiraria o site do índice do Google.
=================================================================== */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const RAIZ    = path.dirname(fileURLToPath(import.meta.url));
const FONTE   = path.join(RAIZ, '3-PROJETO');
const PACOTE  = path.join(RAIZ, '2-PARA-SUBIR', 'site');
const ZIP     = path.join(RAIZ, '2-PARA-SUBIR', 'site-hospedagem.zip');
const PREVIEW = path.join(RAIZ, '1-PREVIEW');

const PRODUCAO = process.argv.includes('--producao');
const MODO = PRODUCAO ? 'PRODUÇÃO' : 'HOMOLOGAÇÃO';

/* ---------- tokens ---------- */
const bruto = JSON.parse(fs.readFileSync(path.join(RAIZ, 'tokens.json'), 'utf8'));
const BLOQUEANTES = bruto._BLOQUEIAM_A_PRODUCAO || {};
const TOKENS = { ...BLOQUEANTES, ...(bruto._DEGRADAM_MAS_NAO_BLOQUEIAM || {}) };

const preenchido = (t) => typeof TOKENS[t] === 'string' && TOKENS[t].trim() !== '';

/* DOMINIO_SITE é estrutural, não é pendência: ele monta canonical, og:url,
   JSON-LD e sitemap. Vazio, cairia na regra (e) do transformar() — a linha
   inteira sai — e as páginas subiriam sem canonical e com JSON-LD quebrado,
   sem nenhum erro na tela. Por isso a trava é em qualquer modo, não só em
   produção. */
if (!preenchido('DOMINIO_SITE')) {
  console.error(`\n  BUILD ABORTADO\n`);
  console.error(`  {{DOMINIO_SITE}} está vazio em tokens.json.\n`);
  console.error(`  Ele monta canonical, og:url, JSON-LD e sitemap.xml. Sem valor,`);
  console.error(`  essas linhas sairiam do HTML em silêncio. Preencha com o domínio`);
  console.error(`  sem protocolo e sem barra final. Ex.: institutomaxilofacialsc.com\n`);
  process.exit(1);
}

/* ---------- páginas ---------- */
const PAGINAS = [
  { src: 'index.html',                     preview: 'PREVIEW-instituto.html'   },
  { src: 'dr-jonathas-claus/index.html',   preview: 'PREVIEW-dr-jonathas.html' },
  { src: 'dr-matheus-spinella/index.html', preview: 'PREVIEW-dr-matheus.html'  },
  { src: 'dr-lucas/index.html',            preview: 'PREVIEW-dr-lucas.html'    },
];

/* Não sobem para o servidor: documentação interna e arquivo de trabalho.
   O PENDENCIAS.md em particular tem observações que não podem ser públicas. */
const NAO_PUBLICAR = [/\.md$/i, /^_midia-site-antigo\//];

const log = (...a) => console.log(...a);
const avisos = [];

/* ===================================================================
   1. TRAVA DE PRODUÇÃO
=================================================================== */
if (PRODUCAO) {
  const faltando = Object.keys(BLOQUEANTES).filter((t) => !preenchido(t));
  if (faltando.length) {
    console.error(`\n  BUILD DE PRODUÇÃO ABORTADO\n`);
    console.error(`  ${faltando.length} pendência(s) bloqueante(s) em tokens.json:\n`);
    faltando.forEach((t) => console.error(`      {{${t}}}`));
    console.error(`\n  Estas travam a publicação por norma ou por perda total de`);
    console.error(`  rastreamento. Preencha em tokens.json e rode de novo.`);
    console.error(`  Detalhe e responsável de cada uma: 3-PROJETO/PENDENCIAS.md\n`);
    process.exit(1);
  }
}

/* ===================================================================
   2. TRANSFORMAÇÃO DO HTML
=================================================================== */
function transformar(html, arquivo) {
  const linhas = html.split(/\r?\n/);
  const saida = [];

  // --- 2.1 bloco de depoimentos: só entra com os três textos reais ---
  const temDepoimentos = ['DEPOIMENTO_1', 'DEPOIMENTO_2', 'DEPOIMENTO_3'].every(preenchido);
  if (!temDepoimentos && /id="depoimentos"/.test(html)) {
    html = html.replace(
      /[ \t]*<section class="cover reveal" id="depoimentos">[\s\S]*?\n[ \t]*<\/section>/,
      '  <!-- bloco de depoimentos removido: conteúdo real ainda não fornecido (PENDENCIAS DEP-01) -->'
    );
    return transformar(html, arquivo); // reprocessa já sem o bloco
  }

  for (let linha of linhas) {
    const tokensNaLinha = [...linha.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]);

    if (tokensNaLinha.length) {
      // substitui os que têm valor
      for (const t of tokensNaLinha) {
        if (preenchido(t)) linha = linha.split(`{{${t}}}`).join(TOKENS[t]);
      }

      const pendentes = [...linha.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]);

      if (pendentes.length) {
        const t = pendentes[0];

        // (a) marcador de espaço de imagem — é para ficar mesmo
        if (/^(FOTO_|LOGO_CONVENIO_)/.test(t) && /data-(token|slot)=/.test(linha)) {
          saida.push(linha);
          continue;
        }
        // (b) GTM: o snippet tem guarda que não carrega nada com token cru
        if (t === 'GTM_ID') { saida.push(linha); continue; }

        // (c) política de privacidade -> texto de recuo, sem link morto
        if (t === 'POLITICA_PRIVACIDADE_URL') {
          saida.push(linha.replace(
            /<span><a href="\{\{POLITICA_PRIVACIDADE_URL\}\}">Política de Privacidade<\/a><\/span>/,
            '<span>Política de Privacidade em elaboração</span>'
          ));
          continue;
        }
        // (d) horário: cai a linha do valor E o rótulo logo acima
        if (t === 'HORARIO_ATENDIMENTO') {
          if (/Horário de atendimento<\/span>/.test(saida[saida.length - 1] || '')) saida.pop();
          continue;
        }
        // (e) demais: a linha inteira sai (meta og/twitter, JSON-LD, CRO)
        continue;
      }
    }

    saida.push(linha);
  }

  let out = saida.join('\n');

  // --- 2.2 indexação ---
  if (!PRODUCAO) {
    out = out.replace(
      /<meta name="robots" content="[^"]*" \/>/,
      '<meta name="robots" content="noindex, nofollow" />'
    );
  }

  // --- 2.3 rede de segurança ---
  const vazou = [...out.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)]
    .map((m) => m[1])
    .filter((t) => t !== 'GTM_ID' && !/^(FOTO_|LOGO_CONVENIO_)/.test(t));
  if (vazou.length) {
    throw new Error(`${arquivo}: token nao tratado chegou ao HTML -> {{${[...new Set(vazou)][0]}}}`);
  }

  return out;
}

/* -------------------------------------------------------------------
   2-bis. TEXTO SIMPLES COM TOKEN
   sitemap.xml e robots.txt também carregam o domínio. Antes eram
   copiados sem passar por token nenhum — foi assim que o domínio
   antigo ficou gravado à mão em 8 arquivos (E-1/E-2). Aqui não existe
   regra de recuo: token sem valor é erro de build, não linha que some.
------------------------------------------------------------------- */
const COM_TOKEN = ['sitemap.xml', 'robots.txt'];

function substituirTexto(txt, arquivo) {
  for (const t of [...txt.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1])) {
    if (preenchido(t)) txt = txt.split(`{{${t}}}`).join(TOKENS[t]);
  }
  const vazou = [...txt.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]);
  if (vazou.length) {
    throw new Error(`${arquivo}: token sem valor -> {{${[...new Set(vazou)][0]}}}`);
  }
  return txt;
}

/* ===================================================================
   3. MONTA O PACOTE
=================================================================== */
function limpar(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function listar(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? listar(p, base) : [path.relative(base, p).split(path.sep).join('/')];
  });
}

log(`\n  Instituto Bucomaxilofacial — build em modo ${MODO}\n`);

limpar(PACOTE);
const arquivos = listar(FONTE).filter((r) => !NAO_PUBLICAR.some((re) => re.test(r)));
let nHtml = 0;

for (const rel of arquivos) {
  const de = path.join(FONTE, rel.split('/').join(path.sep));
  const para = path.join(PACOTE, rel.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(para), { recursive: true });

  if (rel.endsWith('.html')) {
    fs.writeFileSync(para, transformar(fs.readFileSync(de, 'utf8'), rel), 'utf8');
    nHtml++;
  } else if (rel === 'robots.txt' && !PRODUCAO) {
    fs.writeFileSync(para,
      '# PACOTE DE HOMOLOGACAO - indexacao bloqueada de proposito.\n' +
      '# Gere de novo com --producao antes de publicar de verdade.\n' +
      'User-agent: *\nDisallow: /\n', 'utf8');
  } else if (COM_TOKEN.includes(rel)) {
    fs.writeFileSync(para, substituirTexto(fs.readFileSync(de, 'utf8'), rel), 'utf8');
  } else {
    fs.copyFileSync(de, para);
  }
}
log(`  pacote      ${arquivos.length} arquivos (${nHtml} páginas) -> 2-PARA-SUBIR/site/`);

/* ===================================================================
   4. ZIP  (separador "/" — extrator Linux não entende "\")
=================================================================== */
function gerarZip() {
  const entradas = [];
  const partes = [];
  let offset = 0;

  const doZip = (rel, buf) => {
    const nome = Buffer.from(rel, 'utf8');
    const comp = zlib.deflateRawSync(buf, { level: 9 });
    const crc = zlib.crc32 ? zlib.crc32(buf) : crc32(buf);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); local.writeUInt16LE(8, 8);
    local.writeUInt32LE(crc, 14); local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(buf.length, 22); local.writeUInt16LE(nome.length, 26);
    partes.push(local, nome, comp);
    entradas.push({ rel: nome, crc, comp: comp.length, orig: buf.length, offset });
    offset += 30 + nome.length + comp.length;
  };

  for (const rel of listar(PACOTE)) doZip(rel, fs.readFileSync(path.join(PACOTE, rel.split('/').join(path.sep))));

  const central = [];
  let tamCentral = 0;
  for (const e of entradas) {
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6);
    c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10);
    c.writeUInt32LE(e.crc, 16); c.writeUInt32LE(e.comp, 20); c.writeUInt32LE(e.orig, 24);
    c.writeUInt16LE(e.rel.length, 28); c.writeUInt32LE(e.offset, 42);
    central.push(c, e.rel);
    tamCentral += 46 + e.rel.length;
  }
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(entradas.length, 8); fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(tamCentral, 12); fim.writeUInt32LE(offset, 16);

  fs.writeFileSync(ZIP, Buffer.concat([...partes, ...central, fim]));
  return entradas.length;
}

// CRC-32 próprio: zlib.crc32 só existe do Node 20.15 em diante.
let TAB = null;
function crc32(buf) {
  if (!TAB) {
    TAB = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      TAB[n] = c;
    }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = TAB[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

/* ===================================================================
   4-bis. CACHE BUSTING
   O .htaccess manda o navegador guardar CSS e JS por UM ANO. Sem
   versão na URL, isso significa que uma correção de layout fica
   invisível por um ano para quem já visitou o site — foi exatamente
   o que aconteceu em 04/08/2026: o CSS novo estava no servidor e o
   navegador continuava desenhando com o antigo.

   A URL passa a carregar um hash do conteúdo do arquivo. Mudou o
   arquivo, muda o hash, muda a URL, o navegador baixa de novo. Não
   mudou, o cache de um ano continua valendo — que é o ponto dele.
=================================================================== */
function hashCurto(rel) {
  const buf = fs.readFileSync(path.join(PACOTE, rel.split('/').join(path.sep)));
  let h = 5381;
  for (let i = 0; i < buf.length; i++) h = (((h << 5) + h) ^ buf[i]) >>> 0;
  return h.toString(36).slice(0, 7);
}

const VERSIONAR = ['assets/css/style.css', 'assets/js/main.js', 'assets/js/tracking.js'];
const versoes = {};
for (const rel of VERSIONAR) versoes[rel] = hashCurto(rel);

for (const rel of arquivos.filter((r) => r.endsWith('.html'))) {
  const p = path.join(PACOTE, rel.split('/').join(path.sep));
  let html = fs.readFileSync(p, 'utf8');
  for (const [ativo, v] of Object.entries(versoes)) {
    html = html.split(`/${ativo}"`).join(`/${ativo}?v=${v}"`);
  }
  fs.writeFileSync(p, html, 'utf8');
}
log(`  versão      css=${versoes['assets/css/style.css']} js=${versoes['assets/js/main.js']}`);

log(`  zip         ${gerarZip()} entradas -> 2-PARA-SUBIR/site-hospedagem.zip`);

/* ===================================================================
   5. PRÉVIAS AUTOCONTIDAS
   CSS, JS e imagens embutidos: o cliente abre com dois cliques, sem
   servidor. O JS precisa entrar embutido — por file:// um caminho
   absoluto nunca carrega, e a página parecia quebrada.
=================================================================== */
const MIME = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
               '.webp':'image/webp', '.gif':'image/gif', '.svg':'image/svg+xml' };
const cacheImg = new Map();
function dataUri(rel) {
  if (cacheImg.has(rel)) return cacheImg.get(rel);
  const f = path.join(PACOTE, rel.replace(/^\//, '').split('/').join(path.sep));
  if (!fs.existsSync(f)) return null;
  const mime = MIME[path.extname(f).toLowerCase()];
  if (!mime) return null;
  const uri = `data:${mime};base64,${fs.readFileSync(f).toString('base64')}`;
  cacheImg.set(rel, uri);
  return uri;
}

const css = fs.readFileSync(path.join(PACOTE, 'assets/css/style.css'), 'utf8');
const jsT = fs.readFileSync(path.join(PACOTE, 'assets/js/tracking.js'), 'utf8');
const jsM = fs.readFileSync(path.join(PACOTE, 'assets/js/main.js'), 'utf8');

fs.mkdirSync(PREVIEW, { recursive: true });
for (const p of PAGINAS) {
  let h = fs.readFileSync(path.join(PACOTE, p.src.split('/').join(path.sep)), 'utf8');
  h = h.replace(/<title>/, '<title>[PRÉVIA] ');
  h = h.replace(/[ \t]*<link rel="preload" as="style" href="\/assets\/css\/style\.css(\?v=[a-z0-9]+)?" \/>\r?\n/, '');
  h = h.replace(/<link rel="stylesheet" href="\/assets\/css\/style\.css(\?v=[a-z0-9]+)?" \/>/, `<style>\n${css}\n</style>`);
  h = h.replace(/(src|srcset)="(\/assets\/[^"]+)"/g, (m, a, r) => { const u = dataUri(r); return u ? `${a}="${u}"` : m; });
  h = h.replace(
    /[ \t]*<script src="\/assets\/js\/tracking\.js(\?v=[a-z0-9]+)?" defer><\/script>\s*<script src="\/assets\/js\/main\.js(\?v=[a-z0-9]+)?" defer><\/script>/,
    `<script>\n${jsT}\n</script>\n<script>\n${jsM}\n</script>`
  );
  h = h.replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />');
  fs.writeFileSync(path.join(PREVIEW, p.preview), h, 'utf8');
}
log(`  prévias     ${PAGINAS.length} páginas autocontidas -> 1-PREVIEW/`);

/* ===================================================================
   6. RELATÓRIO
=================================================================== */
const pendentes = Object.keys(TOKENS).filter((t) => !preenchido(t));
const bloqueando = Object.keys(BLOQUEANTES).filter((t) => !preenchido(t));

log('');
if (pendentes.length) {
  log(`  ${pendentes.length} token(s) ainda sem valor em tokens.json`);
  if (bloqueando.length) log(`  ${bloqueando.length} deles BLOQUEIAM a produção: ${bloqueando.join(', ')}`);
}

if (PRODUCAO) {
  log(`\n  Pacote de PRODUÇÃO gerado. Antes de publicar, confirme o que o`);
  log(`  código não tem como verificar:`);
  log(`    [ ] copy revisada pelo jurídico / CRO-SC`);
  log(`    [ ] LOGO-03 decidido (a tagline do logo anuncia "implantes",`);
  log(`        que a regra 6 do briefing proíbe)`);
  log(`    [ ] redirecionamentos do site antigo levantados no Search Console`);
} else {
  log(`\n  Pacote de HOMOLOGAÇÃO: noindex nas 4 páginas e Disallow: / no robots.`);
  log(`  NÃO publique este pacote no domínio real — ele tiraria o site do`);
  log(`  índice do Google. Para valer: node build.mjs --producao`);
}
log('');
