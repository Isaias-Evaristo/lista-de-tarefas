let campo = document.getElementById("campo");
let botao = document.getElementById("botao");
let lista = document.getElementById("lista");

botao.addEventListener("click", function () {
    let texto = campo.value;

    if (texto === "") {
        alert("Digite uma tarefa!");
    } else {
        let item = document.createElement("li");
        item.textContent = texto;
        lista.appendChild(item);
        campo.value = "";
    }
});