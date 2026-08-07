# Retomar o projeto — Instituto Bucomaxilofacial

Estado em 06/08/2026. Cole o prompt do fim deste arquivo numa sessão nova
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
│   ├── assets/css/style.css   (§1–§20, um arquivo só)
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

Há um quinto na mesma lista, o **`DOMINIO_SITE`**, mas ele já está preenchido
com `institutomaxilofacialsc.com` e por isso não aparece no aviso do build.
Ele monta `canonical`, `og:url`, JSON-LD e `sitemap.xml` das 4 páginas — é o
único lugar onde o endereço existe. Vazio, o build para em qualquer modo.

Fora do código, também travam: **revisão jurídica / CRO-SC da copy** e o
**LOGO-03** — a tagline do logo anuncia "implantes", que a regra 6 do
briefing proíbe. O logo está no ar, no topo e no rodapé das 4 páginas.

## 5. O que a rodada de 05–06/08 fez

Detalhe item a item em `3-PROJETO/AJUSTES-PENDENTES.md`.

**Seis defeitos que não estavam em lista nenhuma:**

- A **primeira dobra ficava segundos em branco** em todas as páginas — o hero
  dependia do JavaScript para existir. Virou animação de CSS.
- **Buraco branco no lugar da foto** nos cards do Matheus e do Lucas: o espaço
  de imagem colapsava dentro de um flex centralizado.
- A **imagem de "A estrutura"** (home) e a do **exame de ATM** (Matheus) não
  apareciam: `<figure>` sem a classe `.col-img`.
- O **4º card de "Quatro frentes"** desalinhava dos vizinhos.
- **Convênios:** a frase contradizia a faixa de logos.
- **E-mail e endereço saíam em CAIXA ALTA** no menu.

**Padronização pedida pelo cliente:** todos os CTAs em azul (`btn--dark` sumiu
do site), ícones no rodapé, foto da clínica com canto de 8px, e uma regra só de
tipografia para os quatro submenus — linha de cima em azul e caixa alta, linha
de baixo em grafite e caixa normal.

**Reestruturação das 3 LPs de cirurgião** (seção **G** do AJUSTES-PENDENTES):

```
sintomas → Como funciona, etapa por etapa → seção do procedimento
```

A seção do procedimento eram dois `.card` de 50% com uma checklist dentro —
o mesmo desenho da seção de sintomas logo acima. Virou **grade de cards com
ícone**, 3×2, em faixa clara. O bloco que trazia foto saiu para seção própria.

## 6. O que sobrou

**[06/08, 2ª passada]** Os sete erros estruturais da tabela A foram fechados,
junto com o S-6 e o M-2 no mobile. O que restou não se resolve no editor.

**Depende de um arquivo:**

- **T-5** — favicon. É a **única** pendência de design que sobrou no projeto.
  Hoje as 4 páginas usam `marca-simbolo.png` (237 KB) como ícone de aba.
  Faltam `favicon-32.png` (32×32) e `apple-touch-icon.png` (180×180), a taça
  recortada. Chegando em `assets/img/`, é troca de duas linhas no `<head>`.

**Depende de decisão de cliente ou do jurídico:**

- **⚠️ Copy nova sem revisão.** Os títulos dos cards do Jonathas e do Matheus
  foram escritos na rodada de 06/08. Resumem frases que já existiam, mas são
  copy em página de saúde — entram na revisão jurídica / CRO-SC.
- **⚠️ Logos de convênio no ar sem confirmação de contrato** (D-3).
- **LOGO-03** — a tagline do logo anuncia "implantes".
- Os 4 tokens bloqueantes da seção 4, e a escolha de qual domínio fica no ar
  (as duas opções estão no `DEPLOY.md`).

**Aberto de design, mas sem dono no código:**

- **M-1** — o menu promete 6 tratamentos, mas 3 caem na mesma página do
  Jonathas e "Traumatologia da face" cai em `/#procedimentos`. A profundidade
  anunciada ainda não existe como página.

> ⚠️ **Nada da 2ª passada de 06/08 foi visto renderizado.** As mudanças de CSS
> e o acordeão novo do menu mobile foram conferidos no HTML e no CSS gerados,
> não na tela. Ver antes de considerar fechado — é a lição 1 logo abaixo.

## 7. Lições que custaram caro — não repetir

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
6. **[NOVO 06/08] Tirar a caixa não é, sozinho, um ganho de design.** Duas
   tentativas de resolver a repetição do container 50/50 por subtração —
   rail tipográfico, depois índice de régua fina — foram reprovadas pelo
   cliente por ficarem vazias. O que resolveu foi trocar o container por
   outro objeto **com peso**, não por ausência de objeto.
7. **[NOVO 06/08] Ícone só existe depois de visto na tela.** Dos doze
   desenhados nesta rodada, nove precisaram ser refeitos a 28px. O que
   parece claro no `<path>` vira borrão renderizado.
8. **[NOVO 06/08] A regra de recuo do build apaga a linha inteira.** Token
   sem valor que não tenha tratamento próprio some do HTML, em silêncio —
   é ótimo para `og:image`, e péssimo para qualquer coisa estrutural. Um
   `DOMINIO_SITE` vazio levaria junto o `canonical` e quebraria o JSON-LD
   sem nada aparecer na tela. Por isso ele trava o build em **qualquer**
   modo, e por isso `sitemap.xml` e `robots.txt` tratam token faltante
   como erro, não como linha que sai.
9. **[NOVO 06/08] O que não passa por token acaba gravado à mão.** O E-1
   nasceu porque `sitemap.xml` e `robots.txt` eram copiados crus pelo
   `build.mjs`. Arquivo que sobe e carrega dado do cliente entra na lista
   `COM_TOKEN` — se não entrar, alguém vai escrever o valor direto nele.

## 8. Contexto de compliance (importante)

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

A rodada de 05–06/08 fechou os defeitos e a reestruturação das LPs.
O que sobra está na seção 6 do RETOMAR-AQUI.
```
