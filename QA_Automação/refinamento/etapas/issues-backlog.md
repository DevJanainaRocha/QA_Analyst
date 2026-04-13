# Issues — Módulo Etapas (Steps)

**Módulo:** Etapas (Steps)
**Origem:** `docs/refinamento/etapas/gestao-etapas.md`
**Data de geração:** 2026-04-09
**Status:** 🟡 Aguardando revisão — NÃO enviado ao GitLab

> Todas as issues abaixo foram geradas exclusivamente a partir dos **Gaps Identificados**, **Casos de Erro** e **Melhorias Futuras** documentados no refinamento funcional do módulo.
> Nenhum comportamento foi inventado.

---

## Resumo

| # | Tipo | Título | Prioridade |
|---|------|--------|:----------:|
| 1 | 🐛 BUG | Falha no recálculo de status da unidade não é reportada ao usuário | Alta |
| 2 | 🐛 BUG | Inconsistência de dados possível entre `steps` e `moreStages` em falha parcial | Alta |
| 3 | ✨ FEATURE | Consulta individual de etapa por ID | Média |
| 4 | ✨ FEATURE | Atualização proativa de status para unidades com etapas vencidas | Alta |
| 5 | ✨ FEATURE | Histórico de alterações por etapa | Média |
| 6 | ✨ FEATURE | Alertas de vencimento configuráveis por etapa | Média |
| 7 | ✨ FEATURE | Validação de atividade referenciada em anexos do tipo `activity` | Baixa |
| 8 | 🔧 MELHORIA | Controle de acesso por perfil (RBAC) nos endpoints de etapas | Alta |
| 9 | 🔧 MELHORIA | Garantir consistência atômica no armazenamento dual de etapas | Alta |
| 10 | 🔧 MELHORIA | Esclarecer distinção entre status de Etapas e status de Atividades na interface | Média |

---

---

## 🐛 Bugs

---

### Issue 1

**Título:**
`[BUG] Falha no recálculo de status da unidade não é reportada ao usuário`

---

**Descrição:**
Quando uma etapa é criada, editada ou excluída, o backend executa automaticamente a função `recalculateUnitStatus()`. Se essa função falhar internamente (ex: erro ao buscar a unidade, falha de escrita no banco), o erro é **silenciado** — a operação principal (criar/editar/excluir a etapa) retorna sucesso ao cliente, mas o status da unidade fica desatualizado.

O usuário não recebe nenhuma indicação de que o status da unidade pode estar incorreto, e nenhuma notificação de falha é disparada.

**Comportamento atual (AS-IS):**
- Etapa é salva com sucesso ✅
- `recalculateUnitStatus()` falha silenciosamente ❌
- Status da unidade permanece desatualizado sem aviso ❌

---

**Critérios de Aceite:**

```gherkin
Dado que o usuário cria, edita ou exclui uma etapa
Quando a função de recálculo de status da unidade falhar por erro interno
Então o sistema deve registrar o erro em log
  E o usuário deve receber uma indicação de que o status da unidade pode estar desatualizado
  E o sistema deve permitir nova tentativa de recálculo (retry)
```

```gherkin
Dado que o recálculo falhou anteriormente
Quando o usuário acessar a tela de detalhes da unidade
Então o sistema deve indicar visualmente que o status pode estar desatualizado
  E oferecer ação para forçar o recálculo
```

---

**Contexto Técnico:**
- Arquivo: `server/src/modules/units/units.controller.ts` → função `recalculateUnitStatus()`
- O erro ocorre silenciosamente — não há propagação para a resposta da API
- Impacto em: **Unidades** (status incorreto), **Dashboard** (métricas divergentes), **Notificações** (alertas não disparados)

---

**Prioridade:** Alta

**Impacto:**
Status incorreto na unidade afeta o dashboard, os relatórios regulatórios e as notificações de vencimento. Em um contexto regulatório, exibir uma unidade como "Sem pendências" quando há etapas vencidas é um risco operacional real.

**Labels sugeridas:** `backlog`, `bug`, `modulo-etapas`, `modulo-unidades`

---

---

### Issue 2

**Título:**
`[BUG] Inconsistência de dados possível entre coleção steps e moreStages em falha parcial`

---

**Descrição:**
As etapas são armazenadas em dois locais: a coleção `steps` (registro canônico) e o array `moreStages` dentro do documento da unidade (cópia desnormalizada). Essas duas operações são executadas sequencialmente, sem transação atômica.

Se a primeira operação for bem-sucedida e a segunda falhar, os dados ficam inconsistentes: a etapa existe em `steps` mas não em `moreStages` (ou vice-versa). O recálculo de status da unidade usa `moreStages` — portanto, uma inconsistência aqui gera status incorreto sem indicação de erro.

**Comportamento atual (AS-IS):**
- Operações de escrita em `steps` e `units.moreStages` são independentes ❌
- Sem transação garantindo atomicidade ❌
- Falha parcial deixa dados divergentes sem rollback ❌

---

**Critérios de Aceite:**

```gherkin
Dado que o sistema está criando uma etapa
Quando a escrita na coleção steps for bem-sucedida
  E a atualização de moreStages na unidade falhar
Então nenhum registro deve ser criado em steps
  E a unidade não deve ser modificada
  E o usuário deve receber mensagem de erro
```

```gherkin
Dado que o sistema está excluindo uma etapa
Quando a remoção de steps for bem-sucedida
  E a remoção de moreStages falhar
Então a remoção de steps deve ser revertida
  E os dois registros devem permanecer consistentes
```

---

**Contexto Técnico:**
- Arquivo: `server/src/modules/steps/steps.controller.ts` → funções `create`, `update`, `delete`
- MongoDB suporta transações multi-coleção a partir da versão 4.0 com replica sets
- Impacto em: **Unidades** (status baseado em `moreStages`), **Dashboard** (métricas)
- Verificar se o ambiente usa replica set ou standalone antes de implementar

---

**Prioridade:** Alta

**Impacto:**
Dados inconsistentes entre `steps` e `moreStages` resultam em cálculo de status incorreto para a unidade, podendo classificar erroneamente uma unidade como regular ou irregular. Em ambiente de homologação com baixo volume o risco é menor, mas em produção com múltiplos usuários simultâneos a probabilidade aumenta.

**Labels sugeridas:** `backlog`, `bug`, `modulo-etapas`, `modulo-unidades`, `consistencia-dados`

---

---

## ✨ Features

---

### Issue 3

**Título:**
`[FEATURE] Criar endpoint de consulta individual de etapa por ID`

---

**Descrição:**
Atualmente, o módulo de Etapas não possui endpoint `GET /steps/:id`. Para acessar os dados de uma etapa específica, é necessário listar todas as etapas de uma unidade via `GET /steps?unitId=xxx` e filtrar no cliente.

Essa ausência impacta diretamente funcionalidades que precisam carregar uma etapa específica para edição ou exibição de detalhe, forçando carregamento desnecessário de dados.

**Comportamento atual (AS-IS):**
- `GET /steps` lista todas as etapas (com filtro opcional por unidade)
- Não há `GET /steps/:id` ❌

---

**Critérios de Aceite:**

```gherkin
Dado que existe uma etapa com um ID válido
Quando o usuário autenticado fizer GET /steps/:id
Então o sistema deve retornar os dados completos da etapa
  E o status HTTP deve ser 200
```

```gherkin
Dado que o ID informado não corresponde a nenhuma etapa
Quando o usuário fizer GET /steps/:id
Então o sistema deve retornar HTTP 404
  E a mensagem deve ser "Step not found."
```

```gherkin
Dado que o usuário não está autenticado
Quando tentar acessar GET /steps/:id
Então o sistema deve retornar HTTP 401
```

---

**Contexto Técnico:**
- Arquivo a criar/editar: `server/src/modules/steps/steps.controller.ts` e `steps.routes.ts`
- Padrão já adotado nos módulos `providers` e `public-agencies`
- Sem impacto em outros módulos

---

**Prioridade:** Média

**Impacto:**
Melhora a eficiência das chamadas de API no frontend ao carregar dados de edição. Reduz volume de dados trafegados. Necessário para qualquer integração futura que referencie etapas por ID.

**Labels sugeridas:** `backlog`, `modulo-etapas`

---

---

### Issue 4

**Título:**
`[FEATURE] Atualização proativa de status para unidades com etapas vencidas ou próximas do vencimento`

---

**Descrição:**
O status de uma unidade (ex: `"Vencidos"`, `"Prestes a vencer"`) é recalculado **somente quando uma mutação ocorre** em uma etapa ou estágio. Não existe nenhum processo automático que atualize o status de unidades que possuem etapas com `dueDate` expirado ou próximo da expiração.

Isso significa que uma unidade pode permanecer com status `"Pendente de emissão"` mesmo com etapas vencidas há dias, simplesmente porque nenhuma edição foi feita desde o vencimento.

**Comportamento atual (AS-IS):**
- Status calculado apenas sob demanda (trigger: mutação de etapa ou estágio) ❌
- Sem job periódico de verificação ❌
- Notificações de vencimento não são disparadas proativamente ❌

---

**Critérios de Aceite:**

```gherkin
Dado que uma unidade possui etapa com dueDate anterior à data atual
  E o status da etapa é false (IRREGULAR)
  E nenhuma mutação foi feita nessa unidade desde o vencimento
Quando o job periódico executar
Então o status da unidade deve ser atualizado para "Vencidos"
  E uma notificação do tipo "alert" deve ser disparada para o responsável
```

```gherkin
Dado que uma unidade possui etapa com dueDate nos próximos 10 dias
  E o status da etapa é false (IRREGULAR)
Quando o job periódico executar
Então o status da unidade deve ser atualizado para "Prestes a vencer"
  E uma notificação do tipo "warning" deve ser disparada
```

```gherkin
Dado que o job executou e já atualizou o status anteriormente
Quando o job executar novamente sem mudança nas datas
Então o sistema não deve criar registros duplicados de histórico
  E não deve disparar notificações duplicadas
```

---

**Contexto Técnico:**
- Lógica de cálculo já existe: `units.controller.ts` → `calculateUnitStatus()` e `recalculateUnitStatus()`
- Necessário criar mecanismo de agendamento (cron/scheduler) no backend
- Verificar: framework Fastify suporta jobs nativos ou requer biblioteca externa
- Impacto em: **Unidades**, **Notificações**, **Dashboard**

---

**Prioridade:** Alta

**Impacto:**
Sem essa feature, o painel regulatório pode exibir informações incorretas para gestores, levando a decisões baseadas em dados desatualizados. Em contexto de compliance regulatório, o risco operacional é significativo.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `modulo-unidades`, `automacao`

---

---

### Issue 5

**Título:**
`[FEATURE] Registro de histórico de alterações por etapa`

---

**Descrição:**
Atualmente, quando uma etapa é modificada, o sistema registra apenas um evento genérico de `"Atualização Automática de Status"` no histórico da **unidade**. Não existe registro de auditoria específico para a etapa em si.

Isso impede rastrear: qual etapa foi alterada, quais campos mudaram, de qual valor para qual, e quem realizou a alteração.

**Comportamento atual (AS-IS):**
- Histórico registrado é da unidade, não da etapa ❌
- Não há auditoria por etapa individual ❌
- Impossível responder: "quem alterou esta etapa e quando?" ❌

---

**Critérios de Aceite:**

```gherkin
Dado que um usuário autenticado edita uma etapa
Quando a edição for concluída com sucesso
Então o sistema deve registrar um evento de auditoria contendo:
  - ID da etapa
  - Nome do usuário que realizou a alteração
  - Data e hora da alteração
  - Campos que foram modificados
  - Valores anteriores e novos valores
```

```gherkin
Dado que um usuário exclui uma etapa
Quando a exclusão for concluída
Então o sistema deve registrar o evento de exclusão com:
  - ID e nome da etapa removida
  - Usuário responsável
  - Data e hora
```

```gherkin
Dado que o histórico de uma etapa foi gerado
Quando o usuário acessar o histórico da unidade
Então as alterações de etapas devem ser visíveis e distinguíveis dos demais eventos
```

---

**Contexto Técnico:**
- Padrão de histórico existe na unidade — avaliar reuso do mecanismo
- Arquivo de referência: `units.controller.ts` → bloco de inserção de histórico em `recalculateUnitStatus()`
- Impacto em: **Unidades** (histórico), **UnitDetailsPage** (exibição)

---

**Prioridade:** Média

**Impacto:**
Sem rastreabilidade, equipes de QA, produto e compliance não conseguem auditar mudanças documentais por etapa. Em processo regulatório, a ausência de auditoria é um risco de compliance.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `auditoria`

---

---

### Issue 6

**Título:**
`[FEATURE] Alertas configuráveis de vencimento por etapa`

---

**Descrição:**
O sistema calcula o status `"Prestes a vencer"` com uma janela fixa de 10 dias, sem possibilidade de configuração. Não há mecanismo para que gestores definam alertas personalizados por etapa (ex: alertar 30, 15 ou 7 dias antes do vencimento).

Além disso, os alertas só são gerados quando há uma mutação — não proativamente (ver Issue 4).

**Comportamento atual (AS-IS):**
- Janela de alerta fixa: 10 dias antes do vencimento, hardcoded ❌
- Sem configuração por etapa ou por perfil de usuário ❌
- Alertas dependem de mutação para serem disparados ❌

---

**Critérios de Aceite:**

```gherkin
Dado que o usuário está criando ou editando uma etapa com dueDate
Quando preencher o campo de antecedência do alerta
Então o sistema deve armazenar a configuração de alerta (ex: 30, 15, 7 dias antes)
```

```gherkin
Dado que uma etapa tem alerta configurado para 15 dias antes do vencimento
Quando a data atual for 15 dias antes de dueDate
Então o sistema deve disparar uma notificação do tipo "warning" para o responsável
  E a notificação deve identificar claramente qual etapa está próxima do vencimento
```

```gherkin
Dado que uma etapa já disparou alerta de vencimento
Quando o job periódico executar novamente no mesmo dia
Então o sistema não deve disparar alerta duplicado
```

---

**Contexto Técnico:**
- Dependência: Issue 4 (job periódico) deve ser implementada primeiro
- Valor hardcoded de 10 dias: `units.controller.ts` → `calculateUnitStatus()`, filtro `dueDate < tenDaysFromNow`
- Impacto em: **Notificações**, **Unidades**

---

**Prioridade:** Média

**Impacto:**
Gestores não conseguem ser notificados com antecedência adequada para cada tipo de licença/etapa. A rigidez de 10 dias pode ser insuficiente para processos regulatórios mais longos.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `notificacoes`, `configurabilidade`

---

---

### Issue 7

**Título:**
`[FEATURE] Validar existência da atividade referenciada em anexos do tipo activity`

---

**Descrição:**
Anexos de uma etapa podem ter `type = "activity"` com um campo `activityId` referenciando uma atividade do sistema. Atualmente, o backend **não valida** se a atividade informada existe ao inserir o anexo.

Se a atividade for excluída ou nunca existir, o anexo fica com uma referência quebrada, e o sistema não indica esse problema em nenhum momento.

**Comportamento atual (AS-IS):**
- Campo `activityId` aceito sem validação de existência ❌
- Referências quebradas possíveis e silenciosas ❌
- Exibição de anexos com `activityId` inválido não trata o erro no frontend ❌

---

**Critérios de Aceite:**

```gherkin
Dado que o usuário adiciona um anexo do tipo "activity" a uma etapa
Quando o activityId informado não existir na coleção activities
Então o sistema deve retornar HTTP 404
  E a mensagem deve indicar que a atividade referenciada não foi encontrada
```

```gherkin
Dado que o usuário adiciona um anexo do tipo "activity" com activityId válido
Quando o anexo for salvo
Então o sistema deve confirmar a existência da atividade antes de persistir
  E salvar o anexo normalmente
```

```gherkin
Dado que um anexo do tipo "activity" tem activityId de uma atividade excluída
Quando a tela de detalhes da etapa for carregada
Então o sistema deve indicar visualmente que a referência está inválida
  E não deve quebrar a exibição dos demais anexos
```

---

**Contexto Técnico:**
- Arquivo: `server/src/modules/steps/steps.controller.ts` → processamento de `attachments`
- Coluna `activityId` em `IAttachment` (`web/src/types/index.ts` linha ~79)
- Impacto em: **Atividades** (se deletadas, referência quebra), **UnitDetailsPage** (exibição de anexos)
- Escopo limitado: validação apenas na criação/edição, não retroativa

---

**Prioridade:** Baixa

**Impacto:**
Referências quebradas não causam falha crítica hoje, mas degradam a experiência ao exibir anexos com dados inválidos. O risco aumenta conforme atividades são excluídas com maior frequência.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `integridade-dados`

---

---

## 🔧 Melhorias

---

### Issue 8

**Título:**
`[MELHORIA] Implementar controle de acesso por perfil (RBAC) nos endpoints de etapas`

---

**Descrição:**
Todos os endpoints do módulo de Etapas (`POST`, `GET`, `PUT`, `DELETE /steps`) requerem apenas que o usuário esteja autenticado. Não há verificação de qual perfil ou vínculo o usuário possui.

Isso significa que qualquer usuário autenticado pode criar, editar ou excluir etapas de qualquer unidade, independentemente de ser gestor dessa unidade ou rede.

**Comportamento atual (AS-IS):**
- Autenticação verificada ✅
- Restrição por perfil: não implementada ❌
- Usuário pode modificar etapas de unidades às quais não tem acesso ❌

**Referência de padrão no sistema:**
O módulo de Prestadores já implementa RBAC com permissões granulares (`PROVIDERS_CREATE`, `PROVIDERS_UPDATE_OWN`, `PROVIDERS_UPDATE_ALL`, etc.) — esse modelo deve ser seguido.

---

**Critérios de Aceite:**

```gherkin
Dado que o usuário tem perfil GESTOR_UNIDADE
Quando tentar criar uma etapa em uma unidade que não é a sua
Então o sistema deve retornar HTTP 403
  E a mensagem deve indicar acesso não autorizado
```

```gherkin
Dado que o usuário tem perfil GESTOR_REDE
Quando criar uma etapa em qualquer unidade de sua rede
Então o sistema deve processar a requisição normalmente
```

```gherkin
Dado que o usuário tem perfil ADMIN
Quando criar, editar ou excluir qualquer etapa
Então o sistema deve processar sem restrições
```

```gherkin
Dado que o usuário tem perfil GESTOR_UNIDADE
Quando listar etapas via GET /steps
Então o sistema deve retornar apenas etapas das unidades às quais tem acesso
```

---

**Contexto Técnico:**
- Arquivo: `server/src/modules/steps/steps.routes.ts` e `steps.controller.ts`
- Padrão a seguir: `server/src/modules/providers/providers.routes.ts` — uso de `requireProviderAccess()` e permissões específicas
- Impacto em: **Segurança**, **Unidades**, **Usuários**

---

**Prioridade:** Alta

**Impacto:**
Ausência de RBAC é uma vulnerabilidade de autorização. Em ambiente multitenancy (múltiplas redes e unidades), um gestor de uma rede não deve acessar dados de outra rede. A não implementação viola o princípio de menor privilégio.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `seguranca`, `rbac`

---

---

### Issue 9

**Título:**
`[MELHORIA] Garantir consistência atômica no armazenamento dual de etapas`

---

**Descrição:**
As etapas são persistidas em dois locais: coleção `steps` e array `moreStages` da unidade. Essas operações são executadas sequencialmente sem garantia de atomicidade. Em caso de falha parcial, os dados ficam inconsistentes.

Diferentemente da Issue 2 (que trata do impacto do bug), esta issue trata da **solução técnica**: implementar transações MongoDB para garantir que as duas escritas sejam atômicas.

**Comportamento desejado:**
- Se a escrita em `steps` falhar → `moreStages` não é alterado
- Se a escrita em `moreStages` falhar → a operação em `steps` é revertida
- Resultado: sempre consistente, mesmo em falhas parciais

---

**Critérios de Aceite:**

```gherkin
Dado que o sistema inicia uma operação de criação de etapa
Quando ocorrer erro ao atualizar moreStages após insert bem-sucedido em steps
Então o insert em steps deve ser revertido (rollback)
  E o usuário deve receber uma mensagem de erro clara
  E nenhum dado parcial deve ser persistido
```

```gherkin
Dado que a transação é iniciada para exclusão de etapa
Quando todas as operações concluírem com sucesso
Então o commit deve ser efetuado normalmente
  E o comportamento deve ser idêntico ao atual para o cenário de sucesso
```

---

**Contexto Técnico:**
- Arquivo: `server/src/modules/steps/steps.controller.ts`
- Requer verificação da configuração do MongoDB (replica set habilitado para transações)
- Padrão: `session.startTransaction()` / `session.commitTransaction()` / `session.abortTransaction()`
- Esta issue resolve o risco técnico identificado na Issue 2
- Sem impacto no comportamento externo (transparente para o usuário em cenário de sucesso)

---

**Prioridade:** Alta

**Impacto:**
Solução preventiva que elimina o risco de inconsistência de dados documentado na Issue 2. Essencial antes de qualquer aumento de volume de uso em produção.

**Labels sugeridas:** `backlog`, `modulo-etapas`, `consistencia-dados`, `arquitetura`

---

---

### Issue 10

**Título:**
`[MELHORIA] Esclarecer distinção entre status de Etapas e status de Atividades na interface`

---

**Descrição:**
O sistema possui dois conceitos distintos de "status" que coexistem no contexto de uma unidade:

- **Etapas** (`steps`/`moreStages`): status **binário** — `REGULAR` (true) / `IRREGULAR` (false)
- **Atividades** (`activities`): status **textual** — `A fazer`, `Em andamento`, `Concluído`, `Exigência`

Na tela de detalhes da unidade, esses dois tipos de status são exibidos em contextos próximos, sem indicação visual clara de que são conceitos diferentes. Isso pode gerar confusão para o usuário, que pode esperar que uma "etapa em exigência" funcione como uma "atividade em exigência" (com bloqueio de fluxo).

**Comportamento atual (AS-IS):**
- Etapas exibem `REGULAR` / `IRREGULAR` ✅
- Atividades exibem `A fazer`, `Em andamento`, `Concluído`, `Exigência` ✅
- Sem separação visual ou contextual clara entre os dois modelos na UI ❌
- O DER original misturava os dois conceitos na seção de Unidades ❌

---

**Critérios de Aceite:**

```gherkin
Dado que o usuário está na tela de detalhes de uma unidade
Quando visualizar a listagem de etapas e atividades lado a lado
Então cada seção deve estar claramente identificada (ex: "Etapas Documentais" vs "Atividades")
  E os status de cada tipo devem usar terminologia e visual distintos
```

```gherkin
Dado que o usuário passa o mouse sobre o status de uma etapa (REGULAR/IRREGULAR)
Quando um tooltip for exibido
Então o tooltip deve explicar o que significa o status binário da etapa
  E diferenciar do conceito de status de atividade
```

```gherkin
Dado que a documentação do sistema (DER e refinamentos) menciona ambos os tipos
Quando o time de produto ou QA consultar a documentação
Então os dois conceitos devem estar claramente separados em seções distintas
  E cada seção deve incluir nota de distinção
```

---

**Contexto Técnico:**
- Arquivo frontend: `web/src/pages/UnitDetailsPage.tsx` → seções de `stages`/`moreStages` e atividades
- O refinamento (`gestao-etapas.md` seção 1) já documenta a distinção — a UI deve refletir isso
- Impacto em: **UX**, **UnitDetailsPage**, **documentação**
- Sem alteração de lógica de negócio — apenas apresentação e labels

---

**Prioridade:** Média

**Impacto:**
Confusão entre os dois modelos de status leva a erros de interpretação por gestores e analistas. Em QA, pode gerar casos de teste incorretos. Na interface, pode causar expectativas erradas de comportamento (ex: esperar que uma etapa IRREGULAR bloqueie uma atividade).

**Labels sugeridas:** `backlog`, `modulo-etapas`, `ux`, `documentacao`

---

---

## Ordem de Prioridade Sugerida para o Backlog

| # | Issue | Tipo | Prioridade | Dependência |
|---|-------|------|:----------:|-------------|
| 1 | Issue 9 — Consistência atômica | 🔧 MELHORIA | Alta | Nenhuma |
| 2 | Issue 8 — RBAC nos endpoints | 🔧 MELHORIA | Alta | Nenhuma |
| 3 | Issue 1 — Falha silenciosa no recálculo | 🐛 BUG | Alta | Nenhuma |
| 4 | Issue 2 — Inconsistência armazenamento dual | 🐛 BUG | Alta | Issue 9 |
| 5 | Issue 4 — Atualização proativa de status | ✨ FEATURE | Alta | Nenhuma |
| 6 | Issue 3 — Endpoint GET /steps/:id | ✨ FEATURE | Média | Nenhuma |
| 7 | Issue 5 — Histórico por etapa | ✨ FEATURE | Média | Nenhuma |
| 8 | Issue 10 — Distinção de status na UI | 🔧 MELHORIA | Média | Nenhuma |
| 9 | Issue 6 — Alertas configuráveis | ✨ FEATURE | Média | Issue 4 |
| 10 | Issue 7 — Validar activityId | ✨ FEATURE | Baixa | Nenhuma |

---

## Referências

- Refinamento: `docs/refinamento/etapas/gestao-etapas.md`
- DER: `docs/requisitos/DER_v1.2.md` (Seção 15 — Etapas)
- Estratégia de testes: `docs/qa/estrategia-testes.md`
- Cobertura: `docs/qa/cobertura.md`
