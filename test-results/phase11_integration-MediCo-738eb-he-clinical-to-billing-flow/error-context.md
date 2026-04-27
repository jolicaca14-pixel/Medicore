# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase11_integration.spec.ts >> MediCore Phase 11 Integration Flow >> should complete the clinical to billing flow
- Location: tests/phase11_integration.spec.ts:4:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Doc House' })

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - img [ref=e6]
  - heading "Error de Configuración" [level=1] [ref=e8]
  - paragraph [ref=e9]:
    - text: La clave API de Gemini (VITE_GEMINI_API_KEY) no está configurada en su archivo
    - code [ref=e10]: .env.local
    - text: .
  - paragraph [ref=e11]: Por favor, siga las instrucciones en el archivo README.md para configurar su clave y habilitar las funciones de IA.
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('MediCore Phase 11 Integration Flow', () => {
  4  |   test('should complete the clinical to billing flow', async ({ page }) => {
  5  |     await page.goto('/');
  6  |
  7  |     // 1. Login as Doc House (Professional)
> 8  |     await page.getByRole('button', { name: 'Doc House' }).click();
     |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  9  |     await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
  10 |     await expect(page.getByRole('heading', { name: 'Mis Pacientes' })).toBeVisible();
  11 |
  12 |     // 2. Search and Select Patient
  13 |     await page.locator('#patient-search').fill('Armando');
  14 |     await page.getByText('Armando Casas').click();
  15 |     await expect(page.getByRole('heading', { name: 'Armando Casas' })).toBeVisible();
  16 |
  17 |     // 3. Create Draft HCE (Automatic save simulation)
  18 |     await page.locator('#chief-complaint-input').fill('Prueba de integracion Fase 11');
  19 |     await page.getByRole('button', { name: 'Guardar' }).click();
  20 |     await expect(page.getByText('¡Guardado!')).toBeVisible();
  21 |
  22 |     // 4. Finalize HCE (Requires password)
  23 |     await page.getByRole('button', { name: 'Finalizar & RDA' }).click();
  24 |     await page.locator('input[type="password"]').fill('12345678');
  25 |     await page.getByRole('button', { name: 'Firmar Historia' }).click();
  26 |
  27 |     // Wait for success and redirection
  28 |     await expect(page.getByRole('heading', { name: 'Mis Pacientes' })).toBeVisible({ timeout: 10000 });
  29 |
  30 |     // 5. Switch to Admin and check billing
  31 |     await page.getByRole('button', { name: 'Cerrar Sesión' }).click();
  32 |     await page.getByRole('button', { name: 'Administrador' }).click();
  33 |     await page.getByRole('button', { name: 'Inicio de Sesión Seguro' }).click();
  34 |
  35 |     // Navigate to Reports (Financial Management)
  36 |     await page.getByRole('button', { name: 'Analítica Financiera' }).click();
  37 |     await page.getByRole('button', { name: 'Facturación Automática' }).click();
  38 |
  39 |     // Verify invoice presence (the first one should be the new one)
  40 |     await expect(page.getByText('FAC-')).first().toBeVisible();
  41 |     await expect(page.getByText('Armando Casas')).first().toBeVisible();
  42 |   });
  43 | });
  44 |
```