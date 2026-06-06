import { test, expect } from '@playwright/test';

test.describe('Full Clinical Flow (Patient -> Record -> Prescription -> Invoice)', () => {
    test('should complete a full clinical cycle', async ({ page }) => {
        // 1. Login
        await page.goto('http://localhost:3000');
        await page.fill('#username-input', 'doc_house');
        await page.fill('#password-input', '12345678');
        await page.click('button:has-text("Inicio de Sesión Seguro")');

        await expect(page.locator('text=Dr. Gregory House')).toBeVisible();

        // 2. Select Patient and Start Record
        // Wait for patients to load
        await expect(page.locator('text=Mis Pacientes')).toBeVisible();
        await page.click('text=Elena Nito del Bosque');

        await expect(page.locator('text=Elena Nito del Bosque')).toBeVisible();

        // 3. Fill Clinical Data
        // Use more specific locators if possible, or wait for visibility
        await page.locator('label:has-text("Motivo de Consulta") + textarea').fill('Dolor abdominal persistente');
        await page.locator('label:has-text("Enfermedad Actual") + textarea').fill('Paciente refiere dolor en hipocondrio derecho de 3 días de evolución.');

        // 4. Add Diagnosis
        await page.click('text=Codificación y Órdenes');
        await page.fill('placeholder="Buscar código o nombre CIE-11..."', 'K80');
        await page.click('text=K80 - Colelitiasis');

        // 5. Add Prescription
        await page.fill('placeholder="Buscar o escribir nuevo..."', 'Acetaminofén');
        await page.fill('label:has-text("Dosis") + input', '500mg');
        await page.click('button:has-text("Agregar")');

        // 6. Finalize with Password
        await page.click('button:has-text("Finalizar & RDA")');
        await page.fill('placeholder="Contraseña o Documento"', '12345678');
        await page.click('button:has-text("Firmar Historia")');

        // 7. Verify Success
        await expect(page.locator('text=Historia finalizada')).toBeVisible({ timeout: 10000 });
    });
});
