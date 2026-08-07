# PENDÊNCIAS — Instituto Bucomaxilofacial

**Status:** parcial — cobre o que a LP do Dr. Jonathas Claus já exige (etapa 3 da seção 15).
Será completado com os tokens das demais LPs nas etapas seguintes.

---

## Atualizado em 06/08/2026 — o domínio volta a ser token

**E-1 fechado.** As 31 ocorrências do domínio antigo nos arquivos que sobem
(27 nos 4 HTMLs, 3 no `sitemap.xml`, 1 no `robots.txt`) apontavam para
`institutobucomaxilofacial.com.br` — o Wix. Enquanto houvesse `noindex` não
fazia estrago; no dia em que ele saísse, o Google indexaria o site velho.

**E-2 fechado junto, porque era a causa.** O domínio tinha sido gravado à
mão e o `{{DOMINIO_SITE}}` não existia mais. Ele voltou, em
`_BLOQUEIAM_A_PRODUCAO`, já preenchido com `institutomaxilofacialsc.com`.

Três mudanças no `build.mjs` sustentam isso:

| O quê | Por quê |
|---|---|
| Trava se `DOMINIO_SITE` estiver vazio, **em qualquer modo** | Vazio, ele cairia na regra (e) do `transformar()` — a linha inteira sai. As páginas subiriam sem `canonical` e com JSON-LD quebrado, sem nada na tela avisando |
| `sitemap.xml` e `robots.txt` passaram a resolver token | Antes eram copiados crus. Foi exatamente por isso que o domínio ficou gravado à mão neles |
| Token sem valor nesses dois é **erro de build** | Ali não existe regra de recuo. Melhor quebrar do que publicar um sitemap com `{{` no meio |

> Trocar de domínio hoje é **uma linha no `tokens.json`**. Antes era
> busca-e-substitui em 8 arquivos.

---

## Atualizado em 04/08/2026 — rodada de revisão estética

Rodada pedida pelo cliente, motivada pela leitura de que o site estava
"com cara de site de Elementor". Detalhe do que mudou e por quê:
`DESIGN-SYSTEM.md` §6.3-bis, §8 (regras 8, 9 e 10) e C-12 / C-13.

**Novo token:** `{{LOGO_CONVENIO_1}}` … `{{LOGO_CONVENIO_6}}` — ver §4 abaixo. 🟡

**Três defeitos encontrados e corrigidos de passagem** (nenhum estava registrado):

| # | Defeito | Impacto | Situação |
|---|---|---|---|
| BUG-01 | `tracking.js` e `main.js` eram carregados **duas vezes** na LP Geral, na do Dr. Matheus e na do Dr. Lucas | Cada evento ia ao `dataLayer` em duplicata — toda métrica de conversão sairia inflada em 2× nessas três páginas | ✅ corrigido |
| BUG-02 | O botão flutuante de WhatsApp da **LP Geral** mandava a mensagem *"Vim pela página do Dr. Jonathas"*, com `data-medico="jonathas-claus"` | Paciente que entrava pela home era atribuído ao Jonathas na conversa e no relatório | ✅ corrigido |
| BUG-03 | `site-hospedagem.zip` gravava os caminhos com `\` em vez de `/` | Extrator em servidor Linux pode criar um arquivo chamado `assets\css\style.css` em vez da árvore de pastas — o site subiria sem CSS | ✅ zip regerado |

**Uma ressalva que continua em aberto — não é bug, é decisão de quem configura o GTM:**

> 🟡 **TRK-01.** O `README.md` §4.3 documenta o evento de carregamento como
> `page_view_lp`, mas o `tracking.js` empurra **`lp_view`**. Se o acionador do
> GTM for criado com o nome do README, ele nunca dispara. O código é a fonte
> de verdade: **use `lp_view`**. Alinhar README e gestor de tráfego antes de
> publicar o container.

**Previews (`1-PREVIEW/`) regeradas.** Antes o CSS e as imagens vinham
embutidos, mas o JS era referenciado por caminho absoluto — que por `file://`
nunca carrega. Quem abrisse a prévia com dois cliques via a página estática:
sem slider, sem FAQ, sem menu mobile, sem dock. Agora o JS também entra
embutido e as 4 prévias funcionam offline, com `noindex` por segurança.

**Atualizado em 03/08/2026 (2ª rodada):**

- Identidade visual e logo aplicados (ver §6b e `DESIGN-SYSTEM.md` §2).
- **13 tokens preenchidos com dados reais** levantados no site do próprio
  Instituto e em fontes públicas — ver §0 abaixo. Restam **22**, quase todos
  dependentes de arquivo (foto) ou de decisão do cliente.
- Contraste **A11Y-01 resolvido**.
- Nova pendência bloqueante: **LOGO-03** (tagline "implantes").
- Nova pendência: **DEP-02** (perfil no Doctoralia).
- Header e menu passaram a ter **fundo claro** — decisão do cliente,
  para o logo aparecer nas cores da marca. Ver `DESIGN-SYSTEM.md` C-10.
- Quantidade de imagens reduzida de 18 para **10 espaços** a pedido do cliente.

---

## 0-ter. Mídia recuperada do site antigo

O site antigo (`institutobucomaxilofacial.com.br`) é um **Wix de página única**.
Varri o HTML inteiro: 30 imagens, das quais 21 são ícones de 30×30 e 42×42.
**Sobraram 9 arquivos**, e destes só **um é fotografia**.

| Arquivo | O que é | Destino |
|---|---|---|
| `assets/img/dr-jonathas-retrato.jpg` | **Retrato oficial do Dr. Jonathas**, 1080×1080, preto e branco. Única foto de verdade do acervo | ✅ aplicado no bloco "Sobre o cirurgião" da LP dele **e** no card de equipe da LP Geral |
| `assets/img/instituto-atendimento.jpg` | Frame de vídeo — Dr. Jonathas falando, com o logo do Instituto na parede ao fundo | ✅ aplicado na galeria (posição do duotone, entra em P&B) das duas páginas |
| `_midia-site-antigo/orig-03,05,08,09.jpg` | Mais 4 frames de vídeo do Dr. Jonathas | ⛔ não usados — ver abaixo |
| `_midia-site-antigo/orig-04.jpg` | **Depoimento de paciente em vídeo** (mulher, legenda "o quanto eu gostei do resultado") | ⛔ não usado — ver abaixo |

> A pasta `_midia-site-antigo/` **não deve subir para o servidor**. É arquivo de
> trabalho, para vocês avaliarem o que sobrou.

### Dois problemas técnicos que resolvi sem reprocessar arquivo

1. O retrato traz uma **faixa de texto queimada no rodapé da imagem**, com o
   endereço do **domínio antigo**. Como vocês vão comprar domínio novo, essa
   faixa ficaria errada no ar.
2. O frame de atendimento tem **legenda de vídeo queimada** na parte de baixo.

Nos dois casos, a classe `.foto-topo` (`object-position:center top`) enquadra
pelo topo e o recorte natural do `object-fit:cover` **corta exatamente a faixa
problemática**. Sem perda de qualidade, sem editor de imagem. Se um dia
entrarem versões limpas, é só trocar o `src`.

### Por que os outros 5 não entraram

Não são fotografias — são **thumbnails de Reels, com legenda queimada no meio
da imagem**. Em hero ou galeria, a legenda aparece atravessada na tela e o site
passa a parecer um print de rede social. Ficaram arquivados; se quiserem usar
algum, dá para enquadrar como fiz com os outros dois — mas o certo é sessão
de fotos própria (o **item 3.3** do cronograma de vocês já prevê produção de
imagem em padrão alto).

### O depoimento de paciente — o que trava

Existe **um depoimento de paciente em vídeo**, e é exatamente o que o bloco 9
das páginas precisa. Dois obstáculos, nesta ordem:

1. **Autorização escrita do paciente, arquivada.** A autorização do cliente para
   usar o conteúdo do site antigo resolve direito autoral; **não substitui o
   consentimento do paciente**, que é exigência do CFO/CRO e da LGPD.
2. **O teor.** A legenda visível é *"o quanto eu gostei do resultado"* —
   depoimento centrado em resultado é justamente o que a norma restringe.

Se a autorização existir e o trecho escolhido falar de **experiência**
(atendimento, acolhimento, clareza da informação) em vez de **resultado**,
entra sem problema. Recomendo passar pelo jurídico antes.

### Sobre a copy do site antigo — nada foi aproveitado

O texto institucional antigo diz que a clínica *"conquistou uma reputação
merecida como a **melhor Clínica da região**"*. É superlativo comparativo,
vedado pelo CFO/CRO, e foi justamente o tipo de frase que as páginas novas
evitam. Nenhuma linha da copy antiga foi reaproveitada.

---

## 0-bis. Segunda varredura na internet — o que mais foi preenchido

| Token | Valor aplicado | Fonte |
|---|---|---|
| `{{INSTAGRAM_JONATHAS}}` | instagram.com/**jonathasdanielclaus** | perfil público (~16 mil seguidores) |
| `{{INSTAGRAM_MATHEUS}}` | instagram.com/**matheusspinella** | perfil público (~5,7 mil seguidores) |
| `{{FORMACAO_MATHEUS}}` | Especialista em CTBMF pela **UFSC**, doutorando em CTBMF pela **UFPel** | bio do Instagram + Hospital Baía Sul |
| `{{GEO_LATITUDE}}` / `{{GEO_LONGITUDE}}` | **-27.5945445 / -48.5496190** | geocodificação OpenStreetMap; o retorno bateu no prédio exato ("Life Medical Tower, 182, Rua Santos Dumont") |
| `{{LINK_GOOGLE_MEU_NEGOCIO}}` | URL de busca do Google Maps pela clínica | ⚠️ **substituir pela URL canônica** do perfil quando tiverem acesso ao Google Meu Negócio |
| `sameAs` do JSON-LD | Instagram do Instituto + Instagram do médico + Facebook + canal do YouTube | perfis oficiais públicos |
| Ensino (Jonathas) | "mais de 400 cirurgiões de diferentes países já passaram pelos cursos" | site ibmfcursos.com.br |

**Também localizado, disponível caso queiram usar:** CNPJ 37.900.038/0001-20 ·
telefone da frente educacional (48) 98828-2739 · canal no YouTube ·
14 edições de curso com dissecação em cadáver · MIOS Meeting, 2ª edição em
Barcelona (2024) · TikTok @ortognaticami e @minimamenteinvasiva.

### O que eu encontrei e decidi NÃO preencher

| Item | Por quê |
|---|---|
| **`{{HORARIO_ATENDIMENTO}}`** | A única indicação que apareceu ("segunda a sexta, 8h às 18h") veio de fonte indireta, não do próprio Instituto. **Horário errado faz paciente viajar até uma clínica fechada.** Precisa vir de vocês. 🔴 |
| **`{{CRO_MATHEUS}}`** | Fontes públicas trazem o número **14187**, mas aparece ora como CRO, ora como CRM. Número de registro errado em página de saúde é problema regulatório, não erro de digitação. Precisa de confirmação. 🔴 |
| **Dados do Dr. Lucas** | **Nenhuma menção pública encontrada** — nem no site, nem no Instagram, nem no Facebook (cuja página se chama "Instituto Bucomaxilofacial - Jonathas Claus e Matheus Spinella"), nem no site de cursos. Ele parece não ter presença digital ainda. 🔴 |
| **Fotos** | ⚠️ **Aviso:** a apresentação institucional que vocês me enviaram contém uma imagem de banco com **marca d'água da Shutterstock visível** — ou seja, sem licença. Não reaproveitei nenhuma imagem de material existente para não propagar isso. Todas as fotos precisam ser originais da clínica ou licenciadas. 🔴 |
| **`{{POLITICA_PRIVACIDADE_URL}}`** | Não existe página de política de privacidade publicada. Precisa ser redigida — é exigência de LGPD, já que há rastreamento e captação de contato. 🔴 |

---

## 0. Dados preenchidos na rodada anterior (conferir antes de publicar)

Levantados em fontes públicas. **Precisam de conferência da clínica** — foram
preenchidos porque são verificáveis, não porque foram confirmados por vocês.

| Token | Valor aplicado | Fonte |
|---|---|---|
| `{{WHATSAPP_NUMERO}}` | `5548988487091` | site institutobucomaxilofacial.com.br |
| `{{TELEFONE_CLINICA}}` | (48) 3364-9714 | site do Instituto |
| `{{EMAIL_CONTATO}}` | recepcaoibmf@gmail.com | site do Instituto |
| `{{INSTAGRAM_INSTITUTO}}` | instagram.com/institutobucomaxilofacial | site do Instituto |
| `{{DOMINIO_SITE}}` | ~~institutobucomaxilofacial.com.br~~ → **institutomaxilofacialsc.com** (corrigido em 06/08, ver E-1) | domínio em uso |
| `{{CRO_JONATHAS}}` | CRO-SC 7964 | site do Instituto |
| `{{RESPONSAVEL_TECNICO_CRO}}` | Dr. Jonathas Daniel Paggi Claus — CRO-SC 7964 | site do Instituto (consta como responsável técnico) |
| `{{ESPECIALIDADES_REGISTRADAS_CRO}}` | Cirurgia e Traumatologia Bucomaxilofacial | ⚠️ **conferir no CRO-SC** antes de publicar — divulgar especialidade não registrada é infração |
| `{{FORMACAO_JONATHAS}}` | UFSC → residência HU-UFSC → Clinical Fellow UCSF → fellowship AO Basel → doutorado PUC-RS | Doctoralia + Escavador |
| `{{ATUACAO_ENSINO_JONATHAS}}` | fellowship e cursos do Instituto + coautoria do livro com o Prof. José Nazareno Gil | site do Instituto + notícia UFSC |
| `{{INSTAGRAM_JONATHAS}}` | apontado para o perfil do Instituto | não foi localizado perfil separado do médico |
| `{{PARCEIROS_HOSPEDAGEM}}` | **removido** | não há parceria formal conhecida — token não vira suposição |

**O que deliberadamente NÃO foi usado**, apesar de constar em fontes públicas:

| Informação | Por quê |
|---|---|
| "centro de referência nacional" | Autoproclamação de superioridade — vedada pelo CFO/CRO |
| "pioneiro no Brasil em ortognática minimamente invasiva" | Alegação de primazia — mesma vedação |
| "mais de 50 artigos publicados" e "3 livros" | Número não conferido; se o cliente confirmar e documentar, pode entrar como fato |
| "mais de 20 anos de experiência" | Verificável, mas depende de data-base. Se a clínica confirmar, entra |
| Implantes e enxertos (listados no Doctoralia) | Regra 6 do briefing — implante não é anunciado em nenhuma página |

**Legenda de bloqueio**
- 🔴 **BLOQUEIA** — a página não pode ir ao ar sem isso.
- 🟡 **DEGRADA** — a página funciona, mas com lacuna visível ou perda de rastreamento.
- 🟢 **NÃO BLOQUEIA** — pode entrar depois da publicação.

---

## 1. Contato e conversão

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{WHATSAPP_NUMERO}}` | Todos os CTAs, botão flutuante, header, menu mobile (11 links na LP do Jonathas) | Número do WhatsApp **no formato internacional sem sinais**: `5548999999999`. É o que vai em `wa.me/`. | Gestão da clínica | 🔴 |
| `{{TELEFONE_CLINICA}}` | Bloco de contato, `tel:`, JSON-LD `Physician.telephone` | Telefone fixo/comercial para exibição e para o link `tel:` | Gestão da clínica | 🟡 |
| `{{EMAIL_CONTATO}}` | Bloco de contato, JSON-LD | E-mail público de contato | Gestão da clínica | 🟡 |
| `{{HORARIO_ATENDIMENTO}}` | Bloco de contato (§11 da estrutura) | Texto livre: dias e horários. Ex.: "Segunda a sexta, 8h às 18h" | Gestão da clínica | 🟡 |

> ⚠️ **Sem `{{WHATSAPP_NUMERO}}` nada converte.** É a pendência número um do projeto.

---

## 2. Compliance CFO/CRO — obrigatório por norma

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{RESPONSAVEL_TECNICO_CRO}}` | Footer de **todas** as páginas | Nome completo + nº de inscrição no CRO do responsável técnico da clínica. Ex.: "Dr. Fulano de Tal — CRO-SC 00000" | Gestão da clínica / jurídico | 🔴 |
| `{{ESPECIALIDADES_REGISTRADAS_CRO}}` | Footer + faixa de credibilidade | **Apenas** especialidades efetivamente registradas no CRO. Divulgar especialidade não registrada é infração. | Gestão da clínica / jurídico | 🔴 |
| `{{CRO_JONATHAS}}` | Bloco "Sobre o cirurgião" | Nº de inscrição do Dr. Jonathas no CRO | Gestão da clínica | 🔴 |
| `{{POLITICA_PRIVACIDADE_URL}}` | Footer | URL da política de privacidade (exigência de LGPD, já que há rastreamento e captação de contato) | Jurídico | 🔴 |

### 🔴 REVISÃO JURÍDICA OBRIGATÓRIA
As páginas foram escritas seguindo as restrições de publicidade odontológica descritas
no briefing (sem preço, sem promessa de resultado, sem superlativo, sem antes/depois,
linguagem factual). **Isso não substitui validação jurídica.**

**Antes de publicar, toda a copy deve ser revisada pelo jurídico e/ou pelo CRO-SC do cliente.**
Responsável por acionar: gestão da clínica.

---

## 3. Dados profissionais — Dr. Jonathas Claus

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{FORMACAO_JONATHAS}}` | Bloco "Sobre o cirurgião" | Frase factual de formação: graduação, especialização, títulos. **Só o que for comprovável.** | Dr. Jonathas | 🔴 |
| `{{ATUACAO_ENSINO_JONATHAS}}` | Faixa de credibilidade + bloco "Sobre" | Descrição factual da atuação em ensino/formação de cirurgiões (cursos, instituições, países). Sem superlativo. | Dr. Jonathas | 🟡 |

> **Nota:** o briefing posiciona o Dr. Jonathas como "referência nacional e internacional".
> A copy publicada usa **"atuação nacional e internacional"** e **"atuação na formação de
> outros cirurgiões"**, porque "referência" é autoproclamação de superioridade — vedada
> pelo CFO/CRO. O conteúdo comprobatório entra pelos dois tokens acima.

---

## 4. Convênios

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{LISTA_CONVENIOS_PUBLICAVEL}}` | Bloco 8 (Convênios) | Frase ou lista de convênios que a clínica **autoriza publicar**. Sem condição de cobertura, sem valor, sem comparação. | Gestão da clínica (+ conferir contrato com cada operadora) | 🟡 |
| `{{LOGO_CONVENIO_1}}` … `{{LOGO_CONVENIO_6}}` | Carrossel do bloco de convênios, nas 4 páginas | **[NOVO 04/08/2026]** Logo de cada operadora. PNG ou SVG com **fundo transparente**, ~300×120, área de respiro já embutida no arquivo | Gestão da clínica (baixar do material oficial de cada operadora) | 🟡 |

> ⚠️ Alguns contratos de operadora restringem o uso da marca em publicidade.
> **Confirmar antes de listar nomes — e antes de publicar logo.** Logo pesa
> mais que nome escrito: é uso de marca registrada.

**Como o carrossel se comporta enquanto os arquivos não chegam:** os 6 espaços
aparecem hachurados com o nome do token, igual aos espaços de foto. Assim que
o `src` de cada um deixa de ser o placeholder, a etiqueta some sozinha —
nenhuma edição de HTML é necessária.

**Se forem menos de 6 operadoras:** apague os `<figure class="slot convenio-logo">`
que sobrarem. Com 4 ou menos o carrossel para de rolar e vira uma faixa
estática centralizada, que também funciona. Não deixe espaço hachurado no ar.

**O `alt` das imagens está genérico de propósito** (*"Operadora de convênio
atendida pelo Instituto Bucomaxilofacial"*). Ao entrar o logo real, troque pelo
nome da operadora — o `alt` de um logo deve ser o nome da marca.

---

## 5. Depoimentos

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{DEPOIMENTO_1}}` … `{{DEPOIMENTO_3}}` | Bloco 9 | Texto do depoimento | Gestão da clínica | 🟡 |
| `{{DEPOIMENTO_1_AUTOR}}` … `_3_AUTOR` | Bloco 9 | Identificação autorizada pelo paciente (pode ser só o primeiro nome) | Gestão da clínica | 🟡 |
| `{{LINK_GOOGLE_MEU_NEGOCIO}}` | Bloco 9, JSON-LD | URL do perfil no Google | Gestão da clínica | 🟡 |

**DEP-02 — Doctoralia: link removido.** O perfil do Dr. Jonathas no Doctoralia
está com **1 avaliação e nota 1 de 5**. Mandar tráfego qualificado para lá
derruba a conversão em vez de sustentá-la, então o link **saiu da página e do
JSON-LD**. Recomendação: a clínica trabalhar o perfil (responder a avaliação,
pedir avaliações a pacientes reais) e, quando ele estiver saudável, reinserir.
Enquanto isso, a prova social se apoia no Google Meu Negócio.

**Condições inegociáveis para publicar um depoimento:**
1. Ser real e verificável.
2. Ter **autorização escrita** do paciente arquivada.
3. Não conter promessa ou garantia de resultado.
4. Não conter imagem de paciente sem autorização formal.

> Se os depoimentos não forem fornecidos, a orientação é **remover o bloco 9 inteiro**
> antes de publicar — não deixar tokens visíveis no ar.

---

## 6. Imagens

Todas as imagens estão como *placeholder* (GIF 1×1 transparente + fundo `--tertiary`),
com o nome do token em `data-token` e em comentário HTML ao lado. Isso evita erro 404
no console antes da entrega dos arquivos.

**Como conferir o que falta:** abra a página. Todo espaço de foto ainda vazio
aparece **hachurado e com o nome do token escrito por cima**
(ex.: `{{FOTO_ESTRUTURA_2}} — sala de espera`). Assim que o arquivo real entra
no `src`, a marcação some sozinha. Não é preciso editar mais nada no HTML.

**São 18 espaços de imagem na LP do Dr. Jonathas.**

| Token | Onde | Especificação | Bloqueio |
|---|---|---|---|
| `{{FOTO_HERO_JONATHAS}}` | Hero da LP do Jonathas | WebP, ~1600×1000, foto do cirurgião. É o LCP da página — priorizar peso baixo | 🔴 |
| `{{FOTO_GALERIA_1}}` | Galeria de apresentação (bloco 2b) | WebP, 3:4 vertical, ~900×1200 — atendimento / consultório | 🟡 |
| `{{FOTO_GALERIA_2}}` | Galeria de apresentação (bloco 2b) | WebP, 3:4 vertical, ~900×1200 — equipe. **Entra em preto e branco** (duotone do molde) | 🟡 |
| `{{FOTO_GALERIA_3}}` | Galeria de apresentação (bloco 2b) | WebP, 3:4 vertical, ~900×1200 — planejamento / exames | 🟡 |
| `{{FOTO_PLANEJAMENTO_3D}}` | Bloco 4, split de planejamento virtual | WebP, 4:3, ~1200×900 — tela do planejamento. **Sem rosto de paciente identificável sem autorização** | 🟡 |
| `{{FOTO_RETRATO_JONATHAS}}` | Bloco "Sobre o cirurgião" | WebP, 4:3, ~1200×900 | 🟡 |
| `{{FOTO_DIFERENCIAL_1..4}}` | Bloco 6, cards do Instituto (4 imagens) | WebP, 4:3, ~1200×900 — recepção, planejamento 3D, equipe, consulta de retorno | 🟡 |
| `{{FOTO_ESTRUTURA_1..5}}` | Bloco 6, slider da clínica (5 imagens) | WebP, 4:3, ~1200×900 — fachada, espera, atendimento, exames, equipe | 🟡 |
| `{{FOTO_FLORIPA}}` | Bloco "Paciente de fora" | WebP, ~1600×900, imagem de fundo (cidade/clínica) | 🟡 |
| `{{FOTO_FUNDO_DEPOIMENTOS}}` | Bloco 9 | WebP, ~1600×900, imagem de fundo | 🟢 |
| `{{FOTO_FUNDO_FOOTER}}` | Footer | WebP, ~1600×900, imagem de fundo | 🟡 |
| `{{FOTO_MAPA_ESTATICO}}` | Facade do mapa | PNG/WebP 4:3 — print estático do mapa. O iframe do Google só carrega no clique | 🟡 |
| `{{OG_IMAGE_JONATHAS}}` | Open Graph / Twitter Card | 1200×630, JPG ou PNG. **URL absoluta** | 🟡 |
| `favicon.png` | `<link rel="icon">` | Placeholder em `/assets/img/favicon.png`. Substituir pelo símbolo da marca (a taça do logo) recortado em 32×32 e 180×180 | 🟢 |

> Se alguma foto não for fornecida, a orientação é **remover o bloco inteiro**
> antes de publicar — nunca deixar espaço hachurado no ar.

---

## 6b. Logo e identidade visual

O logo oficial (`Marca.jpg.webp`) e a apresentação institucional foram recebidos
e aplicados. Cores da marca e mapeamento completo em `DESIGN-SYSTEM.md` §2.

| Item | Descrição | Bloqueio |
|---|---|---|
| **LOGO-01** — arquivos aplicados | `/assets/img/logo-instituto.webp` (1037×284) com fallback `.png` (1141×326). Aplicado no header, no menu mobile e em dois pontos do footer | ✅ feito |
| **LOGO-02** — versão negativa | O arquivo entregue é **positivo** (grafite + azul) e header, menu e footer têm **fundo escuro**. A solução atual é `filter:brightness(0) invert(1)`, que deixa o logo **inteiramente branco** — funciona, mas **perde o azul da marca**. Ideal: o cliente fornecer a versão negativa oficial (ou um SVG, que permitiria manter o azul) | 🟡 |
| **LOGO-03** — tagline "implantes" | ⚠️ A tagline do logo entregue diz *"especialistas em Ortognática, ATM e **implantes**"*. A **regra 6 do briefing proíbe** anunciar implante. O logo está aplicado **como recebido** — não alterei a marca por conta própria. A apresentação institucional mostra uma variante com a tagline *"especialistas em cirurgia ortognática"*. **Decisão do cliente + jurídico:** (a) usar a variante da apresentação; (b) usar o logo sem tagline; (c) manter como está e assumir a exposição | 🔴 |
| **LOGO-04** — favicon e touch icon | Gerar a partir do símbolo (taça/perfis) do logo, em 32×32 e 180×180 | 🟢 |

> ⚠️ **Nenhuma imagem de paciente** pode entrar sem autorização formal registrada.
> **Nenhuma imagem de antes/depois** entra em nenhuma página — não existe slot para isso.

---

## 7. Rastreamento

| Token | Onde aparece | O que é | Quem fornece | Bloqueio |
|---|---|---|---|---|
| `{{GTM_ID}}` | `<head>` e `<noscript>` de todas as páginas | ID do container do GTM (`GTM-XXXXXXX`) | Gestor de tráfego | 🔴 |

**Observações:**
- O snippet do GTM tem uma **guarda**: enquanto `{{GTM_ID}}` não for substituído, ele não
  tenta carregar nada e não gera erro de console. Trocado o token, ele passa a funcionar.
- **Nenhuma tag de mídia está hardcodada.** Pixel do Meta, gtag do Google Ads e GA4 são
  configurados **dentro do GTM**, a partir dos eventos do `dataLayer`. O mapa de eventos
  fica no `README.md`.
- Falta definir com o gestor de tráfego: 🟡 quais eventos viram conversão em cada
  plataforma e se haverá envio de conversão offline (cirurgia realizada → campanha de
  origem, via `origem_ref`).

---

## 8. Infraestrutura e publicação

| Token / item | O que é | Quem fornece | Bloqueio |
|---|---|---|---|
| `{{DOMINIO_SITE}}` | Domínio final, **sem protocolo e sem barra final**. Hoje: `institutomaxilofacialsc.com`. Monta `canonical`, `og:url`, JSON-LD e `sitemap.xml` nas 4 páginas — é o único lugar onde esse endereço existe. Trocar de domínio é editar esta linha e rodar o build | Gestão da clínica | ✅ preenchido |
| `{{INSTAGRAM_INSTITUTO}}` | URL do Instagram do Instituto | Gestão da clínica | 🟡 |
| `{{INSTAGRAM_JONATHAS}}` | URL do Instagram do Dr. Jonathas | Dr. Jonathas | 🟡 |
| `{{INSTAGRAM_MATHEUS}}` | URL do Instagram do Dr. Matheus | Dr. Matheus | 🟡 |
| `{{PARCEIROS_HOSPEDAGEM}}` | Bloco "Paciente de fora". Frase sobre indicação de hospedagem. Se não houver parceria formal, o token deve ser **removido**, não preenchido com suposição | Gestão da clínica | 🟢 |
| **Geolocalização** | `MedicalClinic.geo` no JSON-LD da LP Geral exige latitude/longitude reais do endereço. Não foram inventadas — entram como `{{GEO_LATITUDE}}` / `{{GEO_LONGITUDE}}` | Gestão da clínica (extrair do Google Meu Negócio) | 🟡 |

---

## 9. Fonte

| Item | Descrição | Bloqueio |
|---|---|---|
| **FONT-01** — `AddingtonCF-Light.woff` | O molde usa a fonte **Addington CF Light** carregada do servidor do site de origem (`hannafacejaw.com`). **Não pode ser hotlinkada** — é servidor de terceiro e provavelmente licença de terceiro. O CSS aponta para `/assets/fonts/AddingtonCF-Light.woff`, que ainda não existe. Enquanto o arquivo não estiver lá, o fallback **Cormorant Garamond** (Google Fonts) assume, sem quebrar o layout. **Ação:** verificar se o cliente possui licença da Addington CF. Se não possuir, a decisão é usar Cormorant Garamond como fonte de títulos — visualmente muito próxima e já prevista no molde. | 🟡 |

---

## 10. Acessibilidade

| Item | Descrição | Bloqueio |
|---|---|---|
| **A11Y-01** — Contraste do botão primário | ✅ **RESOLVIDO** pela aplicação da identidade visual. Com o CTA em `--brand-blue` (`#0E7BA2`) e texto branco, a razão passou de ~2,4:1 para **~4,6:1** — acima do mínimo AA. Nenhuma decisão pendente. Texto original abaixo, mantido como registro: |
| ~~A11Y-01 (registro original)~~ | O `.btn` do molde usa fundo `--secondary` (`#A79686`) com texto `#ffffff`: razão de contraste ≈ **2,4:1**, abaixo do mínimo AA de 4,5:1 para texto pequeno. **A paleta não foi alterada** — a regra 13 do briefing proíbe mudar cor por conta própria. **Opções para decisão do cliente:** (a) manter como está e aceitar a não conformidade; (b) trocar o texto do botão para `--contrast` (`#15120e`), o que sobe para ≈ 7,4:1 e mantém a paleta intacta; (c) escurecer o fundo do botão para `--quinary` (`#885e44`), que com texto branco dá ≈ 5,9:1. **Recomendação: opção (c)** — mantém a hierarquia visual do botão e usa uma cor que já existe no sistema. | 🟡 |

---

## 10b. Demais páginas — o que falta em cada uma

As 4 rotas estão construídas. Focos definidos pelo cronograma de 52 semanas
(itens 1.3, 1.6 e 1.8).

### LP Dr. Matheus Spinella — ATM e cirurgia oral

| Token | O que é | Bloqueio |
|---|---|---|
| `{{CRO_MATHEUS}}` | Nº de inscrição no CRO. ⚠️ Fontes públicas trazem **14187**, mas aparece ora como CRO, ora como CRM — **não usei sem confirmação** | 🔴 |
| `{{FORMACAO_MATHEUS}}` | Frase factual de formação. O que se sabe publicamente: especialista em CTBMF, doutorando pela UFPel, atua também no Hospital Baía Sul. Precisa ser confirmado e redigido pelo próprio | 🔴 |
| `{{FORMACAO_CURTA_MATHEUS}}` | Versão de uma linha, para a faixa de credibilidade | 🟡 |
| `{{FOTO_HERO_MATHEUS}}` · `{{FOTO_RETRATO_MATHEUS}}` · `{{FOTO_GALERIA_M1..M3}}` · `{{FOTO_EXAME_ATM}}` | 6 imagens | 🟡 |
| `{{OG_IMAGE_MATHEUS}}` | 1200×630, URL absoluta | 🟡 |

> **Implante não entra nesta página**, apesar de constar no perfil público do
> Dr. Matheus. Regra 6 do briefing.

### LP Geral (rota `/`)

| Token | O que é | Bloqueio |
|---|---|---|
| `{{GEO_LATITUDE}}` / `{{GEO_LONGITUDE}}` | Coordenadas reais, extraídas do Google Meu Negócio | 🟡 |
| `{{HORARIO_ATENDIMENTO_SCHEMA}}` | Horário no formato schema.org, ex.: `Mo-Fr 08:00-18:00` | 🟡 |
| `{{FOTO_HERO_INSTITUTO}}` · `{{FOTO_GALERIA_I1..I3}}` · `{{FOTO_EQUIPE_JONATHAS/MATHEUS/LUCAS}}` · `{{FOTO_ESTRUTURA_INSTITUTO}}` | 8 imagens | 🟡 |
| `{{OG_IMAGE_INSTITUTO}}` | 1200×630, URL absoluta | 🟡 |

### LP Dr. Lucas — procedimentos gerais

**Página ativada em 03/08/2026.** O aviso de "em construção" saiu; ela agora
tem a mesma estrutura das LPs do Jonathas e do Matheus, adaptada ao foco do
item 1.8 do cronograma. O nome de exibição é **"Dr. Lucas"** e os textos de
apoio são genéricos, sem alegar formação não comprovada.

| Token | O que é | Bloqueio |
|---|---|---|
| `{{CRO_LUCAS}}` | Nº de inscrição no CRO. **Único item que impede indexar** — divulgar profissional de saúde sem registro é infração | 🔴 |
| Sobrenome e titulação | Substituir "Dr. Lucas" pelo nome completo e trocar "Titulação e formação em atualização" pelo currículo real | 🟡 |
| `{{FOTO_HERO_LUCAS}}` · `{{FOTO_RETRATO_LUCAS}}` · `{{OG_IMAGE_LUCAS}}` | 3 imagens | 🟡 |

**Para tirar o `noindex`:** preencher `{{CRO_LUCAS}}`, remover
`<meta name="robots" content="noindex, nofollow">`, adicionar a URL ao
`sitemap.xml` e remover o `Disallow: /dr-lucas/` do `robots.txt`.

---

## 10b-bis. Regra de destino de tráfego

**Todo redirecionamento aponta para a LP do Dr. Jonathas Claus ou do
Dr. Matheus Spinella.** A LP do Dr. Lucas existe e está linkada no menu e no
bloco de equipe, mas **não é destino de redirect nem de campanha**.

Critério, aplicado no `.htaccess`:

| Tema da URL antiga | Destino |
|---|---|
| ortognática, mordida, maxila, mandíbula, face | `/dr-jonathas-claus/` |
| ATM, dor, estalo, bruxismo, siso, extração | `/dr-matheus-spinella/` |
| qualquer outra | `/dr-jonathas-claus/` |

O `404` devolve a home, que distribui para os dois — sem virar soft 404.

---

## 10c. Itens que vieram do cronograma de 52 semanas

| Item | Situação |
|---|---|
| **Convênios (1.9)** | `{{LISTA_CONVENIOS_PUBLICAVEL}}` preenchido com *"entre eles Amil, CASSI e Bradesco Saúde"*, a partir do cronograma. ⚠️ **Conferir o contrato de cada operadora** antes de publicar — alguns restringem o uso da marca em publicidade |
| **Três Instagram (3.1)** | O cronograma indica perfis separados para Instituto, Jonathas e Mateus. Só o do Instituto foi localizado. Os links dos médicos apontam hoje para o perfil do Instituto; trocar quando os @ forem informados |
| **LP cervicoplastia / lipo de papada (1.7)** | **Fora do escopo das 4 rotas.** É uma 5ª página, de procedimento estético. O design system já está pronto para ela — os blocos `[REUTILIZÁVEL]` cobrem toda a estrutura necessária |
| **Doctoralia (1.2)** | Ver DEP-02: perfil com 1 avaliação e nota 1/5. Link removido das páginas. O item 1.2 do cronograma prevê justamente a otimização desse perfil |
| **Captação fora da praça (1.10)** | SP, SC e PR. O bloco "paciente de fora" está nas 3 LPs de médico e já serve de página de destino |

---

## 11. Conteúdo ainda não definido

| Item | Descrição | Quem define | Bloqueio |
|---|---|---|---|
| **LP do Dr. Lucas** | Conteúdo integral. A página será entregue apenas como placeholder "em construção", com `noindex` e fora do `sitemap.xml`, conforme a seção 8.4 do briefing. | Gestão da clínica | 🟢 |
| `{{FORMACAO_MATHEUS}}` | Formação do Dr. Matheus Spinella (mesmo critério do Jonathas) | Dr. Matheus | 🔴 (para a LP dele) |
| **Bloco Instagram** | O molde tem um bloco de feed do Instagram. Não foi publicado em nenhuma LP porque depende de posts reais e de decisão sobre exibir conteúdo de rede social na LP. O CSS está mantido e pronto. | Gestão da clínica | 🟢 |
