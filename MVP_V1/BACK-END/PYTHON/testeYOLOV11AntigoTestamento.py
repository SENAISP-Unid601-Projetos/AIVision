import cv2
import streamlit as st
from ultralytics import solutions
from conexaoNodeRed import EnviarDados

url = 'ws://127.0.0.1:1880/ws/data'

cap = cv2.VideoCapture(0)
assert cap.isOpened(), "Error reading video file"
w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

frame_placeholder = st.empty()

line_points = [(400, 20), (400, 1080)]
listaVerificaPerson = set()
listaVerificaCup = set()
listaVerificaCellPhone = set()

counter = solutions.ObjectCounter(
    show=True,
    region=line_points,
    model="MVP_V1/BACK-END/PYTHON/Pre-Training-Yolo-Model/best12.pt",
)

while cap.isOpened():
    success, im0 = cap.read()
    if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break
    im0 = counter.count(im0)

    
    frame = cv2.cvtColor(im0, cv2.COLOR_BGR2RGB)

    
    frame_placeholder.image(frame, channels="RGB")
    
    pegaClasse = counter.classwise_counts
    person_out = pegaClasse.get('Tenis', {}).get('OUT', 0)
    cup_out = pegaClasse.get('Salto alto',{}).get('OUT',0)
    cell_phone_out = pegaClasse.get('Chinelo',{}).get('OUT',0)

    if person_out not in listaVerificaPerson or cup_out not in listaVerificaCup or cell_phone_out not in listaVerificaCellPhone:
        listaVerificaPerson.add(person_out)
        listaVerificaCup.add(cup_out)
        listaVerificaCellPhone.add(cell_phone_out)
        dados = EnviarDados.gerar_dados(person_out,cup_out,cell_phone_out)
        EnviarDados.repetir_conexao(dados)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break
    
cap.release()
cv2.destroyAllWindows()
