# Data Engineering - ETL Pipeline: CSV → Clean → JSON
# Student: Farhan Alam | Data Science

import pandas as pd
import json
import os
from datetime import datetime

# ─── EXTRACT ──────────────────────────────────────────────────────────────────
def extract(filepath):
    """Read raw CSV data."""
    print(f"[EXTRACT] Reading: {filepath}")
    df = pd.read_csv(filepath)
    print(f"  -> Loaded {len(df)} rows, {len(df.columns)} columns")
    return df

# ─── TRANSFORM ────────────────────────────────────────────────────────────────
def transform(df):
    """Clean and enrich the dataset."""
    print(f"\n[TRANSFORM] Starting transformation...")
    original_rows = len(df)

    # 1. Drop duplicates
    df = df.drop_duplicates()

    # 2. Drop rows with any null in key columns
    key_cols = ['name', 'age', 'salary']
    existing_keys = [c for c in key_cols if c in df.columns]
    df = df.dropna(subset=existing_keys)

    # 3. Normalize text columns
    if 'name' in df.columns:
        df['name'] = df['name'].str.strip().str.title()
    if 'department' in df.columns:
        df['department'] = df['department'].str.upper()

    # 4. Feature engineering
    if 'salary' in df.columns:
        df['salary_band'] = pd.cut(
            df['salary'],
            bins=[0, 40000, 70000, 100000, float('inf')],
            labels=['Junior', 'Mid', 'Senior', 'Executive']
        )

    # 5. Add metadata column
    df['etl_processed_at'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    print(f"  -> Rows after cleaning: {len(df)} (removed {original_rows - len(df)} rows)")
    return df

# ─── LOAD ─────────────────────────────────────────────────────────────────────
def load(df, output_path):
    """Write cleaned data to JSON."""
    records = df.to_dict(orient='records')
    with open(output_path, 'w') as f:
        json.dump(records, f, indent=4, default=str)
    print(f"\n[LOAD] Saved {len(records)} records to {output_path}")

# ─── PIPELINE RUNNER ──────────────────────────────────────────────────────────
def run_pipeline(input_csv, output_json):
    print("=" * 50)
    print("      DeepTrace ETL Pipeline Runner       ")
    print("=" * 50)
    raw = extract(input_csv)
    cleaned = transform(raw)
    load(cleaned, output_json)
    print("\n[DONE] ETL Pipeline completed successfully.")
    return cleaned

# ─── Demo: Create mock input and run ──────────────────────────────────────────
if __name__ == "__main__":
    # Generate a mock raw CSV for demo purposes
    mock_data = pd.DataFrame({
        'name':       ['ali khan', 'Ayesha Noor', 'bilal ahmed', 'Ali Khan', None],
        'age':        [25, 30, 22, 25, 28],
        'department': ['hr', 'IT', 'finance', 'hr', 'IT'],
        'salary':     [45000, 85000, 38000, 45000, None]
    })
    mock_data.to_csv("raw_employees.csv", index=False)
    print("Mock CSV created: raw_employees.csv\n")

    result = run_pipeline("raw_employees.csv", "cleaned_employees.json")
    print("\nPreview of cleaned data:")
    print(result[['name', 'department', 'salary', 'salary_band']].to_string(index=False))
