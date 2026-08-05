# Retomar o projeto — Instituto Bucomaxilofacial

Estado em 05/08/2026. Cole o prompt do fim deste arquivo numa sessão nova
do Claude Code, aberta na pasta `_INSTITUTO-BUCOMAXILOFACIAL`.

---

## 1. O que é

Site estático de 4 páginas (HTML/CSS/JS puros, sem framework) para uma
clínica de cirurgia bucomaxilofacial em Florianópolis.

```
_INSTITUTO-BUCOMAXILOFACIAL/
├── build.mjs           gerador: 3-PROJETO -> pacote + prévias + zip
├── deploy.mjs          publica no branch de deploy
├── tokens.json         ÚNICO lugar onde se preenchem as pendências
├── serve.mjs           servidor local
├── 1-PREVIEW/          prévias autocontidas (geradas)
├── 2-PARA-SUBIR/       pacote publicável (gerado)
├── 3-PROJETO/          FONTE — é aqui que se edita
│   ├── index.html · dr-jonathas-claus/ · dr-matheus-spinella/ · dr-lucas/
│   ├── assets/css/style.css   (§1–§18, um arquivo só)
│   ├── assets/js/main.js · tracking.js
│   ├── DESIGN-SYSTEM.md · PENDENCIAS.md · DEPLOY.md · README.md
│   └── AJUSTES-PENDENTES.md   lista de design do cliente
└── 4-FOTOS-PENDENTES/
```

## 2. Comandos

```bash
npm run build            # homologação (noindex + Disallow: /)
npm run build:producao   # produção — trava se houver pendência bloqueante
npm run serve            # http://localhost:8099
npm run deploy:homolog   # build + commit + push no branch `homologacao`
npm run deploy:push      # o mesmo, no branch `producao`
```

## 3. Como o site chega no ar

```
sua máquina ──push──> GitHub branch `homologacao` ──webhook──> Hostinger
```

- Repositório: `github.com/correajoaopedro1/instituto-bucomaxilofacial` (privado, SSH)
- Hostinger observa o branch **`homologacao`** e publica em `public_html`
- Site no ar: **https://institutomaxilofacialsc.com**
- ⚠️ `institutobucomaxilofacial.com.br` (domínio antigo) **ainda está na Wix**.
  Confirmado pelo header `server: Pepyaka`. Trocar exige repontar DNS.

## 4. O que trava a produção

`npm run build:producao` **aborta** enquanto estes estiverem vazios em `tokens.json`:

| Token | Quem fornece |
|---|---|
| `GTM_ID` | gestor de tráfego |
| `POLITICA_PRIVACIDADE_URL` | jurídico (exigência de LGPD) |
| `HORARIO_ATENDIMENTO` | clínica |
| `CRO_MATHEUS` | ⚠️ fontes públicas divergem entre CRO e CRM no nº 14187 |

Fora do código, também travam: **revisão jurídica / CRO-SC da copy** e o
**LOGO-03** — a tagline do logo anuncia "implantes", que a regra 6 do
briefing proíbe.

## 5. Pendências de design e estrutura

Estão em `3-PROJETO/AJUSTES-PENDENTES.md`, **revisado em 05/08/2026** contra o
código e contra o site no ar. A lista de 04/08 estava defasada: a rodada de
ajustes implementou quase tudo no `style.css` §17–§18 e os ⬜ nunca foram
baixados. Agora os status estão conferidos.

O que sobrou de design é pouco e específico: o título das etapas (S-5b), o link
do Instagram no bloco "Sobre" (S-6), a seção "A estrutura" da home (G-3) e o
favicon (T-5). O cliente disse que **restam alguns ajustes** ainda não
detalhados — perguntar quais antes de mexer.

O que apareceu de novo é a seção **A. Erros estruturais** da lista. O que pesa:

- **E-1 🔴** `canonical`, `og:url`, JSON-LD e `sitemap.xml` das 4 páginas
  apontam para `institutobucomaxilofacial.com.br` — o Wix antigo — e não para
  `institutomaxilofacialsc.com`. Inofensivo enquanto houver `noindex`; no dia
  que sair, o Google indexa o site velho no lugar do novo.
- **E-3** o item "Redes sociais" do menu desktop aponta para uma âncora que não
  existe em página nenhuma.
- **E-4** o M-2 (Contato antes de Redes sociais) entrou só no menu desktop; no
  mobile a ordem continua a antiga.
- **E-5** texto duplicado no ar na LP do Jonathas: "Cirurgia e Traumatologia
  Bucomaxilofacial — Cirurgia e Traumatologia Bucomaxilofacial".

## 6. Lições que custaram caro — não repetir

1. **Nunca aplicar mudança de design em 4 páginas sem ver renderizado.**
   Já aconteceu uma vez e teve que ser revertido inteiro. Agora existe URL
   pública: abrir, olhar, ajustar UMA seção, mostrar, e só então replicar.
2. **O `.htaccess` cacheia CSS/JS por 1 ano.** Já existe cache busting no
   `build.mjs` (hash na URL). Se alguém tirar, toda correção fica invisível.
3. **O branch do Hostinger é `homologacao`, nunca `main`.** Apontar para
   `main` publica o repositório de trabalho inteiro — já aconteceu, e
   `tokens.json`, `build.mjs` e `deploy.mjs` ficaram legíveis pela URL.
   Existe um `.htaccess` na raiz do `main` que devolve 403 como trava.
4. **Deploy por Git não apaga arquivo.** Removeu algo do repositório?
   Sai da mão no `public_html`.
5. **`TRK-01`** — o `README.md` dizia `page_view_lp`, mas o `tracking.js`
   empurra **`lp_view`**. Já corrigido no README; conferir no GTM.

## 7. Contexto de compliance (importante)

Site de saúde, com regras do CFO/CRO:
- Sem preço, sem promessa de resultado, sem superlativo, sem antes/depois
- Implante **não** é anunciado em nenhuma página
- Depoimento só entra com autorização escrita do paciente arquivada
- Responsável técnico e especialidades registradas no rodapé

---

## PROMPT PARA COLAR NA SESSÃO NOVA

```
Retomando o site do Instituto Bucomaxilofacial, em
C:\Users\corre\Downloads\_INSTITUTO-BUCOMAXILOFACIAL

Leia primeiro, nesta ordem:
  RETOMAR-AQUI.md                      (estado geral e comandos)
  3-PROJETO/AJUSTES-PENDENTES.md       (lista de design, com ✅/⬜)
  3-PROJETO/PENDENCIAS.md              (o que trava a publicação)

Resumo: site estático de 4 páginas, já versionado em git e publicando
sozinho na Hostinger via webhook no branch `homologacao`. Está no ar em
https://institutomaxilofacialsc.com (homologação, com noindex).

Fluxo: edito em 3-PROJETO/, rodo `npm run deploy:homolog`, a Hostinger
publica em seguida.

REGRA que veio de erro caro: nunca aplicar mudança de design nas 4
páginas sem antes ver renderizado no site no ar. Uma seção por vez —
ajusta, me mostra, e só depois replica nas outras páginas.

Tenho mais alguns ajustes de design para pedir. Abra o site, dê uma
olhada geral e me diga o que você já vê que pode melhorar, que eu
complemento com a minha lista.
```
