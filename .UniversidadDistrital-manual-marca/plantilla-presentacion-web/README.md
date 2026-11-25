# Plantilla de presentación web (UD)

Presentación web tipo Prezi con la imagen institucional de la Universidad Distrital Francisco José de Caldas.
Cada diapositiva («marco») es una lámina de la plantilla oficial (los mismos fondos de portada, contenido y
cierre de `../plantillas-latex/assets/`) puesta sobre un lienzo grande; una cámara vuela de un marco al
siguiente, los marcos se agrupan en capítulos y el contenido aparece paso a paso.

Hecha con [Vite](https://vite.dev) y [GSAP](https://gsap.com). No usa ningún framework: el contenido se escribe
en `index.html`.

## Arranque

```bash
npm install && npm run dev      # http://localhost:5173
npm run build                   # genera dist/ (base relativa: sirve en cualquier ruta, p. ej. GitHub Pages)
npm run preview                 # sirve dist/ para revisarlo
```

Para empezar una presentación nueva se copia la carpeta completa (sin `node_modules/` ni `dist/`) al proyecto.

| Archivo | Para qué |
|---|---|
| `index.html` | El contenido: un `<section class="frame">` por marco |
| `guion.html` | Guion del presentador (teleprompter sincronizado) |
| `src/main.js` | Motor: cámara, pasos, capítulos, HUD, teclado, contadores, sincronía con el guion |
| `src/style.css` | Sistema visual UD: paleta, tipografía, portada, cierre, tarjetas, HUD |
| `src/fondo.js` | Fondo del lienzo (opcional, reemplazable) |
| `src/modulos.js` | Comportamiento propio de un marco (gráficos animados, escenas) |
| `src/datos.json` | Cifras que se muestran como contadores |
| `src/img/ud/` | Fondos oficiales: `portada_base.jpg`, `fondo_contenido.jpg`, `cierre_base.jpg` |
| `public/img/ud/escudo_linea.svg` | Escudo en versión línea (barra superior) |
| `public/img/LogoMCIC.png` | Logo del programa en la portada (opcional) |

## Teclado

| Tecla | Acción |
|---|---|
| `→` `↓` `espacio` `Enter` `AvPág`, rueda o deslizar | Siguiente paso (o siguiente marco) |
| `←` `↑` `RePág` `Retroceso` | Marco anterior |
| `O` | Vista general (`Esc` o `O` para volver); clic en un marco para ir |
| `1`…`9` | Primer marco del capítulo n |
| `Inicio` / `Fin` | Primer / último marco |
| `N` | Notas del presentador |
| `T` | Tema claro / oscuro (solo cambia el lienzo y la interfaz; los marcos siempre son claros) |
| `F` | Pantalla completa |
| `G` | Abre el guion en otra ventana |
| `?` | Ayuda |

La URL guarda el marco actual (`#cifras`), así que recargar no devuelve al inicio. Desde la consola:
`presentacion.ir("grafico", 2)` va al marco `grafico` en el paso 2.

Con `prefers-reduced-motion` activo en el sistema, los vuelos y las entradas son instantáneos, los contadores
muestran el valor final y el fondo queda quieto.

## Agregar un marco

```html
<section class="frame" id="resultados" data-x="7800" data-y="1600" data-cap="2" data-titulo="Resultados">
  <div class="frame-in">
    <header class="titulo-marco"><h2>Título del marco</h2><p class="kicker">Capítulo 2 · Desarrollo</p></header>
    <p class="lead">Texto…</p>
  </div>
  <aside class="nota">Notas del presentador (tecla N).</aside>
</section>
```

| Atributo | Qué hace |
|---|---|
| `id` | Nombre del marco: va en la URL y es la clave para el guion |
| `data-x`, `data-y` | Centro del marco en el lienzo. Un marco mide 1600 × 900; con 1950 de separación horizontal y 1600–2000 vertical quedan bien espaciados |
| `data-cap` | Índice del capítulo en `data-capitulos` (0 = apertura) |
| `data-titulo` | Título corto: barra superior, paradas de la barra inferior y portada del capítulo |
| `data-s` | Escala (opcional, 1 por defecto): un marco más grande o más pequeño en el lienzo |
| `data-r` | Rotación en grados (opcional). **No** usar en portada ni cierre: rotaría el escudo |
| `data-modulo` | Nombre de un módulo de `src/modulos.js` (opcional) |

El orden del recorrido es el orden de las `<section>` en el HTML, no su posición. Un filete rojo une cada marco
con el siguiente.

Diseños disponibles (todos están en el ejemplo):

- **Portada** `class="frame portada"`: título en `.titulo-grande` (partir en dos o tres `<span class="linea">`),
  `.kicker`, `.regla`, `.autores` (cada nombre con su código en `<small>`), `.programa`, `.docente`, `.anio`. El
  panel blanco deja unos 530 × 420 px para el texto.
- **Agenda**: `.paradas` con un `.parada-agenda` por capítulo (`style="--c:var(--ud-azur)"`).
- **Portada de capítulo** `class="frame capitulo"`: `.cap-num`, `.distintivo`, `.cap-titulo`, `.lead` y
  opcionalmente `.cifras`. El motor agrega abajo las cajas «En este capítulo» con los marcos que siguen.
- **Contenido**: `.lead`, `ul.mini-conceptos` (viñetas ▶ rojas), `.tarjeta` (`azul`, `rojo`, `verde`, `oro`),
  `.concepto` (definición con filete rojo), `.dos-col`, `.tres-col`, `pre.codigo`.
- **Cifras grandes**: `.cifras.grandes` con contadores (ver abajo).
- **Dos columnas**: `.frame-in.dividido` con un `.texto` a la izquierda y un `figure.grafico` (SVG) o un
  `.lienzo` (canvas) a la derecha.
- **Paso a paso**: `.proceso` con una caja por paso y flechas rojas entre ellas.
- **Cierre** `class="frame cierre"`: `.cierre-caja` con «Gracias / Preguntas y discusión» y `.cierre-fuentes`
  para créditos.

## Pasos

Cualquier elemento con `data-paso="n"` está oculto hasta el paso `n` del marco. `→` avanza un paso; cuando no
quedan pasos, va al marco siguiente. Varios elementos con el mismo número aparecen juntos, uno tras otro. Al
volver con `←` el marco anterior queda en su último paso. La barra superior muestra `Título · 2/4`.

## Capítulos

Los nombres van en `#world`:

```html
<div id="world" data-capitulos="Inicio, Contexto, Desarrollo, Cierre">
```

El primero es la apertura y el último el cierre: no llevan zona ni número. Para cada capítulo intermedio el
motor dibuja en el lienzo una zona con el rótulo «Capítulo n / Nombre» y le asigna un color heráldico en orden
(azur, oro, sinople, gules; se cambia en `COLOR_CAP` de `src/main.js`). Ese color se usa en el cuadrito de la
barra superior y en el distintivo de la portada del capítulo (`var(--linea)`). En la barra inferior, una sola
línea continua tiene una parada por marco y una marca más alta donde empieza cada capítulo.

## Contadores

```html
<b data-dato="muestra.registros">1.250.000</b>
<b data-dato="muestra.exactitud" data-fmt="pct1">93,4 %</b>
```

`data-dato` es una ruta dentro de `src/datos.json`; al llegar al marco el número sube de 0 a su valor. Sin
`data-fmt` se muestra entero con punto de miles; con `data-fmt`: `pct0`, `pct1`, `dec1`, `dec2`, `dec3` (coma
decimal). El texto escrito en el HTML es el respaldo si la ruta no existe (queda un aviso en la consola).
Conviene que un script del proyecto genere `datos.json` a partir de los resultados reales.

## Guion del presentador

`guion.html` (tecla `G`) es un teleprompter para otra pantalla: lista de marcos, reloj con meta por marco,
tamaño de letra ajustable, cifras de referencia y preguntas preparadas. Se sincroniza solo con la presentación
por `BroadcastChannel` (mismo navegador y mismo sitio): al avanzar en la presentación, el guion resalta el bloque
que toca.

El contenido está en el arreglo `GUION` dentro de `guion.html`: un objeto por marco con el mismo `id` y **un
bloque por pulsación de `→`**, es decir, tantos bloques como pasos tenga el marco más uno.

## Fondo

El lienzo detrás de los marcos se pinta en `<canvas id="fondo">` con `src/fondo.js`. `main.js` solo usa esta
interfaz:

```js
import { iniciarFondo } from "./fondo.js";
const fondo = iniciarFondo(canvas, caja); // caja = { x0, x1, y0, y1 }: rectángulo que encierra todos los marcos
fondo.camara({ x, y, z, r });             // en cada cuadro mientras la cámara se mueve
fondo.tema(oscuro);                       // al cambiar de tema
```

El fondo por defecto es una retícula de cruces muy tenue, fija al lienzo (acompaña los vuelos) y unas pocas marcas
en los colores heráldicos que la recorren despacio. Para dejarlo quieto: `iniciarFondo(canvas, caja, { animado:
false })`; para quitarlo, borrar el `<canvas id="fondo">` y devolver un objeto con `camara() {}` y `tema() {}`.

Un proyecto puede poner su propio fondo con la misma interfaz. El ejemplo completo es el mapa de Bogotá con los
buses en movimiento del proyecto de origen:
`/Users/juferoga/repos/ud/maestria/mcic/semestre-2/mcic-parallel-computing/4.ProyectoFinal/presentacion/src/ciudad.js`
(dibuja las calles del GTFS en un canvas que solo se repinta cuando la cámara se mueve y los buses en otro a
30 fps; aplica la misma matriz que `#world` para que el mapa se acerque y se aleje con la cámara).

## Módulos de marco

Para gráficos animados o escenas 3D, un marco pide un módulo con `data-modulo="nombre"` y `src/modulos.js` lo
registra. El motor llama, si existen, `montar(el)`, `entrar(el, paso)`, `paso(el, n)` y `salir(el)`, y suma
`pasos` a los `data-paso` del HTML. El ejemplo `barras` hace crecer las barras del SVG al llegar y resalta una por
paso. En el proyecto de origen hay gráficos en SVG (`src/graficos.js`) y escenas con three.js
(`src/tres.js`); three.js no viene en la plantilla: se agrega con `npm install three` solo si hace falta.

Los `.lienzo` (canvas interactivos) no reciben la rueda del ratón ni los gestos táctiles de navegación.

## Reglas de marca

Tomadas de `../design.md` y de la plantilla beamer (`../plantillas-latex/`).

- **Tipografía.** Títulos en **Cambria** bold; texto en **Times New Roman**. Donde no están instaladas, las
  reemplazan Caladea y Tinos (Google Fonts, mismas métricas). **Source Sans 3** solo en los controles de la
  interfaz (HUD, ayuda, notas), para distinguirlos del contenido. Las fuentes de Microsoft no se suben al repositorio.
- **Colores.** Solo la paleta heráldica, definida en `:root` de `src/style.css`: gules `#ED3237`, oro `#B49739`,
  azur `#1291C0`, sinople `#00A859`, plata `#98999A`, sable `#373435`. Para texto dorado sobre blanco se usa
  `--ud-oro-texto` (`#8C7424`), que sí tiene contraste. El rojo es el color de acento (subtítulos, filetes,
  viñetas, avance).
- **Escudo.** Nunca se anima, se rota, se recorta, se deforma ni se le aplican efectos. En la portada y el cierre
  ya viene dentro de la imagen de fondo oficial (por eso esos marcos no llevan `data-r`). En la barra superior va
  la versión línea sobre blanco, siempre a opacidad completa: la interfaz se atenúa durante los vuelos, pero la
  marca queda fuera de ese efecto. El ícono de la pestaña (`public/favicon.svg`) es genérico y no imita el escudo.
- **Fondos.** Los marcos son siempre claros (son láminas de la plantilla); el tema oscuro solo oscurece el lienzo
  alrededor y la interfaz.

## Origen

El motor y el sistema visual salen de la presentación del proyecto final de Computación Paralela 2026
(«Bogotá en movimiento: 14 días de TransMilenio procesados en paralelo con Ray»), de Juan Felipe Rodríguez Galindo
y Carlos Stiven Mora Hoyos, Maestría en Ciencias de la Información y las Comunicaciones. Esta plantilla quita el
contenido del proyecto (mapa de la ciudad, gráficos y escenas 3D, datos) y deja el motor y los diseños de marco
listos para reutilizar.
