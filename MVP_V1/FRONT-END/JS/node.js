// Conectar ao WebSocket no caminho especificado
const socket = new WebSocket('ws://localhost:PORT/ws/data'); // Substitua PORT pelo número da porta correta

// Abertura de conexão
socket.onopen = function () {
    console.log('Conexão estabelecida');
};

// Função para receber mensagens
socket.onmessage = function (event) {
    // Exibe os dados recebidos
    const data = JSON.parse(event.data);
    console.log('Dados recebidos:', data);
    
    // Mostra os dados na página
    document.getElementById('resultado').innerText = JSON.stringify(data, null, 2);
};

// Enviar dados para o WebSocket
function sendData(data) {
    const jsonData = JSON.stringify(data);
    socket.send(jsonData);
    console.log('Dados enviados:', jsonData);
}

// Função para enviar dados de exemplo
function enviarDados() {
    // Exemplo de dados JSON a serem enviados
    const dados = {
        Contador1: Math.floor(Math.random() * 100), // Contador aleatório
        Objeto: "Exemplo"
    };

    // Envia os dados JSON para o WebSocket
    sendData(dados);
}

// Evento de clique no botão para enviar dados
document.getElementById('enviarDados').addEventListener('click', enviarDados);
