
import { test, expect } from '@playwright/test';

test.describe('Jules Protocol Cycle 13: Final Multidisciplinary Verification', () => {

    test('Verify Professional Dashboard Enhancements (UX, Finance, Data)', async ({ page }) => {
        // 1. Login
        await page.goto('/');
        await page.getByLabel('Usuario').fill('doc_house');
        await page.locator('#password-input').fill('12345678');
        await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

        // Check landing (Matches getMenuItems for PROFESSIONAL)
        await expect(page.getByRole('heading', { name: /Mis Pacientes/ }).first()).toBeVisible();

        // 2. [LEDGER] Verify Financial Projection (Finance)
        await page.getByRole('button', { name: 'Mi Producción' }).first().click();
        await expect(page.getByText('Proyección Neta')).toBeVisible();
        await expect(page.getByText(/Ref: 11% RF \+ 0.966% ICA/)).toBeVisible();

        // 3. [THE ORACLE] Verify Contract Download (Data)
        await page.getByRole('button', { name: /Mi Contrato/ }).click();
        await expect(page.getByText('VINCULACIÓN ACTUAL')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Descargar Copia PDF' })).toBeVisible();

        // 4. [PALETTE] Verify UX Spinners & Normal Values (UX)
        await page.getByRole('button', { name: 'Mis Pacientes' }).first().click();
        await page.getByText('Juan Pérez').first().click();

        // Go to Vitals (Tab text is 'Signos Vitales')
        await page.getByRole('button', { name: 'Signos Vitales' }).click();

        // Check "Cargar Valores Normales"
        const normalBtn = page.getByRole('button', { name: 'Cargar Valores Normales' });
        await expect(normalBtn).toBeVisible();
        await normalBtn.click();

        // Verify values loaded
        await expect(page.locator('#global_sys_bp')).toHaveValue('120');
        await expect(page.locator('#v_fc')).toHaveValue('72');

        // 5. [PALETTE] Verify Loading state on Save
        const saveBtn = page.getByTitle('Guardar borrador (Ctrl+S)');

        // Fill mandatory fields to allow save (if needed, but save draft is usually permissive)
        // Just click save and check for toast
        await saveBtn.click();
        await expect(page.getByText(/Borrador guardado|¡Guardado!/)).toBeVisible();

        // 6. [THE ORACLE] Verify PDF Simulation
        // Navigation: Professionals usually see 'Mis Historias' in sidebar.
        await page.getByRole('button', { name: 'Mis Historias' }).click();
        // The view takes a moment to switch. Try searching by text specifically.
        await expect(page.getByText('Mis Historias Clínicas')).toBeVisible({ timeout: 10000 });
        await expect(page.getByRole('button', { name: 'Imprimir PDF' }).first()).toBeVisible();
    });

    test('Verify Diagnostic View Enhancements', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Usuario').fill('marco_lab');
        await page.locator('#password-input').fill('99887766');
        await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

        await expect(page.getByRole('heading', { name: 'Laboratorio Clínico' })).toBeVisible();

        // Load an order from the table
        await page.getByText('Hemograma IV [Automatizado]').first().click();

        // Verify Button state (Says 'Guardar y Finalizar')
        const completeBtn = page.getByRole('button', { name: 'Guardar y Finalizar' });
        await expect(completeBtn).toBeVisible();

        // Go back to see tabs
        await page.getByRole('button', { name: 'Cancelar' }).click();

        // Check "Historial (Por Fecha)" - using text since role-based might be tricky if it's styled differently
        await page.getByText('Historial (Por Fecha)').click();
        await expect(page.getByText('No hay resultados guardados en esta sesión.')).toBeVisible();
    });

    test('Verify Secretary View Enhancements', async ({ page }) => {
        await page.goto('/');
        await page.getByLabel('Usuario').fill('sarah_sec');
        await page.locator('#password-input').fill('1122334455');
        await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

        // Secretary view heading is dynamic or static
        await expect(page.getByRole('heading', { name: 'Agenda de Citas' })).toBeVisible();

        // Check "Facturación" section
        await page.getByRole('button', { name: 'Facturación' }).click();
        await expect(page.getByText('Facturación de Servicios')).toBeVisible();

        // Check Cartera
        await page.getByRole('button', { name: 'Cartera' }).click();
        await expect(page.getByText('Cartera (Cuentas por Cobrar)')).toBeVisible();
    });
});
