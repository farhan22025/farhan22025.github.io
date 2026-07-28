-- MySQL Advanced - window_functions_and_ctes.sql
-- Student: Farhan Alam | Data Science

USE farhan_practice;

-- ─── 1. RANK customers by total spending (Window Function) ───────────────────
SELECT
    c.name,
    SUM(o.quantity * p.price)   AS total_spent,
    RANK() OVER (ORDER BY SUM(o.quantity * p.price) DESC) AS spending_rank,
    DENSE_RANK() OVER (ORDER BY SUM(o.quantity * p.price) DESC) AS dense_rank
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
JOIN products p ON o.product_id = p.product_id
GROUP BY c.customer_id, c.name;

-- ─── 2. Running total of revenue over time (Cumulative SUM) ──────────────────
SELECT
    o.order_date,
    SUM(o.quantity * p.price)   AS daily_revenue,
    SUM(SUM(o.quantity * p.price)) OVER (ORDER BY o.order_date) AS cumulative_revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
GROUP BY o.order_date
ORDER BY o.order_date;

-- ─── 3. CTE: Top spenders in each city ───────────────────────────────────────
WITH CustomerSpend AS (
    SELECT
        c.customer_id,
        c.name,
        c.city,
        SUM(o.quantity * p.price) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN products p ON o.product_id = p.product_id
    GROUP BY c.customer_id, c.name, c.city
),
RankedByCity AS (
    SELECT *,
        RANK() OVER (PARTITION BY city ORDER BY total_spent DESC) AS city_rank
    FROM CustomerSpend
)
SELECT name, city, total_spent
FROM RankedByCity
WHERE city_rank = 1;

-- ─── 4. LAG: Month-over-Month revenue change ─────────────────────────────────
WITH MonthlyRevenue AS (
    SELECT
        DATE_FORMAT(o.order_date, '%Y-%m') AS month,
        SUM(o.quantity * p.price)          AS revenue
    FROM orders o
    JOIN products p ON o.product_id = p.product_id
    GROUP BY month
)
SELECT
    month,
    revenue,
    LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue,
    ROUND(revenue - LAG(revenue,1) OVER (ORDER BY month), 2) AS change
FROM MonthlyRevenue
ORDER BY month;
