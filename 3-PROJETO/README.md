# Instituto Bucomaxilofacial — Landing Pages

Conjunto de 4 páginas estáticas para o Instituto Bucomaxilofacial
(Florianópolis / SC). HTML, CSS e JS puros — sem framework, sem build,
sem dependência de servidor de aplicação.

---

## 1. Rotas

| Rota | Arquivo | Foco | Indexação |
|---|---|---|---|
| `/` | `index.html` | Instituto — visão geral, equipe, procedimentos | index |
| `/dr-jonathas-claus/` | `dr-jonathas-claus/index.html` | Cirurgia ortognática | index |
| `/dr-matheus-spinella/` | `dr-matheus-spinella/index.html` | ATM e cirurgia oral | index |
| `/dr-lucas/` | `dr-lucas/index.html` | Procedimentos gerais | **noindex** — fora do sitemap até os dados do cirurgião serem fornecidos |

Focos definidos pelo cronograma de 52 semanas, itens 1.3, 1.6 e 1.8.

---

## 2. Estrutura de arquivos

```
/
├── index.html                        LP Geral
├── dr-jonathas-claus/index.html      LP ortognática
├── dr-matheus-spinella/index.html    LP ATM e cirurgia oral
├── dr-lucas/index.html               LP procedimentos gerais (noindex)
├── sitemap.xml
├── robots.txt
├── DESIGN-SYSTEM.md                  Fonte de verdade visual
├── PENDENCIAS.md                     Tudo que falta, com responsável
├── README.md
└── assets/
    ├── css/style.css                 Design system inteiro, um arquivo
    ├── js/main.js                    Interações (slider, FAQ, menu, reveal, mapa)
    ├── js/tracking.js                UTMs, click IDs e dataLayer
    ├── img/logo-instituto.webp       Logo (fallback .png)
    └── fonts/                        Addington CF — pendente, ver FONT-01
```

## 3. Publicação

São arquivos estáticos. Suba a pasta inteira na raiz do domínio.
Requisitos do servidor:

1. Servir `index.html` como documento padrão de cada diretório
   (as rotas terminam em barra: `/dr-jonathas-claus/`).
2. HTTPS obrigatório.
3. Compressão gzip/brotli para `.html`, `.css` e `.js`.
4. Cache longo para `/assets/`, cache curto para os `.html`.

**Antes de publicar, substitua os tokens `{{...}}`.** A lista completa,
com responsável por cada um, está em `PENDENCIAS.md`. Nenhum token
inventado — o que não foi confirmado ficou como token de propósito.

### Preview local

Como as páginas usam caminhos absolutos (`/assets/...`), abrir o HTML
direto pelo `file://` não carrega o CSS. Use um servidor estático simples
na raiz do projeto — por exemplo `npx serve` ou `python -m http.server` —
e acesse `http://localhost:PORTA/`.

---

## 4. Rastreamento

### 4.1 Princípio

**No HTML só existe o container do GTM.** Nenhum Pixel, gtag ou GA4 está
hardcodado. Tudo é disparado a partir do `dataLayer` e configurado dentro
do GTM. Trocar de ferramenta de mídia não exige tocar no código.

O snippet do GTM tem uma guarda: enquanto `{{GTM_ID}}` não for substituído,
ele não tenta carregar nada e não gera erro no console.

### 4.2 O que o `tracking.js` faz

1. Captura UTMs e click IDs (`gclid`, `fbclid`, `ttclid`, `msclkid`) da URL.
2. Persiste na sessão — o dado sobrevive à navegação entre as páginas.
3. Propaga os parâmetros em todo link interno entre as LPs.
4. Anexa um identificador curto de origem à mensagem do WhatsApp,
   permitindo amarrar a conversa à campanha que a gerou.
5. Empurra os eventos abaixo para o `dataLayer`.

### 4.3 Eventos no `dataLayer`

| Evento | Quando dispara | Parâmetros principais |
|---|---|---|
| `lp_view` | Carregamento da página | `lp`, `medico`, `procedimento_foco`, UTMs, `session_ref` |
| `phone_click` | Clique em link `tel:` | `lp` |
| `cta_click` | Clique em qualquer elemento com `data-cta-id` | `cta_id`, `cta_local`, `medico`, `procedimento` |
| `whatsapp_click` | Clique em link `wa.me` | idem + `origem_ref` |
| `faq_open` | Abertura de item do FAQ | `pergunta` |
| `scroll_depth` | 25 / 50 / 75 / 100% da página | `percentual` |
| `maps_click` | Clique no mapa ou no endereço | — |
| `menu_click` | Navegação entre as LPs pelo menu | `lp_destino` |
| `tempo_engajado` | Permanência com interação | `segundos` |

### 4.4 Configuração no GTM

Crie os acionadores como *Custom Event* com o nome exato da tabela acima.

> ⚠️ **Correção de 04/08/2026.** Até esta revisão este documento chamava o
> evento de carregamento de `page_view_lp`, mas o `tracking.js` sempre
> empurrou **`lp_view`**. Um acionador criado com o nome errado nunca
> dispararia. O nome correto — e o que está no código — é `lp_view`.
> Registrado como TRK-01 em `PENDENCIAS.md`.
Sugestão de conversões (a fechar com o gestor de tráfego):

- **Conversão primária:** `whatsapp_click`
- **Micro-conversão:** `cta_click`, `faq_open`, `scroll_depth` ≥ 75

O `origem_ref` anexado à mensagem do WhatsApp permite conversão offline:
quando a cirurgia é realizada, dá para devolver o resultado à campanha
de origem.

---

## 5. Design system

Fonte de verdade: `DESIGN-SYSTEM.md`.

Regra prática: **nenhuma cor, fonte, raio ou componente fora do que está lá.**
Todas as cores vêm de três tons extraídos do logo oficial
(`#0E7BA2`, `#363435`, `#AAABAF`) mais derivadas de luminosidade.

Para criar uma LP nova (ex.: cervicoplastia — item 1.7 do cronograma),
reaproveite os blocos marcados `[REUTILIZÁVEL]` no CSS. Não escreva CSS novo
sem antes verificar se o componente já existe.

---

## 6. Compliance

As páginas foram escritas dentro das restrições de publicidade odontológica:

- Sem preço, sem promessa ou garantia de resultado, sem superlativo.
- Sem antes/depois — não existe slot para isso em nenhuma página.
- Implante não aparece como procedimento anunciado em nenhuma página.
- Responsável técnico e especialidades no rodapé de todas as páginas.

**Isso não substitui revisão jurídica.** Antes de publicar, toda a copy
deve passar pelo jurídico e/ou pelo CRO-SC. Ver `PENDENCIAS.md` §2.

---

## 7. Acessibilidade

- Navegação por teclado em todo o site, com foco visível.
- `skip-link` para o conteúdo.
- `aria-current="page"` no item do menu da página atual.
- FAQ com `aria-expanded` / `aria-controls`.
- `alt` em todas as imagens; imagem decorativa com `alt=""`.
- Contraste AA em texto e botões.
- `prefers-reduced-motion` respeitado.
