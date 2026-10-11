import asyncio, sys, pathlib
from playwright.async_api import async_playwright
svgdir, pngdir = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
JOBS = {  # nombre: ancho en px
    "mcic-logo-color": 2048, "mcic-logo-invertido": 2048, "mcic-logo-blanco": 2048, "mcic-logo-marino": 2048,
    "mcic-wordmark-color": 1600, "mcic-wordmark-invertido": 1600,
    "mcic-simbolo-icono": 1024, "mcic-simbolo-color": 1024, "mcic-simbolo-invertido": 1024,
}
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        for name, w in JOBS.items():
            src = (svgdir / f"{name}.svg").read_text()
            vb = [float(v) for v in src.split('viewBox="')[1].split('"')[0].split()]
            h = round(w * vb[3] / vb[2])
            pg = await b.new_page(viewport={"width": w, "height": h})
            await pg.set_content(f'<html><body style="margin:0;background:transparent"><img src="data:image/svg+xml;base64,'
                                 + __import__("base64").b64encode(src.encode()).decode() + f'" style="display:block;width:{w}px;height:{h}px"></body></html>')
            await pg.wait_for_timeout(200)
            await pg.screenshot(path=str(pngdir / f"{name}.png"), omit_background=True)
            await pg.close()
        await b.close()
asyncio.run(main())
