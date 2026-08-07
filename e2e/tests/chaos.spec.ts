import { test, expect } from '@playwright/test';

test.describe('Chaos Engineering - Identity Resilience', () => {
  // Nota: Isso requer que o backend honre Chaos flags, ou podemos mockar a network.
  // Para frontend E2E, a forma mais rápida de simular backend caindo é interceptar
  // e forçar 503 no Playwright.

  test('Deve degradar elegantemente se a API retornar 503 (D1 Down)', async ({ page }) => {
    // Interceptando a chamada de login
    await page.route('**/api/v1/identity/login', (route) => {
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.' }),
      });
    });

    await page.goto('/auth/jwt/sign-in');
    await page.fill('input[name="email"]', 'chaos@asppibra.com.br');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Deve exibir o Toast de erro com a mensagem amigável, e não quebrar a tela inteira (White Screen of Death)
    await expect(page.locator('text=Serviço temporariamente indisponível')).toBeVisible();
  });

});
