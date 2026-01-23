from playwright.sync_api import sync_playwright

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err.message}"))
        page.goto("http://localhost:3000")
        page.wait_for_timeout(10000)
        page.screenshot(path="verification/debug_login.png")
        browser.close()

if __name__ == "__main__":
    verify()
