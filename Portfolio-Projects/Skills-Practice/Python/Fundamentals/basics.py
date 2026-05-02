# Python Fundamentals - basics.py
# Student: Farhan Alam | Data Science

# ─── Variables & Data Types ───────────────────────────────────────────────────
name = "Farhan"
age = 21
gpa = 3.7
is_enrolled = True

print(f"Name: {name} | Age: {age} | GPA: {gpa} | Enrolled: {is_enrolled}")
print(f"Type of gpa: {type(gpa)}")

# ─── String Operations ────────────────────────────────────────────────────────
sentence = "data science is really cool"
print(sentence.title())           # Title case
print(sentence.replace("cool", "amazing"))
print(f"Word count: {len(sentence.split())}")

# ─── Lists & Loops ────────────────────────────────────────────────────────────
courses = ["Intro to ML", "Statistics", "Linear Algebra", "Python for DS"]
print("\n--- My Courses ---")
for i, course in enumerate(courses, start=1):
    print(f"  {i}. {course}")

courses.append("Database Systems")
print(f"After adding a course, total: {len(courses)}")

# ─── Dictionary ───────────────────────────────────────────────────────────────
student = {
    "name": "Farhan",
    "batch": "DS-39",
    "cgpa": 3.7,
    "skills": ["Python", "SQL", "Machine Learning"]
}
print("\n--- Student Record ---")
for key, value in student.items():
    print(f"  {key}: {value}")

# ─── Functions ────────────────────────────────────────────────────────────────
def grade_lookup(cgpa):
    """Returns letter grade based on CGPA."""
    if cgpa >= 3.7:   return "A"
    elif cgpa >= 3.0: return "B"
    elif cgpa >= 2.3: return "C"
    else:             return "F"

print(f"\nGrade for CGPA {student['cgpa']}: {grade_lookup(student['cgpa'])}")

# ─── Error Handling ───────────────────────────────────────────────────────────
def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return "Cannot divide by zero!"

print(f"\n10 / 2 = {safe_divide(10, 2)}")
print(f"10 / 0 = {safe_divide(10, 0)}")
