import { type Page, type Locator, expect } from '@playwright/test';
import { TOKEN_KEY } from '../fixtures/test-data';

/**
 * Page Object da tela de Login.
 *
 * Cobre três estados da página (Login.tsx):
 *   "login"           → formulário principal de acesso
 *   "forgot-password" → formulário de recuperação de senha (envia token por e-mail)
 *   "reset-password"  → formulário de redefinição usando o token recebido
 *
 * Locators baseados nos atributos reais do componente Login.tsx:
 *   - placeholder="E-MAIL"        → campo de e-mail (id="email")
 *   - placeholder="SENHA"         → campo de senha (id="password")
 *   - button "ENTRAR"             → submit do login
 *   - <Alert severity="error">    → mensagem de erro
 *   - texto "Esqueci Minha Senha" → link de recuperação
 *   - id="remember"               → checkbox "Mantenha-me Conectado"
 */
export class LoginPage {
  readonly page: Page;

  // ─── Formulário de login ──────────────────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  readonly successAlert: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly togglePasswordButton: Locator;
  readonly pageTitle: Locator;
  readonly forgotPasswordLink: Locator;

  // ─── Formulário "Esqueci minha senha" ─────────────────────────────────────
  readonly forgotPasswordTitle: Locator;
  readonly sendTokenButton: Locator;
  readonly backToLoginLink: Locator;

  // ─── Formulário "Redefinir senha" ─────────────────────────────────────────
  readonly resetPasswordTitle: Locator;
  readonly tokenInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ── Login ──
    // Campos: placeholder exato conforme Login.tsx
    this.emailInput    = page.getByPlaceholder('E-MAIL');
    this.passwordInput = page.getByPlaceholder('SENHA').first(); // evita ambiguidade com "NOVA SENHA"

    // Botão de submit: texto alterna entre "ENTRAR" (idle) e "ENTRANDO..." (loading)
    this.submitButton = page.getByRole('button', { name: /^entrar$|^entrando\.\.\./i });

    // Alertas MUI — <div role="alert"> com texto de erro ou sucesso
    this.errorAlert   = page.getByRole('alert').filter({ hasText: /erro|inválid|preencha|verifique|insira/i });
    this.successAlert = page.getByRole('alert').filter({ hasText: /sucesso|enviado|redirecionando/i });

    // Elementos auxiliares do formulário de login
    this.rememberMeCheckbox   = page.locator('#remember');
    this.togglePasswordButton = page.getByRole('button', { name: /toggle password visibility/i });
    this.pageTitle            = page.getByText('ACESSE SUA CONTA', { exact: true });
    this.forgotPasswordLink   = page.getByText('Esqueci Minha Senha', { exact: true });

    // ── Esqueci minha senha ──
    this.forgotPasswordTitle = page.getByText('ESQUECI A SENHA', { exact: true });
    this.sendTokenButton     = page.getByRole('button', { name: /^enviar$|^enviando\.\.\./i });
    this.backToLoginLink     = page.getByText('Voltar ao Login', { exact: true });

    // ── Redefinir senha ──
    this.resetPasswordTitle   = page.getByText('REDEFINIR SENHA', { exact: true });
    this.tokenInput           = page.getByPlaceholder('TOKEN');
    this.newPasswordInput     = page.getByPlaceholder('NOVA SENHA');
    this.confirmPasswordInput = page.getByPlaceholder('CONFIRMAR NOVA SENHA');
    this.resetButton          = page.getByRole('button', { name: /^redefinir$|^redefinindo\.\.\./i });
  }

  // ─── Ações principais ─────────────────────────────────────────────────────

  /**
   * Navega para a tela de login (rota raiz) e aguarda o formulário aparecer.
   */
  async navigate(): Promise<void> {
    await this.page.goto('/');
    await expect(this.pageTitle).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Preenche os campos de e-mail e senha sem submeter.
   * Limpa os campos antes de preencher para evitar valores residuais.
   */
  async fillCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /**
   * Clica no botão de submit (ENTRAR) e aguarda a resposta da API.
   * Não aguarda redirecionamento — use loginAndWaitForDashboard() para isso.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Desativa a validação nativa do HTML5 no formulário visível,
   * para que o handler JS execute mesmo com campos vazios/inválidos.
   * Use antes de submit() em testes que testam validação JS frontend.
   */
  async disableNativeValidation(): Promise<void> {
    await this.page.evaluate(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.noValidate = true;
    });
  }

  /**
   * Retorna o texto da mensagem de erro exibida pela aplicação.
   * Aguarda o alerta aparecer antes de ler o conteúdo.
   */
  async getErrorMessage(): Promise<string> {
    await expect(this.errorAlert).toBeVisible({ timeout: 8_000 });
    return this.errorAlert.innerText();
  }

  // ─── Fluxos compostos ─────────────────────────────────────────────────────

  /**
   * Preenche credenciais e submete o formulário.
   * Equivalente a chamar fillCredentials() + submit() em sequência.
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillCredentials(email, password);
    await this.submit();
  }

  /**
   * Realiza login completo e aguarda o redirecionamento para o dashboard.
   * Use este método em testes que precisam estar autenticados.
   */
  async loginAndWaitForDashboard(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.page.waitForURL('**/#/dashboard', { timeout: 15_000 });
  }

  // ─── Fluxo "Esqueci minha senha" ─────────────────────────────────────────

  /**
   * Navega do formulário de login para o formulário de recuperação de senha.
   */
  async goToForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await expect(this.forgotPasswordTitle).toBeVisible({ timeout: 5_000 });
  }

  /**
   * No formulário de recuperação, preenche o e-mail e envia o token.
   */
  async submitForgotPassword(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
    await this.sendTokenButton.click();
  }

  /**
   * Volta para o formulário de login a partir de qualquer sub-formulário.
   */
  async goBackToLogin(): Promise<void> {
    await this.backToLoginLink.click();
    await expect(this.pageTitle).toBeVisible({ timeout: 5_000 });
  }

  // ─── Fluxo "Redefinir senha" ──────────────────────────────────────────────

  /**
   * Preenche e envia o formulário de redefinição de senha com token.
   * Requer que a view já esteja em "reset-password".
   */
  async submitResetPassword(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    await this.tokenInput.fill(token);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.resetButton.click();
  }

  // ─── Visibilidade da senha ────────────────────────────────────────────────

  /**
   * Alterna a visibilidade do campo de senha (ícone de olho).
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.togglePasswordButton.click();
  }

  /**
   * Retorna true se o campo de senha está visível (type="text").
   */
  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  // ─── Estado da sessão ─────────────────────────────────────────────────────

  /**
   * Verifica se o usuário está autenticado consultando o localStorage.
   * Retorna true se o token JWT está presente.
   */
  async isLoggedIn(): Promise<boolean> {
    const token = await this.page.evaluate(
      (key) => localStorage.getItem(key),
      TOKEN_KEY
    );
    return !!token;
  }
}
