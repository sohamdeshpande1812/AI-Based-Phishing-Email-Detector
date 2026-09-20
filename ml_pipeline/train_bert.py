"""
Transformer / BERT Fine-Tuning Pipeline
Sequence Classification using Hugging Face & PyTorch with GPU Acceleration
"""

import os
import time
import argparse
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    get_linear_schedule_with_warmup
)
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix
)

DATA_PROCESSED_DIR = os.path.join("data", "processed")
SAVED_MODELS_DIR = "saved_models"
BERT_OUTPUT_DIR = os.path.join(SAVED_MODELS_DIR, "bert_phishing")

class TransformerEmailDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=256):
        self.encodings = tokenizer(
            texts,
            truncation=True,
            padding=True,
            max_length=max_len,
            return_tensors="pt"
        )
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx], dtype=torch.long)
        return item

def get_directory_size_mb(directory):
    total = 0
    for dirpath, _, filenames in os.walk(directory):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            total += os.path.getsize(fp)
    return total / (1024 * 1024)

def train_bert(
    model_name="distilbert-base-uncased",
    epochs=2,
    batch_size=32,
    lr=2e-5,
    max_len=256,
    train_subset_limit=None
):
    os.makedirs(BERT_OUTPUT_DIR, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[+] Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})")
    
    train_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "train.csv"))
    val_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "val.csv"))
    test_df = pd.read_csv(os.path.join(DATA_PROCESSED_DIR, "test.csv"))
    
    if train_subset_limit and train_subset_limit < len(train_df):
        print(f"[!] Using subset of {train_subset_limit:,} training samples for rapid Transformer fine-tuning...")
        train_df = train_df.sample(n=train_subset_limit, random_state=42).reset_index(drop=True)
        val_df = val_df.sample(n=min(500, len(val_df)), random_state=42).reset_index(drop=True)
        test_df = test_df.sample(n=min(1000, len(test_df)), random_state=42).reset_index(drop=True)
        
    train_texts = train_df['FullText'].fillna('').tolist()
    y_train = train_df['Label'].values
    val_texts = val_df['FullText'].fillna('').tolist()
    y_val = val_df['Label'].values
    test_texts = test_df['FullText'].fillna('').tolist()
    y_test = test_df['Label'].values
    
    print(f"\n[+] Loading pre-trained tokenizer: {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    
    print("[+] Tokenizing and preparing PyTorch DataLoaders...")
    train_dataset = TransformerEmailDataset(train_texts, y_train, tokenizer, max_len=max_len)
    val_dataset = TransformerEmailDataset(val_texts, y_val, tokenizer, max_len=max_len)
    test_dataset = TransformerEmailDataset(test_texts, y_test, tokenizer, max_len=max_len)
    
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)
    
    print(f"[+] Loading Pretrained Model: {model_name} with classification head...")
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name,
        num_labels=2
    ).to(device)
    
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr, weight_decay=0.01)
    total_steps = len(train_loader) * epochs
    scheduler = get_linear_schedule_with_warmup(
        optimizer,
        num_warmup_steps=int(total_steps * 0.1),
        num_training_steps=total_steps
    )
    
    scaler = torch.amp.GradScaler('cuda') if torch.cuda.is_available() else None
    best_val_f1 = 0.0
    start_train_time = time.time()
    
    print(f"\n[+] Starting {model_name} Fine-Tuning ({epochs} epochs, {len(train_loader)} batches/epoch)...")
    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        
        for batch_idx, batch in enumerate(train_loader):
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            optimizer.zero_grad()
            if scaler:
                with torch.amp.autocast('cuda'):
                    outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
                    loss = outputs.loss
                scaler.scale(loss).backward()
                scaler.unscale_(optimizer)
                torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                scaler.step(optimizer)
                scaler.update()
            else:
                outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
                loss = outputs.loss
                loss.backward()
                torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                optimizer.step()
                
            scheduler.step()
            total_loss += loss.item()
            
            if (batch_idx + 1) % 100 == 0 or (batch_idx + 1) == len(train_loader):
                print(f"    Epoch {epoch}/{epochs} | Step {batch_idx+1}/{len(train_loader)} | Batch Loss: {loss.item():.4f}")
                
        # Validation
        model.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for batch in val_loader:
                input_ids = batch['input_ids'].to(device)
                attention_mask = batch['attention_mask'].to(device)
                labels = batch['labels']
                outputs = model(input_ids=input_ids, attention_mask=attention_mask)
                probs = torch.softmax(outputs.logits, dim=1)[:, 1].cpu().numpy()
                val_preds.extend(probs)
                val_targets.extend(labels.numpy())
                
        val_preds = np.array(val_preds)
        val_f1 = f1_score(val_targets, (val_preds >= 0.5).astype(int))
        val_acc = accuracy_score(val_targets, (val_preds >= 0.5).astype(int))
        print(f"    --> Epoch {epoch} Validation: Acc={val_acc*100:.2f}%, F1={val_f1*100:.2f}%")
        
        if val_f1 > best_val_f1:
            best_val_f1 = val_f1
            print(f"    [*] Saving best model checkpoint to {BERT_OUTPUT_DIR}...")
            model.save_pretrained(BERT_OUTPUT_DIR)
            tokenizer.save_pretrained(BERT_OUTPUT_DIR)
            
    train_duration = time.time() - start_train_time
    print(f"\n[DONE] BERT Fine-tuning completed in {train_duration:.2f} seconds.")
    
    # Evaluate best model on test set
    print("[+] Evaluating fine-tuned BERT on test set...")
    best_model = AutoModelForSequenceClassification.from_pretrained(BERT_OUTPUT_DIR).to(device)
    best_model.eval()
    
    test_probs = []
    start_infer = time.time()
    with torch.no_grad():
        for batch in test_loader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            outputs = best_model(input_ids=input_ids, attention_mask=attention_mask)
            probs = torch.softmax(outputs.logits, dim=1)[:, 1].cpu().numpy()
            test_probs.extend(probs)
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
    model_size_mb = get_directory_size_mb(BERT_OUTPUT_DIR)
    
    print("\n--- BERT TEST METRICS ---")
    print(f"Accuracy:        {acc*100:.2f}%")
    print(f"Precision:       {prec*100:.2f}%")
    print(f"Recall:          {rec*100:.2f}%")
    print(f"F1-Score:        {f1*100:.2f}%")
    print(f"ROC-AUC:         {roc_auc:.4f}")
    print(f"Avg Latency:     {latency_ms:.3f} ms / email")
    print(f"Confusion Matrix:\n{cm}")
    print(f"Model Folder Size: {model_size_mb:.2f} MB")
    
    return {
        "model": "BERT",
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
    parser = argparse.ArgumentParser(description="Fine-tune BERT for Phishing Detection")
    parser.add_argument("--model_name", type=str, default="distilbert-base-uncased")
    parser.add_argument("--epochs", type=int, default=1)
    parser.add_argument("--batch_size", type=int, default=16)
    parser.add_argument("--max_len", type=int, default=128)
    parser.add_argument("--subset", type=int, default=None)
    args = parser.parse_args()
    train_bert(
        model_name=args.model_name,
        epochs=args.epochs,
        batch_size=args.batch_size,
        max_len=args.max_len,
        train_subset_limit=args.subset
    )
