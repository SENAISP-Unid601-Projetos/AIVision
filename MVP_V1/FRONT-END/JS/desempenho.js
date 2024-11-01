var ws = new WebSocket("ws://10.110.12.34:1880/ws/data");

let stackTenis = [];
let stackSalto = [];
let stackRasteirinha = [];

let chartDonut;
let chartLine;


window.onload = function () {
  chartsToShow();
};

ws.onmessage = function (event) {
  var data = JSON.parse(event.data);

  stackTenis.push(data.Contador1);
  stackSalto.push(data.Contador2);
  stackRasteirinha.push(data.Contador3);

  if (stackTenis.length > 60) {
    stackTenis.shift();
  }

  if (stackSalto.length > 60) {
    stackSalto.shift();
  }

  if (stackRasteirinha.length > 60) {
    stackRasteirinha.shift();
  }

  //   console.log(stackTenis);
  //   console.log(stackSalto);
  //   console.log(stackRasteirinha);

  setInterval(updateCharts, 1000);
};

function chartsToShow() {
  var optionsDonut = {
    series: [0, 0, 0],
    labels: ["Tênis", "Sandália", "Chinelo"],
    chart: {
      type: "donut",
      width: 300,
      height: 300,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };
  chartDonut = new ApexCharts(
    document.querySelector("#chart-donut"),
    optionsDonut
  );
  chartDonut.render();

  console.log("cheguei");

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      // Código para lidar com a câmera funcionando
      let video = document.querySelector("video");
      video.srcObject = stream;
    })
    .catch(function (err) {
      console.log("Erro ao acessar a câmera: " + err);
    });

  // Gráfico de Linhas (inicia zerado e com eixo X sendo segundos)
  var optionsLine = {
    series: [
      {
        name: "Tênis",
        data: stackTenis, // Inicia com 12 valores zerados
      },
      {
        name: "Sandália",
        data: stackSalto, // Inicia com 12 valores zerados
      },
      {
        name: "Chinelo",
        data: stackRasteirinha, // Inicia com 12 valores zerados
      },
    ],
    chart: {
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "easeout",
        speed: 800,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: Array.from({ length: 60 }, (_, i) => `${i + 1}s`), // Mostra 12 segundos no eixo X
    },
  };
  chartLine = new ApexCharts(
    document.querySelector("#chart-line"),
    optionsLine
  );
  chartLine.render();

  // Gráficos Sparkline (representam cada categoria de sapato)
  var spark1 = {
    chart: {
      id: "spark1",
      group: "sparks",
      type: "line",
      height: 80,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: stackTenis, // Inicia zerado
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
      },
    },
    colors: ["#fff"],
    tooltip: {
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function formatter(val) {
            return "";
          },
        },
      },
    },
  };

  var spark2 = {
    chart: {
      id: "spark2",
      group: "sparks",
      type: "line",
      height: 80,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: stackSalto, // Inicia zerado
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
      },
    },
    colors: ["#fff"],
    tooltip: {
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function formatter(val) {
            return "";
          },
        },
      },
    },
  };

  var spark3 = {
    chart: {
      id: "spark3",
      group: "sparks",
      type: "line",
      height: 80,
      sparkline: {
        enabled: true,
      },
    },
    series: [
      {
        data: stackRasteirinha, // Inicia zerado
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      padding: {
        top: 20,
        bottom: 10,
        left: 10,
      },
    },
    colors: ["#fff"],
    tooltip: {
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function formatter(val) {
            return "";
          },
        },
      },
    },
  };

  // Renderiza os Sparklines
  new ApexCharts(document.querySelector("#spark1"), spark1).render();
  new ApexCharts(document.querySelector("#spark2"), spark2).render();
  new ApexCharts(document.querySelector("#spark3"), spark3).render();
}

function updateCharts() {
  const donutserie = [
    stackTenis[stackTenis.length - 1],
    stackSalto[stackSalto.length - 1],
    stackRasteirinha[stackRasteirinha.length - 1],
  ];
  chartDonut.updateSeries(donutserie);

  // Função para atualizar o gráfico de Linhas com valores aleatórios

  const lineserie = [
    { name: "Tênis", data: stackTenis },
    { name: "Sandália", data: stackSalto },
    { name: "Chinelo", data: stackRasteirinha },
  ];
  chartLine.updateSeries(lineserie);

  // Atualiza as categorias (segundos) no eixo X
  const newCategories = Array.from({ length: 60 }, (_, i) => `${i + 1}s`);
  chartLine.updateOptions({
    xaxis: {
      categories: newCategories,
    },
  });

  // Atualiza os gráficos Sparkline com os mesmos dados das categorias correspondentes
  ApexCharts.exec("spark1", "updateSeries", [{ data: stackTenis }]); // Tênis
  ApexCharts.exec("spark2", "updateSeries", [{ data: stackSalto }]); // Sandália
  ApexCharts.exec("spark3", "updateSeries", [{ data: stackRasteirinha }]); // Chinelo
}
