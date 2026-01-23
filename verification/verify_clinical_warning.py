from playwright.sync_api import sync_playwright, expect

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Login as Doctor
        page.get_by_label("Acceso rápido como Médico").click()
        page.get_by_role("button", name="Inicio de Sesión Seguro").click()

        # Select María González
        page.get_by_text("María González").click()

        # Listen for ALL dialogs
        dialogs = []
        page.on("dialog", lambda dialog: (dialogs.append(dialog.message), dialog.accept()))

        # Click Finalize
        page.get_by_role("button", name="Finalizar & RDA").click()

        # Wait a bit
        page.wait_for_timeout(2000)

        print(f"Dialogs encountered: {dialogs}")

        page.screenshot(path="verification/clinical_warning.png")
        browser.close()

if __name__ == "__main__":
    verify()
