/* ==========================================
   SISTEMA DE VAGAS DE ESTÁGIO
========================================== */


/* ==========================================
   ELEMENTOS
========================================== */

const form = document.getElementById("formVaga");

const tabela = document.getElementById("tabelaVagas");

const semVagas = document.getElementById("semVagas");

const totalVagas = document.getElementById("totalVagas");

const filtroBusca = document.getElementById("filtroBusca");

const filtroArea = document.getElementById("filtroArea");


/* ==========================================
   CARREGAR VAGAS
========================================== */

let vagas = JSON.parse(localStorage.getItem("vagasEstagio")) || [];


/* ==========================================
   CADASTRAR VAGA
========================================== */

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const novaVaga = {

        id: Date.now(),

        cargo: document.getElementById("cargo").value,

        empresa: document.getElementById("empresa").value,

        area: document.getElementById("area").value,

        localizacao: document.getElementById("localizacao").value,

        bolsa: document.getElementById("bolsa").value || "A combinar",

        modalidade: document.getElementById("modalidade").value,

        email: document.getElementById("email").value,

        link: document.getElementById("link").value,

        descricao: document.getElementById("descricao").value

    };


    /* Adiciona a vaga */

    vagas.push(novaVaga);


    /* Salva no navegador */

    salvarVagas();


    /* Atualiza a tabela */

    renderizarVagas();


    /* Limpa formulário */

    form.reset();


    /* Mostra mensagem */

    alert("✅ Vaga cadastrada com sucesso!");


    /* Vai para a tabela */

    document.getElementById("vagas").scrollIntoView({
        behavior: "smooth"
    });

});


/* ==========================================
   SALVAR NO LOCAL STORAGE
========================================== */

function salvarVagas() {

    localStorage.setItem(
        "vagasEstagio",
        JSON.stringify(vagas)
    );

}


/* ==========================================
   RENDERIZAR VAGAS
========================================== */

function renderizarVagas() {

    tabela.innerHTML = "";


    const busca = filtroBusca.value.toLowerCase();

    const areaSelecionada = filtroArea.value;


    const vagasFiltradas = vagas.filter(function (vaga) {

        const correspondeBusca =

            vaga.cargo.toLowerCase().includes(busca) ||

            vaga.empresa.toLowerCase().includes(busca) ||

            vaga.localizacao.toLowerCase().includes(busca);


        const correspondeArea =

            areaSelecionada === "" ||

            vaga.area === areaSelecionada;


        return correspondeBusca && correspondeArea;

    });


    /* Nenhuma vaga */

    if (vagasFiltradas.length === 0) {

        semVagas.style.display = "block";

    } else {

        semVagas.style.display = "none";

    }


    /* Atualiza contador */

    totalVagas.textContent = vagas.length;


    /* Cria cada vaga */

    vagasFiltradas.forEach(function (vaga) {

        const linha = document.createElement("tr");


        linha.innerHTML = `

            <td>
                <strong>
                    ${escaparHTML(vaga.cargo)}
                </strong>

                <br>

                <small>
                    ${escaparHTML(vaga.modalidade)}
                </small>
            </td>


            <td>
                ${escaparHTML(vaga.empresa)}
            </td>


            <td>
                <span class="badge-area">
                    ${escaparHTML(vaga.area)}
                </span>
            </td>


            <td>
                ${escaparHTML(vaga.localizacao)}
            </td>


            <td>
                ${escaparHTML(vaga.bolsa)}
            </td>


            <td>

                <button
                    class="btn-ver"
                    onclick="verVaga(${vaga.id})"
                >
                    Ver vaga
                </button>

            </td>

        `;


        tabela.appendChild(linha);

    });

}


/* ==========================================
   VER DETALHES DA VAGA
========================================== */

function verVaga(id) {

    const vaga = vagas.find(function (item) {

        return item.id === id;

    });


    if (!vaga) {

        return;

    }


    let mensagem =

        "📌 " + vaga.cargo + "\n\n" +

        "🏢 Empresa: " + vaga.empresa + "\n" +

        "💼 Área: " + vaga.area + "\n" +

        "📍 Localização: " + vaga.localizacao + "\n" +

        "💰 Bolsa: " + vaga.bolsa + "\n" +

        "🏠 Modalidade: " + vaga.modalidade + "\n\n" +

        "📝 Descrição:\n" +

        vaga.descricao + "\n\n" +

        "📧 E-mail:\n" +

        vaga.email;


    if (vaga.link) {

        mensagem +=

            "\n\n🔗 Link para candidatura:\n" +

            vaga.link;

    }


    alert(mensagem);


    /* Se existir link, pergunta se quer abrir */

    if (vaga.link) {

        const abrir = confirm(
            "Deseja abrir o link para candidatura?"
        );


        if (abrir) {

            window.open(
                vaga.link,
                "_blank"
            );

        }

    }

}


/* ==========================================
   FILTROS
========================================== */

filtroBusca.addEventListener(
    "input",
    renderizarVagas
);


filtroArea.addEventListener(
    "change",
    renderizarVagas
);


/* ==========================================
   PROTEÇÃO CONTRA HTML
========================================== */

function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;

}


/* ==========================================
   INICIALIZAÇÃO
========================================== */

renderizarVagas();