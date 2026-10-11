/* ==========================================================================
   MCIC · capa de interacción del portafolio
   - Se re-inicializa en cada navegación instantánea de Material (document$).
   - Con prefers-reduced-motion todo queda estático y visible.
   ========================================================================== */
(() => {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const EASE = "cubic-bezier(.22, 1, .36, 1)";
  window.__mcic = true;

  /** Funciones de limpieza de la página actual (observers, rAF, listeners). */
  let cleanups = [];
  const onCleanup = (fn) => cleanups.push(fn);

  // ------------------------------------------------------------------------
  // Aparición progresiva al hacer scroll
  // ------------------------------------------------------------------------
  function initReveal(root) {
    const content = root.querySelector(".md-content__inner");
    if (content && !root.querySelector(".mc-hero")) {
      content
        .querySelectorAll(":scope > h2, :scope > .md-typeset__scrollwrap, :scope > .admonition, :scope > details, :scope > .grid, :scope > .pbar")
        .forEach((el) => el.setAttribute("data-mc-auto", ""));
    }

    const targets = root.querySelectorAll("[data-reveal], [data-mc-auto], .pbar");
    if (reduce.matches || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 }
    );
    targets.forEach((el) => io.observe(el));
    onCleanup(() => io.disconnect());
  }

  // ------------------------------------------------------------------------
  // Contadores numéricos
  // ------------------------------------------------------------------------
  function initCounters(root) {
    const els = root.querySelectorAll("[data-count]");
    if (reduce.matches || !els.length || !("IntersectionObserver" in window)) return;

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      const duration = 1600;
      const start = performance.now();
      const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = (target * easeOutExpo(t)).toFixed(decimals) + suffix;
        if (t < 1 && el.isConnected) requestAnimationFrame(tick);
      };
      el.textContent = (0).toFixed(decimals) + suffix;
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          run(entry.target);
        }
      },
      { threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
    onCleanup(() => io.disconnect());
  }

  // ------------------------------------------------------------------------
  // Filtro de asignaturas con animación FLIP
  // ------------------------------------------------------------------------
  function initFilter(root) {
    root.querySelectorAll(".mc-filter").forEach((group) => {
      const grid = group.parentElement.querySelector("[data-filter-target]");
      if (!grid) return;

      group.addEventListener("click", (event) => {
        const button = event.target.closest("[data-filter]");
        if (!button || button.getAttribute("aria-pressed") === "true") return;
        group.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));

        const filter = button.dataset.filter;
        const cards = [...grid.children];
        const first = new Map(cards.filter((c) => !c.hidden).map((c) => [c, c.getBoundingClientRect()]));

        cards.forEach((c) => (c.hidden = !(filter === "all" || c.dataset.group === filter)));
        if (reduce.matches) return;

        cards.forEach((c, i) => {
          if (c.hidden) return;
          const prev = first.get(c);
          const last = c.getBoundingClientRect();
          if (prev) {
            const dx = prev.left - last.left;
            const dy = prev.top - last.top;
            if (dx || dy) {
              c.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 650, easing: EASE });
            }
          } else {
            c.classList.add("is-in");
            c.animate(
              [{ opacity: 0, transform: "translateY(12px) scale(.96)" }, { opacity: 1, transform: "none" }],
              { duration: 550, easing: EASE, delay: 40 * i, fill: "backwards" }
            );
          }
        });
      });
    });
  }

  // ------------------------------------------------------------------------
  // Microinteracciones de puntero: spotlight, tilt y botones magnéticos
  // ------------------------------------------------------------------------
  function initPointer(root) {
    if (!finePointer.matches || reduce.matches) return;

    root.querySelectorAll(".mc-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    });

    root.querySelectorAll("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(x * 9).toFixed(2)}deg`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });

    root.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--tx", `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px`);
        el.style.setProperty("--ty", `${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
      });
    });
  }

  // ------------------------------------------------------------------------
  // Red de información del hero: nodos, enlaces y paquetes en tránsito
  // ------------------------------------------------------------------------
  function initNetwork(root) {
    const canvas = root.querySelector(".mc-hero__canvas");
    if (!canvas) return;
    const hero = canvas.closest(".mc-hero");
    const ctx = canvas.getContext("2d");
    const LINK = 130;
    const PALETTE = ["92,198,238", "92,198,238", "92,198,238", "111,220,176", "226,198,107"];
    const pointer = { x: -1e4, y: -1e4, active: false };
    let w = 0, h = 0, nodes = [], packets = [], raf = 0, running = false, visible = true;

    const spawn = () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.08 + Math.random() * 0.22;
      const bvx = Math.cos(angle) * speed, bvy = Math.sin(angle) * speed;
      return {
        x: Math.random() * w, y: Math.random() * h, vx: bvx, vy: bvy, bvx, bvy,
        r: 0.7 + Math.random() * 1.6,
        c: PALETTE[(Math.random() * PALETTE.length) | 0],
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(110, Math.max(28, (w * h) / 11000)));
      while (nodes.length < target) nodes.push(spawn());
      nodes.length = target;
      if (!running) draw();
    };

    const step = () => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 0 && d < 150) {
            const f = (1 - d / 150) * 0.35;
            n.vx += (dx / d) * f;
            n.vy += (dy / d) * f;
          }
        }
        n.vx += (n.bvx - n.vx) * 0.03;
        n.vy += (n.bvy - n.vy) * 0.03;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }

      if (packets.length < 9 && Math.random() < 0.06) {
        const a = nodes[(Math.random() * nodes.length) | 0];
        let best = null, bestD = LINK;
        for (const b of nodes) {
          if (b === a) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < bestD && Math.random() < 0.6) { best = b; bestD = d; }
        }
        if (best) packets.push({ a, b: best, t: 0, speed: 0.008 + Math.random() * 0.01 });
      }
      packets = packets.filter((p) => (p.t += p.speed) < 1 && Math.hypot(p.a.x - p.b.x, p.a.y - p.b.y) < LINK * 1.25);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
          const d = Math.hypot(dx, dy);
          if (d >= LINK) continue;
          ctx.strokeStyle = `rgba(${a.c},${((1 - d / LINK) * 0.28).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      if (pointer.active) {
        ctx.lineWidth = 0.8;
        for (const n of nodes) {
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (d >= 190) continue;
          ctx.strokeStyle = `rgba(226,198,107,${((1 - d / 190) * 0.45).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(n.x, n.y); ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.c},.85)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }

      for (const p of packets) {
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.fillStyle = `rgba(${p.a.c},${(0.18 * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${(0.95 * fade).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
    };

    const loop = () => {
      if (!canvas.isConnected) return stop();
      step(); draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce.matches || !visible || document.hidden) return;
      running = true; raf = requestAnimationFrame(loop);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    if (finePointer.matches) {
      hero.addEventListener("pointermove", onMove);
      hero.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();

    onCleanup(() => {
      stop(); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    });
  }

  // ------------------------------------------------------------------------
  // Escenas WebGL a pantalla completa (hero y banners de página)
  // Presupuesto: resolución interna reducida, calidad adaptativa según el
  // tiempo de fotograma, 30 fps en táctiles y pausa fuera de pantalla.
  // ------------------------------------------------------------------------
  function mountSurface(host, canvas) {
    const { Renderer } = window.MCICShaders || {};
    if (!Renderer) return;
    let renderer;
    try {
      renderer = new Renderer(canvas);
    } catch (_) {
      host.classList.add("no-gl");
      return;
    }

    const scene = canvas.dataset.scene || host.dataset.scene;
    const c1 = canvas.dataset.c1 || host.dataset.c1;
    const c2 = canvas.dataset.c2 || host.dataset.c2;
    const coarse = !finePointer.matches;
    const minInterval = coarse ? 1000 / 30 : 0;
    const budget = Math.max(24, minInterval * 1.35);
    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const offset = 10 + Math.random() * 20;
    let scale = coarse ? 0.4 : 0.6;
    let raf = 0, running = false, visible = true, failed = false;
    let t0 = performance.now(), last = 0, frames = 0, acc = 0;

    const render = (time) => {
      if (failed) return;
      try {
        renderer.draw(scene, { time, mouse: [mouse.x, mouse.y], c1, c2 });
        host.classList.add("is-live");
      } catch (err) {
        failed = true;
        console.warn(err);
        host.classList.add("no-gl");
        stop();
      }
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(r.width * dpr * scale, r.height * dpr * scale);
      if (!running) render(offset);
    };
    const loop = (now) => {
      if (!canvas.isConnected) return stop();
      raf = requestAnimationFrame(loop);
      const dt = now - last;
      if (dt < minInterval) return;
      last = now;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      render(offset + (now - t0) / 1000);
      if (dt < 250) {
        acc += dt;
        if (++frames === 45) {
          if (acc / frames > budget && scale > 0.26) { scale *= 0.8; resize(); }
          frames = 0; acc = 0;
        }
      }
    };
    const start = () => {
      if (running || failed || reduce.matches || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    function stop() { running = false; cancelAnimationFrame(raf); }

    const onMove = (e) => {
      const r = host.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { mouse.tx = 0.5; mouse.ty = 0.5; };
    const onVisibility = () => (document.hidden ? stop() : start());

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? start() : stop();
    });
    io.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    start();

    onCleanup(() => {
      stop(); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.dispose();
    });
  }

  function initSurfaces(root) {
    const hero = root.querySelector(".mc-hero__shader");
    if (hero) mountSurface(hero.closest(".mc-hero"), hero);
    root.querySelectorAll(".mc-banner").forEach((banner) => {
      const canvas = banner.querySelector("canvas");
      if (canvas) mountSurface(banner, canvas);
    });
  }

  // ------------------------------------------------------------------------
  // Arte de las tarjetas: un solo contexto WebGL fuera de pantalla pinta cada
  // tarjeta en su propio canvas 2D. En reposo es un fotograma estático; sólo
  // la tarjeta bajo el puntero se anima.
  // ------------------------------------------------------------------------
  function initCardArt(root) {
    const arts = [...root.querySelectorAll(".mc-card__art")];
    const { Renderer } = window.MCICShaders || {};
    if (!arts.length || !Renderer) return;

    const offscreen = document.createElement("canvas");
    let renderer;
    try {
      renderer = new Renderer(offscreen, { preserve: true });
    } catch (_) {
      return;
    }

    const state = new Map(arts.map((art, i) => [art, { t: 6 + i * 3.7, mouse: [0.5, 0.5], tm: [0.5, 0.5] }]));
    let active = null, raf = 0, lastNow = 0;

    const paint = (art) => {
      const canvas = art.querySelector("canvas");
      const rect = art.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.75;
      const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      const s = state.get(art);
      try {
        renderer.setSize(w, h);
        renderer.draw(art.dataset.scene, { time: s.t, mouse: s.mouse, c1: art.dataset.c1, c2: art.dataset.c2 });
        canvas.getContext("2d").drawImage(offscreen, 0, 0, w, h);
        art.classList.add("is-painted");
      } catch (err) {
        console.warn(err);
      }
    };

    const loop = (now) => {
      if (!active || !active.isConnected) return;
      raf = requestAnimationFrame(loop);
      const s = state.get(active);
      s.t += Math.min(now - lastNow, 50) / 1000;
      lastNow = now;
      s.mouse[0] += (s.tm[0] - s.mouse[0]) * 0.08;
      s.mouse[1] += (s.tm[1] - s.mouse[1]) * 0.08;
      paint(active);
    };

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        paint(entry.target);
        io.unobserve(entry.target);
      }
    }, { rootMargin: "200px 0px" });
    arts.forEach((art) => io.observe(art));

    if (!reduce.matches) {
      arts.forEach((art) => {
        const card = art.closest(".mc-card") || art;
        card.addEventListener("pointerenter", () => {
          active = art;
          lastNow = performance.now();
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(loop);
        });
        card.addEventListener("pointermove", (e) => {
          const r = art.getBoundingClientRect();
          state.get(art).tm = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
        });
        card.addEventListener("pointerleave", () => {
          if (active === art) { active = null; cancelAnimationFrame(raf); }
          state.get(art).tm = [0.5, 0.5];
        });
      });
    }

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => arts.forEach((art) => art.classList.contains("is-painted") && paint(art)), 150);
    });
    const grid = arts[0].closest("[data-filter-target]");
    if (grid) ro.observe(grid);

    onCleanup(() => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); clearTimeout(resizeTimer);
      renderer.dispose();
    });
  }

  // ------------------------------------------------------------------------
  // Barra de progreso de lectura (respaldo sin scroll-driven animations)
  // ------------------------------------------------------------------------
  function initScrollProgress() {
    if (window.CSS && CSS.supports("animation-timeline: scroll()")) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const bar = document.querySelector(".mc-scroll-progress");
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--mc-scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ------------------------------------------------------------------------
  function init() {
    cleanups.forEach((fn) => fn());
    cleanups = [];
    const root = document;
    initReveal(root);
    initCounters(root);
    initFilter(root);
    initPointer(root);
    initNetwork(root);
    initSurfaces(root);
    initCardArt(root);
  }

  initScrollProgress();
  reduce.addEventListener("change", () => {
    document.documentElement.classList.toggle("js-motion", !reduce.matches);
    init();
  });

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
