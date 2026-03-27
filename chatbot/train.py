"""Training module for the Agora chatbot neural network model.

This module trains a neural network classifier on intent-based patterns from a JSON
configuration file. It processes natural language inputs into bag-of-words
representations and trains the model to classify user messages into predefined intents.

The trained model state and vocabulary are saved to a PyTorch file for later use in
the Flask API.
"""

import numpy as np
import random
import json

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
import nltk
nltk.download('punkt')


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



with open('intents.json', 'r') as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []
# loop through each sentence in our intents patterns
for intent in intents['intents']:
    tag = intent['tag']
    # add to tag list
    tags.append(tag)
    for pattern in intent['patterns']:
        # tokenize each word in the sentence
        w = tokenize(pattern)
        # add to our words list
        all_words.extend(w)
        # add to xy pair
        xy.append((w, tag))

# stem and lower each word
ignore_words = ['?', '.', '!']
all_words = [stem(w) for w in all_words if w not in ignore_words]
# remove duplicates and sort
all_words = sorted(set(all_words))
tags = sorted(set(tags))

print(len(xy), "patterns")
print(len(tags), "tags:", tags)
print(len(all_words), "unique stemmed words:", all_words)

# create training data
X_train = []
y_train = []
for (pattern_sentence, tag) in xy:
    # X: bag of words for each pattern_sentence
    bag = bag_of_words(pattern_sentence, all_words)
    X_train.append(bag)
    # y: PyTorch CrossEntropyLoss needs only class labels, not one-hot
    label = tags.index(tag)
    y_train.append(label)

X_train = np.array(X_train)
y_train = np.array(y_train)

# Hyper-parameters 
num_epochs = 1000
batch_size = 8
learning_rate = 0.001
input_size = len(X_train[0])
hidden_size = 8
output_size = len(tags)
print(input_size, output_size)

class ChatDataset(Dataset):
    """PyTorch Dataset for chatbot training data.
    
    Wraps the preprocessed training data (bag-of-words features and intent labels)
    into a format compatible with PyTorch DataLoader.
    """

    def __init__(self):
        """Initialize the dataset with global training data."""
        self.n_samples = len(X_train)
        self.x_data = X_train
        self.y_data = y_train

    def __getitem__(self, index):
        """Retrieve a single training sample.
        
        Args:
            index (int): Index of the sample to retrieve.
            
        Returns:
            tuple: (feature_tensor, label) where feature_tensor is a bag-of-words
                   vector and label is the intent class index.
        """
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        """Return the total number of samples in the dataset.
        
        Returns:
            int: Number of training samples.
        """
        return self.n_samples

dataset = ChatDataset()
train_loader = DataLoader(dataset=dataset,
                          batch_size=batch_size,
                          shuffle=True,
                          num_workers=0)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

model = NeuralNet(input_size, hidden_size, output_size).to(device)

# Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

# Train the model
for epoch in range(num_epochs):
    for (words, labels) in train_loader:
        words = words.to(device)
        labels = labels.to(dtype=torch.long).to(device)
        
        # Forward pass
        outputs = model(words)
        # if y would be one-hot, we must apply
        # labels = torch.max(labels, 1)[1]
        loss = criterion(outputs, labels)
        
        # Backward and optimize
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 100 == 0:
        print (f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')


print(f'final loss: {loss.item():.4f}')

data = {
"model_state": model.state_dict(),
"input_size": input_size,
"hidden_size": hidden_size,
"output_size": output_size,
"all_words": all_words,
"tags": tags
}

FILE = "data.pth"
torch.save(data, FILE)

print(f'training complete. file saved to {FILE}')
