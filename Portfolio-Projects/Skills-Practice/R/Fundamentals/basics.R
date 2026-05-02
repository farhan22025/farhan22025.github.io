# R Fundamentals - basics.R
# Student: Farhan Alam | Data Science

# ─── Variables & Data Types ───────────────────────────────────────────────────
name <- "Farhan"
age  <- 21
gpa  <- 3.7

cat("Name:", name, "| Age:", age, "| GPA:", gpa, "\n")
cat("Class of gpa:", class(gpa), "\n")

# ─── Vectors ──────────────────────────────────────────────────────────────────
scores <- c(85, 92, 78, 88, 95, 60, 73)
cat("\nScores:", scores)
cat("\nMean:", mean(scores))
cat("\nMedian:", median(scores))
cat("\nSD:", round(sd(scores), 2), "\n")

# ─── Logical Filtering ────────────────────────────────────────────────────────
passing <- scores[scores >= 75]
cat("\nPassing scores:", passing, "\n")

# ─── Data Frame ───────────────────────────────────────────────────────────────
students <- data.frame(
  name    = c("Ali", "Ayesha", "Bilal", "Fatima"),
  math    = c(85, 92, 78, 88),
  science = c(80, 89, 75, 91)
)

students$average <- rowMeans(students[, c("math", "science")])
students$grade   <- ifelse(students$average >= 85, "A", ifelse(students$average >= 75, "B", "C"))

cat("\n--- Student Results ---\n")
print(students)

# ─── Simple Summary ───────────────────────────────────────────────────────────
cat("\n--- Summary ---\n")
print(summary(students[, c("math", "science", "average")]))
