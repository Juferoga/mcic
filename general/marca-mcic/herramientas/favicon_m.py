"""Genera el favicon con la M del logo MCIC a partir del wordmark vectorial.

Toma de svg/mcic-wordmark-color.svg sólo los contornos de la M (x < 137) y los
monta sobre una placa redondeada: el cuerpo en blanco y la franja en el color de
acento. Los colores quedan como marcadores que el sitio reemplaza en vivo
(docs/javascripts/mcic.js) para teñir el favicon con el tema de cada página:

    #0BA9E6  acento (franja de la M)
    #095170  inicio del degradado de la placa: 42 % acento + 58 % #07121B

Uso:  python favicon_m.py svg/mcic-wordmark-color.svg svg/mcic-favicon.svg
"""
import re
import sys

src, out = sys.argv[1], sys.argv[2]
svg = open(src).read()
ds = re.findall(r' d="([^"]+)"', svg)
silhouette, navy = ds[0], ds[1]  # silueta (capa cian) y capa marina


def only_m(d, max_x=137.0):
    subpaths = re.findall(r"M[^M]*", d)
    keep = []
    for sp in subpaths:
        nums = [float(v) for v in re.findall(r"-?\d+(?:\.\d+)?", sp)]
        xs, ys = nums[0::2], nums[1::2]
        # fuera de la M o motas sueltas (restos de las pistas de circuito)
        if xs and max(xs) < max_x and (max(xs) - min(xs) > 4 or max(ys) - min(ys) > 4):
            keep.append(sp)
    return "".join(keep)


m_sil, m_navy = only_m(silhouette), only_m(navy)
# La M ocupa x 0..134, y 4..139: se centra en una placa de 64 con 9 px de margen
scale = 46 / 135
tx, ty = 9.5, 32 - (4 + 139) / 2 * scale

favicon = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="mcic-fav-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#095170"/>
      <stop offset="1" stop-color="#07121B"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#mcic-fav-bg)"/>
  <g transform="translate({tx:.2f} {ty:.2f}) scale({scale:.4f})">
    <path fill="#0BA9E6" fill-rule="evenodd" d="{m_sil}"/>
    <path fill="#EAF2F7" fill-rule="evenodd" d="{m_navy}"/>
  </g>
</svg>
"""
open(out, "w").write(favicon)
print(out, len(favicon), "bytes")
