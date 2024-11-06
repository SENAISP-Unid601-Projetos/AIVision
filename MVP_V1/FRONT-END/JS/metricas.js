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
  let ws; // Declare o WebSocket aqui
  
  setInterval(()=>{
      chartAcuracia()
      chartRecall()
      chartPrecisao()
  },500)
  
  document.getElementById("iniciaExperimento").addEventListener("click", async () => {
      const spanVP = document.getElementById("verdadeiroPositivo");
      const spanVN = document.getElementById("verdadeiroNegativo");
      const spanFP = document.getElementById("falsoPositivo");
      const spanFN = document.getElementById("falsoNegativo");
  
      while (flag) {
        const resultado = aleatorio();
        classeInferida = resultado === 1 ? "Tenis" : ""; // Simula uma detecção ou ausência de objeto
  
        if (classeInferida) {
          await Swal.fire({
            title: "Sweet!",
            text: `O objeto é um(a) ${classeInferida}`,
            imageUrl: "https://unsplash.it/400/200",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
          }).then(async (result) => {
            if (result.isConfirmed) {
              if (classeInferida === "Tenis") {
                // Incrementa VP para uma classe correta
                verdadeiroPositivo += 1;
                spanVP.textContent = verdadeiroPositivo;
              } else if(classeInferida == "Salto alto"){
                // Incrementa VP para uma classe correta
                verdadeiroPositivo += 1;
                spanVP.textContent = verdadeiroPositivo;
              } else if(classeInferida == "Chinelo"){
                // Incrementa VP para uma classe correta
                verdadeiroPositivo += 1;
                spanVP.textContent = verdadeiroPositivo;
              }
            } else if (result.isDismissed) {
              await Swal.fire({
                title: "O que realmente é?",
                icon: "question",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Tênis",
                denyButtonText: "Chinelo",
                cancelButtonText: "Salto Alto",
              }).then((result) => {
                if (result.isConfirmed) {
                  real = "Tenis";
                } else if (result.isDenied) {
                  real = "Chinelo";
                } else {
                  real = "Salto Alto";
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
            title: "Confirmação",
            text: "Você realmente não detectou nada?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sim, nada encontrado",
            cancelButtonText: "Não, encontrei algo",
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
  
        // Pausa de 2 segundos entre cada questão para facilitar visualização
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    });
    function chartAcuracia(){

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
                  formatter: function(val) {
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
              gradientToColors: ['#ABE5A1'],
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
    
    function chartRecall(){
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
                  formatter: function(val) {
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
              gradientToColors: ['#ABE5A1'],
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
    
    function chartPrecisao(){
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
                  formatter: function(val) {
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
              gradientToColors: ['#ABE5A1'],
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
  document.getElementById("terminaExperiemnto").addEventListener("click", () => {
    flag = false;

  });
  