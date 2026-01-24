import { test, expect } from '@playwright/test';

test.describe('Persona Audit Simulations (5x each)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'MediCore Pro' })).toBeVisible();
  });

  const login = async (page, username, password) => {
    await page.locator('#username-input').fill(username);
    await page.locator('#password-input').fill(password);
    await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
  };

  // 1. PSICÓLOGO AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Psychologist Audit Session ${i}`, async ({ page }) => {
      await login(page, 'psicologa', '55667788');
      await page.getByPlaceholder('Buscar por nombre o ID...').fill('Juan Pérez');
      await page.getByText('Juan Pérez').first().click();
      await page.locator('select').filter({ hasText: 'Historia Medicina General' }).selectOption({ label: 'Consulta Psicológica' });
      await page.getByRole('button', { name: 'Examen Mental' }).click();
      await page.getByLabel('Porte y Actitud').fill(`Stress Test iteration ${i}`);
      await page.getByRole('button', { name: 'Guardar' }).first().click();
      page.once('dialog', dialog => dialog.dismiss());
    });
  }

  // 2. CONTADOR AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Accountant Audit Session ${i}`, async ({ page }) => {
      await login(page, 'contador_demo', '11224455');
      await page.getByRole('button', { name: 'Gestión Financiera' }).click();
      await page.getByRole('button', { name: 'Generar' }).click();
      await expect(page.getByText('Previsualización')).toBeVisible();
    });
  }

  // 3. NUTRICIONISTA AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Nutritionist Audit Session ${i}`, async ({ page }) => {
      await login(page, 'nutri_demo', '13572468');
      await page.getByText('María González').first().click();
      await page.locator('select').filter({ hasText: 'Historia Medicina General' }).selectOption({ label: 'Historia Nutrición' });
      await page.getByRole('button', { name: 'Valoración Nutricional' }).click();
      await page.getByLabel('Peso').fill('70');
      await page.getByLabel('Talla').fill('1.70');
      await expect(page.getByPlaceholder('Calculando...').first()).toHaveValue('24.22');
    });
  }

  // 4. SECRETARIA AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Secretary Audit Session ${i}`, async ({ page }) => {
      await login(page, 'sarah_sec', '1122334455');
      await page.getByRole('button', { name: 'Agenda' }).click();
      await page.getByRole('button', { name: 'Nueva Cita' }).click();
      await page.getByLabel('Paciente').selectOption({ label: 'Juan Pérez' });
      await page.getByLabel('Profesional').selectOption({ label: 'Dra. Elena Foster - Medicina Interna' });
      await page.getByLabel('Motivo').fill(`Stress test ${i}`);
      page.once('dialog', dialog => dialog.dismiss());
      await page.getByRole('button', { name: 'Agendar y Facturar' }).click();
    });
  }

  // 5. DOC HOUSE AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Doc House Audit Session ${i}`, async ({ page }) => {
      await login(page, 'doc_house', '12345678');
      await page.getByText('Juan Pérez').first().click();
      await page.getByLabel('Motivo de Consulta').fill(`It's never lupus - iteration ${i}`);
      await page.getByRole('button', { name: 'Guardar' }).first().click();
      page.once('dialog', dialog => dialog.dismiss());
    });
  }

  // 6. TESORERO AUDIT (5x)
  for (let i = 1; i <= 5; i++) {
    test(`Treasurer Audit Session ${i}`, async ({ page }) => {
      await login(page, 'tesorero_demo', '55442211');
      await page.getByRole('button', { name: 'Talento Humano' }).click();
      await page.getByRole('button', { name: 'Cuentas de Cobro' }).click();
      await expect(page.getByText('Gestión de Cuentas de Cobro (OPS)')).toBeVisible();
    });
  }
});
