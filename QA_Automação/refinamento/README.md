# Refinamentos Funcionais — Plataforma de Gestão Empresarial

## Finalidade

Esta pasta contém os refinamentos funcionais detalhados dos módulos da plataforma **Plataforma de Gestão Empresarial**.

Cada refinamento transforma um requisito do DER em especificação técnica pronta para desenvolvimento e QA, incluindo: modelos de dados, fluxos, regras de negócio detalhadas, critérios de aceite (BDD) e mapeamento com o código existente.

---

## Estrutura de Organização

Os refinamentos são organizados **por módulo funcional**, espelhando a estrutura do DER:

```
docs/refinamento/
├── README.md                     ← este arquivo
│
├── dashboard/
│   └── mapa-interativo-brasil.md
│
├── etapas/
│   └── gestao-etapas.md
│
├── licencas/
│   └── (a criar)
│
├── notificacoes/
│   └── (a criar)
│
└── comentarios/
    └── (a criar)
```

---

## Relação com o DER

| Refinamento                           | Seção no DER | Requisitos cobertos |
| ------------------------------------- | :----------: | ------------------- |
| `dashboard/mapa-interativo-brasil.md` |    Seção 3   | RF-DASH-001 a 004   |
| `etapas/gestao-etapas.md`             |   Seção 15   | RF-ETP-001 a 005    |
| `licencas/`                           |    Seção 5   | RF-LV-001 a 007     |
| `notificacoes/`                       |   Seção 13   | RF-NOT-001 a 004    |
| `comentarios/`                        |   Seção 14   | RF-COM-001 a 002    |

> DER de referência: [`docs/requisitos/DER_v1.2.md`](../requisitos/DER_v1.2.md)

---

## Padrão de Arquivo de Refinamento

Cada arquivo de refinamento deve seguir a estrutura abaixo:

```markdown
# [Nome da Feature]

**Referência DER:** RF-XXX-001 | RF-XXX-002
**Módulo:** Nome do módulo
**Data:** YYYY-MM-DD
**Versão:** 1.0
**Status geral:** [ícone] [descrição]

---

## Status de Implementação
(tabela com itens e status: ✅ / ⚠️ / ❌)

## 1. Contexto
## 2. Descrição Funcional (AS-IS)
## 3. Modelo de Dados
## 4. Estados e Transições
## 5. Regras de Negócio Refinadas
## 6. Fluxos (principal + alternativos)
## 7. Integrações com outros módulos
## 8. Critérios de Aceite (BDD — Gherkin)
## 9. Casos de Erro
## 10. Gaps Identificados
## 11. Melhorias Futuras (TO-BE)
## 12. Mapeamento com Código
## 13. Sugestão de Issues (GitLab)
```

---

## Rastreabilidade

A cadeia de rastreabilidade esperada para cada funcionalidade é:

```
DER (requisito) → Refinamento (detalhamento) → Código (implementação) → Teste (validação)
```

| Artefato              | Localização                              |
| --------------------- | ---------------------------------------- |
| Requisitos funcionais | `docs/requisitos/DER_v1.2.md`            |
| Refinamentos          | `docs/refinamento/<módulo>/<feature>.md` |
| Estratégia de testes  | `docs/qa/estrategia-testes.md`           |
| Cobertura de testes   | `docs/qa/cobertura.md`                   |
| Arquitetura           | `docs/arquitetura/visao-geral.md`        |

---

## Convenções de Nomenclatura

| Elemento         | Convenção             | Exemplo                                         |
| ---------------- | --------------------- | ----------------------------------------------- |
| Pastas           | kebab-case (singular) | `etapas/`, `licencas/`                          |
| Arquivos         | kebab-case descritivo | `gestao-etapas.md`, `mapa-interativo-brasil.md` |
| IDs de requisito | RF-[SIGLA]-[NNN]      | `RF-ETP-001`, `RF-DASH-003`                     |
| IDs de regra     | RN-[SIGLA]-[NNN]      | `RN-ETP-002`, `RN-NOT-001`                      |

---

## Como Contribuir

1. Identifique o módulo do DER que será refinado
2. Crie ou use a pasta correspondente em `/docs/refinamento/<módulo>/`
3. Nomeie o arquivo de forma descritiva (kebab-case)
4. Siga o padrão de estrutura definido neste README
5. Referencie os RFs do DER no cabeçalho do documento
6. Ao finalizar, atualize `docs/qa/cobertura.md` com os novos critérios de aceite
