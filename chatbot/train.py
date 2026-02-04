import sys, os
import json
import numpy as np
import multiprocessing as mp

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

import nltk
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

################################
# NLP UTILITIES (NO DOWNLOAD HERE)
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
# DATASET
################################
class ChatDataset(Dataset):
    def __init__(self, X, y):
        self.X = X
        self.y = y

    def __getitem__(self, index):
        return self.X[index], self.y[index]

    def __len__(self):
        return len(self.X)

################################
# MAIN FUNCTION
################################
def main():
    # ✅ Download punkt ONCE (safe)
    try:
        nltk.data.find("tokenizers/punkt")
    except LookupError:
        nltk.download("punkt")

    ################################
    # LOAD INTENTS
    ################################
    with open("intents.json", "r") as f:
        intents = json.load(f)

    all_words = []
    tags = []
    xy = []

    for intent in intents["intents"]:
        tag = intent["tag"]
        tags.append(tag)

        for pattern in intent["patterns"]:
            tokens = tokenize(pattern)
            all_words.extend(tokens)
            xy.append((tokens, tag))

    ignore_words = ["?", "!", ".", ","]
    all_words = [stem(w) for w in all_words if w not in ignore_words]
    all_words = sorted(set(all_words))
    tags = sorted(set(tags))

    print(f"{len(xy)} patterns")
    print(f"{len(tags)} tags")
    print(f"{len(all_words)} unique stemmed words")

    ################################
    # TRAINING DATA
    ################################
    X_train = []
    y_train = []

    for (tokens, tag) in xy:
        X_train.append(bag_of_words(tokens, all_words))
        y_train.append(tags.index(tag))

    X_train = np.array(X_train)
    y_train = np.array(y_train)

    ################################
    # HYPERPARAMETERS
    ################################
    num_epochs = 300
    batch_size = 16
    learning_rate = 0.001
    hidden_size = 8
    input_size = len(X_train[0])
    output_size = len(tags)

    ################################
    # DATALOADER (MULTIPROCESSING SAFE)
    ################################
    dataset = ChatDataset(X_train, y_train)
    train_loader = DataLoader(
        dataset=dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers = 0 if sys.platform.startswith("win") else min(4, os.cpu_count())
    )

    ################################
    # TRAINING
    ################################
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = NeuralNet(input_size, hidden_size, output_size).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=learning_rate)

    for epoch in range(num_epochs):
        epoch_loss = 0.0

        for words, labels in train_loader:
            words = words.to(device)
            labels = labels.to(device, dtype=torch.long)

            outputs = model(words)
            loss = criterion(outputs, labels)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()

        if (epoch + 1) % 100 == 0:
            avg_loss = epoch_loss / len(train_loader)
            print(f"Epoch [{epoch+1}/{num_epochs}], Avg Loss: {avg_loss:.4f}")

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
    }, "data.pth")

    print("Training complete. data.pth saved.")

################################
# WINDOWS ENTRY POINT
################################
if __name__ == "__main__":
    mp.freeze_support()
    main()
