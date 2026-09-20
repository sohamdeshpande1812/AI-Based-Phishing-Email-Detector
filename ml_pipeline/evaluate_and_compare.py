"""
Comprehensive Comparative Evaluation Suite
Evaluates Random Forest, Bi-LSTM, and BERT on the Identical Test Set
Generates Metrics, Confusion Matrices, ROC Curves, and Benchmark JSON/CSV
"""

import os
import sys
import json
import time

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, confusion_matrix,
    roc_curve, precision_recall_curve
)

from ml_pipeline.train_random_forest import PhishingRFModel, extract_meta_features
from ml_pipeline.train_bilstm import BiLSTMClassifier, Vocabulary, EmailDataset
from torch.utils.data import DataLoader

DATA_PROCESSED_DIR = os.path.join("data", "processed")
SAVED_MODELS_DIR = "saved_models"
RESULTS_DIR = "evaluation_results"

RF_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "random_forest_pipeline.joblib")
BILSTM_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "bilstm_model.pt")
BILSTM_VOCAB_PATH = os.path.join(SAVED_MODELS_DIR, "bilstm_vocab.json")
BERT_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "bert_phishing")

def get_dir_size_mb(path):
    if os.path.isfile(path):
        return os.path.getsize(path) / (1024 * 1024)
    total = 0
    for root, _, files in os.walk(path):
        for f in files:
            total += os.path.getsize(os.path.join(root, f))
    return total / (1024 * 1024)

def evaluate_rf(test_texts, y_test):
    print("\n[+] Evaluating Model 1: Random Forest...")
    if not os.path.exists(RF_MODEL_PATH):
        print("    [!] Random Forest model file not found.")
        return None
    
    rf_pipeline = joblib.load(RF_MODEL_PATH)
    
    # Warmup
    _ = rf_pipeline.predict_proba(test_texts[:10])
    
    start_time = time.time()
    probs = rf_pipeline.predict_proba(test_texts)[:, 1]
    total_time = time.time() - start_time
    
    preds = (probs >= 0.5).astype(int)
    latency_ms = (total_time / len(test_texts)) * 1000
    model_size = get_dir_size_mb(RF_MODEL_PATH)
    
    return {
        "name": "Random Forest (Baseline ML)",
        "id": "rf",
        "probs": probs,
        "preds": preds,
        "latency_ms": latency_ms,
        "model_size_mb": model_size
    }

def evaluate_bilstm(test_texts, y_test, device):
    print("\n[+] Evaluating Model 2: Bi-LSTM...")
    if not os.path.exists(BILSTM_MODEL_PATH) or not os.path.exists(BILSTM_VOCAB_PATH):
        print("    [!] Bi-LSTM model or vocab file not found.")
        return None
        
    vocab = Vocabulary.load(BILSTM_VOCAB_PATH)
    checkpoint = torch.load(BILSTM_MODEL_PATH, map_location=device, weights_only=False)
    
    model = BiLSTMClassifier(
        vocab_size=checkpoint['vocab_size'],
        embed_dim=checkpoint['embed_dim'],
        hidden_dim=checkpoint['hidden_dim'],
        num_layers=2
    ).to(device)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    dataset = EmailDataset(test_texts, y_test, vocab, max_len=checkpoint.get('max_len', 200))
    loader = DataLoader(dataset, batch_size=64, shuffle=False)
    
    # Warmup
    with torch.no_grad():
        for b_x, _ in loader:
            _ = model(b_x.to(device))
            break
            
    start_time = time.time()
    probs = []
    with torch.no_grad():
        for b_x, _ in loader:
            logits = model(b_x.to(device))
            p = torch.sigmoid(logits).cpu().numpy()
            probs.extend(p)
    total_time = time.time() - start_time
    
    probs = np.array(probs)
    preds = (probs >= 0.5).astype(int)
    latency_ms = (total_time / len(test_texts)) * 1000
    model_size = get_dir_size_mb(BILSTM_MODEL_PATH)
    
    return {
        "name": "Bi-LSTM (Deep Learning)",
        "id": "bilstm",
        "probs": probs,
        "preds": preds,
        "latency_ms": latency_ms,
        "model_size_mb": model_size
    }

def evaluate_bert(test_texts, y_test, device):
    print("\n[+] Evaluating Model 3: BERT / DistilBERT...")
    if not os.path.exists(BERT_MODEL_PATH):
        print("    [!] BERT model directory not found.")
        return None
        
    tokenizer = AutoTokenizer.from_pretrained(BERT_MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(BERT_MODEL_PATH).to(device)
    model.eval()
    
    # Tokenize in batches to avoid GPU OOM
    batch_size = 32
    probs = []
    
    # Warmup
    inputs = tokenizer(test_texts[:2], return_tensors="pt", truncation=True, padding=True).to(device)
    with torch.no_grad():
        _ = model(**inputs)
        
    start_time = time.time()
    with torch.no_grad():
        for i in range(0, len(test_texts), batch_size):
            batch_texts = test_texts[i:i + batch_size]
            encoded = tokenizer(batch_texts, return_tensors="pt", truncation=True, padding=True, max_length=256).to(device)
            outputs = model(**encoded)
            p = torch.softmax(outputs.logits, dim=1)[:, 1].cpu().numpy()
            probs.extend(p)
    total_time = time.time() - start_time
    
    probs = np.array(probs)
    preds = (probs >= 0.5).astype(int)
    latency_ms = (total_time / len(test_texts)) * 1000
    model_size = get_dir_size_mb(BERT_MODEL_PATH)
    
    return {
        "name": "BERT (Transformer SOTA)",
        "id": "bert",
        "probs": probs,
        "preds": preds,
        "latency_ms": latency_ms,
        "model_size_mb": model_size
    }

def run_comparative_evaluation(eval_samples=2000):
    os.makedirs(RESULTS_DIR, exist_ok=True)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[+] Using Evaluation Device: {device}")
    
    test_path = os.path.join(DATA_PROCESSED_DIR, "test.csv")
    if not os.path.exists(test_path):
        raise FileNotFoundError("test.csv not found. Run prepare_data.py first.")
        
    test_df = pd.read_csv(test_path)
    if eval_samples and eval_samples < len(test_df):
        print(f"[!] Sampling {eval_samples:,} held-out test emails for synchronized multi-model benchmark...")
        test_df = test_df.sample(n=eval_samples, random_state=42).reset_index(drop=True)
        
    test_texts = test_df['FullText'].fillna('').tolist()
    y_test = test_df['Label'].values
    print(f"[+] Evaluating on {len(test_texts):,} test samples from {test_path}")
    
    eval_results = []
    for fn in [
        lambda: evaluate_rf(test_texts, y_test),
        lambda: evaluate_bilstm(test_texts, y_test, device),
        lambda: evaluate_bert(test_texts, y_test, device)
    ]:
        res = fn()
        if res is not None:
            eval_results.append(res)
            
    if not eval_results:
        print("[!] No trained models found for evaluation.")
        return
        
    # Compute detailed metrics
    metrics_summary = []
    roc_data = {}
    pr_data = {}
    cm_data = {}
    
    for item in eval_results:
        probs = item["probs"]
        preds = item["preds"]
        
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, zero_division=0)
        rec = recall_score(y_test, preds, zero_division=0)
        f1 = f1_score(y_test, preds, zero_division=0)
        roc_auc = roc_auc_score(y_test, probs)
        pr_auc = average_precision_score(y_test, probs)
        
        cm = confusion_matrix(y_test, preds)
        tn, fp, fn_count, tp = cm.ravel()
        
        fpr = fp / (fp + tn) if (fp + tn) > 0 else 0.0
        fnr = fn_count / (fn_count + tp) if (fn_count + tp) > 0 else 0.0
        specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
        
        # ROC and PR curves
        fpr_arr, tpr_arr, _ = roc_curve(y_test, probs)
        p_arr, r_arr, _ = precision_recall_curve(y_test, probs)
        
        roc_data[item["name"]] = (fpr_arr, tpr_arr, roc_auc)
        pr_data[item["name"]] = (r_arr, p_arr, pr_auc)
        cm_data[item["name"]] = cm
        
        metrics_summary.append({
            "model_id": item["id"],
            "model_name": item["name"],
            "accuracy": round(float(acc) * 100, 2),
            "precision": round(float(prec) * 100, 2),
            "recall": round(float(rec) * 100, 2),
            "f1_score": round(float(f1) * 100, 2),
            "roc_auc": round(float(roc_auc), 4),
            "pr_auc": round(float(pr_auc), 4),
            "specificity": round(float(specificity) * 100, 2),
            "false_positive_rate": round(float(fpr) * 100, 2),
            "false_negative_rate": round(float(fnr) * 100, 2),
            "latency_ms": round(float(item["latency_ms"]), 2),
            "model_size_mb": round(float(item["model_size_mb"]), 2),
            "confusion_matrix": {
                "true_negative": int(tn),
                "false_positive": int(fp),
                "false_negative": int(fn_count),
                "true_positive": int(tp)
            }
        })
        
    # Save JSON and CSV
    df_metrics = pd.DataFrame(metrics_summary)
    csv_path = os.path.join(RESULTS_DIR, "model_comparison.csv")
    json_path = os.path.join(RESULTS_DIR, "model_comparison.json")
    
    df_metrics.to_csv(csv_path, index=False)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump({
            "dataset": "Zero-Day Phishing Emails Corpus",
            "test_samples": len(test_texts),
            "models": metrics_summary,
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }, f, indent=2)
        
    print(f"\n[DONE] Evaluation summary exported:")
    print(f"    - {csv_path}")
    print(f"    - {json_path}")
    print("\n" + df_metrics[["model_name", "accuracy", "precision", "recall", "f1_score", "roc_auc", "latency_ms"]].to_string(index=False))
    
    # 1. Plot Confusion Matrices
    plt.figure(figsize=(15, 4.5))
    for i, (name, cm) in enumerate(cm_data.items(), 1):
        plt.subplot(1, len(cm_data), i)
        sns.heatmap(cm, annot=True, fmt=",d", cmap="Blues", cbar=False,
                    xticklabels=["Legit (0)", "Phish (1)"],
                    yticklabels=["Legit (0)", "Phish (1)"])
        plt.title(f"{name}\nConfusion Matrix", fontsize=11, fontweight="bold")
        plt.xlabel("Predicted Label")
        plt.ylabel("Actual Label")
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, "confusion_matrices.png"), dpi=200)
    plt.close()
    
    # 2. Plot ROC Curves
    plt.figure(figsize=(8, 6))
    for name, (fpr_arr, tpr_arr, auc_val) in roc_data.items():
        plt.plot(fpr_arr, tpr_arr, lw=2, label=f"{name} (AUC = {auc_val:.4f})")
    plt.plot([0, 1], [0, 1], color="gray", linestyle="--", lw=1.5, label="Random Guess (AUC = 0.5000)")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("False Positive Rate (FPR)", fontsize=11)
    plt.ylabel("True Positive Rate (Recall)", fontsize=11)
    plt.title("ROC Curves Comparison - Zero-Day Phishing Detection", fontsize=13, fontweight="bold")
    plt.legend(loc="lower right", frameon=True)
    plt.grid(alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, "roc_curves.png"), dpi=200)
    plt.close()
    
    # 3. Grouped Metrics Comparison Bar Chart
    metrics_to_plot = ["accuracy", "precision", "recall", "f1_score"]
    x = np.arange(len(metrics_to_plot))
    width = 0.25
    plt.figure(figsize=(10, 5.5))
    
    for idx, row in df_metrics.iterrows():
        vals = [row[m] for m in metrics_to_plot]
        plt.bar(x + idx * width, vals, width, label=row["model_name"])
        
    plt.xlabel("Evaluation Metric", fontsize=11)
    plt.ylabel("Score (%)", fontsize=11)
    plt.title("Performance Comparison Across Architectures", fontsize=13, fontweight="bold")
    plt.xticks(x + width * (len(df_metrics) - 1) / 2, ["Accuracy", "Precision", "Recall", "F1-Score"])
    plt.ylim([70, 102])
    plt.legend(frameon=True)
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.savefig(os.path.join(RESULTS_DIR, "metrics_comparison.png"), dpi=200)
    plt.close()
    
    print(f"[DONE] Visualizations saved in '{RESULTS_DIR}/'.")

if __name__ == "__main__":
    run_comparative_evaluation()
