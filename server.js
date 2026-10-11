const http = require("http");
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const banco = new DatabaseSync("tarefas.db");

banco.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        feito INTEGER DEFAULT 0
    )
`);

const arquivos = {
    "/": "index.html",
    "/style.css": "style.css",
    "/script.js": "script.js"
};

const tipos = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

const servidor = http.createServer(function (requisicao, resposta) {
    if (requisicao.url === "/api/tarefas") {
        const lista = banco.prepare("SELECT * FROM tarefas").all();
        resposta.setHeader("Content-Type", "application/json; charset=utf-8");
        resposta.end(JSON.stringify(lista));
    } else if (arquivos[requisicao.url]) {
        const nome = arquivos[requisicao.url];
        resposta.setHeader("Content-Type", tipos[path.extname(nome)]);
        resposta.end(fs.readFileSync(nome));
    } else {
        resposta.statusCode = 404;
        resposta.setHeader("Content-Type", "text/plain; charset=utf-8");
        resposta.end("Página não encontrada");
    }
});

servidor.listen(3000, function () {
    console.log("Servidor rodando em http://localhost:3000");
});