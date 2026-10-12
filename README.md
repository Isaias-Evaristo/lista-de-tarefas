# Lista de Tarefas

Aplicação web de lista de tarefas, feita para juntar tudo o que aprendi em Desenvolvimento de Aplicações para Internet.

## O que ela faz

- Adicionar tarefas
- Marcar e desmarcar tarefas como feitas
- Guardar tudo em um banco de dados, então as tarefas continuam ao recarregar a página

## Como foi feita

- **Front-end:** HTML, CSS e JavaScript
- **Back-end:** servidor em Node.js, sem bibliotecas externas
- **Banco de dados:** SQLite
- **Comunicação:** API em JSON, usando `fetch`
- **Segurança:** validação dos dados no servidor

## Rotas da API

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/tarefas` | Lista as tarefas |
| POST | `/api/tarefas` | Cria uma tarefa |
| PATCH | `/api/tarefas/:id` | Marca ou desmarca uma tarefa como feita |

## Como rodar

1. Instale o Node.js
2. No terminal, dentro da pasta do projeto, rode: `node server.js`
3. Abra `http://localhost:3000` no navegador
4. Para desligar o servidor, aperte `Ctrl+C`

## Arquivos

- `index.html`: a página
- `style.css`: o visual
- `script.js`: o JavaScript da página
- `server.js`: o servidor e a API

## Estudos

Os exercícios que me prepararam para este projeto estão no repositório [desenvolvimento-web-estudos](https://github.com/Isaias-Evaristo/desenvolvimento-web-estudos).
