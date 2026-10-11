let campo = document.getElementById("campo");
let botao = document.getElementById("botao");
let lista = document.getElementById("lista");

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

carregarTarefas();