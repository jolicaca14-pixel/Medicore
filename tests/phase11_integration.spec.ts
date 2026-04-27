import { test, expect } from '@playwright/test';

test.describe('MediCore Phase 11 Integration Flow', () => {
  test('should complete the clinical to billing flow', async ({ page }) => {
    await page.goto('/');

    // 1. Login as Doc House (Professional)
    await page.getByRole('button', { name: 'Doc House' }).click();
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
    await expect(page.getByRole('heading', { name: 'Mis Pacientes' })).toBeVisible();

    // 2. Search and Select Patient
    await page.locator('#patient-search').fill('Armando');
    await page.getByText('Armando Casas').click();
    await expect(page.getByRole('heading', { name: 'Armando Casas' })).toBeVisible();

    // 3. Create Draft HCE (Automatic save simulation)
    await page.locator('#chief-complaint-input').fill('Prueba de integracion Fase 11');
    await page.getByRole('button', { name: 'Guardar' }).click();
    await expect(page.getByText('¡Guardado!')).toBeVisible();

    // 4. Finalize HCE (Requires password)
    await page.getByRole('button', { name: 'Finalizar & RDA' }).click();
    await page.locator('input[type="password"]').fill('12345678');
    await page.getByRole('button', { name: 'Firmar Historia' }).click();

    // Wait for success and redirection
    await expect(page.getByRole('heading', { name: 'Mis Pacientes' })).toBeVisible({ timeout: 10000 });

    // 5. Switch to Admin and check billing
    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
    await page.getByRole('button', { name: 'Administrador' }).click();
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

    // Navigate to Reports (Financial Management)
    await page.getByRole('button', { name: 'Analítica Financiera' }).click();
    await page.getByRole('button', { name: 'Facturación Automática' }).click();

    // Verify invoice presence (the first one should be the new one)
    await expect(page.getByText('FAC-')).first().toBeVisible();
    await expect(page.getByText('Armando Casas')).first().toBeVisible();
  });
});
