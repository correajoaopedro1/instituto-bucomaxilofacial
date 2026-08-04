# Deploy — Instituto Bucomaxilofacial

---

## Antes de qualquer coisa: uma decisão

O domínio `institutobucomaxilofacial.com.br` **já tem um site no ar**.
E ele já está perdendo URL: `/fellowship/` e `/cursos-e-mentorias/` aparecem
indexadas no Google mas **hoje retornam 404** — ou seja, o problema que os
redirecionamentos resolvem já existe, independente da troca de site.

Isso não é publicar em domínio novo. É **substituir um site com histórico**.
Duas formas de fazer:

### Opção A — Publicar em subdomínio primeiro (recomendado)

Sobe em `novo.institutobucomaxilofacial.com.br`, com `noindex` em todas as
páginas. Serve para o cliente aprovar no ambiente real, com o WhatsApp
funcionando e o GTM disparando. Quando estiver aprovado, troca para a raiz.

Vantagem: o site atual continua no ar e captando enquanto isso.
Custo: zero — subdomínio na Hostinger não é cobrado à parte.

### Opção B — Substituir direto

Mais rápido, mas o site sai do ar durante a troca e qualquer erro
acontece com tráfego real em cima. Se escolher essa, **faça backup completo
do WordPress antes** (Hostinger → Backups → gerar backup manual).

**Em qualquer das duas:** o passo 2 abaixo (redirecionamentos) não é opcional.

---

## 1. O que sobe, e onde

Suba **o conteúdo** da pasta `instituto-bucomaxilofacial/` — não a pasta
em si — para dentro de `public_html/`. O resultado tem que ficar assim:

```
public_html/
├── .htaccess                      ← precisa ir; arquivo oculto
├── index.html                     ← LP Geral, é a home
├── dr-jonathas-claus/
│   └── index.html
├── dr-matheus-spinella/
│   └── index.html
├── dr-lucas/
│   └── index.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/tracking.js
│   └── img/
├── sitemap.xml
└── robots.txt
```

**Não suba** `DESIGN-SYSTEM.md`, `PENDENCIAS.md`, `README.md`, este arquivo,
nem a pasta `_midia-site-antigo/` (é arquivo de trabalho, não vai para o ar).
São documentação interna — o `PENDENCIAS.md`, em particular, contém
observações que não devem ficar públicas. O `.htaccess` já bloqueia `.md`
por segurança, mas o certo é não subir.

### Como subir na Hostinger

1. hPanel → **Gerenciador de Arquivos** → entrar em `public_html`
2. Se for substituir o site antigo: selecionar tudo que está lá e apagar
   (**depois do backup**)
3. Compactar a pasta local em `.zip`, fazer upload do zip e usar **Extrair**
   — é muito mais rápido e confiável que arrastar arquivo por arquivo
4. Conferir que o `.htaccess` foi junto: Gerenciador de Arquivos →
   Configurações → **Mostrar arquivos ocultos**

> FTP também funciona (FileZilla), mas com ~15 arquivos o zip pelo painel
> é mais simples.

---

## 2. Redirecionamentos do site antigo — não pule

Toda URL do site atual que sumir sem redirecionamento vira 404 e perde a
autoridade que já acumulou no Google. O `.htaccess` já traz as duas que
localizei (`/fellowship/` e `/cursos-e-mentorias/`).

**Levante a lista completa antes de trocar:**

1. Google Search Console → **Páginas** → exportar as URLs indexadas
2. Para cada uma, decidir o destino na estrutura nova
3. Acrescentar uma linha no bloco 7 do `.htaccess`:
   `RewriteRule ^url-antiga/?$ /destino-novo/ [R=301,L]`

Se não tiverem acesso ao Search Console, dá para levantar pelo
`site:institutobucomaxilofacial.com.br` no Google — cobre menos, mas
pega o principal.

---

## 3. SSL

hPanel → **Segurança → SSL** → instalar o certificado gratuito
(Let's Encrypt). Depois ative **Forçar HTTPS**.

O `.htaccess` também força HTTPS — os dois juntos não causam conflito.

---

## 4. Checklist antes de considerar publicado

**Bloqueiam a publicação:**

- [ ] `{{GTM_ID}}` substituído pelo ID real do container — sem ele não há rastreamento nenhum
- [ ] `{{HORARIO_ATENDIMENTO}}` preenchido
- [ ] `{{POLITICA_PRIVACIDADE_URL}}` apontando para uma política publicada — exigência de LGPD, já que a página rastreia e capta contato
- [ ] Fotos no lugar dos placeholders, ou o bloco correspondente removido
- [ ] Depoimentos reais e autorizados por escrito, ou o bloco 9 removido inteiro
- [ ] Logos das operadoras no carrossel de convênios (`{{LOGO_CONVENIO_1..6}}`), **com o uso de marca conferido em cada contrato** — ou os `<figure>` que sobrarem apagados
- [ ] **Nenhum `{{` sobrando em nenhuma página** — conferir com Ctrl+F em cada uma
- [ ] Copy revisada pelo jurídico / CRO-SC
- [ ] Acionador do GTM criado com o nome `lp_view` (não `page_view_lp` — ver TRK-01 em `PENDENCIAS.md`)

**Conferir depois de subir:**

- [ ] `https://institutobucomaxilofacial.com.br/` abre a LP Geral
- [ ] As 4 rotas abrem, e o menu navega entre todas
- [ ] `http://` redireciona para `https://`, e `www` redireciona para sem-www
- [ ] Todos os botões de WhatsApp abrem a conversa com a mensagem certa
- [ ] Console do navegador sem erro (F12 → Console)
- [ ] `/sitemap.xml` e `/robots.txt` abrem
- [ ] `/PENDENCIAS.md` dá 403 ou 404
- [ ] Layout íntegro no celular

---

## 5. Depois de publicado

1. **Search Console** — adicionar a propriedade, enviar o `sitemap.xml`,
   e acompanhar a aba Páginas na primeira semana para pegar 404
2. **GTM** — publicar o container e conferir os 8 eventos no modo Preview
   (lista no `README.md` §4.3)
3. **Google Meu Negócio** — atualizar o link do site e substituir o
   `{{LINK_GOOGLE_MEU_NEGOCIO}}` provisório pela URL canônica do perfil
4. **PageSpeed Insights** — rodar nas 4 rotas depois que as fotos reais
   estiverem no ar; imagem mal comprimida é o que costuma derrubar a nota
5. **Backup** — ativar backup automático no hPanel

---

## 6. Sobre a LP do Dr. Lucas

Ela sobe junto, mas está com `noindex` e fora do `sitemap.xml` de propósito —
faltam nome, CRO e formação do cirurgião. O Google não vai indexá-la.

Para liberar quando os dados chegarem:

1. Preencher `{{NOME_LUCAS}}`, `{{CRO_LUCAS}}`, `{{FORMACAO_LUCAS}}` e `{{FORMACAO_CURTA_LUCAS}}`
2. Remover a linha `<meta name="robots" content="noindex, nofollow" />`
3. Apagar o bloco `.pending-note` do topo da página
4. Acrescentar a URL ao `sitemap.xml`
5. Remover `Disallow: /dr-lucas/` do `robots.txt`

---

## 7. Alternativas à Hostinger

Se em algum momento quiserem trocar: como são arquivos estáticos, qualquer
host serve. **Cloudflare Pages** e **Netlify** hospedam isto de graça, com
CDN global e deploy automático a cada alteração — e são mais rápidos que
hospedagem compartilhada. A limitação é que aí a gestão sai do hPanel.

Isso é otimização, não urgência. A Hostinger dá conta.
