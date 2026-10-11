"""Convierte un SVG en un PDF vectorial del mismo tamaño (Chrome headless)."""
import asyncio, sys, base64
from playwright.async_api import async_playwright
async def main(src, out):
    svg = open(src).read()
    vb = [float(v) for v in svg.split('viewBox="')[1].split('"')[0].split()]
    w, h = vb[2], vb[3]
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        pg = await b.new_page()
        await pg.set_content(f'<html><head><style>@page{{size:{w}px {h}px;margin:0}}html,body{{margin:0}}</style></head>'
                             f'<body>{svg}</body></html>')
        await pg.pdf(path=out, width=f"{w}px", height=f"{h}px", print_background=False, margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}, page_ranges="1")
        await b.close()
asyncio.run(main(*sys.argv[1:]))
