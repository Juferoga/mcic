# 🎓 MCIC — Maestría en Ciencias de la Información y las Comunicaciones

<p align="center">
	<picture>
		<source media="(prefers-color-scheme: dark)" srcset="general/marca-mcic/svg/mcic-logo-invertido.svg">
		<img src="general/marca-mcic/svg/mcic-logo-color.svg" alt="MCIC · Maestría en Ciencias de la Información y las Comunicaciones" width="600">
	</picture>
</p>

<p align="center">
	<a href="https://github.com/Juferoga"><img src="https://img.shields.io/badge/Autor-Juferoga-0a66c2?style=flat-square" alt="Autor"/></a>
	<img src="https://img.shields.io/badge/Universidad-Distrital_F.J.C.-8a0f2d?style=flat-square" alt="Universidad Distrital"/>
	<img src="https://img.shields.io/badge/Énfasis-Inteligencia_Artificial-6f42c1?style=flat-square" alt="Énfasis IA"/>
	<img src="https://img.shields.io/badge/Modalidad-Investigación-2e74b5?style=flat-square" alt="Investigación"/>
	<img src="https://img.shields.io/badge/Créditos-16%2F44-success?style=flat-square" alt="Créditos"/>
	<img src="https://img.shields.io/badge/Semestre_II-en_curso-orange?style=flat-square" alt="Semestre II en curso"/>
	<a href="https://juferoga.github.io/mcic/"><img src="https://img.shields.io/badge/📖_Documentación-GitHub_Pages-blueviolet?style=flat-square" alt="Docs"/></a>
</p>

Compendio de materiales, trabajos y resultados de la **Maestría en Ciencias de la Información y las Comunicaciones** de la Universidad Distrital Francisco José de Caldas — énfasis en **Inteligencia Artificial**, modalidad **investigación**.

## Estructura
- `semestre-1/` — materiales y submódulos del primer semestre. Ver [semestre-1/README.md](semestre-1/README.md).
- `semestre-2/` — materiales y submódulos del segundo semestre. Ver [semestre-2/README.md](semestre-2/README.md).
- `general/` — herramientas transversales: [`session-recorder`](general/session-recorder/) (submódulo), [`marca-mcic/`](general/marca-mcic/README.md) (kit vectorial del logo) y `templates/`.
- `docs/` + `overrides/` — micrositio en [juferoga.github.io/mcic](https://juferoga.github.io/mcic/) (MkDocs Material con tema propio).
- `.UniversidadDistrital-manual-marca/` — submódulo [ud-manual-marca](https://github.com/Juferoga/ud-manual-marca) ([Storybook](https://juferoga.github.io/ud-manual-marca/)): manual de marca de la UD, guía de imagen digital 2026 con el kit vectorial de la marca U. Distrital y [plantillas LaTeX](.UniversidadDistrital-manual-marca/plantillas-latex/README.md) (informe y presentación, institucional y digital) usadas en las entregas.
- `semestre-3/` — tercer semestre (2027-1): preinscripción y cronograma. Ver [semestre-3/README.md](semestre-3/README.md).
- `tesis/` — trabajo de grado (repositorio privado).

## 📊 Progreso general

```text
████████░░░░░░░░░░░░░░  16 / 44 créditos · 36,4 %
```

| Semestre | Período | Créditos | Progreso | Estado |
|----------|---------|---------:|----------|--------|
| [**Semestre I**](semestre-1/) | 2026-1 | 16/16 | `██████████` 100 % | ✅ Cerrado — promedio **4.73** |
| [**Semestre II**](semestre-2/) | 2026-3 | 0/16 | `░░░░░░░░░░` 0 % | 🚧 En curso — los créditos se acreditan al cierre |
| [**Semestre III**](semestre-3/) | 2027-1 | 0/12 | `░░░░░░░░░░` 0 % | 📝 Preinscripción enviada |

### Plan de estudios (44 créditos)

| Componente | Créditos | Avance |
|------------|---------:|--------|
| Núcleo común (Fundamental I y II) | 8 | ✅ 8/8 |
| Profundización (I, II y III) | 12 | 🔶 4/12 |
| Electivas (I y II) | 8 | ⬜ 0/8 |
| Investigación (Seminario, Trabajo de Grado I y II) | 16 | 🔶 4/16 |

---

## 📚 Semestre I — 2026-1 ✅

| Materia | Docente | Nota | Repositorio |
|---------|---------|:----:|-------------|
| Herramientas Matemáticas para el Manejo de la Información | Hans Igor López Chávez | **4.7** | [`mcic-math-tools-data`](semestre-1/mcic-math-tools-data/) |
| Informática | Álvaro Enrique Ortiz Dávila | **4.6** | [`mcic-computing`](semestre-1/mcic-computing/) |
| Seminario de Investigación | Álvaro Enrique Ortiz Dávila | **5.0** | Anteproyecto → [`mcic-tesis`](https://github.com/Juferoga/mcic-tesis) 🔒 |
| Analítica de Datos | Jorge Enrique Rodríguez Rodríguez | **4.6** | [`mcic-data-analytics`](semestre-1/mcic-data-analytics/) |

Detalle completo en [semestre-1/README.md](semestre-1/README.md).

## 🚧 Semestre II — 2026-3 (en curso)

> Corte: **23 de noviembre de 2026** (semana 16 de clases). Los créditos se acreditan al cierre del semestre.

| Materia | Componente | Avance | Repositorio |
|---------|------------|--------|-------------|
| Inteligencia Computacional | Profundización II | ✅ Talleres 1–6 (Perceptrón/Adaline, MLP, CNN sobre KMNIST, robot difuso, lógica difusa, NAR/NARX sobre PM2.5), Tarea 1 (algoritmo genético) y Trabajo 1 · 🔶 Proyecto final sobre el riesgo de los commits del kernel de Linux: entregables 1–3 enviados, sustentación el 4 de diciembre | [`mcic-computational-intelligence`](semestre-2/mcic-computational-intelligence/) |
| Computación Paralela | Profundización III | ✅ Reto 1: tubería CNN en OpenACC (GPU vs. CPU) · ✅ Taller Dask: brecha digital en Colombia · ✅ Reto 2: pipeline NLP en GPU con CUDA + Numba · 🔶 Proyecto final | [`mcic-parallel-computing`](semestre-2/mcic-parallel-computing/) |
| Inteligencia de Negocios | Electiva I | ✅ Talleres 1 y 2 (NovaRetail 360: limpieza y modelamiento dimensional) · 🔶 Proyecto final con Carlos Mora sobre CredCorp Capital (SQL, estrella, modelo de conversión y Monte Carlo): informe y presentación listos | [`mcic-business-intelligence`](semestre-2/mcic-business-intelligence/) |
| Trabajo de Grado I | Investigación | ✅ Documentos radicados ante la coordinación el 20 de noviembre: carta de viabilidad del grupo ComplexUD, actas firmadas y reporte de nota · 🔶 Nota final: la carga la directora antes del 11 de diciembre | [`mcic-trabajo-grado-1`](semestre-2/mcic-trabajo-grado-1/) 🔒 · técnico en [`mcic-tesis`](https://github.com/Juferoga/mcic-tesis) 🔒 |

Detalle y cronograma de matrícula en [semestre-2/README.md](semestre-2/README.md).

## 🔬 Trabajo de grado

Proyecto de investigación en curso, bajo la dirección de la Dra. Deicy Alvarado Nieto y la codirección de la MSc. Isabel Amaya Barrera, en el grupo de investigación ComplexUD. Su contenido se mantiene en repositorios privados 🔒.

---

## 🗂️ Estructura del repositorio

```text
mcic/
├── semestre-1/                  ✅ 2026-1 · cerrado
│   ├── mcic-math-tools-data/    ⤷ submódulo · Herramientas Matemáticas
│   ├── mcic-computing/          ⤷ submódulo · Informática
│   └── mcic-data-analytics/     ⤷ submódulo · Analítica de Datos
├── semestre-2/                  🚧 2026-3 · en curso
│   ├── mcic-computational-intelligence/  ⤷ submódulo · Inteligencia Computacional
│   ├── mcic-parallel-computing/          ⤷ submódulo · Computación Paralela
│   ├── mcic-business-intelligence/       ⤷ submódulo · Inteligencia de Negocios
│   └── mcic-trabajo-grado-1/             ⤷ submódulo · Trabajo de Grado I
├── semestre-3/                  📝 2027-1 · preinscripción
├── general/
│   ├── session-recorder/        ⤷ submódulo · herramienta de grabación de sesiones
│   ├── marca-mcic/              kit vectorial: logo, wordmark, favicon (SVG · PDF · PNG)
│   └── templates/               plantilla LaTeX de tareas
├── docs/ · overrides/           micrositio (MkDocs Material + tema propio)
├── .UniversidadDistrital-manual-marca/   manual de marca + plantillas LaTeX (submódulo ud-manual-marca)
└── tesis/                       🔜 submódulo mcic-tesis (privado)
```

Cada materia vive en su **propio repositorio** y se ancla aquí como **submódulo de git**, de modo que este repo funciona como índice general de la maestría.

## 🌐 Micrositio

El portafolio se publica en **[juferoga.github.io/mcic](https://juferoga.github.io/mcic/)** con cada push a `main` (GitHub Actions → Pages). Usa MkDocs Material con un tema propio en `overrides/`, con la paleta y la tipografía del manual de marca UD:

- Portada generada desde los datos de `extra.mcic` en `mkdocs.yml`: notas, materias y créditos se editan en un solo lugar.
- Una escena generativa en WebGL por materia (conjunto de Julia, Truchet, Voronoi, ondas, frente de onda SIMD…), con calidad adaptativa y pausa fuera de pantalla.
- Favicon con la M del logo que toma el color de cada sección.
- Respeta `prefers-reduced-motion` y funciona con la navegación instantánea.

```bash
pip install "mkdocs>=1.6,<2" "mkdocs-material>=9.7,<10"
mkdocs serve        # http://127.0.0.1:8000/mcic/
```

## ⚙️ Uso

```bash
# Clonar todo (repo + submódulos)
git clone --recurse-submodules git@github.com:Juferoga/mcic.git

# Si ya está clonado, traer/actualizar submódulos
git submodule update --init --recursive

# Actualizar cada submódulo a su último main
git submodule update --remote --merge

# Agregar la tesis como submódulo (requiere acceso al repo privado)
git submodule add git@github.com:Juferoga/mcic-tesis.git tesis
```

## 📄 Licencia

Este repositorio se distribuye bajo la licencia incluida en [`LICENSE`](LICENSE). Cada submódulo conserva su propia licencia.
