import { test, expect } from '@playwright/test';

test.describe('MediCore Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Acceso rápido como Médico').click();
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
    await expect(page.getByRole('heading', { name: /Mis Pacientes|Panel Principal/ }).first()).toBeVisible();
  });

  test('should search for a patient', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar por nombre o ID...');
    await searchInput.fill('Juan');

    // Should see at least one patient card with Juan's name
    await expect(page.getByText('Juan Pérez')).toBeVisible();
  });

  test('should open a clinical record and see vitals', async ({ page }) => {
    await page.getByText('Juan Pérez').click();

    // Verify we are in the record creation/view mode
    await expect(page.getByRole('heading', { name: 'Anamnesis General' })).toBeVisible();

    // Switch to Signos Vitales tab
    await page.getByRole('button', { name: 'Signos Vitales' }).click();

    // Check for some vital sign fields
    await expect(page.getByText('Peso')).toBeVisible();
    await expect(page.getByText('Talla')).toBeVisible();
  });
});
