"""Reconstruye el logo MCIC en SVG a partir del PNG oficial (474x200).

Formas grandes: cobertura sub-píxel de dos tintas (marino/cian) -> potrace.
Detalles finos (pistas, nodos, anillos, barras, filetes): geometría medida a mano.

Uso:  python vectorizar_logo.py LogoMCIC.png salida/
Requiere: pillow, numpy, potracer
"""
import sys, numpy as np, potrace
from PIL import Image, ImageFilter
from numpy.lib.stride_tricks import sliding_window_view as swv

src, outdir = sys.argv[1], sys.argv[2]
NAVY_HEX, CYAN_HEX = "#085c84", "#0ba9e6"
K = 8
im = np.asarray(Image.open(src).convert("RGBA")).astype(float)
H, W = im.shape[:2]
rgb, alpha = im[..., :3], im[..., 3] / 255
NAVY = np.array([8, 92, 132.]); CYAN = np.array([11, 169, 230.]); axis = CYAN - NAVY

# Cobertura real de tinta (bordes opacos premezclados con blanco) y tono marino→cian
cov = np.clip((255 - rgb[..., 0]) / 245.5, 0, 1)
alpha = alpha * cov
ink = (rgb - (1 - cov[..., None]) * 255) / np.maximum(cov[..., None], 1e-3)
t = np.clip(((ink - NAVY) @ axis) / (axis @ axis), 0, 1)
opaque = alpha > 0.85

# Tono de borde heredado del vecino opaco
known = opaque.copy(); t = np.where(known, t, 0.0)
for _ in range(6):
    acc = np.zeros_like(t); cnt = np.zeros_like(t)
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            acc += np.roll(np.roll(np.where(known, t, 0), dy, 0), dx, 1)
            cnt += np.roll(np.roll(known, dy, 0), dx, 1)
    fill = (~known) & (cnt > 0)
    t[fill] = acc[fill] / cnt[fill]; known |= fill

# Quita los detalles finos (se redibujan como geometría): mediana local 9x9
R = 4
pad = np.pad(np.where(opaque, t, np.nan), R, mode="edge")
with np.errstate(all="ignore"):
    import warnings; warnings.simplefilter("ignore")
    med = np.nanmedian(swv(pad, (2 * R + 1, 2 * R + 1)).reshape(H, W, -1), axis=-1)
med = np.where(np.isnan(med), t, med)
clean = np.where(opaque & (np.abs(t - med) > 0.22), med, t)
# Entrada de la pista en la C derecha: resto de la línea fina pegado al borde
clean[64:80, 333:346] = np.where(alpha[64:80, 333:346] > 0.3, 1.0, clean[64:80, 333:346])
# Zona de las barras de la I: fondo cian liso
clean[104:140, 293:329] = np.where(alpha[104:140, 293:329] > 0.3, 1.0, clean[104:140, 293:329])

BLUR = ImageFilter.GaussianBlur(K * 0.55)  # suaviza el escalonado del PNG de origen
def up(a):
    img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "L").resize((W * K, H * K), Image.BICUBIC)
    return np.asarray(img.filter(BLUR)) > 127
def upf(a):
    img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8), "L").resize((W * K, H * K), Image.BICUBIC)
    return np.asarray(img.filter(BLUR)) / 255.0
def trace(mask):
    plist = potrace.Bitmap(~mask).trace(turdsize=16, alphamax=1.05, opticurve=True, opttolerance=0.35)
    f = lambda p: f"{p.x / K:.2f} {p.y / K:.2f}"
    d = []
    for c in plist:
        d.append("M" + f(c.start_point))
        for s in c.segments:
            d.append(("L" + f(s.c) + "L" + f(s.end_point)) if s.is_corner else ("C" + f(s.c1) + " " + f(s.c2) + " " + f(s.end_point)))
        d.append("Z")
    return "".join(d)

def build(rows):
    a = np.zeros_like(alpha); a[rows] = alpha[rows]
    sil = up(a)
    return trace(sil), trace(sil & (upf(clean) < 0.55))

full_sil, full_navy = build(slice(0, H))
mark_sil, mark_navy = build(slice(0, 142))

# ---------------- Detalles geométricos (coordenadas medidas en el original) ---------------
def diamond(x, y, r=3.3):
    return f'<path d="M{x:g} {y - r:.2f}L{x + r:.2f} {y:g}L{x:g} {y + r:.2f}L{x - r:.2f} {y:g}Z"/>'

m_cx, m_cy, m_r = 33.5, 53.0, 11.0
off = m_r / 2 ** 0.5
M_DETAIL = (
    f'<g stroke="{{cyan}}" stroke-width="1.05" fill="none" stroke-linecap="round">'
    f'<path d="M-4 15.5L{m_cx - off:.2f} {m_cy - off:.2f}M{m_cx + off:.2f} {m_cy + off:.2f}L80 99.5"/>'
    f'<circle cx="{m_cx}" cy="{m_cy}" r="{m_r}"/></g>'
    f'<g fill="{{cyan}}">{diamond(13, 32.5)}{diamond(54.5, 74)}</g>'
)
C1_DETAIL = f'<g stroke="{{navy}}" stroke-width="1.2" fill="none">'
dots = ""
for i in range(6):
    x0 = 180.5 + 14 * i; y0 = 25.4
    C1_DETAIL += f'<path d="M{x0 - 32:.1f} {y0 - 32:.1f}L{x0 + 30:.1f} {y0 + 30:.1f}"/>'
    dots += diamond(round(x0, 1), y0, 3.4)
C1_DETAIL += f'</g><g fill="{{navy}}">{dots}</g>'
c_cx, c_cy, c_r = 382.0, 114.8, 11.5
coff = c_r / 2 ** 0.5
C2_DETAIL = (
    f'<g stroke="{{navy}}" stroke-width="1.05" fill="none" stroke-linecap="round">'
    f'<path d="M330 62.8L{c_cx - coff:.2f} {c_cy - coff:.2f}"/>'
    f'<circle cx="{c_cx}" cy="{c_cy}" r="{c_r}"/></g>'
    f'<g fill="{{navy}}">{diamond(360.8, 93.6, 3.3)}</g>'
)
BOTTOM = 138.3
BARS = [(294.2, 300.0, 120.3), (300.8, 307.0, 114.2), (307.6, 314.0, 125.3), (314.6, 320.4, 108.0), (321.0, 327.8, 128.0)]
BARS_DETAIL = f'<g fill="{{navy}}">' + "".join(
    f'<rect x="{x0}" y="{y}" width="{x1 - x0:.1f}" height="{BOTTOM - y:.1f}"/>' for x0, x1, y in BARS) + "</g>"
DETAILS = M_DETAIL + C1_DETAIL + C2_DETAIL + BARS_DETAIL

# Filetes a los lados de "30 AÑOS" (1 px en el original: se dibujan como geometría)
RULES = '<g fill="{c}"><rect x="0" y="190.2" width="181.5" height="0.95"/><rect x="292.5" y="190.2" width="180.5" height="0.95"/></g>'

TITLE = "MCIC · Maestría en Ciencias de la Información y las Comunicaciones"
def svg(view_h, sil, navy_d, cyan, navy, name, id_):
    det = DETAILS.replace("{cyan}", cyan).replace("{navy}", navy)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {view_h}" width="{W}" height="{view_h}" role="img" aria-labelledby="{id_}-t">\n'
        f'  <title id="{id_}-t">{TITLE}</title>\n'
        f'  <defs><path id="{id_}-s" fill-rule="evenodd" d="{sil}"/>'
        f'<clipPath id="{id_}-clip"><use href="#{id_}-s"/></clipPath></defs>\n'
        f'  <use href="#{id_}-s" fill="{cyan}"/>\n'
        f'  <path fill="{navy}" fill-rule="evenodd" d="{navy_d}"/>\n'
        f'  <g clip-path="url(#{id_}-clip)">{det}</g>\n'
        + (f'  {RULES.format(c=cyan)}\n' if view_h == H else '')
        + '</svg>\n'
    )

VARIANTS = {
    "color": (CYAN_HEX, NAVY_HEX),          # fondo claro (original)
    "invertido": (CYAN_HEX, "#eaf2f7"),     # fondo oscuro: marino → blanco
    "blanco": ("#ffffff", "#ffffff"),        # monocromo sobre color/foto (detalles en hueco)
    "marino": (NAVY_HEX, NAVY_HEX),          # monocromo una tinta
}
import os
os.makedirs(outdir, exist_ok=True)
for v, (cy_, nv) in VARIANTS.items():
    # en monocromo los detalles se dibujan en "hueco" con el color del fondo no es posible
    # sin conocer el fondo: se usa máscara para recortarlos
    if cy_ == nv:
        det_mask = DETAILS.replace("{cyan}", "#000").replace("{navy}", "#000")
        for name, vh, sil in (("mcic-logo", H, full_sil), ("mcic-wordmark", 142, mark_sil)):
            id_ = f"{name}-{v}"
            s = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {vh}" width="{W}" height="{vh}" role="img" aria-labelledby="{id_}-t">\n'
                 f'  <title id="{id_}-t">{TITLE}</title>\n'
                 f'  <defs><mask id="{id_}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{vh}">'
                 f'<rect width="{W}" height="{vh}" fill="#fff"/><g clip-path="url(#{id_}-clip)">{det_mask}</g></mask>'
                 f'<path id="{id_}-s" fill-rule="evenodd" d="{sil}"/>'
                 f'<clipPath id="{id_}-clip"><use href="#{id_}-s"/></clipPath></defs>\n'
                 f'  <use href="#{id_}-s" fill="{nv}" mask="url(#{id_}-m)"/>\n'
                 + (f'  {RULES.format(c=nv)}\n' if vh == H else '') + '</svg>\n')
            open(f"{outdir}/{name}-{v}.svg", "w").write(s)
    else:
        open(f"{outdir}/mcic-logo-{v}.svg", "w").write(svg(H, full_sil, full_navy, cy_, nv, "mcic-logo", f"mcic-logo-{v}"))
        open(f"{outdir}/mcic-wordmark-{v}.svg", "w").write(svg(142, mark_sil, mark_navy, cy_, nv, "mcic-wordmark", f"mcic-wordmark-{v}"))
print(sorted(os.listdir(outdir)))
