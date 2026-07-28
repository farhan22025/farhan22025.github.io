# R Visualization - ggplot2_basics.R
# Student: Farhan Alam | Data Science

library(ggplot2)
library(dplyr)

set.seed(42)
df <- data.frame(
  student    = paste0("S", 1:30),
  math       = round(rnorm(30, mean=75, sd=12)),
  science    = round(rnorm(30, mean=78, sd=10)),
  city       = sample(c("Karachi","Lahore","Islamabad"), 30, replace=TRUE),
  grade      = sample(c("A","B","C","F"), 30, replace=TRUE, prob=c(0.3,0.4,0.2,0.1))
)

# ─── Plot 1: Bar Chart of Grade Distribution ──────────────────────────────────
p1 <- ggplot(df, aes(x=grade, fill=grade)) +
  geom_bar() +
  scale_fill_manual(values = c("A"="#2ecc71","B"="#3498db","C"="#f39c12","F"="#e74c3c")) +
  labs(title="Grade Distribution", x="Grade", y="Count") +
  theme_minimal() +
  theme(legend.position="none")

ggsave("grade_distribution.png", p1, width=6, height=4)
cat("Saved: grade_distribution.png\n")

# ─── Plot 2: Scatter – Math vs Science by City ────────────────────────────────
p2 <- ggplot(df, aes(x=math, y=science, color=city)) +
  geom_point(size=3, alpha=0.8) +
  geom_smooth(method="lm", se=FALSE, linetype="dashed") +
  labs(title="Math vs Science Scores", subtitle="Colored by City", x="Math", y="Science") +
  theme_minimal()

ggsave("math_vs_science.png", p2, width=7, height=5)
cat("Saved: math_vs_science.png\n")

# ─── Plot 3: Boxplot per city ─────────────────────────────────────────────────
df$avg <- (df$math + df$science) / 2
p3 <- ggplot(df, aes(x=city, y=avg, fill=city)) +
  geom_boxplot(alpha=0.8) +
  labs(title="Average Score Distribution by City", x="City", y="Average Score") +
  theme_minimal() +
  theme(legend.position="none")

ggsave("boxplot_by_city.png", p3, width=7, height=5)
cat("Saved: boxplot_by_city.png\n")
