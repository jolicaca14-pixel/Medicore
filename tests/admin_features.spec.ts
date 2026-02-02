import { test, expect } from '@playwright/test';

test.describe('MediCore Admin Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Acceso rápido como Admin').click();
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
    await expect(page.getByRole('heading', { name: 'Panel Principal' })).toBeVisible();
  });

  test('should see the Gestión Archivos tab', async ({ page }) => {
    const filesTab = page.getByRole('button', { name: 'Gestión Archivos' });
    await expect(filesTab).toBeVisible();
    await filesTab.click();
    await expect(page.getByRole('heading', { name: 'Gestión de Archivos' })).toBeVisible();
  });

  test('should see the dedicated User Creation space', async ({ page }) => {
    const usersTab = page.getByRole('button', { name: 'Gestión Usuarios' });
    await expect(usersTab).toBeVisible();
    await usersTab.click();

    // Check for the list and the form
    await expect(page.getByText('Directorio de Usuarios')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible();

    // Check for the "Agregar Nuevo" button
    await expect(page.getByRole('button', { name: 'Agregar Nuevo' })).toBeVisible();
  });
});
