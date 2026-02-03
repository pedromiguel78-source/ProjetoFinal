# Projeto Final – Programação Web Avançada  
**Plataforma de Gestão de Propostas de Projeto Final de Curso**

## 1. Descrição Geral

Este projeto corresponde ao desenvolvimento de um **protótipo funcional** de uma aplicação web destinada à gestão de propostas de Projeto Final de Curso em contexto académico.

A aplicação permite que docentes se autentiquem no sistema e efetuem a gestão das suas propostas de projeto, enquanto os utilizadores anónimos podem consultar a lista de docentes registados.

O protótipo foi desenvolvido com base na especificação definida na **Tarefa 5.1**, tendo como objetivo demonstrar, de forma prática, os principais requisitos funcionais do sistema.

---

## 2. Tecnologias Utilizadas

### Front-end
- Vue.js (Single Page Application)
- Vue Router
- Vuex
- BootstrapVue
- Axios

### Back-end
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcrypt

### Base de Dados
- MongoDB
- Mongoose

---

## 3. Funcionalidades Implementadas

### Utilizador Anónimo
- Consulta da lista de docentes registados no sistema;
- Consulta de informação básica associada a cada docente.

### Docente
- Registo no sistema;
- Autenticação (login/logout);
- Consulta das suas próprias propostas de projeto;
- Criação de novas propostas;
- Edição de propostas existentes;
- Eliminação de propostas.

---

## 4. Estrutura do Projeto

```
ProjetoFinal/
│
├── Front-End/
│   ├── src/
│   │   ├── views/
│   │   ├── router/
│   │   ├── store/
│   │   ├── api/
│   │   └── main.js
│   └── package.json
│
├── Back-End/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   │
│   └── package.json
│
└── README.md
```

---

## 5. Configuração e Execução do Projeto

### 5.1 Pré-requisitos
- Node.js (versão 18 ou superior)
- MongoDB em execução local
- npm

---

### 5.2 Back-end

```bash
cd Back-End
npm install
cp .env.example .env
npm run seed
npm run dev
```

O back-end ficará disponível em:
```
http://localhost:3000
```

---

### 5.3 Front-end

```bash
cd Front-End
npm install
npm run serve
```

O front-end ficará disponível em:
```
http://localhost:8080
```

---

## 6. Credenciais de Teste

Após a execução do comando `npm run seed`, é criado um docente de teste:

```
Email: pedro.pereira@uab.pt  
Password: PWA2026!
```

---

## 7. Observações Finais

Este projeto constitui um **protótipo funcional demonstrador**, não tendo como objetivo apresentar uma solução final ou completa. O foco principal esteve na implementação dos requisitos essenciais definidos no enunciado do projeto e na validação prática da arquitetura proposta.
 
