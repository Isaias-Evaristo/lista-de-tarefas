const crypto = require("crypto");

function criarHash(senha) {
    const sal = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, sal, 64).toString("hex");
    return sal + ":" + hash;
}

function conferirSenha(senha, guardado) {
    const partes = guardado.split(":");
    const sal = partes[0];
    const hash = Buffer.from(partes[1], "hex");
    const novoHash = crypto.scryptSync(senha, sal, 64);
    return crypto.timingSafeEqual(hash, novoHash);
}

const sessoes = {};

function criarSessao(usuarioId) {
    const token = crypto.randomUUID();
    sessoes[token] = usuarioId;
    return token;
}

function usuarioDaSessao(token) {
    return sessoes[token];
}

module.exports = { criarHash, conferirSenha, criarSessao, usuarioDaSessao };