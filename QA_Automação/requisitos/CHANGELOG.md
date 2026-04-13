# CHANGELOG — Plataforma de Gestão Empresarial

Registro de alterações do produto seguindo [Semantic Versioning](https://semver.org/lang/pt-BR/) e o padrão [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [v1.2.1] — 2026-04-09

### Documentação (AS-IS)

Inclusão de requisitos formais baseados no comportamento atual do sistema para módulos não documentados ou parcialmente documentados no DER:

* **Órgãos Públicos** — 5 RFs e 5 RNs documentados (RF-PUB-001 a 005, RN-PUB-001 a 005); endpoints CRUD completos; regras de autenticação e validação de campos mapeadas
* **Prestadores** — 5 RFs e 7 RNs documentados (RF-PRE-001 a 005, RN-PRE-001 a 007); sistema de permissões granulares; filtro automático por perfil; enriquecimento via agregação com usuários, redes e unidades
* **Notificações** — 4 RFs e 6 RNs documentados (RF-NOT-001 a 004, RN-NOT-001 a 006); geração automática por eventos; filtro de visualização por perfil; mecanismo TTL documentado
* **Comentários** — 2 RFs e 6 RNs documentados (RF-COM-001 a 002, RN-COM-001 a 006); modelo embedded em atividades; disparo automático de notificação; ausência de edição/exclusão confirmada
* **Etapas (Steps)** — 5 RFs e 7 RNs documentados (RF-ETP-001 a 005, RN-ETP-001 a 007); desnormalização em `moreStages`; recálculo automático de status da unidade; geração automática de pseudo-documentação

### Alterado

* Seções 6 (Órgãos Públicos) e 7 (Prestadores) do DER substituídas por conteúdo AS-IS completo
* Tabela de Arquitetura Funcional atualizada com status de documentação por módulo
* Sumário expandido com novas seções 13 (Notificações), 14 (Comentários) e 15 (Etapas)
* Seções 13, 14 e 15 anteriores renumeradas para 16, 17 e 18
* Apêndice Técnico (seção 18) atualizado com rastreabilidade dos novos módulos
* Itens em Aberto (seção 17) atualizados com gaps identificados

### Observações

* Todo conteúdo AS-IS está marcado como sujeito à validação com o time de produto
* Seção 17 (Itens em Aberto) lista gaps funcionais identificados durante a documentação
* Os módulos Órgãos Públicos e Prestadores possuem seções "Possíveis Melhorias (TO-BE)" separadas do AS-IS

---

## [v1.2.0] — 2026-04-09

### Adicionado

**Dashboard**

* `RF-DASH-001` — Mapa Interativo do Brasil segmentado por regiões com colorização por status (Sem pendência, Pendente, Prestes a vencer, Vencido)
* `RF-DASH-002` — Indicadores gerais: total de unidades em funcionamento, em abertura e total de documentos cadastrados
* `RF-DASH-003` — Gráfico de Bandeiras com atualização dinâmica conforme seleção no mapa
* `RF-DASH-004` — Gráfico de Tipologia com atualização conforme região selecionada
* `RF-UNI-006` — Filtro de região nos dashboards de unidades com atualização dinâmica dos gráficos

**Licenças e Vistorias**

* `RF-LV-004` — Flag de exigência com classificação por criticidade (Verde, Amarelo, Vermelho)
* `RF-LV-005` — Justificativa obrigatória e bloqueio de avanço em exigências
* `RF-LV-006` — Alertas automáticos para exigências abertas
* `RF-LV-007` — Relatórios por unidade e período

**Atividades**

* `RF-ATV-004` — Bloqueio de progresso e exigência de justificativa em status "Exigência"
* `RN-ATV-001` — Geração automática de pendências para atividades não concluídas
* `RN-ATV-002` — Registro obrigatório de toda atividade na linha do tempo

**Financeiro**

* `RF-FIN-004` — Inserção de novas unidades em pacote
* `RF-FIN-005` — Cobrança automática ao inserir nova unidade

**Consultor**

* `RF-CON-001` a `RF-CON-004` — Módulo completo de consulta por identificador com preenchimento automático de cadastro

**Funcionalidades Transversais**

* `RF-GANTT-001` — Timeline por unidade (Gantt)
* `RF-GANTT-002` — Comparação previsto vs realizado no Gantt
* `RN-CORE-001` — Linha do tempo como fonte única da verdade (sem perda de histórico)

### Alterado

* `RF-UNI-003` — Regras de exigência consolidadas: bloqueio de etapa + detalhamento obrigatório + registro na linha do tempo
* `RN-LV-002` — Entidade principal estabelecida como base obrigatória para geração de licenças
* `RN-USR-001` — Modelo de permissões refinado

### Observações / Limitações Conhecidas

| Item                               | Descrição                                                                          |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| Data incorreta (API)               | Datas retornadas pela API podem estar incorretas                                   |
| Grau de risco indisponível         | Campo não disponível via API — sem fallback implementado                           |
| Tipologia e rede não automatizados | Preenchimento manual obrigatório nestes campos                                     |
| Mapa por UF, não por região        | Implementação atual do mapa opera por estado; segmentação por região está pendente |
| Integrações externas               | Citadas no escopo mas não confirmadas no código atual                              |

---

## [v1.1.0] — Data a preencher

### Adicionado

* `RF-LV-001` — Cadastro de licenças com variações regionais
* `RF-LV-002` — Associação automática de licenças às unidades compatíveis
* `RF-LV-003` — Registro de vistorias e associação de exigências
* `RF-UNI-004` — Registro automático de licenças por unidade com controle de datas
* `RF-UNI-005` — Indicadores de unidades: regulares vs irregulares com valor absoluto, percentual e total
* `RF-FIN-001` a `RF-FIN-003` — Controle de taxas, tipos de cobrança e pagamentos/pendências
* `RF-RED-001` / `RF-RED-002` — Cadastro de redes e disponibilização como seletor
* `RN-LV-001` — Regra: licenças variam por região
* `RN-LV-003` — Entidades secundárias definidas como informativas
* `RN-RED-001` — Campo "Rede" deve utilizar lista previamente cadastrada

### Observações

> Preencher com detalhes adicionais da versão 1.1 fornecidos pelo time de produto.

---

## [v1.0.0] — Data a preencher

### Adicionado

* Estrutura base da plataforma
* `RF-ATV-001` a `RF-ATV-003` — Cadastro de atividades com fases e status (A fazer, Em andamento, Concluído, Exigência)
* `RF-ATV-002` — Toda atividade vinculada obrigatoriamente a uma unidade
* `RF-UNI-001` — Listagem de unidades com nome, responsáveis, identificador, localização, status e etapa
* `RF-UNI-002` — Linha do tempo por unidade com atividades, fases e status
* `RF-LIC-001` a `RF-LIC-004` — Dashboard de documentos com indicadores e filtros
* `RF-CORE-001` — Registro de eventos na linha do tempo (data, responsável, tipo de ação)
* Perfis de usuário com diferentes níveis de acesso

### Observações

> Preencher com detalhes adicionais da versão 1.0 fornecidos pelo time de produto.

---

## Legenda de Tipos de Mudança

| Símbolo | Tipo        | Descrição                                 |
| ------- | ----------- | ----------------------------------------- |
| 🚀      | Adicionado  | Novas funcionalidades                     |
| 🔧      | Alterado    | Mudanças em funcionalidades existentes    |
| 🐛      | Corrigido   | Correção de bugs                          |
| 🗑️     | Removido    | Funcionalidades removidas                 |
| 🔒      | Segurança   | Correções de vulnerabilidades             |
| ⚠️      | Observações | Limitações, débitos técnicos e pendências |
