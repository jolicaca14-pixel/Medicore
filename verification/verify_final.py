from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            print("Navegando a localhost:3000...")
            page.goto("http://localhost:3000", timeout=60000)

            # Login
            print("Login...")
            page.get_by_role("button", name="Acceso rápido como Médico").click()
            page.get_by_role("button", name="Inicio de Sesión Seguro").click()

            # Dashboard
            print("Esperando dashboard...")
            expect(page.get_by_role("heading", name="Mis Pacientes")).to_be_visible(timeout=15000)

            # Select patient
            print("Abriendo paciente...")
            page.get_by_text("Juan Pérez").first.click()

            # Professional View
            print("Esperando vista profesional...")
            expect(page.get_by_role("button", name="Codificación y Órdenes")).to_be_visible(timeout=10000)
            page.get_by_role("button", name="Codificación y Órdenes").click()

            # Verify Clear buttons
            print("Verificando botones Clear...")

            # Diag
            diag_input = page.get_by_placeholder("Buscar código o nombre CIE-11...")
            diag_input.fill("Z00")

            clear_diag = page.get_by_role("button", name="Limpiar búsqueda de diagnóstico")
            expect(clear_diag).to_be_visible()
            print("Botón Clear de diagnóstico OK.")
            page.screenshot(path="verification/diag_clear.png")

            # Proc
            proc_input = page.get_by_placeholder("Buscar CUPS...")
            proc_input.fill("90")

            clear_proc = page.get_by_role("button", name="Limpiar búsqueda de procedimiento")
            expect(clear_proc).to_be_visible()
            print("Botón Clear de procedimiento OK.")
            page.screenshot(path="verification/proc_clear.png")

            print("Verificación completa con éxito.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_final_attempt.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
