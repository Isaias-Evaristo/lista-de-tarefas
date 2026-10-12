# Lista de Tarefas

Aplicação web de lista de tarefas, feita para juntar tudo o que aprendi em Desenvolvimento de Aplicações para Internet.

## O que ela faz

- Cadastro e login de usuários, com a senha guardada em hash
- Cada usuário vê e altera só as suas tarefas
- Adicionar tarefas e marcar como feitas
- Guardar tudo em um banco de dados, então os dados continuam ao recarregar a página

## Como foi feita

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** servidor em Node.js, sem bibliotecas externas
- **Banco de dados:** SQLite
- **Comunicação:** API em JSON, usando `fetch`
- **Segurança:** validação dos dados no servidor, senha com hash e sal, sessão por token e controle de acesso por usuário

## Rotas da API

| Método | Rota | O que faz | Precisa de login |
|---|---|---|---|
| POST | `/api/cadastro` | Cria um usuário | Não |
| POST | `/api/login` | Entra e devolve um token | Não |
| GET | `/api/tarefas` | Lista as tarefas do usuário | Sim |
| POST | `/api/tarefas` | Cria uma tarefa | Sim |
| PATCH | `/api/tarefas/:id` | Marca ou desmarca uma tarefa | Sim |

## Como rodar

1. Instale o Node.js
2. No terminal, dentro da pasta do projeto, rode: `node server.js`
3. Abra `http://localhost:3000` no navegador
4. Cadastre um usuário e entre
5. Para desligar o servidor, aperte `Ctrl+C`

## Arquivos

- `index.html`: a página
- `style.css`: o visual
- `script.js`: o JavaScript da página
- `server.js`: o servidor e a API
- `auth.js`: senhas com hash e sessões
- `testar.js`: teste das rotas de cadastro e login

## Limitações

- As sessões ficam na memória do servidor, então todo mundo precisa entrar de novo quando ele reinicia
- Ainda não é possível apagar nem editar uma tarefa
- O projeto roda só no computador local, sem hospedagem

## Estudos

Os exercícios que me prepararam para este projeto estão no repositório [desenvolvimento-web-estudos](https://github.com/Isaias-Evaristo/desenvolvimento-web-estudos).
