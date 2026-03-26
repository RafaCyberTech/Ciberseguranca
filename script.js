document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector(".contact-form");
    var status = document.getElementById("form-status");

    if (!form || !status) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var formData = new FormData(form);
        var payload = {
            nome: formData.get("nome"),
            email: formData.get("email"),
            assunto: formData.get("assunto"),
            mensagem: formData.get("mensagem"),
            data: new Date().toISOString()
        };

        var mensagens = [];
        var historico = localStorage.getItem("rafacyber_contactos");

        if (historico) {
            mensagens = JSON.parse(historico);
        }

        mensagens.push(payload);
        localStorage.setItem("rafacyber_contactos", JSON.stringify(mensagens));

        status.textContent = "Mensagem enviada com sucesso. O envio foi guardado neste navegador para demonstração.";
        status.classList.add("is-visible");
        form.reset();
    });
});
