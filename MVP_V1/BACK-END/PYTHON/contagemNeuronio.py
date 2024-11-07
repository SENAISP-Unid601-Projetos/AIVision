from ultralytics import YOLO

# Carrega o modelo YOLOv8
model = YOLO('MVP_V1/BACK-END/PYTHON/Pre-Training-Yolo-Model/best12.pt')  # substitua 'yolov8n.pt' pelo caminho do seu modelo YOLOv8

# Exibe a estrutura completa do modelo
print("Estrutura do modelo:")
print(model.model)

# Conta o número total de camadas
num_layers = len(list(model.model.modules()))
print(f"\nNúmero total de camadas: {num_layers}")

# Conta o número total de parâmetros (neurônios estimados)
total_neurons = sum(p.numel() for p in model.model.parameters())
trainable_neurons = sum(p.numel() for p in model.model.parameters() if p.requires_grad)

print(f"Número total de neurônios (parâmetros): {total_neurons}")
print(f"Número de neurônios treináveis: {trainable_neurons}")

# Exibe o número de parâmetros para cada camada
print("\nDetalhes de cada camada:")
for i, layer in enumerate(model.model.modules()):
    num_params = sum(p.numel() for p in layer.parameters())
    print(f"Camada {i + 1}: {layer.__class__.__name__} - Parâmetros: {num_params}")
