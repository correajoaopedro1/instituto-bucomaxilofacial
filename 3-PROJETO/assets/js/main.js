/* ===================================================================
   INSTITUTO BUCOMAXILOFACIAL — main.js
   -------------------------------------------------------------------
   Interações. Extraído do molde-mestre index.html, mantendo o mesmo
   comportamento, e estendido com os componentes novos.

   Do molde (inalterado):  Slider genérico · carrossel fade de
   depoimentos · header sticky · menu mobile · reveal ao rolar.
   Novo:                   acordeão de FAQ · nav por âncora ·
                           facade do mapa · acessibilidade de teclado.

   Sem dependências. Carregar com `defer`, depois de tracking.js.
=================================================================== */
(function (w, d) {
  "use strict";

  var reduceMotion = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function track(event, params) {
    if (typeof w.ibmfTrack === "function") w.ibmfTrack(event, params);
  }
  function lp() {
    return (w.ibmfCtx && w.ibmfCtx.lp) || d.body.getAttribute("data-lp") || "";
  }
  function el(html) {
    var t = d.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* =================================================================
     SLIDER GENÉRICO  (código do molde, inalterado)
  ================================================================= */
  function Slider(root) {
    var track_    = root.querySelector(".slider-track");
    var slides   = Array.prototype.slice.call(track_.children);
    var prevBtn  = root.querySelector(".prev");
    var nextBtn  = root.querySelector(".next");
    var gap      = parseInt(root.dataset.gap || "0", 10);
    var loop     = root.dataset.loop === "true";
    var autoplay = parseInt(root.dataset.autoplay || "0", 10);
    var index    = 0;
    var perView  = 1;
    var timer    = null;

    if (!slides.length || !prevBtn || !nextBtn) return;

    function currentPerView() {
      var wpx = w.innerWidth;
      if (wpx <= 767) return parseFloat(root.dataset.perViewSm || "1");
      if (wpx <= 1100) return parseFloat(root.dataset.perViewMd || "2");
      return parseFloat(root.dataset.perView || "1");
    }
    function maxIndex() { return Math.max(0, slides.length - perView); }

    function layout() {
      perView = currentPerView();
      var g = w.innerWidth <= 767 ? Math.min(gap, 20) : gap;
      track_.style.setProperty("--slider-gap", g + "px");
      track_.style.setProperty("--slide-w", "calc((100% - " + (g * (perView - 1)) + "px) / " + perView + ")");
      if (index > maxIndex()) index = maxIndex();
      move();
    }

    function move() {
      var g = parseFloat(getComputedStyle(track_).getPropertyValue("--slider-gap")) || 0;
      var slideW = slides[0] ? slides[0].getBoundingClientRect().width : 0;
      track_.style.transform = "translateX(" + (-(index * (slideW + g))) + "px)";
      if (!loop) {
        prevBtn.disabled = index <= 0;
        nextBtn.disabled = index >= maxIndex();
      }
    }

    function go(dir) {
      var max = maxIndex();
      index += dir;
      if (index < 0)   index = loop ? max : 0;
      if (index > max) index = loop ? 0 : max;
      move();
    }

    function restart() {
      if (!autoplay || reduceMotion) return;
      clearInterval(timer);
      timer = setInterval(function () { go(1); }, autoplay);
    }

    prevBtn.addEventListener("click", function () { go(-1); restart(); });
    nextBtn.addEventListener("click", function () { go(1);  restart(); });

    var startX = null;
    root.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
      startX = null;
    });

    root.addEventListener("mouseenter", function () { clearInterval(timer); });
    root.addEventListener("mouseleave", restart);

    w.addEventListener("resize", debounce(layout, 150));
    w.addEventListener("load", layout);
    layout();
    restart();
  }

  Array.prototype.forEach.call(d.querySelectorAll("[data-slider]"), Slider);

  /* =================================================================
     CARROSSEL DE DEPOIMENTOS (fade)
     Diferença em relação ao molde: os depoimentos vêm do HTML, não de
     um array em JS — os tokens {{DEPOIMENTO_N}} precisam estar visíveis
     na marcação (regra 3 do briefing). O comportamento é o mesmo.
  ================================================================= */
  (function () {
    var wrapEl = d.getElementById("reviewsFade");
    var dotsEl = d.getElementById("reviewDots");
    if (!wrapEl || !dotsEl) return;

    var items = Array.prototype.slice.call(wrapEl.querySelectorAll(".review"));
    if (items.length < 2) { if (items[0]) items[0].classList.add("is-active"); return; }

    var cur = 0, timer;
    items.forEach(function (item, i) {
      item.classList.toggle("is-active", i === 0);
      var dot = el('<button type="button" class="' + (i === 0 ? "is-active" : "") +
                   '" aria-label="Depoimento ' + (i + 1) + '"></button>');
      dot.addEventListener("click", function () { show(i); restart(); });
      dotsEl.appendChild(dot);
    });
    var dots = dotsEl.children;

    function show(i) {
      items[cur].classList.remove("is-active");
      dots[cur].classList.remove("is-active");
      cur = (i + items.length) % items.length;
      items[cur].classList.add("is-active");
      dots[cur].classList.add("is-active");
    }
    function restart() {
      clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(function () { show(cur + 1); }, 7000);
    }
    restart();
  })();

  /* =================================================================
     HEADER STICKY  (código do molde)
  ================================================================= */
  (function () {
    var header = d.getElementById("siteHeader");
    if (!header) return;
    function onScroll() { header.classList.toggle("is-stuck", w.scrollY > 80); }
    w.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* =================================================================
     MENU MOBILE  (molde + acessibilidade de teclado)
  ================================================================= */
  (function () {
    var menu    = d.getElementById("mobileMenu");
    var openBtn = d.getElementById("menuOpen");
    var closeBtn= d.getElementById("menuClose");
    if (!menu || !openBtn || !closeBtn) return;

    function open() {
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      d.body.style.overflow = "hidden";
      closeBtn.focus();
    }
    function close() {
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      d.body.style.overflow = "";
      openBtn.focus();
    }

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) close();
    });
  })();

  /* =================================================================
     SUBMENU DO MENU MOBILE  [NOVO]
     No desktop o submenu abre por :hover / :focus-within, em CSS puro.
     No celular não existe hover — vira acordeão, com a mesma mecânica
     de aria-expanded / hidden já usada no FAQ.
  ================================================================= */
  (function () {
    var toggles = d.querySelectorAll(".mobile-sub-toggle");
    if (!toggles.length) return;

    Array.prototype.forEach.call(toggles, function (btn) {
      var panel = d.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.hidden = isOpen;
      });
    });
  })();

  /* O dock expansível de redes sociais foi removido em 04/08/2026 —
     as redes viraram item de menu com submenu e lista no rodapé.
     Sobrou o botão de WhatsApp, que não precisa de JS. */

  /* =================================================================
     ACORDEÃO DE FAQ  [NOVO]
     <button class="faq-q" aria-expanded aria-controls> + <div class="faq-a" hidden>
     Teclado funciona nativamente (é um <button>).
  ================================================================= */
  (function () {
    var questions = d.querySelectorAll(".faq-q");
    if (!questions.length) return;

    Array.prototype.forEach.call(questions, function (btn) {
      var panel = d.getElementById(btn.getAttribute("aria-controls"));
      if (!panel) return;

      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";

        // acordeão: fecha os irmãos do mesmo grupo
        var group = btn.closest(".faq");
        if (group && !isOpen) {
          Array.prototype.forEach.call(group.querySelectorAll('.faq-q[aria-expanded="true"]'), function (other) {
            other.setAttribute("aria-expanded", "false");
            var op = d.getElementById(other.getAttribute("aria-controls"));
            if (op) op.hidden = true;
          });
        }

        btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
        panel.hidden = isOpen;

        if (!isOpen) {
          track("faq_open", {
            lp: lp(),
            pergunta: (btn.getAttribute("data-pergunta") || btn.textContent || "").trim().substring(0, 120)
          });
        }
      });
    });
  })();

  /* =================================================================
     NAVEGAÇÃO POR ÂNCORA  [NOVO]
     Marca o bloco visível na barra de âncoras da LP multi-procedimento.
  ================================================================= */
  (function () {
    var nav = d.querySelector(".anchor-nav");
    if (!nav || !("IntersectionObserver" in w)) return;

    var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").substring(1);
      var section = d.getElementById(id);
      if (section) { map[id] = a; targets.push(section); }
    });
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var active = map[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    targets.forEach(function (t) { io.observe(t); });
  })();

  /* =================================================================
     FACADE DO MAPA  [NOVO]
     O iframe do Google Maps só é criado no clique — nunca no load
     inicial (briefing §13, performance).
  ================================================================= */
  (function () {
    var facades = d.querySelectorAll("[data-map-facade]");
    if (!facades.length) return;

    Array.prototype.forEach.call(facades, function (node) {
      function load(e) {
        if (e) e.preventDefault();
        if (node.classList.contains("is-loaded")) return;
        var query = node.getAttribute("data-map-query") || "";
        var iframe = d.createElement("iframe");
        iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
        iframe.title = node.getAttribute("data-map-title") || "Mapa da localização da clínica";
        iframe.loading = "lazy";
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        iframe.setAttribute("allowfullscreen", "");
        node.insertBefore(iframe, node.firstChild);
        node.classList.add("is-loaded");
        track("maps_click", { lp: lp() });
      }
      node.addEventListener("click", load);
      node.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") load(e);
      });
    });
  })();

  /* =================================================================
     REVEAL AO ROLAR  (código do molde)
  ================================================================= */
  (function () {
    var nodes = d.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if ("IntersectionObserver" in w && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: .12 });
      Array.prototype.forEach.call(nodes, function (n) { io.observe(n); });
    } else {
      Array.prototype.forEach.call(nodes, function (n) { n.classList.add("is-visible"); });
    }
  })();

  /* =================================================================
     SLOTS DE IMAGEM
     Enquanto o <img> ainda aponta para o placeholder data:, o slot
     mostra o nome do token por cima (regra .slot[data-slot]::after).
     Assim que o arquivo real entra no src, a etiqueta some sozinha.
     Nenhuma alteração de HTML é necessária na troca da imagem.
  ================================================================= */
  Array.prototype.forEach.call(d.querySelectorAll(".slot"), function (slot) {
    var img = slot.querySelector("img");
    if (img && img.getAttribute("src") && img.getAttribute("src").indexOf("data:") !== 0) {
      slot.classList.add("is-filled");
    }
  });

  /* =================================================================
     ANO CORRENTE NO FOOTER
  ================================================================= */
  Array.prototype.forEach.call(d.querySelectorAll("[data-ano]"), function (n) {
    n.textContent = new Date().getFullYear();
  });

})(window, document);
