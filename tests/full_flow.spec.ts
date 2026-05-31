import { test, expect } from '@playwright/test';

test.describe('MediCore Pro - Full Patient Care Flow', () => {
    test('Professional should be able to complete a full consultation cycle', async ({ page }) => {
        // 1. Login
        await page.goto('/');
        await page.fill('#username-input', 'doc_house');
        await page.fill('#password-input', '12345678');
        await page.click('button:has-text("Inicio de Sesión Seguro")');

        // 2. Dashboard - Select Patient
        await expect(page.getByText('Dra. Elena Foster').or(page.getByText('Dr. Gregory House'))).toBeVisible();
        await page.click('text=Elena Nito del Bosque');

        // 3. Clinical Record - Fill basic info
        await page.fill('textarea[id="d_motivo"]', 'Paciente consulta por cefalea intensa de 3 días de evolución.');

        // 4. Fill Vital Signs
        await page.fill('input[id="global_sys_bp"]', '120');
        await page.fill('input[id="global_dia_bp"]', '80');
        await page.fill('input[id="global_heart_rate"]', '75');

        // 5. Add Diagnosis
        await page.click('button:has-text("Codificación y Órdenes")');
        await page.fill('input[placeholder="Buscar código o nombre CIE-11..."]', 'Cefalea');
        await page.click('text=G442 - Cefalea de tipo tensional');

        // 6. Add Prescription
        await page.fill('input[placeholder="Buscar o escribir nuevo..."]', 'Acetaminofen');
        await page.fill('input[placeholder="Ej. 500mg"]', '500');
        await page.click('button:has-text("Agregar")');

        // 7. Finalize
        await page.click('button:has-text("Finalizar & RDA")');
        await page.fill('input[placeholder="Contraseña o Documento"]', '12345678');
        await page.click('button:has-text("Firmar Historia")');

        // 8. Verification - Return to list
        await expect(page.getByText('Mis Pacientes')).toBeVisible();
    });
});
