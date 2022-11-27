from flask import Flask, request
import torch
from model import Model

app = Flask(__name__)
model = Model()
model.load_state_dict(torch.load("model.pt"))
model.eval()

@app.route('/classify')
def hello():
  body = request.get_json()
  data = torch.tensor([[body['data']]])
  predict = model(data)
  target_class = torch.argmax(predict)
  print(target_class)
  return { 'predict': target_class.tolist()}, 200