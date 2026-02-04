import os
import json
import nltk
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

################################
# PATH SETUP (IMPORTANT)
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
# LOAD INTENTS
################################
with open(INTENTS_PATH, "r", encoding="utf-8") as f:
    intents = json.load(f)

all_words = []
tags = []
xy = []

for intent in intents["intents"]:
    tag = intent["tag"]
    tags.append(tag)

    for pattern in intent["patterns"]:
        w = tokenize(pattern)
        all_words.extend(w)
        xy.append((w, tag))

ignore_words = ["?", "!", ".", ","]
all_words = [stem(w) for w in all_words if w not in ignore_words]
all_words = sorted(set(all_words))
tags = sorted(set(tags))

X_train = []
y_train = []

for (pattern_sentence, tag) in xy:
    X_train.append(bag_of_words(pattern_sentence, all_words))
    y_train.append(tags.index(tag))

X_train = np.array(X_train)
y_train = np.array(y_train)

################################
# DATASET
################################
class ChatDataset(Dataset):
    def __init__(self):
        self.x_data = X_train
        self.y_data = y_train
        self.n_samples = len(self.x_data)

    def __getitem__(self, index):
        return self.x_data[index], self.y_data[index]

    def __len__(self):
        return self.n_samples

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
# TRAINING
################################
batch_size = 8
hidden_size = 8
learning_rate = 0.001
num_epochs = 1000

input_size = len(all_words)
output_size = len(tags)

dataset = ChatDataset()
train_loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = NeuralNet(input_size, hidden_size, output_size).to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

for epoch in range(num_epochs):
    for words, labels in train_loader:
        words = words.to(device)
        labels = labels.to(device)

        outputs = model(words)
        loss = criterion(outputs, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

    if (epoch + 1) % 100 == 0:
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}")

################################
# SAVE MODEL
################################
torch.save({
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}, MODEL_PATH)

print("✅ Training complete.")
print("📦 Model saved at:", MODEL_PATH)
