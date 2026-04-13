import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object do modal de usuários (AddUserModal.tsx).
 *
 * Modos:
 *   - Criação:  título "ADICIONAR USUÁRIO"
 *   - Edição:   título "EDITAR USUÁRIO" (ou similar)
 *
 * Campos do formulário (IUserPayload / AddUserModal.tsx):
 *   name      → TextField, label via Typography, identificado pelo contexto
 *   email     → TextField
 *   password  → TextField, type="password", com toggle de visibilidade (ícone Lock)
 *   phone     → TextField
 *   role      → Select, opções de ROLE_LABELS (permissions.ts):
 *                 "ADMINISTRADOR" | "GESTOR DA REDE" | "GESTOR DA UNIDADE" |
 *                 "VISUALIZADOR DA REDE" | "VISUALIZADOR DA UNIDADE"
 *   networkId → Select, opções carregadas de /api/networks/select
 *   unityId   → Select, opções carregadas de /api/units/select?networkId=...
 *   is_active → Checkbox, label "Ativo"
 *   image     → input file (foto de perfil)
 *
 * Validações via Zod (permissions.ts userSchema):
 *   - name: obrigatório
 *   - email: formato válido, obrigatório
 *   - password: mín. 7 chars, deve conter letra e número (apenas criação)
 *   - role: obrigatório, valor de ROLES
 *   - networkId: obrigatório para GESTOR_REDE e VISUALIZADOR_REDE
 *   - unityId:   obrigatório para GESTOR_UNIDADE e VISUALIZADOR_UNIDADE
 */
export class UserModal {
  readonly page: Page;
  readonly dialog: Locator;

  // ─── Campos do formulário ─────────────────────────────────────────────────
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly togglePasswordButton: Locator;
  readonly phoneInput: Locator;
  readonly roleSelect: Locator;
  readonly networkSelect: Locator;
  readonly unitSelect: Locator;
  readonly isActiveCheckbox: Locator;

  // ─── Botões ───────────────────────────────────────────────────────────────
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly closeButton: Locator;

  // ─── Feedback ─────────────────────────────────────────────────────────────
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');

    // Campos — AddUserModal.tsx usa TextField sem labels HTML formais,
    // portanto usamos os atributos name como âncora de seletor
    this.nameInput     = this.dialog.locator('input[name="name"]');
    this.emailInput    = this.dialog.locator('input[name="email"]');
    this.passwordInput = this.dialog.locator('input[name="password"]');
    this.phoneInput    = this.dialog.locator('input[name="phone"]');

    // Toggle de visibilidade da senha — ícone Lock no InputAdornment (linha 20)
    this.togglePasswordButton = this.dialog.getByRole('button', { name: /toggle|visibilidade/i })
      .or(this.dialog.locator('[data-testid="LockIcon"]').locator('..').locator('..'));

    // Selects MUI — identificados pelo name do campo oculto
    this.roleSelect    = this.dialog.locator('[name="role"]');
    this.networkSelect = this.dialog.locator('[name="networkId"]');
    this.unitSelect    = this.dialog.locator('[name="unityId"]');

    // Checkbox is_active — label "Ativo" ou "Ativar usuário"
    this.isActiveCheckbox = this.dialog.locator('input[type="checkbox"]').first();

    // Botões — textos exatos de AddUserModal.tsx
    this.submitButton = this.dialog.getByRole('button', {
      name: /adicionar usuário|salvar|salvar alterações/i
    });
    this.cancelButton = this.dialog.getByRole('button', { name: /cancelar|voltar/i });
    this.deleteButton = this.dialog.getByRole('button', { name: /excluir usuário/i });
    this.closeButton  = this.dialog.getByRole('button', { name: 'close' });

    this.errorAlert = this.dialog.getByRole('alert');
  }

  // ─── Estado do modal ─────────────────────────────────────────────────────

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: 8_000 });
  }

  async waitForClose(): Promise<void> {
    await expect(this.dialog).not.toBeVisible({ timeout: 8_000 });
  }

  // ─── Preenchimento ────────────────────────────────────────────────────────

  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Preenche a senha.
   * Regra (userSchema): mínimo 7 chars, deve conter letra E número.
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  /**
   * Seleciona o perfil do usuário.
   * Valores de ROLE_LABELS (permissions.ts):
   *   "ADMINISTRADOR" | "GESTOR DA REDE" | "GESTOR DA UNIDADE" |
   *   "VISUALIZADOR DA REDE" | "VISUALIZADOR DA UNIDADE"
   */
  async selectRole(roleLabel: string): Promise<void> {
    await this.roleSelect.click();
    await this.page.getByRole('option', { name: roleLabel }).click();
  }

  /**
   * Seleciona a rede (obrigatório para GESTOR_REDE e VISUALIZADOR_REDE).
   */
  async selectNetwork(networkLabel: string): Promise<void> {
    await this.networkSelect.click();
    await this.page.getByRole('option', { name: networkLabel }).click();
  }

  /**
   * Seleciona a unidade (obrigatório para GESTOR_UNIDADE e VISUALIZADOR_UNIDADE).
   * Deve ser chamado após selectNetwork, pois as unidades dependem da rede.
   */
  async selectUnit(unitLabel: string): Promise<void> {
    await this.unitSelect.click();
    await this.page.getByRole('option', { name: unitLabel }).click();
  }

  /**
   * Preenche os campos obrigatórios para criação de usuário padrão (VISUALIZADOR).
   */
  async fillForCreate(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    networkLabel?: string;
    unitLabel?: string;
    phone?: string;
  }): Promise<void> {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    if (data.phone) await this.fillPhone(data.phone);
    await this.selectRole(data.role);
    if (data.networkLabel) await this.selectNetwork(data.networkLabel);
    if (data.unitLabel) await this.selectUnit(data.unitLabel);
  }

  // ─── Ações de submissão ───────────────────────────────────────────────────

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.waitForClose();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.waitForClose();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorAlert).toBeVisible({ timeout: 5_000 });
    return this.errorAlert.innerText();
  }
}
