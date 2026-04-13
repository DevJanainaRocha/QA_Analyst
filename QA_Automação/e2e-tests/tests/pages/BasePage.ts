import { type Page, type Locator, expect } from '@playwright/test';
import { TOKEN_KEY, USER_KEY } from '../fixtures/test-data';

/**
 * Classe base para todos os Page Objects das páginas autenticadas.
 *
 * Estrutura real do Layout (Layout.tsx):
 * - Sidebar: <Box component="nav"> com NavLinks → renderiza <a> tags
 * - Os nomes dos itens vêm de constants/index.tsx (ex: "DASHBOARD", "ATIVIDADES")
 * - Topbar: AppBar com busca, notificações, toggle de tema, menu de configurações
 *
 * Uso:
 *   class MinhaPage extends BasePage {
 *     constructor(page: Page) { super(page); }
 *   }
 */
export class BasePage {
  readonly page: Page;

  // ─── Sidebar — itens de menu (NavLink → <a> com o nome da rota) ───────────
  // Nomes exatos definidos em src/constants/index.tsx
  readonly menuDashboard: Locator;
  readonly menuAtividades: Locator;
  readonly menuLicencas: Locator;
  readonly menuOrgaosPublicos: Locator;
  readonly menuPrestadores: Locator;
  readonly menuRedes: Locator;
  readonly menuUsuarios: Locator;
  readonly menuFinanceiro: Locator;
  readonly menuConsultor: Locator;

  // ─── Topbar ───────────────────────────────────────────────────────────────
  readonly searchInput: Locator;
  readonly notificationsButton: Locator;
  readonly settingsButton: Locator;
  readonly userGreeting: Locator;
  readonly themeToggle: Locator;

  // ─── Menu de configurações (abre ao clicar em settingsButton) ─────────────
  readonly settingsMenuPreferences: Locator;
  readonly settingsMenuPassword: Locator;
  readonly settingsMenuProfile: Locator;
  readonly settingsMenuLogout: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sidebar: NavLink renderiza <a> cujo texto acessível é o nome do item
    this.menuDashboard      = page.getByRole('link', { name: 'DASHBOARD' });
    this.menuAtividades     = page.getByRole('link', { name: 'ATIVIDADES' });
    this.menuLicencas       = page.getByRole('link', { name: 'LICENÇAS E VISTORIAS' });
    this.menuOrgaosPublicos = page.getByRole('link', { name: 'ORGÃOS PÚBLICOS' });
    this.menuPrestadores    = page.getByRole('link', { name: 'PRESTADORES' });
    this.menuRedes          = page.getByRole('link', { name: 'REDES' });
    this.menuUsuarios       = page.getByRole('link', { name: 'USUARIOS' });
    this.menuFinanceiro     = page.getByRole('link', { name: 'FINANCEIRO' });
    this.menuConsultor      = page.getByRole('link', { name: 'CONSULTOR E+' });

    // Topbar — locators baseados nos aria-labels e placeholders reais do Layout.tsx
    this.searchInput        = page.getByPlaceholder('Pesquise aqui...');
    this.notificationsButton = page.getByRole('button', { name: 'notifications' });
    // Notifications button tem aria-label="notifications"; settings button é o próximo button no DOM
    this.settingsButton     = page.getByRole('button', { name: 'notifications' }).locator('xpath=following::button[1]');
    this.userGreeting       = page.getByText(/^Bom dia,/);
    this.themeToggle        = page.locator('[aria-label*="mode"], [aria-label*="tema"]')
                                  .or(page.locator('svg[data-testid="LightModeIcon"]').locator('..').locator('..'));

    // Menu de configurações — textos exatos do Layout.tsx
    this.settingsMenuPreferences = page.getByRole('menuitem', { name: 'Preferências do Sistema' });
    this.settingsMenuPassword    = page.getByRole('menuitem', { name: 'Edição de Senha' });
    this.settingsMenuProfile     = page.getByRole('menuitem', { name: 'Edição de Perfil Pessoal' });
    this.settingsMenuLogout      = page.getByRole('menuitem', { name: 'Sair/ Deslogar' });
  }

  // ─── Navegação ─────────────────────────────────────────────────────────────

  /**
   * Navega para um caminho relativo e aguarda a página carregar.
   * Exemplos: navigate('/#/dashboard'), navigate('/')
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForLoad();
  }

  /**
   * Aguarda a página estabilizar (sem requisições de rede pendentes).
   * Usa networkidle para garantir que chamadas de API concluíram.
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 20_000 });
  }

  /**
   * Retorna o título da aba/janela atual.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  // ─── Menu lateral — ações de navegação ───────────────────────────────────

  async goToDashboard(): Promise<void> {
    await this.menuDashboard.click();
    await this.page.waitForURL('**/#/dashboard', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToAtividades(): Promise<void> {
    await this.menuAtividades.click();
    await this.page.waitForURL('**/#/activities', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToLicencas(): Promise<void> {
    await this.menuLicencas.click();
    await this.page.waitForURL('**/#/licenses', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToOrgaosPublicos(): Promise<void> {
    await this.menuOrgaosPublicos.click();
    await this.page.waitForURL('**/#/publics', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToPrestadores(): Promise<void> {
    await this.menuPrestadores.click();
    await this.page.waitForURL('**/#/providers', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToRedes(): Promise<void> {
    await this.menuRedes.click();
    await this.page.waitForURL('**/#/networks', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToUsuarios(): Promise<void> {
    await this.menuUsuarios.click();
    await this.page.waitForURL('**/#/users', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToFinanceiro(): Promise<void> {
    await this.menuFinanceiro.click();
    await this.page.waitForURL('**/#/finances', { timeout: 10_000 });
    await this.waitForLoad();
  }

  async goToConsultor(): Promise<void> {
    await this.menuConsultor.click();
    await this.page.waitForURL('**/#/consultant', { timeout: 10_000 });
    await this.waitForLoad();
  }

  // ─── Topbar — ações ──────────────────────────────────────────────────────

  /**
   * Digita no campo de busca global da topbar.
   */
  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  /**
   * Abre o menu de configurações (ícone de engrenagem no canto superior direito).
   */
  async openSettingsMenu(): Promise<void> {
    await this.settingsButton.click();
    await expect(this.settingsMenuLogout).toBeVisible({ timeout: 5_000 });
  }

  /**
   * Realiza logout pelo menu de configurações.
   * Aguarda o redirecionamento para a tela de login.
   */
  async logout(): Promise<void> {
    await this.openSettingsMenu();
    await this.settingsMenuLogout.click();
    await this.page.waitForURL('**/', { timeout: 10_000 });
  }

  /**
   * Abre o modal de alteração de senha.
   */
  async openChangePassword(): Promise<void> {
    await this.openSettingsMenu();
    await this.settingsMenuPassword.click();
  }

  /**
   * Abre o modal de edição de perfil.
   */
  async openEditProfile(): Promise<void> {
    await this.openSettingsMenu();
    await this.settingsMenuProfile.click();
  }

  // ─── Autenticação ─────────────────────────────────────────────────────────

  /**
   * Verifica se há token JWT no localStorage (usuário autenticado).
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.page.evaluate(
      (key) => localStorage.getItem(key),
      TOKEN_KEY
    );
    return !!token;
  }

  /**
   * Retorna os dados do usuário logado armazenados no localStorage.
   */
  async getLoggedUser(): Promise<Record<string, unknown> | null> {
    const raw = await this.page.evaluate(
      (key) => localStorage.getItem(key),
      USER_KEY
    );
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  // ─── Assertions utilitárias ───────────────────────────────────────────────

  /**
   * Verifica que um texto está visível em qualquer parte da página.
   */
  async expectTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  /**
   * Verifica que a URL atual contém o fragmento informado.
   */
  async expectUrlContains(fragment: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  /**
   * Verifica que o menu lateral está visível (usuário autenticado com layout carregado).
   */
  async expectSidebarVisible(): Promise<void> {
    await expect(this.menuDashboard).toBeVisible({ timeout: 10_000 });
  }
}
