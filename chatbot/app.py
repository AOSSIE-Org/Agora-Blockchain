import random
import json
import torch
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from typing import List, Dict, Any, Tuple, Optional
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Tokenizer:
    @staticmethod
    def tokenize(sentence: str) -> List[str]:
        """Tokenize input sentence into words."""
        return sentence.lower().split()
    
    @staticmethod
    def bag_of_words(tokenized_sentence: List[str], words: List[str]) -> torch.Tensor:
        """Convert tokenized sentence to bag of words tensor."""
        bag = [1 if word in tokenized_sentence else 0 for word in words]
        return torch.tensor(bag, dtype=torch.float32)

class NeuralNet(nn.Module):
    def __init__(self, input_size: int, hidden_size: int, num_classes: int):
        super(NeuralNet, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),  # layer 0
            nn.ReLU(),                          # layer 1
            nn.Linear(hidden_size, hidden_size), # layer 2
            nn.ReLU(),                          # layer 3
            nn.Linear(hidden_size, num_classes)  # layer 4
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

class ModelLoadError(Exception):
    """Custom exception for model loading errors."""
    pass

class ChatBot:
    def __init__(self, model_path: str, intents_path: str):
        """Initialize ChatBot with model and intents files."""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = Tokenizer()
        self.confidence_threshold = 0.1
        self.model_path = model_path
        self.intents_path = intents_path
        self._initialize_bot()
    
    def _initialize_bot(self) -> None:
        """Initialize bot with error handling."""
        try:
            self._load_model(self.model_path)
        except RuntimeError as e:
            logger.warning(f"Initial model loading failed: {str(e)}")
            try:
                self._load_model_with_fix(self.model_path)
            except Exception as e:
                raise ModelLoadError(f"Failed to load model even with fixes: {str(e)}")
        
        self._load_intents(self.intents_path)
    
    def _load_model(self, model_path: str) -> None:
        """Load and initialize the neural network model."""
        try:
            data = torch.load(model_path, map_location=self.device)
            self._validate_model_data(data)
            
            self.model = NeuralNet(
                data["input_size"],
                data["hidden_size"],
                data["output_size"]
            ).to(self.device)
            
            self.model.load_state_dict(data["model_state"])
            self.model.eval()
            
            self.all_words = data['all_words']
            self.tags = data['tags']
            logger.info("Model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
    
    def _validate_model_data(self, data: Dict) -> None:
        """Validate model data contains required keys."""
        required_keys = ['input_size', 'hidden_size', 'output_size', 'model_state', 'all_words', 'tags']
        missing_keys = [key for key in required_keys if key not in data]
        if missing_keys:
            raise ValueError(f"Missing required keys in model data: {missing_keys}")
    
    def _load_model_with_fix(self, model_path: str) -> None:
        """Load model with state dict fixing for layer mismatches."""
        data = torch.load(model_path, map_location=self.device, weights_only=True)
        self._validate_model_data(data)
        
        self.model = NeuralNet(
            data["input_size"],
            data["hidden_size"],
            data["output_size"]
        ).to(self.device)
        
        state_dict = data["model_state"]
        new_state_dict = {}
        
        layer_mapping = {
            "network.6": "network.4",  # Final layer
            "network.3": "network.2",  # Middle layer
        }
        
        for key, value in state_dict.items():
            new_key = key
            for old_prefix, new_prefix in layer_mapping.items():
                if key.startswith(old_prefix):
                    new_key = key.replace(old_prefix, new_prefix)
                    break
            new_state_dict[new_key] = value
        
        self.model.load_state_dict(new_state_dict)
        self.model.eval()
        
        self.all_words = data['all_words']
        self.tags = data['tags']
        logger.info("Model loaded successfully with fixed state dict")
    
    def _load_intents(self, intents_path: str) -> None:
        """Load intent definitions from JSON file."""
        try:
            with open(intents_path, 'r') as f:
                self.intents = json.load(f)
            self._validate_intents(self.intents)
            logger.info("Intents loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load intents: {str(e)}")
            raise
    
    def _validate_intents(self, intents: Dict) -> None:
        """Validate intents data structure."""
        if 'intents' not in intents:
            raise ValueError("Invalid intents file: missing 'intents' key")
        
        for intent in intents['intents']:
            if not all(key in intent for key in ['tag', 'responses']):
                raise ValueError("Invalid intent format: missing required keys")
    
    def get_response(self, message: str) -> str:
        try:
            if not message.strip():
                return "Please provide a message."
            
            tokens = self.tokenizer.tokenize(message)
            
            if not tokens:
                return "I don't understand empty messages."
            
            logger.info(f"Available words: {self.all_words[:10]}...") 
  
            X = self.tokenizer.bag_of_words(tokens, self.all_words).unsqueeze(0).to(self.device)
            logger.info(f"Bag of words tensor: {X}")
            with torch.no_grad():
                output = self.model(X)
                logger.info(f"Raw model output: {output}")

            
            probs = torch.softmax(output, dim=1)
            prob, predicted = torch.max(probs, dim=1)
            

            if prob.item() > self.confidence_threshold:
                tag = self.tags[predicted.item()]
                for intent in self.intents['intents']:
                    if tag == intent["tag"]:
                        return random.choice(intent['responses'])
            
            return "I'm not sure I understand. Could you please rephrase that?"
            
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "Sorry, I encountered an error processing your message."

app = Flask(__name__)
CORS(app)

try:
    chatbot = ChatBot(
        model_path="data.pth",
        intents_path="intents.json"
    )
except Exception as e:
    logger.error(f"Failed to initialize chatbot: {str(e)}")
    raise

@app.route('/api/chat', methods=['POST'])
def chat() -> Tuple[Dict[str, Any], int]:
    try:
        request_data = request.get_json()
        if not request_data:
            return jsonify({"error": "No data provided"}), 400
            
        user_message = request_data.get('message', '').strip()
        if not user_message:
            return jsonify({"error": "Empty message"}), 400
            
        response = chatbot.get_response(user_message)
        return jsonify({"message": response}), 200
        
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)