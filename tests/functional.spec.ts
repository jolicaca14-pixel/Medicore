import { test, expect } from '@playwright/test';

test.describe('Functional Verification', () => {

  test('Secretary PATIENTS tab and search', async ({ page }) => {
    await page.goto('/');

    // Login as Secretary
    await page.click('button:has-text("Secr.")');
    await page.click('button:has-text("Inicio de Sesión Seguro")');

    // Check if in Secretary View and Agenda is default
    await expect(page.locator('h2').first()).toBeVisible();

    // Go to PATIENTS tab
    await page.click('button:has-text("Pacientes")');
    await expect(page.locator('h2:has-text("Directorio de Pacientes")')).toBeVisible();

    // Check search input
    const searchInput = page.locator('input[placeholder="Buscar paciente por nombre o documento..."]');
    await expect(searchInput).toBeVisible();

    // Check if table has data (MOCK_PATIENTS)
    const count = await page.locator('table tbody tr').count();
    expect(count).toBeGreaterThan(0);
  });

  test('Admin Users creation space and Settings modals', async ({ page }) => {
    await page.goto('/');

    // Login as Admin
    await page.click('button:has-text("Admin")');
    await page.click('button:has-text("Inicio de Sesión Seguro")');

    // Go to Users tab
    await page.click('button:has-text("Gestión Usuarios")');
    await expect(page.locator('h3:has-text("Espacio de Creación de Usuarios")')).toBeVisible();

    // Click Start New Registry
    await page.click('button:has-text("INICIAR NUEVO REGISTRO")');
    await expect(page.locator('h4:has-text("Formulario de Registro Seguro")')).toBeVisible();

    // Go to Settings tab
    await page.click('button:has-text("Plantillas / Roles")');
    await expect(page.locator('h2:has-text("Configuración del Sistema")')).toBeVisible();

    // Open Template Modal
    await page.click('button:has-text("Nueva Plantilla")');
    await expect(page.locator('h3:has-text("Configuración de Plantilla")')).toBeVisible();
    await page.click('button:has-text("Cancelar")');

    // Open Section Modal
    await page.click('button:has-text("Secciones Clínicas")');
    await page.click('button:has-text("Nueva Sección")');
    await expect(page.locator('h3:has-text("Configuración de Sección")')).toBeVisible();
    await page.click('button:has-text("Cancelar")');

    // Open Field Modal
    await page.click('button:has-text("Campos y Variables")');
    await page.click('button:has-text("Nuevo Campo")');
    await expect(page.locator('h3:has-text("Configuración de Campo Global")')).toBeVisible();
    await page.click('button:has-text("Cancelar")');
  });

  test('RBAC - Accountant cannot see Users tab', async ({ page }) => {
    await page.goto('/');

    // Login as Accountant
    await page.click('button:has-text("Contador")');
    await page.click('button:has-text("Inicio de Sesión Seguro")');

    // Verify "Gestión Usuarios" is NOT in the sidebar
    await expect(page.locator('button:has-text("Gestión Usuarios")')).not.toBeVisible();

    // Verify "Gestión Archivos" IS in the sidebar (Administrative access)
    await expect(page.locator('button:has-text("Gestión Archivos")')).toBeVisible();
  });

});
