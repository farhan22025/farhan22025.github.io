# Python Mini-Project - word_frequency_counter.py
# Student: Farhan Alam | Data Science

from collections import Counter
import re

def clean_text(text):
    """Lowercase and remove punctuation."""
    return re.sub(r'[^a-z\s]', '', text.lower())

def word_frequency(text, top_n=10):
    """Returns the top N most common words."""
    cleaned = clean_text(text)
    words = cleaned.split()
    # Remove common stop words
    stop_words = {"the","a","an","is","in","on","and","of","to","it","was","for","that","with","as","at","by"}
    filtered = [w for w in words if w not in stop_words and len(w) > 2]
    counter = Counter(filtered)
    return counter.most_common(top_n)

# ─── Sample text (paragraph about data science) ───────────────────────────────
sample = """
Data science is an interdisciplinary field that uses scientific methods, processes,
algorithms and systems to extract knowledge and insights from structured and
unstructured data. Data science is related to data mining, machine learning and big data.
Machine learning algorithms are trained on large datasets to make predictions.
Data scientists use Python and SQL to analyze and visualize data patterns.
Understanding statistics is critical for any data scientist working with real data.
"""

results = word_frequency(sample, top_n=10)
print("=== Top 10 Most Frequent Words ===")
print(f"{'Word':<20} {'Count'}")
print("-" * 28)
for word, count in results:
    bar = "█" * count
    print(f"{word:<20} {count}  {bar}")
