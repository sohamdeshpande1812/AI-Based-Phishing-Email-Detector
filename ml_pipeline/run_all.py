"""
Master Orchestration Script for Phishing Detection Pipeline
Prepares data, trains Random Forest, Bi-LSTM, and BERT, and runs evaluation.
"""

import argparse
import sys
import time

from ml_pipeline.prepare_data import run_preparation
from ml_pipeline.train_random_forest import train_rf
from ml_pipeline.train_bilstm import train_bilstm
from ml_pipeline.train_bert import train_bert
from ml_pipeline.evaluate_and_compare import run_comparative_evaluation

def main():
    parser = argparse.ArgumentParser(description="Master ML Training & Evaluation Orchestrator")
    parser.add_argument("--sample-size", type=int, default=None, help="Downsample total dataset size for rapid testing")
    parser.add_argument("--bert-subset", type=int, default=15000, help="Subset size for BERT fine-tuning (default: 15,000)")
    parser.add_argument("--skip-data", action="store_true", help="Skip dataset preparation if already prepared")
    parser.add_argument("--models", type=str, default="rf,bilstm,bert", help="Comma-separated models: rf, bilstm, bert")
    args = parser.parse_args()

    models_to_run = [m.strip().lower() for m in args.models.split(",")]
    start_total = time.time()
    print("=" * 65)
    print(" 🛡️  PHISHSHIELD AI: ZERO-DAY PHISHING ML EXPERIMENT PIPELINE")
    print("=" * 65)

    # 1. Prepare Data
    if not args.skip_data:
        print("\n>>> STEP 1: PREPARING DATASET & STRATIFIED SPLITS <<<")
        run_preparation(sample_size=args.sample_size)
    else:
        print("\n>>> STEP 1: SKIPPING DATA PREPARATION (Using existing splits) <<<")

    # 2. Train Random Forest
    if "rf" in models_to_run or "random_forest" in models_to_run:
        print("\n>>> STEP 2: TRAINING MODEL 1 - RANDOM FOREST (BASELINE ML) <<<")
        train_rf()

    # 3. Train Bi-LSTM
    if "bilstm" in models_to_run or "bi-lstm" in models_to_run:
        print("\n>>> STEP 3: TRAINING MODEL 2 - BI-LSTM (DEEP LEARNING) <<<")
        train_bilstm(epochs=3, batch_size=64)

    # 4. Train BERT
    if "bert" in models_to_run or "distilbert" in models_to_run:
        print("\n>>> STEP 4: TRAINING MODEL 3 - BERT (TRANSFORMER SOTA) <<<")
        train_bert(epochs=2, batch_size=32, train_subset_limit=args.bert_subset)

    # 5. Comparative Evaluation
    print("\n>>> STEP 5: COMPARATIVE EVALUATION & BENCHMARK SUITE <<<")
    run_comparative_evaluation()

    total_time = time.time() - start_total
    print("\n" + "=" * 65)
    print(f" [DONE] PIPELINE COMPLETE IN {total_time/60:.2f} MINUTES")
    print("=" * 65)

if __name__ == "__main__":
    main()
