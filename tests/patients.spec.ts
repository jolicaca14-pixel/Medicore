import { test, expect } from '@playwright/test';

test.describe('Patient Management Integration', () => {
  test('Professional can see patient list', async ({ page }) => {
    await page.goto('/');

    // Login as professional
    await page.getByRole('button', { name: 'Doc House' }).click();
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

    // Wait for "Mis Pacientes" heading
    await expect(page.getByRole('heading', { name: 'Mis Pacientes' }).first()).toBeVisible();

    // Check if at least one patient is listed (from MOCK_PATIENTS fallback or API)
    // We expect the mock patients to be there if the API fails or the new ones if it succeeds
    const patientCards = page.locator('.bg-white.p-6.rounded-xl.shadow-sm.border.border-slate-100');
    await expect(patientCards.first()).toBeVisible();

    // Search for a specific patient
    const searchInput = page.getByPlaceholder('Buscar por nombre o ID...');
    await searchInput.fill('Juan Pérez');

    // Should show the patient card
    await expect(page.getByText('Juan Pérez')).toBeVisible();
  });
});
