from playwright.sync_api import sync_playwright, expect
import time
import os

def verify_app(page):
    print("Navigating to http://localhost:3000...")
    page.goto("http://localhost:3000", wait_until="networkidle")
    page.screenshot(path="debug_initial_load.png")

    # Login as Admin
    print("Logging in as admin...")
    page.wait_for_selector("#username-input", timeout=15000)
    page.locator("#username-input").fill("admin")
    page.locator("#password-input").fill("80123456")
    page.get_by_role("button", name="Inicio de Sesión Seguro").click()

    # Wait for dashboard
    page.wait_for_selector("text=Admin Sistema", timeout=10000)
    page.screenshot(path="debug_admin_dashboard.png")

    # Verify User Management dedicated space
    page.get_by_role("button", name="Gestión Usuarios").click()
    page.wait_for_selector("text=Espacio de Creación de Usuarios", timeout=10000)
    page.screenshot(path="verification_admin_users.png")

    # Verify Settings sub-tabs
    page.get_by_role("button", name="Plantillas / Roles").click()
    page.wait_for_selector("text=Plantillas y Roles", timeout=10000)
    page.screenshot(path="verification_admin_settings.png")

    # Verify File Management
    page.get_by_role("button", name="Gestión Archivos").click()
    page.wait_for_selector("text=Gestión de Archivos", timeout=10000)
    page.screenshot(path="verification_admin_files.png")

    # Logout and Login as Professional
    page.get_by_role("button", name="Cerrar Sesión").click()
    page.wait_for_selector("#username-input")
    page.locator("#username-input").fill("doc_elena")
    page.locator("#password-input").fill("1098765432")
    page.get_by_role("button", name="Inicio de Sesión Seguro").click()

    # Verify Mis Pacientes
    page.wait_for_selector("text=Mis Pacientes", timeout=10000)
    page.screenshot(path="debug_prof_list.png")

    # Hover over the first patient card (Juan Pérez)
    # Using a more robust selector for the card
    card = page.get_by_text("Juan Pérez").first
    card.hover()
    time.sleep(2) # wait for tooltip animation
    page.screenshot(path="verification_prof_quicklook.png")

    # Verify AI Summary in record
    card.click()
    time.sleep(2)
    page.screenshot(path="debug_prof_record_opened.png")
    # Using a looser selector for AI summary box title
    page.wait_for_selector("text=Resumen Inteligente", timeout=10000)
    page.screenshot(path="verification_prof_record_ai.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            verify_app(page)
        finally:
            browser.close()
