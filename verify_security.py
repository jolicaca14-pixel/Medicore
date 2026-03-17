import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        async def check_access(username, password, should_see_admin):
            print(f"Checking access for {username}...")
            await page.goto('http://localhost:3000')
            await page.fill('#username-input', username)
            await page.fill('#password-input', password)
            await page.click('button:has-text("Inicio de Sesión Seguro")')

            # Wait for sidebar/layout
            await page.wait_for_timeout(2000)

            admin_modules = ["Gestión Usuarios", "Talento Humano", "Gestión Archivos", "Plantillas / Roles"]
            found = []
            for module in admin_modules:
                is_visible = await page.is_visible(f"text={module}")
                if is_visible:
                    found.append(module)

            if should_see_admin:
                if len(found) > 0:
                    print(f"  PASS: Admin {username} sees modules: {found}")
                else:
                    print(f"  FAIL: Admin {username} DOES NOT see admin modules")
            else:
                if len(found) == 0:
                    print(f"  PASS: Non-admin {username} restricted correctly")
                else:
                    print(f"  FAIL: Non-admin {username} SEES restricted modules: {found}")

            await page.click('text=Cerrar Sesión')
            await page.wait_for_timeout(1000)

        # 1. Admin (admin)
        await check_access('admin', '80123456', True)

        # 2. Accountant (contador_demo)
        await check_access('contador_demo', '11224455', True)

        # 3. Professional (doc_house)
        await check_access('doc_house', '12345678', False)

        # 4. Secretary (sandra_sec)
        await check_access('sandra_sec', '24681357', False)

        await browser.close()

asyncio.run(run())
