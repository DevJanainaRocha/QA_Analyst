import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object do modal de atividades (AddActivityModal.tsx).
 *
 * O modal tem dois modos:
 *   - Criação:     título "ADICIONAR ATIVIDADE", botão "ADICIONAR ATIVIDADE"
 *   - Visualização/Edição: título "VISUALIZAR ATIVIDADE", botão "SALVAR ALTERAÇÕES"
 *
 * Campos do formulário (IActivityPayload / AddActivityModal.tsx):
 *   name         → TextField, placeholder "Nome da atividade",   label "NOME DA ATIVIDADE *"
 *   unitOrNetwork → Select,    label "UNIDADE *",                opções vindas da API
 *   stage        → Select,    label "ETAPA *",                   opções: LICENSE_STAGES + moreStages da unidade
 *   priority     → Select,    label "PRIORIDADE",                values: "Baixa" | "Média" | "Alta"
 *   deadline     → input date, label "PRAZO"
 *   status       → Select,    label "STATUS",                    values: "A Fazer" | "Em Andamento" | "Concluído"
 *   description  → TextField multiline, label "DESCRIÇÃO DE ATIVIDADE"
 *   responsibles → Select multiple, label "RESPONSÁVEIS"
 *   checklist    → TextField, placeholder "Adicionar item de Checklist"
 *
 * Mensagens de erro reais (AddActivityModal.tsx):
 *   "Por favor, selecione pelo menos um responsável."
 *   "Por favor, preencha todos os campos obrigatórios (*)."
 *   "Falha ao adicionar atividade. Verifique os dados e tente novamente."
 *   "Falha ao atualizar atividade. Verifique os dados e tente novamente."
 */
export class ActivityModal {
  readonly page: Page;
  readonly dialog: Locator;

  // ─── Cabeçalho ────────────────────────────────────────────────────────────
  readonly titleAdd: Locator;
  readonly titleView: Locator;
  readonly closeButton: Locator;

  // ─── Campos do formulário ─────────────────────────────────────────────────
  readonly nameInput: Locator;
  readonly unitSelect: Locator;
  readonly stageSelect: Locator;
  readonly prioritySelect: Locator;
  readonly deadlineInput: Locator;
  readonly statusSelect: Locator;
  readonly descriptionInput: Locator;
  readonly responsiblesSelect: Locator;
  readonly checklistInput: Locator;

  // ─── Botões de ação ───────────────────────────────────────────────────────
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly commentInput: Locator;
  readonly sendCommentButton: Locator;

  // ─── Feedback ─────────────────────────────────────────────────────────────
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;

    // O modal MUI renderiza como role="dialog"
    this.dialog = page.getByRole('dialog');

    // Títulos — AddActivityModal.tsx linha 620-621
    this.titleAdd  = this.dialog.getByText('ADICIONAR ATIVIDADE', { exact: true });
    this.titleView = this.dialog.getByText('VISUALIZAR ATIVIDADE', { exact: true });

    // Botão fechar — aria-label="close" (AddActivityModal.tsx linha 625)
    this.closeButton = this.dialog.getByRole('button', { name: 'close' });

    // ── Campos ──
    // name — placeholder "Nome da atividade" (linha 721)
    this.nameInput = this.dialog.getByPlaceholder('Nome da atividade');

    // unitOrNetwork — Select MUI sem label textual, identificado pelo contexto da Typography "UNIDADE *"
    this.unitSelect = this.dialog.getByRole('combobox').filter({
      has: page.locator('[name="unitOrNetwork"]')
    }).or(this.dialog.locator('[name="unitOrNetwork"]'));

    // stage — Select MUI, identificado pelo name="stage"
    this.stageSelect = this.dialog.locator('[name="stage"]');

    // priority — Select MUI, name="priority", valores visíveis: BAIXA / MÉDIA / ALTA
    this.prioritySelect = this.dialog.locator('[name="priority"]');

    // deadline — input date, name="deadline" (linha 948)
    this.deadlineInput = this.dialog.locator('input[name="deadline"]');

    // status — Select MUI, name="status", valores: A FAZER / EM ANDAMENTO / CONCLUÍDO
    this.statusSelect = this.dialog.locator('[name="status"]');

    // description — TextField multiline, name="description" (linha 998)
    this.descriptionInput = this.dialog.locator('textarea[name="description"]').first();

    // responsibles — Select multiple, name="responsibles" (linha 1041)
    this.responsiblesSelect = this.dialog.locator('[name="responsibles"]');

    // checklist — TextField, placeholder "Adicionar item de Checklist" (linha 1087)
    this.checklistInput = this.dialog.getByPlaceholder('Adicionar item de Checklist');

    // ── Botões de ação ──
    // Submit: "ADICIONAR ATIVIDADE" | "SALVAR ALTERAÇÕES" | "SALVANDO..." (linha 1480)
    this.submitButton = this.dialog.getByRole('button', {
      name: /adicionar atividade|salvar alterações|salvando/i
    });

    // Cancelar/Voltar — "VOLTAR" (linha 1463)
    this.cancelButton = this.dialog.getByRole('button', { name: 'VOLTAR', exact: true });

    // Excluir — "EXCLUIR ATIVIDADE" (linha 1447), só aparece no modo edição
    this.deleteButton = this.dialog.getByRole('button', { name: 'EXCLUIR ATIVIDADE', exact: true });

    // Comentário — placeholder "Escreva sua mensagem" (linha 1289)
    this.commentInput = this.dialog.getByPlaceholder('Escreva sua mensagem');
    this.sendCommentButton = this.dialog.getByRole('button', { name: /enviar/i }).last();

    // Alerta de erro — <Alert severity="error"> dentro do dialog
    this.errorAlert = this.dialog.getByRole('alert');
  }

  // ─── Estado do modal ─────────────────────────────────────────────────────

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: 8_000 });
  }

  async waitForClose(): Promise<void> {
    await expect(this.dialog).not.toBeVisible({ timeout: 8_000 });
  }

  async isInCreateMode(): Promise<boolean> {
    return this.titleAdd.isVisible();
  }

  async isInViewMode(): Promise<boolean> {
    return this.titleView.isVisible();
  }

  // ─── Ações de preenchimento ───────────────────────────────────────────────

  /**
   * Preenche o campo nome da atividade.
   */
  async fillName(name: string): Promise<void> {
    await this.nameInput.fill(name);
  }

  /**
   * Seleciona uma unidade pelo texto visível no dropdown.
   * O Select MUI abre um popover — usa page.getByRole('option') após o clique.
   */
  async selectUnit(unitLabel: string): Promise<void> {
    await this.unitSelect.click();
    await this.page.getByRole('option', { name: unitLabel }).click();
  }

  /**
   * Seleciona uma etapa pelo texto visível.
   */
  async selectStage(stageLabel: string): Promise<void> {
    await this.stageSelect.click();
    await this.page.getByRole('option', { name: stageLabel }).click();
  }

  /**
   * Seleciona a prioridade.
   * Valores aceitos pela API: "Baixa" | "Média" | "Alta"
   * Exibidos no Select como:  "BAIXA"  | "MÉDIA"  | "ALTA"
   */
  async selectPriority(priority: 'BAIXA' | 'MÉDIA' | 'ALTA'): Promise<void> {
    await this.prioritySelect.click();
    await this.page.getByRole('option', { name: priority, exact: true }).click();
  }

  /**
   * Define a data de prazo no formato ISO (YYYY-MM-DD).
   */
  async setDeadline(date: string): Promise<void> {
    await this.deadlineInput.fill(date);
  }

  /**
   * Seleciona o status da atividade.
   * Valores aceitos pela API: "A Fazer" | "Em Andamento" | "Concluído"
   * Exibidos no Select como:  "A FAZER" | "EM ANDAMENTO" | "CONCLUÍDO"
   */
  async selectStatus(status: 'A FAZER' | 'EM ANDAMENTO' | 'CONCLUÍDO'): Promise<void> {
    await this.statusSelect.click();
    await this.page.getByRole('option', { name: status, exact: true }).click();
  }

  /**
   * Preenche a descrição da atividade.
   */
  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  /**
   * Seleciona um responsável pelo nome.
   * O Select é múltiplo — pode chamar várias vezes para múltiplos responsáveis.
   */
  async selectResponsible(responsibleName: string): Promise<void> {
    await this.responsiblesSelect.click();
    await this.page.getByRole('option', { name: responsibleName }).click();
    // Fecha o dropdown clicando fora
    await this.page.keyboard.press('Escape');
  }

  /**
   * Adiciona um item ao checklist e confirma com Enter.
   */
  async addChecklistItem(item: string): Promise<void> {
    await this.checklistInput.fill(item);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Preenche todos os campos obrigatórios de uma vez.
   * Campos obrigatórios (AddActivityModal.tsx linha 489-497):
   *   name, unitOrNetwork, stage, priority, deadline, status, responsibles
   */
  async fillRequiredFields(data: {
    name: string;
    unitLabel: string;
    stageLabel: string;
    priority: 'BAIXA' | 'MÉDIA' | 'ALTA';
    deadline: string;
    status: 'A FAZER' | 'EM ANDAMENTO' | 'CONCLUÍDO';
    responsibleName: string;
  }): Promise<void> {
    await this.fillName(data.name);
    await this.selectUnit(data.unitLabel);
    await this.selectStage(data.stageLabel);
    await this.selectPriority(data.priority);
    await this.setDeadline(data.deadline);
    await this.selectStatus(data.status);
    await this.selectResponsible(data.responsibleName);
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

  async deleteActivity(): Promise<void> {
    await this.deleteButton.click();
  }

  // ─── Feedback ─────────────────────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    await expect(this.errorAlert).toBeVisible({ timeout: 5_000 });
    return this.errorAlert.innerText();
  }

  async addComment(text: string): Promise<void> {
    await this.commentInput.fill(text);
    await this.sendCommentButton.click();
  }
}
