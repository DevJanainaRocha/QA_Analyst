# PROCESSO OPERACIONAL – Fluxo de Trabalho da Vertical de Software do Setor de Inovação (ClickUp) 

Versão: 1.0  
Responsável: Janaina Rocha  

---

# 1. Objetivo

Este documento tem como finalidade padronizar o modelo de organização, controle e acompanhamento das atividades da vertical de Software do setor de Inovação da Sitelbra, utilizando a versão gratuita do ClickUp.  A proposta visa garantir clareza no fluxo de trabalho, transparência na evolução das entregas, organização do backlog e alinhamento entre desenvolvimento, QA e gestão. 


---

# 2. Estrutura Organizacional no ClickUp

## 2.1 Grupo Principal

- **Nome do Grupo:** *Inovação Sitelbra*  
- **Administração:** QA – *Janaina Moraes*

Este grupo centraliza **todos os projetos** vinculados ao setor de Inovação.

---

## 2.2 Espaços de Trabalho por Projeto

Cada projeto possui um **espaço próprio**, estruturado de forma padronizada.

**Exemplos de projetos:**

- Na Fila Não (NFN)  
- Hidden Brasil  
- Procon Digital  
- IPFibra  

Cada espaço de trabalho contém listas estruturadas conforme o modelo organizativo descrito abaixo. 

---

# 3. Organização das Listas de Tarefas

Dentro de cada projeto, são criadas listas que agrupam as atividades de acordo com sua finalidade. As principais listas são:

---

## 3.1 Lista de Sprint

A cada ciclo de desenvolvimento é criada uma nova lista utilizando o padrão: 

- `[Web] Sprint 01`  
- `[Web] Sprint 02`  
- `[App] Sprint 01`  
- `[App] Sprint 02`

Cada lista representa uma sprint e concentra todas as tarefas discutidas e aprovadas na Reunião de Backlog da Sprint. 

---

## 3.2 Lista de Revisão Técnica
Lista destinada a tarefas paralelas, ajustes emergenciais, demandas técnicas e pontos levantados ao longo da sprint que não estavam no planejamento inicial. 

Exemplo:
- Ajustes emergenciais  
- Demandas paralelas  
- Correções de build  
- Solicitações inesperadas durante a sprint  

---

## 3.3 Lista Backlog do Produto

Serve como um repositório central para:

- Ideias  
- Requisitos  
- Demandas futuras  
- Melhorias a serem priorizadas

Durante a **Reunião de Priorização**, os itens são selecionados para compor a próxima sprint.

---

# 4. Fluxo Operacional das Tarefas (Kanban)

O fluxo abaixo representa o ciclo completo de cada tarefa, desde sua criação até a finalização. As mudanças de status (etiquetas) devem ser feitas pela equipe responsável por cada etapa. 

---

## **1. To Do**
Tarefas recém-movidas para a sprint.  
Aguardam início pelo desenvolvedor.

---

## **2. In Progress**
Indica que o desenvolvedor iniciou a tarefa.
O Dev trabalha na implementação até a conclusão. 

---

## **3. QA – Deploy Pending**
- Dev finalizou  
- Criou o MR (Merge Request)  
- Aguardando deploy no ambiente de homologação

---

## **4. QA – Deploy Finish**
- Deploy realizado no ambiente de homologação. 
- Indica que o QA já pode iniciar os testes

---

## **5. Testing (Com Subtarefas de Casos de Testes)**
Dentro da tarefa principal, o QA cria subtarefas de Casos de Teste (CTs):   

Estrutura da subtarefa (CT):
- Título: Exemplo: CT 01 – Validar cadastro de usuário   
- Conteúdo dentro da subtarefa:
     - Fluxo passo a passo do caso de teste
     - Critérios de aceitação relacionados
- Evidências:
     - Inseridas nos comentários da subtarefa
     - Podem ser prints, vídeos, logs, etc.         

Resultados possíveis dentro da subtarefa 

Caso de teste aprovado 
- Evidência positiva registrada no comentário.
- O CT permanece em Testing até que todos os CTs estejam executados.
- Quando todas as subtarefas forem aprovadas → tarefa principal é movida para Done.

Caso de teste reprovado (Bug encontrado)
Quando um CT identifica um desvio:

Dentro da subtarefa O QA registra nos comentários: 
- Resultado do teste
- Evidência do erro
- Descrição clara do comportamento inesperado
- Critério de aceitação não atendido

Após registrar o bug
A subtarefa do CT: 
- Tem o status alterado para Bug
- É atribuída ao desenvolvedor responsável (Back, Front ou ambos)

---

## **6. Tratamento do Bug (dentro da subtarefa CT) **
Após o CT ser movido para Bug, o desenvolvedor segue:

Ações do Desenvolvedor:
- Mover a subtarefa de CT para In Progress
- Realizar os ajustes necessários
- Atualizar descrição/comentários da subtarefa informando a correção
- Criar novo MR se houver alteração de código
- Mover a subtarefa para QA – Deploy Pending

Após o deploy
- O Dev altera o status da subtarefa para QA – Deploy Finish

Retorno ao QA
Com o deploy liberado: 
- O QA move o CT para Testing novamente
- Reexecuta o caso de teste
- Se aprovado → subtarefa muda para Done
- Se reprovar novamente → repetir o ciclo do Bug 

---

## **7. Done**
- Tarefa testada e validada.   
- Todos os critérios de aceitação atendidos.

# 5. Responsabilidades por Papel

Desenvolvedores:
- Atualizar status da tarefa.
- Criar MR ao finalizar.
- Garantir que a descrição da entrega esteja clara.
- Corrigir bugs no menor ciclo possível. 

QA (Qualidade):
- Administrar o ClickUp.
- Criar listas e organizar estrutura geral dos projetos.
- Executar testes funcionais, UX, integração e regressão.
- Registrar bugs com informações completas.
- Validar a finalização das tarefas. 

Gestão de Inovação / Produto:
- Definir prioridades do backlog.
- Participar das reuniões de planejamento e review.
- Garantir alinhamento entre áreas e stakeholders.
 

# 6. Conclusão

O modelo descrito tem como objetivo proporcionar clareza, organização e consistência na rotina operacional da vertical de Software da Sitelbra. A aplicação correta das listas, etiquetas e fluxos permitirá maior rastreabilidade, transparência e eficiência no desenvolvimento dos projetos. 

 


