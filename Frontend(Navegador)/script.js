const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");

openBtn.addEventListener("click", async () => {
    modal.classList.add("active");
    modalBody.innerHTML = `<div class="spinner"></div><p>Carregando dados...</p>`;

    try {
        // Simulando um delay com uma fake API
        const response = await fetch('http://127.0.0.1:8000/conecta-whats')
        const data = await response.text();
        modalBody.innerHTML = data;

    } catch (error) {
        modalBody.innerHTML = `<p>Erro ao carregar dados.</p>`;
    }
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});

// Fecha o modal ao clicar fora do conteúdo
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

const statusMsg = document.getElementById("statusMsg");

function formatarNumeroBrasil(numero) {
    // Remove caracteres não numéricos
    const limpo = numero.replace(/\D/g, "");

    // Remove o código do país (55)
    const local = limpo.startsWith("55") ? limpo.slice(2) : limpo;

    const ddd = local.slice(0, 2);
    const numeroParte = local.slice(2);

    const parte1 = numeroParte.slice(0, 5);
    const parte2 = numeroParte.slice(5);

    return `(${ddd}) ${parte1}-${parte2}`;
}

async function verificaConexao() {
    try {
        const response = await fetch("http://127.0.0.1:8000/verifica-status");
        const data = await response.json();

        if (data.res) {
            statusMsg.innerHTML = `<span style="color: green;">✅ Conectado como ${formatarNumeroBrasil(data.numero)}</span>`;
        } else {
            statusMsg.innerHTML = `<span style="color: red;">❌ Não conectado</span>`;
        }

    } catch (error) {
        statusMsg.innerHTML = `<span style="color: red;">Erro ao verificar conexão</span>`;
    }

}