import { test, expect } from '@playwright/test';

const ROLES = [
  { name: 'Médico', username: 'doc_house', password: '12345678', expectedTitle: /Panel Principal|Mis Pacientes/ },
  { name: 'Admin', username: 'admin', password: '80123456', expectedTitle: /Panel Principal/ },
  { name: 'Secretaria', username: 'sandra_sec', password: '24681357', expectedTitle: /Recepción|Agenda de Citas/ }
];

test.describe('Persona Audit Suite - Stability & Accessibility', () => {
  for (const role of ROLES) {
    for (let i = 1; i <= 5; i++) {
      test(`${role.name} - Iteration ${i}`, async ({ page }) => {
        // 1. Navegación e Inicio de Sesión
        await page.goto('/');

        // Usar locadores robustos según memoria
        await page.getByLabel('Usuario').fill(role.username);
        await page.locator('#password-input').fill(role.password);

        await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();

        // 2. Verificación de Dashboard
        // Se usa .first() y regex flexible para manejar roles duales
        const heading = page.getByRole('heading', { name: role.expectedTitle }).first();
        await expect(heading).toBeVisible({ timeout: 10000 });

        // 3. Simulación de Flujo Típico
        if (role.name === 'Médico') {
          // Buscar paciente
          await page.getByPlaceholder(/Buscar por nombre o/i).fill('Juan');
          await expect(page.getByText('Juan Pérez')).toBeVisible();
        } else if (role.name === 'Secretaria') {
          // Cambiar a pestaña Pacientes
          await page.getByRole('button', { name: 'Pacientes' }).click();
          await expect(page.getByRole('heading', { name: 'Directorio de Pacientes' })).toBeVisible();
        } else if (role.name === 'Admin') {
          // Cambiar a Gestión Usuarios
          await page.getByRole('button', { name: 'Gestión Usuarios' }).click();
          await expect(page.getByRole('heading', { name: /Gestión Usuarios|Usuarios del Sistema/ })).toBeVisible();
        }

        // 4. Cierre de Sesión
        await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
        await expect(page.getByRole('button', { name: 'Inicio de Sesión Seguro' })).toBeVisible();
      });
    }
  }
});
