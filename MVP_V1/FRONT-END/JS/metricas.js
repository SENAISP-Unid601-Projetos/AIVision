function aleatorio() {
    return Math.floor(Math.random() * 2);
}

let verdadeiroPositivo = 0;
let verdadeiroNegativo = 0;
let falsoPositivo = 0;
let falsoNegativo = 0;
let flag = true;
let numberAle;
var classeInferida;
let flagClass = false;

var ws = new WebSocket('ws://127.0.0.1:1880/ws/data');
ws.onmessage = function(event) {
    var data = JSON.parse(event.data);
    
    classeInferida= data.Classe

    
    
    document.getElementById('iniciaExperimento').addEventListener('click', () => {
        acuracia = document.getElementById('acuracia');
        precisao = document.getElementById('precisao');
        recall = document.getElementById('recall');
        spanVP = document.getElementById('verdadeiroPositivo');
        spanVN = document.getElementById('verdadeiroNegativo');
        spanFP = document.getElementById('falsoPositivo');
        spanFN = document.getElementById('falsoNegativo');
    
        numberAle = setInterval(() => {
            if (!flag) {
                clearInterval(numberAle);
                return; 
            }
    
            const resultado = aleatorio(); 
    
            if (resultado === 1) {
                Swal.fire({
                    title: "Sweet!",
                    text: `O objeto é um(a) ${classeInferida}`,
                    imageUrl: "https://unsplash.it/400/200",
                    imageWidth: 400,
                    imageHeight: 200,
                    imageAlt: "Custom image",
                    showCancelButton: true,
                    confirmButtonText: 'Sim',
                    cancelButtonText: 'Não'
                }).then((result) => {
                    if (result.isConfirmed) {
                        verdadeiroPositivo += 1;
                        spanVP.textContent = verdadeiroPositivo; 
                    } else if (result.isDismissed) {
                        verdadeiroNegativo += 1;
                        spanVN.textContent = verdadeiroNegativo; 
                    }
                });
            }
        }, 2000);
    });
    
    document.getElementById('terminaExperiemnto').addEventListener('click', () => {
        flag = false; 
    });
};
