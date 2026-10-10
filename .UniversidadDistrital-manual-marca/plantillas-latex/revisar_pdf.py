"""Revisa que nada se salga en una presentación hecha con el tema UD.

Uso:  uv run --no-project --with pymupdf python revisar_pdf.py presentacion.pdf

Comprueba, en cada diapositiva de contenido, que texto, recuadros e imágenes queden dentro de los
márgenes del tema (3,15 cm a la izquierda, 0,75 cm a la derecha) y de la hoja; y en la portada, que
el texto quepa en el panel blanco de portada_base.jpg. Sale con código 1 si encuentra algo.
"""

import sys

import pymupdf

CM = 72 / 2.54
PANEL = (778 / 1920, 1636 / 1920, 257 / 1080, 822 / 1080)  # panel blanco de la portada (x0, x1, y0, y1)


def revisar(path: str) -> list[str]:
    doc = pymupdf.open(path)
    problemas = []
    for n, page in enumerate(doc, 1):
        W, H = page.rect.width, page.rect.height
        words = page.get_text("words")
        for x0, y0, x1, y1, w, *_ in words:
            if x0 < 0 or y0 < 0 or x1 > W or y1 > H:
                problemas.append(f"diap {n}: '{w}' se sale de la hoja")
        if n == 1:
            for x0, y0, x1, y1, w, *_ in words:
                if x0 > PANEL[0] * W and (x1 > PANEL[1] * W - 3 or y1 > PANEL[3] * H - 3):
                    problemas.append(f"portada: '{w}' se sale del panel blanco")
            continue
        if n == len(doc):
            continue
        derecha = W - 0.75 * CM
        cuerpo = [w for w in words if w[3] < H - 12]                      # sin el número de página
        cajas = [d["rect"] for d in page.get_drawings() if d["rect"].width < W * 0.9]
        imgs = [b["bbox"] for b in page.get_image_info() if b["bbox"][2] - b["bbox"][0] < W * 0.9]
        for x1, que in [(w[2], f"'{w[4]}'") for w in cuerpo] + [(r.x1, "recuadro") for r in cajas] \
                + [(b[2], "imagen") for b in imgs]:
            if x1 > derecha + 1:
                problemas.append(f"diap {n}: {que} pasa el margen derecho ({x1:.0f} > {derecha:.0f})")
    return sorted(set(problemas))


if __name__ == "__main__":
    encontrados = revisar(sys.argv[1])
    print("\n".join(encontrados) if encontrados else "Todo dentro de los márgenes.")
    sys.exit(1 if encontrados else 0)
