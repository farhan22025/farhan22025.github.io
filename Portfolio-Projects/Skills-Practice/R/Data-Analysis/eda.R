# R Data Analysis - eda.R
# Student: Farhan Alam | Data Science

# ─── Packages ─────────────────────────────────────────────────────────────────
# install.packages(c("ggplot2","dplyr")) # Uncomment on first run

library(ggplot2)
library(dplyr)

# ─── Mock Dataset ─────────────────────────────────────────────────────────────
set.seed(42)
df <- data.frame(
  student    = paste0("S", 1:50),
  math       = round(rnorm(50, mean=75, sd=12)),
  science    = round(rnorm(50, mean=78, sd=10)),
  attendance = round(runif(50, min=60, max=100)),
  city       = sample(c("Karachi","Lahore","Islamabad"), 50, replace=TRUE)
)

df <- df %>%
  mutate(
    average = round((math + science) / 2, 1),
    grade   = case_when(
      average >= 85 ~ "A",
      average >= 70 ~ "B",
      average >= 55 ~ "C",
      TRUE          ~ "F"
    )
  )

# ─── Summary Stats ────────────────────────────────────────────────────────────
cat("=== Summary Statistics ===\n")
print(summary(df[, c("math","science","average","attendance")]))

cat("\n=== Grade Distribution ===\n")
print(table(df$grade))

cat("\n=== Avg Score by City ===\n")
city_summary <- df %>%
  group_by(city) %>%
  summarise(avg_score = mean(average), count = n()) %>%
  arrange(desc(avg_score))
print(city_summary)

# ─── Correlation ──────────────────────────────────────────────────────────────
cat("\n=== Correlation: Attendance vs Average ===\n")
cat("r =", round(cor(df$attendance, df$average), 3), "\n")
