const API_URL = 'https://keycontrol.onrender.com';

let estaCarregando = false;

function carregarSalas() {
    if (estaCarregando) return;
    estaCarregando = true;

    fetch(`${API_URL}/salas/`)
        .then(response => response.json())
        .then(dados => {
        let abertas = 0;
        let fechadas = -5;

        if (dados.salas) {
        dados.salas.forEach(sala => {
            const idFormatado = String(sala.id).padStart(2, '0');
            const elemento = document.querySelector(`#aviso-sala-${idFormatado}`);

            if (elemento) {
                elemento.textContent = sala.status ? "🟢 Aberta" : "🔴 Fechada";
            }

            if (sala.status) {
                abertas++;
            } else {
                fechadas++;
            }
        });
        }

        const elAbertas = document.querySelector("#sAb");
        const elFechadas = document.querySelector("#sFe");

        if (elAbertas) elAbertas.textContent = abertas;
        if (elFechadas) elFechadas.textContent = fechadas;

        const containerHistorico = document.querySelector("#lista-historico");
        if (containerHistorico && dados.historico) {
            containerHistorico.innerHTML = "";

        dados.historico.forEach(item => {
            const dataObjeto = new Date(item.criado_em);
            const dataFormatada = dataObjeto.toLocaleDateString('pt-BR');
            const horaFormatada = dataObjeto.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            const novoItem = document.createElement("p");
            novoItem.className = "item-historico";
            novoItem.id = `historico-${dataObjeto.getTime()}`;
            novoItem.textContent = `[${dataFormatada} - ${horaFormatada}] ${item.mensagem}`;

            containerHistorico.appendChild(novoItem);
        });
        }
    })
    .catch(erro => console.error("Erro ao carregar salas:", erro))
    .finally(() => {
        estaCarregando = false;
    });
}

function alternarStatusSala(idSala, seletorElemento) {
    const elemento = document.querySelector(seletorElemento);
    const elAbertas = document.querySelector("#sAb");
    const elFechadas = document.querySelector("#sFe");

    if (elemento && elAbertas && elFechadas) {
        const estavaAberto = elemento.textContent.includes("Aberta");
        let qtdAbertas = parseInt(elAbertas.textContent) || 0;
        let qtdFechadas = parseInt(elFechadas.textContent) || 0;

    if (estavaAberto) {
        elemento.textContent = "🔴 Fechada";
        elAbertas.textContent = Math.max(0, qtdAbertas - 1);
        elFechadas.textContent = qtdFechadas + 1;
    } else {
        elemento.textContent = "🟢 Aberta";
        elAbertas.textContent = qtdAbertas + 1;
        elFechadas.textContent = Math.max(0, qtdFechadas - 1);
    }
    }

    fetch(`${API_URL}/salas/${idSala}/alternar/`, { method: 'POST' })
    .then(response => response.json())
    .then(() => {
        carregarSalas();
    })
    .catch(erro => {
        console.error("Erro ao alterar status:", erro);
        carregarSalas();
    });
}

carregarSalas();

setInterval(carregarSalas, 3000);