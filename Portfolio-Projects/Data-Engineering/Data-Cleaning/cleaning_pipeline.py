# Data Engineering - Data Cleaning
# Student: Farhan Alam | Data Science

import pandas as pd
import numpy as np

np.random.seed(1)

# ─── Generate Messy Dataset ───────────────────────────────────────────────────
n = 100
df = pd.DataFrame({
    'customer_id': range(1, n+1),
    'name':        ['  alice' if i % 10 == 0 else f'Customer_{i}' for i in range(n)],
    'age':         [np.nan if i % 7 == 0 else np.random.randint(18, 65) for i in range(n)],
    'income':      [np.nan if i % 5 == 0 else round(np.random.normal(50000, 15000)) for i in range(n)],
    'city':        np.random.choice(['Karachi', 'Lahore', 'islamabad', 'KARACHI', 'lahore'], n),
    'email':       [f'user{i}@email.com' if i % 8 != 0 else 'invalid-email' for i in range(n)]
})

# Introduce duplicates
df = pd.concat([df, df.sample(5)], ignore_index=True)

print(f"=== Raw Data ===\nShape: {df.shape}")
print(f"Nulls:\n{df.isnull().sum()}")

# ─── Step 1: Remove Duplicates ────────────────────────────────────────────────
df = df.drop_duplicates(subset=['customer_id'])
print(f"\n[1] After removing duplicates: {df.shape[0]} rows")

# ─── Step 2: Handle Missing Values ───────────────────────────────────────────
df['age'].fillna(df['age'].median(), inplace=True)
df['income'].fillna(df['income'].mean(), inplace=True)
df['age'] = df['age'].astype(int)
df['income'] = df['income'].round(0).astype(int)
print(f"[2] Nulls after imputation: {df.isnull().sum().sum()}")

# ─── Step 3: Normalize Text ───────────────────────────────────────────────────
df['name'] = df['name'].str.strip().str.title()
df['city'] = df['city'].str.strip().str.title()
print(f"[3] Unique cities after normalization: {df['city'].unique()}")

# ─── Step 4: Validate Email ───────────────────────────────────────────────────
df['email_valid'] = df['email'].str.contains(r'^[\w\.-]+@[\w\.-]+\.\w{2,}$', regex=True)
invalid_emails = df[~df['email_valid']].shape[0]
print(f"[4] Invalid emails found: {invalid_emails}")

# ─── Step 5: Outlier Detection (IQR) ─────────────────────────────────────────
Q1 = df['income'].quantile(0.25)
Q3 = df['income'].quantile(0.75)
IQR = Q3 - Q1
outliers = df[(df['income'] < Q1 - 1.5*IQR) | (df['income'] > Q3 + 1.5*IQR)]
print(f"[5] Income outliers detected: {len(outliers)}")
df = df[~df.index.isin(outliers.index)]

print(f"\n=== Final Cleaned Dataset ===\nShape: {df.shape}")
print(df[['customer_id','name','age','income','city','email_valid']].head(10).to_string(index=False))
