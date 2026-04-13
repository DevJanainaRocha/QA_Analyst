# Levantamento de Requisitos – Plataforma de Gestão de Eventos

**Versão:** 1.0  
**Data:** 16/07/2025  
**Responsável:** Carlos Lima  

---

## 1. Visão Geral

### 1.1 Objetivo

Desenvolver um ecossistema digital completo e seguro para venda de ingressos, gestão de eventos e controle de acesso com biometria facial, eliminando filas e fraudes, promovendo agilidade, rastreabilidade e experiência fluida para organizadores e participantes.

---

## 2. Módulos do Ecossistema

- Plataforma Web do Organizador (Backoffice de Gestão)
- Aplicativo Mobile do Organizador (Check-in/Acesso e Monitoramento)
- Aplicativo Web/Mobile do Cliente (Compra, Ingressos, Acesso)
- API RESTful Central com Integrações
- Sistema de Reconhecimento Facial Integrado
- Controladores de Acesso Físico (Catracas inteligentes)
- Painel de Monitoramento de Eventos em Tempo Real

---

## 3. Funcionalidades por Módulo

### 3.1 Plataforma Web do Organizador

#### Funcionalidades

- Autenticação de organizadores (MFA)
- Cadastro e edição de eventos
- Criação de ingressos (lotes, tipos, preços, datas)
- Integração de métodos de pagamento (Pix, Cartões, Boleto)
- Dashboard em tempo real: vendas, check-ins, conversões, público
- Configuração de biometria facial como método de entrada
- Upload de fotos ou importação via app mobile (cliente)
- Integração com catracas inteligentes e zonas de acesso
- Criação de cupons e promoções
- Exportação de relatórios (PDF, Excel, CSV)
- Envio de certificados (quando aplicável)
- Comunicação com participantes (push, e-mail, SMS)

#### Tecnologias sugeridas

- ReactJS ou NextJS
- Node.js + TypeScript
- PostgreSQL / MongoDB
- GraphQL ou REST API
- AWS Cognito / Firebase Auth

---

### 3.2 Aplicativo Mobile do Organizador

#### Funcionalidades

- Login com autenticação segura
- Consulta e visualização dos eventos cadastrados
- Dashboard de vendas e acessos no evento em tempo real
- Leitura e validação de ingressos (QR Code ou facial)
- Visualização e controle de catracas (status online/offline)
- Registro manual de entrada (backup)
- Suporte a múltiplos usuários (staff com permissões)

#### Tecnologias sugeridas

- React Native / Flutter
- Bluetooth e rede local para pareamento com catracas
- API local para fallback offline

---

### 3.3 Aplicativo do Cliente (Web + Mobile)

#### Funcionalidades

- Cadastro e login com verificação facial
- Exploração de eventos por geolocalização, categorias e datas
- Compra rápida com diferentes formas de pagamento
- Carteira de ingressos (digitais, com QR Code e status)
- Registro facial no momento da compra (opcional/obrigatório)
- Histórico de eventos e ingressos
- Avaliação e feedback de eventos
- Notificações e lembretes automáticos

#### Recursos diferenciais

- Check-in automático por reconhecimento facial em catracas
- Compartilhamento/transferência de ingressos com permissão
- Interface acessível e responsiva

---

### 3.4 API e Integrações

#### Funcionalidades

- Autenticação via OAuth 2.0

#### Endpoints para

- Eventos
- Ingressos
- Pagamentos
- Reconhecimento facial
- Catracas e zonas
- Notificações

- Webhooks para comunicação com gateways de pagamento, biometria e equipamentos físicos

---

### 3.5 Sistema de Biometria Facial

#### Requisitos

- Base de dados criptografada de templates faciais
- Reconhecimento em tempo real na entrada do evento (inferência no edge)
- Treinamento prévio no momento da compra ou cadastro
- Algoritmo de verificação com alta acurácia (>99%)
- Compatível com SDKs de câmeras e terminais biométricos
- Integração com motor de decisão (match ou rejeição)

#### Tecnologias recomendadas

- FaceNet, ArcFace ou solução embarcada (Luxand, Neurotechnology, AWS Rekognition)
- Deploy em edge ou servidor embarcado para performance

---

### 3.6 Controladores de Acesso (Catracas)

#### Funcionalidades

- Leitura de QR Code, NFC e validação facial
- Integração via protocolo TCP/IP com API da plataforma
- Registro de entrada com timestamp
- Controle de zonas de acesso (backstage, camarote, pista, etc.)
- Interface de monitoramento com status em tempo real

#### Requisitos técnicos

- Catracas com módulo de câmera IP (full HD)
- Conexão com rede local e fallback offline
- Display para mensagens (validação, erro, bloqueio)

---

### 3.7 Painel de Monitoramento de Evento

#### Funcionalidades

- Mapa de calor dos acessos em tempo real
- Situação das catracas (ativas/inativas)
- Acompanhamento por zona/setor
- Alertas de tentativa de fraude ou acesso negado
- Volume de público presente vs total vendido
- Tempo médio de entrada por faixa horária

---

## 4. Requisitos Não Funcionais

| Categoria      | Requisito                                                                 |
|----------------|--------------------------------------------------------------------------|
| Desempenho     | Tempo de resposta da API < 300ms                                         |
| Segurança      | Criptografia AES-256, autenticação MFA, LGPD compliant                   |
| Escalabilidade | Microsserviços e balanceamento horizontal                                |
| Disponibilidade| Uptime mínimo de 99,5%                                                   |
| Compatibilidade| Web responsivo, apps Android/iOS, integração com catracas TCP/IP         |
| Privacidade    | Consentimento explícito para uso da biometria                            |

---

## 5. Públicos-Alvo

- Organizadores de eventos (produtores, órgãos públicos, empresas de eventos)
- Público geral/participantes (consumidores de cultura, esportes, congressos)
- Staff de operação (controle de acesso, segurança, produção)

---

## 6. Roadmap Sugerido (Fases de Entrega)

| Fase | Entrega                                                                 |
|------|------------------------------------------------------------------------|
| 1    | Módulo web de criação de eventos e vendas                              |
| 2    | Aplicativo mobile do cliente                                           |
| 3    | API de controle de acesso e módulo de catraca                          |
| 4    | Sistema de biometria facial integrado                                  |
| 5    | Aplicativo do organizador + painel de monitoramento                    |
| 6    | Refino da UX, ajustes com feedback e testes de estresse                |