import { test, expect } from '@playwright/test';

test.describe('Phase 14 New Features Verification', () => {

    test('PII masking should be applied to patient identification in ProfessionalView', async ({ page }) => {
        // Login as doc_house
        await page.goto('/');
        await page.locator('#username-input').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: /Inicio de Sesión Seguro/ }).click();

        // Wait for dashboard
        await expect(page.getByRole('heading', { name: /Mis Pacientes/ }).first()).toBeVisible();

        // Check for masked ID (e.g., 123****890)
        // Patient IDs in constants.ts are like '123456789' -> '123****789'
        await expect(page.getByText('123****789').first()).toBeVisible();
    });

    test('Admin dashboard should display Nómina Proyectada card', async ({ page }) => {
        // Login as admin
        await page.goto('/');
        await page.locator('#username-input').fill('admin');
        await page.locator('#password-input').fill('80123456');
        await page.getByRole('button', { name: /Inicio de Sesión Seguro/ }).click();

        // Wait for dashboard
        await expect(page.getByRole('heading', { name: /Panel Principal/ }).first()).toBeVisible();

        // Check for Nómina Proyectada card
        await expect(page.getByText('Nómina Proyectada')).toBeVisible();
        // Since values are dynamic based on MOCK_USERS and their contracts,
        // we just check if a currency formatted value is present
        await expect(page.locator('h3', { hasText: '$' }).filter({ hasText: '000' }).first()).toBeVisible();

        // Check RIPS Generation and Download visibility
        await page.getByRole('button', { name: /Gestión Financiera/ }).click();
        await page.getByRole('button', { name: /Generar/ }).click();
        await expect(page.getByRole('button', { name: /Descargar/ })).toBeVisible();
    });

    test('AI Quick Summary should appear when selecting a patient', async ({ page }) => {
        // Login as doc_house
        await page.goto('/');
        await page.locator('#username-input').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: /Inicio de Sesión Seguro/ }).click();

        // Wait for dashboard
        await expect(page.getByRole('heading', { name: /Mis Pacientes/ }).first()).toBeVisible();

        // Select first patient
        await page.getByText('123****789').first().click();

        // Check for AI Summary area
        await expect(page.getByText('Resumen Clínico Inteligente (IA)')).toBeVisible({ timeout: 10000 });
    });
});
