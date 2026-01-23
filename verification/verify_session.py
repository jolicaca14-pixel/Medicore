from playwright.sync_api import sync_playwright, expect

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Check for Quick Access buttons aria-labels
        btn = page.get_by_label("Acceso rápido como Médico")
        print(f"Found button with aria-label: {btn.is_visible()}")

        # Login
        btn.click()
        page.get_by_role("button", name="Inicio de Sesión Seguro").click()

        # Check if we are logged in (Professional View title)
        expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible()
        print("Logged in successfully.")

        # Refresh the page
        page.reload()

        # Check if we are STILL logged in (session persistence)
        expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible()
        print("Session persisted after reload.")

        # Screenshot
        page.screenshot(path="verification/session_persisted.png")

        # Logout
        page.get_by_role("button", name="Cerrar Sesión").click()

        # Check if we are back at login
        expect(page.get_by_role("button", name="Inicio de Sesión Seguro")).to_be_visible()
        print("Logged out and session cleared.")

        # Reload and verify we are still at login
        page.reload()
        expect(page.get_by_role("button", name="Inicio de Sesión Seguro")).to_be_visible()
        print("Session cleared after reload.")

        browser.close()

if __name__ == "__main__":
    verify()
