document.addEventListener("DOMContentLoaded", function () {
    var navToggle = document.querySelector(".nav-toggle");
    var mainNav = document.getElementById("main-nav");

    if (navToggle && mainNav) {
        var navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(function (link, index) {
            link.style.setProperty("--i", String(index));
        });

        navToggle.addEventListener("click", function () {
            var isOpen = mainNav.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        mainNav.addEventListener("click", function (event) {
            if (event.target && event.target.closest("a") && window.innerWidth <= 640) {
                mainNav.classList.remove("is-open");
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 640) {
                mainNav.classList.remove("is-open");
                navToggle.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    var quizForm = document.getElementById("security-quiz");
    var quizResult = document.getElementById("quiz-result");

    if (quizForm && quizResult) {
        var quizSteps = Array.from(quizForm.querySelectorAll(".quiz-step"));
        var quizNextButtons = quizForm.querySelectorAll(".quiz-next");
        var activeStepIndex = 0;

        function setActiveStep(nextIndex) {
            activeStepIndex = nextIndex;

            quizSteps.forEach(function (step, index) {
                var isActive = index === activeStepIndex;
                step.classList.toggle("is-active", isActive);

                if (isActive) {
                    step.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        }

        function getStepFeedback(step) {
            return step.querySelector(".quiz-feedback");
        }

        function evaluateStep(step) {
            var correctAnswer = step.getAttribute("data-answer");
            var selected = step.querySelector("input[type='radio']:checked");
            var feedback = getStepFeedback(step);
            var isCorrect = selected && selected.value === correctAnswer;
            var correctOption = step.querySelector("input[value='" + correctAnswer + "']");
            var correctLabel = correctOption ? correctOption.closest("label") : null;
            var correctText = correctLabel ? correctLabel.textContent.trim() : "a opção correta";

            step.classList.remove("is-correct", "is-wrong");
            feedback.className = "quiz-feedback";

            if (!selected) {
                feedback.textContent = "Escolha uma resposta antes de avançar.";
                feedback.classList.add("is-warning");
                return false;
            }

            if (isCorrect) {
                step.classList.add("is-correct");
                feedback.textContent = "Correto. Boa escolha!";
                feedback.classList.add("is-success");
            } else {
                step.classList.add("is-wrong");
                feedback.textContent = "Resposta errada. A correta é: " + correctText + ".";
                feedback.classList.add("is-error");
            }

            return true;
        }

        quizNextButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var currentStep = quizSteps[activeStepIndex];
                var answered = evaluateStep(currentStep);

                if (!answered) {
                    return;
                }

                button.disabled = true;

                window.setTimeout(function () {
                    button.disabled = false;

                    if (activeStepIndex < quizSteps.length - 1) {
                        setActiveStep(activeStepIndex + 1);
                    }
                }, 650);
            });
        });

        quizForm.addEventListener("submit", function (event) {
            event.preventDefault();

            var score = 0;
            var total = quizSteps.length;
            var unanswered = 0;

            quizSteps.forEach(function (step) {
                var correctAnswer = step.getAttribute("data-answer");
                var selected = step.querySelector("input[type='radio']:checked");

                if (!selected) {
                    unanswered += 1;
                    return;
                }

                if (selected.value === correctAnswer) {
                    score += 1;
                }
            });

            if (unanswered > 0) {
                quizResult.textContent = "Ainda faltam respostas em algumas perguntas.";
                quizResult.className = "quiz-result is-warning";
                return;
            }

            var message = "Você acertou " + score + " de " + total + ".";

            if (score === total) {
                message += " Excelente! Você domina bem o tema.";
                quizResult.className = "quiz-result is-success";
            } else if (score >= total - 1) {
                message += " Muito bom! Falta apenas um detalhe.";
                quizResult.className = "quiz-result is-success";
            } else {
                message += " Vale a pena rever as dicas de segurança.";
                quizResult.className = "quiz-result is-warning";
            }

            quizResult.textContent = message;
        });

        quizForm.addEventListener("reset", function () {
            quizResult.textContent = "";
            quizResult.className = "quiz-result";
            quizSteps.forEach(function (step) {
                var feedback = getStepFeedback(step);
                step.classList.remove("is-correct", "is-wrong");
                step.classList.remove("is-active");
                feedback.className = "quiz-feedback";
                feedback.textContent = "";
                step.querySelectorAll("input[type='radio']").forEach(function (input) {
                    input.checked = false;
                });
            });

            setActiveStep(0);
        });

        setActiveStep(0);
    }

    var form = document.getElementById("contact-form");
    var status = document.getElementById("form-status");

    if (!form || !status || !window.emailjs) {
        return;
    }

    var publicKey = "1LScugh9Lzztnt-hz";
    var templateId = "template_fg6buew";
    var serviceId = "service_16mvfsd";

    emailjs.init(publicKey);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        status.textContent = "A enviar a mensagem...";
        status.classList.add("is-visible");

        emailjs.sendForm(serviceId, templateId, form).then(function () {
            status.textContent = "Mensagem enviada com sucesso para o meu email.";
            form.reset();
        }).catch(function () {
            status.textContent = "Não foi possível enviar. Falta definir o Service ID correto no EmailJS.";
        });
    });
});
