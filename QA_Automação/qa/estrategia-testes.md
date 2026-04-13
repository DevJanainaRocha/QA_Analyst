# Estratégia de Testes — Expanzio+

**Versão:** 1.0
**Data:** 2026-04-09
**Módulo:** Qualidade / QA

---

## Sumário

1. [Objetivo](#1-objetivo)
2. [Escopo de Testes](#2-escopo-de-testes)
3. [Tipos de Testes](#3-tipos-de-testes)
4. [Ferramentas](#4-ferramentas)
5. [Arquitetura dos Testes E2E](#5-arquitetura-dos-testes-e2e)
6. [Padrões Adotados](#6-padrões-adotados)
7. [Organização dos Arquivos](#7-organização-dos-arquivos)
8. [Estratégia de Dados de Teste](#8-estratégia-de-dados-de-teste)
9. [Estratégia de Autenticação nos Testes](#9-estratégia-de-autenticação-nos-testes)
10. [Boas Práticas](#10-boas-práticas)
11. [Critérios de Qualidade](#11-critérios-de-qualidade)
12. [Pendências e Próximos Passos](#12-pendências-e-próximos-passos)

---

## 1. Objetivo

Garantir a qualidade funcional da plataforma Expanzio+ por meio de testes automatizados que:

- Validem os fluxos críticos do ponto de vista do usuário final
- Detectem regressões antes de chegarem ao ambiente de produção
- Sirvam como documentação viva do comportamento esperado do sistema
- Suportem a rastreabilidade entre requisito → refinamento → código → teste

---

## 2. Escopo de Testes

### Coberto atualmente

| Área | Tipo | Arquivo |
|------|------|---------|
| Autenticação (login, senha, logout) | E2E | `tests/e2e/auth.spec.ts` |
| Navegação entre módulos | E2E | `tests/e2e/navigation.spec.ts` |
| Saúde geral da aplicação | Smoke | `tests/e2e/smoke.spec.ts` |

### Fora do escopo atual (pendente de cobertura)

- Dashboard: interação com mapa, filtros, gráficos
- Atividades: CRUD completo
- Licenças: controle de vencimento
- Unidades: cadastro, validação de CNPJ
- Financeiro: visão por perfil
- Usuários: gestão de perfis e permissões

---

## 3. Tipos de Testes

### 3.1 Testes E2E (End-to-End)

Simulam o comportamento real do usuário no navegador. São o tipo principal de teste automatizado no projeto.

- **Ferramenta:** Playwright
- **Ambiente:** Homologação (`https://expanziohm.sitelbra.com.br`)
- **Execução:** Browsers Chromium e Firefox
- **Tags:** `@auth`, `@navigation`, `@smoke`

### 3.2 Smoke Tests

Subconjunto dos testes E2E focado em verificar rapidamente que os pontos críticos do sistema estão funcionando.

- Executados prioritariamente após deploys
- Incluem: acesso à página de login, carregamento do dashboard, acessibilidade de módulos principais

### 3.3 Testes de Integração

> **Status:** Não implementados. Recomendados para validação de:
> - Endpoints da API (autenticação, CRUD de unidades, dashboard)
> - Integração com BrasilAPI (CNPJ)
> - Comportamento do banco de dados MongoDB

### 3.4 Testes Unitários

> **Status:** Não identificados no repositório. Recomendados para:
> - Funções utilitárias (`regions.ts`, `filterUtils.ts`, `permissions.ts`)
> - Regra de prioridade de status (RN-DASH-002 / RN-GLOBAL-002)
> - Formatadores e validadores (`formatters.ts`)

---

## 4. Ferramentas

| Ferramenta | Versão | Finalidade |
|------------|--------|-----------|
| [Playwright](https://playwright.dev/) | `^1.51.1` | Framework principal de testes E2E |
| `@playwright/test` | `^1.51.1` | Runner, assertions e fixtures |
| TypeScript | `^5.8.3` | Linguagem dos testes |
| dotenv | — | Gerenciamento de variáveis de ambiente |

### Configuração do Playwright

**Arquivo:** `e2e-tests/playwright.config.ts`

| Configuração | Valor |
|-------------|-------|
| Base URL | `https://expanziohm.sitelbra.com.br` |
| Browsers | Chromium, Firefox |
| Hash Router | Habilitado (aplicação usa `/#/rota`) |
| Paralelismo | Configurado por projeto |
| Autenticação | Setup project separado (`auth.setup.ts`) |

---

## 5. Arquitetura dos Testes E2E

O projeto adota o padrão **Page Object Model (POM)**, separando a lógica de interação com a UI da lógica de asserção dos testes.

```
e2e-tests/
├── tests/
│   ├── e2e/               # Suítes de teste por domínio
│   │   ├── auth.spec.ts
│   │   ├── navigation.spec.ts
│   │   └── smoke.spec.ts
│   ├── fixtures/          # Configuração compartilhada
│   │   ├── auth.setup.ts  # Setup de autenticação (executado uma vez)
│   │   └── test-data.ts   # Dados, constantes e mensagens de teste
│   └── pages/             # Page Objects por tela
│       ├── BasePage.ts
│       ├── LoginPage.ts
│       ├── DashboardPage.ts
│       ├── ActivitiesPage.ts
│       ├── ActivityModal.ts
│       ├── UserModal.ts
│       └── UsersPage.ts
├── playwright.config.ts
└── .env / .env.example
```

---

## 6. Padrões Adotados

### 6.1 BasePage

Todas as Page Objects herdam de `BasePage`, que encapsula:

- Elementos comuns: sidebar de navegação (8 itens de menu), topbar (busca, notificações, configurações)
- Verificação de autenticação
- Navegação para as principais rotas via `ROUTES`

```
BasePage
  ├── LoginPage
  ├── DashboardPage
  ├── ActivitiesPage
  ├── UsersPage
  └── (demais páginas)
```

### 6.2 Seletores por Papel e Atributo (Role-Based Selectors)

Os seletores priorizam atributos semânticos e acessíveis, na seguinte ordem de preferência:

1. `getByRole()` — papel ARIA (button, link, heading, textbox, etc.)
2. `getByPlaceholder()` — campos de formulário por placeholder
3. `getByText()` — elementos por conteúdo textual visível
4. `locator()` com seletores CSS — apenas quando necessário

Evitar: seletores frágeis por índice numérico ou estrutura DOM arbitrária.

### 6.3 Fallback de Espera (Padrão `.catch()`)

Para elementos opcionais ou com tempo de aparição variável, utiliza-se o padrão de fallback:

```typescript
await element.waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {});
```

Aplicar quando:
- Aguardar desaparecimento de loading spinner
- Interagir com elementos que podem não estar presentes em todos os cenários
- Evitar falhas em ações sobre elementos opcionais

### 6.4 Fixtures de Autenticação

A autenticação é realizada **uma única vez** por suíte via `auth.setup.ts`, que armazena o estado de sessão em `.auth/user.json`. Testes que dependem de sessão autenticada reutilizam este estado, evitando login repetido.

Para testes que requerem **ausência de autenticação** (ex: página de login), utilizar o projeto `chromium-no-auth` definido na configuração do Playwright.

### 6.5 Dados de Teste Centralizados

Todos os dados utilizados nos testes (usuários, rotas, mensagens esperadas, fixtures de atividade) são definidos em `test-data.ts`, garantindo:

- Fonte única de verdade para dados de teste
- Facilidade de manutenção
- Rastreabilidade entre dados e cenários

---

## 7. Organização dos Arquivos

### Regra de nomenclatura

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Suíte de testes | `<domínio>.spec.ts` | `auth.spec.ts` |
| Page Object | `<NomeDaTela>Page.ts` | `DashboardPage.ts` |
| Modal Page Object | `<NomeDoModal>Modal.ts` | `ActivityModal.ts` |
| Setup / Fixture | `<tipo>.setup.ts` | `auth.setup.ts` |
| Dados de teste | `test-data.ts` | `test-data.ts` |

### Tags de agrupamento

| Tag | Uso |
|-----|-----|
| `@smoke` | Testes de saúde básica, pós-deploy |
| `@auth` | Testes do fluxo de autenticação |
| `@navigation` | Testes de navegação entre módulos |

---

## 8. Estratégia de Dados de Teste

- Dados de teste são mantidos em `tests/fixtures/test-data.ts`
- Usuários de teste definidos por perfil: `TEST_USERS.standard`, `TEST_USERS.admin`, `TEST_USERS.invalid`
- Nenhum dado de produção deve ser utilizado em testes
- Variáveis sensíveis (credenciais, URLs) devem ser configuradas via `.env` (nunca commitadas)
- O arquivo `.env.example` documenta todas as variáveis necessárias

---

## 9. Estratégia de Autenticação nos Testes

| Cenário | Abordagem |
|---------|-----------|
| Testes de funcionalidade autenticada | Reutilizar estado de sessão salvo por `auth.setup.ts` |
| Testes de login/logout/recuperação | Usar projeto `chromium-no-auth` (sem estado salvo) |
| Testes com perfil admin | Utilizar `TEST_USERS.admin` com setup dedicado |
| Testes de permissão | Verificar bloqueio para `TEST_USERS.standard` em rotas restritas |

---

## 10. Boas Práticas

- **Independência:** Cada teste deve ser independente e não depender do estado de outros testes
- **Determinismo:** Testes devem produzir o mesmo resultado em execuções repetidas
- **Legibilidade:** Nomes de testes devem descrever o comportamento esperado, não a implementação
- **Seletores resilientes:** Preferir seletores por papel/texto em vez de seletores CSS frágeis
- **Timeout explícito:** Definir timeouts explícitos para esperas; evitar `sleep()` arbitrário
- **Falha rápida:** Um teste deve falhar imediatamente ao detectar um problema, sem silenciar erros
- **Sem dependência de ordem:** A ordem de execução dos testes não deve importar
- **Documentação inline:** Page Objects devem ter comentários explicando a estrutura HTML relacionada
- **Ambiente de homologação:** Testes E2E nunca devem ser executados contra produção

---

## 11. Critérios de Qualidade

| Critério | Meta |
|----------|------|
| Cobertura de fluxos críticos (auth, navegação) | 100% dos cenários definidos |
| Estabilidade da suíte de smoke | 0 flakiness em execuções consecutivas |
| Tempo máximo de execução da suíte completa | < 5 minutos |
| Novos requisitos funcionais | Devem ter ao menos 1 teste E2E antes do merge |

---

## 12. Pendências e Próximos Passos

| Prioridade | Item |
|-----------|------|
| Alta | Criar testes E2E para fluxo de Dashboard (mapa, filtros, gráficos) |
| Alta | Criar testes E2E para CRUD de Atividades |
| Média | Criar testes de integração para endpoints críticos da API |
| Média | Criar testes unitários para funções de regra de negócio (`regions.ts`, lógica de status) |
| Baixa | Configurar relatório de cobertura automatizado em CI/CD |
| Baixa | Adicionar testes para módulo Financeiro com validação de perfil |

---

## Referências

- `e2e-tests/playwright.config.ts` — Configuração do Playwright
- `e2e-tests/tests/fixtures/test-data.ts` — Dados centralizados de teste
- `e2e-tests/tests/pages/BasePage.ts` — Classe base dos Page Objects
- `docs/qa/cobertura.md` — Matriz de rastreabilidade de testes
- `docs/requisitos/DER_v1.2.md` — Requisitos funcionais
