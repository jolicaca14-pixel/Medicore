import { test, expect } from '@playwright/test';

test.describe('MediCore Pro - Autonomous Audit (Phase 10)', () => {

    test('PII Masking is applied in patient list', async ({ page }) => {
        await page.goto('/');

        // Login as Professional
        await page.locator('#username-input').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: /Ingresar|Entrar|Inicio de Sesión/ }).click();

        // Wait for patient list
        await expect(page.getByRole('heading', { name: 'Mis Pacientes' }).first()).toBeVisible();

        // Check for masked IDs (regex for 3 digits + **** + 3 digits)
        const maskedId = page.locator('span').filter({ hasText: /^\d{3}\*\*\*\*\d{3}$/ }).first();
        await expect(maskedId).toBeVisible();
    });

    test('AI Quick Summary button exists and triggers generation', async ({ page }) => {
        await page.goto('/');
        await page.locator('#username-input').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: /Ingresar|Entrar|Inicio de Sesión/ }).click();

        // Open first patient
        await page.locator('.grid > div').first().click();

        // Check for AI Summary button
        const aiBtn = page.getByRole('button', { name: 'RESUMEN RÁPIDO (AI)' });
        await expect(aiBtn).toBeVisible();

        // Click and check for loading or result (mock service)
        await aiBtn.click();
        // Since it's an AI call, we might see "GENERANDO..."
        // Then it should display the summary banner
        await expect(page.locator('h4:has-text("Resumen Clínico Inteligente")')).toBeVisible({ timeout: 10000 });
    });

    test('Admin Dashboard shows Nómina Proyectada', async ({ page }) => {
        await page.goto('/');

        // Login as Admin
        await page.locator('#username-input').fill('admin');
        await page.locator('#password-input').fill('80123456');
        await page.getByRole('button', { name: /Ingresar|Entrar|Inicio de Sesión/ }).click();

        // Check for "Nómina Proyectada" card
        await expect(page.getByText('NÓMINA PROYECTADA')).toBeVisible();
        // Check that it has a currency value (should be within the card)
        const payrollCard = page.locator('div').filter({ hasText: 'NÓMINA PROYECTADA' }).last();
        await expect(payrollCard.locator('h3:has-text("$")')).toBeVisible();
    });

    test('Quick Look tooltip appears on hover', async ({ page }) => {
        await page.goto('/');
        await page.locator('#username-input').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: /Ingresar|Entrar|Inicio de Sesión/ }).click();

        // Hover over first patient card
        await page.locator('.grid > div').first().hover();

        // Check for "Vista Rápida" text
        await expect(page.getByText('Vista Rápida')).toBeVisible();
        await expect(page.getByText('Últimos Signos:')).toBeVisible();
    });
});
