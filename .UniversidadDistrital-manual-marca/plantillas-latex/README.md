# Plantillas LaTeX institucionales (UD)

Tema Beamer y estilo de informe con la imagen de la Universidad Distrital: Cambria para títulos,
Times New Roman para el texto, paleta del manual de marca y fondos oficiales de presentación. Las fuentes
se toman de `../fuentes/`, así que no hay que copiarlas a cada proyecto.

| Archivo | Para qué |
|---|---|
| `beamerthemeUD.sty` | Tema de diapositivas: `\usetheme{UD}` |
| `ud-informe.sty` | Estilo de informe: `\usepackage{ud-informe}` |
| `assets/` | Fondos de portada, contenido y cierre; escudo y logo MCIC (`LogoMCIC.pdf`, vectorial, generado desde [`general/marca-mcic`](../../general/marca-mcic/README.md)) |
| `ejemplos/` | Una presentación y un informe mínimos para copiar |
| `revisar_pdf.py` | Revisa que nada se salga de los márgenes ni del panel de la portada |

## Uso

Se compila con [tectonic](https://tectonic-typesetting.github.io) indicando dónde están los `.sty`:

```bash
tectonic -Z search-path=/Users/juferoga/repos/ud/maestria/mcic/.UniversidadDistrital-manual-marca/plantillas-latex mi-presentacion.tex
```

En un Makefile conviene dejarlo como variable:

```make
UD ?= $(HOME)/repos/ud/maestria/mcic/.UniversidadDistrital-manual-marca/plantillas-latex
slides:
	tectonic -Z search-path=$(UD) presentacion.tex
	uv run --no-project --with pymupdf python $(UD)/revisar_pdf.py presentacion.pdf
```

Si el manual se mueve, basta con `\newcommand{\UDmarca}{/nueva/ruta}` antes de `\usetheme{UD}` o
`\usepackage{ud-informe}`. `make ejemplos` compila los ejemplos y `make revisar PDF=...` revisa cualquier
presentación.

### Presentación

```latex
\documentclass[aspectratio=169,10pt]{beamer}
\usepackage[spanish,es-noshorthands]{babel}
\usetheme{UD}
\begin{document}
\UDportada{Título}{Subtítulo}{Autor 1\\Autor 2}{Programa}{Curso o año}
\begin{frame}{Título}{Subtítulo}
  \begin{columns}[T,onlytextwidth]
    \begin{column}{0.48\textwidth}
      \UDCard{white}{UDBorder}{\cardtitle{UDBlue}{Idea}{\small Texto}}
    \end{column}
    ...
  \end{columns}
\end{frame}
\UDcierre{Autor 1\\Autor 2}{Programa}{Curso}
\end{document}
```

### Informe

```latex
\documentclass[11pt,letterpaper]{article}
\usepackage{ud-informe}
\renewcommand{\UDtitulo}{...}      \renewcommand{\UDsubtitulo}{...}
\renewcommand{\UDtipo}{Taller 2}   \renewcommand{\UDasignatura}{...}
\renewcommand{\UDdocente}{...}     \renewcommand{\UDencabezado}{Taller 2 -- Asignatura}
\renewcommand{\UDestudiantes}{Nombre 1 -- código \\ & Nombre 2 -- código}
\begin{document}
\UDportada
...
```

## Errores que ya vienen corregidos (y que no hay que reintroducir)

- **Número de página cortado.** Un `\vspace` dentro del `footline` de Beamer no sube el texto; el número quedaba
  pegado al borde inferior. El tema lo ancla con TikZ a la esquina inferior derecha.
- **Tamaños de letra que no se aplican.** `\fontsize{..}{..}` sin `\selectfont` no cambia el tamaño. Siempre
  `\fontsize{7pt}{8pt}\selectfont`.
- **Tarjetas más anchas que su columna.** `text width=0.96\linewidth` más el margen interno se pasa de la columna.
  `\UDCard` usa `\linewidth-14pt`.
- **Columnas que invaden el margen derecho.** Sin `onlytextwidth`, Beamer suma la separación entre columnas por
  fuera del área de texto. Usar siempre `\begin{columns}[T,onlytextwidth]`.
- **Portada desbordada.** El panel blanco de `portada_base.jpg` deja unos 5,3 × 4,2 cm para el texto; títulos
  largos deben partirse en dos líneas y los códigos ir debajo de cada nombre.
- **Fuentes de Microsoft.** Times New Roman y Cambria no deben subirse a repositorios públicos; por eso las
  plantillas las leen del manual en lugar de copiarlas.
