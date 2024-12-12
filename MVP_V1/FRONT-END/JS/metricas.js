
let verdadeiroPositivo = 5;
let verdadeiroNegativo = 5;
let falsoPositivo = 5;
let falsoNegativo = 5;
let flag = true;
let classeInferida;
let real;
let ws;

let countTenis = 0;
let contadorTenisAux = 0;

let countSalto = 0;
let contadorSaltoAux = 0;

let countChinelo = 0;
let contadorChineloAux = 0;

let flagElse;
let imagemSrc;

document.getElementById('terminaExperiemnto').addEventListener('click', () =>{
  location.reload();
})
document.getElementById('iniciaExperimento').addEventListener('click', () => {

  // Conexão com o WebSocket para receber imagens
  ws = new WebSocket('ws://127.0.0.1:1880/ws/data');

  ws.onmessage = function (event) {

    var data = JSON.parse(event.data);

    countTenis = data.Contador1;
    countSalto = data.Contador2;
    countChinelo = data.Contador3;
    imagemSrc =  'data:image/jpeg;base64,' + data.Imagem;

    setInterval(() => {
      chartAcuracia()
      chartRecall()
      chartPrecisao()
    }, 1000)
    if (countTenis > contadorTenisAux && countSalto == contadorSaltoAux && countChinelo == contadorChineloAux) {
      classeInferida = "Tenis"
      contadorTenisAux++;
      flagElse = false;

      Swal.fire({
        title: "Inferencia",
        html: `
        <h3>O objeto é um(a) ${classeInferida}</h3>
        <img id="imageDisplay" style="width: 100%; max-height: 400px;" src="${imagemSrc}" alt="Imagem em tempo real" />
        `,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then(result => {
        if (result.isConfirmed) {
          if (classeInferida === 'Tenis') { // Incrementa VP para uma classe correta
            verdadeiroPositivo += 1;
            document.getElementById('verdadeiroPositivo').textContent = verdadeiroPositivo;
          }
        } else if (result.isDismissed) {
          Swal.fire({
            title: 'O que realmente é?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Chinelo',
            denyButtonText: 'Salto Alto',
          }).then((result) => {
            if (result.isConfirmed) {
              real = 'Chinelo';
            } else if (result.isDenied) {
              real = 'Salto Alto';
            }
            if (classeInferida !== real) {
              falsoPositivo += 1;
              document.getElementById('falsoPositivo').textContent = falsoPositivo;
            }
          });
        }
      });

    } else if (countSalto > contadorSaltoAux && countTenis == contadorTenisAux && countChinelo == contadorChineloAux) {
      classeInferida = "Salto Alto"
      contadorSaltoAux++;
      flagElse = false;

      Swal.fire({
        title: "Sweet!",
        text: `O objeto é um(a) ${classeInferida}`,
        html: `<img id="imageDisplay" style="width: 100%; max-height: 400px;" src="${imagemSrc}" alt="Imagem em tempo real" />`,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then(result => {
        if (result.isConfirmed) {
          if (classeInferida === 'Salto Alto') { // Incrementa VP para uma classe correta
            verdadeiroPositivo += 1;
            document.getElementById('verdadeiroPositivo').textContent = verdadeiroPositivo;
          }
        } else if (result.isDismissed) {
          Swal.fire({
            title: 'O que realmente é?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Tenis',
            denyButtonText: 'Chinelo',
          }).then((result) => {
            if (result.isConfirmed) {
              real = 'Tenis';
            } else if (result.isDenied) {
              real = 'Chinelo';
            }
            if (classeInferida !== real) {
              falsoPositivo += 1;
              document.getElementById('falsoPositivo').textContent = falsoPositivo;
            }
          });
        }
      });
    } else if (countChinelo > contadorChineloAux && countTenis == contadorTenisAux && countSalto == contadorSaltoAux) {
      classeInferida = "Chinelo"
      contadorChineloAux++;
      flagElse = false;

      Swal.fire({
        title: "Sweet!",
        text: `O objeto é um(a) ${classeInferida}`,
        html: `<img id="imageDisplay" style="width: 100%; max-height: 400px;" src="${imagemSrc}" alt="Imagem em tempo real" />`,
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then(result => {
        if (result.isConfirmed) {
          if (classeInferida === 'Chinelo') { // Incrementa VP para uma classe correta
            verdadeiroPositivo += 1;
            document.getElementById('verdadeiroPositivo').textContent = verdadeiroPositivo;
          }
        } else if (result.isDismissed) {
          Swal.fire({
            title: 'O que realmente é?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Tenis',
            denyButtonText: 'Salto Alto',
          }).then((result) => {
            if (result.isConfirmed) {
              real = 'Tenis';
            } else if (result.isDenied) {
              real = 'Salto Alto';
            }
            if (classeInferida !== real) {
              falsoPositivo += 1;
              document.getElementById('falsoPositivo').textContent = falsoPositivo;
            }
          });
        }
      });
    } else {
      setTimeout(()=>{
        if(!flagElse){
          Swal.fire({
            title: "Confirmação",
            text: "Você realmente não detectou nada?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, nada encontrado",
            cancelButtonText: "Não, encontrei algo",
          }).then((result) => {
            if (result.isConfirmed) {
              verdadeiroNegativo += 1;
              document.getElementById('verdadeiroNegativo').textContent = verdadeiroNegativo;
            } else {
              falsoNegativo += 1;
              document.getElementById('falsoNegativo').textContent = falsoNegativo;
            }
          });
          flagElse = true;
        }
      },5000)
      
    }
  };
});

function chartAcuracia() {

  let calcAcuracia = (verdadeiroPositivo + verdadeiroNegativo) / (verdadeiroPositivo + falsoNegativo + verdadeiroNegativo + falsoPositivo);

  var options = {
    series: [calcAcuracia * 100],
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px'
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#02407e'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Acurácia'],
  };

  var chart = new ApexCharts(document.querySelector("#chartAcuracia"), options);
  chart.render();

  chart.updateSeries([calcAcuracia * 100]);
}

function chartRecall() {
  let calcRecall = verdadeiroPositivo / (verdadeiroPositivo + falsoNegativo);

  var options = {
    series: [calcRecall * 100],
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px'
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#02407e'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Recall'],
  };

  var chart = new ApexCharts(document.querySelector("#chartRecall"), options);
  chart.render();

  chart.updateSeries([calcRecall * 100]);
}

function chartPrecisao() {
  let calcPrecisao = verdadeiroPositivo / (verdadeiroPositivo + falsoPositivo);

  var options = {
    series: [calcPrecisao * 100],
    chart: {
      height: 350,
      type: 'radialBar',
      toolbar: {
        show: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 225,
        hollow: {
          margin: 0,
          size: '70%',
          background: '#fff',
          image: undefined,
          imageOffsetX: 0,
          imageOffsetY: 0,
          position: 'front',
          dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 4,
            opacity: 0.24
          }
        },
        track: {
          background: '#fff',
          strokeWidth: '67%',
          margin: 0, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: -3,
            left: 0,
            blur: 4,
            opacity: 0.35
          }
        },

        dataLabels: {
          show: true,
          name: {
            offsetY: -10,
            show: true,
            color: '#888',
            fontSize: '17px'
          },
          value: {
            formatter: function (val) {
              return parseInt(val) + "%";
            },
            color: '#111',
            fontSize: '36px',
            show: true,
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#02407e'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: 'round'
    },
    labels: ['Precisão'],
  };

  var chart = new ApexCharts(document.querySelector("#chartPrecisao"), options);
  chart.render();

  chart.updateSeries([calcPrecisao * 100]);
}
document.getElementById('terminaExperiemnto').addEventListener('click', () => {
  flag = false;
});
