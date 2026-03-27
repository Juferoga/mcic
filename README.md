# mcic
<p align="center">
	<img src=".general-assets/mcic-logo.jpeg" alt="MCIC logo" width="600" />
</p>

Compendio de lo visto en la maestría de Ciencias de la Información y la Comunicación de la Universidad Distrital.

## Objetivo
Este repositorio centraliza los materiales y resultados de la maestría. El plan es estudiar 3 semestres (con sus carpetas y materiales), y además alojar aquí la tesis de maestría.

## Estructura propuesta
- `semestre-1/` — materiales y submódulos del primer semestre. Ver [semestre-1/README.md](semestre-1/README.md).
- `semestre-2/` — materiales del segundo semestre (por crear).
- `semestre-3/` — materiales del tercer semestre (por crear).
- `tesis/` — carpeta donde irá el proyecto y documentación de la tesis.

## Submódulos (ejemplo)
Los submódulos para el primer semestre ya están añadidos bajo `semestre-1`:

- [semestre-1/mcic-computing/README.md](semestre-1/mcic-computing/README.md)
- [semestre-1/mcic-math-tools-data/README.md](semestre-1/mcic-math-tools-data/README.md)

## Cómo contribuir / comandos útiles
- Actualizar submódulos:

```bash
git submodule update --init --recursive
```

- Añadir material a un semestre (ejemplo para `semestre-2`):

```bash
mkdir -p semestre-2 && cd semestre-2
# crear archivos y luego volver al repo raíz
cd ..
git add semestre-2 && git commit -m "Add semestre-2 placeholder"
```

## Notas
- Mantén cada semestre en su carpeta respectiva y registra cambios en commits claros.
- La tesis irá en `tesis/` y puede referenciar material de los semestres.

Si quieres, puedo crear las carpetas `semestre-2`, `semestre-3` y `tesis` ahora y hacer un commit inicial.
