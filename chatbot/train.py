import numpy as np
import random
import json
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import nltk
from pathlib import Path
from typing import List, Tuple, Dict, Any
import logging
from tqdm import tqdm

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class Tokenizer:
    def __init__(self):
        try:
            nltk.download('punkt', quiet=True)
        except Exception as e:
            logger.error(f"Failed to download NLTK data: {str(e)}")
            raise

    @staticmethod
    def tokenize(sentence: str) -> List[str]:
        return sentence.lower().split()

    @staticmethod
    def create_bag_of_words(tokenized_sentence: List[str], vocab: List[str]) -> torch.Tensor:
        bag = [1 if word in tokenized_sentence else 0 for word in vocab]
        return torch.tensor(bag, dtype=torch.float32)

class NeuralNet(nn.Module):
    def __init__(self, input_size: int, hidden_size: int, num_classes: int, dropout_rate: float = 0.2):
        super(NeuralNet, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(hidden_size, num_classes)
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

class ChatDataset(Dataset):
    def __init__(self, X_data: np.ndarray, y_data: np.ndarray):
        self.x_data = X_data
        self.y_data = y_data
        self.n_samples = len(X_data)

    def __getitem__(self, index: int) -> Tuple[np.ndarray, int]:
        return self.x_data[index], self.y_data[index]

    def __len__(self) -> int:
        return self.n_samples

class ChatbotTrainer:
    def __init__(self, config: Dict[str, Any]):
        """Initialize trainer with configuration."""
        self.config = config
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.tokenizer = Tokenizer()
        self.all_words = []
        self.tags = []
        
        logger.info(f"Using device: {self.device}")
        
    def prepare_training_data(self, intents_file: str) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare training data from intents file."""
        try:
            with open(intents_file, 'r') as f:
                intents = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load intents file: {str(e)}")
            raise

        xy = []
        
        # Process patterns and tags
        for intent in intents['intents']:
            tag = intent['tag']
            self.tags.append(tag)
            for pattern in intent['patterns']:
                words = self.tokenizer.tokenize(pattern)
                self.all_words.extend(words)
                xy.append((words, tag))

        # Clean and prepare vocabulary
        ignore_words = {'?', '.', '!'}
        self.all_words = sorted(set(w for w in self.all_words if w not in ignore_words))
        self.tags = sorted(set(self.tags))

        logger.info(f"Prepared {len(xy)} patterns")
        logger.info(f"Found {len(self.tags)} tags: {self.tags}")
        logger.info(f"Vocabulary size: {len(self.all_words)} words")

        # Create training tensors
        X_train = []
        y_train = []
        
        for (pattern_sentence, tag) in xy:
            bag = self.tokenizer.create_bag_of_words(pattern_sentence, self.all_words)
            X_train.append(bag)
            y_train.append(self.tags.index(tag))

        return np.array(X_train), np.array(y_train)

    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> Tuple[NeuralNet, Dict[str, Any]]:
        """Train the neural network."""
        dataset = ChatDataset(X_train, y_train)
        train_loader = DataLoader(
            dataset=dataset,
            batch_size=self.config['batch_size'],
            shuffle=True,
            num_workers=0
        )

        input_size = len(X_train[0])
        model = NeuralNet(
            input_size=input_size,
            hidden_size=self.config['hidden_size'],
            num_classes=len(self.tags),
            dropout_rate=self.config.get('dropout_rate', 0.2)
        ).to(self.device)

        criterion = nn.CrossEntropyLoss()
        optimizer = torch.optim.Adam(model.parameters(), lr=self.config['learning_rate'])
        scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
            optimizer, mode='min', factor=0.5, patience=20, verbose=True
        )

        progress_bar = tqdm(range(self.config['num_epochs']), desc="Training")
        for epoch in progress_bar:
            epoch_loss = 0
            for words, labels in train_loader:
                words = words.to(self.device)
                labels = labels.to(dtype=torch.long).to(self.device)
                
                outputs = model(words)
                loss = criterion(outputs, labels)
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                epoch_loss += loss.item()

            avg_loss = epoch_loss / len(train_loader)
            scheduler.step(avg_loss)
            
            if (epoch + 1) % 100 == 0:
                progress_bar.set_postfix({'loss': f'{avg_loss:.4f}'})
        model_data = {
            "model_state": model.state_dict(),
            "input_size": input_size,
            "hidden_size": self.config['hidden_size'],
            "output_size": len(self.tags),
            "all_words": self.all_words,
            "tags": self.tags
        }

        return model, model_data

def main():
    config = {
        'num_epochs': 1000,
        'batch_size': 8,
        'learning_rate': 0.001,
        'hidden_size': 8,
        'dropout_rate': 0.2
    }

    try:
        trainer = ChatbotTrainer(config)
        
        X_train, y_train = trainer.prepare_training_data('intents.json')
        
        model, model_data = trainer.train(X_train, y_train)
        
        output_file = Path("data.pth")
        torch.save(model_data, output_file)
        logger.info(f"Training complete. Model saved to {output_file}")
        
    except Exception as e:
        logger.error(f"Training failed: {str(e)}")
        raise

if __name__ == "__main__":
    main()