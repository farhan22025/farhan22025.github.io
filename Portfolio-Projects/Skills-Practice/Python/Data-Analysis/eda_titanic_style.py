# Python Data Analysis - eda_titanic_style.py
# Student: Farhan Alam | Data Science
# Exploratory Data Analysis on a mock passenger survival dataset

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)

# ─── Mock Dataset (Titanic-style) ─────────────────────────────────────────────
n = 150
df = pd.DataFrame({
    'PassengerId': range(1, n+1),
    'Survived':    np.random.choice([0, 1], n, p=[0.62, 0.38]),
    'Pclass':      np.random.choice([1, 2, 3], n, p=[0.25, 0.35, 0.40]),
    'Sex':         np.random.choice(['male', 'female'], n, p=[0.65, 0.35]),
    'Age':         np.random.randint(1, 70, n),
    'Fare':        np.round(np.random.exponential(scale=40, size=n), 2)
})

print("=== Dataset Overview ===")
print(df.head())
print(f"\nShape: {df.shape}")
print(f"\nNull Values:\n{df.isnull().sum()}")

# ─── Survival Rate by Class ───────────────────────────────────────────────────
survival_by_class = df.groupby('Pclass')['Survived'].mean().round(3)
print(f"\n=== Survival Rate by Class ===\n{survival_by_class}")

# ─── Survival Rate by Gender ──────────────────────────────────────────────────
survival_by_sex = df.groupby('Sex')['Survived'].mean().round(3)
print(f"\n=== Survival Rate by Gender ===\n{survival_by_sex}")

# ─── Age Bins ─────────────────────────────────────────────────────────────────
df['AgeGroup'] = pd.cut(df['Age'], bins=[0,12,18,35,60,100],
                         labels=['Child','Teen','Young Adult','Adult','Senior'])
print(f"\n=== Age Group Distribution ===\n{df['AgeGroup'].value_counts().sort_index()}")

# ─── Correlation Matrix ───────────────────────────────────────────────────────
print(f"\n=== Correlation (numeric) ===")
print(df[['Survived','Pclass','Age','Fare']].corr().round(3))
