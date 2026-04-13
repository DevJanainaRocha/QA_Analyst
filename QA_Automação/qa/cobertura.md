# Cobertura de Testes — Expanzio+

**Versão:** 1.0
**Data:** 2026-04-09
**Atualização:** Manter este arquivo atualizado a cada novo teste adicionado ou requisito coberto.

---

## Como usar este documento

- Cada linha representa um requisito funcional rastreável
- Preencher o campo **Teste** com o caminho do arquivo `.spec.ts` e nome do cenário
- Atualizar o campo **Status** conforme o estado real da cobertura
- Utilizar os critérios de aceite do refinamento como base para os cenários de teste

---

## Legenda de Status

| Status | Descrição |
|--------|-----------|
| ✅ Coberto | Teste automatizado implementado e passando |
| ⚠️ Parcial | Cobertura incompleta (nem todos os cenários cobertos) |
| ❌ Não coberto | Requisito sem teste automatizado |
| 🚧 Em andamento | Teste em desenvolvimento |
| N/A | Não aplicável a testes automatizados |

---

## Autenticação (RF-AUTH)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-AUTH-001 — Login com credenciais válidas | — | Login com e-mail e senha corretos | `tests/e2e/auth.spec.ts` | ✅ Coberto |
| RF-AUTH-001 — Login com credenciais inválidas | — | Exibição de mensagem de erro | `tests/e2e/auth.spec.ts` | ✅ Coberto |
| RF-AUTH-001 — Toggle de visibilidade de senha | — | Mostrar/ocultar senha | `tests/e2e/auth.spec.ts` | ✅ Coberto |
| RF-AUTH-002 — Fluxo de recuperação de senha | — | Solicitar reset por e-mail | `tests/e2e/auth.spec.ts` | ✅ Coberto |
| RF-AUTH-003 — Logout | — | Encerramento de sessão | `tests/e2e/auth.spec.ts` | ✅ Coberto |
| RF-AUTH-004 — Restrição por perfil | — | Bloqueio de acesso a rotas restritas | — | ❌ Não coberto |

---

## Dashboard (RF-DASH)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-DASH-001 — Exibição do mapa | `dashboard/mapa-interativo-brasil.md` — Cenário 1 | Mapa renderizado ao carregar o dashboard | — | ❌ Não coberto |
| RF-DASH-001 — Colorização por status | `dashboard/mapa-interativo-brasil.md` — Cenário 2 | Regiões exibidas com cor correta | — | ❌ Não coberto |
| RF-DASH-001 — Clique na região | `dashboard/mapa-interativo-brasil.md` — Cenário 3 | Filtro aplicado ao clicar na região | — | ❌ Não coberto |
| RF-DASH-001 — Região sem dados | `dashboard/mapa-interativo-brasil.md` — Cenário 4 | Região exibida em cinza com tooltip | — | ❌ Não coberto |
| RF-DASH-001 — Erro de carregamento | `dashboard/mapa-interativo-brasil.md` — Cenário 5 | Mensagem de erro + botão retry | — | ❌ Não coberto |
| RF-DASH-002 — Indicadores consolidados | — | Total de unidades e documentos visíveis | — | ❌ Não coberto |
| RF-DASH-003 — Gráfico de Bandeira | — | Gráfico renderizado com dados | — | ❌ Não coberto |
| RF-DASH-004 — Gráfico de Tipologia | — | Atualização por filtro de região | — | ❌ Não coberto |
| RF-DASH-005 — Filtros do Dashboard | — | Aplicação de filtro por rede/tipo/UF | — | ❌ Não coberto |

---

## Atividades (RF-ATI)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-ATI-001 — Listagem de atividades | — | Tabela visível com dados | — | ❌ Não coberto |
| RF-ATI-002 — Criação de atividade | — | Formulário completo + salvamento | — | ❌ Não coberto |
| RF-ATI-003 — Edição de atividade | — | Editar campos e confirmar | — | ❌ Não coberto |
| RF-ATI-003 — Exclusão de atividade | — | Excluir e confirmar remoção da lista | — | ❌ Não coberto |
| RF-ATI-004 — Comentários | — | Adicionar comentário a uma atividade | — | ❌ Não coberto |

---

## Licenças e Vistorias (RF-LIC)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-LIC-001 — Listagem de licenças | — | Lista visível com status de licenças | — | ❌ Não coberto |
| RF-LIC-002 — Alerta de vencimento | — | Exibição de licenças próximas ao vencimento | — | ❌ Não coberto |
| RF-LIC-003 — Upload de documentos | — | Upload de arquivo e confirmação | — | ❌ Não coberto |

---

## Unidades (RF-UNIT)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-UNIT-001 — Cadastro de unidade | — | Formulário com validação de CNPJ | — | ❌ Não coberto |
| RF-UNIT-002 — Detalhes da unidade | — | Página de detalhes com licenças e atividades | — | ❌ Não coberto |
| RF-UNIT-003 — Status regulatório | — | Status calculado e exibido corretamente | — | ❌ Não coberto |

---

## Redes (RF-NET)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-NET-001 — Cadastro de rede | — | Criação de nova rede | — | ❌ Não coberto |
| RF-NET-002 — Vinculação de unidades | — | Associar unidade a uma rede | — | ❌ Não coberto |

---

## Prestadores (RF-PROV)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-PROV-001 — Cadastro de prestador | — | Formulário de cadastro completo | — | ❌ Não coberto |

---

## Órgãos Públicos (RF-PUB)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-PUB-001 — Cadastro de órgão | — | Formulário de cadastro completo | — | ❌ Não coberto |

---

## Financeiro (RF-FIN)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-FIN-001 — Acesso restrito por perfil | — | Bloqueio para perfil sem permissão | — | ❌ Não coberto |
| RF-FIN-001 — Visão financeira | — | Dados visíveis para perfil autorizado | — | ❌ Não coberto |
| RF-FIN-002 — Upgrade de plano | — | Fluxo de upgrade completo | — | ❌ Não coberto |

---

## Usuários (RF-USR)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| RF-USR-001 — Cadastro de usuário | — | Criação com perfil e vínculo | — | ❌ Não coberto |
| RF-USR-002 — Listagem e edição | — | Listar usuários e editar dados | — | ❌ Não coberto |
| RF-USR-002 — Desativação | — | Desativar usuário e validar bloqueio de acesso | — | ❌ Não coberto |
| RF-USR-003 — Notificações | — | Receber notificação por evento | — | ❌ Não coberto |

---

## Navegação (Transversal)

| Requisito | Refinamento | Cenário de Teste | Arquivo | Status |
|-----------|-------------|-----------------|---------|--------|
| Acesso a todos os módulos via menu lateral | — | Navegar para cada item do menu | `tests/e2e/navigation.spec.ts` | ✅ Coberto |
| Saúde geral da aplicação (smoke) | — | Página de login e dashboard acessíveis | `tests/e2e/smoke.spec.ts` | ✅ Coberto |

---

## Resumo de Cobertura

| Módulo | Total de Requisitos | Cobertos | Parcial | Não Cobertos |
|--------|--------------------|---------:|---------:|-------------:|
| Autenticação | 6 | 5 | 0 | 1 |
| Dashboard | 9 | 0 | 0 | 9 |
| Atividades | 5 | 0 | 0 | 5 |
| Licenças | 3 | 0 | 0 | 3 |
| Unidades | 3 | 0 | 0 | 3 |
| Redes | 2 | 0 | 0 | 2 |
| Prestadores | 1 | 0 | 0 | 1 |
| Órgãos Públicos | 1 | 0 | 0 | 1 |
| Financeiro | 3 | 0 | 0 | 3 |
| Usuários | 4 | 0 | 0 | 4 |
| Navegação | 2 | 2 | 0 | 0 |
| **Total** | **39** | **7** | **0** | **32** |

**Cobertura atual: ~18%** — Foco inicial nos fluxos de autenticação e navegação.

---

## Referências

- `docs/requisitos/DER_v1.2.md` — Fonte dos requisitos funcionais
- `docs/refinamento/dashboard/mapa-interativo-brasil.md` — Critérios de aceite do mapa
- `docs/qa/estrategia-testes.md` — Estratégia e padrões de testes
- `e2e-tests/tests/` — Implementação dos testes
