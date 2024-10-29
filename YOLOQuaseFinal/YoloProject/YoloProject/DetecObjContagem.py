import cv2
import streamlit as st
from ultralytics import YOLO, solutions

# Carregar o modelo YOLOv8
model = YOLO("yolo11s.pt")

# Acessar a câmera
cap = cv2.VideoCapture(0)
assert cap.isOpened(), "Erro ao acessar a câmera"

# Pegar as dimensões do vídeo
w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

# Placeholder para exibir os frames
frame_placeholder = st.empty()

# Definir os pontos da região de interesse
region_points = [(20, 400), (625, 404), (625, 360), (20, 360)]

# Inicializar o contador de objetos
counter = solutions.ObjectCounter(
    view_img=True,
    reg_pts=region_points,
    names=model.names,
    draw_tracks=True,
    line_thickness=2,
    show = True,
)

# Loop para leitura e processamento dos frames
while cap.isOpened():
    success, im0 = cap.read()
    if not success:
        st.warning("Frame de vídeo vazio ou processamento de vídeo concluído.")
        break

    # Rastrear objetos com YOLO
    tracks = model.track(im0, persist=True, show=False)

    # Contar objetos na imagem
    im0 = counter.count(im0)

    # Converter o frame de BGR (OpenCV) para RGB (para exibir no Streamlit)
    frame = cv2.cvtColor(im0, cv2.COLOR_BGR2RGB)

    # Atualizar o frame no Streamlit
    frame_placeholder.image(frame, channels="RGB")

    # Pegar a contagem de classes, como pessoas detectadas saindo
    #print(counter.track_ids)
    for result in tracks:
        # Iterar sobre as detecções
        for box in result.boxes:
            class_id = int(box.cls)  # ID da classe detectada
            class_name = model.names[class_id]  # Nome da classe
            print(class_name)
    pegaClasse = counter.classwise_counts
    person_out = pegaClasse.get('person', {}).get('OUT', 0)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
