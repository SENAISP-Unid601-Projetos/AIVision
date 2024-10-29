import websocket
import json
import threading


class EnviarDados:
    url = 'ws://127.0.0.1:1880/ws/data'  # Url servidor
    
    @staticmethod
    def gerar_dados(cont1, cont2, cont3,objeto):
        """Gera o dicionário com os dados dos contadores."""
        return {
            'Contador1': cont1,
            'Contador2': cont2,
            'Contador3': cont3,
            'Classe':objeto
        }

    @staticmethod
    def on_open(ws, data):
        """Envia dados quando a conexão é aberta."""
        ws.send(json.dumps(data))
        print("Dados enviados com sucesso:", data)

    @staticmethod
    def conecta_websocket(dados):
        """Conecta ao WebSocket e envia os dados."""
        ws = websocket.WebSocketApp(EnviarDados.url, on_open=lambda ws: EnviarDados.on_open(ws, dados))
        ws.run_forever()

    @staticmethod
    def repetir_conexao(dados):
        """Cria uma nova thread para a conexão WebSocket."""
        thread = threading.Thread(target=EnviarDados.conecta_websocket, args=(dados,))
        thread.start()


