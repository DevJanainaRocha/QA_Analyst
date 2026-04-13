/**
 * @file test-data.ts
 *
 * Fixtures de dados de teste geradas a partir do código fonte real.
 *
 * Fontes consultadas:
 *   - src/types/index.ts         → interfaces de payload (campos e tipos)
 *   - src/utils/permissions.ts   → ROLES, validações via Zod
 *   - src/constants/index.tsx    → rotas do frontend (HashRouter)
 *   - server/src/modules/        → rotas da API (Fastify)
 *   - server/src/modules/auth/auth.schema.ts → regras de senha
 *   - AddActivityModal.tsx       → campos e validações do formulário
 *   - AddUserModal.tsx           → campos e validações do formulário
 *
 * ⚠️  Credenciais reais devem estar no arquivo .env (não versionado).
 *     Os campos de credencial leem de process.env automaticamente.
 */

// ─────────────────────────────────────────────────────────────────────────────
// ROTAS (HashRouter — constants/index.tsx)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Mapa de todas as rotas da aplicação.
 * A aplicação usa HashRouter, portanto rotas protegidas têm prefixo /#/
 */
export const ROUTES = {
  // Rotas públicas
  login: '/',
  about: '/about',

  // Rotas protegidas (ProtectedRoute.tsx verifica expanzio_token)
  dashboard:  '/#/dashboard',
  activities: '/#/activities',
  licenses:   '/#/licenses',
  publics:    '/#/publics',
  providers:  '/#/providers',
  networks:   '/#/networks',
  users:      '/#/users',
  finances:   '/#/finances',   // roles: ADMIN | GESTOR_REDE | GESTOR_UNIDADE
  consultant: '/#/consultant',
  unitDetail: (unitId: string) => `/#/units/${unitId}`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CHAVES DO LOCALSTORAGE (app.config.ts)
// ─────────────────────────────────────────────────────────────────────────────

export const TOKEN_KEY = 'expanzio_token';   // JWT de autenticação
export const USER_KEY  = 'expanzio_user';    // dados do usuário logado
export const THEME_KEY = 'expanzio_theme';   // preferência de tema

// ─────────────────────────────────────────────────────────────────────────────
// ROTAS DA API (server/src/modules/ — prefixo /api)
// ─────────────────────────────────────────────────────────────────────────────

export const API_ROUTES = {
  // Auth (auth.routes.ts)
  signIn:           '/api/auth/sign-in',
  signUp:           '/api/auth/sign-up',
  signOut:          '/api/auth/sign-out',
  session:          '/api/auth/session',
  verifyEmail:      '/api/auth/verify-email',
  updatePassword:   '/api/auth/update-password',
  getTokenFromEmail:'/api/auth/get-token-from-email',
  forgotPassword:   '/api/auth/forgot-password',

  // Users (user.routes.ts)
  usersAll:         '/api/users',
  usersSelect:      '/api/users/select',
  userCreate:       '/api/user',
  userById:         (id: string) => `/api/user/${id}`,
  userUpdate:       (id: string) => `/api/user/${id}`,
  userDelete:       (id: string) => `/api/user/${id}`,
  userProfilePic:   '/api/user/profile-picture',

  // Activities (activities.routes.ts)
  activities:       '/api/activities',
  activityById:     (id: string) => `/api/activities/${id}`,
  activityToggle:   (id: string) => `/api/activities/${id}/stages/toggle`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// PERFIS DE USUÁRIO (permissions.ts — ROLES + ROLE_LABELS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Perfis reais da aplicação.
 * Chave = valor enviado para a API (ROLES em permissions.ts)
 * Label = texto exibido nos Selects do frontend (ROLE_LABELS)
 */
export const USER_ROLES = {
  ADMIN: {
    value: 'ADMIN',
    label: 'ADMINISTRADOR',
  },
  GESTOR_REDE: {
    value: 'GESTOR_REDE',
    label: 'GESTOR DA REDE',
  },
  GESTOR_UNIDADE: {
    value: 'GESTOR_UNIDADE',
    label: 'GESTOR DA UNIDADE',
  },
  VISUALIZADOR_REDE: {
    value: 'VISUALIZADOR_REDE',
    label: 'VISUALIZADOR DA REDE',
  },
  VISUALIZADOR_UNIDADE: {
    value: 'VISUALIZADOR_UNIDADE',
    label: 'VISUALIZADOR DA UNIDADE',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// CREDENCIAIS DE TESTE (lidas de .env)
// ─────────────────────────────────────────────────────────────────────────────

export const TEST_USERS = {
  /** Usuário padrão para testes gerais — definido em .env */
  standard: {
    email:    process.env.TEST_USER_EMAIL    ?? '',
    password: process.env.TEST_USER_PASSWORD ?? '',
  },

  /** Usuário ADMIN para testes de financeiro e gestão — definido em .env */
  admin: {
    email:    process.env.TEST_ADMIN_EMAIL    ?? '',
    password: process.env.TEST_ADMIN_PASSWORD ?? '',
  },

  /** Credenciais inválidas para testes negativos */
  invalid: {
    email:    'usuario-invalido-e2e@naoexiste.com',
    password: 'SenhaQueNaoExiste999!',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES DE ATIVIDADE (IActivityPayload — types/index.ts)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valores aceitos pelo campo "priority" (TPriority — types/index.ts linha 1).
 * Enviados para a API: "Baixa" | "Média" | "Alta"
 * Exibidos no Select:  "BAIXA" | "MÉDIA" | "ALTA"
 */
export const ACTIVITY_PRIORITY = {
  LOW:    { api: 'Baixa', ui: 'BAIXA' },
  MEDIUM: { api: 'Média', ui: 'MÉDIA' },
  HIGH:   { api: 'Alta',  ui: 'ALTA'  },
} as const;

/**
 * Valores aceitos pelo campo "status" (TStatus — types/index.ts linha 2).
 * Enviados para a API: "A Fazer" | "Em Andamento" | "Concluído"
 * Exibidos no Select:  "A FAZER" | "EM ANDAMENTO" | "CONCLUÍDO"
 */
export const ACTIVITY_STATUS = {
  TODO:        { api: 'A Fazer',     ui: 'A FAZER'      },
  IN_PROGRESS: { api: 'Em Andamento',ui: 'EM ANDAMENTO' },
  DONE:        { api: 'Concluído',   ui: 'CONCLUÍDO'    },
} as const;

/**
 * Dados de atividade para criação em testes.
 * Os campos unitLabel e stageLabel devem corresponder a dados existentes
 * no ambiente de homologação.
 */
export const ACTIVITY_FIXTURES = {
  valid: {
    name:            'Atividade de Teste E2E',
    description:     'Criada automaticamente pelo teste end-to-end do Playwright.',
    priority:        ACTIVITY_PRIORITY.MEDIUM,
    status:          ACTIVITY_STATUS.TODO,
    deadline:        getFutureDate(30),   // 30 dias a partir de hoje
    checklistItems:  ['Verificar documentação', 'Validar com responsável'],
  },

  minimal: {
    name:        'Atividade Mínima E2E',
    description: '',
    priority:    ACTIVITY_PRIORITY.LOW,
    status:      ACTIVITY_STATUS.TODO,
    deadline:    getFutureDate(7),
  },

  highPriority: {
    name:        'Atividade URGENTE E2E',
    description: 'Teste de atividade com prioridade alta.',
    priority:    ACTIVITY_PRIORITY.HIGH,
    status:      ACTIVITY_STATUS.IN_PROGRESS,
    deadline:    getFutureDate(1),
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// FIXTURES DE USUÁRIO (IUserPayload — types/index.ts + userSchema)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Regras de senha da aplicação (userSchema em permissions.ts):
 *   - Mínimo 7 caracteres  (minLength: 7)
 *   - Deve conter pelo menos UMA letra
 *   - Deve conter pelo menos UM número
 */
export const PASSWORD_RULES = {
  minLength: 7,
  requiresLetter: true,
  requiresNumber: true,
} as const;

export const USER_FIXTURES = {
  /** Usuário válido para criação — perfil VISUALIZADOR_UNIDADE (não requer permissões especiais) */
  valid: {
    name:     'Usuário Teste E2E',
    email:    `e2e.test.${Date.now()}@exemplo.com`,  // email único por execução
    password: 'Teste123',      // 7+ chars, letra + número ✓
    phone:    '(11) 99999-9999',
    role:     USER_ROLES.VISUALIZADOR_UNIDADE,
  },

  /** Senha inválida: muito curta (< 7 chars) */
  invalidPasswordShort: {
    name:     'Usuário Senha Curta',
    email:    'email@valido.com',
    password: 'abc12',          // 5 chars — viola minLength: 7
    role:     USER_ROLES.VISUALIZADOR_UNIDADE,
  },

  /** Senha inválida: sem número */
  invalidPasswordNoNumber: {
    name:     'Usuário Sem Numero',
    email:    'email@valido.com',
    password: 'SenhaSemNumero',  // sem número — viola regex /[0-9]/
    role:     USER_ROLES.VISUALIZADOR_UNIDADE,
  },

  /** Senha inválida: sem letra */
  invalidPasswordNoLetter: {
    name:     'Usuário Só Números',
    email:    'email@valido.com',
    password: '1234567',         // sem letra — viola regex /[A-Za-z]/
    role:     USER_ROLES.VISUALIZADOR_UNIDADE,
  },

  /** E-mail inválido */
  invalidEmail: {
    name:     'Usuário Email Inválido',
    email:    'nao-e-um-email',
    password: 'Senha123',
    role:     USER_ROLES.VISUALIZADOR_UNIDADE,
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// MENSAGENS DE ERRO REAIS DA APLICAÇÃO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Textos exatos exibidos pela aplicação em situações de erro.
 * Usados em assertions para evitar hardcode nos testes.
 */
export const ERROR_MESSAGES = {
  // Login.tsx
  login: {
    emptyFields:    'Por favor, preencha todos os campos',
    apiFailed:      'Erro ao fazer login. Tente novamente.',
    emptyEmail:     'Por favor, insira seu e-mail',           // esqueci-senha
  },

  // AddActivityModal.tsx
  activity: {
    noResponsible:  'Por favor, selecione pelo menos um responsável.',
    emptyRequired:  'Por favor, preencha todos os campos obrigatórios (*).',
    createFailed:   'Falha ao adicionar atividade. Verifique os dados e tente novamente.',
    updateFailed:   'Falha ao atualizar atividade. Verifique os dados e tente novamente.',
    noStage:        'Por favor, informe o nome da nova etapa.',
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TEXTOS DA INTERFACE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Textos exatos exibidos na interface.
 * Usados em assertions para detectar regressões de copy.
 */
export const UI_TEXTS = {
  // Login.tsx
  loginTitle:       'ACESSE SUA CONTA',
  forgotTitle:      'ESQUECI A SENHA',
  resetTitle:       'REDEFINIR SENHA',
  loginButton:      'ENTRAR',
  forgotLink:       'Esqueci Minha Senha',
  backToLogin:      'Voltar ao Login',

  // NotFoundPage.tsx
  notFound404:      '404',
  notFoundTitle:    'PÁGINA NÃO ENCONTRADA',
  notFoundButton:   'VOLTAR AO LOGIN',
  notFoundDesc:     'Oops! A página que você está procurando não existe ou foi movida.',

  // AddActivityModal.tsx
  modalAddActivity:   'ADICIONAR ATIVIDADE',
  modalViewActivity:  'VISUALIZAR ATIVIDADE',
  submitAddActivity:  'ADICIONAR ATIVIDADE',
  submitSaveChanges:  'SALVAR ALTERAÇÕES',
  deleteActivity:     'EXCLUIR ATIVIDADE',

  // ViewSelector.tsx (Dashboard)
  viewReports:     'Relatórios',
  viewOperating:   'Unidades em Funcionamento',
  viewOpening:     'Unidades de Abertura',
  viewDocuments:   'Documentos',

  // Layout.tsx
  greetingPrefix:  'Bom dia,',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// UTILITÁRIOS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna uma data futura no formato YYYY-MM-DD.
 * Usado para preencher campos de prazo/vencimento.
 * @param daysFromNow número de dias a partir de hoje
 */
export function getFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

/**
 * Retorna uma data passada no formato YYYY-MM-DD.
 * Usado para testar vencimentos expirados.
 * @param daysAgo número de dias no passado
 */
export function getPastDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

/**
 * Gera um e-mail único por execução de teste para evitar conflitos.
 * @param prefix prefixo antes do @
 */
export function uniqueEmail(prefix = 'e2e'): string {
  return `${prefix}.${Date.now()}@teste-expanzio.com`;
}
