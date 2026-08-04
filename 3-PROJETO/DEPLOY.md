# Deploy — Instituto Bucomaxilofacial

---

## 0. Deploy automático (a partir de 04/08/2026)

O projeto agora tem gerador e está versionado. **O upload manual descrito
na seção 1 virou plano B** — use só se o Git do hPanel estiver indisponível.

### 0.1 Os comandos

```bash
npm run build            # homologação: noindex + Disallow: / (padrão)
npm run build:producao   # produção — só roda com as pendências preenchidas
npm run serve            # abre o pacote em http://localhost:8099
npm run deploy           # build de produção + commit no branch `producao`
npm run deploy:push      # o mesmo, já enviando
```

**Onde se preenchem as pendências:** `tokens.json`, na raiz. É o único
lugar. Preencheu um valor, rodou `npm run build`, ele entra nas 4 páginas.

### 0.2 A trava que protege o domínio

O site atual **já tem histórico no Google**. Se um pacote de homologação
— `noindex` nas 4 páginas e `Disallow: /` no robots — fosse publicado no
domínio real, o site sairia do índice. Três camadas impedem isso:

1. `build.mjs` só gera pacote indexável com `--producao`.
2. O build de produção **aborta** enquanto houver pendência bloqueante em
   `tokens.json` (hoje: `GTM_ID`, `POLITICA_PRIVACIDADE_URL`,
   `HORARIO_ATENDIMENTO`, `CRO_MATHEUS`).
3. O branch `producao` é escrito **apenas** por `deploy.mjs`, que só roda
   depois de um build de produção bem-sucedido. **Um push em `main` não
   publica nada.**

### 0.3 Ligar o Git na Hostinger — uma vez só

Pré-requisito: o repositório precisa estar num remoto (GitHub, GitLab).
Ele existe localmente e ainda **não tem `origin`** — crie o repositório
**privado** (o `PENDENCIAS.md` tem observações internas) e:

```bash
git remote add origin https://github.com/correajoaopedro1/instituto-bucomaxilofacial.git
git push -u origin main
```

**Identidade dos commits** (configurada só neste repositório):

```
correajoaopedro1 <correajoaopedro1@users.noreply.github.com>
```

O endereço `@users.noreply.github.com` é o do próprio GitHub — mantém o
e-mail real fora do histórico público e ainda assim vincula os commits à
conta. Se o GitHub recusar o push por causa dele, é porque a conta está
com *Keep my email addresses private* ligado e exige a forma com número:
pegue o endereço exato em **Settings → Emails** e rode

```bash
git config user.email "SEUNUMERO+correajoaopedro1@users.noreply.github.com"
```

### 0.3-bis ⚠️ Limpar o `public_html` antes do primeiro deploy

**O deploy por Git não apaga nada.** Ele traz os arquivos do repositório
para dentro do diretório; o que já estava lá e não existe no repositório
**continua lá**. Como o domínio hoje roda um WordPress, sem limpeza o
`public_html` ficaria com as duas coisas misturadas:

- `wp-admin/`, `wp-includes/`, `wp-content/` — WordPress sem manutenção é
  superfície de ataque, e continuaria acessível pela URL
- `wp-config.php` — com as credenciais do banco, parado no servidor
- `index.php` do WordPress — este é o único que **não** causa problema:
  o `DirectoryIndex index.html` do nosso `.htaccess` faz o `index.html`
  ter precedência. Mas os outros continuam de pé

Ordem correta, uma vez só:

1. hPanel → **Backups** → gerar backup manual completo (não pule)
2. Gerenciador de Arquivos → entrar em `public_html`
3. Selecionar **tudo**, inclusive os ocultos (Configurações → *Mostrar
   arquivos ocultos*), e apagar
4. Só então configurar o Git abaixo

Depois, no hPanel:

1. **Avançado → GIT** → *Criar novo repositório*
2. Conectar a conta do GitHub por **OAuth**. Isso não é opcional: o
   repositório é privado, e sem a autorização a Hostinger não o enxerga
3. **Branch: `producao`** ← o passo que mais importa. Nunca `main`.
   O branch precisa **já existir no GitHub** — ele nasce no primeiro
   `npm run deploy:push`. Configurar antes disso dá erro na tela
4. **Diretório: `public_html`**
5. Deixar o campo de *build commands* **vazio** — o build já roda na sua
   máquina e o branch `producao` contém o site pronto. Hospedagem
   compartilhada nem sempre tem Node disponível; não vale a dependência.
6. Abrir **Auto deployment**, copiar a URL do webhook
7. No GitHub: *Settings → Webhooks → Add webhook*, colar a URL,
   content type `application/json`, evento *Just the push event*

Daí em diante: `npm run deploy:push` → a Hostinger publica sozinha.

### 0.4 O que continua manual

- **SSL** (seção 3) — uma vez só, no hPanel
- **Redirecionamentos do site antigo** (seção 2) — é levantamento de
  conteúdo, não tem como automatizar
- **Revisão jurídica / CRO-SC** e a decisão do LOGO-03 — o build imprime
  os dois como lembrete ao gerar produção, mas não tem como verificar

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

## 1. Upload manual — plano B

> Use só se o Git do hPanel estiver fora do ar. O caminho normal é a
> seção 0. O zip continua sendo gerado por `npm run build`, em
> `2-PARA-SUBIR/site-hospedagem.zip`.

Suba **o conteúdo** da pasta `2-PARA-SUBIR/site/` — não a pasta
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
