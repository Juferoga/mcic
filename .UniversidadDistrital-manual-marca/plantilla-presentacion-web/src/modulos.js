// Módulos de marco: comportamiento propio de un marco (gráficos animados, escenas, demos).
// Un marco lo pide con data-modulo="nombre" y main.js llama, si existen:
//
//   montar(el)        una sola vez al arrancar (preparar el SVG, crear un canvas...)
//   entrar(el, paso)  cuando la cámara llega al marco
//   paso(el, n)       en cada paso del marco (n = 0, 1, 2...)
//   salir(el)         cuando la cámara se va a otro marco
//   pasos             número de pasos extra que aporta el módulo (se suma a los data-paso del HTML)
//
// Los gráficos y escenas 3D de un proyecto real van aquí o en archivos aparte que se registran en este objeto
// (en el proyecto de origen: src/graficos.js y src/tres.js). Ejemplo mínimo: barras que crecen al entrar y se
// resaltan una por paso.
import gsap from "gsap";

const reducido = matchMedia("(prefers-reduced-motion: reduce)").matches;

const barras = {
  // Guarda la altura final de cada barra: al entrar crecen desde la base (atributos y/height, sin transformar el SVG).
  montar(el) {
    for (const r of el.querySelectorAll(".barra rect")) {
      r.dataset.y = r.getAttribute("y");
      r.dataset.h = r.getAttribute("height");
    }
  },
  entrar(el, paso) {
    const rs = [...el.querySelectorAll(".barra rect")];
    for (const r of rs) {
      const base = +r.dataset.y + +r.dataset.h;
      gsap.fromTo(r, { attr: { y: base, height: 0 } }, { attr: { y: +r.dataset.y, height: +r.dataset.h }, duration: reducido ? 0 : 0.9, ease: "power3.out", delay: reducido ? 0 : 0.5 + rs.indexOf(r) * 0.08, overwrite: true });
    }
    this.paso(el, paso);
  },
  // Paso n > 0: resalta la barra n (data-orden="n"); en el paso 0 todas quedan en su color.
  paso(el, n) {
    for (const g of el.querySelectorAll(".barra")) g.classList.toggle("apagada", n > 0 && +g.dataset.orden !== n);
  },
  salir() {},
};

export const modulos = { barras };
