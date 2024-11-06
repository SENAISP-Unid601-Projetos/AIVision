import cv2
from ultralytics import YOLO, solutions
from conexaoNodeRed import EnviarDados
import base64 
import streamlit as st

url = 'ws://127.0.0.1:1880/ws/data'

modelYolo = YOLO("BACK-END/PYTHON/Pre-Training-Yolo-Model/best.pt")

cap = cv2.VideoCapture(0)
assert cap.isOpened(), "Error reading video file"
w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))
# Placeholder para exibir os frames
frame_placeholder = st.empty()

# Define region points
line_points = [(20, 400), (1080, 400)]
listaVerificaPerson = set()
listaVerificaCup = set()
listaVerificaCellPhone = set()
class_name = ''

# Init Object Counter
counter = solutions.ObjectCounter(
    show=False,
    region=line_points,
    model=("BACK-END/PYTHON/Pre-Training-Yolo-Model/best.pt")
)

# Process video
while cap.isOpened():
    success, im0 = cap.read()
    if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break
    results = modelYolo.track(im0)
    im0 = counter.count(im0)
    # Converter o frame de BGR (OpenCV) para RGB (para exibir no Streamlit)
    frame = cv2.cvtColor(im0, cv2.COLOR_BGR2RGB)
    # Atualizar o frame no Streamlit
    frame_placeholder.image(frame, channels="RGB")
    # Pegar a contagem de classes
    pegaClasse = counter.classwise_counts
    person_out = pegaClasse.get('Tenis', {}).get('OUT', 0)
    cup_out = pegaClasse.get('Salto alto', {}).get('OUT', 0)
    cell_phone_out = pegaClasse.get('Chinelo', {}).get('OUT', 0)

    for result in results:
        # Iterar sobre as detecções
        for box in result.boxes:
            class_id = int(box.cls)  # ID da classe detectada
            class_name = modelYolo.names[class_id]  # Nome da classe
            print(class_name)

    if person_out not in listaVerificaPerson or cup_out not in listaVerificaCup or cell_phone_out not in listaVerificaCellPhone:
        _, buffer = cv2.imencode('.jpg', im0)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        listaVerificaPerson.add(person_out)
        listaVerificaCup.add(cup_out)
        listaVerificaCellPhone.add(cell_phone_out)
        dados = EnviarDados.gerar_dados(person_out, cup_out, cell_phone_out,class_name,img_base64)
        EnviarDados.repetir_conexao(dados)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
