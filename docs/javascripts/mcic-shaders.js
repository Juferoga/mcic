/* ==========================================================================
   MCIC · escenas generativas en WebGL
   Cada asignatura tiene su escena (ver `tema` en extra.mcic de mkdocs.yml).
   Todas comparten la cabecera GLSL (ruido, fbm) y un triángulo a pantalla
   completa; cada una sólo define `vec3 scene(vec2 uv, vec2 p, float t)`.
     uv: coordenadas 0..1      p: centradas y con aspecto corregido
     u_mouse: puntero 0..1     u_c1/u_c2: colores de la escena
   ========================================================================== */
(() => {
  "use strict";

  const HEADER = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_bg;
varying vec2 v_uv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p) { float n = hash(p); return vec2(n, hash(p + n)); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
vec2 mouseP() { return (u_mouse - 0.5) * vec2(u_res.x / u_res.y, 1.0); }
`;

  const MAIN = `
void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec3 col = scene(v_uv, p, u_time);
  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

  const SCENES = {
    /* Aurora de dominio deformado (iq): portada, perfil y Semestre II */
    aurora: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 m = mouseP() * 0.35;
  vec2 s = p * 1.5;
  vec2 q = vec2(fbm(s + vec2(0.0, t * 0.05)), fbm(s + vec2(5.2, 1.3) - t * 0.04));
  vec2 r = vec2(fbm(s + 3.0 * q + vec2(1.7, 9.2) + t * 0.06 + m),
                fbm(s + 3.0 * q + vec2(8.3, 2.8) - t * 0.05));
  float f = fbm(s + 3.0 * r);
  vec3 col = u_bg;
  col = mix(col, u_c1 * 0.85, smoothstep(0.35, 0.95, f) * 0.9);
  col = mix(col, u_c2, clamp(length(q) * f - 0.25, 0.0, 1.0) * 0.55);
  col += u_c1 * pow(1.0 - abs(sin(f * 16.0 - t * 0.35)), 14.0) * 0.18 * f;
  col = mix(u_bg, col, 0.25 + 0.75 * smoothstep(-0.1, 0.85, uv.x));
  return col;
}`,

    /* Conjunto de Julia animado; el puntero mueve el parámetro c */
    julia: `
vec3 scene(vec2 uv, vec2 p, float t) {
  float a = 2.55 + 0.22 * sin(t * 0.13) + (u_mouse.x - 0.5) * 0.5;
  vec2 c = 0.7885 * vec2(cos(a), sin(a)) + vec2(0.0, (u_mouse.y - 0.5) * 0.08);
  float ca = cos(t * 0.03), sa = sin(t * 0.03);
  vec2 z = mat2(ca, -sa, sa, ca) * p * 1.45;
  float n = 0.0, m2 = 0.0;
  for (int i = 0; i < 110; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    m2 = dot(z, z);
    if (m2 > 256.0) break;
    n += 1.0;
  }
  if (n > 108.0) return u_bg * 0.55 + u_c2 * 0.06;
  float k = clamp((n - log2(log2(m2)) + 4.0) / 110.0, 0.0, 1.0);
  vec3 col = u_bg;
  col += u_c1 * pow(k, 0.45) * 1.05;
  col += u_c2 * (0.5 + 0.5 * sin(k * 40.0 - t * 0.8)) * pow(k, 0.8) * 0.45;
  return col;
}`,

    /* Teselado de Truchet: patrones que fluyen (Informática) */
    truchet: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 g = p * 7.0 + vec2(t * 0.25, t * 0.08);
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  if (hash(id) < 0.5) f.x = -f.x;
  float d = min(abs(length(f - 0.5) - 0.5), abs(length(f + 0.5) - 0.5));
  float line = smoothstep(0.07, 0.02, d);
  float glow = 0.012 / (d + 0.02);
  float pulse = 0.5 + 0.5 * sin(id.x * 0.7 + id.y * 0.45 - t * 1.8);
  float near = smoothstep(0.55, 0.0, length(p - mouseP()));
  vec3 col = u_bg;
  col += u_c2 * glow * 0.12;
  col += mix(u_c2 * 0.5, u_c1, pulse) * line * (0.35 + 0.65 * pulse + near);
  return col;
}`,

    /* Interferencia de fuentes puntuales (ondas): Seminario y Semestre I */
    ondas: `
vec3 scene(vec2 uv, vec2 p, float t) {
  float asp = u_res.x / u_res.y;
  float w = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 s = vec2(cos(t * 0.17 + fi * 2.1) * asp * 0.38, sin(t * 0.23 + fi * 1.7) * 0.32);
    w += sin(length(p - s) * 30.0 - t * 2.4 + fi);
  }
  w += sin(length(p - mouseP()) * 30.0 - t * 2.4) * 0.9;
  w /= 3.9;
  vec3 col = u_bg;
  col += u_c1 * smoothstep(0.45, 1.0, w) * 0.9;
  col += u_c2 * smoothstep(0.2, 0.9, -w) * 0.22;
  col += u_c1 * pow(1.0 - abs(w), 22.0) * 0.25;
  return col;
}`,

    /* Teselación de Voronoi con centroides en movimiento (Analítica de Datos) */
    voronoi: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 g = p * 4.2;
  vec2 id = floor(g), f = fract(g);
  float d1 = 8.0, d2 = 8.0;
  vec2 best = vec2(0.0);
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 r = hash2(id + o);
    r = 0.5 + 0.42 * sin(t * 0.55 + 6.2831 * r);
    vec2 diff = o + r - f;
    float d = dot(diff, diff);
    if (d < d1) { d2 = d1; d1 = d; best = id + o; }
    else if (d < d2) { d2 = d; }
  }
  float edge = sqrt(d2) - sqrt(d1);
  float h = hash(best);
  float near = smoothstep(0.6, 0.0, length(p - mouseP()));
  vec3 col = u_bg + mix(u_c2, u_c1, h) * (0.06 + 0.2 * h + 0.25 * near);
  col += u_c1 * smoothstep(0.07, 0.0, edge) * 0.75;
  col += vec3(1.0) * smoothstep(0.08, 0.02, sqrt(d1)) * 0.85;
  return col;
}`,

    /* Filamentos neuronales: crestas de fbm deformado (Inteligencia Computacional) */
    neural: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 q = p * 2.0;
  q += 0.55 * vec2(fbm(q + t * 0.08), fbm(q - t * 0.07 + 3.1));
  q += (mouseP() - p) * 0.25 * smoothstep(0.8, 0.0, length(p - mouseP()));
  float f = fbm(q * 1.4 + vec2(t * 0.05, 0.0));
  float fil = pow(1.0 - abs(2.0 * f - 1.0), 12.0);
  float f2 = fbm(q * 2.8 - t * 0.06 + 7.0);
  float fil2 = pow(1.0 - abs(2.0 * f2 - 1.0), 16.0);
  float spark = pow(noise(q * 9.0 + t * 0.9), 18.0) * 4.0;
  vec3 col = u_bg;
  col += u_c1 * fil * 1.15;
  col += u_c2 * fil2 * 0.65;
  col += vec3(1.0) * spark * fil;
  return col;
}`,

    /* Frente de onda sobre una malla de hilos SIMD (Computación Paralela) */
    wavefront: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 g = p * 16.0;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  float h = hash(id);
  float wave = fract(id.x * 0.035 + id.y * 0.018 - t * 0.22 + h * 0.06);
  float on = smoothstep(0.0, 0.04, wave) * smoothstep(0.32, 0.04, wave);
  float sq = smoothstep(0.43, 0.38, max(abs(f.x), abs(f.y)));
  float near = smoothstep(0.35, 0.0, length(p - mouseP()));
  vec3 col = u_bg;
  col += mix(u_c2 * 0.35, u_c1, on) * sq * (0.07 + 0.95 * on * (0.4 + 0.6 * h) + near * 0.6);
  return col;
}`,

    /* Curvas de nivel de un paisaje de métricas (Inteligencia de Negocios) */
    contornos: `
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 s = p * 1.7 + vec2(t * 0.035, t * 0.015);
  float h = fbm(s) + 0.25 * fbm(s * 2.6 - t * 0.03);
  h += 0.18 * smoothstep(0.5, 0.0, length(p - mouseP()));
  float k = h * 14.0;
  float d = 0.5 - abs(fract(k) - 0.5);
  float major = 0.5 - abs(fract(k / 5.0) - 0.5);
  vec3 col = u_bg + mix(u_c2, u_c1, h) * smoothstep(0.55, 1.0, h) * 0.18;
  col += mix(u_c2, u_c1, h) * smoothstep(0.09, 0.0, d) * 0.55;
  col += u_c1 * smoothstep(0.025, 0.0, major) * 0.7;
  return col;
}`,

    /* Retícula hexagonal con pulsos de cifrado (Trabajo de Grado I) */
    hex: `
float hexDist(vec2 q) { q = abs(q); return max(dot(q, normalize(vec2(1.0, 1.73))), q.x); }
vec3 scene(vec2 uv, vec2 p, float t) {
  vec2 g = p * 7.0;
  vec2 r = vec2(1.0, 1.73), hh = r * 0.5;
  vec2 a = mod(g, r) - hh, b = mod(g - hh, r) - hh;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  vec2 id = g - gv;
  float hd = hexDist(gv);
  float edge = smoothstep(0.05, 0.0, abs(hd - 0.47));
  float pulse = sin(length(id) * 0.55 - t * 1.7 + hash(id) * 5.0);
  float lit = smoothstep(0.82, 1.0, pulse);
  float scan = smoothstep(0.08, 0.0, abs(fract(uv.x * 0.5 - t * 0.06) - 0.5) - 0.42);
  float near = smoothstep(0.45, 0.0, length(p - mouseP()));
  vec3 col = u_bg;
  col += u_c1 * lit * smoothstep(0.47, 0.2, hd) * 0.35;
  col += mix(u_c1 * 0.35, u_c1, lit + near) * edge * (0.45 + 0.55 * lit + near);
  col += u_c2 * scan * edge * 0.6;
  return col;
}`,
  };

  const VERT = `attribute vec2 a; varying vec2 v_uv; void main() { v_uv = a * 0.5 + 0.5; gl_Position = vec4(a, 0.0, 1.0); }`;

  const hexToRgb = (hex) => {
    const n = parseInt(String(hex).replace("#", ""), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  };

  /** Renderizador mínimo: un contexto WebGL1, programas cacheados por escena. */
  class Renderer {
    constructor(canvas, { preserve = false } = {}) {
      const gl = canvas.getContext("webgl", {
        alpha: false, antialias: false, depth: false, stencil: false,
        premultipliedAlpha: false, preserveDrawingBuffer: preserve, powerPreference: "low-power",
      });
      if (!gl) throw new Error("WebGL no disponible");
      this.gl = gl;
      this.canvas = canvas;
      this.programs = new Map();
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    }

    program(name) {
      if (this.programs.has(name)) return this.programs.get(name);
      const gl = this.gl;
      const body = SCENES[name] || SCENES.aurora;
      const compile = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`[mcic] ${name}: ${gl.getShaderInfoLog(s)}`);
        return s;
      };
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, HEADER + body + MAIN));
      gl.bindAttribLocation(prog, 0, "a");
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(`[mcic] ${name}: ${gl.getProgramInfoLog(prog)}`);
      const u = {};
      for (const k of ["u_res", "u_time", "u_mouse", "u_c1", "u_c2", "u_bg"]) u[k] = gl.getUniformLocation(prog, k);
      const entry = { prog, u };
      this.programs.set(name, entry);
      return entry;
    }

    setSize(w, h) {
      w = Math.max(1, Math.round(w)); h = Math.max(1, Math.round(h));
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w; this.canvas.height = h;
      }
      this.gl.viewport(0, 0, w, h);
    }

    draw(name, { time = 0, mouse = [0.5, 0.5], c1, c2, bg = "#0a1a27" }) {
      const gl = this.gl;
      const { prog, u } = this.program(name);
      gl.useProgram(prog);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(u.u_res, this.canvas.width, this.canvas.height);
      gl.uniform1f(u.u_time, time);
      gl.uniform2f(u.u_mouse, mouse[0], mouse[1]);
      gl.uniform3fv(u.u_c1, hexToRgb(c1));
      gl.uniform3fv(u.u_c2, hexToRgb(c2));
      gl.uniform3fv(u.u_bg, hexToRgb(bg));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    dispose() {
      const ext = this.gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    }
  }

  window.MCICShaders = { Renderer, scenes: Object.keys(SCENES) };
})();
