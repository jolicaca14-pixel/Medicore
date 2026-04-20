import { test, expect } from '@playwright/test';

test.describe('Módulo de Historias Clínicas', () => {
  test.beforeEach(async ({ page }) => {
    // Login as professional
    await page.goto('http://localhost:3000/');
    await page.fill('input[placeholder*="usuario"]', 'doc_house');
    await page.fill('#password-input', 'password123');
    await page.click('button:has-text("Iniciar Sesión")');
    await expect(page.locator('text=Panel de Control')).toBeVisible();
  });

  test('Debe permitir ver la lista de pacientes y abrir una historia', async ({ page }) => {
    // Navigate to records
    await page.click('button:has-text("Mis Historias")');

    // Check if patients are loaded
    const patientRow = page.locator('tr').filter({ hasText: '1012345678' });
    await expect(patientRow).toBeVisible();

    // Open clinical record
    await patientRow.locator('button:has-text("Atender")').click();
    await expect(page.locator('text=Nueva Historia Clínica')).toBeVisible();
  });

  test('Debe validar alertas de signos vitales', async ({ page }) => {
    await page.click('button:has-text("Mis Historias")');
    await page.locator('tr').filter({ hasText: '1012345678' }).locator('button:has-text("Atender")').click();

    // Go to vital signs tab (assuming it's a tab or section)
    // Find input for systolic BP
    const sysBpInput = page.locator('label:has-text("Presión Sistólica") + input, input[name*="sys"], input[placeholder*="Sistólica"]');

    // 🛡️ SMITH: Eliminar lógica condicional para asegurar que el test falle si el elemento no está
    await expect(sysBpInput).toBeVisible();
    await sysBpInput.fill('160');
    await expect(page.locator('text=Hipertensión: Sístole elevada')).toBeVisible();
  });
});
