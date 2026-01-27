import { test, expect } from '@playwright/test';

test.describe('MediCore Authentication Flow', () => {
  test('should allow a user to login and persist session', async ({ page }) => {
    await page.goto('/');

    // Check login page elements
    await expect(page.getByRole('heading', { name: 'MediCore Pro' })).toBeVisible();

    // Perform login using Quick Access (Demo)
    const quickAccessBtn = page.getByRole('button', { name: 'Doc House' });
    await quickAccessBtn.click();

    // Ensure inputs are filled
    await expect(page.locator('#username-input')).toHaveValue('doc_house');
    await expect(page.locator('#password-input')).toHaveValue('12345678');

    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

    // Verify successful navigation to dashboard
    // Use a more flexible heading check
    await expect(page.getByRole('heading', { name: /Mis Pacientes|Panel Principal/ }).first()).toBeVisible();

    // Verify session persistence after reload
    await page.reload();
    await expect(page.getByRole('heading', { name: /Mis Pacientes|Panel Principal/ }).first()).toBeVisible();

    // Perform logout
    await page.getByRole('button', { name: 'Cerrar Sesión' }).click();

    // Verify redirected back to login
    await expect(page.getByRole('button', { name: 'Inicio de Sesión Seguro' })).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/');

    await page.locator('#username-input').fill('invalid_user');
    await page.locator('#password-input').fill('wrong_password');
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

    await expect(page.getByText(/Credenciales inválidas|Servidor no disponible/)).toBeVisible();
  });
});
