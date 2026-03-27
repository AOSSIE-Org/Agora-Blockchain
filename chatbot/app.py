"""Flask API for the Agora chatbot application.

This module implements a REST API endpoint for chatbot interactions. It loads a
pre-trained neural network model and intent definitions to process user messages,
classify them by intent, and return appropriate responses.

The API provides a /api/chat endpoint (POST) that accepts user messages and returns
bot responses based on intent classification confidence thresholds.
"""

import random
import json
import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS
from os.path import dirname, abspath, join


def tokenize(sentence):
    """Tokenize a sentence into individual words.
    
    Args:
        sentence (str): The input sentence to tokenize.
        
    Returns:
        list: A list of words obtained by splitting on whitespace.
    """
    return sentence.split()  # Tokenize by splitting on spaces

def stem(word):
    """Apply simple stemming to a word by converting to lowercase.
    
    Args:
        word (str): The input word to stem.
        
    Returns:
        str: The lowercased word.
    """
    return word.lower()  # Simple stemming by converting to lowercase

def bag_of_words(tokenized_sentence, words):
    """Convert a tokenized sentence into a bag-of-words vector.
    
    Creates a binary vector where each element represents whether a vocabulary word
    appears in the tokenized sentence (1) or not (0).
    
    Args:
        tokenized_sentence (list): List of words from the input sentence.
        words (list): The complete vocabulary of known words.
        
    Returns:
        torch.Tensor: A 1D float tensor of shape (len(words),) with binary values.
    """
    bag = [1 if stem(word) in [stem(w) for w in tokenized_sentence] else 0 for word in words]
    return torch.tensor(bag, dtype=torch.float32)

class NeuralNet(nn.Module):
    """Simple 3-layer neural network for intent classification.
    
    A feedforward neural network with two hidden layers using ReLU activation
    for classifying input vectors into predefined intent classes.
    """
    
    def __init__(self, input_size, hidden_size, num_classes):
        """Initialize the neural network layers.
        
        Args:
            input_size (int): Dimension of the input features (bag-of-words size).
            hidden_size (int): Number of neurons in each hidden layer.
            num_classes (int): Number of output classes (intents).
        """
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)
        self.l2 = nn.Linear(hidden_size, hidden_size)
        self.l3 = nn.Linear(hidden_size, num_classes)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        """Forward pass through the network.
        
        Args:
            x (torch.Tensor): Input tensor of shape (batch_size, input_size).
            
        Returns:
            torch.Tensor: Output logits of shape (batch_size, num_classes).
        """
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
    """Process a user message and return a chatbot response.
    
    Expects a JSON payload with a 'message' field. Tokenizes the message,
    converts it to a bag-of-words representation, and passes it through the
    trained neural network to classify the intent. Returns a response from the
    matching intent if confidence exceeds 0.75, otherwise returns a default
    "I do not understand" message.
    
    Returns:
        flask.Response: JSON response with either a 'message' key (bot response)
                       or an 'error' key (if an exception occurred).
                       
    Raises:
        Implicitly handles all exceptions and returns an error response.
    """
    try:
        request_data = request.get_json()
        user_message = request_data.get('message', '')

        # Tokenize and process the message
        sentence = tokenize(user_message)
        X = bag_of_words(sentence, data['all_words']).unsqueeze(0).to(device)

        # Check if input is gibberish (no known words recognized)
        if X.sum().item() == 0:
            return jsonify({"message": "I do not understand..."})

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
