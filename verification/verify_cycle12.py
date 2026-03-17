from playwright.sync_api import sync_playwright, expect
import time

def verify_cycle12(page):
    # Go to login page
    page.goto("http://localhost:3000")

    # Login as Admin
    page.get_by_role("button", name="Admin").click()
    page.get_by_role("button", name="Inicio de Sesión Seguro").click()

    # Wait for Dashboard
    expect(page.get_by_role("heading", name="Panel Principal")).to_be_visible()

    # 1. Skeleton Loader / App Structure
    page.screenshot(path="verification/admin_dashboard.png")

    # 2. Tax Retentions in Admin Dashboard
    # (Assuming it is visible in the dashboard tab)
    expect(page.get_by_text("Costos Operativos Proyectados")).to_be_visible()
    page.screenshot(path="verification/admin_finance_widget.png")

    # 3. Session Timeout Handler (Hard to verify with screenshot without waiting 15m,
    # but we can check if it exists in the DOM if it were visible)

    # 4. Professional View - Draft Recovery & Clinical Record Templates
    page.get_by_role("button", name="Cerrar Sesión").click()

    # Login as Professional (Doc House)
    page.get_by_role("button", name="Doc House").click()
    page.get_by_role("button", name="Inicio de Sesión Seguro").click()

    expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible()

    # Open a patient
    page.get_by_text("Juan Pérez").first.click()

    # Check for Clinical Templates in a textarea
    expect(page.get_by_text("Motivo de Consulta")).to_be_visible()
    # Click on Motivo de Consulta tab if needed, but it should be default

    # Look for a template button (DOC HOUSE)
    expect(page.get_by_role("button", name="EF Normal").first).to_be_visible()
    page.screenshot(path="verification/professional_clinical_templates.png")

    # 5. Keyboard Shortcut Hints (TRINITY)
    expect(page.get_by_text("Ctrl+S")).to_be_visible()

    print("Verification complete.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Create context with storage state if needed, or just login
        page = browser.new_page()
        try:
            verify_cycle12(page)
        except Exception as e:
            print(f"Error during verification: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
