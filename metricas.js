function aleatorio() {
    return Math.floor(Math.random() * 2);
}

let verdadeiroPositivo = 0;
let verdadeiroNegativo = 0;
let falsoPositivo = 0;
let falsoNegativo = 0;
let flag = true;
let classeInferida;
let real;

document.getElementById('iniciaExperimento').addEventListener('click', async () => {
    const acuracia = document.getElementById('acuracia');
    const precisao = document.getElementById('precisao');
    const recall = document.getElementById('recall');
    const spanVP = document.getElementById('verdadeiroPositivo');
    const spanVN = document.getElementById('verdadeiroNegativo');
    const spanFP = document.getElementById('falsoPositivo');
    const spanFN = document.getElementById('falsoNegativo');

    while (flag) {
        const resultado = aleatorio(); 
        classeInferida = resultado === 1 ? 'Tenis' : ''; // Simula uma detecção ou ausência de objeto

        if (classeInferida) {
            await Swal.fire({
                title: "Sweet!",
                text: `O objeto é um(a) ${classeInferida}`,
                imageUrl: "https://unsplash.it/400/200",
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: "Custom image",
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    if (classeInferida === 'Tenis') {  // Incrementa VP para uma classe correta
                        verdadeiroPositivo += 1;
                        spanVP.textContent = verdadeiroPositivo;
                    }
                } else if (result.isDismissed) {
                    await Swal.fire({
                        title: 'O que realmente é?',
                        icon: 'question',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonText: 'Tênis',
                        denyButtonText: 'Chinelo',
                        cancelButtonText: 'Salto Alto'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            real = 'Tenis';
                        } else if (result.isDenied) {
                            real = 'Chinelo';
                        } else {
                            real = 'Salto Alto';
                        }

                        if (classeInferida !== real) {
                            falsoPositivo += 1;
                            spanFP.textContent = falsoPositivo;
                        }
                    });
                }
            });
        } else {
            await Swal.fire({
                title: 'Confirmação',
                text: 'Você realmente não detectou nada?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, nada encontrado',
                cancelButtonText: 'Não, encontrei algo'
            }).then((result) => {
                if (result.isConfirmed) {
                    verdadeiroNegativo += 1;
                    spanVN.textContent = verdadeiroNegativo;
                } else {
                    falsoNegativo += 1;
                    spanFN.textContent = falsoNegativo;
                }
            });
        }

        let calcAcuracia = (verdadeiroPositivo + verdadeiroNegativo) / (verdadeiroPositivo + falsoNegativo + verdadeiroNegativo + falsoPositivo);
        acuracia.innerHTML = (calcAcuracia * 100).toFixed(0) + "%"
        let calcRecall = verdadeiroPositivo /  (verdadeiroPositivo + falsoNegativo)
        recall.innerHTML = (calcRecall * 100).toFixed(0) + "%"
        let calcPrecisao = verdadeiroPositivo / (verdadeiroPositivo + falsoPositivo)
        precisao.innerHTML = (calcPrecisao * 100).toFixed(0) + "%"
        // Pausa de 2 segundos entre cada questão para facilitar visualização
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
});

document.getElementById('terminaExperiemnto').addEventListener('click', () => {
    flag = false; 
});
