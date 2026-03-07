import { test, expect } from '@playwright/test';

test.describe('Billing and Payment Flow', () => {
  test('Secretary can create an appointment, generate an invoice, and record a payment', async ({ page }) => {
    // 1. Login as Secretary
    await page.goto('/');
    await page.fill('#username-input', 'sandra_sec');
    await page.fill('#password-input', '24681357');
    await page.click('button:has-text("Inicio de Sesión Seguro")');

    await expect(page.locator('text=Recepción')).toBeVisible();

    // 2. Go to Agenda and Create Appointment
    await page.click('button:has-text("Agenda")');
    await page.click('button:has-text("Nueva Cita")');

    await page.selectOption('select:has-text("Seleccione...")', { label: 'Elena Nito del Bosque' });
    await page.selectOption('select:has-text("Seleccione Médico/a...")', { label: 'Dra. Elena Foster - Medicina General' });
    await page.fill('input[placeholder="Ej. Control"]', 'Consulta de Seguimiento');

    // Add procedure to auto-bill
    await page.selectOption('#cupsSelect', { label: '903841 - Creatinina' });

    await page.click('button:has-text("Agendar y Facturar")');

    // Handle alert
    page.on('dialog', dialog => dialog.accept());

    // 3. Go to Cartera and verify invoice
    await page.click('button:has-text("Cartera")');
    await expect(page.locator('text=Elena Nito del Bosque')).toBeVisible();
    await expect(page.locator('text=PENDING')).toBeVisible();

    // 4. Record Payment
    await page.click('button:has-text("Abonar")');
    // Handle prompt via dialog event
    page.on('dialog', async dialog => {
      await dialog.accept('50000');
    });

    await expect(page.locator('text=PARTIAL')).toBeVisible();
  });
});
