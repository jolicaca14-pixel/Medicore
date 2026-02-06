import { test, expect } from '@playwright/test';

test('admin can access files management', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Login as admin
  await page.locator('#username-input').fill('admin');
  await page.locator('#password-input').fill('80123456');
  await page.getByRole('button', { name: /Inicio de Sesión Seguro/ }).click();

  await expect(page.getByText('Panel Principal').first()).toBeVisible();

  // Click on "Gestión Archivos"
  await page.getByRole('button', { name: 'Gestión Archivos' }).click();

  // Verify content
  await expect(page.getByRole('heading', { name: 'Gestión de Archivos' })).toBeVisible();
  await expect(page.getByText('Archivos de Contratos')).toBeVisible();

  await page.screenshot({ path: 'verification_files.png' });
});

test('admin can see dedicated user creation space', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Login as admin
  await page.locator('#username-input').fill('admin');
  await page.locator('#password-input').fill('80123456');
  await page.getByRole('button', { name: /Inicio de Sesión Seguro/ }).click();

  // Click on "Gestión Usuarios"
  await page.getByRole('button', { name: 'Gestión Usuarios' }).click();

  // Click on "Crear Nuevo Usuario"
  await page.getByRole('button', { name: 'Crear Nuevo Usuario' }).click();

  // Verify dedicated space
  await expect(page.getByText('Registrar Nuevo Usuario')).toBeVisible();
  await expect(page.getByLabel('Nombres')).toBeVisible();

  await page.screenshot({ path: 'verification_users.png' });
});
