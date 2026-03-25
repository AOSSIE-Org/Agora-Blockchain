import os
import json
import torch
import nltk
import numpy as np
from flask import Flask, request, jsonify
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

################################
# PATH SETUP
################################
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INTENTS_PATH = os.path.join(BASE_DIR, "intents.json")
MODEL_PATH = os.path.join(BASE_DIR, "data.pth")

################################
# NLTK SAFE SETUP (3.8.2+)
################################
def ensure_nltk_tokenizers():
    try:
        nltk.data.find("tokenizers/punkt_tab/english")
    except LookupError:
        try:
            nltk.download("punkt_tab")
        except Exception:
            nltk.download("punkt")

ensure_nltk_tokenizers()

################################
# NLP UTILITIES
################################
stemmer = PorterStemmer()

def tokenize(sentence):
    return word_tokenize(sentence)

def stem(word):
    return stemmer.stem(word.lower())

def bag_of_words(tokenized_sentence, words):
    sentence_words = [stem(w) for w in tokenized_sentence]
    bag = np.zeros(len(words), dtype=np.float32)
    for idx, w in enumerate(words):
        if w in sentence_words:
            bag[idx] = 1
    return bag

################################
# LOAD DATA
################################
with open(INTENTS_PATH, "r", encoding="utf-8") as f:
    intents = json.load(f)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
data = torch.load(MODEL_PATH, map_location=device)

class NeuralNet(torch.nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super().__init__()
        self.l1 = torch.nn.Linear(input_size, hidden_size)
        self.l2 = torch.nn.Linear(hidden_size, hidden_size)
        self.l3 = torch.nn.Linear(hidden_size, num_classes)
        self.relu = torch.nn.ReLU()

    def forward(self, x):
        x = self.relu(self.l1(x))
        x = self.relu(self.l2(x))
        return self.l3(x)

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
# FLASK APP
################################
app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    message = request.json.get("message")
    if not message:
        return jsonify({"error": "Message is required"}), 400

    tokens = tokenize(message)
    X = bag_of_words(tokens, all_words)
    X = torch.from_numpy(X).unsqueeze(0).to(device)

    with torch.no_grad():
        # Check if input is gibberish (no known words recognized)
        if X.sum().item() == 0:
            return jsonify({"message": "I do not understand..."})

        # Make prediction
        output = model(X)
        _, predicted = torch.max(output, dim=1)
        tag = tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        confidence = probs[0][predicted.item()]

        if confidence.item() > 0.75:
            for intent in intents["intents"]:
                if intent["tag"] == tag:
                    return jsonify({
                        "response": np.random.choice(intent["responses"])
                    })

    return jsonify({"response": "Sorry, I didn't understand that."})

################################
# SAFE ENTRYPOINT
################################
if __name__ == "__main__":
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    host = os.getenv("FLASK_HOST", "127.0.0.1")
    port = int(os.getenv("FLASK_PORT", "5000"))

    app.run(host=host, port=port, debug=debug)
