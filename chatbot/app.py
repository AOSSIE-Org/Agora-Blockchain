import random
import json
import torch
import torch.nn as nn

from flask import Flask, request, jsonify
from flask_cors import CORS

from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

################################
# NLP STANDARDIZATION (MUST MATCH train.py)
################################
stemmer = PorterStemmer()

def tokenize(sentence):
    return word_tokenize(sentence)

def stem(word):
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, words):
    sentence_words = [stem(w) for w in tokenized_sentence]
    bag = [1 if w in sentence_words else 0 for w in words]
    return torch.tensor(bag, dtype=torch.float32)

################################
# MODEL
################################
class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super().__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.l1(x))
        x = self.relu(self.l2(x))
        return self.l3(x)

################################
# APP SETUP
################################
app = Flask(__name__)
CORS(app)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

################################
# LOAD DATA
################################
with open("intents.json", "r") as f:
    intents = json.load(f)

data = torch.load("data.pth", weights_only=True)

model = NeuralNet(
    data["input_size"],
    data["hidden_size"],
    data["output_size"]
).to(device)

model.load_state_dict(data["model_state"])
model.eval()

all_words = data["all_words"]
tags = data["tags"]

################################
# CHAT ENDPOINT

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        req = request.get_json()
        message = req.get("message", "")

        if not message.strip():
            return jsonify({"message": "Please say something."})

        tokens = tokenize(message)
        X = bag_of_words(tokens, all_words).unsqueeze(0).to(device)

        if X.sum().item() == 0:
            return jsonify({"message": "I do not understand..."})

        output = model(X)
        _, predicted = torch.max(output, dim=1)

        tag = tags[predicted.item()]
        probs = torch.softmax(output, dim=1)
        confidence = probs[0][predicted.item()].item()

        if confidence > 0.75:
            for intent in intents["intents"]:
                if intent["tag"] == tag:
                    return jsonify({
                        "message": random.choice(intent["responses"]),
                        "confidence": round(confidence, 3)
                    })

        return jsonify({"message": "I do not understand..."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

################################
# RUN
################################
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
