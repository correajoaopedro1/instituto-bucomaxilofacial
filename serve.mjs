/* ===================================================================
   Servidor estático local — para ver o pacote como ele vai ao ar.
     node serve.mjs            -> serve 2-PARA-SUBIR/site na porta 8099
     node serve.mjs 3000       -> outra porta

   Existe porque as páginas usam caminhos absolutos (/assets/...):
   abrir o HTML direto por file:// não carrega CSS nem JS. Para mandar
   a prévia para outra pessoa, use os arquivos de 1-PREVIEW/, que são
   autocontidos.
=================================================================== */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), '2-PARA-SUBIR', 'site');
const PORTA = parseInt(process.argv[2] || '8099', 10);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.png':  'image/png',  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif',  '.svg':  'image/svg+xml',
  '.woff': 'font/woff',  '.woff2': 'font/woff2',
};

if (!fs.existsSync(RAIZ)) {
  console.error('\n  2-PARA-SUBIR/site não existe. Rode `npm run build` primeiro.\n');
  process.exit(1);
}

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';

  const arquivo = path.join(RAIZ, rel);
  if (!arquivo.startsWith(RAIZ)) { res.writeHead(403); return res.end('403'); }

  fs.readFile(arquivo, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 — ' + rel);
    }
    res.writeHead(200, { 'Content-Type': TIPOS[path.extname(arquivo).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORTA, () => {
  console.log(`\n  http://localhost:${PORTA}/`);
  console.log(`  servindo 2-PARA-SUBIR/site — Ctrl+C para parar\n`);
});
