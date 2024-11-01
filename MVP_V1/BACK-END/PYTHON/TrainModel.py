from ultralytics import YOLO
from roboflow import Roboflow

rf = Roboflow(api_key="bxZp7NsYavX21cINj2Go")
project = rf.workspace("projetointegrador-tbh58").project("caneta-duo8u")
version = project.version(1)
dataset = version.download("yolov8")

# Load a model

model = YOLO("yolov8n.pt")  # load a pretrained model (recommended for training)


# Train the model
results = model.train(
    data=f"{dataset.location}/data.yaml",
    epochs=20,
    imgsz=640,
)