# R Advanced - linear_regression.R
# Student: Farhan Alam | Data Science

library(ggplot2)

set.seed(7)
n <- 100
df <- data.frame(
  study_hours = round(runif(n, 1, 10), 1),
  attendance  = round(runif(n, 50, 100))
)
# Score is a function of study + attendance + noise
df$score <- 30 + 4.5 * df$study_hours + 0.3 * df$attendance + rnorm(n, 0, 5)
df$score <- round(pmin(df$score, 100), 1)

cat("=== Dataset Preview ===\n")
print(head(df, 6))

# ─── Simple Linear Regression: Score ~ Study Hours ────────────────────────────
model1 <- lm(score ~ study_hours, data=df)
cat("\n=== Model 1: Score ~ Study Hours ===\n")
print(summary(model1))

# ─── Multiple Regression ──────────────────────────────────────────────────────
model2 <- lm(score ~ study_hours + attendance, data=df)
cat("\n=== Model 2: Score ~ Study Hours + Attendance ===\n")
print(summary(model2))

cat(sprintf("\nR² improved from %.3f to %.3f by adding attendance.\n",
            summary(model1)$r.squared,
            summary(model2)$r.squared))

# ─── Residual Diagnostics ─────────────────────────────────────────────────────
cat("\n=== Checking Residuals (first 10) ===\n")
df$predicted  <- predict(model2)
df$residuals  <- df$score - df$predicted
print(head(df[, c("score","predicted","residuals")], 10))
