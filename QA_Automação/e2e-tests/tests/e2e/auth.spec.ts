/**
 * @file auth.spec.ts
 * @tags @auth
 *
 * Testes de Autenticação — cobrem todos os fluxos da tela de Login.tsx:
 *   1. Estrutura visual da página
 *   2. Login com credenciais válidas
 *   3. Login com credenciais inválidas (usuário inexistente)
 *   4. Login com senha incorreta
 *   5. Validação de campos obrigatórios (campos vazios)
 *   6. Visibilidade da senha
 *   7. Fluxo "Esqueci minha senha"
 *   8. Logout
 *
 * IMPORTANTE: Este arquivo é mapeado ao projeto "chromium-no-auth" no
 * playwright.config.ts — os testes NÃO usam storageState, pois testam
 * o fluxo de login do zero sem sessão prévia.
 *
 * Mensagens de erro reais da aplicação (Login.tsx):
 *   - Campos vazios:  "Por favor, preencha todos os campos"
 *   - Falha na API:   "Erro ao fazer login. Tente novamente."
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { TEST_USERS } from '../fixtures/test-data';

// ─────────────────────────────────────────────────────────────────────────────
// GRUPO 1: Estrutura visual da página de login
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Auth @auth — Estrutura da página de login', () => {

  test('exibe todos os elementos do formulário de login', async ({ page }) => {
    /**
     * Cenário: Usuário acessa a aplicação pela primeira vez.
     * Verificar que todos os elementos obrigatórios do formulário estão
     * presentes e visíveis antes de qualquer interação.
     *
     * Elementos verificados (Login.tsx):
     *   - Título "ACESSE SUA CONTA" (linha 168)
     *   - Campo E-MAIL (placeholder "E-MAIL", id="email")
     *   - Campo SENHA (placeholder "SENHA", id="password")
     *   - Botão "ENTRAR"
     *   - Link "Esqueci Minha Senha"
     *   - Checkbox "Mantenha-me Conectado" (id="remember")
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await expect(loginPage.pageTitle).toBeVisible();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.rememberMeCheckbox).toBeAttached();
  });

  test('campo de senha inicia com tipo "password" (texto oculto)', async ({ page }) => {
    /**
     * Cenário: Por segurança, o campo de senha deve mascarar o conteúdo
     *          ao ser exibido pela primeira vez.
     * Esperado: type="password" antes de qualquer clique no botão de olho.
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    expect(await loginPage.isPasswordVisible()).toBe(false);
  });

  test('botão de visibilidade alterna o tipo do campo de senha', async ({ page }) => {
    /**
     * Cenário: Usuário quer conferir o que digitou na senha.
     * Esperado: ao clicar no ícone de olho, type muda de "password" → "text"
     *           e ao clicar novamente, volta para "password".
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.fillCredentials('qualquer@email.com', 'minha-senha-secreta');

    // Estado inicial: senha oculta
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Clica para mostrar
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    expect(await loginPage.isPasswordVisible()).toBe(true);

    // Clica para ocultar novamente
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    expect(await loginPage.isPasswordVisible()).toBe(false);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// GRUPO 2: Login com credenciais válidas
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Auth @auth — Login com credenciais válidas', () => {

  test('redireciona para o dashboard após login bem-sucedido', async ({ page }) => {
    /**
     * Cenário: Usuário com conta ativa faz login com e-mail e senha corretos.
     * Esperado:
     *   1. URL muda para /#/dashboard
     *   2. Token JWT salvo no localStorage (key "expanzio_token")
     *   3. Sidebar do Layout visível (confirma que o Layout autenticado carregou)
     *   4. Saudação com nome do usuário visível na topbar
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Preenche e submete o formulário
    await loginPage.fillCredentials(
      TEST_USERS.standard.email,
      TEST_USERS.standard.password
    );
    await loginPage.submit();

    // Aguarda redirecionamento para o dashboard
    await page.waitForURL('**/#/dashboard', { timeout: 15_000 });

    // 1. URL correta
    await expect(page).toHaveURL(/\/#\/dashboard/);

    // 2. Token no localStorage — chave definida em app.config.ts
    expect(await loginPage.isLoggedIn()).toBe(true);

    // 3. Sidebar carregou (Layout autenticado renderizou)
    const dashboard = new DashboardPage(page);
    await dashboard.expectSidebarVisible();

    // 4. Saudação do usuário na topbar — Layout.tsx linha 361
    await expect(page.getByText(/Bom dia,/)).toBeVisible();
  });

  test('dashboard exibe seletor de views após login', async ({ page }) => {
    /**
     * Cenário: Após login bem-sucedido, o dashboard deve mostrar o
     *          seletor de views com as 4 opções de visualização.
     * Esperado: botões do ViewSelector.tsx visíveis e o primeiro ativo
     *           ("Relatórios", que é o defaultView).
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginAndWaitForDashboard(
      TEST_USERS.standard.email,
      TEST_USERS.standard.password
    );

    await page.waitForLoadState('networkidle');

    // ViewSelector.tsx — defaultViews (linhas 5-8)
    await expect(page.getByRole('button', { name: 'Relatórios' })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Unidades em Funcionamento' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Unidades de Abertura' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Documentos' })).toBeVisible({ timeout: 10_000 });
  });

  test('campos de e-mail e senha são limpos no foco após navegação', async ({ page }) => {
    /**
     * Cenário: Ao fazer login e navegar de volta para "/", os campos
     *          não devem conter valores da sessão anterior.
     * Esperado: campos vazios ao retornar para a tela de login.
     * Nota: Login.tsx remove token e user do localStorage no useEffect (linha 36-38).
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginAndWaitForDashboard(
      TEST_USERS.standard.email,
      TEST_USERS.standard.password
    );

    // Navega de volta para a tela de login
    await page.goto('/');
    await expect(loginPage.pageTitle).toBeVisible({ timeout: 10_000 });

    // Campos devem estar vazios — Login.tsx limpa o localStorage no mount
    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// GRUPO 3: Login com credenciais inválidas
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Auth @auth — Login com credenciais inválidas', () => {

  test('exibe erro ao submeter com campos vazios', async ({ page }) => {
    /**
     * Cenário: Usuário clica em "ENTRAR" sem preencher nenhum campo.
     * Esperado: Alert de erro com mensagem de validação — Login.tsx linha 46:
     *           "Por favor, preencha todos os campos"
     * Nota: validação feita no frontend antes de chamar a API.
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Desativa validação HTML5 para que o handler JS execute com campos vazios
    await loginPage.disableNativeValidation();
    await loginPage.submit();

    // Mensagem exata de Login.tsx linha 46
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Por favor, preencha todos os campos');

    // Permanece na tela de login (não redireciona)
    await expect(page).not.toHaveURL(/\/#\/dashboard/);
  });

  test('exibe erro ao submeter apenas com e-mail (senha vazia)', async ({ page }) => {
    /**
     * Cenário: Usuário preenche o e-mail mas deixa a senha em branco.
     * Esperado: mesma mensagem de validação de campos obrigatórios.
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.emailInput.fill('usuario@teste.com');
    // senha não preenchida — desativa validação HTML5 para testar handler JS
    await loginPage.disableNativeValidation();
    await loginPage.submit();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Por favor, preencha todos os campos');
  });

  test('exibe erro ao usar credenciais de usuário inexistente', async ({ page }) => {
    /**
     * Cenário: E-mail válido no formato mas sem conta cadastrada na aplicação.
     * Esperado: requisição chega à API, retorna erro, frontend exibe —
     *           Login.tsx linha 63: "Erro ao fazer login. Tente novamente."
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(
      TEST_USERS.invalid.email,
      TEST_USERS.invalid.password
    );

    // Mensagem de erro da API — Login.tsx linha 63
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Erro ao fazer login. Tente novamente.');

    // Não deve ter token no localStorage
    expect(await loginPage.isLoggedIn()).toBe(false);

    // Permanece na tela de login
    await expect(page).not.toHaveURL(/\/#\/dashboard/);
  });

  test('exibe erro ao usar senha incorreta para usuário válido', async ({ page, context }) => {
    /**
     * Cenário: E-mail de um usuário existente mas com senha errada.
     * Esperado: API retorna 401/403, frontend exibe mensagem de erro.
     * Nota: cookies de sessão são limpos antes do teste para forçar nova autenticação.
     */
    // Limpa cookies para que a sessão existente não interfira na validação da senha
    await context.clearCookies();

    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(
      TEST_USERS.standard.email,
      'SenhaCompletamenteErrada999!'
    );

    // Deve exibir erro — sem token
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeTruthy();
    expect(await loginPage.isLoggedIn()).toBe(false);
  });

  test('não redireciona para dashboard após falha de login', async ({ page }) => {
    /**
     * Cenário: Verificação explícita de que a URL não muda após erro de login.
     * Evita regressões onde um bug redireciona sem autenticação real.
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(TEST_USERS.invalid.email, TEST_USERS.invalid.password);

    // Aguarda a resposta da API (erro esperado)
    await loginPage.getErrorMessage();

    // URL deve permanecer na raiz (não navega para o dashboard)
    await expect(page).not.toHaveURL(/\/#\/dashboard/);
  });

  test('erro desaparece ao começar a digitar novamente', async ({ page }) => {
    /**
     * Cenário: UX — após ver uma mensagem de erro, o usuário digita novamente.
     * Esperado: ao resetar o formulário e submeter de novo, o estado de erro
     *           anterior não fica "travado".
     * Nota: Login.tsx chama setError('') no início do handleSubmit (linha 42).
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Gera um erro com campos vazios (desativa validação HTML5 primeiro)
    await loginPage.disableNativeValidation();
    await loginPage.submit();
    await loginPage.getErrorMessage(); // aguarda o erro aparecer

    // Começa a preencher novamente — simula correção do usuário
    await loginPage.fillCredentials('novo@email.com', 'nova-senha');

    // Submete novamente (irá gerar outro erro de API, mas o anterior foi limpo)
    await loginPage.submit();

    // O alerta visível deve ser novo (mensagem da API), não o de campos vazios
    const newError = await loginPage.getErrorMessage();
    expect(newError).not.toContain('Por favor, preencha todos os campos');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// GRUPO 4: Fluxo "Esqueci minha senha"
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Auth @auth — Recuperação de senha', () => {

  test('link "Esqueci Minha Senha" abre o formulário correto', async ({ page }) => {
    /**
     * Cenário: Usuário esqueceu a senha e clica no link de recuperação.
     * Esperado: view muda para "forgot-password" com título "ESQUECI A SENHA"
     *           e botão "Voltar ao Login" visível.
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.goToForgotPassword();

    // Título do formulário de recuperação — Login.tsx linha 291
    await expect(loginPage.forgotPasswordTitle).toBeVisible();

    // Instrução ao usuário — Login.tsx linha 294
    await expect(
      page.getByText(/Digite seu e-mail cadastrado/i)
    ).toBeVisible();

    // Botão de retorno
    await expect(loginPage.backToLoginLink).toBeVisible();

    // Campo de e-mail ainda presente
    await expect(loginPage.emailInput).toBeVisible();
  });

  test('"Voltar ao Login" retorna para o formulário principal', async ({ page }) => {
    /**
     * Cenário: Usuário abriu a recuperação de senha por engano.
     * Esperado: clicar em "Voltar ao Login" restaura o formulário de login
     *           com o título "ACESSE SUA CONTA".
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.goToForgotPassword();
    await expect(loginPage.forgotPasswordTitle).toBeVisible();

    await loginPage.goBackToLogin();

    // De volta ao formulário de login
    await expect(loginPage.pageTitle).toBeVisible();
    await expect(loginPage.forgotPasswordTitle).not.toBeVisible();
  });

  test('submissão de e-mail vazio na recuperação exibe erro', async ({ page }) => {
    /**
     * Cenário: Usuário clica em "ENVIAR" sem preencher o e-mail.
     * Esperado: Alert de validação — Login.tsx linha 75:
     *           "Por favor, insira seu e-mail"
     */
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.goToForgotPassword();

    // Desativa validação nativa para que o handler JS execute com campo vazio
    await page.evaluate(() => {
      const form = document.querySelector('form') as HTMLFormElement;
      if (form) form.noValidate = true;
    });
    await loginPage.sendTokenButton.click();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Por favor, insira seu e-mail');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// GRUPO 5: Logout
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Auth @auth — Logout', () => {

  test('logout remove o token e redireciona para login', async ({ page }) => {
    /**
     * Cenário: Usuário logado clica em "Sair/ Deslogar" no menu de configurações.
     * Esperado:
     *   1. Redireciona para a tela de login
     *   2. Token removido do localStorage
     *   3. Campos de login vazios (useEffect em Login.tsx limpa o storage)
     *
     * Nota: este teste usa storageState (usuário já autenticado) e verifica
     *       a ação de logout completa.
     */
    const dashboard = new DashboardPage(page);
    await dashboard.navigate();

    // Confirma que está autenticado
    expect(await dashboard.isAuthenticated()).toBe(true);

    // Realiza logout pelo menu de configurações — Layout.tsx linha 665
    await dashboard.logout();

    // 1. Redireciona para login
    await expect(page.getByText('ACESSE SUA CONTA')).toBeVisible({ timeout: 10_000 });

    // 2. Token removido — handleLogout chama logout() do store
    const token = await page.evaluate(() => localStorage.getItem('expanzio_token'));
    expect(token).toBeNull();
  });

});
