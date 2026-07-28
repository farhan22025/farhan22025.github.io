# Python Advanced - file_handling_and_api.py
# Student: Farhan Alam | Data Science

import json
import csv
import os

# ─── File Writing & Reading ───────────────────────────────────────────────────
sample_students = [
    {"id": 1, "name": "Farhan", "cgpa": 3.7, "major": "Data Science"},
    {"id": 2, "name": "Ayesha", "cgpa": 3.9, "major": "AI"},
    {"id": 3, "name": "Bilal",  "cgpa": 3.4, "major": "Software Engineering"},
]

# Write to JSON
with open("students.json", "w") as f:
    json.dump(sample_students, f, indent=4)
print("[JSON] Written students.json successfully.")

# Read it back
with open("students.json", "r") as f:
    loaded = json.load(f)
print(f"[JSON] Read back {len(loaded)} records.")
for s in loaded:
    print(f"  -> {s['name']} | CGPA: {s['cgpa']} | Major: {s['major']}")

# Write to CSV
with open("students.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "name", "cgpa", "major"])
    writer.writeheader()
    writer.writerows(sample_students)
print("\n[CSV] Written students.csv successfully.")

# Read CSV back
print("[CSV] Reading back:")
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(f"  -> {row}")

# ─── Working with Paths ───────────────────────────────────────────────────────
print(f"\nCurrent directory: {os.getcwd()}")
files = [f for f in os.listdir(".") if f.endswith((".json", ".csv"))]
print(f"Generated files found: {files}")
