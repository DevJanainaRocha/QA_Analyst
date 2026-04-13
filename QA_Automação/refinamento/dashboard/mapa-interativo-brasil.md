# Mapa Interativo do Brasil — Refinamento Funcional

**Referência:** RF-DASH-001 | RF-DASH-003 | RF-DASH-004
**Módulo:** Dashboard
**Data:** 2026-04-01
**Versão:** 1.0
**Status geral:** 🟡 Parcialmente implementado

---

## Status de Implementação

| Item | Status |
|------|--------|
| Renderização do mapa do Brasil | ✅ Implementado (nível UF/estado) |
| Segmentação por **região** | ❌ Não implementado |
| Cores por status predominante | ⚠️ Parcialmente implementado |
| Regra de prioridade de status (RN-DASH-002) | ❌ Não implementado |
| Filtro global ao clicar na região | ⚠️ Implementado apenas por UF, não por região |
| Tooltip com nome, qtd. de unidades e status | ⚠️ Parcialmente implementado |
| Estado de loading (skeleton/spinner) | ❌ Não identificado no mapa |
| Estado de erro com botão de retry | ❌ Não implementado |
| Estado vazio (cinza + mensagem) | ❌ Não implementado |
| Reset para visão nacional | ⚠️ Não confirmado |

---

## 1. Contexto

Este componente faz parte do Dashboard e tem como objetivo fornecer uma visão geográfica da operação, permitindo identificar rapidamente o status regulatório das unidades por região.

**Origens de requisito:**

| ID | Descrição |
|----|-----------|
| RF-DASH-001 | Exibição do mapa do Brasil segmentado por regiões |
| RF-DASH-003 | Colorização de regiões por status predominante |
| RF-DASH-004 | Filtragem global do dashboard a partir da seleção de região *(depende deste componente)* |

---

## 2. Descrição Funcional

O sistema deve exibir um mapa do Brasil segmentado por **regiões geográficas** (Norte, Nordeste, Centro-Oeste, Sudeste e Sul), onde cada região será representada visualmente com cores associadas ao status predominante das unidades vinculadas.

O mapa deve permitir interação do usuário, servindo como **filtro global** para os demais componentes do dashboard (gráficos de Bandeira e Tipologia).

> **Nota técnica:** A implementação atual exibe o mapa segmentado por **estado (UF)**, não por região. O refinamento exige agrupamento regional. A utility `regions.ts` já existe e mapeia UFs para regiões, podendo ser aproveitada.

---

## 3. Fluxo do Usuário (Happy Path)

```
Usuário acessa o Dashboard
    └─> Visualiza o mapa do Brasil (por regiões)
            └─> Identifica cores por região (status predominante)
                    └─> Clica em uma região específica
                            └─> Sistema filtra os dados
                                    ├─> Atualiza gráfico de Bandeira
                                    └─> Atualiza gráfico de Tipologia
```

---

## 4. Fluxos Alternativos / Exceções

### 4.1 Sem dados na região

- A região deve aparecer com **cor neutra (cinza)**
- O tooltip deve exibir: `"Sem dados disponíveis"`

### 4.2 Erro na carga de dados

- Exibir mensagem: `"Erro ao carregar dados do mapa"`
- Exibir **botão de retry** para nova tentativa de carregamento

### 4.3 Nenhuma região selecionada

- O dashboard deve exibir a **visão consolidada nacional** (todos os dados sem filtro aplicado)

---

## 5. Regras de Negócio

### RN-DASH-001 — Cor por status predominante

A cor da região deve refletir o status predominante das unidades a ela associadas.

| Status | Cor |
|--------|-----|
| Sem pendência | 🟢 Verde |
| Pendente | 🟠 Laranja |
| Prestes a vencer | 🟡 Amarelo |
| Vencido | 🔴 Vermelho |
| Sem dados | ⚫ Cinza neutro |

> **Nota técnica:** As cores atualmente definidas em `reportsView.config.ts` usam valores hexadecimais mas **não seguem a paleta semântica** definida neste refinamento. A função `getMapOptions()` precisará ser ajustada para mapear corretamente os status para as cores acima.

### RN-DASH-002 — Regra de desempate de status

Caso haja empate entre status em uma região, a prioridade de exibição segue a ordem:

```
1. 🔴 Vencido          (maior criticidade)
2. 🟡 Prestes a vencer
3. 🟠 Pendente
4. 🟢 Sem pendência    (menor criticidade)
```

> **Nota técnica:** Esta lógica de prioridade **não está implementada**. Precisará ser adicionada no frontend (cálculo do status predominante por região) ou no backend (endpoint `/dashboard/reports`).

### RN-DASH-003 — Seleção de região como filtro global

A seleção de uma região no mapa deve atuar como **filtro global** do dashboard, afetando todos os componentes da tela.

> **Nota técnica:** O filtro atual em `Home.tsx` opera por `uf` (estado). Para suportar filtro por região, será necessário expandir o estado do filtro para aceitar um parâmetro `region` e derivar os UFs associados via `regions.ts`.

---

## 6. Estados da Interface

| Estado | Comportamento esperado |
|--------|----------------------|
| **Loading** | Exibir skeleton ou spinner no mapa enquanto os dados são carregados |
| **Sucesso** | Mapa renderizado com cores corretas por região |
| **Vazio** | Mapa cinza + mensagem `"Sem dados disponíveis"` |
| **Erro** | Mensagem de erro + botão de retry visível |

---

## 7. Comportamento Interativo

### Hover (mouseover)

Exibir tooltip contendo:
- Nome da região
- Quantidade de unidades
- Status predominante

### Clique

- Aplicar filtro global (por região)
- Destacar visualmente a região selecionada

### Reset

- Botão ou ação para voltar à visão geral nacional (sem filtro de região)

> **Nota técnica:** O tooltip atual em `getMapOptions()` exibe dados por UF. Será necessário adaptar para exibir dados agregados por região. O reset de filtro precisa ser validado no fluxo atual do `Home.tsx`.

---

## 8. Dependências

| Dependência | Tipo | Status |
|-------------|------|--------|
| API `/dashboard/reports` (status por UF) | Backend | ✅ Implementado |
| Agrupamento de UFs por região | Frontend util | ✅ Implementado (`regions.ts`) |
| API com status agregado por **região** | Backend | ⚠️ Retorna por UF; agrupamento é frontend |
| API de documentos/licenças | Backend | ✅ Implementado (`/dashboard/documents`) |
| Integração com gráfico de Bandeira | Frontend | ✅ Implementado (`getFlagsChartOptions`) |
| Integração com gráfico de Tipologia | Frontend | ✅ Implementado (`getTipologyChartOptions`) |
| Biblioteca de mapas (Highcharts Maps) | Frontend lib | ✅ Instalado (`highcharts@12.4.0`) |
| GeoJSON do Brasil | Frontend lib | ✅ Instalado (`@highcharts/map-collection@2.3.1`) |

---

## 9. Critérios de Aceite (BDD)

### Cenário 1 — Exibição do mapa

```gherkin
Dado que o usuário acessa o dashboard
Quando os dados forem carregados com sucesso
Então o sistema deve exibir o mapa do Brasil
  E as regiões devem estar coloridas conforme o status predominante
```

### Cenário 2 — Aplicação de cores por status predominante

```gherkin
Dado que existem unidades associadas a uma região
Quando o sistema calcular o status predominante da região
Então a região deve ser exibida com a cor correspondente ao status
  E em caso de empate, deve seguir a ordem de prioridade: Vencido > Prestes a vencer > Pendente > Sem pendência
```

### Cenário 3 — Clique na região

```gherkin
Dado que o usuário visualiza o mapa
Quando clicar em uma região
Então os gráficos do dashboard (Bandeira e Tipologia) devem ser atualizados conforme a região selecionada
  E a região selecionada deve ser destacada visualmente no mapa
```

### Cenário 4 — Região sem dados

```gherkin
Dado que uma região não possui unidades associadas
Quando o mapa for exibido
Então a região deve aparecer em cor neutra (cinza)
  E ao passar o mouse, deve exibir a mensagem "Sem dados disponíveis"
```

### Cenário 5 — Erro de carregamento

```gherkin
Dado que ocorre uma falha na chamada à API do dashboard
Quando o mapa for carregado
Então o sistema deve exibir a mensagem "Erro ao carregar dados do mapa"
  E deve exibir um botão que permite ao usuário realizar nova tentativa
```

### Cenário 6 — Reset para visão nacional

```gherkin
Dado que o usuário selecionou uma região
Quando acionar o controle de reset
Então o filtro de região deve ser removido
  E o dashboard deve exibir a visão consolidada nacional
```

---

## 10. Observações Técnicas

> Diretrizes técnicas de produto para guiar decisões de implementação.

- **Biblioteca de mapas:** Considerar o uso de SVG interativo como alternativa ao Highcharts Maps para maior controle de customização visual e menor dependência de licença. A implementação atual utiliza `highcharts@12.4.0` com `@highcharts/map-collection` — avaliar custo-benefício de migração ou permanência.
- **Agregação no backend:** Os dados de status por região devem, preferencialmente, vir **agregados pelo backend**, evitando cálculos pesados no frontend. O endpoint `/dashboard/reports` deve ser evoluído para retornar `status` por UF ou por região diretamente.
- **Performance frontend:** Evitar processamento pesado no cliente. A lógica de agrupamento de UFs por região e cálculo de status predominante deve ser feita de forma otimizada, preferencialmente via `useMemo` ou equivalente, para não degradar a renderização do dashboard.

> **Nota técnica:** O projeto já possui `regions.ts` com `regionMap` cobrindo os 27 estados, o que minimiza o custo de agrupamento. A preocupação principal é o cálculo de status predominante com regra de prioridade (RN-DASH-002), que deve ser encapsulado em uma função utilitária testável e reutilizável.

---

## 11. Mapeamento com Código

### Arquivos relacionados

| Arquivo | Caminho | Papel |
|---------|---------|-------|
| `reportsView.config.ts` | `web/src/components/HomeComponent/reports/reportsView.config.ts` | Configuração do mapa Highcharts — `getMapOptions()` |
| `ReportsView.tsx` | `web/src/components/HomeComponent/reports/ReportsView.tsx` | Componente que renderiza o mapa e os gráficos |
| `Home.tsx` | `web/src/pages/Home.tsx` | Página principal do dashboard; gerencia filtros (uf, type, networkId) |
| `regions.ts` | `web/src/utils/regions.ts` | Mapeamento de UFs para regiões geográficas — `regionMap`, `getStatesByRegion()` |
| `RegionStatusBreakdown.tsx` | `web/src/components/RegionStatusBreakdown.tsx` | Componente de breakdown de status por região (barras visuais) |
| `api.ts` | `web/src/services/api.ts` | Chamadas de API — `dashboardReports()`, `dashboardDocuments()` |
| `index.ts` (types) | `web/src/types/index.ts` | Tipos: `IDashReports`, `IDashUnitsOperation`, `IDashDocuments` |
| `dashboard.controller.ts` | `server/src/modules/dashboard/dashboard.controller.ts` | Backend — `getGeneralMetrics()` retorna `graphMaps: [{uf, count}]` |
| `highchartsConfig.ts` | `web/src/utils/highchartsConfig.ts` | Configurações globais do Highcharts |

### Componentes envolvidos

```
Home.tsx
  └─> ReportsView.tsx
        ├─> Mapa Brasil        (getMapOptions)         ← foco deste refinamento
        ├─> Gráfico Bandeira   (getFlagsChartOptions)
        └─> Gráfico Tipologia  (getTipologyChartOptions)
```

### APIs utilizadas

| Endpoint | Método | Payload de resposta relevante |
|----------|--------|-------------------------------|
| `GET /dashboard/reports` | GET | `graphMaps: [{uf, count}]` |
| `GET /dashboard/documents` | GET | `graphStages: [{count, UF[], stageType}]` |

> **Observação:** O campo `graphMaps` retorna dados **por estado (UF)**, sem discriminação de status. O agrupamento por região e o cálculo do status predominante são responsabilidades do frontend. Para suportar a regra RN-DASH-002 adequadamente, pode ser necessário enriquecer o payload do backend com `status` por UF.

---

## 12. Pendências Técnicas

### Gap 1 — Segmentação por região, não por estado

**Situação atual:** O mapa renderiza polígonos de estados individualmente via GeoJSON.
**Necessário:** Agrupar estados por região e renderizar 5 polígonos regionais (ou aplicar cor uniforme por região sobre os estados).
**Referência de apoio:** `regions.ts` já possui `regionMap` com todos os 27 estados mapeados para regiões.

---

### Gap 2 — Status por região ausente no contrato da API

**Situação atual:** `graphMaps` retorna `[{uf, count}]` sem informação de status.
**Necessário:** Incluir status por UF (ex: `[{uf, count, status}]`) para calcular o predominante por região no frontend, ou criar endpoint específico.
**Impacto:** Backend (`dashboard.controller.ts`) e contrato de tipo (`IDashReports`).

---

### Gap 3 — Regra de prioridade de status (RN-DASH-002) não implementada

**Situação atual:** Sem lógica de desempate entre status.
**Necessário:** Implementar função utilitária de resolução de status predominante com a ordem: Vencido > Prestes a vencer > Pendente > Sem pendência.

---

### Gap 4 — Filtro opera por UF, não por região

**Situação atual:** `Home.tsx` gerencia o filtro `uf` (estado individual).
**Necessário:** Adicionar suporte a filtro por `region`, derivando os UFs associados via `getStatesByRegion()`.

---

### Gap 5 — Estados da interface não implementados no mapa

**Situação atual:** Não foram identificados estados de loading, erro com retry, ou estado vazio específicos para o componente de mapa.
**Necessário:** Implementar os 4 estados: loading, sucesso, vazio (cinza + mensagem) e erro (mensagem + botão de retry).

---

### Gap 6 — Paleta de cores semântica

**Situação atual:** `getMapOptions()` define cores hardcoded em hexadecimal sem correspondência direta com a paleta semântica do refinamento.
**Necessário:** Mapear explicitamente: `Vencido → vermelho`, `Prestes a vencer → amarelo`, `Pendente → laranja`, `Sem pendência → verde`, `Sem dados → cinza`.

---

### Gap 7 — Tooltip incompleto

**Situação atual:** Tooltip provavelmente exibe dados por UF.
**Necessário:** Tooltip deve exibir nome da região, quantidade de unidades e status predominante.

---

### Gap 8 — Funcionalidade de reset não confirmada

**Situação atual:** Não foi identificado um mecanismo explícito de reset de filtro de região para visão nacional.
**Necessário:** Botão ou ação de "limpar filtro de região" que restaure a visão consolidada nacional.

---

## 13. Sugestão de Issues (GitLab)

---

### ISSUE 1

**Título:** `[DASH] Refatorar mapa para segmentação por região geográfica`
**Tipo:** Melhoria
**Descrição:**
O mapa atualmente exibe o Brasil segmentado por estados (UF). Conforme o refinamento RF-DASH-001, a visualização deve ser por regiões geográficas (Norte, Nordeste, Centro-Oeste, Sudeste e Sul).

**Critérios de aceite:**
- O mapa deve exibir 5 regiões geográficas, não 27 estados
- Cada região deve ser representada com cor única baseada no status predominante
- A utility `regions.ts` deve ser utilizada para o agrupamento
- O comportamento visual (hover, clique, destaque) deve ser preservado

---

### ISSUE 2

**Título:** `[DASH] Implementar regra de prioridade de status por região (RN-DASH-002)`
**Tipo:** Feature
**Descrição:**
Criar lógica para calcular o status predominante de uma região com base nas unidades associadas, aplicando a regra de desempate: Vencido > Prestes a vencer > Pendente > Sem pendência.

**Critérios de aceite:**
- Função utilitária que recebe lista de unidades/status e retorna o status predominante
- Em caso de empate, aplica a ordem de prioridade definida
- Coberta por testes unitários
- Integrada ao cálculo de cor do mapa

---

### ISSUE 3

**Título:** `[DASH][API] Incluir status por UF no endpoint /dashboard/reports`
**Tipo:** Melhoria
**Descrição:**
O payload atual de `graphMaps` retorna `[{uf, count}]`. Para suportar a colorização do mapa por status predominante, o endpoint deve retornar também o status de cada UF (ou a contagem por status por UF).

**Critérios de aceite:**
- Endpoint retorna `graphMaps: [{uf, count, status}]` ou `[{uf, statusBreakdown: {vencido, prestes, pendente, semPendencia}}]`
- Tipo `IDashReports` atualizado para refletir o novo contrato
- Sem regressão nos consumidores existentes do endpoint

---

### ISSUE 4

**Título:** `[DASH] Implementar filtro global por região no dashboard`
**Tipo:** Feature
**Descrição:**
O clique em uma região do mapa deve aplicar um filtro global que atualize todos os gráficos do dashboard. Atualmente o filtro opera por UF individual.

**Critérios de aceite:**
- Clique em uma região aplica filtro derivando os UFs associados via `getStatesByRegion()`
- Gráficos de Bandeira e Tipologia são atualizados conforme a região selecionada
- A região selecionada é destacada visualmente
- Existe ação de reset que restaura a visão nacional

---

### ISSUE 5

**Título:** `[DASH] Implementar estados da interface no componente de mapa (loading, erro, vazio)`
**Tipo:** Feature
**Descrição:**
O componente de mapa não possui tratamento visual para os estados: loading, erro e vazio. Conforme o refinamento, cada estado deve ter comportamento visual específico.

**Critérios de aceite:**
- **Loading:** exibe skeleton ou spinner durante o carregamento dos dados
- **Erro:** exibe mensagem "Erro ao carregar dados do mapa" e botão de retry funcional
- **Vazio:** regiões sem dados aparecem em cinza com tooltip "Sem dados disponíveis"
- **Sucesso:** mapa renderizado com cores corretas por região

---

### ISSUE 6

**Título:** `[DASH] Padronizar paleta de cores semântica do mapa`
**Tipo:** Melhoria
**Descrição:**
As cores definidas em `getMapOptions()` em `reportsView.config.ts` não seguem a paleta semântica definida no refinamento. As cores devem ser mapeadas explicitamente para cada status.

**Critérios de aceite:**
- `Vencido` → vermelho
- `Prestes a vencer` → amarelo
- `Pendente` → laranja
- `Sem pendência` → verde
- `Sem dados` → cinza neutro
- Cores alinhadas com o Design System do produto (se existir)

---

### ISSUE 7

**Título:** `[DASH] Implementar tooltip completo por região no mapa`
**Tipo:** Melhoria
**Descrição:**
O tooltip do mapa deve exibir, ao passar o mouse sobre uma região: nome da região, quantidade de unidades e status predominante.

**Critérios de aceite:**
- Tooltip exibe: nome da região, quantidade de unidades associadas, status predominante com cor indicativa
- Tooltip para regiões sem dados exibe: "Sem dados disponíveis"
- Comportamento consistente com os demais tooltips do dashboard

---

## Referências Internas

- `web/src/components/HomeComponent/reports/reportsView.config.ts` — `getMapOptions()`
- `web/src/components/HomeComponent/reports/ReportsView.tsx`
- `web/src/pages/Home.tsx`
- `web/src/utils/regions.ts` — `regionMap`, `getStatesByRegion()`
- `web/src/services/api.ts` — `dashboardReports()`
- `web/src/types/index.ts` — `IDashReports`
- `server/src/modules/dashboard/dashboard.controller.ts` — `getGeneralMetrics()`
