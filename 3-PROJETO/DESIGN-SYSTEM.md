# DESIGN SYSTEM — Instituto Bucomaxilofacial

Documento gerado na **Fase 1 (auditoria)** a partir do molde-mestre `index.html`
(site de origem: *Hanna Face and Jaw* — `hannafacejaw.com`).

Este arquivo é a **fonte única de verdade visual**. Nenhuma cor, fonte, escala ou
componente fora do que está aqui pode entrar nas páginas.

---

## 1. Origem e estado do molde

| Item | Achado na auditoria |
|---|---|
| CSS | 100% embutido em `<style>` no `<head>` (510 linhas) |
| JS | 100% embutido em `<script>` no fim do `<body>` (283 linhas), IIFE em modo estrito |
| Variáveis CSS | **Já existiam** em `:root` — não foi necessário criar do zero, apenas complementar |
| Bibliotecas externas | **Nenhuma.** Zero jQuery, zero framework, zero UI kit. Slider e carrossel são código próprio |
| Ícones | SVG inline (Instagram, play, setas de slider). Nenhuma fonte de ícone |
| Imagens | Todas hospedadas em `hannafacejaw.com/wp-content/uploads/` |

**Ação tomada:** o CSS foi extraído para `/assets/css/style.css` e o JS para
`/assets/js/main.js`, **sem alteração do resultado visual renderizado**. As
variáveis de `:root` foram mantidas com os mesmos nomes e valores; foram
adicionados apenas *aliases* semânticos (ver §2.1) que apontam para as mesmas cores.

---

## 2. Paleta

> **Atualização — identidade do cliente aplicada.**
> O molde define a *estrutura* de cor (1 fundo claro, 1 escuro, 1 CTA, 1 borda,
> brancos). Os **valores** passaram a ser os da identidade do Instituto,
> enviada pelo cliente (`Marca.jpg.webp` + apresentação institucional).
> A estrutura do molde foi preservada slot a slot; nenhum slot novo foi criado.

### 2.1 Cores da marca (fonte primária)

Extraídas por amostragem de pixel do logo oficial.

| Variável | Hex | De onde vem | Uso |
|---|---|---|---|
| `--brand-blue` | `#0E7BA2` | Palavra "INSTITUTO" do logo | CTA primário, destaques |
| `--brand-graphite` | `#363435` | Palavra "BUCOMAXILOFACIAL" do logo | Texto, faixas escuras, menu mobile, footer |
| `--brand-grey` | `#AAABAF` | Símbolo (taça / perfis) do logo | Bordas de placeholder, overlay de depoimentos |

Derivadas — **mesma matiz**, só variação de luminosidade. Existem porque o molde
precisa de um tom escuro para hover e de um claro para borda:

| Variável | Hex | Derivação | Uso |
|---|---|---|---|
| `--brand-blue-deep` | `#0A5F7E` | `--brand-blue` escurecido | Eyebrows, texto de apoio, hover |
| `--brand-blue-darker` | `#084E67` | `--brand-blue` escurecido | Hover de botão |
| `--brand-grey-light` | `#E7E8EA` | `--brand-grey` clareado | Bordas, faixas suaves |

### 2.2 Mapeamento — slot do molde → cor da marca

| Variável (slot do molde) | Valor original do molde | Valor agora | Função |
|---|---|---|---|
| `--base` | `#F9F7F7` | **`#F9F7F7`** (mantido) | Fundo geral |
| `--contrast` | `#15120e` | `var(--brand-graphite)` | Texto, faixas escuras, menu, footer |
| `--primary` | `#806B5D` | `var(--brand-blue-deep)` | Eyebrows, rótulos, numeração de etapas |
| `--secondary` | `#A79686` | `var(--brand-blue)` | **Fundo do CTA primário** |
| `--tertiary` | `#E6E0DA` | `var(--brand-grey-light)` | Bordas, faixas suaves, divisórias |
| `--quaternary` | `#ffffff` | **`#ffffff`** (mantido) | Texto sobre fundo escuro e sobre CTA |
| `--quinary` | `#885e44` | `var(--brand-blue-deep)` | Hover de link |
| `--senary` | `#79553F` | `var(--brand-blue-darker)` | Hover de botão |

Aliases semânticos (apontam para as mesmas cores, sem introduzir tom novo):

```css
--cor-cta:        var(--secondary);
--cor-cta-hover:  var(--tertiary);
--cor-borda:      var(--tertiary);
--cor-texto-sup:  var(--primary);
```

### 2.3 Cores literais fora do `:root`

Todas foram recalculadas para a marca, mantendo **exatamente o mesmo alpha** do molde:

| Onde | Valor no molde | Valor agora |
|---|---|---|
| `.site-header.is-stuck` | `rgba(21,18,14,.95)` | `rgb(54 52 53 / .95)` |
| `.office`, `.band-soft` | `#e6e0dabd` | `rgb(231 232 234 / .74)` |
| `.instagram` | `#e6e0da8c` | `rgb(231 232 234 / .55)` |
| `.ig-post .meta`, `.map-cta` | `rgba(21,18,14,…)` | `rgb(54 52 53 / …)` |
| bordas em fundo escuro | `rgba(230,224,218,.35)` | `rgb(231 232 234 / .35)` |
| overlay do footer | `#000` @ .5 | inalterado |
| overlay dos depoimentos | `#c6c2be` | `var(--brand-grey)` |

### 2.4 Contraste — A11Y-01 resolvido

O botão primário do molde (`#A79686` + texto branco) dava **~2,4:1** e reprovava em AA.
Com a identidade aplicada, o CTA passou a `#0E7BA2` + texto branco:

| Combinação | Razão | AA (4,5:1) |
|---|---|---|
| CTA `#0E7BA2` sobre texto `#ffffff` | ~4,6:1 | ✅ |
| Texto `#363435` sobre `#F9F7F7` | ~10,8:1 | ✅ |
| Eyebrow `#0A5F7E` sobre `#F9F7F7` | ~6,6:1 | ✅ |
| Texto `#ffffff` sobre faixa `#363435` | ~10,8:1 | ✅ |

A pendência A11Y-01 deixa de existir como decisão em aberto.

---

## 3. Tipografia

### 3.1 Famílias

```css
--font-heading: "Addington","Cormorant Garamond",Georgia,serif;
--font-nav:     "Montserrat",-apple-system,Helvetica,Arial,sans-serif;
```

- **Addington CF Light (300)** — `@font-face` local, `.woff`.
  No molde o arquivo vem de `hannafacejaw.com`. **Não pode ser hotlinkado.**
  Nas LPs aponta para `/assets/fonts/AddingtonCF-Light.woff` — arquivo pendente
  (item FONT-01 em `PENDENCIAS.md`). Enquanto não existir, o fallback
  **Cormorant Garamond** (Google Fonts, já usado pelo molde) assume, sem quebra visual.
- **Cormorant Garamond 300/400** — Google Fonts.
- **Montserrat 300/400/500** — Google Fonts. Usada em navegação, botões, eyebrows,
  rótulos e legendas. **Nunca em títulos de seção.**

`font-display`: o molde usa `fallback`; nas LPs foi trocado para `swap`
(exigência de performance da seção 13 do briefing). Impacto visual: nulo.

### 3.2 Escala de tamanhos (fluida, `clamp`)

| Variável | Valor | Onde |
|---|---|---|
| `--fs-xx-small` | `.7rem` | Eyebrow, botão, título de coluna do mega-menu, legenda |
| `--fs-extra-small` | `.8rem` | Links de navegação, rodapé legal, menu mobile |
| `--fs-small` | `.9rem` | (declarada; sem uso no molde) |
| `--fs-medium` | `clamp(.9rem … 1rem)` | **Corpo de texto** (`body`) |
| `--fs-large` | `clamp(1.1rem … 1.25rem)` | `h2`, `h3`, caixa de depoimentos |
| `--fs-x-large` | `clamp(1.5rem … 1.75rem)` | `h1`, `h2` de seção, título do hero |
| `--fs-xx-large` | `clamp(1.8rem … 2.25rem)` | Marca do footer (`per` / `form`) |
| `--fs-gigantic` | `clamp(3rem … 3.5rem)` | Aspas decorativas do depoimento |

### 3.3 Regras de texto

| Elemento | Regra |
|---|---|
| `body` | `line-height:1.75`, `--fs-medium`, `--font-heading` |
| `h1…h6` | `font-weight:300`, `line-height:1.15`, `--font-heading`, `margin:0` |
| `h1` | `--fs-x-large`, `letter-spacing:3px`, **UPPERCASE** |
| `h2` | `--fs-large`, `letter-spacing:.12rem`, **UPPERCASE** |
| `h3` | `--fs-large`, `font-weight:400`, caixa normal |
| `p` | `margin:0 0 1em`, `letter-spacing:-.02em` |
| `.eyebrow` | `--font-nav`, `--fs-xx-small`, uppercase, `letter-spacing:1px` |
| links | `color:inherit`, sem sublinhado; sublinha no `:hover` |
| `ul` | `list-style:none`, sem padding |

**Padrão de seção herdado do molde:** o `h2` de seção usa `--fs-x-large`
(ver `.procedures h2`, `.results-copy h2`, `.office-grid h2`), não `--fs-large`.

---

## 4. Espaçamento e container

```css
--content: 1200px;   /* .wrap-content → width:min(90%,1200px) */
--wide:    1600px;   /* .wrap         → width:min(94%,1600px) */
--gap-columns: 4em;  /* gap entre colunas de blocos 2-col */

--space-x-large: clamp(36px,16vw,96px);
--space-large:   clamp(36px,12vw,72px);
--space-medium:  clamp(24px,8vw,48px);
```

Espaçamento vertical no molde **não** é feito com margin/padding — é feito com
**divs espaçadoras**: `.sp-x-large`, `.sp-large`, `.sp-medium` (elementos com `height`).
Esse padrão foi mantido nas LPs por fidelidade.

Ritmo observado no molde:
- Entre seções de topo de página: `.sp-large`
- Entre seções principais: `.sp-x-large`
- Dentro de faixa colorida (`.office`): `.sp-x-large` antes e depois do conteúdo

Paddings recorrentes:
- Header / footer-bar: `20px` (largura `94%`)
- `.cover-inner`: `padding-block:60px`
- Botão: `padding:calc(.667em + 2px) calc(1.333em + 2px)`
- Mega-menu: `50px clamp(20px,5vw,90px) 40px`

---

## 5. Breakpoints

| Largura | O que muda |
|---|---|
| `≤1300px` | **[NOVO]** Aperta o menu: `gap` de 26px→18px, `header-right` 22px→16px, padding do CTA reduzido. Existe porque com 5 itens de menu + ícone + botão a barra passava da largura útil entre 1100 e 1300px e quebrava em duas linhas |
| `≤1100px` | Nav principal e social somem; hambúrguer aparece; **logo sobe para 184–224px** (era 140–180px); setas de slider colam nas bordas; footer-bar centraliza |
| `≤900px` | Todos os blocos 2-colunas (`results`, `office`, `location`, `instagram`) empilham e centralizam; `.checklist--2col`, `.deflist--2col` e `.section-head--split` viram coluna única |
| `≤767px` | Galeria de topo vira 1 coluna; hero ganha margem lateral de 5%; footer-legal quebra linha; slider reduz gap para máx. 20px; régua do `.card` encurta e centraliza |
| `≤400px` | Logo em `min(64vw,196px)` (era `min(52vw,150px)`) |

Slider (JS, `data-per-view*`): `>1100px` → `data-per-view`; `768–1100px` → `data-per-view-md`; `≤767px` → `data-per-view-sm`.

**Mobile-first de validação:** 360px é a largura de referência de aceite.

---

## 6. Inventário de componentes

### 6.1 Componentes existentes no molde (reutilizados como estão)

| Componente | Seletor | Reutilizado em |
|---|---|---|
| Header fixo | `.site-header` + `.is-stuck` (após 80px de scroll) | Todas as páginas |
| Nav desktop | `.main-nav` | Header + footer |
| Mega-menu | `.has-mega` + `.mega` + `.mega-grid` | **Não usado** — largura de tela inteira é peso demais para o menu das LPs. Deu origem ao `.subnav` (§6.3) |
| Hambúrguer | `.hamburger` — **3 linhas** de 42×1px em caixa de 46×44px | Todas as páginas. *Era 2 linhas (bordas de uma caixa de 42×18px); a terceira e o alvo de toque de 44px entraram na revisão de 04/08/2026* |
| Menu mobile full-screen | `.mobile-menu` + `.is-open` (slide vertical) | Todas as páginas |
| Cover / hero | `.cover`, `.cover > img`, `.overlay`, `.dim-70`, `.dim-0`, `.cover-inner`, `.hero` | Hero e faixas com imagem de fundo |
| Botão primário | `.btn` (fundo `--secondary`, uppercase, sem raio) | CTA principal |
| Botão escuro | `.btn--dark` | CTA secundário em fundo claro |
| Botão contorno | `.btn--outline` / `.btn--outline-light` | CTA em fundo escuro/cover |
| Card com imagem | `.procedure-card` (img 4/3 + h3 uppercase centralizado) | Cards de equipe e de área de atuação |
| Slider genérico | `[data-slider]`, `.slider-track`, `.slider-nav` | Cards em carrossel |
| Carrossel fade | `.reviews-box`, `.reviews-fade`, `.review`, `.review-dots` | **Bloco de depoimentos** |
| Bloco 2-colunas (img+copy) | `.office-grid` | Bloco de estrutura/consultório |
| Bloco de localização | `.location-grid` | Bloco de endereço + mapa |
| Faixa suave | `.office` (`#e6e0dabd`) | Faixas de destaque |
| Footer | `.site-footer`, `.footer-mark`, `.footer-bar`, `.footer-legal` | Todas as páginas |
| Revelação ao scroll | `.reveal` → `.is-visible` (IntersectionObserver, threshold .12) | Todas as seções |
| Espaçadores | `.sp-x-large`, `.sp-large`, `.sp-medium` | Ritmo vertical |
| Utilitários | `.wrap`, `.wrap-content`, `.center`, `.eyebrow` | Geral |

### 6.2 Componentes do molde **descartados** (por decisão do briefing)

| Componente | Motivo |
|---|---|
| `.results-grid` + `#resultsSlider` | É uma galeria **antes/depois** de pacientes. Proibido pela regra 7 e pela seção 11 |
| Mega-menu | Menu das LPs tem 5 itens; complexidade desnecessária |
| Bloco Instagram (`.ig-grid`) | Depende de conteúdo real de rede social — vira token, sem bloco publicado agora |
| Galeria de topo (`.intro-gallery`) | Depende de 3 fotos reais; mantida no CSS, usada só quando houver imagem |

*CSS mantido no arquivo compartilhado* (comentado como disponível), pois pode ser
reaproveitado em LPs futuras de procedimento — **exceto** o de antes/depois, cuja
finalidade é proibida.

### 6.3 Componentes **novos**, compostos a partir do molde

Nenhum introduz cor, fonte, raio de borda ou sombra fora do sistema.
Cada um declara de onde herda:

| Novo componente | Seletor | Composto a partir de |
|---|---|---|
| Faixa de credibilidade | `.trust-strip` / `.trust-item` | Grid + `.eyebrow` (`--font-nav`, `--fs-xx-small`, `--primary`) + borda `--tertiary` do `.mega-title` |
| Card de conteúdo | `.card` | `.procedure-card` sem imagem + borda `1px solid var(--tertiary)` (mesma borda do `.mega-title`) |
| Lista de sintomas | `.checklist` | `ul` do reset + marcador `–` em `--primary` (mesmo tratamento tipográfico do `.mega-column a`) |
| Etapas numeradas | `.steps` | Numeração com tipografia do `.mega-title` (`--font-nav`, `--fs-xx-small`, `--primary`, borda inferior `--tertiary`) |
| Acordeão de FAQ | `.faq`, `.faq-q`, `.faq-a` | `button` do reset + borda `--tertiary` + tipografia `.mega-column a` |
| Navegação por âncora | `.anchor-nav` | Tipografia e `gap` do `.main-nav` |
| Botão flutuante WhatsApp | `.wa-float` | Círculo do `.review-dots button` (`border-radius:50%`) + cor `--contrast` / `--base` |
| Cabeçalho de seção | `.section-head` | `.eyebrow` + `h2` + parágrafo — agrupamento, sem estilo novo |
| Grid utilitário | `.grid-2`, `.grid-3`, `.grid-4` | `gap:var(--gap-columns)` e colapso em 900px, iguais aos grids do molde |
| Bloco 2-col genérico | `.split` | **Alias agrupado** com `.office-grid` — mesmas declarações |
| Facade de mapa | `.map-facade` | `.location-grid .col-map` + `.btn` sobreposto |
| Logo do Instituto | `.header-logo` + `.logo-img` | Substitui o `.header-logo img` do molde. `--negativo` = `filter:brightness(0) invert(1)`, porque header, menu e footer têm fundo escuro e o arquivo entregue é positivo |
| Slot de imagem | `.slot` + `.slot--3x4/4x3/16x9/1x1` | `.procedure-card img` (proporção fixa + `object-fit:cover`) + borda tracejada e tipografia do `.pending-note` |
| Galeria | `.gallery`, `.gallery--2/--4` | Mesma grade do `.intro-gallery` do molde (3 col, 3/4, duotone na do meio), com variações de 2 e 4 colunas no mesmo `gap` |
| Card com imagem | `.media-card` | `.procedure-card` do molde + `.eyebrow` + parágrafo |
| Slider de imagens | `.media-slider` | `.slider` do molde, sem alteração de comportamento — só fixa a proporção 4/3 dos slides |

### 6.3-bis Componentes da revisão estética de 04/08/2026

Rodada motivada por um diagnóstico do cliente: *"está com cara de site de
Elementor"*. O que produzia essa leitura era estrutural, não decorativo —
**tudo na página tinha o mesmo peso**: caixa fechada de 1px em série,
cabeçalho de seção sempre centrado e do mesmo tamanho, listas marcadas com
travessão e ênfase feita a negrito. Nenhuma cor, fonte ou raio novo entrou.

| Novo componente | Seletor | Composto a partir de | Por quê |
|---|---|---|---|
| Submenu compacto | `.has-sub` + `.subnav` | `.mega` reduzido à largura do conteúdo — mesma placa `--base`, mesma sombra autorizada, tipografia do `.mega-column a` | O menu listava os 3 cirurgiões no primeiro nível. Vira **Equipe ▾** e **Tratamentos ▾**: duas entradas, uma por pessoa e outra por queixa |
| Submenu mobile | `.mobile-group`, `.mobile-sub-toggle`, `.mobile-sub` | `.faq-q` + `.faq-q .sign` (acordeão) | No celular não há hover; a placa suspensa não teria como abrir |
| Lista pautada | `.checklist` (**revisto**) | Régua do `.faq-item` | O marcador `—` em Montserrat .7rem lia como sujeira ao lado de corpo serifado Light. Agora o item é separado por régua, sem glifo |
| Lista termo + explicação | `.deflist` + `.term` | `.eyebrow` (rótulo) + corpo serifado | Substitui `<strong>Termo.</strong> explicação`. Serifada Light não sustenta salto para bold |
| Nota de apoio | `.nota` / `.nota--center` | Tipografia do `.pending-note` + régua | Ressalva deixa de ser negrito no meio do parágrafo e vira aparte com régua |
| Card em coluna | `.card` (**revisto**) + `.card--boxed` | `.trust-item` (régua no topo) | Quatro caixas fechadas iguais lado a lado é o desenho que lê como construtor. `--boxed` preserva o formato antigo para bloco isolado |
| Cabeçalho assimétrico | `.section-head--split` / `--ruled` | Grade e `--gap-columns` dos blocos 2-col | Todas as seções abriam com o mesmo bloco centrado. Alternar dá cadência |
| Régua avulsa | `.rule` | Borda `--tertiary` do `.mega-title` | Divisória dentro da própria seção, sem espaçador |
| Faixa de convênios | `.convenio-rail` + `.convenio-logo` | `[data-slider]` do molde — **primeiro uso real do componente**, sem uma linha de JS nova | Logos dessaturados, com cor no hover: impede que marcas de terceiros, cada uma com sua paleta, briguem com a identidade |
| Dock social | `.social-dock`, `.dock-links`, `.dock-toggle` | Círculo do `.review-dots` + sinal do `.faq-q` | Ver C-12 |

### 6.4 Sinalização de imagem pendente

Enquanto o arquivo real não é entregue, o espaço da foto **fica visível e rotulado**:

- `img.img-token[src^="data:"]` recebe uma hachura diagonal em `--brand-grey` — a área
  da foto aparece marcada em vez de sumir.
- `.slot[data-slot]` escreve o nome do token por cima do espaço
  (ex.: `{{FOTO_ESTRUTURA_2}} — sala de espera`).
- Ambos **somem sozinhos** quando o `src` deixa de ser o placeholder `data:`
  (`main.js` aplica `.is-filled`). Trocar a imagem é trocar o `src` — nada mais.

---

## 7. Movimento e animação

| Efeito | Especificação do molde |
|---|---|
| Reveal | `opacity 0→1`, `translateY(24px)→0`, `1s ease` |
| Header sticky | `background .35s ease`, `padding .35s ease` |
| Logo encolhendo | `width .35s ease` |
| Menu mobile | `transform .45s cubic-bezier(.4,0,.2,1)` |
| Slider | `transform .6s cubic-bezier(.4,0,.2,1)` |
| Fade de depoimento | `opacity .7s ease` |
| Mega-menu | `opacity .25s`, `transform .25s` |
| Botão | `background/color/border-color .3s` |

`prefers-reduced-motion: reduce` já é respeitado pelo molde em `.reveal` e
`.slider-track`; foi estendido para os componentes novos (`.faq-a`, `.wa-float`).

---

## 8. Regras de aplicação (o que não se faz)

1. Um único raio de canto no sistema: **`--raio-botao: 3px`**, aplicado a botões e campos. Círculos (dots do carrossel, botão flutuante) seguem em `50%`. Nada além disso. *(O molde usava canto reto; os 3px entraram por decisão do cliente em 03/08/2026, para tirar a dureza sem descaracterizar o sistema.)*

### 8.1 Ritmo vertical — igual nas 4 páginas

| Posição | Espaçador |
|---|---|
| Hero → faixa de credibilidade | `sp-large` |
| Entre todas as demais seções | `sp-x-large` |

### 8.2 Seções repetidas — texto idêntico entre páginas

Estas seções aparecem em mais de uma página e **têm exatamente o mesmo texto**
em todas. Só muda o que é específico do procedimento. Ao criar uma LP nova,
copie daqui — não reescreva.

| Seção | Eyebrow | Título |
|---|---|---|
| Galeria | Por dentro do Instituto | Onde o seu tratamento acontece |
| Diferenciais | O Instituto | O que muda quando tudo acontece no mesmo lugar |
| Paciente de fora | Você mora em outra cidade ou outro estado? | A distância é um problema de logística. E logística tem solução. |
| Convênios | Convênios | O Instituto atende convênios |
| FAQ | Perguntas frequentes | O que as pessoas perguntam antes de decidir |
| Próximo passo | Próximo passo | O primeiro passo é entender o seu caso |

Faixa de credibilidade — mesmos 4 rótulos, na mesma ordem:
**Especialidade · Foco de atuação · Formação e ensino · Estrutura**
(na LP Geral o 2º é **Equipe**, por ser a página institucional).
2. Nenhuma sombra além de `0 20px 40px rgba(0,0,0,.12)` (mega-menu). Usada no `.subnav`, que é do mesmo grupo — placa de menu suspensa. Em nenhum outro lugar.
3. Nenhum gradiente. Escurecimento é sempre `overlay` sólido com `opacity`.
4. Títulos sempre em `--font-heading`, peso 300/400. Nunca Montserrat.
5. Botão nunca tem ícone junto do texto (padrão do molde: só texto uppercase).
6. Imagem sempre com `aspect-ratio` fixo + `object-fit:cover`. **Exceção:** logo de terceiro (`.convenio-logo img`) usa `object-fit:contain` — logo cortado é uso indevido de marca.
7. Espaçamento vertical por `.sp-*`, não por margin arbitrária.
8. **[NOVO] Nada de `<strong>` / `<b>` no corpo de texto.** A serifada do sistema é Light (300); o salto para bold cria dois pesos que a família não sustenta e engrossa a mancha. Para dar ênfase existem três caminhos, nesta ordem: `.deflist .term` (termo + explicação), `.nota` (ressalva) e `.eyebrow` (rótulo). As 4 páginas estão em zero ocorrências — se voltar a aparecer, é regressão.
9. **[NOVO] Marcador de lista não é glifo.** Nem `—`, nem `•`, nem `–`. Separação de itens é feita com régua de 1px (`.checklist`) ou com rótulo (`.deflist`).
10. **[NOVO] Série de blocos iguais não usa caixa fechada.** Em série, `.card` é coluna com régua no topo. Caixa fechada (`.card--boxed`) só para bloco isolado.

---

## 9. Conflitos molde × briefing (registrados)

| # | Conflito | Resolução |
|---|---|---|
| C-01 | Molde tem galeria antes/depois (`#resultsSlider`) | **Briefing vence** (conteúdo/compliance). Bloco removido |
| C-02 | Molde anuncia implantes (chin/jawline/cheek implants) no mega-menu | **Briefing vence** (regra 6). Nenhuma menção a implante nas LPs |
| C-03 | Molde usa `font-display:fallback` | **Briefing vence** (§13). Trocado para `swap`. Sem impacto visual |
| C-04 | Molde usa imagem estática de mapa linkando para o Google Maps | **Briefing vence** (§13, mapa incorporado sob interação). Facade construído com o mesmo layout `.location-grid` |
| C-05 | Molde tem `lang="en-US"` | **Briefing vence**. `lang="pt-BR"` |
| C-06 | Botão primário do molde reprova em contraste AA | ~~Molde vence~~ → **resolvido em C-08**. Com o CTA em `--brand-blue`, a razão sobe para ~4,6:1 e passa em AA |
| C-07 | Molde não tem FAQ, botão flutuante nem faixa de credibilidade | Sem conflito — compostos a partir do sistema (§6.3) |
| C-08 | Paleta bege/marrom do molde × identidade azul/grafite do Instituto | **Identidade do cliente vence.** O cliente enviou o logo e a apresentação depois da primeira entrega. A *estrutura* de cor do molde foi mantida slot a slot (§2.2); só os valores mudaram |
| C-10 | Header do molde é transparente com texto branco sobre a foto × logo do Instituto é positivo (azul + grafite) e sumia no escuro | **Molde vence no header.** Decisão do cliente em 03/08/2026: header e menu mobile continuam escuros/transparentes, com o logo em **versão branca** (`.logo-img--negativo`). A marca **colorida** aparece em um único lugar do site: o **rodapé**, sobre placa clara (`.logo-plate`) |
| C-11 | Botão flutuante de WhatsApp | Era `--contrast` (grafite), como o círculo do molde. Passou a `--brand-blue` por decisão do cliente. Hover em `--brand-blue-deep`. Contraste do ícone branco sobre o azul: ~4,6:1 |
| C-09 | Tagline do logo entregue diz "especialistas em Ortognática, ATM e **implantes**" × regra 6 do briefing (implante não pode ser anunciado) | **Em aberto — decisão do cliente.** O logo está aplicado como recebido. Registrado em `PENDENCIAS.md` (LOGO-03). A apresentação institucional traz uma variante sem essa tagline |
| C-12 | Botão flutuante de WhatsApp isolado no canto × pedido do cliente de trocá-lo por "algo ligado a redes sociais" | **Meio-termo, decisão do cliente em 04/08/2026.** Trocar puro e simples custaria conversão: o botão flutuante é o único atalho permanente para o WhatsApp em toda a página. Virou `.social-dock`: o WhatsApp continua sendo a ação principal — mesmo círculo de 56px, mesmo `--brand-blue`, sempre visível — e Instagram, Facebook e YouTube ficam recolhidos atrás de um "+" de 34px, subindo a partir dele. Resolve a leitura de "ícone jogado" sem mexer na hierarquia de conversão |
| C-13 | Menu do molde é raso × cliente pediu "Equipe" com submenu e mais tópicos | **Cliente vence.** Os 3 cirurgiões saíram do primeiro nível. O menu passou a **Instituto · Equipe ▾ · Tratamentos ▾ · Convênios · Contato** — 5 itens de topo e 7 de submenu, com duas entradas para o mesmo destino (por pessoa e por queixa), que é o padrão de site de saúde. A LP do Dr. Lucas aparece só em "Equipe": pela regra de destino de tráfego (`PENDENCIAS.md` §10b-bis) ela não é destino de campanha |
