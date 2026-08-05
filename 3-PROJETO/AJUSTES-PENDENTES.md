# Ajustes pendentes — Instituto Bucomaxilofacial

**Revisado em 05/08/2026**, conferindo item a item contra o código e contra o
site no ar. A lista anterior era de 04/08 e ficou defasada: a rodada de ajustes
(commits `772b990` e `9a958d8`) implementou quase tudo no `style.css` §17–§18,
mas os ⬜ nunca foram baixados. Os status abaixo estão verificados.

Marque ✅ conforme sair. Ajuste **uma seção por vez**, conferido no ar antes de
replicar nas outras páginas.

---

## A. Erros estruturais — encontrados na varredura de 05/08

Não são gosto nem estética. São defeito de código, e alguns já estão no ar.

| # | Ponto | Onde | Bloqueio |
|---|---|---|---|
| **E-1** | **`canonical`, `og:url`, JSON-LD e `sitemap.xml` apontam para `institutobucomaxilofacial.com.br`** — o domínio antigo, que ainda é o Wix. O site publicado é `institutomaxilofacialsc.com`. Do jeito que está, ao tirar o `noindex` o Google trata as páginas novas como duplicata do site velho e indexa o velho | 4 HTMLs (`canonical`, `og:url`, `@id`, `url`, breadcrumb), `sitemap.xml`, `robots.txt` — 27 ocorrências | 🔴 |
| **E-2** | **O domínio foi gravado à mão, não existe mais token.** O `PENDENCIAS.md` §8 ainda descreve `{{DOMINIO_SITE}}` como o lugar de trocar, mas esse token não existe nem no HTML nem no `tokens.json`. Trocar de domínio hoje é busca-e-substitui em 8 arquivos | — | 🟡 |
| **E-3** | **`href="#redes-sociais"` não tem alvo em nenhuma das 4 páginas.** No menu desktop, clicar no item pai "Redes sociais" não leva a lugar nenhum (só suja a URL com o hash). O submenu funciona; o defeito é só o link do topo | 4 HTMLs, menu desktop | 🟡 |
| **E-4** | **O M-2 foi aplicado só no menu desktop.** No menu mobile a ordem continua a antiga — Convênios → Redes sociais → **Contato** por último. E "Contato" no mobile é link solto, sem o submenu (WhatsApp / Telefone / E-mail / Onde estamos) que existe no desktop | 4 HTMLs, `.mobile-nav` | 🟡 |
| **E-5** | **Texto duplicado no ar:** o rótulo "Especialidade" da LP do Jonathas lê *"Cirurgia e Traumatologia Bucomaxilofacial — Cirurgia e Traumatologia Bucomaxilofacial"*. Sobra de substituição de token | `dr-jonathas-claus/index.html:375` | 🟡 |
| **E-6** | **Comentários de bloco trocados.** Depois da inversão do S-2, o bloco comentado como `2. FAIXA DE CREDIBILIDADE` contém a galeria e o comentado como `2b. GALERIA DE APRESENTAÇÃO` contém a faixa de credenciais. Não afeta o visitante; afeta quem for editar | 3 LPs de cirurgião | 🟢 |
| **E-7** | **CSS morto por sobrescrita.** `#estrutura h2` é definido no §17 (azul) e redefinido no §18 (preto); `.card--link:hover` idem, §14 e §17. Vence o último — mas quem ler o §17 vai achar que está mexendo em algo que não tem efeito | `style.css` | 🟢 |
| **E-8** | **Comentário do CSS diz mais do que o código faz.** O §17 afirma que o link do Instagram "vira rótulo alinhado ao resto da coluna" (S-6) e que "A estrutura" ganha "o mesmo tratamento de placa das demais seções" (G-3). Nenhuma das duas regras existe — ver S-6 e G-3 abaixo | `style.css` §17 | 🟢 |

> **E-1 é o único que muda de urgência conforme a data de publicação.** Enquanto
> o site estiver em homologação com `noindex`, ele não faz estrago. No dia em que
> sair o `noindex`, faz.

---

## B. Transversal (vale para o site todo)

| # | Ponto | Situação |
|---|---|---|
| T-1 | Hierarquia fraca entre eyebrow e título | ✅ escala refeita: eyebrow em `--brand-blue` peso 500, corpo 1–1,1rem, título de seção 1,7–2,15rem |
| T-2 | Fontes pequenas | ✅ toda a escala subiu um degrau |
| T-3 | Padronizar o tamanho dos títulos entre as páginas | ✅ `.section-head h2` usa `--fs-x-large` (§17, T-1) |
| T-4 | Negrito que não combina com a serifada | ✅ **parcial** — `.checklist li strong` virou rótulo em caixa alta, azul, na fonte de navegação. Resolve dentro das listas, que era onde doía. Fora da checklist o `<strong>` continua negrito serifado |
| T-5 | Favicon com o símbolo da marca | ⬜ depende de arquivo: falta a taça recortada em 32×32 e 180×180 (`marca-simbolo.png` tem 237 KB e é a marca inteira) |

## C. Menu

| # | Ponto | Situação |
|---|---|---|
| M-1 | Tratamentos raso | ✅ **no menu** — submenu largo com 6 procedimentos, cada um com uma linha de explicação (§17, M-1). ⬜ **no destino**: 3 dos 6 caem na mesma página do Jonathas e "Traumatologia da face" cai em `/#procedimentos`. A profundidade prometida no menu ainda não existe como página |
| M-2 | Contato antes de Redes sociais, com texto abaixo | ✅ no desktop — ⬜ no mobile, ver **E-4** |

## D. LP dos cirurgiões (Jonathas · Matheus · Lucas — mesma estrutura)

| # | Seção | Ponto | Situação |
|---|---|---|---|
| S-1 | Hero + credenciais | ok | ✅ |
| S-2 | Galeria | Inverter: título + imagens antes dos 4 rótulos | ✅ invertido (comentários do HTML não acompanharam — E-6) |
| S-3 | Você se reconhece | Sem caixa, sem design; botão e texto centrados fora de hora | ✅ virou placa com marcador azul; texto de apoio e botão alinhados à esquerda como a seção |
| S-4 | O procedimento | Cor na borda das caixas; imagem grande demais desequilibrando o grid | ✅ borda superior de 3px em `--secondary`; coluna da imagem de 55% → 46% |
| S-5 | Etapas | Numeração duplicada (1. e 01) | ✅ o reset zerava só `ul`; agora zera `ol` |
| S-5b | Etapas | Pouco espaçamento; título pequeno demais; título deveria ser azul | ✅ **parcial** — numeral maior e azul, mais respiro, `h4` no degrau certo. ⬜ **falta o título da subseção**: "Como funciona, etapa por etapa" continua um `<h3 class="center">` cinza e pequeno, centralizado no meio de uma seção alinhada à esquerda |
| S-6 | Sobre o cirurgião | Sem hierarquia; falta azul no nome; espaçamento demais; Instagram deslocado | ✅ **parcial** — nome em azul, espaçamento reduzido, botão de volta para perto do texto. ⬜ **falta o Instagram**: continua `<p><a>Instagram do Dr. Jonathas</a></p>` sem classe nem tratamento, solto entre a linha do CRO e o botão. E o "CRO-SC 7964" usa a classe `.eyebrow`, o que o faz parecer link sem ser |
| S-7 | O Instituto | Única seção que não precisava de correção | ✅ |
| S-8 | Paciente de fora | Bullets sem design, sem cor, negrito que não combina | ✅ mesma placa do S-3, com variante para faixa escura e sobre foto |
| S-9 | Convênios | ok | ✅ |
| S-10 | FAQ | ok | ✅ |
| S-11 | Próximo passo | Informações desalinhadas com o espaço da imagem | ✅ `.location-grid` estica e a coluna de dados centraliza na altura da imagem |
| S-12 | Rodapé | Menu diferente do topo; espaçamento grande demais | ✅ refeito: marca no topo, 4 colunas, **mesmo menu do cabeçalho**, bloco legal fechando |

## E. LP Geral (Instituto)

| # | Seção | Ponto | Situação |
|---|---|---|---|
| G-1 | 2ª seção | Mesma inversão do S-2 | ✅ |
| G-2 | Quem conduz seu caso | Alinhar ao centro; textos e botões na mesma altura | ✅ card estica (`height:100%`), texto ocupa o vão e o botão encosta na base — os três "Ver a página" alinham. O que ainda desalinha é só o espaço de foto vazio dos dois sem retrato |
| G-3 | A estrutura | Extremamente pobre | ✅ **parcial** — ganhou respiro e rótulo. ⬜ mas continua sendo imagem + dois parágrafos + botão: o "tratamento de placa" que o comentário do CSS promete não foi escrito (E-8). É a seção mais rasa da home |
| G-4 | Demais seções | Valem as observações das LPs | ✅ replicado |

## F. Decisões em aberto (não são bug — precisam da sua palavra)

| # | Ponto |
|---|---|
| D-1 | **Dois CTAs usam `btn--dark`** (cinza-escuro): "A estrutura" na home e "Sobre o cirurgião" nas LPs. Todo o resto do site usa o `.btn` azul. Padronizar em azul, ou o escuro ali é proposital? |
| D-2 | **Card "Traumatologia"** é o único dos 4 sem a classe `card--link` — hover diferente dos vizinhos. Faz sentido (ele leva ao WhatsApp, não a uma página), mas o efeito visual denuncia |
| D-3 | **Convênios: a frase e os logos não batem.** O texto diz "Amil, CASSI e Bradesco Saúde"; a faixa mostra Amil, Unimed, SulAmérica, Porto Seguro e Bradesco. Fora do descasamento, são 3 marcas publicadas sem a confirmação de contrato que o `PENDENCIAS.md` §4 exige |

---

## Como estamos trabalhando

Ajuste feito **uma seção por vez**, conferido no ar antes de replicar nas outras
páginas. A estrutura é quase idêntica entre as 4 rotas, então o que fecha numa
vale para as demais — mas a validação vem antes da replicação, não depois. Foi o
contrário disso que produziu a rodada que precisou ser revertida.
