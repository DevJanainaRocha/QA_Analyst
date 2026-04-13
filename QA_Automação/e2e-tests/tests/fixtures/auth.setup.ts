/**
 * Setup de autenticação — executado UMA vez antes dos testes.
 * Salva o estado de autenticação (localStorage + cookies) em
 * tests/fixtures/.auth/user.json para ser reutilizado por todos os testes.
 */

import { test as setup, expect } from '@playwright/test';
import { ROUTES, TEST_USERS, TOKEN_KEY, USER_KEY } from './test-data';

const AUTH_FILE = 'tests/fixtures/.auth/user.json';

setup('autenticar usuário de teste', async ({ page }) => {
  await page.goto(ROUTES.login);

  // Aguarda o formulário de login carregar
  await expect(page.getByPlaceholder('E-MAIL')).toBeVisible();

  // Preenche as credenciais
  await page.getByPlaceholder('E-MAIL').fill(TEST_USERS.standard.email);
  await page.getByPlaceholder('SENHA').fill(TEST_USERS.standard.password);

  // Submete o formulário
  await page.getByRole('button', { name: /entrar/i }).click();

  // Aguarda redirecionar para o dashboard
  await page.waitForURL('**/#/dashboard', { timeout: 15_000 });

  // Valida que o token foi salvo no localStorage
  const token = await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY);
  expect(token).toBeTruthy();

  // Salva o estado completo (localStorage, cookies, sessionStorage)
  await page.context().storageState({ path: AUTH_FILE });
});
