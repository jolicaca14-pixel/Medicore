from playwright.sync_api import sync_playwright, expect

def verify():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Login
        page.get_by_label("Acceso rápido como Médico").click()
        page.get_by_role("button", name="Inicio de Sesión Seguro").click()

        # Select patient
        page.get_by_text("Juan Pérez").first.click()

        # 1. Vital Signs Warning
        page.get_by_text("Signos Vitales").click()
        # Sys BP high
        sys_bp = page.locator('input[type="number"]').nth(0) # Assuming it's the first number input in vits
        # Let's be more specific - label check
        sys_bp = page.get_by_label("Tensión Sistólica (PAS)")
        sys_bp.fill("180")
        expect(page.get_by_text("Hipertensión: Sístole elevada")).to_be_visible()
        print("Vital sign warning verified.")
        page.screenshot(path="verification/vital_warning.png")

        # 2. SOAT Pricing
        page.get_by_text("Codificación y Órdenes").click()
        page.get_by_placeholder("Buscar CUPS...").fill("Hemograma")
        expect(page.get_by_text("$").first).to_be_visible() # Price should show
        print("SOAT Pricing verified.")
        page.screenshot(path="verification/soat_pricing.png")

        # 3. Progress Messages (Finalize)
        # Add diagnosis first
        page.get_by_placeholder("Buscar código o nombre CIE-11...").fill("Migraña")
        page.get_by_text("Migraña sin aura").click()

        # Finalize
        page.on("dialog", lambda dialog: dialog.accept()) # Accept antecedents warning
        page.get_by_role("button", name="Finalizar & RDA").click()

        # Check progress msg
        expect(page.get_by_text("Generando Resumen Digital")).to_be_visible()
        print("Progress message verified.")
        page.screenshot(path="verification/progress_msg.png")

        browser.close()

if __name__ == "__main__":
    verify()
