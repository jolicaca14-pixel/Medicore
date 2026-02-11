import { test, expect } from '@playwright/test';

test.describe('Flujo Clínico Profesional', () => {
  test.beforeEach(async ({ page }) => {
    // Login as professional
    await page.goto('/');
    await page.fill('input[id="username-input"]', 'doc_house');
    await page.fill('input[id="password-input"]', '12345678');
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page.getByRole('heading', { name: /Mis Pacientes|Panel Principal/ }).first()).toBeVisible();
  });

  test('debe permitir seleccionar un paciente y abrir el formulario', async ({ page }) => {
    // Click on the first patient card
    await page.locator('.bg-white.p-6.rounded-xl').first().click();

    // Verify patient view header
    await expect(page.locator('h2.text-xl.font-bold')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Guardar' })).toBeVisible();
  });

  test('debe permitir generar un resumen IA', async ({ page }) => {
    await page.locator('.bg-white.p-6.rounded-xl').first().click();

    // Click Resumen IA
    await page.getByRole('button', { name: 'Resumen IA' }).click();

    // Check for loading state or summary box
    // Since it's a mock/AI call, we look for the result div
    await expect(page.locator('h4', { name: 'Resumen Clínico Inteligente (IA)' })).toBeVisible({ timeout: 10000 });
  });

  test('debe permitir guardar un borrador', async ({ page }) => {
    await page.locator('.bg-white.p-6.rounded-xl').first().click();

    // Fill some data if needed, but the button should work regardless
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Check for success feedback
    await expect(page.getByRole('button', { name: '¡Guardado!' })).toBeVisible();
  });
});
