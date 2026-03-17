import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        await page.goto('http://localhost:3000')
        await page.fill('#username-input', 'doc_house')
        await page.fill('#password-input', '12345678')
        await page.click('button:has-text("Inicio de Sesión Seguro")')

        await page.wait_for_selector('text=Mis Pacientes')

        # Click on Juan Pérez card
        await page.click('text=Juan Pérez')
        await page.wait_for_timeout(2000)
        await page.screenshot(path='debug_clinical_record.png')

        # Look for the Bot icon button for AI Summary
        try:
            # Re-locating the button specifically
            ai_btn = page.locator('button').filter(has=page.locator('svg.lucide-bot'))
            await ai_btn.click()
            print("Clicked AI Summary button")
            await page.wait_for_timeout(5000)
            await page.screenshot(path='debug_ai_summary.png')
        except Exception as e:
            print(f"Could not trigger AI Summary: {e}")

        await browser.close()

asyncio.run(run())
