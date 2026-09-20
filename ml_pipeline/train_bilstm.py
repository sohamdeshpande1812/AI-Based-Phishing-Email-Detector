"""
Bidirectional LSTM (Bi-LSTM) Deep Learning Pipeline
Sequence Classification using PyTorch with Word Embeddings
"""

import os
import re
import json
import time
import argparse
from collections import Counter
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

DATA_PROCESSED_DIR = os.path.join("data", "processed")
SAVED_MODELS_DIR = "saved_models"
MODEL_FILE = os.path.join(SAVED_MODELS_DIR, "bilstm_model.pt")
VOCAB_FILE = os.path.join(SAVED_MODELS_DIR, "bilstm_vocab.json")

def simple_tokenize(text):
    """Tokenizes text into lowercase word tokens."""
    return re.findall(r"\b\w+\b|\[URL\]", str(text).lower())

class Vocabulary:
    def __init__(self, max_size=25000, min_freq=2):
        self.max_size = max_size
        self.min_freq = min_freq
        self.word2idx = {"<pad>": 0, "<unk>": 1}
        self.idx2word = {0: "<pad>", 1: "<unk>"}

    def build_vocab(self, texts):
        print(f"[+] Building vocabulary from {len(texts):,} training texts...")
        counter = Counter()
        for t in texts:
            counter.update(simple_tokenize(t))
        
        words = [w for w, c in counter.most_common(self.max_size - 2) if c >= self.min_freq]
        for idx, w in enumerate(words, start=2):
            self.word2idx[w] = idx
            self.idx2word[idx] = w
        print(f"[DONE] Vocabulary constructed with {len(self.word2idx):,} tokens.")

    def encode(self, text, max_len=200):
        tokens = simple_tokenize(text)
        unk_idx = self.word2idx["<unk>"]
        ids = [self.word2idx.get(tok, unk_idx) for tok in tokens[:max_len]]
        if len(ids) < max_len:
            ids += [0] * (max_len - len(ids))
        return ids

    def save(self, filepath):
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump({"word2idx": self.word2idx, "max_size": self.max_size}, f)

    @classmethod
    def load(cls, filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
        vocab = cls(max_size=data.get("max_size", 25000))
        vocab.word2idx = data["word2idx"]
        vocab.idx2word = {int(v): k for k, v in vocab.word2idx.items()}
        return vocab

class EmailDataset(Dataset):
    def __init__(self, texts, labels, vocab, max_len=200):
        self.encoded = [vocab.encode(t, max_len=max_len) for t in texts]
        self.labels = labels

    def __len__(self):
        return len(self.encoded)

    def __getitem__(self, idx):
        return (
            torch.tensor(self.encoded[idx], dtype=torch.long),
            torch.tensor(self.labels[idx], dtype=torch.float32)
        )

class BiLSTMClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim=128, hidden_dim=128, num_layers=2, dropout=0.3):
        super(BiLSTMClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        self.embed_dropout = nn.Dropout(p=dropout)
        self.lstm = nn.LSTM(
            embed_dim,
            hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            bidirectional=True,
            dropout=dropout if num_layers > 1 else 0.0
        )
        # Bidirectional output -> hidden_dim * 2. Concat avg + max pool -> hidden_dim * 4
        self.fc = nn.Sequential(
            nn.Linear(hidden_dim * 4, 64),
            nn.ReLU(),
            nn.Dropout(p=dropout),
            nn.Linear(64, 1)
        )

    def forward(self, x):
        embedded = self.embed_dropout(self.embedding(x))
        lstm_out, _ = self.lstm(embedded)  # (batch, seq_len, hidden_dim * 2)
        
        # Global Average & Max Pooling across sequence length
        avg_pool = torch.mean(lstm_out, dim=1)
        max_pool, _ = torch.max(lstm_out, dim=1)
        pooled = torch.cat([avg_pool, max_pool], dim=1)  # (batch, hidden_dim * 4)
        
        logits = self.fc(pooled).squeeze(1)
        return logits

def train_bilstm(epochs=4, batch_size=64, embed_dim=128, hidden_dim=128, lr=1e-3, max_len=200):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[+] Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")
    
    train_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "train.csv"))
    val_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "val.csv"))
    test_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "test.csv"))
    
    train_texts = train_df['FullText'].fillna('').tolist()
    y_train = train_df['Label'].values
    val_texts = val_df['FullText'].fillna('').tolist()
    y_val = val_df['Label'].values
    test_texts = test_df['FullText'].fillna('').tolist()
    y_test = test_df['Label'].values
    
    # Build vocabulary on training set only
    vocab = Vocabulary(max_size=25000, min_freq=2)
    vocab.build_vocab(train_texts)
    vocab.save(VOCAB_FILE)
    
    # Datasets & DataLoaders
    print("[+] Encoding datasets...")
    train_dataset = EmailDataset(train_texts, y_train, vocab, max_len=max_len)
    val_dataset = EmailDataset(val_texts, y_val, vocab, max_len=max_len)
    test_dataset = EmailDataset(test_texts, y_test, vocab, max_len=max_len)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    model = BiLSTMClassifier(
        vocab_size=len(vocab.word2idx),
        embed_dim=embed_dim,
        hidden_dim=hidden_dim,
        num_layers=2,
        dropout=0.3
    ).to(device)
    
    criterion = nn.BCEWithLogitsLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)
    
    best_val_f1 = 0.0
    start_train_time = time.time()
    
    print("\n[+] Starting Bi-LSTM Training...")
    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            logits = model(batch_x)
            loss = criterion(logits, batch_y)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            total_loss += loss.item() * batch_x.size(0)
            
        train_loss = total_loss / len(train_dataset)
        
        # Validation
        model.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for batch_x, batch_y in val_loader:
                batch_x = batch_x.to(device)
                logits = model(batch_x)
                probs = torch.sigmoid(logits).cpu().numpy()
                val_preds.extend(probs)
                val_targets.extend(batch_y.numpy())
                
        val_preds = np.array(val_preds)
        val_f1 = f1_score(val_targets, (val_preds >= 0.5).astype(int))
        val_acc = accuracy_score(val_targets, (val_preds >= 0.5).astype(int))
        
        print(f"    Epoch {epoch}/{epochs} | Train Loss: {train_loss:.4f} | Val Acc: {val_acc*100:.2f}% | Val F1: {val_f1*100:.2f}%")
        
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            torch.save({
                'model_state_dict': model.state_dict(),
                'vocab_size': len(vocab.word2idx),
                'embed_dim': embed_dim,
                'hidden_dim': hidden_dim,
                'max_len': max_len
            }, MODEL_FILE)
            print(f"    [*] Checkpoint saved: New best Val F1 = {val_f1*100:.2f}%")
            
    train_duration = time.time() - start_train_time
    print(f"\n[DONE] Bi-LSTM training completed in {train_duration:.2f} seconds.")
    
    # Final Test Set Evaluation
    checkpoint = torch.load(MODEL_FILE, map_location=device, weights_only=False)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    start_infer = time.time()
    test_probs = []
    with torch.no_grad():
        for batch_x, _ in test_loader:
            batch_x = batch_x.to(device)
            logits = model(batch_x)
            test_probs.extend(torch.sigmoid(logits).cpu().numpy())
    total_infer_time = time.time() - start_infer
    
    test_probs = np.array(test_probs)
    y_pred = (test_probs >= 0.5).astype(int)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, test_probs)
    cm = confusion_matrix(y_test, y_pred)
    latency_ms = (total_infer_time / len(y_test)) * 1000
    model_size_mb = os.path.getsize(MODEL_FILE) / (1024 * 1024)
    
    print("\n--- BI-LSTM TEST METRICS ---")
    print(f"Accuracy:        {acc*100:.2f}%")
    print(f"Precision:       {prec*100:.2f}%")
    print(f"Recall:          {rec*100:.2f}%")
    print(f"F1-Score:        {f1*100:.2f}%")
    print(f"ROC-AUC:         {roc_auc:.4f}")
    print(f"Avg Latency:     {latency_ms:.3f} ms / email")
    print(f"Confusion Matrix:\n{cm}")
    print(f"Model File Size: {model_size_mb:.2f} MB")
    
    return {
        "model": "Bi-LSTM",
        "accuracy": float(acc),
        "precision": float(prec),
        "recall": float(rec),
        "f1_score": float(f1),
        "roc_auc": float(roc_auc),
        "latency_ms": float(latency_ms),
        "model_size_mb": float(model_size_mb),
        "train_time_sec": float(train_duration)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train Bi-LSTM Classifier for Phishing Detection")
    parser.add_argument("--epochs", type=int, default=4)
    parser.add_argument("--batch_size", type=int, default=64)
    args = parser.parse_args()
    train_bilstm(epochs=args.epochs, batch_size=args.batch_size)
