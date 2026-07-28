# Python Fundamentals - control_flow.py
# Student: Farhan Alam | Data Science

# ─── Conditionals ─────────────────────────────────────────────────────────────
def classify_score(score):
    if score >= 90:
        return "Distinction"
    elif score >= 75:
        return "Merit"
    elif score >= 50:
        return "Pass"
    else:
        return "Fail"

scores = [95, 82, 67, 44, 71]
print("--- Score Classification ---")
for s in scores:
    print(f"  Score {s}: {classify_score(s)}")

# ─── While Loop ───────────────────────────────────────────────────────────────
print("\n--- Fibonacci Sequence (first 10 terms) ---")
a, b = 0, 1
count = 0
while count < 10:
    print(a, end=" ")
    a, b = b, a + b
    count += 1
print()

# ─── List Comprehension ───────────────────────────────────────────────────────
numbers = list(range(1, 21))
evens   = [n for n in numbers if n % 2 == 0]
squares = [n**2 for n in evens]
print(f"\nEven numbers: {evens}")
print(f"Their squares: {squares}")

# ─── Nested Loop example ──────────────────────────────────────────────────────
print("\n--- Multiplication Table (1-3) ---")
for i in range(1, 4):
    row = [f"{i} x {j} = {i*j:2d}" for j in range(1, 6)]
    print("  |  ".join(row))
