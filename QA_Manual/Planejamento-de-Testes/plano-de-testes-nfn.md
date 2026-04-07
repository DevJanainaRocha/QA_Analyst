# 🧪 Plano de Testes – Projeto NFN
Versão: 1.0  
Responsável: Janaina Rocha  
Data: 2025  

---

# 1. Objetivo  
Este plano de testes define a estratégia, os critérios, os tipos de testes e o escopo necessários para validar as funcionalidades do **NFN**, garantindo que o sistema opere conforme os requisitos funcionais e não funcionais esperados.

---

# 2. Escopo  
O plano contempla:

- Testes funcionais das telas e fluxos principais do sistema NFN  
- Validação de integrações  
- Testes de usabilidade e experiência do usuário  
- Testes exploratórios  
- Regressão de itens impactados  
- Validação de correções enviadas pelo time de desenvolvimento  

Fora do escopo:  
- Testes de carga e estresse (serão planejados em documento separado)  
- Testes de automação (fase futura)

---

# 3. Estratégia de Testes

### 3.1 Tipos de Testes  
- **Testes Funcionais** – Verificar se cada funcionalidade atende aos critérios de aceitação.  
- **Testes de Fluxo Completo (E2E)** – Validar jornadas completas do usuário.  
- **Testes Exploratórios** – Identificar comportamentos inesperados ou inconsistências.  
- **Testes de Regressão** – Executados após cada entrega de correção.  
- **Testes de Interface e Usabilidade** – Validação de layout, responsividade e clareza.

---

# 4. Critérios de Aceitação dos Testes

### 4.1 Critérios de Entrada  
- Requisitos/análises aprovados  
- Protótipo disponível quando aplicável  
- Ambiente de teste estável  
- Acesso às ferramentas (ClickUp, API, Backoffice etc.)

### 4.2 Critérios de Saída  
- 100% dos testes planejados executados  
- 0 bugs críticos pendentes  
- Até 2 bugs médios permitidos (com workaround)  
- Relatório final gerado

---

# 5. Riscos Identificados  
| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Instabilidade do ambiente de teste | Alta | Alto | Reboot, reprocessamento, contato com DevOps |
| Falta de protótipo atualizado | Média | Médio | Comunicação direta com design |
| Requisitos indefinidos | Alta | Alto | Alinhamento com PO antes da execução |

---

# 6. Documentos Referência  
- Tarefas no ClickUp  
- Protótipos de UI quando disponíveis  
- Artefatos entregues pelo time de desenvolvimento  

---

# 7. Métricas de Qualidade  
- % de casos de teste aprovados  
- % de falhas por módulo  
- Tempo médio de correção (MTTR)  
- Número de regressões por sprint  

---

# 8. Ferramentas Utilizadas  
- ClickUp (gestão e registros)  
- Excel / Word / Markdown  
- App NFN Mobile  
- Web Backoffice  
- Controladores de acesso (quando aplicável)

---

# 9. Conclusão  
Este plano de testes garante que o processo de validação siga uma abordagem clara, documentada e rastreável, oferecendo uma base sólida para detecção de falhas e garantia de qualidade no sistema NFN.
