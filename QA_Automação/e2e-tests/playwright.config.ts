import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // A aplicação usa HashRouter: todas as rotas são /#/rota
    baseURL: 'https://expanziohm.sitelbra.com.br',

    // Captura evidências em caso de falha
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Tempo máximo para cada ação
    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    // Ignora erros de certificado SSL em homologação
    ignoreHTTPSErrors: true,
  },

  projects: [
    // Projeto de setup: realiza login e salva estado de autenticação
    {
      name: 'setup',
      testDir: './tests/fixtures',
      testMatch: '**/auth.setup.ts',
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Projeto sem autenticação (para testes de login e smoke público)
    {
      name: 'chromium-no-auth',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/auth.spec.ts', '**/smoke.spec.ts'],
    },
  ],

  outputDir: 'test-results/',
});
