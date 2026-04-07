# Casos de Teste – Gestão de Eventos (NFN)
Versão: 1.0  
Responsável: Janaina Rocha  

---

# Objetivo Geral  
Validar o módulo **Gestão de Eventos** do NFN garantindo que todas as funcionalidades da tela operem corretamente, incluindo criação, edição, ativação, desativação e visualização.

---

# CT01 – Validar Listagem de Eventos

**Pré-condição:** Usuário autenticado no Backoffice  
**Passos:**  
1. Acessar o menu “Eventos”  
2. Visualizar a lista de eventos cadastrados  

**Resultado Esperado:**  
- Sistema deve listar todos os eventos existentes com nome, status, data e organização.

---

# CT02 – Criar Novo Evento

**Pré-condição:** Usuário com permissão  
**Passos:**  
1. Clicar em “Novo Evento”  
2. Preencher formulário completo  
3. Salvar  

**Resultado Esperado:**  
- Evento deve ser criado com status “Inativo”  
- Deve aparecer imediatamente na listagem  

---

# CT03 – Editar Evento Existente

**Pré-condição:** Evento cadastrado  
**Passos:**  
1. Selecionar um evento  
2. Clicar em “Editar”  
3. Alterar dados  
4. Salvar  

**Resultado Esperado:**  
- Dados devem ser atualizados corretamente  
- Registro deve refletir alterações em tela  

---

# CT04 – Ativar Evento

**Passos:**  
1. Selecionar evento inativo  
2. Clicar em “Ativar”  

**Resultado Esperado:**  
- Status deve mudar para “Ativo”  
- Evento deve ser exibido como disponível no app  

---

# CT05 – Desativar Evento

**Passos:**  
1. Selecionar evento ativo  
2. Clicar em “Desativar”  

**Resultado Esperado:**  
- Status deve mudar para “Inativo”  
- Usuários não podem mais visualizar o evento  

---

# CT06 – Visualizar Detalhes

**Passos:**  
1. Clicar sobre um evento  
2. Acessar página de detalhes  

**Resultado Esperado:**  
- Sistema exibe todas as informações cadastradas  
- Links para relatórios e módulos relacionados funcionam  

---

# CT07 – Filtros de Busca

**Passos:**  
1. Inserir nome do evento  
2. Filtrar por status (Ativo/Inativo)  
3. Aplicar filtro  

**Resultado Esperado:**  
- Sistema deve retornar apenas os resultados que correspondem aos critérios  

---

# CT08 – Paginação

**Passos:**  
1. Ir até o fim da lista  
2. Clicar em próxima página  

**Resultado Esperado:**  
- Carregar novos registros corretamente  
- Não duplicar itens  

---

# Resultado Final Geral

- Todos os casos devem passar sem erros críticos  
- Em caso de falhas, registrar no ClickUp com prints e logs  

---

# Observações  
- Este conjunto representa apenas parte do fluxo geral do NFN  
- Outros casos podem ser adicionados conforme evolução do sistema  
