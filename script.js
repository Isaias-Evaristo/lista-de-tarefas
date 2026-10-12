let campo = document.getElementById("campo");
let botao = document.getElementById("botao");
let lista = document.getElementById("lista");

let areaLogin = document.getElementById("area-login");
let areaTarefas = document.getElementById("area-tarefas");
let nome = document.getElementById("nome");
let email = document.getElementById("email");
let senha = document.getElementById("senha");
let entrar = document.getElementById("entrar");
let cadastrar = document.getElementById("cadastrar");
let aviso = document.getElementById("aviso");
let saudacao = document.getElementById("saudacao");
let sair = document.getElementById("sair");

function mostrarTarefa(tarefa) {
    let item = document.createElement("li");
    item.textContent = tarefa.titulo;

    if (tarefa.feito === 1) {
        item.classList.add("feita");
    }

    item.addEventListener("click", async function () {
        await fetch("/api/tarefas/" + tarefa.id, { method: "PATCH" });
        item.classList.toggle("feita");
    });

    lista.appendChild(item);
}

async function carregarTarefas() {
    let resposta = await fetch("/api/tarefas");
    let tarefas = await resposta.json();
    lista.innerHTML = "";
    tarefas.forEach(mostrarTarefa);
}

function mostrarTelaLogada(nomeUsuario) {
    areaLogin.classList.add("escondido");
    areaTarefas.classList.remove("escondido");
    sair.classList.remove("escondido");
    saudacao.textContent = "Olá, " + nomeUsuario + "!";
    carregarTarefas();
}

function mostrarTelaLogin() {
    areaLogin.classList.remove("escondido");
    areaTarefas.classList.add("escondido");
    sair.classList.add("escondido");
    saudacao.textContent = "";
}

cadastrar.addEventListener("click", async function () {
    let resposta = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.value, email: email.value, senha: senha.value })
    });
    aviso.textContent = await resposta.text();
});

entrar.addEventListener("click", async function () {
    let resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, senha: senha.value })
    });

    if (resposta.ok) {
        let dados = await resposta.json();
        localStorage.setItem("token", dados.token);
        localStorage.setItem("nome", dados.nome);
        aviso.textContent = "";
        senha.value = "";
        mostrarTelaLogada(dados.nome);
    } else {
        aviso.textContent = await resposta.text();
    }
});

sair.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("nome");
    mostrarTelaLogin();
});

botao.addEventListener("click", async function () {
    let texto = campo.value;

    if (texto === "") {
        alert("Digite uma tarefa!");
    } else {
        await fetch("/api/tarefas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo: texto })
        });
        campo.value = "";
        carregarTarefas();
    }
});

if (localStorage.getItem("token")) {
    mostrarTelaLogada(localStorage.getItem("nome"));
} else {
    mostrarTelaLogin();
}