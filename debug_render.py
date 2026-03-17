from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))
    try:
        page.goto("http://localhost:3000", timeout=10000)
        page.wait_for_load_state("networkidle")
        print("Page title:", page.title())
        print("Heading present:", page.locator("h1").first.inner_text() if page.locator("h1").count() > 0 else "No h1")
    except Exception as e:
        print("Error during navigation:", e)

    page.screenshot(path="debug_render.png")
    browser.close()
