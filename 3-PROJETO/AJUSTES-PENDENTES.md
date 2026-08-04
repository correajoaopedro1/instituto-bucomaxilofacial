# Ajustes de design — lista do cliente, 04/08/2026

Revisão feita com o site no ar. Uma linha por ponto, para irmos um a um
sem perder nada. Marque ✅ conforme sair.

---

## Transversal (vale para o site todo)

| # | Ponto | Situação |
|---|---|---|
| T-1 | **Hierarquia fraca** — pouca diferença de cor e tamanho entre eyebrow e título; às vezes o mesmo tamanho | ✅ escala refeita: eyebrow em `--brand-blue` com peso 500, corpo de 1rem–1,1rem, título de seção de 1,7rem–2,15rem |
| T-2 | **Fontes pequenas, quase ilegíveis** | ✅ toda a escala subiu um degrau |
| T-3 | **Padronizar o tamanho dos títulos** entre as páginas | ✅ todo `.section-head h2` usa `--fs-x-large` |
| T-4 | **Negrito que não combina** com a serifada | ⬜ decidir tratamento alternativo caso a caso |
| T-5 | **Favicon** — usar o símbolo da marca | ⬜ arquivo em `assets/img/marca-simbolo.png`; falta recortar em 32×32 e 180×180 (237 KB é pesado demais para favicon) |

## Menu

| # | Ponto | Situação |
|---|---|---|
| M-1 | **Tratamentos raso** — cirurgia ortognática e os demais procedimentos merecem mais profundidade | ⬜ |
| M-2 | **Contato antes de Redes sociais**, e com texto abaixo como os outros | ⬜ aguardando confirmação do que é "texto abaixo" |

## LP dos cirurgiões (Jonathas · Matheus · Lucas — mesma estrutura)

| # | Seção | Ponto | Situação |
|---|---|---|---|
| S-1 | Hero + credenciais | ok | ✅ |
| S-2 | Galeria | **Inverter**: título + imagens sobem para antes dos 4 rótulos (Especialidade, Foco…) | ⬜ |
| S-3 | Você se reconhece | Pobreza visual: só bullets, sem caixa, sem design. Botão e texto acima centrados enquanto o resto da página é à esquerda | ⬜ |
| S-4 | O procedimento | Base boa. Trabalhar cor na borda das caixas. Espaço da imagem grande demais, desequilibra o grid em relação aos cards acima. Seca | ⬜ |
| S-5 | Etapas | **Numeração duplicada (1. e 01)** | ✅ o reset zerava só `ul`; agora zera `ol` |
| S-5b | Etapas | Pouco espaçamento; título "como funciona cada etapa" pequeno demais; título deveria ser azul | ⬜ |
| S-6 | Sobre o cirurgião | Sem hierarquia. Falta azul no nome. Espaçamento demais entre textos. "Instagram do Dr. Jonathas" deslocado. O espaçamento empurrou o botão para longe | ⬜ |
| S-7 | O Instituto | **Única seção que não precisa de correção** | ✅ |
| S-8 | Paciente de fora | Terrível. Textos jogados em bullet, sem design, sem cor, negrito que não combina | ⬜ |
| S-9 | Convênios | ok | ✅ |
| S-10 | FAQ | ok | ✅ |
| S-11 | Próximo passo | Informações desalinhadas com o espaço da imagem | ⬜ imagem já em `assets/img/proximo-passo.webp` |
| S-12 | Rodapé | Terrível. Menu diferente do menu do topo; espaçamento grande demais entre os elementos | ⬜ |

## LP Geral (Instituto)

| # | Seção | Ponto | Situação |
|---|---|---|---|
| G-1 | 2ª seção | Mesma inversão da S-2 | ⬜ |
| G-2 | Quem conduz seu caso | Alinhar tudo ao centro; textos e botões na mesma altura | ⬜ |
| G-3 | A estrutura | Extremamente pobre | ⬜ |
| G-4 | Demais seções | Valem as observações das LPs de cirurgião | ⬜ |

---

## Como estamos trabalhando

Ajuste feito **uma seção por vez**, conferido no ar antes de replicar
nas outras páginas. A estrutura é quase idêntica entre as 4 rotas, então
o que fecha numa vale para as demais — mas a validação vem antes da
replicação, não depois. Foi o contrário disso que produziu a rodada que
precisou ser revertida.
