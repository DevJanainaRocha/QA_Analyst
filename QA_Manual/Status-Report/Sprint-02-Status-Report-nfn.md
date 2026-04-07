# Status Report – Sprint 02  
Projeto: NFN  
Responsável: Janaina Rocha  
Período: Sprint 02  

---

# 1. Resumo Geral  
A Sprint 02 teve foco em estabilidade do módulo de eventos, integrações e correção de bugs identificados na Sprint 01.

---

# 2. Itens Concluídos  
- Testes funcionais da Tela de Eventos  
- Validações dos fluxos de criação e edição  
- Testes exploratórios de filtros e paginação  
- Registro de inconsistências no ClickUp  
- Acompanhamento de correções entregues pelo time de desenvolvimento  

---

# 3. Itens em Andamento  
- Ajustes pendentes do módulo de autenticação  
- Refinamento dos requisitos para notificações push  
- Testes no sistema de controle de acesso  

---

# 4. Situação do Backend  
- Algumas rotas instáveis durante a execução dos testes  
- Endpoint de edição retornando lentidão em horários de pico  
- Correções aplicadas:  
  - PATCH /events/{id}  
  - GET /events/list  
- Pendências identificadas foram registradas no ClickUp

---

# 5. Bugs Identificados  
| ID | Descrição | Status |
|----|-----------|--------|
| BUG-01 | Botão "Desativar" não atualiza o status em tela | Corrigido |
| BUG-02 | Evento não salva imagem de capa | Em desenvolvimento |
| BUG-03 | Filtro por status não retorna inativos | Corrigido |
| BUG-04 | Página de detalhes não carrega relatórios | Aberto |

---

# 6. Riscos  
- Dependência de ajustes no backend pode atrasar próxima sprint  
- Instabilidade no servidor impacta os testes de regressão  

---

# 7. Considerações Finais  
A Sprint 02 avançou significativamente na maturidade do módulo de eventos.  
Recomenda-se foco em:  
- Correção final dos bugs abertos  
- Garantir estabilidade do ambiente  
- Preparação para testes integrados com dispositivos  
