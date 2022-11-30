from flask import Flask, request
from flask_cors import CORS
import torch
import torchvision.transforms as T
from torchvision.transforms import InterpolationMode
from model import Model

app = Flask(__name__)
CORS(app)
model = Model()
model.load_state_dict(torch.load("model.pt"))
model.eval()

@app.route('/classify', methods=["PUT"])
def hello():
  body = request.get_json()
  data = torch.tensor([[body['data']]])
  transforms = torch.nn.Sequential(
    T.GaussianBlur(5),
    T.Resize((28,28), interpolation=InterpolationMode.BILINEAR)
  )
  resize = transforms(data)
  predict = model(resize)
  target_class = torch.argmax(predict)
  return { 
    'predict': target_class.tolist(),
    'image': resize[0].tolist()
  }, 200