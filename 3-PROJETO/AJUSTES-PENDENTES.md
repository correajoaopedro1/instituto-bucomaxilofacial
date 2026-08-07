# Ajustes pendentes — Instituto Bucomaxilofacial

**Revisado em 06/08/2026**, conferindo item a item contra o código e contra o
site no ar. A rodada de 05–06/08 fechou quase tudo o que era design e resolveu
seis defeitos que ninguém tinha visto. O que sobrou está abaixo — e o que sobrou
quase não é design: é arquivo, decisão de cliente e revisão jurídica.

> **Segunda passada de 06/08 — a tabela A saiu inteira.** Os sete erros
> estruturais estão fechados, junto com o S-6 e o M-2 no mobile. Sobra **um**
> item de design no documento todo, o **T-5**, e ele só depende de dois
> arquivos de imagem. Todo o resto que resta é decisão de cliente, contrato
> de operadora ou revisão jurídica — nada que se resolva no editor.

⚠️ **Nada desta segunda passada foi visto renderizado ainda.** As mudanças de
CSS (`.mobile-sub .role` e a classe `.registro` nova) e o acordeão de Contato
no menu mobile foram conferidos no HTML e no CSS gerados, não na tela. Pela
regra abaixo, **olhar antes de considerar fechado**.

Marque ✅ conforme sair. Ajuste **uma seção por vez**, conferido no ar antes de
replicar nas outras páginas.

---

## A. Erros estruturais

| # | Ponto | Onde | Situação |
|---|---|---|---|
| ~~E-1~~ | `canonical`, `og:url`, JSON-LD e `sitemap.xml` apontavam para o domínio antigo, que ainda é o Wix | 4 HTMLs, `sitemap.xml`, `robots.txt` — 31 ocorrências | ✅ **fechado em 06/08** |
| ~~E-2~~ | O domínio estava gravado à mão, sem token — era a causa do E-1 | `tokens.json`, `build.mjs` | ✅ **fechado em 06/08** |
| ~~E-3~~ | `href="#redes-sociais"` não tinha alvo em página nenhuma | 4 HTMLs | ✅ **fechado em 06/08** |
| ~~E-4~~ | O M-2 estava só no menu desktop; no mobile a ordem era a antiga e "Contato" era link solto | 4 HTMLs, `.mobile-nav` | ✅ **fechado em 06/08** |
| ~~E-5~~ | Texto duplicado na faixa de credenciais do Jonathas | — | ✅ corrigido |
| ~~E-6~~ | Comentários de bloco trocados depois da inversão do S-2 | 3 LPs | ✅ **fechado em 06/08** |
| ~~E-7~~ | `#estrutura h2` declarado duas vezes; o §17 não tinha efeito | `style.css` | ✅ **fechado em 06/08** |
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

### O que a rodada de 06/08 fez nesta tabela

Detalhe do E-1/E-2 em `PENDENCIAS.md`, no topo. Os outros cinco:

| # | O que foi feito |
|---|---|
| **E-3** | A âncora não tinha para onde apontar: os links de rede só existem na coluna do rodapé. Ela ganhou `id="redes-sociais"` nas 4 páginas — mesmo padrão que `#contato` e `#convenios` já usavam |
| **E-4** | O "Contato" solto do menu mobile virou acordeão, com os mesmos 4 itens do desktop (WhatsApp, Telefone, E-mail, Onde estamos), e passou para **antes** de Redes sociais. O JS não precisou mudar: o `.mobile-sub-toggle` já era genérico. **Junto veio o D-F de novo:** `.mobile-sub .role` ainda forçava CAIXA ALTA, e o e-mail sairia `RECEPCAOIBMF@GMAIL.COM` no celular. A regra de **caixa** do M-3 passou a valer no acordeão; a de **cor** não, porque o menu mobile tem fundo escuro e o grafite do M-3 seria texto invisível |
| **S-6** | "CRO-SC 7964" usava `.eyebrow`, que pinta de azul da marca — e azul em meio a texto corrido lê como link. Nasceu `.registro` (§21): mesma fonte, mesmo corpo, mesma caixa, cor grafite com peso baixado. Nenhuma cor nova no sistema |
| **E-6** | Cada rótulo voltou para o bloco que descreve, com a numeração seguindo a ordem que está no ar: **2** é a galeria, **2b** é a faixa de credenciais |
| **E-7** | A declaração morta do §17 saiu. No lugar dela, um comentário dizendo que a decisão final está no §18 — senão o próximo a ler apaga a linha certa |

---

## B. Transversal

| # | Ponto | Situação |
|---|---|---|
| T-1 | Hierarquia entre eyebrow e título | ✅ |
| T-2 | Fontes pequenas | ✅ |
| T-3 | Tamanho dos títulos padronizado entre as páginas | ✅ |
| T-4 | Negrito que não combina com a serifada | ✅ **parcial** — resolvido dentro das listas. Fora delas o `<strong>` continua negrito serifado |
| T-5 | Favicon com o símbolo da marca | ⬜ **depende de arquivo — é a única pendência de design que sobrou.** Hoje as 4 páginas carregam `marca-simbolo.png` (1241×1241, **237 KB**) como ícone de aba *e* como touch icon. Funciona, mas é um quarto de mega baixado em toda visita para desenhar 16 pixels. Faltam dois arquivos: `favicon-32.png` (32×32) e `apple-touch-icon.png` (180×180), a taça recortada, fundo transparente no primeiro. Entregues em `assets/img/`, é uma troca de duas linhas no `<head>` das 4 páginas |
| **T-6** | **Botões padronizados em azul** | ✅ as 8 ocorrências de `btn--dark` saíram. Não existe mais CTA escuro no site |
| **T-7** | **Ícones no rodapé** | ✅ Contato, Onde estamos e Redes sociais ganharam ícone de linha na cor herdada |

## C. Menu

| # | Ponto | Situação |
|---|---|---|
| M-1 | Tratamentos raso | ✅ **no menu** — submenu largo com 6 procedimentos. ⬜ **no destino**: 3 dos 6 caem na mesma página do Jonathas e "Traumatologia da face" cai em `/#procedimentos`. A profundidade prometida no menu ainda não existe como página |
| M-2 | Contato antes de Redes sociais | ✅ **fechado** — desktop e mobile, ver **E-4** |
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
| S-6 | Sobre o cirurgião | ✅ **fechado em 06/08** — o número de registro saiu do `.eyebrow` e ganhou a classe `.registro` (§21), que mantém a tipografia e troca só a cor. Deixou de parecer link |
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
