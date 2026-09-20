"""
PhishShield AI - Production Python Backend Microservice (FastAPI)
Dynamic Multi-Model Inference Engine: Random Forest | Bi-LSTM | BERT
Zero-Day Phishing Detection & Benchmark Hub
"""

import os
import sys
import time
import json
import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add project root to sys.path so model classes can be unpickled cleanly
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

app = FastAPI(
    title="PhishShield AI Microservice",
    description="Multi-Model Zero-Day Phishing Detection API (Random Forest, Bi-LSTM, BERT)",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
SAVED_MODELS_DIR = os.path.join(PROJECT_ROOT, "saved_models")
RESULTS_DIR = os.path.join(PROJECT_ROOT, "evaluation_results")
RF_PATH = os.path.join(SAVED_MODELS_DIR, "random_forest_pipeline.joblib")
BILSTM_MODEL_PATH = os.path.join(SAVED_MODELS_DIR, "bilstm_model.pt")
BILSTM_VOCAB_PATH = os.path.join(SAVED_MODELS_DIR, "bilstm_vocab.json")
BERT_PATH = os.path.join(SAVED_MODELS_DIR, "bert_phishing")
BENCHMARK_FILE = os.path.join(RESULTS_DIR, "model_comparison.json")

# Model singletons
_RF_MODEL = None
_BILSTM_MODEL = None
_BILSTM_VOCAB = None
_BERT_MODEL = None
_BERT_TOKENIZER = None
_TORCH_DEVICE = None

def get_torch_device():
    global _TORCH_DEVICE
    if _TORCH_DEVICE is None:
        try:
            import torch
            _TORCH_DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        except Exception:
            _TORCH_DEVICE = "cpu"
    return _TORCH_DEVICE

def get_rf_model():
    global _RF_MODEL
    if _RF_MODEL is None and os.path.exists(RF_PATH):
        try:
            import joblib
            import __main__
            from ml_pipeline.train_random_forest import PhishingRFModel, extract_meta_features
            __main__.PhishingRFModel = PhishingRFModel
            __main__.extract_meta_features = extract_meta_features
            _RF_MODEL = joblib.load(RF_PATH)
            print("[+] Loaded Random Forest model successfully.")
        except Exception as e:
            print(f"[!] Error loading Random Forest: {e}")
    return _RF_MODEL

def get_bilstm_model():
    global _BILSTM_MODEL, _BILSTM_VOCAB
    if _BILSTM_MODEL is None and os.path.exists(BILSTM_MODEL_PATH) and os.path.exists(BILSTM_VOCAB_PATH):
        try:
            import torch
            from ml_pipeline.train_bilstm import BiLSTMClassifier, Vocabulary
            device = get_torch_device()
            _BILSTM_VOCAB = Vocabulary.load(BILSTM_VOCAB_PATH)
            checkpoint = torch.load(BILSTM_MODEL_PATH, map_location=device, weights_only=False)
            model = BiLSTMClassifier(
                vocab_size=checkpoint['vocab_size'],
                embed_dim=checkpoint['embed_dim'],
                hidden_dim=checkpoint['hidden_dim'],
                num_layers=2
            ).to(device)
            model.load_state_dict(checkpoint['model_state_dict'])
            model.eval()
            _BILSTM_MODEL = model
            print("[+] Loaded Bi-LSTM model successfully.")
        except Exception as e:
            print(f"[!] Error loading Bi-LSTM: {e}")
    return _BILSTM_MODEL, _BILSTM_VOCAB

def get_bert_model():
    global _BERT_MODEL, _BERT_TOKENIZER
    if _BERT_MODEL is None and os.path.exists(BERT_PATH):
        try:
            import torch
            from transformers import AutoTokenizer, AutoModelForSequenceClassification
            device = get_torch_device()
            _BERT_TOKENIZER = AutoTokenizer.from_pretrained(BERT_PATH)
            _BERT_MODEL = AutoModelForSequenceClassification.from_pretrained(BERT_PATH).to(device)
            _BERT_MODEL.eval()
            print("[+] Loaded BERT model successfully.")
        except Exception as e:
            print(f"[!] Error loading BERT: {e}")
    return _BERT_MODEL, _BERT_TOKENIZER

class EmailPayload(BaseModel):
    sender_name: Optional[str] = ""
    sender_email: Optional[str] = ""
    subject: Optional[str] = ""
    body: str = ""
    urls: Optional[List[str]] = []
    model: Optional[str] = "auto"  # "auto", "rf", "bilstm", "bert", "heuristic"

@app.get("/")
def root():
    return {
        "message": "PhishShield AI Multi-Model Microservice is active",
        "supported_models": ["rf", "bilstm", "bert", "heuristic"]
    }

@app.get("/api/health")
def health_check():
    rf_ready = os.path.exists(RF_PATH)
    bilstm_ready = os.path.exists(BILSTM_MODEL_PATH)
    bert_ready = os.path.exists(BERT_PATH)
    
    return {
        "status": "healthy",
        "device": str(get_torch_device()),
        "models_status": {
            "random_forest": "ready" if rf_ready else "not_trained",
            "bilstm": "ready" if bilstm_ready else "not_trained",
            "bert": "ready" if bert_ready else "not_trained"
        },
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/models")
def list_models():
    """Returns status and metadata for all comparative models."""
    return {
        "active_device": str(get_torch_device()),
        "models": [
            {
                "id": "rf",
                "name": "Random Forest Classifier",
                "architecture": "Classical ML (TF-IDF + Meta-Features)",
                "ready": os.path.exists(RF_PATH),
                "description": "Ultra-fast tree ensemble using n-gram frequencies, structural email cues, and urgency markers."
            },
            {
                "id": "bilstm",
                "name": "Bi-LSTM Neural Network",
                "architecture": "Deep Learning (Bidirectional Recurrent Neural Net)",
                "ready": os.path.exists(BILSTM_MODEL_PATH),
                "description": "Processes sequential word dependencies in both forward and backward directions to detect deceptive context."
            },
            {
                "id": "bert",
                "name": "BERT / DistilBERT",
                "architecture": "Transformer SOTA (Self-Attention Pre-trained LLM)",
                "ready": os.path.exists(BERT_PATH),
                "description": "Self-attention transformer capable of understanding nuanced semantics, intent manipulation, and zero-day phrasing."
            }
        ]
    }

@app.get("/api/benchmark")
def get_benchmark_results():
    """Serves the comparative evaluation benchmark data for the UI."""
    if os.path.exists(BENCHMARK_FILE):
        try:
            with open(BENCHMARK_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error reading benchmark results: {e}")
    else:
        # Fallback placeholder if evaluation script is still running
        return {
            "dataset": "Zero-Day Phishing Emails Corpus",
            "status": "training_or_evaluating",
            "models": []
        }

@app.post("/api/analyze")
def analyze_email(payload: EmailPayload):
    start_time = time.time()
    subject = (payload.subject or "").strip()
    body = payload.body.strip()
    full_text = f"Subject: {subject}\n\n{body}"
    selected_model = (payload.model or "auto").lower()

    # Calculate heuristic cues for threat breakdown
    urgency_keywords = ["urgent", "immediately", "24 hours", "suspended", "locked", "action required", "terminate", "expire", "compromised", "unauthorized"]
    harvest_keywords = ["password", "credentials", "verify your identity", "credit card", "bank", "w-2", "direct deposit", "ssn", "login"]
    text_lower = full_text.lower()
    urgency_count = sum(1 for k in urgency_keywords if k in text_lower)
    harvest_count = sum(1 for k in harvest_keywords if k in text_lower)

    phish_probability = None
    model_used = "Heuristic Analyzer"
    model_badge = "RULE-BASED"

    # 1. BERT
    if selected_model in ["bert", "transformer"] or (selected_model == "auto" and os.path.exists(BERT_PATH)):
        bert_model, bert_tok = get_bert_model()
        if bert_model and bert_tok:
            try:
                import torch
                device = get_torch_device()
                inputs = bert_tok(full_text, return_tensors="pt", truncation=True, max_length=256, padding=True).to(device)
                with torch.no_grad():
                    outputs = bert_model(**inputs)
                    probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]
                    phish_probability = float(probs[1])
                model_used = "BERT (Transformer SOTA)"
                model_badge = "BERT-TRANSFORMER"
            except Exception as e:
                print(f"[!] BERT inference error: {e}")

    # 2. Bi-LSTM
    if phish_probability is None and (selected_model in ["bilstm", "lstm"] or (selected_model == "auto" and os.path.exists(BILSTM_MODEL_PATH))):
        bilstm_model, bilstm_vocab = get_bilstm_model()
        if bilstm_model and bilstm_vocab:
            try:
                import torch
                device = get_torch_device()
                input_ids = torch.tensor([bilstm_vocab.encode(full_text, max_len=200)], dtype=torch.long).to(device)
                with torch.no_grad():
                    logits = bilstm_model(input_ids)
                    phish_probability = float(torch.sigmoid(logits).cpu().numpy()[0])
                model_used = "Bi-LSTM Neural Network"
                model_badge = "BI-LSTM"
            except Exception as e:
                print(f"[!] Bi-LSTM inference error: {e}")

    # 3. Random Forest
    if phish_probability is None and (selected_model in ["rf", "random_forest"] or (selected_model == "auto" and os.path.exists(RF_PATH))):
        rf_pipeline = get_rf_model()
        if rf_pipeline:
            try:
                probs = rf_pipeline.predict_proba([full_text])[0]
                phish_probability = float(probs[1])
                model_used = "Random Forest Classifier"
                model_badge = "RANDOM-FOREST"
            except Exception as e:
                print(f"[!] RF inference error: {e}")

    # 4. Fallback Heuristic
    if phish_probability is None:
        heuristic_score = min(99, max(5, (urgency_count * 25) + (harvest_count * 30)))
        phish_probability = heuristic_score / 100.0
        model_used = "Built-in Threat Heuristic Engine"
        model_badge = "HEURISTIC"

    latency_ms = round((time.time() - start_time) * 1000, 2)
    score_pct = int(round(phish_probability * 100))

    if score_pct >= 70:
        verdict = "phishing"
        verdict_title = "Zero-Day Phishing Threat Detected"
        badge = "HIGH RISK CRITICAL"
    elif score_pct >= 35:
        verdict = "suspicious"
        verdict_title = "Suspicious / Potential Threat"
        badge = "MEDIUM RISK"
    else:
        verdict = "legitimate"
        verdict_title = "Legitimate & Verified Safe"
        badge = "LOW RISK"

    confidence = int(round(abs(phish_probability - 0.5) * 2 * 100))
    confidence = max(60, min(99, confidence))

    return {
        "score": score_pct,
        "phish_probability": round(phish_probability, 4),
        "verdict": verdict,
        "verdictTitle": verdict_title,
        "verdictBadge": badge,
        "confidence": confidence,
        "latency_ms": latency_ms,
        "model_used": model_used,
        "model_badge": model_badge,
        "metrics": {
            "urgencyScore": min(100, urgency_count * 35),
            "harvestingScore": min(100, harvest_count * 40),
            "linksScore": 85 if len(payload.urls or []) > 0 and score_pct > 40 else 10,
            "senderScore": 75 if "@" in (payload.sender_email or "") and score_pct > 40 else 5
        }
    }

if __name__ == "__main__":
    import uvicorn
    print("[+] Starting PhishShield AI Backend on http://localhost:8000 ...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
