document.addEventListener("DOMContentLoaded", function () {
    const inputGTM = document.getElementById("gtmInput");
    const buttonLoad = document.getElementById("loadGTM");
    const savedGTM = sessionStorage.getItem("gtmId");

    // Verifica se um GTM já foi salvo na sessão anterior
    if (savedGTM) {
        console.log("GTM salvo encontrado:", savedGTM);
        if (inputGTM) {
            inputGTM.value = savedGTM;
        }
        loadGTM(savedGTM);
    } else {
        console.log("Nenhum GTM salvo encontrado.");
    }

    // Evento de clique para carregar o GTM
    if (buttonLoad) {
        buttonLoad.addEventListener("click", function () {
            const gtmId = inputGTM.value.trim();

            if (!gtmId) {
                alert("Por favor, insira um ID do GTM.");
                return;
            }

            if (!gtmId.match(/^GTM-[A-Z0-9]+$/)) {
                alert("ID do GTM inválido! O formato deve ser GTM-XXXXXX.");
                return;
            }

            sessionStorage.setItem("gtmId", gtmId);
            console.log("GTM salvo:", gtmId);
            loadGTM(gtmId);
        });
    }
});

// Função para injetar o GTM dinamicamente
function loadGTM(gtmId) {
    if (document.getElementById("gtmScript")) {
        console.warn("GTM já carregado.");
        return; // Se o GTM já foi carregado, não carregar de novo
    }

    // Script do Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', gtmId);

    // Adiciona o <noscript> para o GTM
    const noscript = document.createElement("noscript");
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
                          height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.appendChild(noscript);
}
