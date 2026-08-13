import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Acessibilidade (A11Y) - Identity Domain', () => {

  test('A página de Login não deve ter violações de acessibilidade detectáveis automaticamente', async ({ page }) => {
    await page.goto('/login');
    
    // Aguarda o formulário principal renderizar
    await page.waitForSelector('form');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('A página de Registro não deve ter violações de acessibilidade detectáveis automaticamente', async ({ page }) => {
    await page.goto('/register');
    
    await page.waitForSelector('form');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

});
