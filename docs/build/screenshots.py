from playwright.sync_api import sync_playwright
import sys, time

sites = [
    ("polymarket", "https://polymarket.com/"),
    ("kalshi", "https://kalshi.com/"),
    ("manifold", "https://manifold.markets/"),
    ("metaculus", "https://www.metaculus.com/questions/"),
    ("gjopen", "https://www.gjopen.com/"),
]

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, url in sites:
        try:
            ctx = b.new_context(viewport={"width":1440,"height":900}, device_scale_factor=2,
                                locale="en-US",
                                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
            pg = ctx.new_page()
            pg.goto(url, wait_until="networkidle", timeout=45000)
            pg.wait_for_timeout(3500)
            pg.screenshot(path=f"shots/{name}.png")
            print(name, "OK", pg.title()[:60])
            ctx.close()
        except Exception as e:
            print(name, "FAIL", str(e)[:120])
    b.close()
