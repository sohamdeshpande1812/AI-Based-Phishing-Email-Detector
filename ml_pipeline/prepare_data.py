"""
Dataset Preprocessing and Stratified Split Pipeline
Zero-Day Phishing Emails Corpus
"""

import os
import shutil
import argparse
import pandas as pd
from sklearn.model_selection import train_test_split

RAW_DATA_DEFAULT_SOURCE = r"C:\Users\Soham Deshpande\Downloads\archive\Zero-Day_Phishing_Emails_Corpus.csv"
DATA_RAW_DIR = os.path.join("data", "raw")
DATA_PROCESSED_DIR = os.path.join("data", "processed")
LOCAL_RAW_PATH = os.path.join(DATA_RAW_DIR, "Zero-Day_Phishing_Emails_Corpus.csv")

def ensure_raw_dataset():
    os.makedirs(DATA_RAW_DIR, exist_ok=True)
    if not os.path.exists(LOCAL_RAW_PATH):
        if os.path.exists(RAW_DATA_DEFAULT_SOURCE):
            print(f"[+] Copying dataset from {RAW_DATA_DEFAULT_SOURCE} to {LOCAL_RAW_PATH}...")
            shutil.copyfile(RAW_DATA_DEFAULT_SOURCE, LOCAL_RAW_PATH)
        else:
            raise FileNotFoundError(
                f"Raw dataset not found at {LOCAL_RAW_PATH} or {RAW_DATA_DEFAULT_SOURCE}. "
                "Please place Zero-Day_Phishing_Emails_Corpus.csv into data/raw/."
            )
    print(f"[+] Raw dataset located at: {LOCAL_RAW_PATH}")

def preprocess_text(subject, body):
    subject = "" if pd.isna(subject) else str(subject).strip()
    body = "" if pd.isna(body) else str(body).strip()
    return f"Subject: {subject}\n\n{body}"

def run_preparation(sample_size=None, random_state=42):
    ensure_raw_dataset()
    os.makedirs(DATA_PROCESSED_DIR, exist_ok=True)
    
    print("[+] Loading raw dataset into memory...")
    df = pd.read_csv(LOCAL_RAW_PATH)
    print(f"    Raw records: {len(df):,}")
    print(f"    Columns: {list(df.columns)}")
    
    # Check nulls
    df['Subject'] = df['Subject'].fillna('')
    df['Body'] = df['Body'].fillna('')
    df['Label'] = df['Label'].astype(int)
    
    # Text composition
    print("[+] Constructing full email representations...")
    df['FullText'] = df.apply(lambda r: preprocess_text(r['Subject'], r['Body']), axis=1)
    
    # Calculate character and word lengths
    df['CharCount'] = df['FullText'].str.len()
    df['WordCount'] = df['FullText'].apply(lambda x: len(x.split()))
    
    if sample_size and sample_size < len(df):
        print(f"[!] Downsampling to {sample_size:,} samples (stratified) for rapid iteration...")
        df, _ = train_test_split(
            df,
            train_size=sample_size,
            stratify=df['Label'],
            random_state=random_state
        )
    
    print(f"\n[+] Total working dataset size: {len(df):,}")
    print(f"    Phishing (1): {(df['Label'] == 1).sum():,} ({(df['Label'] == 1).mean()*100:.2f}%)")
    print(f"    Legitimate (0): {(df['Label'] == 0).sum():,} ({(df['Label'] == 0).mean()*100:.2f}%)")
    
    # 70% Train, 15% Validation, 15% Test
    print("\n[+] Performing stratified Train (70%) / Val (15%) / Test (15%) split...")
    train_df, temp_df = train_test_split(
        df,
        test_size=0.30,
        stratify=df['Label'],
        random_state=random_state
    )
    
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.50,
        stratify=temp_df['Label'],
        random_state=random_state
    )
    
    # Export splits
    train_path = os.path.join(DATA_PROCESSED_DIR, "train.csv")
    val_path = os.path.join(DATA_PROCESSED_DIR, "val.csv")
    test_path = os.path.join(DATA_PROCESSED_DIR, "test.csv")
    
    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)
    test_df.to_csv(test_path, index=False)
    
    print(f"[DONE] Splits successfully generated:")
    print(f"    Train: {len(train_df):,} samples -> {train_path}")
    print(f"    Val:   {len(val_df):,} samples -> {val_path}")
    print(f"    Test:  {len(test_df):,} samples -> {test_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare and split Zero-Day Phishing Emails Corpus")
    parser.add_argument("--sample-size", type=int, default=None, help="Optional downsampling size for quick testing")
    parser.add_argument("--seed", type=int, default=42, help="Random seed")
    args = parser.parse_args()
    
    run_preparation(sample_size=args.sample_size, random_state=args.seed)
