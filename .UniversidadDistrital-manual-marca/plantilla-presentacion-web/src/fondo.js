// Fondo del lienzo (detrás de los marcos). Es un «gancho» opcional: main.js solo necesita esta interfaz
//
//   const fondo = iniciarFondo(canvas, caja);   // caja = { x0, x1, y0, y1 } que encierra todos los marcos
//   fondo.camara({ x, y, z, r });               // se llama en cada cuadro mientras la cámara se mueve
//   fondo.tema(oscuro);                         // true con el tema oscuro, false con el claro
//
// Un proyecto puede reemplazar este archivo por su propio fondo (un mapa, una red, datos en movimiento...)
// siempre que exporte la misma función. Ver la sección «Fondo» del README.
//
// Implementación por defecto: una retícula muy tenue de cruces en plata, fija al lienzo (se acerca y se aleja con la
// cámara, así que acompaña los vuelos), y unas pocas marcas en los colores heráldicos que recorren la retícula
// despacio. Se pinta en un solo canvas 2D, a 30 fps como máximo; se detiene con la pestaña oculta y queda quieto si el
// sistema pide menos movimiento (prefers-reduced-motion). Para un fondo estático: iniciarFondo(canvas, caja, { animado: false }).

const HERALDICOS = ["#ED3237", "#1291C0", "#00A859", "#B49739"]; // gules, azur, sinople, oro
const PASO = 150;      // separación de la retícula en unidades del lienzo (un marco mide 1600 × 900)
const MARCAS = 36;     // cuántas marcas se mueven
const VELOCIDAD = 60;  // unidades del lienzo por segundo

export function iniciarFondo(canvas, caja, { animado = true } = {}) {
  const cx = canvas.getContext("2d");
  const quieto = !animado || matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Margen alrededor de los marcos para que la vista general también tenga fondo.
  const M = 1200;
  const X0 = Math.floor((caja.x0 - M) / PASO) * PASO, X1 = Math.ceil((caja.x1 + M) / PASO) * PASO;
  const Y0 = Math.floor((caja.y0 - M) / PASO) * PASO, Y1 = Math.ceil((caja.y1 + M) / PASO) * PASO;

  let cam = { x: (X0 + X1) / 2, y: (Y0 + Y1) / 2, z: 0.1, r: 0 }, oscuro = false, dpr = 1;

  // Cada marca va por una línea de la retícula (horizontal o vertical) y da la vuelta al llegar al borde.
  const azar = (a, b) => a + Math.random() * (b - a);
  const marcas = Array.from({ length: MARCAS }, (_, i) => {
    const h = i % 2 === 0;
    return {
      h,
      fija: h ? Y0 + Math.round(azar(0, (Y1 - Y0) / PASO)) * PASO : X0 + Math.round(azar(0, (X1 - X0) / PASO)) * PASO,
      pos: h ? azar(X0, X1) : azar(Y0, Y1),
      v: VELOCIDAD * azar(0.5, 1.2) * (Math.random() < 0.5 ? -1 : 1),
      c: HERALDICOS[i % HERALDICOS.length],
    };
  });

  function tamano() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    pintar();
  }

  // Misma transformación que #world en main.js: translate(centro) scale(z) rotate(-r) translate(-x, -y).
  function matriz() {
    const th = (-cam.r * Math.PI) / 180, z = cam.z * dpr;
    const a = z * Math.cos(th), b = z * Math.sin(th), c = -b, d = a;
    const ox = (innerWidth / 2) * dpr, oy = (innerHeight / 2) * dpr;
    return [a, b, c, d, ox - (a * cam.x + c * cam.y), oy - (b * cam.x + d * cam.y)];
  }

  function pintar() {
    const W = canvas.width, H = canvas.height, m = matriz();
    cx.setTransform(1, 0, 0, 1, 0, 0);
    cx.clearRect(0, 0, W, H);
    const z = cam.z * dpr;
    // Con poco zoom la retícula se aclara: solo una de cada 2, 4, 8... líneas, para que nunca quede más tupida de ~28 px.
    let paso = PASO;
    while (paso * z < 28 * dpr) paso *= 2;
    const brazo = 3 * dpr;
    cx.strokeStyle = oscuro ? "rgba(228,226,226,0.16)" : "rgba(55,52,53,0.13)";
    cx.lineWidth = 1 * dpr;
    cx.beginPath();
    for (let x = X0; x <= X1; x += paso) {
      for (let y = Y0; y <= Y1; y += paso) {
        const X = m[0] * x + m[2] * y + m[4], Y = m[1] * x + m[3] * y + m[5];
        if (X < -5 || Y < -5 || X > W + 5 || Y > H + 5) continue;
        cx.moveTo(X - brazo, Y); cx.lineTo(X + brazo, Y);
        cx.moveTo(X, Y - brazo); cx.lineTo(X, Y + brazo);
      }
    }
    cx.stroke();
    // Marcas: tamaño fijo en pantalla, con una estela corta en la dirección del movimiento.
    const largo = Math.max(10, Math.min(26, PASO * 0.35 * z / dpr)) * dpr;
    cx.lineWidth = 2.2 * dpr;
    cx.lineCap = "round";
    cx.globalAlpha = oscuro ? 0.5 : 0.38;
    for (const k of marcas) {
      const x = k.h ? k.pos : k.fija, y = k.h ? k.fija : k.pos;
      const X = m[0] * x + m[2] * y + m[4], Y = m[1] * x + m[3] * y + m[5];
      if (X < -30 || Y < -30 || X > W + 30 || Y > H + 30) continue;
      const s = Math.sign(k.v);
      const dx = k.h ? (m[0] * s) : (m[2] * s), dy = k.h ? (m[1] * s) : (m[3] * s);
      const n = Math.hypot(dx, dy) || 1;
      cx.strokeStyle = k.c;
      cx.beginPath();
      cx.moveTo(X - (dx / n) * largo, Y - (dy / n) * largo);
      cx.lineTo(X, Y);
      cx.stroke();
    }
    cx.globalAlpha = 1;
  }

  let previo = performance.now(), ultimo = 0, raf = 0;
  function cuadro(ahora) {
    raf = requestAnimationFrame(cuadro);
    if (ahora - ultimo < 33) return;
    const dt = Math.min(0.1, (ahora - previo) / 1000);
    previo = ultimo = ahora;
    for (const k of marcas) {
      k.pos += k.v * dt;
      const [a, b] = k.h ? [X0, X1] : [Y0, Y1];
      if (k.pos < a || k.pos > b) { k.v = -k.v; k.pos = Math.max(a, Math.min(b, k.pos)); }
    }
    pintar();
  }

  addEventListener("resize", tamano);
  tamano();
  if (!quieto) {
    raf = requestAnimationFrame(cuadro);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(raf);
      previo = performance.now();
      if (!document.hidden) raf = requestAnimationFrame(cuadro);
    });
  }

  return {
    camara(c) { cam = { ...c }; pintar(); },
    tema(o) { oscuro = o; pintar(); },
  };
}
