# Gestão de Etapas (Steps)

**Referência DER:** RF-ETP-001 | RF-ETP-002 | RF-ETP-003 | RF-ETP-004 | RF-ETP-005
**Módulo:** Etapas (Steps)
**Data:** 2026-04-09
**Versão:** 1.0
**Status geral:** 🟡 Implementado no backend — frontend parcialmente integrado

---

## Status de Implementação

| Item | Status |
|------|--------|
| CRUD de etapas (criar, listar, editar, excluir) | ✅ Implementado |
| Vínculo obrigatório com unidade | ✅ Implementado |
| Armazenamento dual (collection + moreStages) | ✅ Implementado |
| Recálculo automático de status da unidade | ✅ Implementado |
| Geração automática de pseudo-documentação | ✅ Implementado |
| Gestão de anexos com tipos | ✅ Implementado |
| Exibição no frontend (UnitDetailsPage) | ✅ Implementado |
| Modal de criação/edição (AddStepModal) | ✅ Implementado |
| Controle de acesso por perfil (RBAC) | ❌ Não implementado — apenas autenticação |
| Endpoint de busca por ID individual | ❌ Não implementado |
| Histórico de mudanças por etapa | ❌ Não implementado |
| Alertas automáticos por vencimento | ❌ Não implementado |

---

## 1. Objetivo

As Etapas (`moreStages` / `steps`) representam **fases documentais adicionais** associadas a uma unidade. Elas complementam as etapas regulatórias padrão (`stages`) vinculadas automaticamente a licenças, permitindo o registro de documentos e processos customizados por unidade.

O papel central das etapas no sistema é:

1. **Rastrear o estado documental** de cada fase de uma unidade
2. **Influenciar diretamente o status regulatório** da unidade — toda alteração em uma etapa recalcula automaticamente o status da unidade vinculada
3. **Agregar documentos e evidências** por fase, por meio de anexos (`attachments`)
4. **Registrar automaticamente pseudo-documentação** quando campos descritivos são preenchidos sem anexo físico

> **Distinção importante:** Etapas (`steps`) têm status **binário** (REGULAR/IRREGULAR), diferente das Atividades (`activities`), que possuem status textual de fluxo de trabalho (A fazer, Em andamento, Concluído, Exigência). São modelos distintos para finalidades distintas.

---

## 2. Descrição Funcional (AS-IS)

### O que são Etapas

Etapas são registros documentais que representam exigências específicas de uma unidade ao longo de seu ciclo de vida regulatório. Cada etapa:

- Está obrigatoriamente vinculada a **uma única unidade**
- Possui um **nome** e pode ter documentos, datas e descrições associadas
- Tem um **status binário**: concluída (`true` = REGULAR) ou pendente (`false` = IRREGULAR)
- Pode ter **múltiplos anexos** com tipos distintos: `file`, `activity`, `documentation`

### Como são utilizadas

No frontend, as etapas aparecem na tela de detalhes da unidade (`UnitDetailsPage`), em um acordeão listado **após** as etapas regulatórias padrão (`stages`). O usuário pode:

- Visualizar o status de cada etapa (REGULAR / IRREGULAR)
- Abrir o modal `AddStepModal` para criar ou editar uma etapa
- Excluir etapas existentes
- Visualizar anexos com suas datas de criação, vencimento e responsável

### Como se relacionam com unidades

Toda mutação em uma etapa (criar, editar ou excluir) dispara automaticamente a função `recalculateUnitStatus()` no backend, que recalcula o status consolidado da unidade com base em todas as suas etapas e fases regulatórias. O impacto é imediato e automático.

---

## 3. Modelo de Dados (AS-IS)

### 3.1 Estrutura da Etapa (`IStepPayload`)

| Campo | Tipo | Obrig. | Padrão | Descrição |
|-------|------|:------:|--------|-----------|
| `_id` | ObjectId | auto | — | Identificador único gerado automaticamente |
| `unitId` | ObjectId | ✅ | — | Referência à unidade vinculada |
| `name` | string | ✅ | — | Nome da etapa |
| `status` | boolean | — | `false` | `true` = REGULAR, `false` = IRREGULAR |
| `documentName` | string | — | — | Nome do documento associado |
| `documentType` | string | — | — | Tipo do documento |
| `dueDate` | string (ISO) | — | — | Data de vencimento |
| `issueDate` | string (ISO) | — | `null` | Data de emissão |
| `stageDescription` | string | — | — | Descrição da etapa |
| `documentDescription` | string | — | — | Descrição do documento |
| `image` | string | — | — | Referência de imagem |
| `attachments` | `IAttachment[]` | — | `[]` | Lista de anexos |
| `createdAt` | Date | auto | — | Timestamp de criação |
| `updatedAt` | Date | auto | — | Timestamp de última atualização |

### 3.2 Estrutura do Anexo (`IAttachment`)

| Campo | Tipo | Obrig. | Padrão | Descrição |
|-------|------|:------:|--------|-----------|
| `name` | string | ✅ | — | Nome do anexo |
| `stage` | string | ✅ | — | Nome da etapa associada |
| `type` | `"file"` \| `"activity"` \| `"documentation"` | — | `"file"` | Tipo do anexo |
| `title` | string | — | — | Título do anexo |
| `created` | string | — | — | Data de criação (ISO) |
| `validate` | string | — | — | Data de vencimento / validação (ISO) |
| `status` | boolean | — | — | Status do anexo (`true` = válido) |
| `userAdded` | string | — | — | Nome do usuário que adicionou |
| `activityId` | string | — | — | ID da atividade relacionada (se `type = "activity"`) |

### 3.3 Estratégia de Armazenamento (Dual Write)

As etapas são persistidas em **dois locais simultaneamente**:

```
┌─────────────────────────────────────────────────────┐
│  Coleção: steps                                     │
│  Documento completo da etapa (registro canônico)    │
│  Consultado via GET /steps?unitId=xxx               │
└──────────────────────┬──────────────────────────────┘
                       │ sincronizado em toda mutação
┌──────────────────────▼──────────────────────────────┐
│  Coleção: units → campo moreStages: []              │
│  Cópia desnormalizada da etapa                      │
│  Usada no recálculo de status e exibição direta     │
└─────────────────────────────────────────────────────┘
```

> **Atenção:** Qualquer inconsistência entre `steps` e `units.moreStages` pode causar divergência de status. As operações do controller mantêm a sincronização, mas falhas parciais podem gerar dados inconsistentes.

### 3.4 Relação com a Unidade

```
Unit
├── stages[]          ← etapas regulatórias padrão (vinculadas a licenças)
│     └── status: boolean | null (null = NÃO OBRIGATÓRIO)
└── moreStages[]      ← etapas customizadas (steps)
      └── status: boolean (sem null — sempre obrigatório)
```

O campo `moreStages` da unidade é um array de objetos com a mesma estrutura de `IStepPayload`, atualizado a cada operação de criação, edição ou exclusão de etapa.

---

## 4. Estados e Transições

### 4.1 Status da Etapa

O status de uma etapa é **binário**:

| Valor | Representação na UI | Cor | Significado |
|-------|--------------------:|:---:|-------------|
| `false` | IRREGULAR | 🔴 Vermelho | Etapa pendente / não concluída |
| `true` | REGULAR | 🟢 Verde | Etapa concluída / documento regularizado |

> **Diferença em relação a `stages` padrão:** As etapas regulatórias (`stages`) aceitam `null` como terceiro estado ("NÃO OBRIGATÓRIO", exibido em cinza). As etapas customizadas (`moreStages`) **não aceitam null** — são sempre obrigatórias.

### 4.2 Impacto no Status da Unidade

O status da unidade é calculado com base em **todas** as etapas ativas (tanto `stages` quanto `moreStages`). A tabela abaixo descreve os possíveis resultados:

| Status da Unidade | Condição |
|-------------------|----------|
| `"Sem pendências"` | Todas as etapas ativas têm `status = true` |
| `"Funcionando com Pendência"` | Unidade `isOperating = true` E há etapas com `status = false` |
| `"Prestes a vencer"` | Alguma etapa pendente tem `dueDate` nos próximos 10 dias |
| `"Vencidos"` | Alguma etapa pendente tem `dueDate < hoje` |
| `"Pendente de emissão"` | Nenhuma das condições anteriores — estado padrão |

### 4.3 Transições de Status da Unidade

```
[Pendente de emissão]
       │
       ├──→ [Prestes a vencer]     quando dueDate ≤ hoje + 10 dias
       │
       ├──→ [Vencidos]             quando dueDate < hoje
       │
       └──→ [Sem pendências]       quando todas as etapas ativas = true
                  │
                  └──→ isOperating = true (automático)

[Sem pendências] → [Funcionando com Pendência]
       quando isOperating = true E nova etapa adicionada com status = false
```

### 4.4 Regras de Transição

| Regra | Descrição |
|-------|-----------|
| Recálculo automático | Qualquer mutação em uma etapa dispara `recalculateUnitStatus()` |
| Transição para operando | Se todas as etapas ativas = `true`, `isOperating` da unidade é automaticamente definido como `true` |
| Prioridade de status negativo | `"Vencidos"` tem precedência sobre `"Prestes a vencer"` |
| Etapas `null` são ignoradas | Etapas com `status = null` não participam do cálculo (apenas em `stages`, não em `moreStages`) |

---

## 5. Regras de Negócio Refinadas

### RN-ETP-001 — Vínculo obrigatório com unidade existente

A unidade referenciada por `unitId` deve existir na coleção `units` no momento da criação da etapa. Se a unidade não for encontrada, a criação é abortada com erro 404.

**Arquivo:** `steps.controller.ts` → função `create`, linha de validação `unitsCollection.findOne({ _id: unitId })`

---

### RN-ETP-002 — Status padrão IRREGULAR na criação

Etapas criadas sem `status` explícito recebem automaticamente `status = false` (IRREGULAR). O formulário frontend (`AddStepModal`) inicializa o campo com `status: true` por padrão — portanto, o comportamento depende da interação do usuário.

**Arquivo:** `steps.controller.ts` → `status: data.status ?? false`

---

### RN-ETP-003 — Sincronização obrigatória com `moreStages` da unidade

Toda operação de criação, edição ou exclusão deve manter os dois registros em sincronia:
- Coleção `steps`: registro principal
- `units.moreStages`: cópia desnormalizada

A sincronização é feita via operadores MongoDB: `$push` (criar), `$set` com filtro posicional (editar), `$pull` (excluir).

**Arquivo:** `steps.controller.ts` → operações `updateOne` na coleção `units`

---

### RN-ETP-004 — Recálculo automático do status da unidade em toda mutação

Após qualquer operação (criar, editar, excluir), o sistema executa automaticamente `recalculateUnitStatus(unitId)`. Esse processo:
1. Busca a unidade com todos os seus dados
2. Calcula o novo status com base em `stages` + `moreStages`
3. Atualiza `units.status` e `units.isOperating` se houver mudança
4. Cria um registro de histórico com ação `"Atualização Automática de Status"`
5. Dispara notificação automática para o usuário

**Arquivo:** `units.controller.ts` → funções `recalculateUnitStatus()` e `calculateUnitStatus()`

---

### RN-ETP-005 — Geração automática de pseudo-documentação

Ao **editar** uma etapa, se a requisição **não contiver `attachments`** mas contiver `stageDescription` **ou** `documentType`, o sistema gera automaticamente um registro de pseudo-documentação inserido no array `attachments` da etapa dentro de `moreStages`.

**Estrutura do pseudo-documento gerado:**

| Campo | Valor |
|-------|-------|
| `name` | `"DOC_" + timestamp` |
| `stage` | Nome da etapa |
| `title` | `documentDescription` ou `stageDescription` ou `documentType` (nessa ordem) |
| `created` | Data/hora atual (ISO) |
| `status` | `data.status` ou `false` |
| `type` | `"documentation"` |
| `userAdded` | Nome do usuário autenticado |

**Arquivo:** `steps.controller.ts` → bloco condicional na função `update`

---

### RN-ETP-006 — Tipo padrão de anexo

Anexos enviados sem o campo `type` recebem automaticamente o valor `"file"`.

**Valores válidos para `type`:**

| Valor | Uso |
|-------|-----|
| `"file"` | Documento ou arquivo genérico |
| `"activity"` | Anexo vinculado a uma atividade (possui `activityId`) |
| `"documentation"` | Pseudo-documentação gerada automaticamente |

**Arquivo:** `steps.controller.ts` → atribuição padrão no processamento de attachments

---

### RN-ETP-007 — Notificações automáticas por mudança de status da unidade

Quando o status da unidade muda como consequência de uma mutação em etapa, o sistema dispara automaticamente uma notificação:

| Novo status da unidade | Tipo da notificação |
|------------------------|:-------------------:|
| `"Vencidos"` | `"alert"` |
| `"Prestes a vencer"` | `"warning"` |
| Qualquer outro | `"info"` |

**Arquivo:** `units.controller.ts` → função `recalculateUnitStatus()`, bloco de notificação

---

## 6. Fluxos

### 6.1 Fluxo Principal — Criação de Etapa

```
Usuário (frontend)
  └─> Abre UnitDetailsPage da unidade desejada
        └─> Clica em "Adicionar Etapa"
              └─> AddStepModal é exibido com formulário em branco
                    └─> Usuário preenche: nome, datas, descrição, status, anexo (opcional)
                          └─> POST /steps
                                │
                                ├─> Valida unitId → busca unidade → 404 se não encontrar
                                ├─> Insere em coleção steps
                                ├─> Insere em units.moreStages via $push
                                └─> recalculateUnitStatus(unitId)
                                      ├─> Calcula novo status da unidade
                                      ├─> Atualiza units.status e units.isOperating (se mudou)
                                      ├─> Registra histórico automático
                                      └─> Dispara notificação (se status mudou)
```

---

### 6.2 Fluxo Alternativo — Edição com Pseudo-documentação

```
Usuário clica em editar etapa existente
  └─> AddStepModal abre com dados preenchidos
        └─> Usuário preenche stageDescription ou documentType
              └─> NÃO adiciona arquivo de anexo
                    └─> PUT /steps/:id
                          │
                          ├─> Atualiza coleção steps via $set
                          ├─> Detecta: sem attachments + tem stageDescription/documentType
                          ├─> Gera pseudo-doc { name: "DOC_timestamp", type: "documentation", ... }
                          ├─> Insere pseudo-doc em moreStages.$.attachments via $push
                          └─> recalculateUnitStatus(unitId)
```

---

### 6.3 Fluxo Alternativo — Edição com Anexo Real

```
Usuário edita etapa e adiciona arquivo de imagem
  └─> AddStepModal: cria attachment { name: filename, type: "file", status: boolean, ... }
        └─> PUT /steps/:id com attachments: [attachment]
              │
              ├─> Atualiza coleção steps
              ├─> Detecta: tem attachments → NÃO gera pseudo-doc
              ├─> Insere attachment em moreStages.$.attachments via $push
              └─> recalculateUnitStatus(unitId)
```

---

### 6.4 Fluxo Alternativo — Exclusão de Etapa

```
Usuário clica em excluir etapa
  └─> Confirmação de exclusão no frontend
        └─> DELETE /steps/:id
              │
              ├─> Busca etapa na coleção steps → 404 se não encontrar
              ├─> Remove da coleção steps via deleteOne
              ├─> Remove de units.moreStages via $pull com _id
              └─> recalculateUnitStatus(unitId)
                    └─> Unidade pode ter status melhorado (ex: se era a etapa que causava "Vencidos")
```

---

### 6.5 Fluxo Alternativo — Etapa Marca Unidade como Operando

```
Última etapa pendente da unidade é concluída (status = true)
  └─> recalculateUnitStatus()
        ├─> Verifica: todas as etapas ativas têm status = true
        ├─> Define: isOperating = true na unidade
        ├─> Define: status = "Sem pendências"
        ├─> Registra histórico automático
        └─> Notificação tipo "info" disparada
```

---

## 7. Integrações com Outros Módulos

### 7.1 Unidades (impacto direto)

A relação entre Etapas e Unidades é a mais crítica do módulo:

| Evento | Impacto na Unidade |
|--------|-------------------|
| Etapa criada | `moreStages` atualizado; status recalculado |
| Etapa editada | `moreStages` sincronizado; status recalculado |
| Etapa excluída | `moreStages` limpo; status recalculado |
| Todas as etapas concluídas | `isOperating` definido como `true` automaticamente |

**Arquivo:** `units.controller.ts` → `recalculateUnitStatus()`, `calculateUnitStatus()`, `syncStageAndUnitStatus()`

---

### 7.2 Licenças (gatilhos indiretos)

As licenças geram as etapas regulatórias padrão (`stages`), que participam do mesmo cálculo de status que as etapas customizadas (`moreStages`). As etapas customizadas complementam — mas não substituem — as etapas regulatórias.

**Relação no cálculo:**

```javascript
calculateUnitStatus(stages, isOperating, moreStages)
// stages = etapas de licença
// moreStages = etapas customizadas (steps)
// ambas participam do cálculo de status da unidade
```

---

### 7.3 Atividades

Anexos de uma etapa podem ter `type = "activity"` com campo `activityId`, criando uma referência entre o anexo da etapa e uma atividade do sistema.

> **Não há integração direta na criação:** a referência é armazenada no anexo, mas o sistema não valida automaticamente a existência da atividade ao inserir o anexo *(comportamento inferido com base no código — não foi encontrada validação de `activityId`)*.

---

### 7.4 Notificações

Notificações são disparadas automaticamente quando o **status da unidade muda** após uma mutação de etapa:

| Status da Unidade | Tipo da Notificação |
|-------------------|:-------------------:|
| `"Vencidos"` | `alert` 🔴 |
| `"Prestes a vencer"` | `warning` 🟡 |
| Outros | `info` 🔵 |

O evento de notificação é `UNIT_STATUS_CHANGED`. A notificação é criada via `notificationService.createAutoNotification()`.

**Arquivo:** `units.controller.ts` → `recalculateUnitStatus()`, bloco de notificação

---

## 8. Critérios de Aceite (BDD)

### Cenário 1 — Criação de etapa com sucesso

```gherkin
Dado que o usuário autenticado está na tela de detalhes de uma unidade existente
Quando preencher o nome da etapa e submeter o formulário
Então a etapa deve aparecer na lista de etapas da unidade
  E o status da unidade deve ser recalculado automaticamente
```

---

### Cenário 2 — Criação com status IRREGULAR por padrão

```gherkin
Dado que o usuário cria uma etapa sem definir o campo status
Quando a etapa for salva
Então o status da etapa deve ser IRREGULAR (false)
  E a unidade deve refletir essa pendência no seu status
```

---

### Cenário 3 — Edição de etapa altera status da unidade

```gherkin
Dado que existe uma etapa com status IRREGULAR (false) vinculada a uma unidade
Quando o usuário editar a etapa e definir status como true (REGULAR)
Então o status da etapa deve ser atualizado para REGULAR
  E o sistema deve recalcular o status da unidade
  E se todas as demais etapas também estiverem regulares, a unidade deve receber status "Sem pendências"
```

---

### Cenário 4 — Unidade transicionada para "operando" automaticamente

```gherkin
Dado que uma unidade possui etapas pendentes e isOperating é false
Quando a última etapa pendente for concluída (status = true)
Então o sistema deve definir isOperating = true na unidade automaticamente
  E o status da unidade deve ser "Sem pendências"
```

---

### Cenário 5 — Pseudo-documentação gerada automaticamente

```gherkin
Dado que o usuário edita uma etapa
Quando preencher stageDescription ou documentType
  E não adicionar nenhum arquivo de anexo
Então o sistema deve gerar automaticamente um registro de documentação
  E o registro deve ter type = "documentation" e name iniciando com "DOC_"
```

---

### Cenário 6 — Etapa com data vencida altera status da unidade para "Vencidos"

```gherkin
Dado que uma etapa tem dueDate anterior à data atual
  E o status da etapa é false (IRREGULAR)
Quando o sistema calcular o status da unidade
Então o status da unidade deve ser "Vencidos"
  E uma notificação do tipo "alert" deve ser disparada
```

---

### Cenário 7 — Etapa próxima do vencimento altera status da unidade

```gherkin
Dado que uma etapa tem dueDate dentro dos próximos 10 dias
  E o status da etapa é false (IRREGULAR)
Quando o sistema calcular o status da unidade
Então o status da unidade deve ser "Prestes a vencer"
  E uma notificação do tipo "warning" deve ser disparada
```

---

### Cenário 8 — Exclusão de etapa recalcula status da unidade

```gherkin
Dado que uma unidade possui uma etapa com status IRREGULAR como única pendência
Quando o usuário excluir essa etapa
Então a etapa deve ser removida da coleção steps
  E removida do array moreStages da unidade
  E o status da unidade deve ser recalculado
  E se não houver mais pendências, o status deve ser "Sem pendências"
```

---

### Cenário 9 — Unidade não encontrada ao criar etapa

```gherkin
Dado que o usuário envia um unitId inválido ou inexistente ao criar uma etapa
Quando a requisição for processada
Então o sistema deve retornar erro 404
  E a mensagem deve ser "Unidade não encontrada."
  E nenhum dado deve ser persistido
```

---

### Cenário 10 — Tipo de anexo padrão

```gherkin
Dado que o usuário cria uma etapa com um anexo sem informar o campo type
Quando o anexo for salvo
Então o campo type deve ser definido automaticamente como "file"
```

---

## 9. Casos de Erro

| Caso | Condição | Resposta do Sistema |
|------|----------|---------------------|
| Unidade não encontrada | `unitId` inválido ou inexistente | HTTP 404 — `"Unidade não encontrada."` |
| Etapa não encontrada (editar) | `id` inválido ou inexistente | HTTP 404 — `"Step not found."` |
| Etapa não encontrada (excluir) | `id` inválido ou inexistente | HTTP 404 — `"Step not found."` |
| `unitId` com formato inválido | ID com menos ou mais de 24 caracteres hex | HTTP 400 — `"Invalid unitId format."` |
| Nome ausente | `name` vazio ou não informado | Erro de validação Zod — campo obrigatório |
| Data inválida | `dueDate` ou `issueDate` com formato incorreto | Erro de validação Zod — ISO datetime inválido |
| Falha no recálculo de status | Erro interno ao buscar unidade em `recalculateUnitStatus` | Erro silencioso no backend — unidade pode ficar com status desatualizado *(gap identificado)* |

---

## 10. Gaps Identificados

### Gap 1 — Não há endpoint de busca por ID individual

**Situação atual:** Existe `GET /steps?unitId=xxx` para listar por unidade, mas não há `GET /steps/:id`.
**Impacto:** Para acessar uma etapa específica, é necessário listar todas as etapas da unidade e filtrar no cliente.

---

### Gap 2 — Sem controle de acesso por perfil (RBAC)

**Situação atual:** Todos os endpoints exigem apenas autenticação (`authenticate`), sem verificação de permissões por perfil.
**Impacto:** Qualquer usuário autenticado pode criar, editar ou excluir etapas de qualquer unidade.

---

### Gap 3 — Inconsistência entre DER e implementação no conceito de "Exigência"

**Situação atual:** O DER menciona o status "Exigência" (RF-UNI-003, RF-ATV-004) como um estado que bloqueia avanço. No módulo de Etapas, não existe esse conceito — o status é binário (boolean). O bloqueio por exigência existe somente no módulo de **Atividades**, não em Etapas.
**Impacto:** Risco de confusão entre os dois módulos ao criar casos de teste ou issues.

---

### Gap 4 — Possível inconsistência de dados no armazenamento dual

**Situação atual:** Etapas são salvas em dois lugares (`steps` collection + `units.moreStages`). Se uma operação de banco de dados falhar parcialmente (ex: `steps` atualizado, mas `moreStages` não), os dados podem ficar inconsistentes.
**Impacto:** Status da unidade pode ser calculado com dados desatualizados.

---

### Gap 5 — Ausência de histórico específico por etapa

**Situação atual:** O histórico registrado é o da **unidade** (ação `"Atualização Automática de Status"`), não da etapa individualmente.
**Impacto:** Não é possível rastrear quais etapas foram modificadas, por quem e quando, sem consultar os dados diretos da coleção.

---

### Gap 6 — `activityId` em anexos sem validação de existência

**Situação atual:** Anexos do tipo `"activity"` possuem campo `activityId`, mas o sistema **não valida** se a atividade referenciada existe.
**Impacto:** Possível referência quebrada se a atividade for excluída.

---

### Gap 7 — Alertas de vencimento não são disparados proativamente

**Situação atual:** O status `"Prestes a vencer"` é calculado somente quando uma mutação na unidade ou etapa ocorre. **Não há job periódico** que verifique e atualize o status de unidades com datas próximas ao vencimento.
**Impacto:** Uma unidade pode permanecer com status `"Pendente de emissão"` mesmo com `dueDate` vencida, até que uma mutação dispare o recálculo.

---

## 11. Melhorias Futuras (TO-BE)

> Itens desta seção não são requisitos atuais. São sugestões para evolução do produto.

### Melhoria 1 — Job periódico de recálculo de status

Criar um job (cron) que execute periodicamente `recalculateUnitStatus()` para todas as unidades com etapas próximas ao vencimento, garantindo que o status seja atualizado mesmo sem interação do usuário.

**Benefício:** Notificações de vencimento proativas; status sempre atualizado.

---

### Melhoria 2 — Controle de permissão por perfil

Implementar verificação RBAC nos endpoints de etapas, seguindo o modelo de permissões granulares já utilizado no módulo de Prestadores (`PROVIDERS_CREATE`, `PROVIDERS_UPDATE_OWN`, etc.).

**Benefício:** `GESTOR_UNIDADE` acessa apenas etapas de sua unidade; `GESTOR_REDE` acessa etapas de toda a rede.

---

### Melhoria 3 — Endpoint de busca por ID individual

Criar `GET /steps/:id` para recuperar uma etapa específica sem necessidade de listar todas.

**Benefício:** Acesso direto a etapas em páginas de detalhe.

---

### Melhoria 4 — Histórico de alterações por etapa

Criar log de auditoria específico para etapas, registrando: quem alterou, quando, quais campos mudaram e de qual valor para qual.

**Benefício:** Rastreabilidade completa das mudanças documentais por etapa.

---

### Melhoria 5 — Transação atômica para armazenamento dual

Usar transações MongoDB para garantir consistência entre a coleção `steps` e o array `moreStages` da unidade. Em caso de falha em qualquer operação, ambas as operações devem ser revertidas.

**Benefício:** Elimina o Gap 4 (inconsistência de dados em falha parcial).

---

### Melhoria 6 — Alertas configuráveis de vencimento por etapa

Permitir configurar alertas de vencimento por etapa com antecedência customizável (ex: 30, 15, 7 dias), gerando notificações dirigidas ao responsável.

**Benefício:** Gestão proativa de documentação; redução de etapas vencidas.

---

## 12. Mapeamento com Código

| Arquivo | Localização | Papel |
|---------|-------------|-------|
| `steps.controller.ts` | `server/src/modules/steps/steps.controller.ts` | CRUD de etapas + sincronia com `moreStages` |
| `steps.routes.ts` | `server/src/modules/steps/steps.routes.ts` | Definição dos 4 endpoints REST |
| `units.controller.ts` | `server/src/modules/units/units.controller.ts` | `recalculateUnitStatus()`, `calculateUnitStatus()`, `syncStageAndUnitStatus()` |
| `UnitDetailsPage.tsx` | `web/src/pages/UnitDetailsPage.tsx` | Exibição de etapas na tela da unidade |
| `AddStepModal.tsx` | `web/src/components/Modals/AddStepModal.tsx` | Modal de criação e edição de etapas |
| `api.ts` | `web/src/services/api.ts` | Funções: `createStep()`, `updateStep()`, `deleteStep()` |
| `index.ts` (types) | `web/src/types/index.ts` | `IStepPayload`, `IAttachment`, `IStages`, `IUnit.moreStages` |

### Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|:------------:|-----------|
| `POST` | `/steps` | ✅ | Criar nova etapa |
| `GET` | `/steps` | ✅ | Listar etapas (filtro opcional `?unitId=`) |
| `PUT` | `/steps/:id` | ✅ | Atualizar etapa existente |
| `DELETE` | `/steps/:id` | ✅ | Excluir etapa |

### Diagrama de dependências

```
AddStepModal.tsx
  └─> api.ts: createStep() / updateStep() / deleteStep()
        └─> POST/PUT/DELETE /steps
              └─> steps.controller.ts
                    ├─> units collection (moreStages)
                    ├─> steps collection
                    └─> units.controller.recalculateUnitStatus()
                          ├─> calculateUnitStatus()
                          ├─> unitsCollection.updateOne (status + isOperating)
                          ├─> history entry insert
                          └─> notificationService.createAutoNotification()
```

---

## 13. Sugestão de Issues (GitLab)

### ISSUE 1

**Título:** `[ETP] Implementar controle de acesso por perfil no módulo de Etapas`
**Tipo:** Melhoria
**Descrição:**
Atualmente os endpoints de Etapas requerem apenas autenticação. Adicionar RBAC seguindo o modelo do módulo de Prestadores.

**Critérios de aceite:**
- `GESTOR_UNIDADE` só pode criar/editar/excluir etapas de sua própria unidade
- `GESTOR_REDE` acessa etapas de todas as unidades de sua rede
- `ADMIN` tem acesso irrestrito
- Tentativa de acesso não autorizado retorna HTTP 403

---

### ISSUE 2

**Título:** `[ETP] Criar endpoint GET /steps/:id para busca individual`
**Tipo:** Feature
**Descrição:**
Adicionar endpoint para recuperar uma etapa específica por ID, sem precisar listar todas as etapas da unidade.

**Critérios de aceite:**
- `GET /steps/:id` retorna dados completos da etapa
- Retorna 404 se o ID não existir
- Requer autenticação

---

### ISSUE 3

**Título:** `[ETP][UNIT] Implementar job periódico de recálculo de status de unidades`
**Tipo:** Feature
**Descrição:**
Criar job agendado que execute `recalculateUnitStatus()` para unidades com etapas com `dueDate` próximo ou vencido, sem depender de mutações manuais.

**Critérios de aceite:**
- Job executa ao menos uma vez ao dia
- Atualiza status de unidades com etapas vencidas para `"Vencidos"`
- Dispara notificações automáticas para os responsáveis
- Não gera re-processamento para unidades já atualizadas

---

### ISSUE 4

**Título:** `[ETP] Documentar e validar campo activityId em anexos de etapa`
**Tipo:** Melhoria
**Descrição:**
Anexos com `type = "activity"` possuem `activityId` sem validação de existência. Avaliar e implementar validação.

**Critérios de aceite:**
- Se `type = "activity"` e `activityId` for fornecido, validar existência na coleção `activities`
- Retornar 404 com mensagem clara se atividade não encontrada
- Documentar comportamento esperado

---

### ISSUE 5

**Título:** `[ETP][UNIT] Garantir consistência atômica no armazenamento dual de etapas`
**Tipo:** Melhoria
**Descrição:**
Usar transações MongoDB para garantir que `steps` e `units.moreStages` sejam sempre atualizados juntos ou revertidos juntos.

**Critérios de aceite:**
- Falha no update de `moreStages` reverte o insert em `steps` (e vice-versa)
- Sem registros órfãos em `steps` sem correspondência em `moreStages`
- Coberto por teste de integração simulando falha parcial
