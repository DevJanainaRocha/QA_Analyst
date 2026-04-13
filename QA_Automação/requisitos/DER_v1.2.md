# Documento de Especificação de Requisitos — Plataforma de Gestão Empresarial

**Produto:** Plataforma de Gestão Empresarial
**Versão:** 1.2
**Data:** 2026-04-09
**Status:** Ativo

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura Funcional](#2-arquitetura-funcional-visão-modular)
3. [Dashboard](#3-dashboard)
4. [Atividades](#4-atividades)
5. [Licenças e Vistorias](#5-licenças-e-vistorias)
6. [Órgãos Públicos](#6-órgãos-públicos)
7. [Prestadores](#7-prestadores)
8. [Redes](#8-redes)
9. [Usuários](#9-usuários)
10. [Financeiro](#10-financeiro)
11. [Consultor](#11-consultor)
12. [Funcionalidades Transversais](#12-funcionalidades-transversais)
13. [Notificações](#13-notificações)
14. [Comentários](#14-comentários)
15. [Etapas (Steps)](#15-etapas-steps)
16. [Bugs e Restrições Conhecidas](#16-bugs-e-restrições-conhecidas)
17. [Itens em Aberto](#17-itens-em-aberto)
18. [Apêndice Técnico](#18-apêndice-técnico)

---

## 1. Visão Geral

### 1.1 Objetivo

Este documento define os requisitos funcionais e regras de negócio da plataforma **Plataforma de Gestão Empresarial**, destinada à gestão do ciclo de regularização de unidades comerciais, incluindo controle de licenças, atividades, exigências regulatórias e indicadores operacionais.

### 1.2 Escopo

A solução contempla:

* Gestão de unidades (abertura e funcionamento)
* Controle regulatório (licenças e vistorias)
* Gestão de atividades
* Monitoramento operacional via dashboards
* Controle financeiro
* Integrações externas (ex: APIs públicas)

---

## 2. Arquitetura Funcional (Visão Modular)

A plataforma é composta pelos seguintes módulos:

| #  | Módulo                       |     Status no DER     |
| -- | ---------------------------- | :-------------------: |
| 1  | Dashboard                    |     ✅ Documentado     |
| 2  | Unidades                     |     ✅ Documentado     |
| 3  | Atividades                   |     ✅ Documentado     |
| 4  | Licenças e Vistorias         |     ✅ Documentado     |
| 5  | Órgãos Públicos              | ✅ Documentado (AS-IS) |
| 6  | Prestadores                  | ✅ Documentado (AS-IS) |
| 7  | Redes                        |     ✅ Documentado     |
| 8  | Usuários                     |     ✅ Documentado     |
| 9  | Financeiro                   |     ✅ Documentado     |
| 10 | Consultor                    |     ✅ Documentado     |
| 11 | Funcionalidades Transversais |     ✅ Documentado     |
| 12 | Notificações                 | ✅ Documentado (AS-IS) |
| 13 | Comentários                  | ✅ Documentado (AS-IS) |
| 14 | Etapas (Steps)               | ✅ Documentado (AS-IS) |

---

## 9. Usuários

### Perfis

| Perfil            | Descrição                      |
| ----------------- | ------------------------------ |
| Administrador     | Acesso total à plataforma      |
| Gestor de Rede    | Gestão da rede e suas unidades |
| Gestor de Unidade | Gestão da unidade vinculada    |

### Regras de Negócio

| ID         | Regra                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| RN-USR-001 | Permissões devem variar conforme: tipo de usuário e vínculo organizacional |

---

## 11. Consultor

### Requisitos Funcionais

#### RF-CON-001 — Input de Identificador

* Campo de entrada de identificador para consulta

#### RF-CON-002 — Consulta Automática via API

* Acionar consulta automática ao informar o identificador

#### RF-CON-003 — Dados Retornados

| Campo             | Fonte |
| ----------------- | ----- |
| Razão social      | API   |
| Nome fantasia     | API   |
| CNAEs             | API   |
| Natureza jurídica | API   |
| Endereço          | API   |

#### RF-CON-004 — Preenchimento Automático

* Dados retornados devem preencher automaticamente o cadastro

---

## 18.2 Integrações Externas (Identificadas no Repositório)

| Integração                         | Finalidade                        | Status no Código   |
| ---------------------------------- | --------------------------------- | ------------------ |
| **API pública de CNPJ**            | Consulta de dados cadastrais      | ✅ Implementado     |
| **MinIO** (S3-compatible)          | Armazenamento de documentos       | ✅ Implementado     |
| **SMTP / E-mail**                  | E-mails transacionais             | ✅ Implementado     |
| **Integração regulatória externa** | Integração com órgãos reguladores | ⚠️ Não confirmado  |
| **Serviços governamentais / RPA**  | Dados complementares              | ❌ Não implementado |

---

## Histórico de Versões

| Versão | Data       | Descrição                                                                         |
| ------ | ---------- | --------------------------------------------------------------------------------- |
| 1.0    | —          | Versão inicial                                                                    |
| 1.1    | —          | Ajustes em regras de negócio                                                      |
| 1.2    | 2026-04-09 | Documento oficial revisado; inclusão de apêndice técnico com mapeamento de código |
| 1.2.1  | 2026-04-09 | Inclusão de requisitos AS-IS para módulos adicionais                              |
