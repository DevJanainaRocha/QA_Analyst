import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../fixtures/test-data';

/**
 * Page Object da página de Atividades (ActivitiesPage.tsx).
 *
 * Estrutura real da página:
 *   - Tabela com paginação (ITEMS_PER_PAGE = 10) via CustomPagination
 *   - Colunas: nome, unidade/rede, etapa, prioridade, prazo, status, responsáveis, ações
 *   - Botão de adicionar atividade abre AddActivityModal
 *   - Clicar em uma linha abre AddActivityModal no modo "visualizar"
 *   - Botão de excluir abre DeleteConfirmationModal
 *
 * API: GET /api/activities?page=&limit=&fromActivitiesPage=true
 */
export class ActivitiesPage extends BasePage {
  // ─── Cabeçalho / ações globais ────────────────────────────────────────────
  readonly addButton: Locator;

  // ─── Tabela ───────────────────────────────────────────────────────────────
  readonly tableRows: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyState: Locator;

  // ─── Paginação (CustomPagination.tsx) ────────────────────────────────────
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);

    // Botão de adicionar — ActivitiesPage.tsx usa Button com ícone ou texto de adicionar
    this.addButton = page.getByRole('button', { name: /adicionar|nova atividade|\+/i }).first();

    // Linhas da tabela MUI
    this.tableRows    = page.locator('tbody tr');
    this.loadingSpinner = page.getByRole('progressbar');
    this.emptyState   = page.getByText(/nenhuma atividade|sem atividades/i);

    // Paginação
    this.pagination = page.getByRole('navigation').filter({ has: page.getByRole('button') });
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.activities);
    await this.waitForLoad();
    await expect(this.page).toHaveURL(/\/#\/activities/);
  }

  /** Aguarda a tabela de atividades aparecer ou o estado vazio */
  async waitForTableLoad(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }

  /** Abre o modal de nova atividade */
  async clickAddActivity(): Promise<void> {
    await this.addButton.click();
    await expect(
      this.page.getByRole('dialog')
    ).toBeVisible({ timeout: 5_000 });
  }

  /** Clica em uma linha da tabela pelo índice (0 = primeira linha) */
  async clickRow(index: number): Promise<void> {
    await this.tableRows.nth(index).click();
    await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  }

  /** Retorna o número de linhas atualmente visíveis na tabela */
  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  /** Clica no botão de excluir de uma linha (ícone de lixeira) */
  async clickDeleteOnRow(index: number): Promise<void> {
    const row = this.tableRows.nth(index);
    await row.getByRole('button', { name: /delete|excluir/i }).click();
    await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  }
}
