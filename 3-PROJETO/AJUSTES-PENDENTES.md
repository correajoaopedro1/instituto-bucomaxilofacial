# Ajustes pendentes — Instituto Bucomaxilofacial

**Revisado em 06/08/2026**, conferindo item a item contra o código e contra o
site no ar. A rodada de 05–06/08 fechou quase tudo o que era design e resolveu
seis defeitos que ninguém tinha visto. O que sobrou está abaixo — e o que sobrou
quase não é design: é arquivo, decisão de cliente e revisão jurídica.

Marque ✅ conforme sair. Ajuste **uma seção por vez**, conferido no ar antes de
replicar nas outras páginas.

---

## A. Erros estruturais

| # | Ponto | Onde | Situação |
|---|---|---|---|
| **E-1** | **`canonical`, `og:url`, JSON-LD e `sitemap.xml` apontam para `institutobucomaxilofacial.com.br`** — o domínio antigo, que ainda é o Wix. O site publicado é `institutomaxilofacialsc.com`. Do jeito que está, ao tirar o `noindex` o Google trata as páginas novas como duplicata do site velho e indexa o velho | 4 HTMLs, `sitemap.xml`, `robots.txt` — 27 ocorrências | 🔴 **aberto** |
| **E-2** | **O domínio foi gravado à mão, não existe mais token.** O `PENDENCIAS.md` §8 ainda descreve `{{DOMINIO_SITE}}` como o lugar de trocar, mas esse token não existe nem no HTML nem no `tokens.json`. Trocar de domínio hoje é busca-e-substitui em 8 arquivos | — | 🟡 **aberto** |
| **E-3** | **`href="#redes-sociais"` não tem alvo em nenhuma das 4 páginas.** No menu desktop, clicar no item pai "Redes sociais" não leva a lugar nenhum. O submenu funciona; o defeito é só o link do topo | 4 HTMLs, menu desktop | 🟡 **aberto** |
| **E-4** | **O M-2 foi aplicado só no menu desktop.** No mobile a ordem continua a antiga — Convênios → Redes sociais → **Contato** por último. E "Contato" no mobile é link solto, sem o submenu que existe no desktop | 4 HTMLs, `.mobile-nav` | 🟡 **aberto** |
| ~~E-5~~ | Texto duplicado na faixa de credenciais do Jonathas | — | ✅ corrigido |
| **E-6** | **Comentários de bloco trocados.** Depois da inversão do S-2, o bloco comentado como `2. FAIXA DE CREDIBILIDADE` contém a galeria e vice-versa. Não afeta o visitante; afeta quem for editar | 3 LPs | 🟢 **aberto** |
| **E-7** | **CSS morto por sobrescrita.** `#estrutura h2` é definido no §17 (azul) e redefinido no §18 (preto). Vence o último — mas quem ler o §17 vai achar que está mexendo em algo que não tem efeito | `style.css` | 🟢 **aberto** |
| ~~E-8~~ | Comentário do CSS prometia tratamento que o código não tinha | — | ✅ o §17 foi revisto; §19 e §20 descrevem o que existe |

### Defeitos encontrados e corrigidos em 05/08 — nenhum estava na lista

| # | Defeito | Por que acontecia |
|---|---|---|
| ✅ **D-A** | **A primeira dobra ficava segundos em branco**, em todas as páginas | `.hero-inner` carregava a classe `.reveal`: nascia em `opacity:0` e só aparecia quando o IntersectionObserver rodasse. Com `main.js` em `defer`, em rede lenta o visitante via só a hachura cinza. Virou animação de CSS, que pinta no primeiro quadro. Fallback em `<noscript>` para o resto das seções |
| ✅ **D-B** | **Buraco branco no lugar da foto** nos cards do Matheus e do Lucas | Dentro de um flex com `align-items:center` o `.slot` vira shrink-to-fit. Com o placeholder (GIF 1×1) a largura ia a zero e o `aspect-ratio` levava a altura junto. Não era foto faltando — era o espaço colapsando |
| ✅ **D-C** | **A imagem de "A estrutura" (home) e a do exame de ATM (Matheus) não apareciam** | O `<figure>` estava sem a classe `.col-img`: a coluna não tinha base de flex e sumia |
| ✅ **D-D** | **O 4º card de "Quatro frentes" desalinhava dos três vizinhos** | O rótulo do CTA quebrava em duas linhas. Rótulo encurtado + `nowrap`, e o card ganhou o mesmo hover dos outros |
| ✅ **D-E** | **Convênios: a frase contradizia a faixa de logos** | O texto citava Amil, CASSI e Bradesco enquanto a faixa mostra Amil, Unimed, SulAmérica, Porto Seguro e Bradesco. A frase deixou de enumerar operadora |
| ✅ **D-F** | **E-mail e endereço saíam em CAIXA ALTA no menu** | Herdavam o `text-transform` do cargo do cirurgião no submenu da Equipe |

> **E-1 é o único que muda de urgência conforme a data de publicação.** Enquanto
> o site estiver em homologação com `noindex`, ele não faz estrago. No dia em que
> sair o `noindex`, faz.

---

## B. Transversal

| # | Ponto | Situação |
|---|---|---|
| T-1 | Hierarquia entre eyebrow e título | ✅ |
| T-2 | Fontes pequenas | ✅ |
| T-3 | Tamanho dos títulos padronizado entre as páginas | ✅ |
| T-4 | Negrito que não combina com a serifada | ✅ **parcial** — resolvido dentro das listas. Fora delas o `<strong>` continua negrito serifado |
| T-5 | Favicon com o símbolo da marca | ⬜ **depende de arquivo**: falta a taça recortada em 32×32 e 180×180 (`marca-simbolo.png` tem 237 KB e é a marca inteira) |
| **T-6** | **Botões padronizados em azul** | ✅ as 8 ocorrências de `btn--dark` saíram. Não existe mais CTA escuro no site |
| **T-7** | **Ícones no rodapé** | ✅ Contato, Onde estamos e Redes sociais ganharam ícone de linha na cor herdada |

## C. Menu

| # | Ponto | Situação |
|---|---|---|
| M-1 | Tratamentos raso | ✅ **no menu** — submenu largo com 6 procedimentos. ⬜ **no destino**: 3 dos 6 caem na mesma página do Jonathas e "Traumatologia da face" cai em `/#procedimentos`. A profundidade prometida no menu ainda não existe como página |
| M-2 | Contato antes de Redes sociais | ✅ no desktop — ⬜ no mobile, ver **E-4** |
| **M-3** | **Tipografia dos quatro submenus padronizada** | ✅ uma regra só, sem exceção: linha de cima em azul da marca e CAIXA ALTA, linha de baixo em grafite e caixa normal. As classes `.subnav--wide` e `.subnav--info` deixaram de carregar tratamento próprio (a segunda foi removida) |
| **M-4** | **Hover menos gritante** | ✅ o item deixou de saltar para o azul profundo; agora só perde peso |

## D. LP dos cirurgiões (Jonathas · Matheus · Lucas)

| # | Seção | Situação |
|---|---|---|
| S-1 | Hero + credenciais | ✅ |
| S-2 | Galeria | ✅ invertido (comentários do HTML não acompanharam — E-6) |
| S-3 | Você se reconhece | ✅ |
| S-4 | O procedimento | ✅ **refeito em 06/08** — ver seção **G** abaixo |
| S-5 | Etapas — numeração duplicada | ✅ |
| S-5b | Etapas — título e espaçamento | ✅ **fechado**: o bloco virou seção própria, `#etapas`, com título de seção. Ver **G** |
| S-6 | Sobre o cirurgião | ✅ **parcial** — nome em azul, espaçamento resolvido, link do Instagram removido a pedido do cliente. ⬜ **falta**: "CRO-SC 7964" usa a classe `.eyebrow`, o que o faz **parecer link sem ser** |
| S-7 | O Instituto | ✅ |
| S-8 | Paciente de fora | ✅ |
| S-9 | Convênios | ✅ |
| S-10 | FAQ | ✅ |
| S-11 | Próximo passo | ✅ + foto da clínica com canto de 8px |
| S-12 | Rodapé | ✅ + ícones (T-7) |

## E. LP Geral (Instituto)

| # | Seção | Situação |
|---|---|---|
| G-1 | 2ª seção — inversão | ✅ |
| G-2 | Quem conduz seu caso | ✅ **fechado** — os cards alinham e os três espaços de foto aparecem hachurados com o nome do token. O buraco branco era o D-B |
| G-3 | A estrutura | ✅ **a imagem voltou** (era o D-C) e o botão ficou azul. Continua sendo imagem + dois parágrafos + botão — se o cliente quiser mais, é a próxima candidata ao tratamento da seção **G** |
| G-4 | Demais seções | ✅ |

## F. Decisões em aberto

| # | Ponto |
|---|---|
| ~~D-1~~ | ✅ resolvido — todos os CTAs em azul |
| ~~D-2~~ | ✅ resolvido — o card de traumatologia ganhou o mesmo hover dos vizinhos |
| **D-3** | **Convênios: os logos estão no ar sem confirmação de contrato.** A contradição com o texto foi removida, mas a faixa publica cinco marcas registradas. O `PENDENCIAS.md` §4 avisa que alguns contratos restringem uso de marca em publicidade. **Confirmar operadora por operadora antes de publicar para valer** |

---

## G. Reestruturação da seção do procedimento — 06/08/2026

Feita a pedido do cliente, em cima de uma referência que ele trouxe. Vale para
as três LPs.

### O que mudou de ordem

```
antes:   sintomas → seção do procedimento (com as etapas presas no fim dela)
depois:  sintomas → Como funciona, etapa por etapa → seção do procedimento
```

O bloco das etapas saiu de dentro da seção do procedimento e virou seção própria
(`#etapas`), com título de seção. O `<h3>` virou `<h2>` porque agora ele titula
uma seção, e não um bloco interno — isso fechou o S-5b.

### O que mudou de desenho

A seção do procedimento eram **dois `.card` de 50% lado a lado**, com uma
`.checklist` dentro do primeiro — a mesma placa da seção de sintomas, logo
acima. Duas listas iguais em sequência.

Agora é **grade de cards com ícone**, 3×2, em faixa clara:

| LP | Seção | O que virou card |
|---|---|---|
| Jonathas | `#cirurgia-ortognatica` | as 6 indicações da ortognática |
| Matheus | `#atm` | os 6 sintomas de ATM |
| Lucas | `#procedimentos` | os 6 procedimentos de cirurgia oral |

O texto explicativo que sobrou fecha a seção, centrado, no mesmo eixo do
cabeçalho. E o bloco que trazia foto saiu para seção clara própria —
`#planejamento-virtual` no Jonathas, `#cirurgia-oral` no Matheus.

### ⚠️ Copy nova — precisa de revisão jurídica

**O título de cada card do Jonathas e do Matheus é texto novo, escrito nesta
rodada.** Cada um resume a frase que já estava ali, para o bloco poder ser
varrido com o olho:

- Jonathas — "Mordida que não encaixa", "Desproporção entre os maxilares",
  "Assimetria facial", "Dificuldade para mastigar", "Alteração respiratória",
  "Quando o aparelho não resolve"
- Matheus — "Dor na face", "Estalo e travamento", "A boca abre menos",
  "Bruxismo e apertamento", "Alteração no disco", "Dor de cabeça"

Nenhuma frase existente foi alterada e nenhuma afirmação nova entrou. Ainda
assim é copy em página de saúde: **entra na revisão jurídica / CRO-SC junto com
o resto**. Na LP do Lucas não há texto novo — os itens já eram curtos e viraram
o próprio título.

### Duas saídas do design system, registradas

1. **Canto de 8px** na foto da clínica (seção de localização). O sistema só
   tinha os 3px do botão. Decisão do cliente.
2. **Azul da marca a 8% de alfa** como fundo do chip do ícone. Não é cor nova —
   é `--brand-blue` em transparência.

A caixa do card em si **não** saiu do sistema: usa a mesma borda de 1px e a
mesma régua de 3px em azul no topo dos `.card` que já existiam. O canto macio da
referência foi descartado a pedido do cliente, para não abrir um segundo raio no
sistema.

### Duas tentativas anteriores, descartadas

Ficam registradas porque custaram tempo e a lição vale:

1. **Rail de rótulo + coluna de leitura** — criou três margens esquerdas
   diferentes na mesma seção e meia tela vazia à direita. Não leu como
   assimetria, leu como quebrado.
2. **Índice tipográfico de régua corrida** — alinhamento resolvido, mas régua
   fina + tipo pequeno + tudo no mesmo tom. Sem nada com massa para segurar o
   olho, ficou vazio.

> **A lição:** tirar a caixa não é, sozinho, um ganho de design. O que estava
> errado era a repetição do container 50/50 — e o que resolveu foi trocar o
> container por outro objeto **com peso**, não por ausência de objeto.

---

## Como estamos trabalhando

Ajuste feito **uma seção por vez**, conferido no ar antes de replicar nas outras
páginas. A estrutura é quase idêntica entre as 4 rotas, então o que fecha numa
vale para as demais — mas a validação vem antes da replicação, não depois. Foi o
contrário disso que produziu a rodada que precisou ser revertida.

Vale também para ícone: dos doze desenhados nesta rodada, **nove precisaram ser
refeitos depois de vistos renderizados** a 28px. O que parece claro no `<path>`
vira borrão na tela.
