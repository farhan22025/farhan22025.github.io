# Python Data Analysis - pandas_basics.py
# Student: Farhan Alam | Data Science

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# ─── Create a Sample Dataset ──────────────────────────────────────────────────
data = {
    'Student':     ['Ali', 'Ayesha', 'Bilal', 'Fatima', 'Usman', 'Sana', 'Hamza', 'Zara'],
    'Math':        [85, 92, 78, 88, 95, 60, 73, 81],
    'Science':     [80, 89, 75, 91, 88, 65, 77, 84],
    'English':     [74, 85, 90, 79, 83, 71, 68, 92],
    'Attendance%': [90, 95, 80, 98, 85, 72, 88, 96]
}

df = pd.DataFrame(data)

# ─── Basic Exploration ────────────────────────────────────────────────────────
print("=== Dataset Head ===")
print(df.head())

print("\n=== Data Info ===")
print(df.dtypes)

print("\n=== Descriptive Statistics ===")
print(df.describe().round(2))

# ─── Feature Engineering ──────────────────────────────────────────────────────
df['Average'] = df[['Math', 'Science', 'English']].mean(axis=1).round(2)
df['Grade'] = pd.cut(
    df['Average'],
    bins=[0, 59, 74, 84, 100],
    labels=['F', 'C', 'B', 'A']
)

print("\n=== With Average and Grade ===")
print(df[['Student', 'Average', 'Grade']])

# ─── Grouping ─────────────────────────────────────────────────────────────────
print("\n=== Grade Distribution ===")
print(df['Grade'].value_counts())

# ─── Filtering ────────────────────────────────────────────────────────────────
top_students = df[df['Average'] >= 85]
print(f"\n=== Top Students (avg >= 85) ===")
print(top_students[['Student', 'Average']])

# ─── Simple Bar Chart ─────────────────────────────────────────────────────────
plt.figure(figsize=(10, 5))
plt.bar(df['Student'], df['Average'], color='steelblue', edgecolor='navy', alpha=0.8)
plt.axhline(y=df['Average'].mean(), color='red', linestyle='--', label=f"Class Avg ({df['Average'].mean():.1f})")
plt.title('Student Average Scores', fontsize=14)
plt.xlabel('Student')
plt.ylabel('Average Score')
plt.legend()
plt.tight_layout()
plt.savefig('student_averages.png', dpi=100)
print("\nPlot saved as student_averages.png")
