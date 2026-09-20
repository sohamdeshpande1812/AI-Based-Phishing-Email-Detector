"""
Random Forest Model Training and Evaluation Pipeline
Baseline Machine Learning Model with TF-IDF + Meta-Feature Extraction
"""

import os
import re
import time
import argparse
import joblib
import numpy as np
import pandas as pd
from scipy.sparse import hstack, csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

DATA_PROCESSED_DIR = os.path.join("data", "processed")
SAVED_MODELS_DIR = "saved_models"
MODEL_FILE = os.path.join(SAVED_MODELS_DIR, "random_forest_pipeline.joblib")

URGENCY_KEYWORDS = [
    "urgent", "immediately", "immediate", "suspended", "lock", "locked",
    "unauthorized", "verify", "action required", "compromised", "security alert",
    "password", "expire", "expiration", "terminate", "risk", "attention"
]

def extract_meta_features(texts):
    """
    Extracts numerical metadata cues from raw email text:
    - Character count
    - Word count
    - Average word length
    - Uppercase character ratio
    - Exclamation mark count
    - Question mark count
    - Digit count
    - URL token count ([URL] or links)
    - Urgency cue count
    """
    feats = []
    for text in texts:
        t = str(text)
        length = len(t)
        words = t.split()
        num_words = max(1, len(words))
        
        avg_word_len = length / num_words
        upper_ratio = sum(1 for c in t if c.isupper()) / max(1, length)
        exclamation_count = t.count('!')
        question_count = t.count('?')
        digit_count = sum(1 for c in t if c.isdigit())
        url_token_count = t.count('[URL]') + t.count('http://') + t.count('https://')
        
        lower_t = t.lower()
        urgency_count = sum(1 for kw in URGENCY_KEYWORDS if kw in lower_t)
        
        feats.append([
            length,
            num_words,
            avg_word_len,
            upper_ratio,
            exclamation_count,
            question_count,
            digit_count,
            url_token_count,
            urgency_count
        ])
    return np.array(feats, dtype=np.float32)

class PhishingRFModel:
    def __init__(self, tfidf_vectorizer, meta_scaler_mean, meta_scaler_std, rf_model):
        self.vectorizer = tfidf_vectorizer
        self.meta_mean = meta_scaler_mean
        self.meta_std = meta_scaler_std
        self.rf = rf_model

    def featurize(self, texts):
        X_tfidf = self.vectorizer.transform(texts)
        X_meta = extract_meta_features(texts)
        # Standardize meta features
        X_meta_norm = (X_meta - self.meta_mean) / (self.meta_std + 1e-7)
        return hstack([X_tfidf, csr_matrix(X_meta_norm)])

    def predict_proba(self, texts):
        X = self.featurize(texts)
        return self.rf.predict_proba(X)

    def predict(self, texts):
        X = self.featurize(texts)
        return self.rf.predict(X)

def train_rf(n_estimators=100, max_depth=35, max_features=10000, random_state=42):
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    
    train_path = os.path.join(DATA_PROCESSED_DIR, "train.csv")
    test_path = os.path.join(DATA_PROCESSED_DIR, "test.csv")
    
    if not os.path.exists(train_path) or not os.path.exists(test_path):
        raise FileNotFoundError("Processed datasets not found. Run prepare_data.py first.")
        
    print("[+] Loading train and test sets...")
    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)
    
    train_texts = train_df['FullText'].fillna('').tolist()
    y_train = train_df['Label'].values
    test_texts = test_df['FullText'].fillna('').tolist()
    y_test = test_df['Label'].values
    
    print(f"    Training samples: {len(train_texts):,}")
    print(f"    Test samples:     {len(test_texts):,}")
    
    # 1. Fit TF-IDF strictly on training texts
    print("\n[+] Fitting TF-IDF Vectorizer (n-grams (1,2), sublinear TF)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        max_features=max_features,
        stop_words='english'
    )
    X_train_tfidf = vectorizer.fit_transform(train_texts)
    X_test_tfidf = vectorizer.transform(test_texts)
    
    # 2. Extract & Standardize Meta-Features (mean/std computed only on train)
    print("[+] Extracting email structure & urgency meta-features...")
    X_train_meta = extract_meta_features(train_texts)
    meta_mean = np.mean(X_train_meta, axis=0)
    meta_std = np.std(X_train_meta, axis=0)
    
    X_train_meta_norm = (X_train_meta - meta_mean) / (meta_std + 1e-7)
    X_test_meta = extract_meta_features(test_texts)
    X_test_meta_norm = (X_test_meta - meta_mean) / (meta_std + 1e-7)
    
    # Combine TF-IDF and normalized meta features
    X_train_all = hstack([X_train_tfidf, csr_matrix(X_train_meta_norm)])
    X_test_all = hstack([X_test_tfidf, csr_matrix(X_test_meta_norm)])
    
    print(f"    Combined feature matrix shape: {X_train_all.shape}")
    
    # 3. Train Random Forest Classifier
    print(f"\n[+] Training Random Forest Classifier (n_estimators={n_estimators}, max_depth={max_depth})...")
    start_train = time.time()
    rf = RandomForestClassifier(
        n_estimators=n_estimators,
        max_depth=max_depth,
        n_jobs=-1,
        random_state=random_state
    )
    rf.fit(X_train_all, y_train)
    train_duration = time.time() - start_train
    print(f"[DONE] Training finished in {train_duration:.2f} seconds.")
    
    # 4. Evaluation
    print("\n[+] Evaluating Random Forest on held-out test split...")
    start_infer = time.time()
    y_pred_proba = rf.predict_proba(X_test_all)[:, 1]
    total_infer_time = time.time() - start_infer
    y_pred = (y_pred_proba >= 0.5).astype(int)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_pred_proba)
    cm = confusion_matrix(y_test, y_pred)
    latency_ms = (total_infer_time / len(y_test)) * 1000
    
    print(f"--- RANDOM FOREST TEST METRICS ---")
    print(f"Accuracy:        {acc*100:.2f}%")
    print(f"Precision:       {prec*100:.2f}%")
    print(f"Recall:          {rec*100:.2f}%")
    print(f"F1-Score:        {f1*100:.2f}%")
    print(f"ROC-AUC:         {roc_auc:.4f}")
    print(f"Avg Latency:     {latency_ms:.3f} ms / email")
    print(f"Confusion Matrix:\n{cm}")
    
    # 5. Save model pipeline
    model_pipeline = PhishingRFModel(vectorizer, meta_mean, meta_std, rf)
    joblib.dump(model_pipeline, MODEL_FILE)
    model_size_mb = os.path.getsize(MODEL_FILE) / (1024 * 1024)
    print(f"\n[DONE] Model pipeline saved to {MODEL_FILE} ({model_size_mb:.2f} MB)")
    
    return {
        "model": "Random Forest",
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
    parser = argparse.ArgumentParser(description="Train Random Forest Baseline for Phishing Detection")
    parser.add_argument("--n_estimators", type=int, default=100)
    parser.add_argument("--max_depth", type=int, default=35)
    args = parser.parse_args()
    train_rf(n_estimators=args.n_estimators, max_depth=args.max_depth)
