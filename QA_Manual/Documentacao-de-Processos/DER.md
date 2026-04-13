# Documento de Especificação de Requisitos de Software (ERS)

**Sistema:** Plataforma de Gestão de Eventos  
**Versão:** 1.0  
**Data:** 17/07/2025  
**Responsável:** Janaina da Rocha Pereira de Moraes  

---

## 1. Introdução

### 1.1 Objetivo

Este documento tem como objetivo especificar os requisitos funcionais, não funcionais e de segurança de uma plataforma digital completa voltada para a venda de ingressos, gestão de eventos e controle de acesso inteligente com uso de biometria facial. A solução visa eliminar filas e fraudes, promovendo agilidade, rastreabilidade e uma experiência fluida e segura para organizadores e participantes.

A ferramenta contará com aplicativo mobile e uma plataforma web voltados ao público geral e ambientes administrativos para organizadores e operadores, com recursos analíticos, envio de notificações, criação e controle de eventos, além do gerenciamento completo de acessos. O sistema utilizará tecnologias como check-in antecipado e cadastro biométrico para garantir eficiência e segurança em todo o processo.

---

### 1.2 Escopo

O sistema será composto por:

- Plataforma Web do Organizador (Backoffice de Gestão)
- Aplicativo Mobile do Organizador (Check-in/Acesso e Monitoramento)
- Aplicativo Web/Mobile do Cliente (Compra, Ingressos, Acesso)
- API RESTful Central com Integrações
- Sistema de Reconhecimento Facial Integrado
- Controladores de Acesso Físico (Catracas inteligentes)
- Painel de Monitoramento de Eventos em Tempo Real
- Controle de auditoria completo, rastreando cada ação do sistema

O sistema permitirá:

- Cadastro de eventos (públicos ou privados)
- Emissão e controle de ingressos digitais
- Cadastro facial
- Relatórios de acesso em tempo real
- Integração com ferramentas de pagamento
- Aquisição de vouchers ou ingressos digitais por tipo de evento
- Vendas por aplicativo mobile ou portal web
- Conclusão via biometria facial para acesso após pagamento

---

## 2. Requisitos Funcionais

| ID   | Descrição |
|------|----------|
| RF01 | Cadastro e login com autenticação segura |
| RF02 | Criação, edição e exclusão de eventos com zonas e categorias definidas |
| RF03 | Criação de ingressos (por lote, tipo, preço e validade) |
| RF04 | Permitir recuperação de senha via e-mail |
| RF05 | Permitir criação de novo evento |
| RF06 | Dashboard com estatísticas de vendas, acessos e público |
| RF07 | Check-in antecipado com biometria facial |
| RF08 | Notificações push |
| RF09 | Upload de documentos para verificação |
| RF10 | Exibir informações detalhadas do evento |
| RF11 | Exportação de lista de participantes |
| RF12 | Histórico de eventos e ingressos |
| RF13 | Cadastro com documento estrangeiro |
| RF14 | Cadastro de organizações com cotas |
| RF15 | Dashboard com métricas gerais |
| RF16 | Filtros por data e tipo de cliente |
| RF17 | Gráficos de acesso |
| RF18 | Eventos com limite de vouchers |
| RF19 | Cadastro de organizações com permissões |
| RF20 | Cadastro de beneficiários |
| RF21 | Cadastro de cotas |
| RF22 | Rastreamento facial |
| RF23 | Avaliação de eventos |
| RF24 | Relatório de auditoria |
| RF25 | Registro de ações no app |
| RF26 | Listagem de eventos |
| RF27 | Compra de ingressos |
| RF28 | Exibir formas de pagamento |
| RF29 | Integração com gateway de pagamento |
| RF30 | Histórico de compras |
| RF31 | Envio de confirmação por e-mail |
| RF32 | Geração de QR Code |
| RF33 | Cancelamento de compra |
| RF34 | Autenticação MFA |
| RF35 | Configuração de zonas |
| RF36 | Validação em catraca |
| RF37 | Status das catracas |
| RF38 | Registro manual de entrada |
| RF39 | Cupons promocionais |
| RF40 | Envio de certificados |
| RF41 | Atualização de foto sem impactar biometria |
| RF42 | Carteira digital de ingressos |
| RF43 | Transferência de ingressos |
| RF44 | Compartilhamento de ingressos |
| RF45 | Lembretes automáticos |
| RF46 | Relatórios customizados |
| RF47 | Ranking de eventos |
| RF48 | Integração com catracas |
| RF49 | Acesso do staff com permissões |

---

## 3. Requisitos Não Funcionais

| ID   | Descrição |
|------|----------|
| RNF01 | Interface responsiva e intuitiva |
| RNF02 | Compatibilidade com Android, iOS e web |
| RNF03 | Tempo de resposta até 2 segundos |
| RNF04 | Disponibilidade mínima de 99,5% |
| RNF05 | Dashboard com gráficos interativos |
| RNF06 | Compatibilidade com navegadores modernos |
| RNF07 | Integração com serviços de e-mail |
| RNF08 | Tempo de compra até 5 minutos |
| RNF09 | Página de compra responsiva |
| RNF10 | Suporte a alta concorrência |

---

## 4. Requisitos de Segurança

| ID   | Descrição |
|------|----------|
| RS01 | Criptografia de senhas |
| RS02 | Uso de HTTPS |
| RS03 | MFA para organizadores |
| RS04 | Proteção contra SQL Injection e XSS |
| RS05 | Limite de tentativas de login |
| RS06 | Proteção de dados biométricos |
| RS07 | Sessões expiram após 30 minutos |
| RS08 | Logs de operações |
| RS09 | Política de privacidade |
| RS10 | Bloqueio de dispositivos comprometidos |
| RS11 | Logs imutáveis |
| RS12 | Controle de acesso por perfil |
| RS13 | Autenticação reforçada |
| RS14 | Conformidade com LGPD |
| RS15 | Transações criptografadas |
| RS16 | Validação antifraude |
| RS17 | Logs de transações financeiras |
| RS18 | Conformidade com PCI DSS |

---

## 5. Requisitos do Frontend – Tela de Compra

- Lista de eventos categorizada
- Botão “Comprar ingresso”
- Formulário de compra
- Tela de resumo
- Confirmação com QR Code
- Aba “Minhas Compras”

---

## 6. Requisitos do Backend

- API de listagem de eventos
- Serviço de checkout
- Controle de estoque de vouchers
- Geração de QR Code
- Envio de e-mails
- Consulta de histórico
- Logs de transações

---

## 7. Interfaces do Sistema

### Dashboard Web

- Indicadores
- Filtros
- Gráficos

### Página de Cotistas

- Lista de eventos
- Cotas
- Cadastro de beneficiários

### Módulo de Notificações

- Criação de notificações

### FaceMatch

- Busca facial
- Resultado com dados do evento

### Auditoria

- Filtros por usuário, ação e data

---

## 8. Tecnologias Recomendadas

- Frontend: ReactJS, NextJS, React Native, Flutter
- Backend: Node.js + TypeScript
- Banco de dados: PostgreSQL / MongoDB
- Biometria: FaceNet, ArcFace, AWS Rekognition
- Cloud: AWS, Firebase ou similar

---

## 9. Público-Alvo

- Organizadores de eventos
- Público geral
- Equipes de staff e segurança

---

## 10. Roadmap de Entregas

| Fase | Entrega |
|------|--------|
| 1 | Módulo web de eventos |
| 2 | App mobile do cliente |
| 3 | API e catracas |
| 4 | Biometria facial |
| 5 | App do organizador + monitoramento |
| 6 | Ajustes e testes |

---

## 11. Critérios de Aceitação

- Funcionalidades críticas com sucesso total
- Interface validada em múltiplos dispositivos
- Conformidade com requisitos de segurança
- Atendimento à LGPD e ISO/IEC 27001

---

## 12. Riscos e Dependências

| Risco | Impacto | Mitigação |
|------|--------|----------|
| Instabilidade em eventos | Atrasos no acesso | Uso de QR Code como fallback |

---

## 13. Casos de Uso

### 13.1 Atores

- Participante
- Organizador
- Staff autorizado
- Administrador

---

### 13.2 Resumo dos Casos de Uso

| ID   | Título | Atores | Pré-condições | Pós-condições |
|------|--------|--------|---------------|---------------|
| UC01 | Cadastro de usuário | Participante | Acesso à tela | Usuário registrado |
| UC02 | Login | Participante | Cadastro prévio | Acesso ao sistema |
| UC03 | Recuperação de senha | Participante | E-mail válido | Link enviado |
| UC04 | Criação de evento | Organizador | Autenticado | Evento criado |
| UC05 | Inscrição em evento | Participante | Login | Ingresso gerado |
| UC06 | Notificações | Participante | Inscrição ativa | Notificação recebida |
| UC07 | Histórico | Participante | Logado | Lista exibida |
| UC08 | Cadastro facial | Participante | Permissão de câmera | Acesso liberado |
| UC09 | Documento estrangeiro | Participante | Seleção de opção | Cadastro válido |
| UC10 | Dashboard | Administrador | Login | Dados exibidos |

---

## 14. Considerações Finais

Este documento estabelece as bases técnicas e funcionais para o desenvolvimento de uma plataforma de gestão de eventos com controle de acesso inteligente. A solução integra tecnologias modernas para garantir eficiência operacional, segurança e uma experiência fluida para todos os usuários.

O documento deve servir como referência ao longo de todo o ciclo de desenvolvimento, testes e evolução do sistema.