import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../fixtures/test-data';

/**
 * Page Object do Dashboard (Home).
 * O dashboard é a primeira tela após o login.
 */
export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly charts: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.heading       = page.getByRole('heading').first();
    this.charts        = page.locator('[data-highcharts-chart], .highcharts-container');
    this.loadingSpinner = page.getByRole('progressbar');
  }

  async navigate() {
    await this.page.goto(ROUTES.dashboard);
    await this.waitForDashboardLoad();
  }

  async waitForDashboardLoad() {
    // Aguarda a URL correta
    await expect(this.page).toHaveURL(/\/#\/dashboard/, { timeout: 15_000 });
    // Aguarda spinner sumir
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }

  async isDashboardVisible(): Promise<boolean> {
    return this.page.url().includes('#/dashboard');
  }
}
