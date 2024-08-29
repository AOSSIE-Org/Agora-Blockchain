import random
import json
import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS
from os.path import dirname, abspath, join

# Define a simple tokenizer and stemmer
def tokenize(sentence):
    return sentence.split()  # Tokenize by splitting on spaces

def stem(word):
    return word.lower()  # Simple stemming by converting to lowercase

def bag_of_words(tokenized_sentence, words):
    bag = [1 if stem(word) in [stem(w) for w in tokenized_sentence] else 0 for word in words]
    return torch.tensor(bag, dtype=torch.float32)

class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.l1(x))
        x = self.relu(self.l2(x))
        x = self.l3(x)
        return x

app = Flask(__name__)
CORS(app) 
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE,weights_only=True)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval() 

bot_name = "Agora"

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        request_data = request.get_json()
        user_message = request_data.get('message', '')

        # Tokenize and process the message
        sentence = tokenize(user_message)
        X = bag_of_words(sentence, data['all_words']).unsqueeze(0).to(device)

        # Make prediction
        output = model(X)
        _, predicted = torch.max(output, dim=1)
        tag = data['tags'][predicted.item()]
        prob = torch.softmax(output, dim=1)[0][predicted.item()]

        # Determine response
        if prob.item() > 0.75:
            for intent in intents['intents']:
                if tag == intent["tag"]:
                    bot_response = random.choice(intent['responses'])
                    break
            else:
                bot_response = "I do not understand..."
        else:
            bot_response = "I do not understand..."

        return jsonify({"message": bot_response})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000,debug=True)
