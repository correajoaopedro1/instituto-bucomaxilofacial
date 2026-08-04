/* ===================================================================
   INSTITUTO BUCOMAXILOFACIAL — tracking.js
   -------------------------------------------------------------------
   Responsabilidades (briefing §10):
     1. Capturar e persistir UTMs e click IDs na sessão
     2. Propagar esses parâmetros em todo link interno entre as LPs
     3. Injetar um identificador curto de origem na mensagem do WhatsApp
     4. Empurrar os eventos do briefing para o dataLayer

   REGRA: nenhuma tag de mídia aqui. Nem Pixel, nem gtag, nem GA4.
   Só dataLayer. O disparo é responsabilidade do GTM.

   Carregar ANTES de main.js e com `defer`.
=================================================================== */
(function (w, d) {
  "use strict";

  /* -----------------------------------------------------------------
     dataLayer
  ----------------------------------------------------------------- */
  w.dataLayer = w.dataLayer || [];

  function push(event, params) {
    var payload = { event: event };
    if (params) {
      for (var k in params) {
        if (Object.prototype.hasOwnProperty.call(params, k) && params[k] !== null && params[k] !== "") {
          payload[k] = params[k];
        }
      }
    }
    w.dataLayer.push(payload);
    if (w.IBMF_DEBUG) { console.log("[dataLayer]", payload); }
  }

  /* -----------------------------------------------------------------
     Contexto da página — lido do <body data-*>
  ----------------------------------------------------------------- */
  var body = d.body;
  var CTX = {
    lp:                 body.getAttribute("data-lp") || "desconhecida",
    medico:             body.getAttribute("data-medico") || "",
    procedimento_foco:  body.getAttribute("data-procedimento-foco") || ""
  };

  /* -----------------------------------------------------------------
     1. CAPTURA E PERSISTÊNCIA
  ----------------------------------------------------------------- */
  var TRACKED = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "gclid", "fbclid", "wbraid", "gbraid", "msclkid"
  ];

  var KEY = "ibmf_attr";      // sessionStorage — atribuição da sessão
  var KEY_FIRST = "ibmf_attr_first"; // localStorage — primeiro toque (para conversão offline)

  function safeGet(store, key) {
    try { return w[store].getItem(key); } catch (e) { return null; }
  }
  function safeSet(store, key, val) {
    try { w[store].setItem(key, val); } catch (e) { /* modo privado / storage bloqueado */ }
  }

  function readUrlParams() {
    var out = {};
    var qs = w.location.search;
    if (!qs || qs.length < 2) return out;
    qs.substring(1).split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("=");
      var k = decodeURIComponent(i < 0 ? pair : pair.substring(0, i));
      var v = i < 0 ? "" : decodeURIComponent(pair.substring(i + 1).replace(/\+/g, " "));
      if (TRACKED.indexOf(k) > -1 && v) out[k] = v;
    });
    return out;
  }

  function makeSid() {
    // 6 caracteres base36 — identificador curto e único da sessão
    return (Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 4));
  }

  var stored = {};
  try { stored = JSON.parse(safeGet("sessionStorage", KEY) || "{}") || {}; } catch (e) { stored = {}; }

  var incoming = readUrlParams();
  var hasIncoming = false;
  for (var p in incoming) { if (Object.prototype.hasOwnProperty.call(incoming, p)) { hasIncoming = true; break; } }

  if (hasIncoming) {
    // Nova origem detectada: sobrescreve a atribuição da sessão.
    stored = incoming;
    stored.landing = w.location.pathname;
    stored.sid = stored.sid || makeSid();
  }
  if (!stored.sid) { stored.sid = makeSid(); }
  if (!stored.landing) { stored.landing = w.location.pathname; }
  if (!stored.referrer && d.referrer && d.referrer.indexOf(w.location.host) === -1) {
    stored.referrer = d.referrer;
  }

  safeSet("sessionStorage", KEY, JSON.stringify(stored));
  if (!safeGet("localStorage", KEY_FIRST)) {
    safeSet("localStorage", KEY_FIRST, JSON.stringify(stored));
  }

  /* -----------------------------------------------------------------
     Identificador curto de origem — vai anexado à mensagem do WhatsApp.
     Formato:  lp.local.canal.sid      ex.: jonathas.hero.gads.k3f9a2
  ----------------------------------------------------------------- */
  function slug(v, max) {
    return String(v || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, max || 16);
  }

  function canal() {
    if (stored.utm_source) return slug(stored.utm_source, 12);
    if (stored.gclid || stored.wbraid || stored.gbraid) return "gads";
    if (stored.fbclid) return "meta";
    if (stored.msclkid) return "bing";
    if (stored.referrer) return "ref-" + slug(stored.referrer.replace(/^https?:\/\/(www\.)?/, "").split("/")[0], 10);
    return "direto";
  }

  function origemRef(ctaLocal) {
    return [slug(CTX.lp, 14), slug(ctaLocal || "geral", 14), canal(), stored.sid].join(".");
  }

  /* -----------------------------------------------------------------
     2. PROPAGAÇÃO EM LINKS INTERNOS
  ----------------------------------------------------------------- */
  function queryString() {
    var parts = [];
    TRACKED.forEach(function (k) {
      if (stored[k]) parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(stored[k]));
    });
    return parts.join("&");
  }

  function isInternal(a) {
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (href.charAt(0) === "/") return true;
    return a.hostname === w.location.hostname;
  }

  function propagate() {
    var qs = queryString();
    if (!qs) return;
    Array.prototype.forEach.call(d.querySelectorAll("a[href]"), function (a) {
      if (!isInternal(a)) return;
      var href = a.getAttribute("href");
      // não duplica parâmetro já presente
      if (TRACKED.some(function (k) { return href.indexOf(k + "=") > -1; })) return;
      var hashAt = href.indexOf("#");
      var hash = hashAt > -1 ? href.substring(hashAt) : "";
      var base = hashAt > -1 ? href.substring(0, hashAt) : href;
      a.setAttribute("href", base + (base.indexOf("?") > -1 ? "&" : "?") + qs + hash);
    });
  }

  /* -----------------------------------------------------------------
     3. INJEÇÃO DO REF NA MENSAGEM DO WHATSAPP
  ----------------------------------------------------------------- */
  function isWhatsApp(a) {
    var href = a.getAttribute("href") || "";
    return href.indexOf("wa.me/") > -1 || href.indexOf("api.whatsapp.com") > -1;
  }

  function decorateWhatsApp(a) {
    if (a.getAttribute("data-wa-ok") === "1") return;
    var href = a.getAttribute("href") || "";
    var ref = origemRef(a.getAttribute("data-cta-local"));
    var at = href.indexOf("text=");

    if (at > -1) {
      var head = href.substring(0, at + 5);
      var tailAt = href.indexOf("&", at);
      var msg = tailAt > -1 ? href.substring(at + 5, tailAt) : href.substring(at + 5);
      var rest = tailAt > -1 ? href.substring(tailAt) : "";
      var decoded = "";
      try { decoded = decodeURIComponent(msg); } catch (e) { decoded = msg; }
      if (decoded.indexOf("[ref:") === -1) {
        decoded = decoded + "\n\n[ref: " + ref + "]";
      }
      a.setAttribute("href", head + encodeURIComponent(decoded) + rest);
    } else {
      a.setAttribute("href", href + (href.indexOf("?") > -1 ? "&" : "?") +
        "text=" + encodeURIComponent("Olá! Vim pelo site do Instituto.\n\n[ref: " + ref + "]"));
    }
    a.setAttribute("data-origem-ref", ref);
    a.setAttribute("data-wa-ok", "1");
  }

  function decorateAllWhatsApp() {
    Array.prototype.forEach.call(d.querySelectorAll("a[href]"), function (a) {
      if (isWhatsApp(a)) decorateWhatsApp(a);
    });
  }

  /* -----------------------------------------------------------------
     4. EVENTOS
  ----------------------------------------------------------------- */

  /* --- lp_view --- */
  function lpView() {
    push("lp_view", {
      lp: CTX.lp,
      medico: CTX.medico,
      procedimento_foco: CTX.procedimento_foco,
      utm_source: stored.utm_source,
      utm_medium: stored.utm_medium,
      utm_campaign: stored.utm_campaign,
      utm_content: stored.utm_content,
      utm_term: stored.utm_term,
      gclid: stored.gclid,
      fbclid: stored.fbclid,
      wbraid: stored.wbraid,
      gbraid: stored.gbraid,
      msclkid: stored.msclkid,
      session_ref: stored.sid
    });
  }

  /* --- scroll_depth --- */
  function scrollDepth() {
    var marks = [25, 50, 75, 100];
    var fired = {};
    var ticking = false;

    function check() {
      ticking = false;
      var docH = Math.max(
        d.body.scrollHeight, d.documentElement.scrollHeight,
        d.body.offsetHeight, d.documentElement.offsetHeight
      );
      var seen = w.scrollY + w.innerHeight;
      var pct = docH <= w.innerHeight ? 100 : Math.round((seen / docH) * 100);
      marks.forEach(function (m) {
        if (!fired[m] && pct >= m) {
          fired[m] = true;
          push("scroll_depth", { lp: CTX.lp, percentual: m });
        }
      });
    }
    w.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; w.requestAnimationFrame(check); }
    }, { passive: true });
    check();
  }

  /* --- cliques (delegação única no documento) ---
     cta_click       = engajamento  (todo elemento com data-cta-id)
     whatsapp_click  = CONVERSÃO    (só quando o destino é o WhatsApp)
     Os dois podem disparar no mesmo clique; no GTM apenas
     whatsapp_click é mapeado como conversão (ver README).            */
  function clicks() {
    d.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;

      /* telefone */
      var tel = t.closest('a[href^="tel:"]');
      if (tel) push("phone_click", { lp: CTX.lp });

      /* mapa / endereço */
      var maps = t.closest("[data-maps]");
      if (maps) push("maps_click", { lp: CTX.lp });

      /* navegação entre LPs */
      var menuLink = t.closest("[data-menu-link]");
      if (menuLink) {
        push("menu_click", {
          lp_origem: CTX.lp,
          lp_destino: menuLink.getAttribute("data-menu-link")
        });
      }

      /* CTA */
      var cta = t.closest("[data-cta-id]");
      if (!cta) return;

      var base = {
        lp: CTX.lp,
        medico: cta.getAttribute("data-medico") || CTX.medico,
        procedimento: cta.getAttribute("data-procedimento") || CTX.procedimento_foco,
        cta_id: cta.getAttribute("data-cta-id"),
        cta_local: cta.getAttribute("data-cta-local") || ""
      };

      push("cta_click", base);

      if (cta.tagName === "A" && isWhatsApp(cta)) {
        decorateWhatsApp(cta); // garante ref atualizado antes da navegação
        var wa = {};
        for (var k in base) { if (Object.prototype.hasOwnProperty.call(base, k)) wa[k] = base[k]; }
        wa.origem_ref = cta.getAttribute("data-origem-ref");
        push("whatsapp_click", wa);
      }
    }, true);
  }

  /* -----------------------------------------------------------------
     API pública — usada por main.js (ex.: faq_open)
  ----------------------------------------------------------------- */
  w.ibmfTrack = push;
  w.ibmfCtx = CTX;
  w.ibmfOrigemRef = origemRef;

  /* -----------------------------------------------------------------
     Boot
  ----------------------------------------------------------------- */
  function init() {
    propagate();          // 1º: parâmetros nos links internos
    decorateAllWhatsApp();// 2º: ref na mensagem do WhatsApp
    lpView();
    scrollDepth();
    clicks();
  }

  if (d.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
