async function enviar(rota, dados) {
    const resposta = await fetch("http://localhost:3000" + rota, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
    console.log(rota, resposta.status, await resposta.text());
}

async function testar() {
    await enviar("/api/cadastro", { nome: "Ana", email: "ana@email.com", senha: "12345678" });
    await enviar("/api/cadastro", { nome: "Ana", email: "ana@email.com", senha: "12345678" });
    await enviar("/api/cadastro", { nome: "", email: "x@email.com", senha: "12345678" });
    await enviar("/api/login", { email: "ana@email.com", senha: "12345678" });
    await enviar("/api/login", { email: "ana@email.com", senha: "errada123" });
}

testar();