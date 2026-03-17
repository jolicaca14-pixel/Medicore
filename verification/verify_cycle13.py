from playwright.sync_api import sync_playwright, expect
import time

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # 1. Login
        page.goto("http://localhost:3000")
        time.sleep(5) # Wait for Vite

        page.get_by_label("Usuario").fill("doc_house")
        page.get_by_placeholder("Use document number").fill("12345678")
        page.get_by_role("button", name="Inicio de Sesión Seguro").click()

        # Verify landing
        expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible(timeout=15000)
        page.screenshot(path="verification/dashboard_lazy_loading.png")
        print("Captured Dashboard (Performance/Neo)")

        # 2. Open Patient & Normal Vitals
        page.get_by_text("Juan Pérez").first.click()
        expect(page.get_by_role("button", name="Anamnesis General")).to_be_visible(timeout=10000)

        # Take screenshot of patient detail
        page.screenshot(path="verification/patient_detail.png")

        # Try to click vitals tab - it might be "Signos Vitales" text
        page.get_by_text("Signos Vitales").click()
        time.sleep(1)

        # Click the new button
        page.get_by_role("button", name="Cargar Valores Normales").click()
        time.sleep(1)
        page.screenshot(path="verification/normal_vitals_loaded.png")
        print("Captured Normal Vitals (Clinical/DocHouse)")

        # 3. Interactive State (Finalize)
        page.get_by_text("Codificación y Órdenes").click()
        page.get_by_placeholder("Buscar código o nombre CIE-11...").fill("Migraña")
        page.get_by_text("8A80.0 - Migraña sin aura").first.click()

        # Click Finalize
        page.get_by_role("button", name="Finalizar & RDA").click()
        page.get_by_placeholder("Contraseña o Documento").fill("12345678")

        # Start capture before clicking or use a small sleep after click to see spinner
        page.get_by_role("button", name="Firmar Historia").click()
        time.sleep(0.5)
        page.screenshot(path="verification/submitting_spinner.png")
        print("Captured Submitting Spinner (Palette)")

        # Wait for completion
        time.sleep(5)
        expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible(timeout=10000)

        # 4. Reports / Financial Projection
        page.get_by_role("button", name="Mis Reportes").click()
        expect(page.get_by_role("heading", name="Mi Producción & Finanzas")).to_be_visible(timeout=10000)
        page.screenshot(path="verification/financial_projection.png")
        print("Captured Financial Projection (Ledger)")

        browser.close()

if __name__ == "__main__":
    run_verification()
