import { test, expect } from '@playwright/test';

test.describe('Administrative and HR Flows (Phase 11)', () => {

  test('Secretary can access billing and register payment', async ({ page }) => {
    // 1. Login as Secretary
    await page.goto('http://localhost:3000/');
    await page.fill('#username-input', 'sandra_sec');
    await page.fill('#password-input', '24681357');
    await page.click('button:has-text("Inicio de Sesión")');

    // Wait for the specific sidebar to appear
    await expect(page.locator('text=Recepción')).toBeVisible({ timeout: 15000 });

    // 2. Navigate to Cartera
    await page.locator('nav >> text=Cartera').click();
    await expect(page.locator('text=Cartera (Cuentas por Cobrar)')).toBeVisible();

    // 3. Select an invoice and pay
    page.on('dialog', async dialog => {
        if (dialog.type() === 'prompt') {
            await dialog.accept('45000');
        } else {
            await dialog.accept();
        }
    });

    await page.click('button:has-text("Abonar")', { force: true });

    // 4. Verify success state
    await expect(page.getByText('PAID').first()).toBeVisible({ timeout: 10000 });
  });

  test('Professional can access HR and respond to disciplinary action', async ({ page }) => {
    // 1. Login as Professional
    await page.goto('http://localhost:3000/');
    await page.fill('#username-input', 'doc_elena');
    await page.fill('#password-input', '1098765432');
    await page.click('button:has-text("Inicio de Sesión")');

    // Ensure dashboard is loaded
    await expect(page.locator('text=Mis Pacientes')).toBeVisible({ timeout: 15000 });

    // 2. Navigate to HR tab via Sidebar
    await page.locator('aside >> text=Talento Humano').click();

    // 3. Verify HR View
    await expect(page.locator('text=Mi Contrato y Gestión Humana')).toBeVisible({ timeout: 10000 });

    // 4. Find a disciplinary action
    const actionHeading = page.getByRole('heading', { name: 'Llegada Tarde' });
    if (await actionHeading.isVisible()) {
        await page.getByRole('button', { name: 'Redactar Descargos' }).click();
        await page.getByPlaceholder('Escriba aquí sus descargos...').fill('Fue un problema de tráfico inusual.');
        await page.getByRole('button', { name: 'Guardar y Enviar' }).click();

        // Verify response is displayed
        await expect(page.getByText('Fue un problema de tráfico inusual.')).toBeVisible();
    }
  });

  test('Professional can generate Anexo 2', async ({ page }) => {
    // 1. Login as Professional
    await page.goto('http://localhost:3000/');
    await page.fill('#username-input', 'doc_elena');
    await page.fill('#password-input', '1098765432');
    await page.click('button:has-text("Inicio de Sesión")');

    // Ensure dashboard is loaded
    await expect(page.locator('text=Mis Pacientes')).toBeVisible({ timeout: 15000 });

    // 2. Open a patient
    await page.locator('text=Juan Pérez').first().click();

    // 3. Open Anexo 2
    await page.locator('button:has-text("Anexo 2")').click();
    await expect(page.locator('text=Anexo 2: Remisión a Especialista')).toBeVisible();

    // 4. Fill and click print (we can't easily verify the print window in E2E, but we check the button exists)
    await page.getByPlaceholder('Describa el motivo clínico de la remisión...').fill('Paciente requiere valoración por cardiología.');
    const printBtn = page.getByRole('button', { name: 'Imprimir Anexo' });
    await expect(printBtn).toBeEnabled();
  });

});
