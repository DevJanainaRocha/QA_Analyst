import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../fixtures/test-data';

/**
 * Page Object da página de Usuários (Users.tsx).
 *
 * Estrutura real da página:
 *   - Tabela com paginação (ITEMS_PER_PAGE = 10)
 *   - Colunas: foto, nome, e-mail, telefone, cargo, rede/unidade, ativo, ações
 *   - Botão de adicionar abre AddUserModal
 *   - Clicar em uma linha abre AddUserModal no modo edição
 *   - Botão de excluir (ícone de lixeira) abre DeleteConfirmationModal
 *
 * Controle de acesso (permissions.ts):
 *   - ADMIN: vê e gerencia todos os usuários
 *   - GESTOR_REDE: vê e gerencia usuários da sua rede
 *   - GESTOR_UNIDADE: vê e gerencia usuários da sua unidade
 *   - VISUALIZADOR: só leitura, sem botões de ação
 *
 * API: GET /api/users?page=&limit=
 */
export class UsersPage extends BasePage {
  // ─── Ações globais ────────────────────────────────────────────────────────
  readonly addButton: Locator;

  // ─── Tabela ───────────────────────────────────────────────────────────────
  readonly tableRows: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);

    // Botão de adicionar — Users.tsx
    this.addButton = page.getByRole('button', { name: /adicionar|novo usuário|\+/i }).first();

    // Linhas da tabela MUI
    this.tableRows      = page.locator('tbody tr');
    this.loadingSpinner = page.getByRole('progressbar');
  }

  async navigate(): Promise<void> {
    await this.page.goto(ROUTES.users);
    await this.waitForLoad();
    await expect(this.page).toHaveURL(/\/#\/users/);
  }

  async waitForTableLoad(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle');
  }

  async clickAddUser(): Promise<void> {
    await this.addButton.click();
    await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  }

  async getRowCount(): Promise<number> {
    return this.tableRows.count();
  }

  /** Clica no ícone de excluir de uma linha específica */
  async clickDeleteOnRow(index: number): Promise<void> {
    const row = this.tableRows.nth(index);
    await row.getByRole('button').filter({ has: this.page.locator('[data-testid="DeleteIcon"]') }).click();
    await expect(this.page.getByRole('dialog')).toBeVisible({ timeout: 5_000 });
  }

  /** Retorna o texto de uma célula específica */
  async getCellText(rowIndex: number, colIndex: number): Promise<string> {
    return this.tableRows.nth(rowIndex).locator('td').nth(colIndex).innerText();
  }
}
