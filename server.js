const http = require("http");
const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");
const { criarHash, conferirSenha, criarSessao, usuarioDaSessao } = require("./auth.js");

const banco = new DatabaseSync("tarefas.db");

banco.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )
`);

banco.exec(`
    CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        feito INTEGER DEFAULT 0,
        usuario_id INTEGER NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
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

function lerJson(requisicao, resposta, aoReceber) {
    let corpo = "";

    requisicao.on("data", function (pedaco) {
        corpo += pedaco;
    });

    requisicao.on("end", function () {
        try {
            aoReceber(JSON.parse(corpo));
        } catch (erro) {
            resposta.statusCode = 400;
            resposta.end("Dados inválidos");
        }
    });
}

function validarCadastro(dados) {
    if (!dados.nome || dados.nome.trim() === "") {
        return "O nome é obrigatório";
    }
    if (!dados.email || !dados.email.includes("@")) {
        return "O e-mail precisa ter @";
    }
    if (!dados.senha || dados.senha.length < 8) {
        return "A senha precisa ter pelo menos 8 caracteres";
    }
    return "";
}

function usuarioLogado(requisicao) {
    const cabecalho = requisicao.headers["authorization"] || "";
    const token = cabecalho.replace("Bearer ", "");
    return usuarioDaSessao(token);
}

const servidor = http.createServer(function (requisicao, resposta) {
    const partes = requisicao.url.split("/");

    if (requisicao.url === "/api/cadastro" && requisicao.method === "POST") {
        lerJson(requisicao, resposta, function (dados) {
            const erro = validarCadastro(dados);

            if (erro !== "") {
                resposta.statusCode = 400;
                resposta.end(erro);
                return;
            }

            const existe = banco.prepare("SELECT id FROM usuarios WHERE email = ?").get(dados.email.trim());

            if (existe) {
                resposta.statusCode = 409;
                resposta.end("E-mail já cadastrado");
                return;
            }

            banco.prepare("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)")
                .run(dados.nome.trim(), dados.email.trim(), criarHash(dados.senha));
            resposta.statusCode = 201;
            resposta.end("Usuário criado");
        });
    } else if (requisicao.url === "/api/login" && requisicao.method === "POST") {
        lerJson(requisicao, resposta, function (dados) {
            const usuario = banco.prepare("SELECT * FROM usuarios WHERE email = ?").get(dados.email);

            if (!usuario || !conferirSenha(dados.senha, usuario.senha)) {
                resposta.statusCode = 401;
                resposta.end("E-mail ou senha incorretos");
                return;
            }

            const token = criarSessao(usuario.id);
            resposta.setHeader("Content-Type", "application/json; charset=utf-8");
            resposta.end(JSON.stringify({ token: token, nome: usuario.nome }));
        });
    } else if (requisicao.url.startsWith("/api/tarefas")) {
        const usuarioId = usuarioLogado(requisicao);

        if (!usuarioId) {
            resposta.statusCode = 401;
            resposta.end("Faça login para continuar");
            return;
        }

        if (requisicao.method === "POST" && requisicao.url === "/api/tarefas") {
            lerJson(requisicao, resposta, function (dados) {
                if (!dados.titulo || dados.titulo.trim() === "") {
                    resposta.statusCode = 400;
                    resposta.end("O título é obrigatório");
                    return;
                }

                banco.prepare("INSERT INTO tarefas (titulo, usuario_id) VALUES (?, ?)")
                    .run(dados.titulo.trim(), usuarioId);
                resposta.statusCode = 201;
                resposta.end("Tarefa criada");
            });
        } else if (requisicao.method === "PATCH") {
            const id = Number(partes[3]);

            if (!Number.isInteger(id)) {
                resposta.statusCode = 400;
                resposta.end("Id inválido");
                return;
            }

            banco.prepare("UPDATE tarefas SET feito = 1 - feito WHERE id = ? AND usuario_id = ?")
                .run(id, usuarioId);
            resposta.end("Tarefa atualizada");
        } else if (requisicao.method === "GET" && requisicao.url === "/api/tarefas") {
            const lista = banco.prepare("SELECT * FROM tarefas WHERE usuario_id = ?").all(usuarioId);
            resposta.setHeader("Content-Type", "application/json; charset=utf-8");
            resposta.end(JSON.stringify(lista));
        } else {
            resposta.statusCode = 405;
            resposta.end("Método não permitido");
        }
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