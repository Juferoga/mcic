import asyncio, sys, base64
from playwright.async_api import async_playwright
src = open(sys.argv[1]).read()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel="chrome")
        for size, out in zip(map(int, sys.argv[2::2]), sys.argv[3::2]):
            pg = await b.new_page(viewport={"width": size, "height": size})
            await pg.set_content('<body style="margin:0"><img style="display:block" width="%d" height="%d" src="data:image/svg+xml;base64,%s"></body>' % (size, size, base64.b64encode(src.encode()).decode()))
            await pg.wait_for_timeout(150)
            await pg.screenshot(path=out, omit_background=True); await pg.close()
        await b.close()
asyncio.run(main())
