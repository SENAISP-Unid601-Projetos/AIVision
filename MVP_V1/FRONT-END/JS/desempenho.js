var ws = new WebSocket("ws://10.110.12.20:1880/ws/data");

let stackTenis = [];
let stackSalto = [];
let stackRasteirinha = [];
let avgStackTenis = [];
let avgStackSalto = [];
let avgStackRasteirinha = [];
let intervalSet = false;
let seconds = [];
let secondCounter = 0;

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

  if (stackTenis.length > 10) {
    stackTenis.shift();
  }

  if (stackSalto.length > 10) {
    stackSalto.shift();
  }

  if (stackRasteirinha.length > 10) {
    stackRasteirinha.shift();
  }

  if (seconds.length < 10) {
    seconds.push(secondCounter);
  } else {
    seconds.shift();
    seconds.push(secondCounter);
  }
  secondCounter++;

  // Apenas configura o intervalo uma vez
  if (!intervalSet) {
    setInterval(updateCharts, 1000);
    intervalSet = true;
  }
};

function chartsToShow() {
  var optionsDonut = {
    series: [1, 1, 1],
    labels: ["Tênis", "Sandália", "Chinelo"],
    chart: {
      type: "donut",
      width: 300,
      height: 300
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
      categories: seconds
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

  const lineserie = [
    { name: "Tênis", data: stackTenis },
    { name: "Sandália", data: stackSalto },
    { name: "Chinelo", data: stackRasteirinha },
  ];
  chartLine.updateSeries(lineserie);

  let newCategories = seconds && seconds.length > 0 ? seconds : []; 
  console.log(stackTenis);

  chartLine.updateOptions({
    xaxis: {
      categories: newCategories,
      labels: {
        show: true,
        style: {
          fontSize: '30px',
        },
        rotate: -45, // Rotaciona as labels para evitar sobreposição
        formatter: function (val) {
          return val; // Exibe apenas o valor do segundo
        },
      },
    },
  });

  // Atualiza os gráficos Sparkline
  ApexCharts.exec("spark1", "updateSeries", [{ data: stackTenis }]); // Tênis
  ApexCharts.exec("spark2", "updateSeries", [{ data: stackSalto }]); // Sandália
  ApexCharts.exec("spark3", "updateSeries", [{ data: stackRasteirinha }]); // Chinelo
}

// Função para calcular a média de 30 segundos e atualizar os arrays de médias
function calculateAverages() {
  const avgTenis = stackTenis.length > 0 ? stackTenis.reduce((a, b) => a + b, 0) / stackTenis.length : 0;
  const avgSalto = stackSalto.length > 0 ? stackSalto.reduce((a, b) => a + b, 0) / stackSalto.length : 0;
  const avgRasteirinha = stackRasteirinha.length > 0 ? stackRasteirinha.reduce((a, b) => a + b, 0) / stackRasteirinha.length : 0;

  avgStackTenis.push(avgTenis);
  avgStackSalto.push(avgSalto);
  avgStackRasteirinha.push(avgRasteirinha);

  // Limita o tamanho do array de médias para manter somente os últimos 10 valores
  if (avgStackTenis.length > 10) avgStackTenis.shift();
  if (avgStackSalto.length > 10) avgStackSalto.shift();
  if (avgStackRasteirinha.length > 10) avgStackRasteirinha.shift();

  // Limpa os stacks após calcular a média
  stackTenis = [];
  stackSalto = [];
  stackRasteirinha = [];

  updateLineChart();
}

// Função para atualizar o gráfico de linhas com as médias calculadas
function updateLineChart() {
  const lineSeries = [
    { name: "Tênis", data: avgStackTenis },
    { name: "Sandália", data: avgStackSalto },
    { name: "Chinelo", data: avgStackRasteirinha },
  ];
  
  chartLine.updateSeries(lineSeries);

  // Atualiza o eixo x com os tempos de intervalo de 30s
  let categories = Array.from({ length: avgStackTenis.length }, (_, i) => `${(i + 1) * 30}s`);
  chartLine.updateOptions({
    xaxis: {
      categories: categories,
    },
  });
}

// Define o intervalo para calcular a média a cada 30 segundos
if (!intervalSet) {
  setInterval(calculateAverages, 30000); // 30 segundos
  intervalSet = true;
}